import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonMenuButton,
  IonButtons,
  IonIcon,
} from '@ionic/angular/standalone';

import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { person, calendar, people, chatbubbles } from 'ionicons/icons';

@Component({
  selector: 'app-menu-docente',
  templateUrl: './menu-docente.page.html',
  styleUrls: ['./menu-docente.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButton,
    IonMenuButton,
    IonButtons,
    IonIcon,
  ],
})
export class MenuDocentePage implements OnInit {
  constructor(private router: Router) {
    addIcons({ person, calendar, people, chatbubbles });
  }

  ngOnInit() {}
  irParaDocente() {
    this.router.navigateByUrl('/docente');
  }
  IrParaCalendarioDocente() {
    this.router.navigateByUrl('/calendario-docente');
  }
  IrParaTurmas() {
    this.router.navigateByUrl('/turmas');
  }
  IrParaComunicados() {
    this.router.navigateByUrl('/comunicados-docente')
  }
}
