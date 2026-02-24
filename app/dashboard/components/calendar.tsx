"use client";

import * as React from "react";
import { DayPicker, type DayButtonProps } from "react-day-picker";
import "react-day-picker/dist/style.css";

type CalendarProps = React.ComponentProps<typeof DayPicker>;

export default function Calendar(props: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays
      className="custom-calendar"
      components={{
        DayButton: CustomDayButton,
      }}
      {...props}
    />
  );
}

function CustomDayButton(props: DayButtonProps) {
  const { day, modifiers, ...rest } = props;

  return (
    <button
      {...rest}
      data-today={modifiers.today}
      data-selected={modifiers.selected}
      data-outside={modifiers.outside}
      style={{
        width: 36,
        height: 36,
        borderRadius: 6,
        border: modifiers.selected ? "2px solid #2563eb" : "1px solid #e5e7eb",
        background: modifiers.selected
          ? "#2563eb"
          : modifiers.today
            ? "#f3f4f6"
            : "white",
        color: modifiers.selected ? "white" : "black",
        cursor: "pointer",
      }}
    >
      {day.date.getDate()}
    </button>
  );
}
