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
    const userId = localStorage.getItem('userId');
    const userType = 'aluno';
    
    fetch(`https://back-end-pokecreche-production.up.railway.app/comunicados/visiveis?user_id=${userId}&user_type=${userType}`)
      .then(res => res.json())
      .then(data => {
        this.comunicados = data.map((c: any) => ({
          ...c,
          preview: c.message?.substring(0, 100) + (c.message?.length > 100 ? '...' : ''),
          emoji: c.icon,
          content: c.message
        }));
      })
      .catch(err => {
        console.error('Erro ao carregar comunicados:', err);
        this.comunicados = [];
      });
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



  goToMenu() {
    this.router.navigateByUrl('/menu-docente');
  }
}