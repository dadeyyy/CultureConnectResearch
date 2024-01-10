import { EventInput } from "@fullcalendar/react";

let eventGuid = 0;
const todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today
export const createEventId = () => String(eventGuid++);
export const INITIAL_EVENTS: EventInput[] = [
  {
    id: createEventId(),
    title: "All-day event",
    details: "hey hey hey",
    date: "2024-01-13",
  },
  {
    id: createEventId(),
    title: "Timed event",
    date: todayStr + "T12:00:00",
  },
];
