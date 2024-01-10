import { useContext, useState, useEffect } from "react";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import Sidebar from "@/components/calendar/Sidebar";
import Month from "@/components/calendar/Month";
import GlobalContext from "@/context/calendar/GlobalContext";
import dayjs from "dayjs";
import { getMonth } from "@/lib/utils";
import EventModal from "@/components/calendar/EventModal";

const Calendar = () => {
  const [currenMonth, setCurrentMonth] = useState(getMonth());
  const { monthIndex, showEventModal } = useContext(GlobalContext);

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  return (
    <>
      {showEventModal && <EventModal />}
      <div className="h-screen w-full flex flex-col">
        <CalendarHeader />
        <div className="flex flex-1">
          <Sidebar />
          <Month month={currenMonth} />
        </div>
      </div>
    </>
  );
};

export default Calendar;
