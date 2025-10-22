import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Card, 
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  TextField,
  SelectChangeEvent,
  Slider,
  Divider
} from '@mui/material';
import { Grid } from '../../components/common';
import { useNavigate, useParams } from 'react-router-dom';
import { candidatesApi, matchingApi } from '../../services/api';
import { Candidate, MatchResponse } from '../../types';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import MatchResultsList from './MatchResultsList';

const MatchingPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string>(id || '');
  const [matchResults, setMatchResults] = useState<MatchResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [candidatesLoading, setCandidatesLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [topK, setTopK] = useState<number>(5);
  const [minScore, setMinScore] = useState<number>(0);
  const [useAI, setUseAI] = useState<boolean>(true);
  
  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    if (selectedCandidate) {
      handleMatch();
    }
  }, [selectedCandidate]);

  // Fetch all candidates
  const fetchCandidates = async () => {
    try {
      setCandidatesLoading(true);
      const data = await candidatesApi.getAll({ is_active: true, limit: 100 });
      setCandidates(data);

      // If there's an ID in the URL, fetch the candidate by ID
      if (id) {
        const candidate = await getCandidateById(id);
        if (candidate) {
          setSelectedCandidate(candidate.id);
        }
      }

    } catch (err) {
      setError('Failed to fetch candidates. Please try again later.');
      console.error(err);
    } finally {
      setCandidatesLoading(false);
    }
  };

  // Fetch candidate by ID
  const getCandidateById = async (candidateId: string): Promise<Candidate | null> => {
    try {
      const candidate = await candidatesApi.getById(candidateId);
      return candidate;
    } catch (err) {
      console.error('Error fetching candidate by ID:', err);
      return null;
    }
  };

  const handleCandidateChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedCandidate(value);
    setMatchResults(null);
  };

  const handleTopKChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTopK(parseInt(event.target.value));
  };

  const handleMinScoreChange = (event: Event, newValue: number | number[]) => {
    setMinScore(newValue as number);
  };

  const handleMatch = async () => {
    if (!selectedCandidate) {
      setError('Please select a candidate first.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const results = await matchingApi.matchCandidate(
        selectedCandidate,
        topK,
        minScore,
        useAI
      );
      setMatchResults(results);
    } catch (err) {
      setError('Failed to perform matching. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        AI-Powered CV Matching
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Matching Parameters
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="candidate-select-label">Select Candidate</InputLabel>
              <Select
                labelId="candidate-select-label"
                value={selectedCandidate}
                onChange={handleCandidateChange}
                disabled={candidatesLoading}
              >
                {candidatesLoading ? (
                  <MenuItem key="loading" value="">
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Loading candidates...
                  </MenuItem>
                ) : (
                  <>
                    <MenuItem key="none" value="">
                      <em>Select a candidate</em>
                    </MenuItem>
                    {candidates.map((c, index) => (
                      <MenuItem key={c.id || `candidate-${index}`} value={c.id}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </>
                )}
              </Select>
            </FormControl>

            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>Number of Results: {topK}</Typography>
              <TextField
                type="number"
                value={topK}
                onChange={handleTopKChange}
                inputProps={{ min: 1, max: 50, step: 1 }}
                fullWidth
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>Minimum Match Score: {minScore * 100}%</Typography>
              <Slider
                value={minScore}
                onChange={handleMinScoreChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `${v * 100}%`}
                step={0.05}
                min={0}
                max={1}
              />
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<CompareArrowsIcon />}
              onClick={handleMatch}
              disabled={!selectedCandidate || loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Find Matching Jobs'}
            </Button>
          </Paper>

          {matchResults && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Matching Results
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Candidate: <strong>{matchResults.candidate.name}</strong>
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2">
                  Total matches: {matchResults.total_matches}
                </Typography>
                <Typography variant="body2">
                  Processing time: {matchResults.processing_time_ms}ms
                </Typography>
                <Typography variant="body2">
                  Algorithm: {matchResults.algorithm_used}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={8}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              <CircularProgress />
            </Box>
          ) : matchResults ? (
            <MatchResultsList results={matchResults} />
          ) : (
            <Paper sx={{ p: 5, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                Select a candidate and click "Find Matching Jobs" to see results
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default MatchingPage;
