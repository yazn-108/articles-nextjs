"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const Calendar = ({ name, date }: { name: string; date?: Date }) => {
  const [startDate, setStartDate] = useState<Date>(date ?? new Date());
  return (
    <div>
      <DatePicker
        selected={startDate}
        onChange={(date: Date | null) => setStartDate(date ?? new Date())}
        dateFormat="dd/MM/yyyy"
        className="border-[#55b0e9] border-2 rounded-md w-full px-2 py-0.5 outline-none focus:ring-2 focus:ring-primary"
      />
      <input
        type="hidden"
        name={name}
        value={startDate.toISOString()}
        readOnly
      />
    </div>
  );
};
export default Calendar;
