import { Component, OnInit, OnDestroy } from '@angular/core';
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

interface Comunicado {
  id: number;
  title: string;
  preview: string;
  emoji: string;
  content: string;
  data: string;
  created_at: string;
  type?: 'urgent' | 'info' | 'default';
  from?: string;
  to?: string;
  cc?: string;
  bcc?: string;
}

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
export class ComunicadosPage implements OnInit, OnDestroy {
  comunicados: Comunicado[] = [];
  comunicadoSelecionado: Comunicado | null = null;
  private readonly apiUrl = 'https://back-end-pokecreche-production.up.railway.app/comunicados';
  private abortController?: AbortController;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private autoRefresh: AutoRefreshService
  ) {}

  ngOnInit() {
    this.carregarComunicados();
    this.autoRefresh.startAutoRefresh('comunicados', () => this.carregarComunicados(), 30000);
  }

  ngOnDestroy() {
    this.abortController?.abort();
    this.autoRefresh.stopAutoRefresh('comunicados');
  }
  
  ionViewWillEnter() {
    this.carregarComunicados();
  }

  ionViewWillLeave() {
    this.autoRefresh.stopAutoRefresh('comunicados');
  }
  
  async carregarComunicados() {
    this.abortController?.abort();
    this.abortController = new AbortController();

    try {
      const response = await fetch(this.apiUrl, {
        signal: this.abortController.signal,
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Network error');
      
      const data = await response.json();
      this.comunicados = this.processarComunicados(data);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        this.comunicados = [];
      }
    }
  }

  private processarComunicados(data: any[]): Comunicado[] {
    return data
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 20)
      .map(c => ({
        id: c.id,
        title: c.title,
        preview: c.message?.substring(0, 80) + '...',
        emoji: c.icon || '📝',
        content: c.message,
        data: c.data || c.created_at,
        created_at: c.created_at
      }));
  }

  irParaEscrever() {
    sessionStorage.removeItem('rascunhoCarregado');
    this.router.navigateByUrl('/escrever-comunicado');
  }

  verRascunhos() {
    this.router.navigateByUrl('/ver-rascunhos');
  }

  abrirRascunhos() {
    this.verRascunhos();
  }

  openComunicado(comunicado: Comunicado) {
    this.comunicadoSelecionado = comunicado;
  }

  fecharDetalhes() {
    this.comunicadoSelecionado = null;
  }

  trackByComunicado(index: number, item: Comunicado): number {
    return item.id;
  }

  formatarData(data: string): string {
    if (!data) return '';
    const date = new Date(data);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    return date.toLocaleDateString('pt-BR');
  }

  goToMenu() {
    this.router.navigateByUrl('/menu-docente');
  }
}