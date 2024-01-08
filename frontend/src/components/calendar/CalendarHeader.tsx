import dayjs from "dayjs";
import React, { useContext } from "react";
import GlobalContext from "@/context/calendar/GlobalContext";

interface CalendarHeaderProps {}

const CalendarHeader: React.FC<CalendarHeaderProps> = () => {
  const { monthIndex, setMonthIndex } = useContext(GlobalContext);

  function handlePrevMonth(): void {
    setMonthIndex(monthIndex - 1);
  }

  function handleNextMonth(): void {
    setMonthIndex(monthIndex + 1);
  }

  function handleReset(): void {
    setMonthIndex(monthIndex === dayjs().month() ? monthIndex + Math.random() : dayjs().month());
  }

  return (
    <header className="px-4 py-2 flex items-center">
      <img src={"/assets/icons/calendar-calendar.svg"} alt="calendar" className="mr-2 w-12 h-12" />
      <h1 className="mr-10 text-xl text-gray-500 fond-bold">Calendar</h1>
      <button onClick={handleReset} className="border rounded py-2 px-4 mr-5">
        Today
      </button>
      <button onClick={handlePrevMonth}>
        <img src="assets/icons/calendar-back.svg" width={20} height={20} />
      </button>
      <button onClick={handleNextMonth}>
        <img src="assets/icons/calendar-next.svg" width={20} height={20} />
      </button>
      <h2 className="ml-4 text-xl text-gray-500 font-bold">
        {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
      </h2>
    </header>
  );
};

export default CalendarHeader;
