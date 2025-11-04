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
  selector: 'app-docente',
  templateUrl: './docente.page.html',
  styleUrls: ['./docente.page.scss'],
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
export class DocentePage implements OnInit {
  nome: string = '';
  instituicao: string = 'SENAC';
  cargo: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.nome = localStorage.getItem('userName') || 'Não informado';
    this.cargo = localStorage.getItem('userEmail') || 'Não informado'; //arrumar isso aqui depois com as informaçoes que vierem do login
    // Adicione outras informações conforme necessário
  }

  goToMenu() {
    this.router.navigateByUrl('/menu');
  }
}
