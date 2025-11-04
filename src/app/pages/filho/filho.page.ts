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
  escola: string = 'SENAC';
  nome: string = '';
  matricula: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.nome = localStorage.getItem('userName') || 'Não informado';
    const matriculaCompleta =
      localStorage.getItem('userEmail') || 'Não informado';
    // Extrai apenas o número da matrícula
    this.matricula = matriculaCompleta.includes(':')
      ? matriculaCompleta.split(':')[1].trim()
      : matriculaCompleta;
    // Adicione outras informações conforme necessário
  }

  goToMenu() {
    this.router.navigateByUrl('/menu');
  }
}
