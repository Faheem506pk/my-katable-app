import { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import './App.css';
import KaTable from './components/Table';
import Navbar from './components/Navbar';
import 'ka-table/style.scss';

import Header from './components/Header';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Apply the theme mode to the <body> element using data-theme attribute
  useEffect(() => {
    if (darkMode) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.setAttribute('data-theme', 'light');
    }
  }, [darkMode]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <Header />
      <div style={{ padding: '1rem' }}>
        <KaTable />
      </div>
    </ThemeProvider>
  );
}

export default App;
