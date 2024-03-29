import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Wiki.css';
import { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import AppAppBar from '../components/AppAppBar';
import Hero from '../components/Hero';
import getLPTheme from '../getLPTheme';
import TextField from '@mui/material/TextField';
import { Button as MUIButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import Typography from '@mui/material/Typography';

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

interface WikiProps {
  createWikiPage: (pageName: string) => void;
}

const Wiki: React.FC<WikiProps> = ({ createWikiPage }) => {

  const [mode, setMode] = React.useState<PaletteMode>('dark');
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  let theme = createTheme();
  theme = responsiveFontSizes(theme);

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  const [pageName, setPageName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createWikiPage(pageName);
    navigate(`/wiki/wikis/${pageName}`);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageName(event.target.value);
  };

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <CssBaseline />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Box sx={{ bgcolor: 'background.default', paddingTop: '60px' }}>
        <div className="wiki-container">
          <ThemeProvider theme={theme}>
            <Typography variant="h6">
              <h1 className="wiki-heading">Create a Wiki</h1>
            </Typography>
          </ThemeProvider>
          <form className="wiki-form" onSubmit={handleSubmit}>
            <ThemeProvider theme={theme}>
              <Typography variant="subtitle1" sx={{ textAlign: 'center'}}>
                <label htmlFor="pageName" className="wiki-label">Enter Wiki Name</label>
              </Typography>
            </ThemeProvider>
            <TextField
              type="text"
              multiline
              variant="outlined"
              placeholder='Enter text...'
              className="wiki-input"
              required
              value={pageName}
              onChange={handleChange}
            />
            {/* <input
              type="text"
              id="pageName"
              value={pageName}
              onChange={handleChange}
              className="wiki-input"
              required
            /> */}
            <button type="submit" className="new-button"><MUIButton variant='outlined'>Create Wiki</MUIButton></button>
          </form>
        </div>
      </Box>
      {/* <ToggleCustomTheme
          showCustomTheme={showCustomTheme}
          toggleCustomTheme={toggleCustomTheme}
        /> */}
    </ThemeProvider>
  );
};

export default Wiki;
