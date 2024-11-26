import React, { useState } from "react";
import { IconButton, TextField, Tooltip } from "@mui/material";
import { Email as EmailIcon } from "@mui/icons-material";

interface EmailCellProps {
  value: string;
  rowId: number;
  columnKey: string;
  onChange: (rowId: number, columnKey: string, value: string) => void;
}

const EmailCell: React.FC<EmailCellProps> = ({ value, rowId, columnKey, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(value);
  const [error, setError] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = () => {
    if (!validateEmail(email) && email.trim() !== "") {
      setError(true);
    } else {
      setError(false);
      setIsEditing(false);
      onChange(rowId, columnKey, email);
    }
  };

  const handleRedirect = () => {
    if (email) {
      window.open(`mailto:${email}`, "_blank");
    }
  };

  const handleEditMode = () => {
    setIsEditing(true); // Enter editing mode
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%" }}>
      {isEditing ? (
        <TextField
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={handleSave} // Save on blur
          autoFocus // Automatically focus the field
          size="small"
          variant="outlined"
          style={{ width: "100%" }}
          error={error}
          helperText={error ? "Invalid email format" : ""}
        />
      ) : (
        <>
          {/* Ensure the span is always rendered */}
          <span
            onClick={handleEditMode}
            style={{
              cursor: "pointer",
              flex: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minHeight: "1.5rem", // Provide clickable area even when empty
              borderBottom: email ? "none" : "none", // Dashed underline for empty cells
              color: email ? "inherit" : "#aaa", // Light gray for empty cells
            }}
          >
            {email || " "}
          </span>
          {email && (
            <Tooltip title="Send Email">
              <IconButton size="small" onClick={handleRedirect}>
                <EmailIcon />
              </IconButton>
            </Tooltip>
          )}
        </>
      )}
    </div>
  );
};

export default EmailCell;
