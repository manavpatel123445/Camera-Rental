"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "./Button"
import { Input } from "./Input"
import { Calendar } from "./calendar"
import { Label } from "./label"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

interface Calendar28Props {
  value: string;
  onChange: (dateString: string) => void;
}

function parseDateString(dateString: string): Date | undefined {
  if (!dateString) return undefined;
  const d = new Date(dateString);
  return isNaN(d.getTime()) ? undefined : d;
}

export function Calendar28({ value, onChange }: Calendar28Props) {
  const [open, setOpen] = React.useState(false);
  const date = parseDateString(value);
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [inputValue, setInputValue] = React.useState(value ? formatDate(date) : "");

  React.useEffect(() => {
    setInputValue(value ? formatDate(date) : "");
  }, [value]);

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1 font-medium text-sm">Subscription Date</Label>
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={inputValue}
          placeholder="June 01, 2025"
          className="bg-background pr-10"
          onChange={(e) => {
            setInputValue(e.target.value);
            const d = new Date(e.target.value);
            if (isValidDate(d)) {
              onChange(d.toISOString());
              setMonth(d);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
              type="button"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(d) => {
                if (d) {
                  onChange(d.toISOString());
                  setInputValue(formatDate(d));
                }
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}