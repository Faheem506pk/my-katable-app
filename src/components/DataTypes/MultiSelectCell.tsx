import React, { useState } from "react";
import { Box, Popover, Badge } from "@mui/material";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css"; // Import basic styles for react-tagsinput

interface MultiSelectCellProps {
  value: string;
  rowId: number;
  columnKey: string;
  onChange: (rowId: number, columnKey: string, value: string) => void;
}

const MultiSelectCell: React.FC<MultiSelectCellProps> = ({
  value,
  rowId,
  columnKey,
  onChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [currentTags, setCurrentTags] = useState<string[]>(
    value ? value.split(",").filter(Boolean) : []
  );
  const [badgeColors, setBadgeColors] = useState<{ [key: string]: string }>({});

  const getRandomColorScheme = (tag: string) => {
    const lightColors = ["#E3F2FD", "#FFEBEE", "#F1F8E9", "#FFF3E0", "#E8F5E9"];
    if (!badgeColors[tag]) {
      const newColor =
        lightColors[Math.floor(Math.random() * lightColors.length)];
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
          padding: "8px",
          minHeight: "20px",
          
          borderRadius: "8px",
          width:"100%"
        }}
      >
        {currentTags.map((tag, index) => (
          <Badge
            key={index}
            sx={{
              backgroundColor: badgeColors[tag] || getRandomColorScheme(tag),
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
        <TagsInput
          value={currentTags}
          onChange={handleTagChange}
          inputProps={{
            placeholder: "Add tags",
            autoFocus: true,
            style: { backgroundColor: "#ffffff", borderRadius: "18px" },
          }}
        />
      </Popover>
    </Box>
  );
};

export default MultiSelectCell;
