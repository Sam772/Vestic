import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { Button, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import Typography from '@mui/material/Typography';
import AppAppBar from '../components/AppAppBar';
import getLPTheme from '../getLPTheme';
import { Container, Grid } from '@mui/material';
import HeroProjectOverview from '../components/HeroProjectOverview';
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

const GettingStarted: React.FC = () => {

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

  let theme = createTheme();
  theme = responsiveFontSizes(theme);

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
    <CssBaseline />
    <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
    <HeroProjectOverview />
    <Container maxWidth="lg" style={{ paddingBottom: '2rem' }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h2" gutterBottom>
            Welcome to Vestic!
          </Typography>
          <Typography variant="body1" paragraph>
            Thank you for visiting the website. Here's a quick guide to getting started
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            1: Create a Workspace
          </Typography>
          <Typography variant="body1" paragraph>
            Select the start now button to be taken to the workspace creation page, there you will need to create your first workspace by inputting a name and description.
          </Typography>
          <Link to="/workspacecreation">
            <Button variant="outlined">
                Start Now
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            2: Create a project
          </Typography>
          <Typography variant="body1" paragraph>
            Once the workspace has been been created, you can continue to create more workspaces or create a project. You can create multiple projects within the same workspace,
            workspaces contain groups of projects, helping you to organise your work. Select the create a project button and input a name and description to create your
            first project. You can also edit or delete any projects.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            3: Project Overview
          </Typography>
          <Typography variant="body1" paragraph>
            Select the project overview button on your project to be taken to its project overview page, here there will be a Kanban board page which helps you to manage your
            project. You can create tasks, put them in any column, edit their details etc.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            4: Test Cases
          </Typography>
          <Typography variant="body1" paragraph>
            You can create test cases to test your tasks and ensure they are working.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            5: Project Analytics
          </Typography>
          <Typography variant="body1" paragraph>
            You can view the analytics of your project and various metrics including tasks completed or the amount of features or bugs.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            6: Project Wikis
          </Typography>
          <Typography variant="body1" paragraph>
            You can create wikis to document project information, guidelines, and more.
          </Typography>
        </Grid>
      </Grid>
    </Container>
    </ThemeProvider>
  );
};

export default GettingStarted;
