import React, { useState } from "react";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import { FaTrash } from "react-icons/fa";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

interface RenameColumnPopoverProps {
  columnKey: string;
  currentTitle: string;
  onRename: (key: string, newTitle: string) => void;
  onDelete: (key: string) => void;
}

const ColumnPopover: React.FC<RenameColumnPopoverProps> = ({
  columnKey,
  currentTitle,
  onRename,
  onDelete,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [newTitle, setNewTitle] = useState(currentTitle);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    if (newTitle !== currentTitle) {
      onRename(columnKey, newTitle);
    }
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(columnKey);  // Delete the column
    setOpenDeleteDialog(false);  // Close the dialog
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);  // Close the dialog without deleting
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
          <div style={{ marginTop: "10px" }}>
            <button
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
            </button>
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
