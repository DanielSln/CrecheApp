// Configuração da API
const isDevelopment = !window.location.hostname.includes('vercel.app') && 
                    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_CONFIG = {
  BASE_URL: isDevelopment 
    ? 'https://back-end-crecheapp-26phaqoxn-anthony3043s-projects.vercel.app' // Manter URL do Vercel mesmo em dev
    : 'https://back-end-crecheapp-26phaqoxn-anthony3043s-projects.vercel.app',
  
  ENDPOINTS: {
    LOGIN_ALUNO: '/login/aluno',
    LOGIN_DOCENTE: '/login/docente',
    REGISTER_ALUNO: '/register/aluno',
    REGISTER_DOCENTE: '/register/docente',
    EVENTS: '/eventos'
  }
};