import { Table, useTable } from "ka-table";
import { DataType, EditingMode } from "ka-table/enums";
import { Column } from "ka-table/models";
import { FaPlus } from 'react-icons/fa';
import React from 'react';

const KaTable = () => {
  const table = useTable();

  // Define initial columns
  const columns: Column[] = [
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
      key: 'AddColumn',
      style: { minWidth: 110 },
      isEditable: false,
    },
  ];

  // Initialize dataArray with empty values for dynamic input
  let dataArray = Array(7)
    .fill(undefined)
    .map((_, index) => ({
      id: index,
      Name: "",
      FatherName: "",
      DateOfBirth: "",
    }));

  const AddButton = () => {
    const handleAddColumn = () => {
      // Dispatch action to insert a new column at the end
      const newColumn: Column = {
        key: `NewColumn-${columns.length + 1}`,
        title: `New Column`,
        dataType: DataType.String,
        style: { minWidth: 199 },
        isEditable: true,  // Set the column to be editable
      };

      table.dispatch({
        type: 'InsertColumn',
        column: newColumn,
        index: columns.length - 1,  // Insert at the last position
      });
    };

    return (
      <div>
        <div onClick={handleAddColumn} style={{ marginBottom: '10px' }}>
          <FaPlus /> Add Column
        </div>
      </div>
    );
  };

  const AddROWButton = () => {
    const handleAddRow = () => {
      // Create the new row data with dynamic fields
      const newRow = {
        id: dataArray.length,  // Ensure unique row ID
        Name: "",
        FatherName: "",
        DateOfBirth: "",
      };

      // Dispatch the action to insert the new row
      table.dispatch({
        type: 'InsertRow',
        rowData: newRow,
        options: {
          insertRowPosition: "after",  // Insert at the end of the table
        },
      });
    };

    return (
      <div style={{ textAlign: "start", marginTop: '10px' }}>
        <div onClick={handleAddRow}>
          <FaPlus /> Add Row
        </div>
      </div>
    );
  };

  return (
    <div className="main">
      <div style={{ overflowX: "auto", marginLeft: "auto", marginRight: "auto" }} className="table-container">
        <div className="material-demo">
          <Table
            table={table}
            columns={columns}
            data={dataArray}  // Use the dynamic dataArray directly
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
          {/* Add Row Button at the bottom */}
          <div style={{ marginTop: "20px" }}>
            <AddROWButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KaTable;
