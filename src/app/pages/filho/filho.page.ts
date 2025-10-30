import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonMenuButton,
  IonButtons,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-filho',
  templateUrl: './filho.page.html',
  styleUrls: ['./filho.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonMenuButton,
    IonButtons,
  ],
})
export class FilhoPage implements OnInit {
  nome: string = '';
  matricula: string = '';
  escola: string = 'SENAC';

  constructor(private router: Router) {}

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.nome = localStorage.getItem('userName') || 'Não informado';
    this.matricula = localStorage.getItem('userEmail') || 'Não informado';
    // Adicione outras informações conforme necessário
  }

  goToMenu() {
    this.router.navigateByUrl('/menu');
  }
}
