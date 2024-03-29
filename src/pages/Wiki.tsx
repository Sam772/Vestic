import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Wiki.css';
import { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import AppAppBar from '../components/AppAppBar';
import HeroWiki from '../components/HeroWiki';
import getLPTheme from '../getLPTheme';
import { Link } from 'react-router-dom';

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
  wikiPages: string[];
}

const Wiki: React.FC<WikiProps> = ({ createWikiPage, wikiPages }) => {

  const [mode, setMode] = React.useState<PaletteMode>('dark');
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  const [pageName, setPageName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the first wiki page if already exist
    if (wikiPages.length > 0) {
      const firstPage = wikiPages[0];
      navigate(`/wiki/wikis/${firstPage}`);
    }
  }, [navigate, wikiPages]);

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
      <HeroWiki />
      <Box sx={{ bgcolor: 'background.default', paddingTop: '60px' }}>
      </Box>
      {/* <ToggleCustomTheme
          showCustomTheme={showCustomTheme}
          toggleCustomTheme={toggleCustomTheme}
        /> */}
    </ThemeProvider>
  );
};

export default Wiki;
