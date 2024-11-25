import { Button } from '@mui/material';
import { FaPlus } from 'react-icons/fa';
import { Column } from 'ka-table/models';
import { DataType} from "ka-table/enums";

interface AddNewColumnProps {
    columns: Column[];
    setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
    table: any; 
  }

  export default function AddNewColumn({ columns, setColumns, table }: AddNewColumnProps) {
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

  return (
    <div>
      <Button onClick={handleAddColumn}>
      <FaPlus />
    </Button>
    </div>
  )
}
