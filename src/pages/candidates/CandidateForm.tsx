import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Chip,
  InputAdornment,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { Grid } from '../../components/common';
import { useNavigate, useParams } from 'react-router-dom';
import { candidatesApi } from '../../services/api';
import { Candidate, CandidateFormData } from '../../types';

interface CandidateFormProps {
  isEdit?: boolean;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState<string>('');
  
  const [formData, setFormData] = useState<CandidateFormData>({
    name: '',
    email: '',
    phone: '',
    text: '',
    skills: [],
    experience_years: undefined,
    location: '',
    salary_expectation: undefined,
    availability: ''
  });

  useEffect(() => {
    if (isEdit && id) {
      fetchCandidate(id);
    }
  }, [isEdit, id]);

  const fetchCandidate = async (candidateId: string) => {
    try {
      setLoading(true);
      const candidate = await candidatesApi.getById(candidateId);
      setFormData({
        name: candidate.name,
        email: candidate.email || '',
        phone: candidate.phone || '',
        text: candidate.text || '',
        skills: candidate.skills || [],
        experience_years: candidate.experience_years,
        location: candidate.location || '',
        salary_expectation: candidate.salary_expectation,
        availability: candidate.availability || ''
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch candidate data. Please try again later.');
      console.error('Error fetching candidate:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experience_years' || name === 'salary_expectation' 
        ? value === '' ? undefined : Number(value)
        : value
    }));
  };

  const handleAvailabilityChange = (e: SelectChangeEvent<string>) => {
    setFormData(prev => ({
      ...prev,
      availability: e.target.value
    }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills?.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter(skill => skill !== skillToDelete)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      if (isEdit && id) {
        await candidatesApi.update(id, formData);
      } else {
        await candidatesApi.create(formData);
      }
      
      navigate('/candidates');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save candidate. Please try again.');
      console.error('Error saving candidate:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEdit ? 'Edit Candidate' : 'Add New Candidate'}
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="Experience (years)"
                name="experience_years"
                type="number"
                value={formData.experience_years === undefined ? '' : formData.experience_years}
                onChange={handleChange}
                InputProps={{
                  inputProps: { min: 0, max: 50 }
                }}
              />
            </Grid>
            
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="Salary Expectation"
                name="salary_expectation"
                type="number"
                value={formData.salary_expectation === undefined ? '' : formData.salary_expectation}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            
            <Grid xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="availability-label">Availability</InputLabel>
                <Select
                  labelId="availability-label"
                  name="availability"
                  value={formData.availability || ''}
                  onChange={handleAvailabilityChange}
                  label="Availability"
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="immediate">Immediate</MenuItem>
                  <MenuItem value="2_weeks">2 Weeks Notice</MenuItem>
                  <MenuItem value="1_month">1 Month Notice</MenuItem>
                  <MenuItem value="3_months">3+ Months Notice</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Resume/CV Text"
                name="text"
                multiline
                rows={6}
                value={formData.text}
                onChange={handleChange}
                placeholder="Paste the candidate's resume text here for automatic skill extraction..."
              />
            </Grid>
            
            <Grid xs={12}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle1">Skills</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  label="Add Skill"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  sx={{ mr: 1 }}
                />
                <Button 
                  variant="contained" 
                  onClick={handleAddSkill}
                  disabled={!skillInput.trim()}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.skills?.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={() => handleDeleteSkill(skill)}
                  />
                ))}
                {formData.skills?.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No skills added yet. Skills will be automatically extracted from resume text.
                  </Typography>
                )}
              </Box>
            </Grid>
            
            <Grid xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/candidates')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={submitting}
              >
                {submitting ? <CircularProgress size={24} /> : isEdit ? 'Update Candidate' : 'Create Candidate'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CandidateForm;