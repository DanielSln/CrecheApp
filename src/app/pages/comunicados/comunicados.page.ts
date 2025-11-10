import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-comunicados',
  templateUrl: './comunicados.page.html',
  styleUrls: ['./comunicados.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    CommonModule,
    FormsModule,
  ],
})
export class ComunicadosPage implements OnInit {
  comunicados: any[] = [];

  constructor(private router: Router) {
    console.log('ComunicadosPage constructor chamado');
  }

  ngOnInit() {
    console.log('ComunicadosPage ngOnInit chamado');
    this.carregarComunicados();
    console.log('Total de comunicados (públicos) carregados:', this.comunicados.length);
  }

  ionViewWillEnter() {
    this.carregarComunicados();
  }

  carregarComunicados() {
    const todos = JSON.parse(localStorage.getItem('comunicados_enviados') || '[]');
    // Mostrar apenas comunicados marcados como públicos (ou sem a flag que assumimos públicos)
    this.comunicados = todos.filter((c: any) => c.public === undefined || c.public === true);
    console.log('Comunicados públicos carregados:', this.comunicados.length);
  }

  openComunicado(index: number) {
    const comunicado = this.comunicados[index];
    console.log('Abrindo comunicado:', comunicado.title);
    console.log('ID do comunicado:', comunicado.id);
    this.router.navigate(['/comunicados/detalhes', comunicado.id]);
  }

  goToMenu() {
    this.router.navigateByUrl('/menu');
  }
}
