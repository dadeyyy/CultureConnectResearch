import React, { useState, useEffect, useReducer, useMemo } from "react";
import GlobalContext from "./GlobalContext";
import dayjs from "dayjs";

interface Event {
  id: string;
  label: string;
}

interface Label {
  label: string;
  checked: boolean;
}

type ActionType =
  | { type: "push"; payload: Event }
  | { type: "update"; payload: Event }
  | { type: "delete"; payload: Event };

function savedEventsReducer(state: Event[], action: ActionType): Event[] {
  switch (action.type) {
    case "push":
      return [...state, action.payload];
    case "update":
      return state.map((evt) => (evt.id === action.payload.id ? action.payload : evt));
    case "delete":
      return state.filter((evt) => evt.id !== action.payload.id);
    default:
      throw new Error();
  }
}

function initEvents(): Event[] {
  const storageEvents = localStorage.getItem("savedEvents");
  const parsedEvents = storageEvents ? JSON.parse(storageEvents) : [];
  return parsedEvents;
}

export default function ContextWrapper(props: { children: React.ReactNode }) {
  const [monthIndex, setMonthIndex] = useState<number>(dayjs().month());
  const [smallCalendarMonth, setSmallCalendarMonth] = useState<number | null>(null);
  const [daySelected, setDaySelected] = useState<dayjs.Dayjs>(dayjs());
  const [showEventModal, setShowEventModal] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [labels, setLabels] = useState<Label[]>([]);
  const [savedEvents, dispatchCalEvent] = useReducer(savedEventsReducer, [], initEvents);

  const filteredEvents = useMemo(() => {
    return savedEvents.filter((evt) =>
      labels
        .filter((lbl) => lbl.checked)
        .map((lbl) => lbl.label)
        .includes(evt.label)
    );
  }, [savedEvents, labels]);

  useEffect(() => {
    localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
  }, [savedEvents]);

  useEffect(() => {
    setLabels((prevLabels) => {
      return [...new Set(savedEvents.map((evt) => evt.label))].map((label) => {
        const currentLabel = prevLabels.find((lbl) => lbl.label === label);
        return {
          label,
          checked: currentLabel ? currentLabel.checked : true,
        };
      });
    });
  }, [savedEvents]);

  useEffect(() => {
    if (smallCalendarMonth !== null) {
      setMonthIndex(smallCalendarMonth);
    }
  }, [smallCalendarMonth]);

  useEffect(() => {
    if (!showEventModal) {
      setSelectedEvent(null);
    }
  }, [showEventModal]);

  function updateLabel(label: Label) {
    setLabels(labels.map((lbl) => (lbl.label === label.label ? label : lbl)));
  }

  return (
    <GlobalContext.Provider
      value={{
        monthIndex,
        setMonthIndex,
        smallCalendarMonth,
        setSmallCalendarMonth,
        daySelected,
        setDaySelected,
        showEventModal,
        setShowEventModal,
        dispatchCalEvent,
        selectedEvent,
        setSelectedEvent,
        savedEvents,
        setLabels,
        labels,
        updateLabel,
        filteredEvents,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}
