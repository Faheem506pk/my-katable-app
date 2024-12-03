import React from "react";
import { MdDeleteOutline, MdDragIndicator } from "react-icons/md";

interface ActionButtonProps {
  rowId: number;
  rowData: any;
  hoveredRow: number | null;
  isSelected: boolean;
  toggleSelection: (id: number) => void;
  handleDeleteRow: (rowId: number) => void;
  selectedRows: number[];
}

const ActionButton: React.FC<ActionButtonProps> = ({
  rowId,
  rowData,
  hoveredRow,
  isSelected,
  toggleSelection,
  handleDeleteRow,
  selectedRows,
}) => {
  const isAnyRowSelected = selectedRows.length > 0;
  const isAnyRowNotSelected = selectedRows.length <= 0;

  return (
    <div style={{ display: "flex", alignItems: "center", width: "60px" }}>
      {/* Show delete and drag icons only when hovered over this row */}
      {hoveredRow === rowId && (
        <div style={{ display: "flex", marginRight: "5px" }}>
          <MdDeleteOutline
            style={{ cursor: "pointer", marginRight: "5px" }}
            onClick={() => handleDeleteRow(rowData.id)}
          />
          <MdDragIndicator style={{ cursor: "move" }} />
        </div>
      )}

      {/* Only show checkbox when hovered over the row */}
      {hoveredRow === rowId && isAnyRowNotSelected && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleSelection(rowId)}
          style={{ marginLeft: "auto" , marginRight: "5px" }}
        />
      )}
      {isAnyRowSelected && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleSelection(rowId)}
          style={{ marginLeft: "auto" , marginRight: "5px" }}
        />
      )}
    </div>
  );
};

export default ActionButton;
