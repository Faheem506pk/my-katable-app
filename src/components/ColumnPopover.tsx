import React, { useState, useEffect } from "react";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import { FaArrowDown, FaArrowUp, FaTrash } from "react-icons/fa";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Column } from "ka-table/models";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { dataTypeMap } from "../utils/dataTypeMap"; 
import { DataType } from "ka-table/enums";

interface ColumnPopoverProps {
  columnKey: string;
  currentTitle: string;
  columns: Column<any>[]; // Ensure this matches the type expected
  setColumns: React.Dispatch<React.SetStateAction<Column<any>[]>>;
  dataArray: any[];
  setDataArray: React.Dispatch<React.SetStateAction<any[]>>;
  setTableKey: React.Dispatch<React.SetStateAction<number>>;
}

const ColumnPopover: React.FC<ColumnPopoverProps> = ({
  columnKey,
  currentTitle,
  columns,
  dataArray,
  setColumns,
  setDataArray,
  setTableKey
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [newTitle, setNewTitle] = useState(currentTitle);

  // Initialize newDataType from the current column's dataType
  const currentDataType = columns.find(col => col.key === columnKey)?.dataType;
  const [newDataType, setNewDataType] = useState<DataType | string>(currentDataType || DataType.Number); // Default to 'Text' if undefined
  
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);  // Track if Select is open

  useEffect(() => {
    // Update the dataType if the current column's dataType changes
    const currentDataType = columns.find(col => col.key === columnKey)?.dataType;
    if (currentDataType) {
      setNewDataType(currentDataType);
    }
  }, [columns, columnKey]);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    if (newTitle !== currentTitle) {
      handleRenameColumn(columnKey, newTitle);
    }
    if (newDataType !== columns.find(col => col.key === columnKey)?.dataType) {
      handleChangeDataType(columnKey, newDataType as DataType);
    }
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    handleDeleteColumn(columnKey);
    setOpenDeleteDialog(false);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };

  const handleRenameColumn = (key: string, newTitle: string) => {
    const savedColumns = JSON.parse(localStorage.getItem("tableColumns") || "[]");
    const columnToRename = savedColumns.find((col: any) => col.key === key);

    if (columnToRename) {
      const updatedColumns = columns.map((col) =>
        col.key === key ? { ...col, title: newTitle } : col
      );
      setColumns(updatedColumns);
      setTableKey((prevKey) => prevKey + 1); // Force re-render
      localStorage.setItem("tableColumns", JSON.stringify(updatedColumns));
    } else {
      console.error(`Column with key ${key} not found in local storage.`);
    }
  };

  const handleChangeDataType = (key: string, newDataType: DataType) => {
    console.log("Before update:", columns);  // Log columns before change
    
    // Update columns
    const updatedColumns = columns.map((col) =>
      col.key === key ? { ...col, dataType: newDataType } : col
    );
    
    console.log("Updated columns:", updatedColumns); // Log the updated columns
    
    // Update localStorage
    localStorage.setItem("tableColumns", JSON.stringify(updatedColumns));
  
    // Update the state with the updated columns
    setColumns(updatedColumns);
  
    // Force a re-render
    setTableKey((prevKey) => prevKey + 1); // Optionally trigger re-render if needed
    localStorage.setItem("tableColumns", JSON.stringify(updatedColumns));
  };
  
  

  const handleDeleteColumn = (columnKey: string) => {
    const updatedColumns = columns.filter((col) => col.key !== columnKey);
    const updatedDataArray = dataArray.map((row) => {
      const { [columnKey]: deletedColumn, ...rest } = row;
      return rest;
    });
    setColumns(updatedColumns);
    setDataArray(updatedDataArray);
    localStorage.setItem("tableColumns", JSON.stringify(updatedColumns));
    localStorage.setItem("tableData", JSON.stringify(updatedDataArray));
    setTableKey((prevKey) => prevKey + 1); // Force re-render
  };

  const handleSortColumn = (key: string, order: "asc" | "desc") => {
    const sortedData = [...dataArray].sort((a, b) => {
      const valueA = a[key]?.toString().trim() || "";
      const valueB = b[key]?.toString().trim() || "";

      if (valueA === "" && valueB === "") return 0;
      if (valueA === "") return order === "asc" ? -1 : 1;
      if (valueB === "") return order === "asc" ? -1 : 1;
      if (valueA < valueB) return order === "asc" ? 1 : -1;
      if (valueA > valueB) return order === "asc" ? -1 : 1;
      return 0;
    });

    setDataArray(sortedData);
    localStorage.setItem("tableData", JSON.stringify(sortedData));
  };

  const open = Boolean(anchorEl);
  const id = open ? "rename-column-popover" : undefined;

  const handleSelectOpen = () => {
    setIsSelectOpen(true);
  };

  const handleSelectClose = () => {
    setIsSelectOpen(false);
    handleClose();  // Only close when select is closed
  };

  return (
    <div>
      <button
        aria-describedby={id}
        onClick={handleOpen}
        className="column-name"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "0",
        }}
      >
        {currentTitle}
      </button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        disableRestoreFocus
      >
        <div style={{ padding: "10px", display: "flex", flexDirection: "column" }}>
          <TextField
            autoFocus
            label="Column Name"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            variant="outlined"
            size="small"
            inputProps={{
              onKeyDown: (e) => {
                if (e.key === "Enter") {
                  handleClose();
                }
              },
            }}
          />
          <Select
            value={newDataType}
            onChange={(e) => setNewDataType(e.target.value)}
            variant="outlined"
            size="small"
            style={{ marginTop: "10px" }}
            open={isSelectOpen}
            onOpen={handleSelectOpen}
            onClose={handleSelectClose}
          >
            {Object.keys(dataTypeMap).map((key) => (
              <MenuItem key={key} value={dataTypeMap[key]}>
                {key}
              </MenuItem>
            ))}
          </Select>
          <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", alignSelf: "self-start" }}>
            <Button onClick={() => handleSortColumn(columnKey, "asc")}> <FaArrowUp /> Sort Ascending</Button>
            <Button onClick={() => handleSortColumn(columnKey, "desc")}> <FaArrowDown /> Sort Descending</Button>
            <Button onClick={handleDeleteClick}> <FaTrash /> Delete Column</Button>
          </div>
        </div>
      </Popover>
      <Dialog open={openDeleteDialog} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this column?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ColumnPopover;
