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
  selector: 'app-termos',
  templateUrl: 'termos.page.html',
  styleUrls: ['termos.page.scss'],
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
    localStorage.setItem('termosAceitos', 'true');
    this.router.navigateByUrl('/menu');
  }

  recusarTermos() {
    (navigator as any).app?.exitApp();
  }
}
