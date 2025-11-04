import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-escrever-comunicado',
  templateUrl: './escrever-comunicado.page.html',
  styleUrls: ['./escrever-comunicado.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class EscreverComunicadoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
