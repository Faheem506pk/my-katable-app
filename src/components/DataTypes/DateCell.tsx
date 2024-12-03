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

  return (
    <DatePicker
      selected={value ? new Date(value) : undefined} 
      onChange={handleDateChange} 
      dateFormat="dd-MM-yyyy" 
      className="date-picker"
      placeholderText="" 
    />
  );
};

export default DateCell;
