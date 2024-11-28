import React, { useState } from "react";
import { Box, Popover, Badge, Button } from "@mui/material";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css"; // Import basic styles for react-tagsinput
import { useLocalStorage } from "../../hooks/useLocalStorage";

interface MultiSelectCellProps {
  value: string;
  rowId: number;
  columnKey: string;
  onChange: (rowId: number, columnKey: string, value: string) => void;
  multiselectOptions: string[];
  setMultiSelectOptions: React.Dispatch<React.SetStateAction<string[]>>;
}

const MultiSelectCell: React.FC<MultiSelectCellProps> = ({
  value,
  rowId,
  columnKey,
  onChange,
  multiselectOptions,
  setMultiSelectOptions,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [currentTags, setCurrentTags] = useState<string[]>(
    value ? value.split(",").filter(Boolean) : []
  );
  const [badgeColors, setBadgeColors] = useLocalStorage<Record<string, string>>("multiSelectbadgeColors", {});

  const getRandomColor = () => {
    const colors = ["#E3F2FD", "#FFEBEE", "#F1F8E9", "#FFF3E0", "#E8F5E9"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getBadgeColor = (tag: string) => {
    if (!badgeColors[tag]) {
      const newColor = getRandomColor();
      setBadgeColors((prev) => ({ ...prev, [tag]: newColor }));
      return newColor;
    }
    return badgeColors[tag];
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    onChange(rowId, columnKey, currentTags.join(",")); // Save tags when popover closes
  };

  const handleTagChange = (tags: string[]) => {
    setCurrentTags(tags);
  };

  const handleOptionSelect = (option: string) => {
    // Check if the option is already in the current tags
    if (!currentTags.includes(option)) {
      const updatedTags = [...currentTags, option]; // Add the new option
      setCurrentTags(updatedTags);
      onChange(rowId, columnKey, updatedTags.join(",")); // Notify parent about changes
    }
  };
  

  const open = Boolean(anchorEl);

  return (
    <Box display="flex" alignItems="center" width="100%">
      {/* Display tags */}
      <Box
        onClick={handlePopoverOpen}
        sx={{
          cursor: "pointer",
          display: "flex",
          flexWrap: "wrap",
          gap: "4px",
          minHeight: "20px",
          borderRadius: "8px",
          width: "100%",
        }}
      >
        {currentTags.map((tag, index) => (
          <Badge
            key={index}
            sx={{
              backgroundColor: getBadgeColor(tag),
              color: "black",
              padding: "4px 8px",
              borderRadius: "12px",
              fontWeight: 400,
            }}
          >
            {tag}
          </Badge>
        ))}
      </Box>

      {/* Popover for tag input */}
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
            padding: "16px",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            minWidth: "250px",
          },
        }}
      >
        <Box sx={{ padding: "10px", minWidth: "200px" }}>
          <TagsInput
            value={currentTags}
            onChange={(tags) => {
              setMultiSelectOptions(tags); // Update the options list
              handleTagChange(tags); // Update the current tags
            }}
            inputProps={{
              placeholder: "Add tags",
              autoFocus: true,
              style: { backgroundColor: "#ffffff", borderRadius: "18px" },
            }}
          />
          <Box>
            {multiselectOptions.map((option) => (
              <Button
                key={option}
                onClick={() => handleOptionSelect(option)}
                sx={{
                  width: "100%",
                  justifyContent: "flex-start",
                  padding: "8px",
                  textTransform: "none",
                  color: "black",
                  backgroundColor: getBadgeColor(option),
                  "&:hover": { backgroundColor: getBadgeColor(option) },
                  mt: 1,
                }}
              >
                {option}
              </Button>
            ))}
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default MultiSelectCell;
