import axios from 'axios';

const API_BASE = '/api';

export const getHealth = async () => (await axios.get(`${API_BASE}/health`)).data;
export const getSystemStatus = async () => (await axios.get(`${API_BASE}/system-status`)).data;
export const getBanks = async () => (await axios.get(`${API_BASE}/banks`)).data;
export const getBankDetail = async (id) => (await axios.get(`${API_BASE}/banks/${id}`)).data;
export const getTrustScores = async () => (await axios.get(`${API_BASE}/trust-scores`)).data;
export const getMetrics = async () => (await axios.get(`${API_BASE}/metrics`)).data;
export const getRounds = async () => (await axios.get(`${API_BASE}/rounds`)).data;
export const getAttackEvents = async () => (await axios.get(`${API_BASE}/attack-events`)).data;
export const getResults = async () => (await axios.get(`${API_BASE}/results`)).data;
export const getExperiments = async () => (await axios.get(`${API_BASE}/experiments`)).data;
export const runExperiment = async (payload) => (await axios.post(`${API_BASE}/experiments/run`, payload)).data;
export const stopExperiment = async () => (await axios.post(`${API_BASE}/experiments/stop`)).data;
export const resetSystem = async () => (await axios.post(`${API_BASE}/reset`)).data;
export const predictFraud = async (payload) => (await axios.post(`${API_BASE}/predict`, payload)).data;
export const getContextAnalysis = async () => (await axios.get(`${API_BASE}/context-analysis`)).data;
export const getDriftMonitoring = async () => (await axios.get(`${API_BASE}/drift-monitoring`)).data;
export const getExplainability = async () => (await axios.get(`${API_BASE}/explainability`)).data;
export const getDataQuality = async () => (await axios.get(`${API_BASE}/data-quality`)).data;
