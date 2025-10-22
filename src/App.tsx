import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import CandidatesPage from './pages/candidates/CandidatesPage';
import CandidateForm from './pages/candidates/CandidateForm';
import CandidateDetail from './pages/candidates/CandidateDetail';
import OffersPage from './pages/offers/OffersPage';
import OfferForm from './pages/offers/OfferForm';
import OfferDetail from './pages/offers/OfferDetail';
import MatchingPage from './pages/matching/MatchingPage';
import StatsPage from './pages/stats/StatsPage';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            
            {/* Candidate Routes */}
            <Route path="/candidates" element={<CandidatesPage />} />
            <Route path="/candidates/new" element={<CandidateForm />} />
            <Route path="/candidates/edit/:id" element={<CandidateForm isEdit={true} />} />
            <Route path="/candidates/:id" element={<CandidateDetail />} />
            
            {/* Job Offer Routes */}
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/offers/new" element={<OfferForm />} />
            <Route path="/offers/edit/:id" element={<OfferForm isEdit={true} />} />
            <Route path="/offers/:id" element={<OfferDetail />} />
            
            {/* Matching Routes */}
            <Route path="/matching" element={<MatchingPage />} />
            <Route path="/matching/:id" element={<MatchingPage />} />
            
            {/* Statistics Routes */}
            <Route path="/stats" element={<StatsPage />} />
            
            {/* Fallback Route */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;