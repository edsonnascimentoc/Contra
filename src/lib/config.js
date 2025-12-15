// API Configuration for different environments
const isNetlifyProduction = import.meta.env.PROD &&
  typeof window !== 'undefined' &&
  (window.location.hostname.includes('netlify.app') || window.location.hostname.includes('netlify.live'));

const API_BASE = isNetlifyProduction
  ? '/.netlify/functions/api'
  : 'http://localhost:3001/api';

export { API_BASE };
