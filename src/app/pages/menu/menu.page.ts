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
import { person, calendar, statsChart, mail } from 'ionicons/icons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
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
export class MenuPage implements OnInit {
  constructor(private router: Router) {
    addIcons({ person, calendar, statsChart, mail });
  }

  ngOnInit() {}

  irParaFilho() {
    this.router.navigateByUrl('/filho');
  }

  irParaCalendario() {
    this.router.navigateByUrl('/calendario');
  }

  irParaStatus() {
    this.router.navigateByUrl('/status');
  }

  irParaComunicados() {
    this.router.navigateByUrl('/comunicados');
  }
}
