import React, { useState, useEffect, useRef } from 'react';
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
import { Button as MUIButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import '../pages/Analytics'

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
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setInputValue(prevValue => prevValue + '\n');
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const handleSave = () => {
    // Here you can handle the logic to save the input value
    localStorage.setItem(pageName, inputValue);
  }

  // Function to apply formatting to the selected text
  const applyFormat = (format: string, inputValue: string) => {
    const input = inputRef.current;
  
    if (input) {
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;
  
      console.log('Input:', input);
      console.log('Selection Start:', selectionStart);
      console.log('Selection End:', selectionEnd);
  
      if (selectionStart !== null && selectionEnd !== null) {
        const selectedText = inputValue.substring(selectionStart, selectionEnd);
        const prefix = inputValue.substring(0, selectionStart);
        const suffix = inputValue.substring(selectionEnd);
  
        let formattedText = '';
  
        switch (format) {
          case 'bold':
            formattedText = `<strong>${selectedText}</strong>`;
            break;
          case 'italic':
            formattedText = `<em>${selectedText}</em>`;
            break;
          case 'underline':
            formattedText = `<u>${selectedText}</u>`;
            break;
          default:
            break;
        }
  
        const newText = `${prefix}${formattedText}${suffix}`;
  
        console.log('New Text:', newText);
        setInputValue(newText);
  
        // Move cursor to the end of the inserted text
        input.setSelectionRange(selectionStart + formattedText.length, selectionStart + formattedText.length);
      } else {
        console.log('No text selected.');
      }
    } else {
      console.log('Input element is null.');
    }
  };
  

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <CssBaseline />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Box sx={{ bgcolor: 'background.default', paddingTop: '80px', flex: '1', padding: '80px', textAlign: 'center' }}>
        <div className="main-content">
          <textarea
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter text..."
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                marginBottom: '20px',
                minHeight: '200px',
              }}
            />
          <br />
          <button className='new-button' onClick={() => applyFormat('bold', inputValue)}><MUIButton>Bold</MUIButton></button>
          <button className='new-button' onClick={() => applyFormat('italic', inputValue)}><MUIButton>Italic</MUIButton></button>
          <button className='new-button' onClick={() => applyFormat('underline', inputValue)}><MUIButton>Underline</MUIButton></button>
          <button className='new-button' onClick={handleSave}><MUIButton variant='outlined'>Save</MUIButton></button>
        </div>
        <div style={{ flex: 1, marginLeft: '20px', whiteSpace: 'pre-wrap' }}>
          <p dangerouslySetInnerHTML={{ __html: inputValue }}></p>
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
