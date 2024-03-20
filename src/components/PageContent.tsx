import React, { useState, useEffect } from 'react';
import { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import AppAppBar from '../components/AppAppBar';
import Hero from '../components/Hero';
import getLPTheme from '../getLPTheme';

interface ToggleCustomThemeProps {
  showCustomTheme: Boolean;
  toggleCustomTheme: () => void;
}

function ToggleCustomTheme({
  showCustomTheme,
  toggleCustomTheme,
}: ToggleCustomThemeProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100dvw',
        position: 'fixed',
        bottom: 24,
      }}
    >
      <ToggleButtonGroup
        color="primary"
        exclusive
        value={showCustomTheme}
        onChange={toggleCustomTheme}
        aria-label="Platform"
        sx={{
          backgroundColor: 'background.default',
          '& .Mui-selected': {
            pointerEvents: 'none',
          },
        }}
      >
        <ToggleButton value>
          <AutoAwesomeRoundedIcon sx={{ fontSize: '20px', mr: 1 }} />
          Custom theme
        </ToggleButton>
        <ToggleButton value={false}>Material Design 2</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

interface PageContentProps {
  pageName: string;
}

const PageContent: React.FC<PageContentProps> = ({ pageName }) => {
  const [mode, setMode] = React.useState<PaletteMode>('dark');
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Load input value from localStorage when pageName changes
    console.log('Loading input value for page:', pageName);
    const savedValue = localStorage.getItem(pageName);
    console.log('Saved value:', savedValue);
    setInputValue(savedValue || '');
  }, [pageName]);

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSave = () => {
    // Here you can handle the logic to save the input value
    localStorage.setItem(pageName, inputValue);
  }

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <CssBaseline />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Box sx={{ bgcolor: 'background.default', paddingTop: '80px', flex: '1', padding: '80px', textAlign: 'center' }}>
        <div className="main-content">
          <h2>Main Content</h2>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter text..."
            style={{
              width: '80%',
              padding: '10px',
              fontSize: '16px',
              marginBottom: '20px',
              height: '200px',
            }}
          />
          <br />
          <button onClick={handleSave}>Save</button>
        </div>
      </Box>
      <ToggleCustomTheme
        showCustomTheme={showCustomTheme}
        toggleCustomTheme={toggleCustomTheme}
      />
    </ThemeProvider>
  );
};

export default PageContent;
