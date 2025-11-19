import { NgClass, AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import {
  IonApp,
  IonRouterOutlet,
  IonMenuToggle,
  IonMenu,
  IonHeader,
  IonContent,
  IonItem,
  IonAvatar,
  IonLabel,
  IonText,
  IonIcon,
} from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';
import { AvatarService } from './services/avatar.service';

import { addIcons } from 'ionicons';
import {
  person,
  calendar,
  happy,
  chatbubbles,
  menu,
  menuOutline,
  menuSharp,
  logOut,
  people,
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet,
    IonMenuToggle,
    IonMenu,
    IonHeader,
    IonContent,
    IonItem,
    IonAvatar,
    IonLabel,
    IonText,
    IonIcon,
    NgClass,
    AsyncPipe,
  ],
})
export class AppComponent {
  userType: 'aluno' | 'docente' = 'aluno';
  menuOpen = false;

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private authService: AuthService,
    public avatarService: AvatarService
  ) {
    this.addAllIcons();
    this.loadUserType();
    this.setupMenuListener();
    // atualiza o item ativo com base na rota atual e infere tipo de usuário pela rota
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.urlAfterRedirects.split('?')[0];
        this.pages.forEach((p) => (p.active = p.url === currentUrl));
        // se a rota indicar área do docente, alterna o menu para docente; caso contrário usa aluno
        this.inferUserTypeFromUrl(currentUrl);
        // Desabilita o menu nas telas de login
        if (currentUrl === '/login-aluno' || currentUrl === '/login-professor') {
          this.menuCtrl.enable(false);
        } else {
          this.menuCtrl.enable(true);
        }
      }
    });
  }

  get profile() {
    const name =
      localStorage.getItem('userName') ||
      (this.userType === 'docente' ? 'Prof. Maria Santos' : 'João Silva');
    const email =
      localStorage.getItem('userEmail') ||
      (this.userType === 'docente'
        ? 'maria.prof@email.com'
        : 'joao.aluno@email.com');
    return { name, email };
  }

  pagesAluno = [
    { title: 'Menu', url: '/menu', icon: 'menu', active: true },
    { title: 'Filho', url: '/filho', icon: 'filho', active: false },
    {
      title: 'Calendário',
      url: '/calendario',
      icon: 'calendario',
      active: false,
    },
    { title: 'Status', url: '/status', icon: 'status', active: false },
    {
      title: 'Comunicados',
      url: '/comunicados',
      icon: 'comunicados',
      active: false,
    },
    {
      title: 'Sair',
      url: '/login-aluno',
      icon: 'log-out',
      route: true,
      active: false,
    },
  ];

  //Páginas do docente
  pagesDocente = [
    { title: 'Menu', url: '/menu-docente', icon: 'menu', active: true },
    { title: 'Crachá', url: '/docente', icon: 'person', active: false, },
    { title: 'Editar Calendário', url: '/calendario-docente', icon: 'calendar', active: false, },
    { title: 'Turmas', url: '/turmas', icon: 'people', active: false, },
    { title: 'Comunicados', url: '/comunicados-docente', icon: 'chatbubbles', active: false, },
    {title: 'Sair', url: '/login-professor', icon: 'log-out', route: true,active: false, },
  ];

  get pages() {
    return this.userType === 'docente' ? this.pagesDocente : this.pagesAluno;
  }

  private inferUserTypeFromUrl(url: string) {
    const docenteRoutes = [
      '/menu-docente',
      '/docente',
      '/calendario-docente',
      '/turmas',
      '/login-professor',
      '/comunicados-docente',
    ];
    const isDocente = docenteRoutes.some((r) => url.startsWith(r));
    const inferred = isDocente ? 'docente' : 'aluno';
    if (this.userType !== inferred) {
      this.userType = inferred as 'aluno' | 'docente';
      try {
        // persiste para manter consistência em reloads
        localStorage.setItem('userType', this.userType);
      } catch (e) {
        // se localStorage não estiver disponível, apenas ignora
      }
    }
  }

  loadUserType() {
    const savedUserType = localStorage.getItem('userType');
    if (savedUserType) {
      this.userType = savedUserType as 'aluno' | 'docente';
    }
  }

  addAllIcons() {
    addIcons({
      filho: person,
      calendario: calendar,
      calendar: calendar,
      comunicados: chatbubbles,
      chatbubbles: chatbubbles,
      status: happy,
      menu: menu,
      menuOutline: menuOutline,
      menuSharp: menuSharp,
      'log-out': logOut,
      person: person,
      people: people,
    });
  }

  onItemTap(page: any) {
    this.pages.forEach((p) => (p.active = false));
    page.active = true;

    if (page.title === 'Sair') {
      this.logout();
    } else {
      this.router.navigateByUrl(page.url);
    }
  }

  logout() {
    this.authService.logout();
    const loginUrl =
      this.userType === 'docente' ? '/login-professor' : '/login-aluno';
    this.router.navigateByUrl(loginUrl);
  }

  setupMenuListener() {
    document.addEventListener('ionMenuDidOpen', () => {
      this.menuOpen = true;
    });
    document.addEventListener('ionMenuDidClose', () => {
      this.menuOpen = false;
    });
  }
}
