import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Chip, 
  Button, 
  Divider, 
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import { Grid } from '../../components/common';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { candidatesApi, matchingApi } from '../../services/api';
import { Candidate } from '../../types';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import EditIcon from '@mui/icons-material/Edit';

const CandidateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchCandidate(id);
    }
  }, [id]);

  const fetchCandidate = async (candidateId: string) => {
    try {
      setLoading(true);
      const data = await candidatesApi.getById(candidateId);
      setCandidate(data);
      fetchRecommendations(candidateId);
      setError(null);
    } catch (err) {
      setError('Failed to fetch candidate details. Please try again later.');
      console.error('Error fetching candidate:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async (candidateId: string) => {
    try {
      setLoadingRecommendations(true);
      const response = await matchingApi.getRecommendations(candidateId);
      setRecommendations(response.recommendations || []);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !candidate) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error || 'Candidate not found'}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Candidate Profile
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            component={RouterLink}
            to={`/candidates/edit/${id}`}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<CompareArrowsIcon />}
            component={RouterLink}
            to={`/matching/${id}`}
          >
            Match with Jobs
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                {candidate.name}
              </Typography>
              {candidate.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                  <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body1">{candidate.location}</Typography>
                </Box>
              )}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <List dense>
              {candidate.email && (
                <ListItem>
                  <EmailIcon sx={{ mr: 2 }} />
                  <ListItemText 
                    primary="Email" 
                    secondary={candidate.email} 
                  />
                </ListItem>
              )}
              
              {candidate.phone && (
                <ListItem>
                  <PhoneIcon sx={{ mr: 2 }} />
                  <ListItemText 
                    primary="Phone" 
                    secondary={candidate.phone} 
                  />
                </ListItem>
              )}
              
              {candidate.experience_years !== undefined && (
                <ListItem>
                  <WorkIcon sx={{ mr: 2 }} />
                  <ListItemText 
                    primary="Experience" 
                    secondary={`${candidate.experience_years} years`} 
                  />
                </ListItem>
              )}
              
              {candidate.salary_expectation !== undefined && (
                <ListItem>
                  <AttachMoneyIcon sx={{ mr: 2 }} />
                  <ListItemText 
                    primary="Salary Expectation" 
                    secondary={`$${candidate.salary_expectation.toLocaleString()}`} 
                  />
                </ListItem>
              )}
              
              {candidate.availability && (
                <ListItem>
                  <EventAvailableIcon sx={{ mr: 2 }} />
                  <ListItemText 
                    primary="Availability" 
                    secondary={candidate.availability.replace('_', ' ')} 
                  />
                </ListItem>
              )}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {candidate.skills.map((skill, index) => (
                  <Chip key={index} label={skill} />
                ))}
                {candidate.skills.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No skills listed
                  </Typography>
                )}
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Created: {formatDate(candidate.created_at)}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Last Updated: {formatDate(candidate.updated_at)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Resume/CV Text
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {candidate.text || 'No resume text available'}
            </Typography>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              AI Recommendations
            </Typography>
            
            {loadingRecommendations ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : recommendations.length > 0 ? (
              <Grid container spacing={2}>
                {recommendations.map((rec, index) => (
                  <Grid item xs={12} key={index}>
                    <Card variant="outlined">
                      <CardHeader 
                        title={rec.title}
                        subheader={`Priority: ${rec.priority}`}
                      />
                      <CardContent>
                        <Typography variant="body1" paragraph>
                          {rec.description}
                        </Typography>
                        <Typography variant="subtitle2" color="primary">
                          Recommended Action:
                        </Typography>
                        <Typography variant="body2">
                          {rec.action}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No recommendations available for this candidate yet. Try running a matching operation to generate recommendations.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CandidateDetail;

