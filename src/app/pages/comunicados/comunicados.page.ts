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
  AlertController
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
  comunicadoSelecionado: any = null;

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {
    console.log('ComunicadosPage constructor chamado');
  }

  ngOnInit() {
    console.log('ComunicadosPage ngOnInit chamado');
    this.carregarComunicados();
    console.log('Total de comunicados:', this.comunicados.length);
  }
  
  ionViewWillEnter() {
    console.log('ionViewWillEnter - recarregando comunicados');
    this.carregarComunicados();
  }
  
  carregarComunicados() {
    try {
      // Carregar comunicados enviados do localStorage
      const comunicadosEnviados = JSON.parse(localStorage.getItem('comunicados_enviados') || '[]');
      console.log('Comunicados do localStorage:', comunicadosEnviados);
      
      // Ordenar por ID (mais recentes primeiro) e garantir que têm estrutura básica
      this.comunicados = comunicadosEnviados
        .filter((comunicado: any) => comunicado && comunicado.title)
        .sort((a: any, b: any) => (b.id || 0) - (a.id || 0));
      
      console.log('Total de comunicados após carregar:', this.comunicados.length);
    } catch (error) {
      console.error('Erro ao carregar comunicados:', error);
      this.comunicados = [];
    }
  }

  irParaEscrever() {
    console.log('irParaEscrever chamado');
    // Limpar qualquer rascunho carregado anterior para começar novo
    sessionStorage.removeItem('rascunhoCarregado');
    console.log('Navegando para /escrever-comunicado');
    this.router.navigateByUrl('/escrever-comunicado');
  }

  verRascunhos() {
    console.log('verRascunhos chamado - navegando para página de rascunhos');
    this.router.navigateByUrl('/ver-rascunhos');
  }

  abrirRascunhos() {
    // Alias para verRascunhos para manter compatibilidade com o template
    this.verRascunhos();
  }

  // NOVA FUNÇÃO: Abrir modal de detalhes do comunicado
  openComunicado(comunicado: any) {
    console.log('Abrindo detalhes do comunicado:', comunicado.title);
    this.comunicadoSelecionado = comunicado;
  }

  // Fechar modal de detalhes
  fecharDetalhes() {
    this.comunicadoSelecionado = null;
  }

  editarComunicado() {
    sessionStorage.setItem('comunicadoEditar', JSON.stringify(this.comunicadoSelecionado));
    this.router.navigateByUrl('/escrever-comunicado');
  }

  goToMenu() {
    this.router.navigateByUrl('/menu-docente');
  }
}