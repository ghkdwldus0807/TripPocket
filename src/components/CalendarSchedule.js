import React from "react";

function CalendarSchedule({ selectedDate, scheduleData }) {
  const selectedDateSchedules = scheduleData[selectedDate] || [];

  return (
    <div>
      <h2>Schedule for {selectedDate}</h2>
      {selectedDateSchedules.length > 0 ? (
        <ul>
          {selectedDateSchedules.map((schedule, index) => (
            <li key={index}>{schedule}</li>
          ))}
        </ul>
      ) : (
        <p>No schedule for this date</p>
      )}
    </div>
  );
}

export default CalendarSchedule;
