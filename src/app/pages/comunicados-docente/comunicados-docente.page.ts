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
  IonButton,
  IonIcon,
  IonTitle,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { pencil } from 'ionicons/icons';
import { AutoRefreshService } from '../../services/auto-refresh.service';

@Component({
  selector: 'app-comunicados-docente',
  templateUrl: './comunicados-docente.page.html',
  styleUrls: ['./comunicados-docente.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonIcon,
    IonTitle,
    CommonModule,
    FormsModule,
  ],
})
export class ComunicadosDocentePage implements OnInit {
  pencil = pencil;
  comunicados: any[] = [];
  comunicadoSelecionado: any = null;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private autoRefresh: AutoRefreshService
  ) {
    addIcons({ pencil });
    console.log('ComunicadosDocentePage constructor chamado');
  }

  ngOnInit() {
    console.log('ComunicadosDocentePage ngOnInit chamado');
    this.carregarComunicados();
    this.autoRefresh.startAutoRefresh('comunicados-docente', () => this.carregarComunicados());
    console.log('Total de comunicados:', this.comunicados.length);
  }
  
  ionViewWillEnter() {
    console.log('ionViewWillEnter - recarregando comunicados');
    this.carregarComunicados();
  }

  ionViewWillLeave() {
    this.autoRefresh.stopAutoRefresh('comunicados-docente');
  }
  
  carregarComunicados() {
    const docenteId = localStorage.getItem('userId');
    
    fetch(`https://back-end-pokecreche-production.up.railway.app/comunicados?docente_id=${docenteId}`)
      .then(res => res.json())
      .then(data => {
        this.comunicados = data.map((c: any) => ({
          ...c,
          preview: c.message?.substring(0, 100) + (c.message?.length > 100 ? '...' : ''),
          emoji: c.icon,
          content: c.message
        }));
        console.log('Total de comunicados após carregar:', this.comunicados.length);
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

  // Editar comunicado (funcionalidade futura)
  editarComunicado() {
    console.log('Editando comunicado:', this.comunicadoSelecionado.id);
    alert('Funcionalidade de edição em desenvolvimento!');
    this.fecharDetalhes();
  }

  goToMenu() {
    this.router.navigateByUrl('/menu-docente');
  }
}