import axios from 'axios';
import { Candidate, CandidateFormData, Offer, OfferFormData, MatchResponse } from '../types';

const API_URL = 'http://localhost:8000';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Candidates API
export const candidatesApi = {
  getAll: async (params?: any): Promise<Candidate[]> => {
    const response = await api.get('/api/mongodb/candidates', { params });
    return response.data;
  },
  
  getById: async (id: string): Promise<Candidate> => {
    const response = await api.get(`/api/mongodb/candidates/${id}`);
    return response.data;
  },
  
  create: async (candidateData: CandidateFormData): Promise<Candidate> => {
    const response = await api.post('/api/mongodb/candidates', candidateData);
    return response.data;
  },
  
  update: async (id: string, candidateData: Partial<CandidateFormData>): Promise<Candidate> => {
    const response = await api.put(`/api/mongodb/candidates/${id}`, candidateData);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/mongodb/candidates/${id}`);
  }
};

// Offers API
export const offersApi = {
  getAll: async (params?: any): Promise<Offer[]> => {
    const response = await api.get('/api/mongodb/offers', { params });
    return response.data;
  },
  
  getById: async (id: string): Promise<Offer> => {
    const response = await api.get(`/api/mongodb/offers/${id}`);
    return response.data;
  },
  
  create: async (offerData: OfferFormData): Promise<Offer> => {
    const response = await api.post('/api/mongodb/offers', offerData);
    return response.data;
  },
  
  update: async (id: string, offerData: Partial<OfferFormData>): Promise<Offer> => {
    const response = await api.put(`/api/mongodb/offers/${id}`, offerData);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/mongodb/offers/${id}`);
  }
};

// Matching API
export const matchingApi = {
  matchCandidate: async (candidateId: string, topK: number = 5, minScore: number = 0, useAi: boolean = true): Promise<MatchResponse> => {
    const params = {
      top_k: topK,
      min_score: minScore,
      use_ai: useAi
    };
    const response = await api.post(`/api/mongodb/match/${candidateId}`, null, { params });
    return response.data;
  },
  
  getRecommendations: async (candidateId: string, recommendationType: string = 'skills'): Promise<any> => {
    const params = { recommendation_type: recommendationType };
    const response = await api.get(`/api/mongodb/candidates/${candidateId}/recommendations`, { params });
    return response.data;
  }
};

// Statistics API
export const statsApi = {
  getStats: async (): Promise<any> => {
    const response = await api.get('/api/mongodb/stats');
    return response.data;
  },
  
  getSkillAnalytics: async (): Promise<any> => {
    const response = await api.get('/api/mongodb/stats/skills');
    return response.data;
  }
};

// Health check API
export const healthApi = {
  check: async (): Promise<any> => {
    const response = await api.get('/api/mongodb/health');
    return response.data;
  }
};

export default {
  candidates: candidatesApi,
  offers: offersApi,
  matching: matchingApi,
  stats: statsApi,
  health: healthApi
};

