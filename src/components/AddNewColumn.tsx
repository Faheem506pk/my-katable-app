import { Button, Popover, MenuItem, MenuList } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import { Column } from "ka-table/models";
import { DataType } from "ka-table/enums";
import React, { useState } from "react";

interface AddNewColumnProps {
  columns: Column[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  table: any;
}

const dataTypeMap: Record<string, any> = {
  Date: DataType.Date,
  Email: "Email",
  MultiSelect: "MultiSelect",
  Number: DataType.Number,
  Phone: "Phone",
  Status: "Status",
  Select: "Select",
  Text: DataType.String,
  // You can easily add more types here in the future
};

export default function AddNewColumn({
  columns,
  setColumns,
  table,
}: AddNewColumnProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDataType, setSelectedDataType] = useState<string | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectDataType = (dataType: string) => {
    setSelectedDataType(dataType);
    handleAddColumn(dataType);
    console.log(`selectedDataType: ${selectedDataType}`);
    handleClose();
  };

  const handleAddColumn = (dataType: string) => {
    const newColumn: Column = {
      key: `${dataType}-${columns.length + 1}`, // Set key based on the selected data type
      title: `${dataType}-${columns.length + 1}`, // Set title based on the selected data type
      dataType: dataTypeMap[dataType], // Use the map to get the correct value
      style: { minWidth: 199 },
      isEditable: true,
    };

    const indexOfAddColumn = columns.findIndex(
      (col) => col.key === "AddColumn"
    );
    const updatedColumns = [
      ...columns.slice(0, indexOfAddColumn),
      newColumn,
      ...columns.slice(indexOfAddColumn),
    ];

    setColumns(updatedColumns);

    table.dispatch({
      type: "InsertColumn",
      column: newColumn,
      index: indexOfAddColumn,
    });
  };

  return (
    <div>
      <Button onClick={handleClick}>
        <FaPlus />
      </Button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <MenuList>
          {Object.keys(dataTypeMap).map((dataType) => (
            <MenuItem
              key={dataType}
              onClick={() => handleSelectDataType(dataType)}
            >
              {dataType}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </div>
  );
}
