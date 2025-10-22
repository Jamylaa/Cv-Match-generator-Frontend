import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Card, 
  CardContent,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { Grid } from '../../components/common';
import { statsApi } from '../../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const StatsPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [skillAnalytics, setSkillAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const statsData = await statsApi.getStats();
      setStats(statsData.statistics);
      setSkillAnalytics(statsData.skill_analytics);
      setError(null);
    } catch (err) {
      setError('Failed to fetch statistics. Please try again later.');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  // Prepare chart data
  const matchLevelData = {
    labels: ['Excellent', 'Good', 'Average', 'Poor'],
    datasets: [
      {
        label: 'Match Results by Level',
        data: [
          stats?.match_levels?.excellent || 0,
          stats?.match_levels?.good || 0,
          stats?.match_levels?.average || 0,
          stats?.match_levels?.poor || 0
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const topSkillsData = {
    labels: skillAnalytics?.top_skills?.map((skill: any) => skill.name) || [],
    datasets: [
      {
        label: 'Skill Frequency',
        data: skillAnalytics?.top_skills?.map((skill: any) => skill.count) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const matchScoreDistribution = {
    labels: ['0-25%', '26-50%', '51-75%', '76-100%'],
    datasets: [
      {
        label: 'Match Score Distribution',
        data: [
          stats?.score_distribution?.['0-25'] || 0,
          stats?.score_distribution?.['26-50'] || 0,
          stats?.score_distribution?.['51-75'] || 0,
          stats?.score_distribution?.['76-100'] || 0
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
      },
    ],
  };

  const monthlyActivityData = {
    labels: stats?.monthly_activity?.map((month: any) => month.month) || [],
    datasets: [
      {
        label: 'New Candidates',
        data: stats?.monthly_activity?.map((month: any) => month.new_candidates) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
      {
        label: 'New Offers',
        data: stats?.monthly_activity?.map((month: any) => month.new_offers) || [],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Matches',
        data: stats?.monthly_activity?.map((month: any) => month.matches) || [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        System Statistics
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Candidates
              </Typography>
              <Typography variant="h3" sx={{ mb: 1 }}>
                {stats?.total_candidates || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active: {stats?.active_candidates || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Job Offers
              </Typography>
              <Typography variant="h3" sx={{ mb: 1 }}>
                {stats?.total_offers || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active: {stats?.active_offers || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Matches
              </Typography>
              <Typography variant="h3" sx={{ mb: 1 }}>
                {stats?.total_matches || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg. Score: {stats?.average_match_score ? `${(stats.average_match_score * 100).toFixed(1)}%` : 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Unique Skills
              </Typography>
              <Typography variant="h3" sx={{ mb: 1 }}>
                {skillAnalytics?.unique_skills_count || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Most common: {skillAnalytics?.top_skills?.[0]?.name || 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Match Results by Level
            </Typography>
            <Box sx={{ height: 300 }}>
              <Pie data={matchLevelData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Match Score Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <Pie data={matchScoreDistribution} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top Skills
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar 
                data={topSkillsData} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }} 
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Activity
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line 
                data={monthlyActivityData} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }} 
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2">
                  Database Status
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stats?.system_info?.database_status || 'Unknown'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2">
                  AI Services
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stats?.system_info?.ai_services_status || 'Unknown'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2">
                  Last Update
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stats?.system_info?.last_update || 'Unknown'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2">
                  System Version
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stats?.system_info?.version || 'Unknown'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsPage;

