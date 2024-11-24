import { useState, useEffect } from "react";
import { Table, useTable } from "ka-table";
import { DataType, EditingMode } from "ka-table/enums";
import { Column } from "ka-table/models";
import { FaPlus } from "react-icons/fa";
import { Button } from "@mui/material";
import ColumnPopover from "./ColumnPopover";
import ActionButton from "./ActionButton"; 
import AddNewColumn from "./AddNewColumn";
import DatePicker from "react-datepicker";


const KaTable = () => {
  const [columns, setColumns] = useState<Column[]>(() => {
    const savedColumns = JSON.parse(
      localStorage.getItem("tableColumns") || "[]"
    );

    if (!savedColumns || savedColumns.length === 0) {
      return [
        { key: "action", width: 30, isResizable: false , isEditable: false, title: ""},
        {
          key: "Name",
          title: "Name",
          dataType: DataType.String,
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
          key: "DateOfBirth",
          title: "Date Of Birth",
          dataType: DataType.Date,
          style: { minWidth: 199 },
          isEditable: true,
        },
        { key: "AddColumn", style: { minWidth: 140 }, isEditable: false, isResizable: false },
      ];
    }

    const columnKeys = savedColumns.map((col: Column) => col.key);
    if (!columnKeys.includes("AddColumn")) {
      savedColumns.push({
        key: "AddColumn",
        title: "Add Column",
        style: { minWidth: 110 },
        isEditable: false,
      });
    }
    return savedColumns;
  });

  const [dataArray, setDataArray] = useState(
    JSON.parse(localStorage.getItem("tableData") || "[]") || []
  );

  const table = useTable();
  const [tableKey, setTableKey] = useState(0); // Track key to force table re-render
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

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

  
  const handleAddRow = () => {
    const maxId = Math.max(...dataArray.map((row: { id: any; }) => row.id), 0);
    const newRow = {
      id: maxId + 1,
      Name: "",
      Salary: null,
      DateOfBirth: new Date(),
    };
    setDataArray([...dataArray, newRow]);
  };

  useEffect(() => {
    if (dataArray.length === 0) {
      const emptyRows = Array(5)
        .fill(null)
        .map((_, index) => ({
          id: index,
          Name: "",
          Salary: null,
          DateOfBirth: new Date(),
        }));
      setDataArray(emptyRows);
    }
  }, [dataArray]);

  const handleCellValueChange = (
    rowKey: any,
    columnKey: string,
    value: string
  ) => {
    const updatedData = dataArray.map((row: { id: any }) =>
      row.id === rowKey ? { ...row, [columnKey]: value } : row
    );
    setDataArray(updatedData);
  };
  
  const handleDeleteRow = (rowData: any) => {
        const updatedDataArray = dataArray.filter((row: { id: any }) => row.id !== rowData);
    
        // Update the dataArray state
        setDataArray(updatedDataArray);
    
        // Save updated dataArray to localStorage
        localStorage.setItem("tableData", JSON.stringify(updatedDataArray));
    
        // Trigger re-render by updating tableKey if necessary
        setTableKey((prevKey) => prevKey + 1);
      };
 
  return (
    <div className="main">
      <div
        style={{ overflowX: "auto", marginLeft: "auto", marginRight: "auto" }}
        className="table-container"
      >
       
        <Table
          key={tableKey}
          table={table}
          columns={columns}
          data={dataArray}
          rowKeyField={'id'}
          editingMode={EditingMode.Cell}
          columnReordering={true}
          rowReordering={true}
          columnResizing={true}
          
          childComponents={{
            cell: {
              content: (props) => {
                const { column, rowData } = props;
            
                switch (props.column.key) {
                  case "action":
                    return <ActionButton rowData={props.rowData} rowId={props.rowData.id}  hoveredRow={hoveredRow}  handleDeleteRow={handleDeleteRow} />; 
                }
            
                if (column.dataType === DataType.Date) {
                  return (
                    <DatePicker
                      selected={rowData[column.key] ? new Date(rowData[column.key]) : null}  // Ensure the date is valid
                      onChange={(date: Date | null) => {
                        // Handle date change, ensure null is handled
                        if (date) {
                          handleCellValueChange(rowData.id, column.key, date.toISOString());
                        } else {
                          handleCellValueChange(rowData.id, column.key, "");  // Handle null case
                        }
                      }}
                      dateFormat="yyyy-MM-dd" // Format the date
                      className="date-picker" // Add your custom styles if needed
                    />
                  );
                } else if (column.isEditable) {
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
              },
            },
            
            headCell: {
              content: (props) => {
                if (props.column.key === "AddColumn") {
                  return <AddNewColumn columns={columns} setColumns={setColumns} table={table} />;
                }
                return (
                  <ColumnPopover
                    columnKey={props.column.key}
                    currentTitle={props.column.title || ""}
                    columns={columns}
                    dataArray={dataArray}
                    setColumns={setColumns}
                    setDataArray={setDataArray}
                    setTableKey={setTableKey}
                  />
                );
              },
            },
            dataRow: {
              elementAttributes: ({rowData}) => {
                const rowKey = rowData.id;  
                return {
                  onMouseEnter: () => {          
                    setHoveredRow(rowKey);
                  },
                  onMouseLeave: () => {
                    setHoveredRow(null);
                  },
                };
              },
            },
          }}
        />
        
        <div style={{ marginTop: "20px" }}>
          <Button onClick={handleAddRow}>
            <FaPlus /> Add Row
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KaTable;
