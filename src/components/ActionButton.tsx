// ActionButton.tsx
import React from 'react';
import { MdDeleteOutline, MdDragIndicator } from 'react-icons/md';

interface ActionButtonProps {
  rowId: any;
  rowData: any;
  hoveredRow: number | null;
  handleDeleteRow: (rowData: any) => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  rowId,
  rowData,
  hoveredRow,
  handleDeleteRow,
}) => (
  hoveredRow === rowId ? (
    <div style={{ display: 'flex' }}>
      <MdDeleteOutline
        style={{ cursor: 'pointer' }}
        onClick={() => handleDeleteRow(rowData.id)}
      />
      <MdDragIndicator style={{ cursor: 'move' }} />
    </div>
  ) : null
);

export default ActionButton;
