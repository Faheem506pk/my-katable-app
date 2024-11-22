import { Table, useTable } from "ka-table";
import { DataType, EditingMode } from "ka-table/enums";
import { Column } from "ka-table/models";
import { FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Button} from "@mui/material";

const KaTable = () => {
  // Initialize columns from localStorage or with defaults
  const [columns, setColumns] = useState<Column[]>(() => {
    // Load from localStorage or fallback to default
    const savedColumns = JSON.parse(localStorage.getItem("tableColumns") || "[]");

    // If no saved columns, set the default columns including AddColumn
    if (!savedColumns || savedColumns.length === 0) {
      return [
        {
          key: "Name",
          title: "Name",
          dataType: DataType.String,
          style: { minWidth: 199 },
        },
        {
          key: "FatherName",
          title: "Father Name",
          dataType: DataType.String,
          style: { minWidth: 199 },
        },
        {
          key: "DateOfBirth",
          title: "Date Of Birth",
          dataType: DataType.String,
          style: { minWidth: 199 },
        },
        {
          key: "AddColumn",
          style: { minWidth: 110 },
          isEditable: false,
        },
      ];
    }

    // Ensure AddColumn is included when loading from localStorage
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

  // KaTable hook
  const table = useTable();

  // Save columns and data to localStorage when they change
  useEffect(() => {
    // Ensure AddColumn is always present in the columns list
    const columnsWithAddColumn = columns.filter(col => col.key !== 'AddColumn');
    columnsWithAddColumn.push({
      key: 'AddColumn',
      title: 'Add Column',
      style: { minWidth: 110 },
      isEditable: false,
    });

    // Persist columns to localStorage
    localStorage.setItem("tableColumns", JSON.stringify(columnsWithAddColumn));

    // Persist data to localStorage
    localStorage.setItem("tableData", JSON.stringify(dataArray));
  }, [columns, dataArray]);

  // Function to add new column before the "AddColumn"
  const handleAddColumn = () => {
    const newColumn: Column = {
      key: `NewColumn-${columns.length + 1}`,
      title: `New Column`,
      dataType: DataType.String,
      style: { minWidth: 199 },
      isEditable: true,
    };

    // Insert the new column before the "AddColumn"
    const indexOfAddColumn = columns.findIndex(col => col.key === 'AddColumn');
    const updatedColumns = [
      ...columns.slice(0, indexOfAddColumn),
      newColumn,
      ...columns.slice(indexOfAddColumn),
    ];

    setColumns(updatedColumns);

    // Dispatch KaTable to update internal columns
    table.dispatch({
      type: "InsertColumn",
      column: newColumn,
      index: indexOfAddColumn, // Add column at the correct index
    });
  };

  // Function to add new row
  const handleAddRow = () => {
    const newRow = {
      id: dataArray.length,
      Name: "",
      FatherName: "",
      DateOfBirth: "",
    };

    const newDataArray = [...dataArray, newRow];
    setDataArray(newDataArray); // Update state to trigger localStorage update
  };

  // Function to initialize 4-5 empty rows
  const initializeRows = () => {
    const emptyRows = Array(5).fill({
      id: Math.random(), // Random ID to ensure uniqueness
      Name: "",
      FatherName: "",
      DateOfBirth: "",
    });

    setDataArray(emptyRows); // Initialize with 5 empty rows
  };

  useEffect(() => {
    if (dataArray.length === 0) {
      initializeRows(); // Initialize rows when data is empty
    }
  }, [dataArray]);

  const AddButton = () => {
    return (
      <div>
        <Button onClick={handleAddColumn}>
          <FaPlus />
        </Button>
      </div>
    );
  };

  return (
    <div className="main">
      <div style={{ overflowX: "auto", marginLeft: "auto", marginRight: "auto" }} className="table-container">
        {/* Render the KaTable component */}
        <Table
          table={table}
          columns={columns} // Pass the columns to KaTable
          data={dataArray}
          rowKeyField="id"
          editingMode={EditingMode.Cell}
          childComponents={{
            headCell: {
              content: (props) => {
                if (props.column.key === 'AddColumn') {
                  return <AddButton />;
                }
              }
            }
          }}
        />

        <div style={{ marginTop: "20px" }}>
          {/* Button to add new row */}
          <Button onClick={handleAddRow}>
            <FaPlus /> Add Row
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KaTable;
