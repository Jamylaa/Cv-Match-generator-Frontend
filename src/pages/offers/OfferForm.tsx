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
  FormControlLabel,
  Switch,
  SelectChangeEvent
} from '@mui/material';
import { Grid } from '../../components/common';
import { useNavigate, useParams } from 'react-router-dom';
import { offersApi } from '../../services/api';
import { Offer, OfferFormData } from '../../types';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

interface OfferFormProps {
  isEdit?: boolean;
}

const OfferForm: React.FC<OfferFormProps> = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  
  const [formData, setFormData] = useState<OfferFormData>({
    title: '',
    company: '',
    description: '',
    skills: [],
    required_experience: undefined,
    location: '',
    salary_min: undefined,
    salary_max: undefined,
    employment_type: '',
    remote_allowed: false,
    expires_at: undefined
  });

  useEffect(() => {
    if (isEdit && id) {
      fetchOffer(id);
    }
  }, [isEdit, id]);

  const fetchOffer = async (offerId: string) => {
    try {
      setLoading(true);
      const offer = await offersApi.getById(offerId);
      setFormData({
        title: offer.title,
        company: offer.company,
        description: offer.description,
        skills: offer.skills || [],
        required_experience: offer.required_experience,
        location: offer.location || '',
        salary_min: offer.salary_min,
        salary_max: offer.salary_max,
        employment_type: offer.employment_type || '',
        remote_allowed: offer.remote_allowed,
        expires_at: offer.expires_at
      });
      
      if (offer.expires_at) {
        setExpiryDate(new Date(offer.expires_at));
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch job offer data. Please try again later.');
      console.error('Error fetching offer:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'required_experience' || name === 'salary_min' || name === 'salary_max'
        ? value === '' ? undefined : Number(value)
        : value
    }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleEmploymentTypeChange = (e: SelectChangeEvent<string>) => {
    setFormData(prev => ({
      ...prev,
      employment_type: e.target.value
    }));
  };

  const handleExpiryDateChange = (date: Date | null) => {
    setExpiryDate(date);
    setFormData(prev => ({
      ...prev,
      expires_at: date ? date.toISOString() : undefined
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
        await offersApi.update(id, formData);
      } else {
        await offersApi.create(formData);
      }
      
      navigate('/offers');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save job offer. Please try again.');
      console.error('Error saving offer:', err);
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
        {isEdit ? 'Edit Job Offer' : 'Add New Job Offer'}
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Job Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.remote_allowed}
                    onChange={handleSwitchChange}
                    name="remote_allowed"
                    color="primary"
                  />
                }
                label="Remote Work Allowed"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Required Experience (years)"
                name="required_experience"
                type="number"
                value={formData.required_experience === undefined ? '' : formData.required_experience}
                onChange={handleChange}
                InputProps={{
                  inputProps: { min: 0, max: 50 }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="employment-type-label">Employment Type</InputLabel>
                <Select
                  labelId="employment-type-label"
                  name="employment_type"
                  value={formData.employment_type || ''}
                  onChange={handleEmploymentTypeChange}
                  label="Employment Type"
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="full_time">Full-time</MenuItem>
                  <MenuItem value="part_time">Part-time</MenuItem>
                  <MenuItem value="contract">Contract</MenuItem>
                  <MenuItem value="internship">Internship</MenuItem>
                  <MenuItem value="freelance">Freelance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Minimum Salary"
                name="salary_min"
                type="number"
                value={formData.salary_min === undefined ? '' : formData.salary_min}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Maximum Salary"
                name="salary_max"
                type="number"
                value={formData.salary_max === undefined ? '' : formData.salary_max}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Expiry Date"
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  slotProps={{
                    textField: { fullWidth: true }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Job Description"
                name="description"
                multiline
                rows={6}
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter the job description here for automatic skill extraction..."
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle1">Required Skills</Typography>
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
                    No skills added yet. Skills will be automatically extracted from job description.
                  </Typography>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/offers')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={submitting}
              >
                {submitting ? <CircularProgress size={24} /> : isEdit ? 'Update Job Offer' : 'Create Job Offer'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default OfferForm;

