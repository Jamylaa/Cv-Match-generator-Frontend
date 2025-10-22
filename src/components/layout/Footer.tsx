import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[200],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' '}
          <Link color="inherit" href="/">
            CV Matching System
          </Link>
          {' - AI-Powered Matching Intelligent System'}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {'Built with '}
          <Link color="inherit" href="https://reactjs.org/">
            React
          </Link>
          {' and '}
          <Link color="inherit" href="https://fastapi.tiangolo.com/">
            FastAPI
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;

