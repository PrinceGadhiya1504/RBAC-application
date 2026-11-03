import { useState, useRef, useEffect, useId } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { formatDate, parseISODate } from "@/lib/dateUtils";

interface DatePickerProps {
    id?: string;
    value?: string | null;
    onChange: (dateStr: string) => void;
    min?: string;
    max?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    ariaLabel?: string;
}

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const WEEKDAY_NAMES = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export default function DatePicker({
    id,
    value,
    onChange,
    min,
    max,
    placeholder = "DD MMM YYYY",
    disabled = false,
    required = false,
    className = "",
    ariaLabel,
}: DatePickerProps) {
    const generatedId = useId();
    const inputId = id || generatedId;
    const containerRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const today = new Date();
    const parsedValue = parseISODate(value);

    const [viewYear, setViewYear] = useState(() => parsedValue?.year ?? today.getFullYear());
    const [viewMonth, setViewMonth] = useState(() => (parsedValue ? parsedValue.month - 1 : today.getMonth()));

    // Synchronize calendar view when external value changes
    useEffect(() => {
        if (value) {
            const p = parseISODate(value);
            if (p) {
                setViewYear(p.year);
                setViewMonth(p.month - 1);
            }
        }
    }, [value]);

    // Close on click outside or Escape key
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    const isDateDisabled = (isoDate: string) => {
        if (min && isoDate < min) return true;
        if (max && isoDate > max) return true;
        return false;
    };

    const handleSelectDay = (day: number) => {
        const m = String(viewMonth + 1).padStart(2, "0");
        const d = String(day).padStart(2, "0");
        const isoDate = `${viewYear}-${m}-${d}`;

        if (isDateDisabled(isoDate)) return;

        onChange(isoDate);
        setIsOpen(false);
    };

    const handlePrevMonth = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear((y) => y - 1);
        } else {
            setViewMonth((m) => m - 1);
        }
    };

    const handleNextMonth = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear((y) => y + 1);
        } else {
            setViewMonth((m) => m + 1);
        }
    };

    const handleTodayClick = () => {
        const y = today.getFullYear();
        const m = String(today.getMonth() + 1).padStart(2, "0");
        const d = String(today.getDate()).padStart(2, "0");
        const todayIso = `${y}-${m}-${d}`;

        if (isDateDisabled(todayIso)) return;

        onChange(todayIso);
        setViewYear(y);
        setViewMonth(today.getMonth());
        setIsOpen(false);
    };

    const handleClearClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
        setIsOpen(false);
    };

    // Calculate calendar grid days
    const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday
    const startOffset = (firstDay + 6) % 7; // Monday = 0
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    // Year range selector options (30 years past to 10 years future)
    const currentYear = today.getFullYear();
    const yearOptions = Array.from({ length: 41 }, (_, i) => currentYear - 30 + i);

    return (
        <div ref={containerRef} className="relative w-full">
            <div className={`relative flex items-center ${disabled ? "cursor-not-allowed" : ""}`}>
                <input
                    id={inputId}
                    type="text"
                    readOnly
                    value={value ? formatDate(value, "") : ""}
                    onClick={() => !disabled && setIsOpen((prev) => !prev)}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    aria-label={ariaLabel || "Select date (e.g. 30 Oct 2026)"}
                    className={`h-9 w-full rounded-lg border border-input bg-background px-3 pr-16 text-xs shadow-xs transition-colors cursor-pointer placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
                />

                <div className={`absolute right-1 flex items-center gap-0.5 ${disabled ? "cursor-not-allowed" : ""}`}>
                    {Boolean(value) && !disabled && (
                        <button
                            type="button"
                            onClick={handleClearClick}
                            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                            title="Clear date"
                            aria-label="Clear date"
                        >
                            <X className="size-3.5" />
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => !disabled && setIsOpen((prev) => !prev)}
                        disabled={disabled}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:pointer-events-none"
                        title="Open date picker calendar"
                        aria-label="Open date picker calendar"
                    >
                        <CalendarIcon className="size-4" />
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="absolute left-0 top-full z-50 mt-1.5 w-72 rounded-xl border bg-popover p-3 text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95">
                    {/* Header: Navigation & Month/Year Selectors */}
                    <div className="flex items-center justify-between gap-1 pb-2 border-b border-border">
                        <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                            aria-label="Previous month"
                        >
                            <ChevronLeft className="size-4" />
                        </button>

                        <div className="flex items-center gap-1.5">
                            <select
                                value={viewMonth}
                                onChange={(e) => setViewMonth(Number(e.target.value))}
                                className="h-7 rounded-md border border-input bg-background px-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                            >
                                {MONTH_NAMES.map((name, idx) => (
                                    <option key={name} value={idx}>
                                        {name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={viewYear}
                                onChange={(e) => setViewYear(Number(e.target.value))}
                                className="h-7 rounded-md border border-input bg-background px-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                            >
                                {yearOptions.map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                            aria-label="Next month"
                        >
                            <ChevronRight className="size-4" />
                        </button>
                    </div>

                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 gap-1 pt-2 pb-1 text-center text-[11px] font-semibold text-muted-foreground">
                        {WEEKDAY_NAMES.map((w) => (
                            <div key={w}>{w}</div>
                        ))}
                    </div>

                    {/* Days grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: startOffset }).map((_, idx) => (
                            <div key={`offset-${idx}`} className="h-7" />
                        ))}

                        {Array.from({ length: daysInMonth }).map((_, idx) => {
                            const day = idx + 1;
                            const m = String(viewMonth + 1).padStart(2, "0");
                            const d = String(day).padStart(2, "0");
                            const isoDate = `${viewYear}-${m}-${d}`;

                            const isSelected = parsedValue
                                ? parsedValue.year === viewYear &&
                                  parsedValue.month === viewMonth + 1 &&
                                  parsedValue.day === day
                                : false;

                            const isToday =
                                today.getFullYear() === viewYear &&
                                today.getMonth() === viewMonth &&
                                today.getDate() === day;

                            const disabledDay = isDateDisabled(isoDate);

                            return (
                                <button
                                    key={`day-${day}`}
                                    type="button"
                                    onClick={() => handleSelectDay(day)}
                                    disabled={disabledDay}
                                    className={`flex h-7 w-full items-center justify-center rounded-md text-xs transition-colors cursor-pointer ${
                                        isSelected
                                            ? "bg-primary font-bold text-primary-foreground shadow-xs"
                                            : isToday
                                            ? "border border-primary font-semibold text-primary hover:bg-muted"
                                            : "text-foreground hover:bg-muted/80"
                                    } ${disabledDay ? "opacity-30 cursor-not-allowed pointer-events-none" : ""}`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    {/* Quick actions footer */}
                    <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-xs">
                        <button
                            type="button"
                            onClick={handleTodayClick}
                            className="text-primary hover:underline font-medium cursor-pointer"
                        >
                            Today
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
