import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerCellProps {
  value: string | null; 
  rowId: number;       
  columnKey: string; 
  onChange: (rowId: number, columnKey: string, value: string) => void; 
}

const DateCell: React.FC<DatePickerCellProps> = ({ value, rowId, columnKey, onChange }) => {
    
  const handleDateChange = (date: Date | null) => {
    if (date) {
      onChange(rowId, columnKey, date.toISOString()); 
    } else {
      onChange(rowId, columnKey, ""); 
    }
  };

  // Helper function to check if a string is a valid date
  const isValidDateString = (dateStr: string | null): boolean => {
    if (!dateStr || dateStr === "") return false;
    
    const timestamp = Date.parse(dateStr);
    return !isNaN(timestamp);
  };

  // Only create a Date object if the value is a valid date string
  const selectedDate = isValidDateString(value) ? new Date(value as string) : null;

  return (
    <DatePicker
      selected={selectedDate}
      onChange={handleDateChange} 
      dateFormat="dd-MM-yyyy" 
      className="date-picker"
      placeholderText="" 
    />
  );
};

export default DateCell;
