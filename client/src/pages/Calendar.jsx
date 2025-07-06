import React, { useState, useMemo } from "react";
import dataCalendars from "../utils/testCalendars";
import "../styles/Calendar.css";

const impacts = ["gray", "yellow", "orange", "red"];
const eventTypes = [
    "Growth", "Inflation", "Employment", "Central Bank", "Bonds", "Housing",
    "Consumer Surveys", "Business Surveys", "Speeches", "Misc",
];
const currencies = Array.from(new Set(dataCalendars.map((item) => item.currency)));
const quickDateOptions = ["All", "Today", "Tomorrow", "This Week", "Next Week", "This Month", "Next Month"];

function parseDateDMY(str) {
    const [d, m, y] = str.split("/");
    return new Date(+y, +m - 1, +d);
}

const Calendar = () => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [quickDate, setQuickDate] = useState("All");

    const [selectedImpacts, setSelectedImpacts] = useState(() =>
        impacts.reduce((acc, cur) => ({ ...acc, [cur]: false }), {})
    );
    const [selectedCurrencies, setSelectedCurrencies] = useState(() =>
        currencies.reduce((acc, cur) => ({ ...acc, [cur]: false }), {})
    );
    const [selectedEvents, setSelectedEvents] = useState(() =>
        eventTypes.reduce((acc, cur) => ({ ...acc, [cur]: false }), {})
    );

    const toggleCheckbox = (setter, state, key) => {
        if (key === "All" && setter === setSelectedCurrencies) {
            const newValue = !state["All"];
            const updated = currencies.reduce((acc, cur) => ({ ...acc, [cur]: newValue }), {});
            updated["All"] = newValue;
            setter(updated);
        } else {
            setter({ ...state, [key]: !state[key] });
        }
    };

    const isWithinQuickDate = (itemDate) => {
        if (quickDate === "All") return true;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const startOfNextWeek = new Date(endOfWeek);
        startOfNextWeek.setDate(endOfWeek.getDate() + 1);
        const endOfNextWeek = new Date(startOfNextWeek);
        endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);

        switch (quickDate) {
            case "Today":
                return itemDate.toDateString() === today.toDateString();
            case "Tomorrow":
                return itemDate.toDateString() === tomorrow.toDateString();
            case "This Week":
                return itemDate >= startOfWeek && itemDate <= endOfWeek;
            case "Next Week":
                return itemDate >= startOfNextWeek && itemDate <= endOfNextWeek;
            case "This Month":
                return itemDate >= startOfMonth && itemDate <= endOfMonth;
            case "Next Month":
                return itemDate >= startOfNextMonth && itemDate <= endOfNextMonth;
            default:
                return true;
        }
    };

    const filteredData = useMemo(() => {
        return dataCalendars.filter((item) => {
            const itemDate = parseDateDMY(item.date);

            if (!isWithinQuickDate(itemDate)) return false;
            if (fromDate && itemDate < new Date(fromDate)) return false;
            if (toDate && itemDate > new Date(toDate)) return false;

            const impactsChecked = Object.values(selectedImpacts).some(Boolean);
            if (impactsChecked && !selectedImpacts[item.impact]) return false;

            const currenciesChecked = Object.values(selectedCurrencies).some(Boolean);
            if (currenciesChecked && !selectedCurrencies[item.currency]) return false;

            const eventsChecked = Object.values(selectedEvents).some(Boolean);
            if (eventsChecked && !selectedEvents[item.event]) return false;

            return true;
        });
    }, [fromDate, toDate, quickDate, selectedImpacts, selectedCurrencies, selectedEvents]);

    return (
        <div className="calendar-container">
            <h2>📅 Economic Calendar</h2>
            <div className="calendar-content">
                <div className="calendar-table-wrapper">
                    <table className="calendar-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Currency</th>
                                <th>Impact</th>
                                <th>Event</th>
                                <th>Actual</th>
                                <th>Forecast</th>
                                <th>Previous</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.date}</td>
                                    <td>{item.time}</td>
                                    <td>{item.currency}</td>
                                    <td>
                                        <span className={`impact-icon ${item.impact}`}>
                                            {"★".repeat(
                                                item.impact === "gray"
                                                    ? 1
                                                    : item.impact === "yellow"
                                                        ? 2
                                                        : item.impact === "orange"
                                                            ? 3
                                                            : item.impact === "red"
                                                                ? 4
                                                                : 0
                                            )}
                                        </span>
                                    </td>
                                    <td>{item.event}</td>
                                    <td>{item.actual}</td>
                                    <td>{item.forecast}</td>
                                    <td>{item.previous}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="calendar-filter">
                    <h3>🔍 Filter</h3>

                    <div className="filter-group">
                        <label>Quick Date</label>
                        <select value={quickDate} onChange={(e) => setQuickDate(e.target.value)}>
                            {quickDateOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>From Date</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            disabled={quickDate !== "All"}
                        />
                    </div>
                    <div className="filter-group">
                        <label>To Date</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            disabled={quickDate !== "All"}
                        />
                    </div>

                    <div className="filter-group">
                        <label>Impact</label>
                        {impacts.map((imp) => (
                            <div key={imp} className="impact-checkbox">
                                <input
                                    type="checkbox"
                                    id={`imp-${imp}`}
                                    checked={selectedImpacts[imp]}
                                    onChange={() => toggleCheckbox(setSelectedImpacts, selectedImpacts, imp)}
                                />
                                <label htmlFor={`imp-${imp}`}>
                                    <span className={`impact-icon ${imp}`}>
                                        {"★".repeat(
                                            imp === "gray" ? 1 : imp === "yellow" ? 2 : imp === "orange" ? 3 : 4
                                        )}
                                    </span>
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="filter-group currency">
                        <label>Currency</label>
                        <div className="currency-checkboxes">
                            {[...currencies].map((cur) => (
                                <div key={cur}>
                                    <input
                                        type="checkbox"
                                        id={`cur-${cur}`}
                                        checked={selectedCurrencies[cur] || false}
                                        onChange={() =>
                                            toggleCheckbox(setSelectedCurrencies, selectedCurrencies, cur)
                                        }
                                    />
                                    <label htmlFor={`cur-${cur}`}>{cur}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group event-type">
                        <label>Event Type</label>
                        <div className="event-checkboxes">
                            {eventTypes.map((evt) => (
                                <div key={evt}>
                                    <input
                                        type="checkbox"
                                        id={`evt-${evt}`}
                                        checked={selectedEvents[evt]}
                                        onChange={() =>
                                            toggleCheckbox(setSelectedEvents, selectedEvents, evt)
                                        }
                                    />
                                    <label htmlFor={`evt-${evt}`}>{evt}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
