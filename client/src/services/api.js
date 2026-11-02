import axios from 'axios';

const baseURL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

export function getApiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (error?.response?.data?.error?.message) return error.response.data.error.message;
  if (error?.request) return 'Unable to reach the backend. Check that the Express server is running and try again.';
  return error?.message || fallback;
}

export async function createCase(payload) {
  return (await api.post('/cases', payload)).data;
}

export async function getCase(caseId) {
  return (await api.get(`/cases/${encodeURIComponent(caseId)}`)).data;
}

export async function discoverClue(caseId, clueId) {
  return (await api.post(`/cases/${encodeURIComponent(caseId)}/clues/${encodeURIComponent(clueId)}/discover`)).data;
}

export async function requestHint(caseId) {
  return (await api.post(`/cases/${encodeURIComponent(caseId)}/hints`)).data;
}

export async function submitAccusation(caseId, suspectId) {
  return (await api.post(`/cases/${encodeURIComponent(caseId)}/accuse`, { suspectId })).data;
}

export async function getResult(caseId) {
  return (await api.get(`/cases/${encodeURIComponent(caseId)}/result`)).data;
}

export default api;
