"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const Calendar = ({ name, date }: { name: string; date?: Date }) => {
  const [startDate, setStartDate] = useState<Date | null>(date ?? new Date());
  return (
    <DatePicker
      name={name}
      dateFormat={"dd/MM/yyyy"}
      selected={startDate}
      onChange={(date: Date | null) => setStartDate(date)}
      className="border-[#55b0e9] border-2 rounded-md w-full px-2 py-0.5 outline-none focus:ring-2 focus:ring-primary"
    />
  );
};
export default Calendar;
