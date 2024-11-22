import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';

const Header = () => {
  const [taskName, setTaskName] = useState(localStorage.getItem('taskName') || 'Task Name');
  const [tableName, setTableName] = useState(localStorage.getItem('tableName') || 'Table Name');
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [isEditingTable, setIsEditingTable] = useState(false);

  const theme = useTheme(); // Use MUI theme

  useEffect(() => {
    localStorage.setItem('taskName', taskName);
  }, [taskName]);

  useEffect(() => {
    localStorage.setItem('tableName', tableName);
  }, [tableName]);

  const handleTaskClick = () => {
    setIsEditingTask(true);
  };

  const handleTableClick = () => {
    setIsEditingTable(true);
  };

  const handleTaskBlur = () => {
    setIsEditingTask(false);
  };

  const handleTableBlur = () => {
    setIsEditingTable(false);
  };

  return (
    <div>
      <div className="headings" style={{ marginTop: '80px' }}>
        <div className="inner-headings ">
          {isEditingTask ? (
            <input
              value={taskName}
             
              onChange={(e) => setTaskName(e.target.value)}
              onBlur={handleTaskBlur}
              autoFocus
              style={{
                fontSize: '40px',
                fontWeight: 'bold',
                border: 'none',
                outline: 'none',
                textDecoration: 'underline',
                color: theme.palette.text.primary,
              }}
            />
          ) : (
            <Typography
              onClick={handleTaskClick}
              style={{
                cursor: 'pointer',
                fontSize: '40px',
                fontWeight: 'bold',
                border: 'none',
                outline: 'none',
                color: theme.palette.text.secondary,
              }}
            >
              {taskName}
            </Typography>
          )}

          {isEditingTable ? (
            <input
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              onBlur={handleTableBlur}
              autoFocus
              style={{
                fontSize: '16px',
                fontWeight: '400',
                border: 'none',
                outline: 'none',
                textDecoration: 'underline',
                color: theme.palette.text.primary,
              }}
            />
          ) : (
            <Typography
              onClick={handleTableClick}
              style={{
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '450',
                border: 'none',
                outline: 'none',
                color: theme.palette.text.disabled,
              }}
            >
              {tableName}
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
