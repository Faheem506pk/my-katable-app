import React, { useState } from "react";
import {
  Box,
  Badge,
  Popover,
  Button,
} from "@mui/material";
import { GrStatusGood } from "react-icons/gr";

interface StatusPopoverProps {
  value: string;
  rowId: number;
  columnKey: string;
  onChange: (rowId: number, columnKey: string, value: string) => void;
}

const StatusCell: React.FC<StatusPopoverProps> = ({
  value,
  rowId,
  columnKey,
  onChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string>(value || "Inactive");

  const handlePopoverOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus);
    onChange(rowId, columnKey, newStatus); // Call the onChange handler to save the updated status
    setAnchorEl(null); // Close the popover after the selection
  };

  const open = Boolean(anchorEl);

  return (
    <Box display="flex" alignItems="center">
      {/* Trigger Box */}
      <Box
        onClick={handlePopoverOpen}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "12px",
        
        }}
      >
        <Badge
          sx={{
            backgroundColor: currentStatus === "Active" ? "#d4edda" : "#f8d7da",
            color: currentStatus === "Active" ? "#155724" : "#721c24",
            borderRadius: "12px",
            padding: "4px 5px",
            display: "flex",
            alignItems: "center",
            fontSize: "12px",
          }}
        >
          <GrStatusGood
            style={{
              marginRight: "8px",
              color: currentStatus === "Active" ? "#28a745" : "#dc3545",
            }}
          />
          {currentStatus}
        </Badge>
      </Box>

      {/* Material UI Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <Box display="flex" flexDirection="column" gap="10px" minWidth={"150px"} >
          {/* Active Status */}
          <Button
            onClick={() => handleStatusChange("Active")}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
              backgroundColor: "#d4edda",
              color: "#155724",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#c3e6cb",
              },
            }}
          >
            <GrStatusGood style={{ marginRight: "8px", color: "#28a745" }} />
            Active
          </Button>

          {/* Inactive Status */}
          <Button
            onClick={() => handleStatusChange("Inactive")}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "6px 12px",
              borderRadius: "12px",
              backgroundColor: "#f8d7da",
              color: "#721c24",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#f5c6cb",
              },
            }}
          >
            <GrStatusGood style={{ marginRight: "8px", color: "#dc3545" }} />
            Inactive
          </Button>
        </Box>
      </Popover>
    </Box>
  );
};

export default StatusCell;
