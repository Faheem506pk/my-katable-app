import React, { useState } from "react";
import { IconButton, TextField, Tooltip } from "@mui/material";
import { Email as EmailIcon } from "@mui/icons-material";
import { toast } from "react-toastify"; // Import react-toastify

interface EmailCellProps {
  value: string;
  rowId: number;
  columnKey: string;
  onChange: (rowId: number, columnKey: string, value: string) => void;
}

const EmailCell: React.FC<EmailCellProps> = ({
  value,
  rowId,
  columnKey,
  onChange,
}) => {
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
      toast.error("Invalid email format"); // Show error message in toast
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
    setIsEditing(true);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1px",
        width: "100%",
        height: "10px",
        paddingTop: "5px",
      }}
    >
      {isEditing ? (
        <TextField
          id="fullWidth"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={handleSave}
          autoFocus
          variant="standard"
          style={{ width: "100%" }}
          error={error}
          slotProps={{
            input: {
              disableUnderline: true, // Hide underline
              style: { marginTop: "-5px" }, // Ensure proper sizing
            },
          }}
        />
      ) : (
        <>
          <span
            onClick={handleEditMode}
            style={{
              cursor: "pointer",
              flex: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minHeight: "20px",
              borderBottom: email ? "none" : "none",
              color: email ? "inherit" : "#aaa",
            }}
          >
            {email || " "}
          </span>
          {email && (
            <Tooltip title="Send Email">
              <IconButton
                
                onClick={handleRedirect}
                style={{ padding: "0px" , paddingBottom:"2px"}}
              >
                <EmailIcon style={{height:"15px"}} />
              </IconButton>
            </Tooltip>
          )}
        </>
      )}
    </div>
  );
};

export default EmailCell;
