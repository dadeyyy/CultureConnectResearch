import { useCallback, useEffect, useState } from "react";
import FullCalendar, {
  DateSelectArg,
  EventApi,
  EventClickArg,
} from "@fullcalendar/react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

const FormSchema = z.object({
  province: z.string({
    required_error: "Please select a province.",
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

interface ICalendar {
  id: number;
  title: string;
  details: string;
  date: string;
  provinceId: string;
}

const Calendar = () => {
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const handleEvents = useCallback(
    (events: EventApi[]) => setCurrentEvents(events),
    []
  );
  const { user, checkAuthUser } = useUserContext();
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [value, setValue] = useState("");
  const [calendar, setCalendar] = useState<ICalendar | null>(null);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      province: "",
      title: "",
      details: "",
      date: "",
    },
  });

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
    // Add this line to log the date
    setOpenModal(user.role === "USER" ? false : true);
  }, []);

  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    if (
      window.confirm(
        `Do you want to delete the event "${clickInfo.event.title}"?`
      )
    ) {
      clickInfo.event.remove();
    }
  }, []);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const selectedDateToDate = new Date(selectedDate).toISOString();

    const formData = {
      title: data.title,
      details: data.details,
      provinceId: data.province,
      date: selectedDateToDate,
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

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.log("SKDJFHKSDHJF");
      }
    } catch (error) {
      console.log(error);
    }
  }
  console.log(selectedProvince);
  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/province/${selectedProvince}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          // Handle non-success status codes
          console.error("Error fetching calendar. Status:", response.status);
          return;
        }

        const data = await response.json();
        console.log(data);
        setCalendar(data);
      } catch (error) {
        console.error("Error fetching calendar:", error);
        throw error;
      }
    };
    fetchCalendar();
  }, [selectedProvince]);

  const INITIAL_EVENTS: EventInput[] = [
    {
      id: calendar?.id,
      title: calendar?.title,
      details: calendar?.details,
      date: calendar?.date,
    },
  ];

  return (
    <div className="post_details-container">
      <div className="w-full h-full">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-[200px] justify-between",
                !value && "text-muted-foreground"
              )}
            >
              {value
                ? provinces.find((province) => province.value === value)?.label
                : "Select province"}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search province..." className="h-9" />
              <CommandEmpty>No province found.</CommandEmpty>
              <CommandGroup>
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

        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogContent className="sm:max-w-[425px]">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <DialogHeader>
                  <DialogTitle>Add Event</DialogTitle>
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
                        <Input
                          {...field}
                          type="text"
                          readOnly
                          value={selectedDate?.toString()}
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
        </Dialog>

        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable={user.role === "USER" ? false : true}
          editable={user.role === "USER" ? false : true}
          initialEvents={INITIAL_EVENTS}
          locales={allLocales}
          locale="en"
          eventsSet={handleEvents}
          select={handleDateSelect}
          eventClick={handleEventClick}
        />
      </div>
    </div>
  );
};

export default Calendar;
