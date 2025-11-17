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
import { AutoRefreshService } from '../../services/auto-refresh.service';


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
    private alertController: AlertController,
    private autoRefresh: AutoRefreshService
  ) {
    console.log('ComunicadosPage constructor chamado');
  }

  ngOnInit() {
    this.carregarComunicados();
    this.autoRefresh.startAutoRefresh('comunicados', () => this.carregarComunicados(), 30000);
  }
  
  ionViewWillEnter() {
    console.log('ionViewWillEnter - recarregando comunicados');
    this.carregarComunicados();
  }

  ionViewWillLeave() {
    this.autoRefresh.stopAutoRefresh('comunicados');
  }
  
  carregarComunicados() {
    fetch('https://back-end-pokecreche-production.up.railway.app/comunicados')
      .then(res => res.json())
      .then(data => {
        this.comunicados = data.slice(0, 20).map((c: any) => ({
          id: c.id,
          title: c.title,
          preview: c.message?.substring(0, 80) + '...',
          emoji: c.icon || '📝',
          content: c.message,
          data: c.data
        }));
      })
      .catch(() => this.comunicados = []);
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



  trackByComunicado(index: number, item: any): any {
    return item.id;
  }

  formatarData(data: string): string {
    if (!data) return '';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  }

  goToMenu() {
    this.router.navigateByUrl('/menu-docente');
  }
}