import React from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Card, 
  CardContent,
  CardHeader,
  Chip,
  LinearProgress,
  Divider,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Grid } from '../../components/common';
import { Link as RouterLink } from 'react-router-dom';
import { MatchResponse } from '../../types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BusinessIcon from '@mui/icons-material/Business';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface MatchResultsListProps {
  results: MatchResponse;
}

// Fonction utilitaire pour parser en nombre en toute sécurité
const parseSafe = (value: any): number => {
  const n = parseInt(value);
  return isNaN(n) ? 0 : n;
};

// Couleur LinearProgress
const getScoreColorForProgress = (score?: number) => {
  if (score === undefined || isNaN(score)) return 'inherit';
  if (score >= 85) return 'success';
  if (score >= 70) return 'primary';
  if (score >= 50) return 'warning';
  return 'error';
};

// Couleur Chip
const getScoreColorForChip = (score?: number) => {
  if (score === undefined || isNaN(score)) return 'default';
  if (score >= 85) return 'success';
  if (score >= 70) return 'primary';
  if (score >= 50) return 'warning';
  return 'error';
};

const MatchResultsList: React.FC<MatchResultsListProps> = ({ results }) => {
  return (
    <Box>
      {results.matches.length > 0 ? (
        results.matches.map((match) => (
          <Card key={match.ID} sx={{ mb: 3 }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6">
                    {match.title || 'N/A'}
                  </Typography>
                  <Chip 
                    label={match['Score global'] || 'N/A'} 
                    color={getScoreColorForChip(parseSafe(match['Score global']))}
                  />
                </Box>
              }
              subheader={
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <BusinessIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" sx={{ mr: 2 }}>
                    {match.title || 'N/A'}
                  </Typography>
                </Box>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Skills Match
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={parseSafe(match['Compétences'])} 
                        color={getScoreColorForProgress(parseSafe(match['Compétences']))}
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" color="text.secondary">
                        {match['Compétences'] || '0'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Semantic Match
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={parseSafe(match['Sémantique'])} 
                        color={getScoreColorForProgress(parseSafe(match['Sémantique']))}
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" color="text.secondary">
                        {match['Sémantique'] || '0'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Job Description Preview
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {match['Aperçu de l\'offre'] || 'N/A'}
                  </Typography>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Match Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        <ListItem>
                          <ListItemText 
                            primary="Rank" 
                            secondary={match['Meilleur match'] || 'N/A'} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Score" 
                            secondary={match['Score global'] || 'N/A'} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Skills Match" 
                            secondary={match['Compétences'] || '0'} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Semantic Match" 
                            secondary={match['Sémantique'] || '0'} 
                          />
                        </ListItem>
                      </List>
                    </AccordionDetails>
                  </Accordion>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      component={RouterLink}
                      to={`/offers/${match.ID}`}
                    >
                      View Job Offer
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No matching job offers found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your matching parameters or select a different candidate
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default MatchResultsList;
