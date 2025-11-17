import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonButton,
} from '@ionic/angular/standalone';

import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-termos-docente',
  templateUrl: 'termos-docente.page.html',
  styleUrls: ['termos-docente.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonButton,
  ],
})
export class TermosPage {
  constructor(private router: Router) {}
  ngOnInit() {}
  
  aceitarTermos() {
    localStorage.setItem('termosAceitosDocente', 'true');
    this.router.navigateByUrl('/menu-docente');
  }

  recusarTermos() {
    (navigator as any).app?.exitApp();
  }
}
