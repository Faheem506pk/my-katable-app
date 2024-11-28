// AddNewColumn.tsx

import { Popover, MenuItem, MenuList } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import { Column } from "ka-table/models";
import React, { useState } from "react";
import { IconMap } from "../utils/icons/IconsMap";  
import { dataTypeMap } from "../utils/dataTypeMap"; 
interface AddNewColumnProps {
  columns: Column[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  table: any;
}

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
    <button
  onClick={handleClick}
  style={{
    marginTop: "8px",
    textAlign: "left",
    border: "none",
    background: "transparent",
    color: "gray",
    height: "15px", // Adjust the button height
    width: "15px",  // Adjust the button width
  }}
>
  <FaPlus style={{ fontSize: "14px" }} /> {/* Optional: Adjust the font size of the icon */}
</button>


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
              {IconMap[dataType] || IconMap.default} {dataType}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </div>
  );
}
