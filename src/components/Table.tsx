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

const KaTable = () => {
  const table = useTable();
  const [tableKey, setTableKey] = useState(0); // Used to force re-render
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableWidth, setTableWidth] = useState<number>(0);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

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
        .map((_, index) => ({ id: index, Name: "", Salary: null }));
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
  

  


  return (
    <div className="main">
      <div
        className="table-container"
        ref={tableRef}
        style={{ overflowY: "auto", margin: "0 auto" }}
      >
        <Table
          key={tableKey}
          table={table}
          columns={columns}
          data={dataArray}
          rowKeyField="id"
          editingMode={EditingMode.Cell}
          columnReordering
          rowReordering
          columnResizing
          childComponents={{
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
                  <div style={{ display: "flex", alignItems: "center" }}>
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
            },
            dataRow: {
              elementAttributes: ({ rowData }) => ({
                onMouseEnter: () => setHoveredRow(rowData.id),
                onMouseLeave: () => setHoveredRow(null),
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
