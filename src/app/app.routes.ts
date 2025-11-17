import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/menu-docente',
    pathMatch: 'full',
  },

  //Menu Filho
  {
    path: 'menu',
    loadComponent: () =>
      import('./pages/menu/menu.page').then((m) => m.MenuPage),
  },
  {
    path: 'filho',
    loadComponent: () =>
      import('./pages/filho/filho.page').then((m) => m.FilhoPage),
  },
  {
    path: 'calendario',
    loadComponent: () =>
      import('./pages/calendario/calendario.page').then(
        (m) => m.CalendarioPage
      ),
  },
  {
    path: 'status',
    loadComponent: () =>
      import('./pages/status/status.page').then((m) => m.StatusPage),
  },
  {
    path: 'comunicados',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/comunicados/comunicados.page').then(
            (m) => m.ComunicadosPage
          ),
      },
      {
        path: 'detalhes/:id',
        loadComponent: () =>
          import('./pages/comunicado-detalhes/comunicado-detalhes.page').then(
            (m) => m.ComunicadoDetalhesPage
          ),
      }
    ]
  },
  {
    path: 'login-aluno',
    loadComponent: () =>
      import('./pages/login-aluno/login-aluno.page').then(
        (m) => m.LoginAlunoPage
      ),
  },

  //Menu Docente
  {
    path: 'login-professor',
    loadComponent: () =>
      import('./pages/login-professor/login-professor.page').then(
        (m) => m.LoginProfessorPage
      ),
  },
  {
    path: 'termos',
    loadComponent: () =>
      import('./pages/termos/termos.page').then((m) => m.TermosPage),
  },
  {
    path: 'menu-docente',
    loadComponent: () =>
      import('./pages/menu-docente/menu-docente.page').then(
        (m) => m.MenuDocentePage
      ),
  },
  {
    path: 'comunicados-docente',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/comunicados-docente/comunicados-docente.page').then(
            (m) => m.ComunicadosDocentePage
          ),
      },
      {
        path: 'detalhes/:id',
        loadComponent: () =>
          import('./pages/comunicado-detalhes/comunicado-detalhes.page').then(
            (m) => m.ComunicadoDetalhesPage
          ),
      }
    ]
  },
  {
    path: 'docente',
    loadComponent: () =>
      import('./pages/docente/docente.page').then((m) => m.DocentePage),
  },
  {
    path: 'termos-docente',
    loadComponent: () =>
      import('./pages/termos-docente/termos-docente.page').then(
        (m) => m.TermosPage
      ),
  },
  {
    path: 'calendario-docente',
    loadComponent: () =>
      import('./pages/calendario-docente/calendario-docente.page').then(
        (m) => m.CalendarioDocentePage
      ),
  },
  {
    path: 'turmas',
    loadComponent: () =>
      import('./pages/turmas/turmas.page').then((m) => m.TurmasPage),
  },
  {
    path: 'escrever-comunicado',
    loadComponent: () => import('./pages/escrever-comunicado/escrever-comunicado.page').then( m => m.EscreverComunicadoPage)
  },
  {
    path: 'ver-rascunhos',
    loadComponent: () => import('./pages/ver-rascunhos/ver-rascunhos.page').then( m => m.VerRascunhosPage)
  },


];
