module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:8100/',
        'http://localhost:8100/login-aluno',
        'http://localhost:8100/login-professor',
        'http://localhost:8100/menu',
        'http://localhost:8100/menu-docente',
        'http://localhost:8100/comunicados',
        'http://localhost:8100/comunicados-docente',
        'http://localhost:8100/escrever-comunicado',
        'http://localhost:8100/filho',
        'http://localhost:8100/docente',
        'http://localhost:8100/calendario',
        'http://localhost:8100/calendario-docente',
        'http://localhost:8100/turmas',
        'http://localhost:8100/status'
      ],
      numberOfRuns: 1,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage'
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.7 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};