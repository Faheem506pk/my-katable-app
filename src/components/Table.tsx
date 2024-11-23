import { Table, useTable } from "ka-table";
import { DataType, EditingMode } from "ka-table/enums";
import { Column } from "ka-table/models";
import { FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";

const KaTable = () => {
  // Initialize columns from localStorage or with defaults
  const [columns, setColumns] = useState<Column[]>(() => {
    const savedColumns = JSON.parse(localStorage.getItem("tableColumns") || "[]");

    if (!savedColumns || savedColumns.length === 0) {
      return [
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
        {
          key: "AddColumn",
          style: { minWidth: 110 },
          isEditable: false,
        },
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

  useEffect(() => {
    const columnsWithAddColumn = columns.filter((col) => col.key !== "AddColumn");
    columnsWithAddColumn.push({
      key: "AddColumn",
      title: "Add Column",
      style: { minWidth: 110 },
      isEditable: false,
    });

    localStorage.setItem("tableColumns", JSON.stringify(columnsWithAddColumn));
    localStorage.setItem("tableData", JSON.stringify(dataArray));
  }, [columns, dataArray]);

  const handleAddColumn = () => {
    const newColumn: Column = {
      key: `NewColumn-${columns.length + 1}`,
      title: `New Column`,
      dataType: DataType.String,
      style: { minWidth: 199 },
      isEditable: true,
    };

    const indexOfAddColumn = columns.findIndex((col) => col.key === "AddColumn");
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
    const newRow = {
      id: dataArray.length,
      Name: "",
      FatherName: "",
      DateOfBirth: "",
    };

    setDataArray([...dataArray, newRow]);
  };

  const initializeRows = () => {
    const emptyRows = Array(5)
      .fill(null)
      .map((_, index) => ({
        id: index,
        Name: "",
        FatherName: "",
        DateOfBirth: "",
      }));

    setDataArray(emptyRows);
  };

  useEffect(() => {
    if (dataArray.length === 0) {
      initializeRows();
    }
  }, [dataArray]);

  const AddButton = () => (
    <Button onClick={handleAddColumn}>
      <FaPlus />
    </Button>
  );

  // Handle cell value updates
  const handleCellValueChange = (rowKey: any, columnKey: string, value: string) => {
    const updatedData = dataArray.map((row: { id: any; }) =>
      row.id === rowKey ? { ...row, [columnKey]: value } : row
    );
    setDataArray(updatedData); // Update state
  };

  return (
    <div className="main">
      <div
        style={{
          overflowX: "auto",
          marginLeft: "auto",
          marginRight: "auto",
        }}
        className="table-container"
      >
        <Table
          table={table}
          columns={columns}
          data={dataArray}
          rowKeyField="id"
          editingMode={EditingMode.Cell}
          childComponents={{
            cell: {
              content: (props) => {
                const { column, rowData } = props;

                // Editable cell
                if (column.isEditable) {
                  return (
                    <input
                      type="text"
                      value={rowData[column.key] || ""}
                      onChange={(e) =>
                        handleCellValueChange(rowData.id, column.key, e.target.value)
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
