import React, { useState, useEffect } from "react";
import { Box, Popover, PopoverOrigin, Badge, Button} from "@mui/material";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import { useLocalStorage } from "../../hooks/useLocalStorage";

interface SelectPopoverProps {
  value: string;
  rowId: number;
  columnKey: string;
  onChange: (rowId: number, columnKey: string, value: string) => void;
  selectOptions: string[];
  setSelectOptions: React.Dispatch<React.SetStateAction<string[]>>;
}

const SelectCell: React.FC<SelectPopoverProps> = ({
  value,
  rowId,
  columnKey,
  onChange,
  selectOptions,
  setSelectOptions,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>(value);
  const [badgeColors, setBadgeColors] = useLocalStorage<Record<string, string>>("badgeColors", {});

  // Generate a random vibrant color
  const getRandomColor = () => {
    const colors = [
      "#E3F2FD", "#FFEBEE", "#F1F8E9", "#FFF3E0", "#E8F5E9"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Assign random colors to badges
  const getBadgeColor = (tag: string) => {
    if (!badgeColors[tag]) {
      const newColor = getRandomColor();
      setBadgeColors((prev) => ({ ...prev, [tag]: newColor }));
      return newColor;
    }
    return badgeColors[tag];
  };

  // Handle opening the popover
  const handleOpenPopover = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle closing the popover
  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  // Handle option selection
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    onChange(rowId, columnKey, option); // Pass the selected value to the parent
    handleClosePopover();
  };

  // Load options from localStorage when the component mounts
  useEffect(() => {
    const savedOptions = localStorage.getItem("selectOptions");
    if (savedOptions) {
      setSelectOptions(JSON.parse(savedOptions));
    }
  }, [setSelectOptions]);

  // Save options to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("selectOptions", JSON.stringify(selectOptions));
  }, [selectOptions]);

  return (
    <Box display="flex" alignItems="center" width="100%">
      <Box
        onClick={handleOpenPopover}
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
        {selectedOption && (
          <Badge
            sx={{
              backgroundColor: getBadgeColor(selectedOption),
              color: "black",
              padding: "5px 10px",
              borderRadius: "15px",
              fontSize: "12px",
              
            }}
          >
            {selectedOption}
          </Badge>
        )}
      </Box>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" } as PopoverOrigin}
      >
        <Box sx={{ padding: "10px", minWidth: "200px" }}>
          <TagsInput
            value={selectOptions}
            onChange={(tags) => setSelectOptions(tags)}
         
          />

          <Box >
            {selectOptions.map((option) => (
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

export default SelectCell;
