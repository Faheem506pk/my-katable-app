import React, { useState } from "react";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import { FaArrowDown, FaArrowUp, FaTrash } from "react-icons/fa";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Column } from "ka-table/models";

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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    if (newTitle !== currentTitle) {
      handleRenameColumn(columnKey, newTitle);
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
    const updatedColumns = columns.map((col) =>
      col.key === key ? { ...col, title: newTitle } : col
    );
    setColumns(updatedColumns);
    setTableKey((prevKey) => prevKey + 1); // Force re-render
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

  return (
    <div>
      <button
        aria-describedby={id}
        onClick={handleOpen}
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
            onBlur={handleClose}
            inputProps={{
              onKeyDown: (e) => {
                if (e.key === "Enter") {
                  handleClose();
                }
              },
            }}
          />
          <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", alignSelf: "self-start" }}>
            <Button onClick={() => handleSortColumn(columnKey, "asc")}> <FaArrowUp /> Sort Ascending</Button>
            <Button onClick={() => handleSortColumn(columnKey, "desc")}><FaArrowDown /> Sort Descending</Button>
            <Button
              onClick={handleDeleteClick}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "red",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FaTrash style={{ marginRight: "5px" }} />
              Delete Column
            </Button>
          </div>
        </div>
      </Popover>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-column-dialog"
      >
        <DialogTitle id="delete-column-dialog">Delete Column</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the column "{currentTitle}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ColumnPopover;
