import React, { createContext, Dispatch, SetStateAction } from "react";

interface GlobalContextProps {
  monthIndex: number;
  setMonthIndex: Dispatch<SetStateAction<number>>;
  smallCalendarMonth: number;
  setSmallCalendarMonth: Dispatch<SetStateAction<number>>;
  daySelected: any;
  setDaySelected: Dispatch<SetStateAction<any>>;
  showEventModal: boolean;
  setShowEventModal: Dispatch<SetStateAction<boolean>>;
  dispatchCalEvent: Dispatch<ActionType>;
  selectedEvent: any;
  setSelectedEvent: Dispatch<SetStateAction<any>>;
  setLabels: Dispatch<SetStateAction<any[]>>;
  labels: any[];
  updateLabel: Dispatch<SetStateAction<any>>;
  filteredEvents: any[];
}

type ActionType =
  | { type: "push"; payload: any }
  | { type: "update"; payload: any }
  | { type: "delete"; payload: any };

const GlobalContext = createContext<GlobalContextProps>({
  monthIndex: 0,
  setMonthIndex: () => {},
  smallCalendarMonth: 0,
  setSmallCalendarMonth: () => {},
  daySelected: null,
  setDaySelected: () => {},
  showEventModal: false,
  setShowEventModal: () => {},
  dispatchCalEvent: () => {},
  selectedEvent: null,
  setSelectedEvent: () => {},
  setLabels: () => {},
  labels: [],
  updateLabel: () => {},
  filteredEvents: [],
});

export default GlobalContext;
