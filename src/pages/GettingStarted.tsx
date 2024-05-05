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
            Thank you for visiting the website. Here's a quick guide to get started:
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            1) Workspace Creation
          </Typography>
          <Typography variant="body1" paragraph>
            Select the "Start Now" button below to be taken to the workspace creation page. There you can create your first workspace by inputting a name and description, then
            selecting "Create a Workspace".
          </Typography>
          <Link to="/workspacecreation">
            <Button variant="outlined">
                Start Now
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            2) Project Creation
          </Typography>
          <Typography variant="body1" paragraph>
            Once the workspace has been created, you will be navigated to the project creation page. A list of your workspaces will be listed on a sidebar to the
            left of the page. You can continue to create as many workspaces as you want, delete them, or edit their details.
            <br />
            <br />
            Now, you are set up to start creating projects, select the "Create New Project" button on the right side of the page to create a project. Input a name and description
            for your project, and select create. A project will appear with your details in the project area to the right of the sidebar, you can create as many projects as you
            wish within the same workspace, so you can use workspaces to group similar projects together, or if you have a specific team working within a specific workspace, this
            would be useful for that. You can also edit the details of your projects or delete them.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            3) Project Overview
          </Typography>
          <Typography variant="body1" paragraph>
            Select the project overview button on the project you want to manage, and you will be taken to its project overview. At first, you will see a Kanban board for your
            project, there are three default columns, New, Committed, and Done, you can create your tasks in the "New" column by inputting a name for your task and selecting "Create
            New Task." A new task will appear on the Kanban Board which displays default details such as the name of the task, the creator of the task, the iteration path of the
            task, which is the sprint, the state of the task, which is the column it is in, the item type of the task, which is the tag, and the due date, which is when the task
            must be completed.
            <br />
            <br />
            These columns represent the different states for your tasks. "New" means a task that you have decided which will be worked on, "Committed" means the task is currently in
            progress and being worked on, and "Done" means the task has been completed. This is a simple method to help you manage your tasks. To amend the details of your task,
            select the task, and a TaskModal window will open, this window will allow you to add and change the details of your task, which include the task name, description,
            comments, due date and time, files, sprints and tags. Explore these features and amend the task to your needs. It is also possible to delete the task from the TaskModal
            window or by using the hamburger icon on the Kanban Board view of the task.
            <br />
            <br />
            Right above the Kanban board is a filter view for your tasks, you can input in the filter field to only filter tasks by that name, multiple of the tasks that match the
            name in the field will appear on the board, while the other tasks will be removed temporarily until the filter is emptied. There are two other filters to the right of
            this, a sprint and tags filter, which work as you think, allowing you to filter your tasks by sprint, and tag. These filters can be used in combination with one another
            or individually, that is up to you how you want to use them.
            <br />
            <br />
            Furthermore, you can amend your column by selecting the name to update it. If you want to have different states, you can also add new ones, delete them, and change their
            position on the Kanban Board by using the right and left arrows. The Kanban Board's state will be automatically saved if you try to leave the page.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            4) Quality Assurance
          </Typography>
          <Typography variant="body1" paragraph>
            On the Kanban Board view, if you have multiple tasks, it would be a good idea to have tests written for them to ensure your testers can measure the quality of your
            application.
            <br />
            <br />
            To create a test case for your task, select the hamburger icon in the top right corner of the task and select "Add Test," this will open a window where you can add the
            name of your test, add steps, which are the actions to be taken to test the task in that particular order, and expected results for each step, which means that the step
            is working as intended. After this is done, you can save your test case by selecting "Create Test." A test case icon will appear on your task to indicate that there is
            a test case attached to the task.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            5) Project Analytics
          </Typography>
          <Typography variant="body1" paragraph>
            You may wish to collect data for your project for different purposes, such as company internal use or to display success values for your clients to give them trust.
            <br />
            <br />
            To view your project analytics, open the Kanban Board view on the project overview. On the filter view to the right, there should be a button called project analytics,
            select this. This will open up a modal that will contain the data for various metrics that are grouped into sections such as "General", "Sprint Analytics" and "Item
            Type  Analytics." You can use these metrics to have a data representation of your project, from the number of tasks to the completed number of features. This is to
            get an idea of the amount of work that has been done for a project over time.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            6) Wiki Pages
          </Typography>
          <Typography variant="body1" paragraph>
            It is important to document significantly important aspects and relevant parts of your project, this is what the Wiki Pages feature is for.
            <br />
            <br />
            By navigating via the navbar or the button below, you will be taken to the Wiki page. Select "Start Now" to be taken to the wiki creation page. Here, you can create a
            Wiki Page by inputting a wiki page name and selecting "Create Wiki." On the Wikis page, you can create more Wikis, delete them, or edit their names by selecting the
            name of the Wiki.
            <br />
            <br />
            On the box to the right, you can add and edit the content of that wiki page, there are a number of formatting options such as bold, italics, underlines, bullets, etc.
            Utilise all of these tools to add documentation to your wiki pages, this can be notes that someone needs to look at later, documentation for your knowledge of the
            project, how to get started with the project, etc. You can come up with what you want to document, don't forget to save the Wiki by selecting the save button.
          </Typography>
          <Link to="/wiki">
            <Button variant="outlined">
                To Wikis
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Container>
    </ThemeProvider>
  );
};

export default GettingStarted;
