import { useState, useEffect } from "react";
import { Table, useTable } from "ka-table";
import { DataType, EditingMode } from "ka-table/enums";
import { Column } from "ka-table/models";
import { FaPlus } from "react-icons/fa";
import { Button } from "@mui/material";
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
          width: 30,
          isResizable: false,
          isEditable: false,
          title: "",
        },
        {
          key: "Name",
          title: "Name",
          dataType: "string",
          style: { minWidth: 199 },
          isEditable: true,
        },
        {
          key: "Salary",
          title: "Salary",
          dataType: DataType.Number,
          style: { minWidth: 199 },
          isEditable: true,
        },
        {
          key: "Email",
          title: "Email",
          dataType: "Email",
          style: { minWidth: 199 },
          isEditable: true,
        },
        {
          key: "AddColumn",
          style: { minWidth: 140 },
          isEditable: false,
          isResizable: false,
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
    const maxId = Math.max(...dataArray.map((row: { id: any; }) => row.id), 0);
    setDataArray([...dataArray, { id: maxId + 1, Name: "", Salary: null }]);
  };

  // Handle cell value changes
  const handleCellValueChange = (
    rowKey: number,
    columnKey: string,
    value: string
  ) => {
    const updatedData = dataArray.map((row: { id: number; }) =>
      row.id === rowKey ? { ...row, [columnKey]: value } : row
    );
    setDataArray(updatedData);
  };

  // Delete a row
  const handleDeleteRow = (rowId: number) => {
    const updatedDataArray = dataArray.filter((row: { id: number; }) => row.id !== rowId);
    setDataArray(updatedDataArray);
    localStorage.setItem("tableData", JSON.stringify(updatedDataArray));
    setTableKey((prevKey) => prevKey + 1);
  };

  // Persist columns and data changes
  useEffect(() => {
    const columnsWithAddColumn = columns.filter(
      (col) => col.key !== "AddColumn"
    );
    columnsWithAddColumn.push({
      key: "AddColumn",
      title: "Add Column",
      style: { minWidth: 110 },
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

  return (
    <div className="main">
      <div
        className="table-container"
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
                      handleDeleteRow={handleDeleteRow}
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
                      <span style={{ marginRight: "8px", display: "flex", alignItems: "center" }}>
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
          }}
        />
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Button variant="contained" color="primary" onClick={handleAddRow}>
            <FaPlus style={{ marginRight: "5px" }} />
            Add Row
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KaTable;
