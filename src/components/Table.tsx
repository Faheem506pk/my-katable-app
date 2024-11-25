import { useState, useEffect } from "react";
import { Table, useTable } from "ka-table";
import { DataType, EditingMode } from "ka-table/enums";
import { Column } from "ka-table/models";
import { FaPlus } from "react-icons/fa";
import { Button } from "@mui/material";
import { MdDragIndicator } from "react-icons/md";
import ColumnPopover from "./ColumnPopover";
import { MdDeleteOutline } from "react-icons/md";

const KaTable = () => {
  const [columns, setColumns] = useState<Column[]>(() => {
    const savedColumns = JSON.parse(
      localStorage.getItem("tableColumns") || "[]"
    );

    if (!savedColumns || savedColumns.length === 0) {
      return [
        { key: "action", width: 30, isEditable: false, title: "" },
        {
          key: "Name",
          title: "Name",
          dataType: DataType.String,
          style: { minWidth: 199 },
         
          isEditable: true,
          
        },
        {
          key: "FatherName",
          title: "Father Name",
          dataType: DataType.String,
         
          style: { minWidth: 199 },
          isEditable: true,
          
        },
        {
          key: "DateOfBirth",
          title: "Date Of Birth",
          dataType: DataType.String,
          
          style: { minWidth: 199 },
          isEditable: true,
          
        },
        { key: "AddColumn", style: { minWidth: 140 }, isEditable: false },
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

  const handleRenameColumn = (key: string, newTitle: string) => {
    const updatedColumns = columns.map((col) =>
      col.key === key ? { ...col, title: newTitle } : col
    );
    // Update the columns state
    setColumns(updatedColumns);
    // Reset the table key to force a full re-render
    setTableKey((prevKey) => prevKey + 1);
    // Save the updated columns to localStorage
    localStorage.setItem("tableColumns", JSON.stringify(updatedColumns));
  };

  const handleDeleteColumn = (columnKey: string) => {
    // Remove the column from the columns state
    const updatedColumns = columns.filter((col) => col.key !== columnKey);

    // Remove the column data from each row in dataArray
    const updatedDataArray = dataArray.map((row: { [x: string]: any }) => {
      const { [columnKey]: deletedColumn, ...rest } = row; // Destructure to remove the column
      return rest;
    });

    // Update the columns and dataArray states
    setColumns(updatedColumns);
    setDataArray(updatedDataArray);

    // Save updated columns and dataArray to localStorage
    localStorage.setItem("tableColumns", JSON.stringify(updatedColumns));
    localStorage.setItem("tableData", JSON.stringify(updatedDataArray));

    // Trigger re-render by updating tableKey
    setTableKey((prevKey) => prevKey + 1);
  };

  const handleAddColumn = () => {
    const newColumn: Column = {
      key: `NewColumn-${columns.length + 1}`,
      title: `NewColumn-${columns.length + 1}`,
      dataType: DataType.String,
      style: { minWidth: 199 },
      isEditable: true,
    };

    const indexOfAddColumn = columns.findIndex(
      (col) => col.key === "AddColumn"
    );
    const updatedColumns = [
      ...columns.slice(0, indexOfAddColumn),
      newColumn,
      ...columns.slice(indexOfAddColumn),
    ];

    setColumns(updatedColumns);

    table.dispatch({
      type: "InsertColumn",
      column: newColumn,
      index: indexOfAddColumn,
    });
  };

  const handleAddRow = () => {
    const maxId = Math.max(...dataArray.map((row: { id: any; }) => row.id), 0);
    const newRow = {
      id: maxId + 1,
      Name: "",
      FatherName: "",
      DateOfBirth: "",
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
          FatherName: "",
          DateOfBirth: "",
        }));
      setDataArray(emptyRows);
    }
  }, [dataArray]);

  const AddButton = () => (
    <Button onClick={handleAddColumn}>
      <FaPlus />
    </Button>
  );

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
  const handleDeleteRow = (rowKey: any) => {
        const updatedDataArray = dataArray.filter((row: { id: any }) => row.id !== rowKey);
    
        // Update the dataArray state
        setDataArray(updatedDataArray);
    
        // Save updated dataArray to localStorage
        localStorage.setItem("tableData", JSON.stringify(updatedDataArray));
    
        // Trigger re-render by updating tableKey if necessary
        setTableKey((prevKey) => prevKey + 1);
      };
 
  const ActionButton = ({
    rowId,
    rowData,
  }: {
    rowId: any;
    rowData: any;
  }) => (
    hoveredRow === rowId ? (
      <div style={{ display: "flex" }}>
        <MdDeleteOutline
          style={{ cursor: "pointer" }}
          onClick={() => handleDeleteRow(rowData.id)}
        />
        <MdDragIndicator style={{ cursor: "move" }} />
      </div>
    ) : null
  );
  
  return (
    <div className="main">
      <div
        style={{ overflowX: "auto", marginLeft: "auto", marginRight: "auto" }}
        className="table-container"
      >
        {/* Add dynamic key to force table re-render */}
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
                    return <ActionButton rowData={props.rowData} rowId={props.rowData.id} />; 
                }
                

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
              },
            },
            headCell: {
              content: (props) => {
                if (props.column.key === "AddColumn") {
                  return <AddButton />;
                }
                return (
                  <ColumnPopover
                    columnKey={props.column.key}
                    currentTitle={props.column.title || ""}
                    onRename={handleRenameColumn}
                    onDelete={handleDeleteColumn}
                  />
                );
              },
            },
            dataRow: {
              elementAttributes: ({ rowData}) => {
              
                const rowKey = rowData.id;  // Directly use the rowKeyField, which should be a number (e.g., row.id)
               

                return {
                  onMouseEnter: () => {
                    console.log("Row hovered:", rowKey); // Debugging
                    console.log("Row hovered rowData:", rowData); // Debugging
                    setHoveredRow(rowKey);
                  },
                  onMouseLeave: () => {
                    console.log("Row left:", rowKey); // Debugging
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
