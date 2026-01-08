// API Configuration for different environments
const isNetlifyProduction = import.meta.env.PROD &&
  typeof window !== 'undefined' &&
  (window.location.hostname.includes('netlify.app') || window.location.hostname.includes('netlify.live'));

const API_BASE = isNetlifyProduction
  ? '/.netlify/functions/api'
  : 'http://localhost:3001/api';

const BRAND_NAME = import.meta.env.PUBLIC_BRAND_NAME || 'National Group';
const PRIMARY_COLOR = import.meta.env.PUBLIC_PRIMARY_COLOR || '#d4af37';

export { API_BASE, BRAND_NAME, PRIMARY_COLOR };
