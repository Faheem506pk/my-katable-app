import React, { useState } from "react";
import {
  Box,
  Popover,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";

interface PhoneCellProps {
  value: string;
  rowId: number;
  columnKey: string;
  onChange: (rowId: number, columnKey: string, value: string) => void;
}

const PhoneCell: React.FC<PhoneCellProps> = ({
  value,
  rowId,
  columnKey,
  onChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [currentPhone, setCurrentPhone] = useState(value);
  const [inputValue, setInputValue] = useState(value);

  const open = Boolean(anchorEl);
  const id = open ? "phone-popover" : undefined;

  const handlePopoverOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    handleSave(); 
  };

  const handleSave = () => {
    setCurrentPhone(inputValue); 
    onChange(rowId, columnKey, inputValue); 
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave(); 
      handlePopoverClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    
    newValue = newValue.replace(/[^0-9+]/g, ""); 
    if (newValue.length > 16) {
      newValue = newValue.slice(0, 16); 
    }

    setInputValue(newValue);
  };

  return (
    <Box display="flex" alignItems="center" gap="8px" width="100%">
      <Box
        onClick={handlePopoverOpen}
        sx={{
          cursor: "pointer",
          minHeight: "20px",
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography noWrap>{currentPhone}</Typography>
      </Box>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box
          sx={{
            padding: "16px",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            width: "250px",
          }}
        >
          <TextField
            type="tel"
            label="Phone Number"
            value={inputValue}
            onChange={handleInputChange} 
            onBlur={handleSave}
            onKeyDown={handleKeyDown} 
            size="small"
            variant="outlined"
            fullWidth
            
          />
          {currentPhone && (
            <Button
              variant="contained"
              color="success"
              onClick={() => (window.location.href = `tel:${currentPhone}`)}
              startIcon={<PhoneIcon />}
              fullWidth
              sx={{ marginTop: "16px" }}
            >
              Call
            </Button>
          )}
        </Box>
      </Popover>
    </Box>
  );
};

export default PhoneCell;
