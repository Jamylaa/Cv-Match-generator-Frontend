import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';

const Header: React.FC = () => {
  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <WorkIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 1,
            }}
          >
            CV MATCHING
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={RouterLink}
              to="/candidates"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Candidates
            </Button>
            <Button
              component={RouterLink}
              to="/offers"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Job Offers
            </Button>
            <Button
              component={RouterLink}
              to="/matching"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Matching
            </Button>
            <Button
              component={RouterLink}
              to="/stats"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Statistics
            </Button>
          </Box>

          {/* Mobile menu would go here */}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

