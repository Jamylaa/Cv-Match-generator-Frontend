import React from 'react';
import { Typography, Box, Card, CardContent, Button, Paper } from '@mui/material';
import { Grid } from '../components/common';
import { Link as RouterLink } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import BarChartIcon from '@mui/icons-material/BarChart';

const HomePage: React.FC = () => {
  return (
    <Box>
      <Paper 
        elevation={0}
        sx={{
          p: 6,
          mb: 4,
          backgroundColor: (theme) => theme.palette.primary.light,
          color: 'white',
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          AI-Powered CV Matching System
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Match the right candidates with the right job offers using advanced AI technology
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <PersonIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography gutterBottom variant="h5" component="h2">
                Candidates
              </Typography>
              <Typography>
                Manage candidate profiles and CVs with automatic skill extraction
              </Typography>
            </CardContent>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Button 
                variant="contained" 
                component={RouterLink} 
                to="/candidates"
              >
                Manage Candidates
              </Button>
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <WorkIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography gutterBottom variant="h5" component="h2">
                Job Offers
              </Typography>
              <Typography>
                Create and manage job offers with intelligent skill requirements analysis
              </Typography>
            </CardContent>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Button 
                variant="contained" 
                component={RouterLink} 
                to="/offers"
              >
                Manage Offers
              </Button>
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <CompareArrowsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography gutterBottom variant="h5" component="h2">
                Matching
              </Typography>
              <Typography>
                Match candidates with job offers using our advanced AI matching algorithm
              </Typography>
            </CardContent>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Button 
                variant="contained" 
                component={RouterLink} 
                to="/matching"
              >
                Start Matching
              </Button>
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <BarChartIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography gutterBottom variant="h5" component="h2">
                Statistics
              </Typography>
              <Typography>
                View detailed statistics and analytics about matching results and skills
              </Typography>
            </CardContent>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Button 
                variant="contained" 
                component={RouterLink} 
                to="/stats"
              >
                View Statistics
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Features
        </Typography>
        <Typography variant="body1" paragraph>
          • Advanced AI matching with vector embeddings<br />
          • MongoDB database integration<br />
          • Anomaly detection and data quality monitoring<br />
          • Automated testing with AI validation<br />
          • Real-time performance monitoring<br />
          • Personalized recommendations<br />
          • External AI API integration (OpenAI, Hugging Face)<br />
          • Persistent data storage and analytics
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;

