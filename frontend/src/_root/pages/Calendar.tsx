import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ReactMapGl, { Marker } from "react-map-gl";
import FullCalendar, { DateSelectArg, EventApi, EventClickArg } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import allLocales from "@fullcalendar/core/locales-all";
import { useUserContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { EventInput } from "@fullcalendar/react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { provinces } from "@/lib/provinces";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { DialogTrigger } from "@radix-ui/react-dialog";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGFkZXkiLCJhIjoiY2xyOWhjcW45MDFkZjJtbGRhM2toN2k4ZiJ9.STlq7rzxQrBIiH4BbrEvoA";

const FormSchema = z.object({
  province: z.string({
    required_error: "Please select a province.",
  }),
  municipality: z.string({
    required_error: "Please enter a municipality",
  }),
  title: z.string({
    required_error: "Please enter a title.",
  }),
  details: z.string({
    required_error: "Please enter details.",
  }),
  date: z.string({
    required_error: "Please select a date.",
  }),
});

interface IEvent {
  id: number;
  title: string;
  details: string;
  municipality: string;
  date: string;
  provinceId: string;
  location: { type: string; coordinates: [number, number] };
}

interface ICalendar {
  name: string;
  calendars: IEvent[];
}

const Calendar = () => {
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const handleEvents = useCallback((events: EventApi[]) => setCurrentEvents(events), []);
  const { user, checkAuthUser } = useUserContext();
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [value, setValue] = useState("");
  const [calendarDetails, setCalendarDetails] = useState<IEvent>();
  const [calendar, setCalendar] = useState<ICalendar>();
  const [openModalDetails, setOpenModalDetails] = useState();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      province: "",
      title: "",
      details: "",
      date: "",
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!user.id) {
        await checkAuthUser();
      }
    };
    fetchData();
  }, [checkAuthUser, user.id]);

  const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
    const selectedDateValue = selectInfo.start.toString();
    console.log(selectedDateValue);
    setSelectedDate(selectedDateValue);
    setOpenModal(user.role === "USER" ? false : true);
  }, []);

  const handleEventClick = useCallback(
    async (clickInfo: EventClickArg) => {
      try {
        // Fetch additional event details using the event ID from the API
        const response = await fetch(`http://localhost:8000/get-event/${clickInfo.event.id}`, {
          credentials: "include",
        });

        if (!response.ok) {
          toast.error("Error fetching event details");
          return;
        }

        const eventData = await response.json();
        setCalendarDetails(eventData);
        setOpenModalDetails(true);
      } catch (error) {
        toast.error(`Error fetching event details: ${error}`);
      }
    },
    [form]
  );

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setOpen(false);
    const selectedDateToDate = new Date(selectedDate).toISOString();

    const formData = {
      title: data.title,
      details: data.details,
      provinceId: data.province,
      date: selectedDateToDate,
      municipality: data.municipality,
    };
    try {
      const response = await fetch("http://localhost:8000/create-calendar", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setOpenModal(false);
        toast.success("Event created!");
      } else {
        toast.error("Can't create an event");
      }
    } catch (error) {
      toast.error(`Error creating an event Error message ${error}`);
    }
  }

  const handleDeleteClick = async () => {
    try {
      const response = await fetch(`http://localhost:8000/delete-calendar/${calendarDetails.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        window.location.reload();
        toast.success(data.message);

        return;
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete calendar");
    }
  };

  console.log(selectedProvince);
  useEffect(() => {
    const fetchCalendar = async () => {
      if (!selectedProvince) {
        console.log("Please select a province");
        return;
      }
      try {
        if (!selectedProvince) {
          console.log("Please select a province");
          return;
        }

        const response = await fetch(`http://localhost:8000/province/${selectedProvince}`, {
          credentials: "include",
        });

        if (!response.ok) {
          toast.error("Error fetching calendar");
          return;
        }

        const data = await response.json();
        if (data) {
          setCalendar(data);
          setCurrentEvents(
            data.calendars.map((event: IEvent) => ({
              id: event.id,
              title: event.title,
              details: event.details,
              municipality: event.municipality,
              location: event.location,
              date: new Date(event.date).toISOString().replace(/T.*$/, ""),
            }))
          );
        } else {
          console.log("NO DATAAAA");
        }
      } catch (error) {
        toast.error(`Error fetching calendar ${error}`);
        throw error;
      }
    };
    fetchCalendar();
  }, [selectedProvince]);

  const INITIAL_EVENTS: EventInput[] =
    calendar?.calendars.map((event: IEvent) => ({
      id: event.id,
      title: event.title,
      details: event.details,
      event: event.municipality,
      date: format(new Date(event.date), "yyyy-MM-dd"),
    })) || [];

  const formatDateToWord = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="calendar_details-container">
      <div className="w-full h-full flex">
        <div className="w-[300px] py-12 pl-5 border-r-2 border-gray pr-3">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-[225px] justify-between flex align-items-center mb-5",
                  selectedProvince && "text-muted-foreground"
                )}
              >
                {selectedProvince
                  ? provinces.find((province) => province.value === selectedProvince)?.label
                  : "Select province"}
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command className="bg-white">
                <CommandInput placeholder="Search province..." className="h-9 bg-white" />
                <CommandEmpty>No province found.</CommandEmpty>
                <CommandGroup className="h-96 overflow-y-scroll bg-white">
                  {provinces.map((province) => (
                    <CommandItem
                      value={province.label}
                      key={province.value}
                      onSelect={() => {
                        form.setValue("province", province.value);
                        setSelectedProvince(province.value);
                      }}
                    >
                      {province.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          province.value === value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="max-h-full overflow-auto ">
            <h2 className="font-bold text-xl mb-5 text-center">Events List</h2>
            <ul>
              {currentEvents.map((event) => (
                <li key={event.id}>
                  <strong>• {formatDateToWord(event.date)}</strong> - {event.title}
                  {/* <p>{event.details}</p> */}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <DialogHeader>
                  <DialogTitle>Add event</DialogTitle>
                  <DialogDescription>Enter event details below:</DialogDescription>
                </DialogHeader>
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Province</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          readOnly
                          value={selectedProvince?.toString()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="municipality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Municipality</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter Municipality"
                          className="col-span-3"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter Title"
                          className="col-span-3"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Details</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter Details"
                          className="col-span-3"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" readOnly value={selectedDate?.toString()} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Dialog open={openModalDetails} onOpenChange={setOpenModalDetails}>
          <DialogContent className="sm:max-w-[1024px] h-3/4 bg-white border-4 border border-slate-500 ">
            <DialogHeader>
              <DialogTitle className="text-2xl mx-10">Event Details</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 ">
              <div className="flex flex-col gap-5">
                <div className="flex">
                  <Label className="mr-5 font-extrabold text-lg">Event Title: </Label>
                  <Label className="text-lg font-regular">{calendarDetails?.title}</Label>
                </div>
                <div className="flex">
                  <Label className="mr-5 font-extrabold text-lg">Event Details: </Label>
                  <Label className="text-lg font-regular max-h-56 overflow-auto">
                    {calendarDetails?.details}
                  </Label>
                </div>
                <div className="flex">
                  <Label className="mr-5 font-extrabold text-lg">Event Date: </Label>
                  <Label className="text-lg font-regular">
                    {formatDateToWord(calendarDetails?.date)}
                  </Label>
                </div>
                <div className="flex">
                  <Label className="mr-5 font-extrabold text-lg">Event Location: </Label>
                  <Label className="text-lg font-regular">
                    In {calendarDetails?.municipality}, {calendarDetails?.provinceId}
                  </Label>
                </div>
                <div className="flex flex-col gap-1">
                  {/* <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className={`bg-blue-200 ${
                          user.role === 'ADMIN' ? '' : 'hidden'
                        }`}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white">
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onEdit)}
                          className="space-y-6"
                        >
                          <DialogHeader>
                            <DialogTitle>Update event</DialogTitle>
                            <DialogDescription>
                              Enter event details below:
                            </DialogDescription>
                          </DialogHeader>
                          <FormField
                            control={form.control}
                            name="province"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Province</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="text"
                                    readOnly
                                    value={selectedProvince?.toString()}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="municipality"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Municipality</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="text"
                                    placeholder="Enter Municipality"
                                    className="col-span-3"
                                    value={form.getValues('municipality') || calendarDetails?.municipality || '' }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="text"
                                    placeholder="Enter Title"
                                    className="col-span-3"
                                    value={form.getValues('title') || calendarDetails?.title || '' }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="details"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Details</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="text"
                                    placeholder="Enter Details"
                                    className="col-span-3"
                                    value={form.getValues('details') || calendarDetails?.details || '' }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="text"
                                    readOnly
                                    value={calendarDetails?.date}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <DialogFooter>
                            <Button type="submit">Save changes</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog> */}
                  <Button
                    className={`bg-red-500 ${user.role === "ADMIN" ? "" : "hidden"}`}
                    onClick={handleDeleteClick}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <div className="flex flex-col pl-3">
                <Label className="mr-5 font-bold text-lg">Map: </Label>
                <ReactMapGl
                  mapLib={import("mapbox-gl")}
                  initialViewState={{
                    longitude: calendarDetails?.location.coordinates[0],
                    latitude: calendarDetails?.location.coordinates[1],
                    zoom: 12,
                  }}
                  style={{ width: 450, height: 400 }}
                  mapStyle="mapbox://styles/mapbox/streets-v9"
                >
                  <Marker
                    latitude={calendarDetails?.location.coordinates[1] || 0}
                    longitude={calendarDetails?.location.coordinates[0] || 0}
                  />
                </ReactMapGl>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <div className="w-full p-5 py-10">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            selectable={user.role === "USER" ? false : true}
            editable={user.role === "USER" ? false : true}
            locales={allLocales}
            locale="en"
            events={INITIAL_EVENTS}
            select={handleDateSelect}
            eventClick={handleEventClick}
            headerToolbar={{
              right: "prev,next",
            }}
            height={675}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
