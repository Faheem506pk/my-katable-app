import { useRef, useState, useEffect } from "react";
import { Table, useTable } from "ka-table";
import { DataType, EditingMode } from "ka-table/enums";
import { Column } from "ka-table/models";
import { FaPlus, FaTrash } from "react-icons/fa";
import ColumnPopover from "./ColumnPopover";
import ActionButton from "./ActionButton";
import AddNewColumn from "./AddNewColumn";
import DateCell from "./DataTypes/DateCell";
import EmailCell from "./DataTypes/EmailCell";
import PhoneCell from "./DataTypes/PhoneCell";
import MultiSelectCell from "./DataTypes/MultiSelectCell";
import StatusCell from "./DataTypes/StatusCell";
import SelectCell from "./DataTypes/SelectCell";
import { IconMapColumn } from "../utils/icons/IconsMap";

// Custom action types
export const REORDER_COLUMNS = "ReorderColumns";
export const REORDER_ROWS = "ReorderRows";

// Custom action creators
export const reorderColumns = (columnKey: string, targetColumnKey: string) => ({
  type: REORDER_COLUMNS,
  columnKey,
  targetColumnKey
});

export const reorderRows = (rowKeyValue: any, targetRowKeyValue: any) => ({
  type: REORDER_ROWS,
  rowKeyValue,
  targetRowKeyValue
});

const KaTable = () => {
  const table = useTable();
  const [tableKey, setTableKey] = useState(0); // Used to force re-render
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableWidth, setTableWidth] = useState<number>(0);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [draggedRow, setDraggedRow] = useState<number | null>(null);

  // Persistent state for select and multiselect options
  const [selectOptions, setSelectOptions] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("selectOptions") || "[]")
  );
  const [multiselectOptions, setMultiSelectOptions] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("selectOptions") || "[]")
  );

  // Persistent state for table data
  const [dataArray, setDataArray] = useState(
    () => JSON.parse(localStorage.getItem("tableData") || "[]") || []
  );

  useEffect(() => {
    console.log("Current Data Array:", dataArray);
  }, [dataArray]);

  // Persistent state for table columns
  const [columns, setColumns] = useState<Column[]>(() => {
    const savedColumns = JSON.parse(
      localStorage.getItem("tableColumns") || "[]"
    );

    // Default column setup if no columns exist
    if (!savedColumns || savedColumns.length === 0) {
      return [
        {
          key: "action",
          width: 67,
          isResizable: false,
          isEditable: false,
          title: "",
        },
        {
          key: "Name",
          title: "Name",
          dataType: "string",
          colGroup: { style: { minWidth: 100 } },
          width: 199,
          isEditable: true,
        },
        {
          key: "Email",
          title: "Email",
          dataType: "Email",
          colGroup: { style: { minWidth: 100 } },
          width: 199,
          isEditable: true,
        },
        {
          key: "Date",
          title: "Date",
          dataType: DataType.Date,
          colGroup: { style: { minWidth: 100 } },
          width: 199,
          isEditable: true,
        },
        {
          key: "AddColumn",
          title: "AddColumn",
          style: { minWidth: 180},
          width: 180,
          dataType: "AddColumn",
          isEditable: false,
          isResizable: true,
        },
        
      ];
    }
    return savedColumns.map((col: any, index: number) => ({
      ...col,
      id: index,
    }));
  });

  // Add a new row
  const handleAddRow = () => {
    const maxId = Math.max(...dataArray.map((row: { id: any }) => row.id), 0);
    setDataArray([...dataArray, { id: maxId + 1, Name: "", Salary: null }]);
  };

  // Handle cell value changes
  const handleCellValueChange = (
    rowKey: number,
    columnKey: string,
    value: string
  ) => {
    const updatedData = dataArray.map((row: { id: number }) =>
      row.id === rowKey ? { ...row, [columnKey]: value } : row
    );
    setDataArray(updatedData);
  };

  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Delete a row
  const handleDeleteRow = (id: number) => {
    const updatedDataArray = dataArray.filter(
      (row: { id: number }) => row.id !== id
    );
    setDataArray(updatedDataArray);
    localStorage.setItem(
      "tableData",
      JSON.stringify(updatedDataArray)
    );
  };

  // Toggle row selection
  const toggleSelection = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Delete selected rows
  const handleBulkDelete = () => {
    const updatedDataArray = dataArray.filter(
      (row: { id: number }) => !selectedRows.includes(row.id)
    );
    setDataArray(updatedDataArray);
    setSelectedRows([]);
    localStorage.setItem("tableData", JSON.stringify(updatedDataArray));
  };

  // Persist columns and data changes
  useEffect(() => {
    const columnsWithAddColumn = columns.filter(
      (col) => col.key !== "AddColumn"
    );
    columnsWithAddColumn.push({
      key: "AddColumn",
      title: "Add Column",
      isEditable: false,
    });

    localStorage.setItem("tableColumns", JSON.stringify(columnsWithAddColumn));
    localStorage.setItem("tableData", JSON.stringify(dataArray));
  }, [columns, dataArray]);

  // Populate with empty rows if no data exists
  useEffect(() => {
    if (dataArray.length === 0) {
      const emptyRows = Array(10)
        .fill(null)
        .map((_, index) => ({ id: index, Name: "", Email: "", Date: "" }));
      setDataArray(emptyRows);
    }
  }, [dataArray]);

  useEffect(() => {
    const updateTableWidth = () => {
      if (tableRef.current) {
        setTableWidth(tableRef.current.offsetWidth);
      }
    };
  
    // Initialize the width and add a resize event listener
    updateTableWidth();
    window.addEventListener("resize", updateTableWidth);
  
    return () => {
      window.removeEventListener("resize", updateTableWidth);
    };
  }, [columns]); // Add `columns` as a dependency
  
  // Handle row drag start
  const handleRowDragStart = (rowId: number) => {
    setDraggedRow(rowId);
    table.dispatch({
      type: 'RowDragStart',
      rowKeyValue: rowId
    });
  };

  // Handle column drag start
  const handleColumnDragStart = (columnKey: string) => {
    setDraggedColumn(columnKey);
    table.dispatch({
      type: 'ColumnDragStart',
      columnKey
    });
  };

  // Handle reordering of columns
  const handleReorderColumns = (columnKey: string, targetColumnKey: string) => {
    console.log(`Reordering column ${columnKey} to position of ${targetColumnKey}`);
    
    // Find the indices of the columns
    const columnIndex = columns.findIndex(col => col.key === columnKey);
    const targetIndex = columns.findIndex(col => col.key === targetColumnKey);
    
    if (columnIndex !== -1 && targetIndex !== -1) {
      // Create a new array with the reordered columns
      const newColumns = [...columns];
      const [movedColumn] = newColumns.splice(columnIndex, 1);
      newColumns.splice(targetIndex, 0, movedColumn);
      
      // Update the columns state
      setColumns(newColumns);
      
      // Force re-render
      setTableKey(prev => prev + 1);
    }
  };

  // Handle reordering of rows
  const handleReorderRows = (rowKeyValue: number, targetRowKeyValue: number) => {
    console.log(`Reordering row ${rowKeyValue} to position of ${targetRowKeyValue}`);
    
    // Find the indices of the rows
    const rowIndex = dataArray.findIndex((row: { id: number }) => row.id === rowKeyValue);
    const targetIndex = dataArray.findIndex((row: { id: number }) => row.id === targetRowKeyValue);
    
    if (rowIndex !== -1 && targetIndex !== -1) {
      // Create a new array with the reordered rows
      const newDataArray = [...dataArray];
      const [movedRow] = newDataArray.splice(rowIndex, 1);
      newDataArray.splice(targetIndex, 0, movedRow);
      
      // Update the dataArray state
      setDataArray(newDataArray);
      
      // Force re-render to ensure UI updates
      setTableKey(prev => prev + 1);
    }
  };

  // Custom dispatch function to handle our custom actions
  const customDispatch = (action: any) => {
    switch (action.type) {
      case REORDER_COLUMNS:
        handleReorderColumns(action.columnKey, action.targetColumnKey);
        break;
      case REORDER_ROWS:
        handleReorderRows(action.rowKeyValue, action.targetRowKeyValue);
        break;
      default:
        table.dispatch(action);
    }
  };
  
  return (
    <div className="main">
      <div
        className="table-container"
        ref={tableRef}
        style={{ overflowY: "auto", margin: "0 auto" }}
      >
        <Table
          key={tableKey}
          dispatch={customDispatch}
          columns={columns}
          data={dataArray}
          rowKeyField="id"
          editingMode={EditingMode.Cell}
          columnResizing
          childComponents={{
            headCell: {
              content: (props) => {
                const columnIcon = IconMapColumn[props.column.dataType || ""];
                if (props.column.key === "action") {
                  // Conditionally render the bulk delete button
                  return (
                    selectedRows.length > 0 && (
                      <button
                        onClick={handleBulkDelete}
                        style={{
                          display: "flex",
                          border: "none",
                          background: "transparent",
                          color: "gray",
                          justifyContent: "flex-end",
                          marginLeft: "auto",
                        }}
                      >
                        <FaTrash />
                      </button>
                    )
                  );
                }
                
                if (props.column.key === "AddColumn") {
                  return (
                    <AddNewColumn
                      columns={columns}
                      setColumns={setColumns}
                      table={table}
                    />
                  );
                }

                return (
                  <div 
                    style={{ 
                      display: "flex", 
                      alignItems: "center",
                      cursor: 'grab',
                      transition: 'all 0.3s ease'
                    }}
                    draggable={true}
                    onDragStart={() => handleColumnDragStart(props.column.key)}
                    onDragOver={(e) => {
                      e.preventDefault(); // Allow drop
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      // Use our tracked dragged column
                      if (draggedColumn && draggedColumn !== props.column.key) {
                        // Dispatch reorder action
                        customDispatch(reorderColumns(draggedColumn, props.column.key));
                        // Reset dragged column
                        setDraggedColumn(null);
                      }
                    }}
                  >
                    {columnIcon && (
                      <span
                        style={{
                          marginRight: "8px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {columnIcon}
                      </span>
                    )}
                    <ColumnPopover
                      columnKey={props.column.key}
                      currentTitle={props.column.title || ""}
                      columns={columns}
                      dataArray={dataArray}
                      setColumns={setColumns}
                      setDataArray={setDataArray}
                      setTableKey={setTableKey}
                    />
                  </div>
                );
              },
              elementAttributes: (_props) => ({
                className: 'ka-thead-cell-content',
                style: {
                  cursor: 'grab', // Show grab cursor for drag and drop
                  transition: 'all 0.3s ease', // Add smooth transition for animation
                }
              }),
            },
            cell: {
              content: ({ column, rowData }) => {
                if (column.key === "action") {
                  return (
                    <ActionButton
                      rowData={rowData}
                      rowId={rowData.id}
                      hoveredRow={hoveredRow}
                      isSelected={selectedRows.includes(rowData.id)}
                      toggleSelection={toggleSelection}
                      handleDeleteRow={handleDeleteRow}
                      selectedRows={selectedRows}
                    />
                  );
                }

                switch (column.dataType) {
                  case "Email":
                    return (
                      <EmailCell
                        value={rowData[column.key] || ""}
                        rowId={rowData.id}
                        columnKey={column.key}
                        onChange={handleCellValueChange}
                      />
                    );
                  case "Phone":
                    return (
                      <PhoneCell
                        value={rowData[column.key] || ""}
                        rowId={rowData.id}
                        columnKey={column.key}
                        onChange={handleCellValueChange}
                      />
                    );
                  case "MultiSelect":
                    return (
                      <MultiSelectCell
                        value={rowData[column.key] || ""}
                        rowId={rowData.id}
                        columnKey={column.key}
                        onChange={handleCellValueChange}
                        multiselectOptions={multiselectOptions}
                        setMultiSelectOptions={setMultiSelectOptions}
                      />
                    );
                  case "Select":
                    return (
                      <SelectCell
                        value={rowData[column.key] || ""}
                        rowId={rowData.id}
                        columnKey={column.key}
                        onChange={handleCellValueChange}
                        selectOptions={selectOptions}
                        setSelectOptions={setSelectOptions}
                      />
                    );
                  case "Status":
                    return (
                      <StatusCell
                        value={rowData[column.key] || ""}
                        rowId={rowData.id}
                        columnKey={column.key}
                        onChange={handleCellValueChange}
                      />
                    );
                  case DataType.Date:
                    return (
                      <DateCell
                        value={rowData[column.key] || null}
                        rowId={rowData.id}
                        columnKey={column.key}
                        onChange={handleCellValueChange}
                      />
                    );
                  default:
                    if (column.isEditable) {
                      return (
                        <input
                          type="text"
                          value={rowData[column.key] || ""}
                          onChange={(e) =>
                            handleCellValueChange(
                              rowData.id,
                              column.key,
                              e.target.value
                            )
                          }
                          style={{
                            width: "100%",
                            border: "none",
                            background: "transparent",
                          }}
                        />
                      );
                    }
                    return null;
                }
              },
            },
            
            dataRow: {
              elementAttributes: ({ rowData }) => ({
                onMouseEnter: () => setHoveredRow(rowData.id),
                onMouseLeave: () => setHoveredRow(null),
                draggable: true,
                onDragStart: () => handleRowDragStart(rowData.id),
                onDragOver: (e) => {
                  e.preventDefault(); // Allow drop
                },
                onDrop: (e) => {
                  e.preventDefault();
                  // Use our tracked dragged row
                  if (draggedRow !== null && draggedRow !== rowData.id) {
                    // Dispatch reorder action
                    customDispatch(reorderRows(draggedRow, rowData.id));
                    // Reset dragged row
                    setDraggedRow(null);
                  }
                },
                style: {
                  cursor: 'grab', // Show grab cursor for drag and drop
                  transition: 'all 0.3s ease', // Add smooth transition for animation
                }
              }),
            },

            tableFoot: {
              content: () => (
                <div className="add-row"  style={{
                  width: `${tableWidth}px` // Set width dynamically
                }}>
                  <button
                    onClick={handleAddRow}
                    style={{
                      textAlign: "left",
                      marginLeft: "67px",
                      border: "none",
                      background: "transparent",
                      color: "gray",
                    }}
                  >
                    <FaPlus style={{ marginRight: "5px" }} />
                    Add Row
                  </button>
                </div>
              ),
            },
          }}
        />
      </div>
    </div>
  );
};

export default KaTable;
