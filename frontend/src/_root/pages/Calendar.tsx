import { useCallback, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ReactMapGl, { Marker } from "react-map-gl";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import allLocales from "@fullcalendar/core/locales-all";
import { useUserContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { provinces } from "@/lib/provinces";
import toast from "react-hot-toast";
import timeGridPlugin from "@fullcalendar/timegrid";
import {
  Dialog,
  DialogTrigger,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { DateSelectArg, EventApi, EventClickArg, EventInput } from "@fullcalendar/core/index.js";
import rrulePlugin from "@fullcalendar/rrule";
import CalendarForm from "@/components/forms/CalendarForm";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGFkZXkiLCJhIjoiY2xyOWhjcW45MDFkZjJtbGRhM2toN2k4ZiJ9.STlq7rzxQrBIiH4BbrEvoA";

interface IEvent {
  id: string;
  title: string;
  details: string;
  municipality: string;
  repeat: string;
  rrule: {
    freq: string;
    dtstart: string;
  };
  startDate: string;
  endDate: string;
  provinceId: string;
  location: { type: string; coordinates: [number, number] };
}

interface ICalendar {
  name: string;
  calendars: IEvent[];
}

const Calendar = () => {
  const { user } = useUserContext();
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState("Bataan");
  const [calendarDetails, setCalendarDetails] = useState<IEvent>();
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [calendar, setCalendar] = useState<ICalendar>();
  const [openModalDetails, setOpenModalDetails] = useState(false);

  const handleDateSelect = useCallback(
    (selectInfo: DateSelectArg) => {
      const selectedDateValue = selectInfo.start.toString();
      console.log(selectedDateValue);
      setOpenModal(user.role === "USER" ? false : true);
    },
    [user.role]
  );

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
    [calendarDetails]
  );

  useEffect(() => {
    const fetchCalendar = async () => {
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
              repeat: event.repeat,
              startDate: new Date(event.startDate).toISOString().replace(/T.*$/, ""),
              endDate: new Date(event.endDate).toISOString().replace(/T.*$/, ""),
            }))
          );
        } else {
          console.log("NO DATA");
        }
      } catch (error) {
        toast.error(`Error fetching calendar: ${error}`);
      }
    };

    fetchCalendar();
  }, [selectedProvince]);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedProvince(event.target.value as string);
  };

  const getEventColor = (repeat: string): string => {
    switch (repeat) {
      case "once":
        return "blue";
      case "weekly":
        return "green";
      case "monthly":
        return "orange";
      case "yearly":
        return "purple";
      default:
        return "gray";
    }
  };

  const INITIAL_EVENTS: EventInput[] =
    calendar?.calendars.map((event: IEvent) => {
      const eventInput: EventInput = {
        id: event.id,
        title: event.title,
        start: new Date(event.startDate).toISOString().replace(/T.*$/, ""),
        end: new Date(event.endDate).toISOString().replace(/T.*$/, ""),
        color: getEventColor(event.repeat),
      };

      if (event.repeat !== "once") {
        eventInput.rrule = {
          dtstart: new Date(event.startDate).toISOString().replace(/T.*$/, ""),
          // until: new Date(event.endDate).toISOString().replace(/T.*$/, ""),
          freq: event.repeat,
        };
      }

      return eventInput;
    }) || [];

  const formatDateToWord = (dateString: string | undefined): string => {
    const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="calendar_details-container">
      <div className="w-full h-full flex lg:flex-row xs:flex-row">
        <div className="w-[300px] pb-12 pt-8 pl-5 border-r-2 border-gray pr-3 bg-red-50">
          <FormControl fullWidth>
            <InputLabel id="label">Province</InputLabel>
            <Select
              labelId="label"
              id="select"
              value={selectedProvince}
              label="Province"
              onChange={handleChange}
            >
              {provinces.map((province) => (
                <MenuItem value={province.value}>{province.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="xs:hidden lg:flex w-full my-5">Add Event</Button>
            </DialogTrigger>
            <DialogContent className="w-full bg-white ">
              <DialogHeader>
                <DialogTitle>Add event</DialogTitle>
                <DialogDescription>
                  Input information for the event you want to add
                </DialogDescription>
              </DialogHeader>{" "}
              <CalendarForm province={selectedProvince} />
            </DialogContent>
          </Dialog>

          <div className="max-h-full overflow-auto border border-t-black border-red-50 ">
            <h2 className="font-bold text-xl mb-5 text-center">Events List</h2>
            <ul>
              {currentEvents.map((event) => (
                <li key={event.id}>
                  <strong>• {formatDateToWord(event.startDate)}</strong> - {event.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Dialog open={openModalDetails} onOpenChange={setOpenModalDetails}>
          <DialogContent className="sm:max-w-[1024px] h-3/4 bg-white border-2 border-slate-500 ">
            <DialogHeader>
              <DialogTitle className="text-2xl text-center">Event Details</DialogTitle>
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
                    {calendarDetails?.endDate != "1970-01-01"
                      ? formatDateToWord(calendarDetails?.startDate)
                      : `${formatDateToWord(calendarDetails?.startDate)} to ${formatDateToWord(
                          calendarDetails?.endDate
                        )}`}
                  </Label>
                </div>
                <div className="flex">
                  <Label className="mr-5 font-extrabold text-lg">Event Location: </Label>
                  <Label className="text-lg font-regular">
                    In {calendarDetails?.municipality}, {calendarDetails?.provinceId}
                  </Label>
                </div>
                <div className="flex flex-col gap-1">
                  {/* <Button
                    className={`bg-red-500 ${user.role === "ADMIN" ? "" : "hidden"}`}
                    onClick={handleDeleteClick}
                  >
                    Delete
                  </Button> */}
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
        <div className="w-full p-5 py-10 bg-blue-200">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
            initialView="dayGridMonth"
            selectable={
              user.role === "ADMIN" &&
              user.province?.toLowerCase() === selectedProvince.toLowerCase()
            }
            editable={
              user.role === "ADMIN" &&
              user.province?.toLowerCase() === selectedProvince.toLowerCase()
            }
            locales={allLocales}
            locale="en"
            events={INITIAL_EVENTS}
            select={handleDateSelect}
            eventClick={handleEventClick}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            contentHeight={600}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
