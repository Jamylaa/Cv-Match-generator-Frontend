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
  CardContent
} from '@mui/material';
import { Grid } from '../../components/common';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { offersApi } from '../../services/api';
import { Offer } from '../../types';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventIcon from '@mui/icons-material/Event';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';

const OfferDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchOffer(id);
    }
  }, [id]);

  const fetchOffer = async (offerId: string) => {
    try {
      setLoading(true);
      const data = await offersApi.getById(offerId);
      setOffer(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch job offer details. Please try again later.');
      console.error('Error fetching offer:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  const isExpired = (expiresAt: string | undefined) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const formatEmploymentType = (type: string | undefined) => {
    if (!type) return 'Not specified';
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !offer) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error || 'Job offer not found'}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Job Offer Details
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          component={RouterLink}
          to={`/offers/edit/${id}`}
        >
          Edit
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                {offer.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BusinessIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="h6">{offer.company}</Typography>
              </Box>
              {isExpired(offer.expires_at) && (
                <Chip 
                  label="Expired" 
                  color="error" 
                  sx={{ mt: 1 }}
                />
              )}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <List dense>
              {offer.location && (
                <ListItem>
                  <LocationOnIcon sx={{ mr: 2 }} />
                  <ListItemText 
                    primary="Location" 
                    secondary={`${offer.location}${offer.remote_allowed ? ' (Remote allowed)' : ''}`} 
                  />
                </ListItem>
              )}
              
              {offer.required_experience !== undefined && (
                <ListItem>
                  <WorkIcon sx={{ mr: 2 }} />
                  <ListItemText 
                    primary="Required Experience" 
                    secondary={`${offer.required_experience} years`} 
                  />
                </ListItem>
              )}
              
              {(offer.salary_min !== undefined || offer.salary_max !== undefined) && (
                <ListItem>
                  <AttachMoneyIcon sx={{ mr: 2 }} />
                  <ListItemText 
                    primary="Salary Range" 
                    secondary={
                      offer.salary_min && offer.salary_max
                        ? `$${offer.salary_min.toLocaleString()} - $${offer.salary_max.toLocaleString()}`
                        : offer.salary_min
                          ? `From $${offer.salary_min.toLocaleString()}`
                          : offer.salary_max
                            ? `Up to $${offer.salary_max.toLocaleString()}`
                            : 'Not specified'
                    } 
                  />
                </ListItem>
              )}
              
              <ListItem>
                <EventIcon sx={{ mr: 2 }} />
                <ListItemText 
                  primary="Employment Type" 
                  secondary={formatEmploymentType(offer.employment_type)} 
                />
              </ListItem>
              
              <ListItem>
                <EventIcon sx={{ mr: 2 }} />
                <ListItemText 
                  primary="Expires" 
                  secondary={formatDate(offer.expires_at)} 
                />
              </ListItem>
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Required Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {offer.skills.map((skill, index) => (
                  <Chip key={index} label={skill} />
                ))}
                {offer.skills.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No skills listed
                  </Typography>
                )}
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Created: {formatDate(offer.created_at)}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Last Updated: {formatDate(offer.updated_at)}
              </Typography>
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                startIcon={<PeopleIcon />}
                component={RouterLink}
                to={`/matching/offer/${id}`}
              >
                Find Matching Candidates
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Job Description
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {offer.description}
            </Typography>
          </Paper>
          
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI Analysis
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">
                    Skill Extraction Method
                  </Typography>
                  <Typography variant="body2">
                    {offer.skill_extraction_method || 'Standard AI extraction'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">
                    AI Confidence Score
                  </Typography>
                  <Typography variant="body2">
                    {offer.ai_confidence_score ? `${Math.round(offer.ai_confidence_score * 100)}%` : 'Not available'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">
                    Last AI Analysis
                  </Typography>
                  <Typography variant="body2">
                    {offer.last_ai_analysis ? formatDate(offer.last_ai_analysis) : 'Not analyzed yet'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OfferDetail;

