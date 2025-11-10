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
  IonTitle
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { pencil } from 'ionicons/icons';

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

  constructor(private router: Router) {
    addIcons({ pencil });
    console.log('ComunicadosDocentePage constructor chamado');
  }

  ngOnInit() {
    console.log('ComunicadosDocentePage ngOnInit chamado');
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
    console.log('verRascunhos chamado');
    try {
      const rascunhos = JSON.parse(localStorage.getItem('rascunhos') || '[]');
      console.log('Rascunhos encontrados:', rascunhos);
      
      if (rascunhos.length === 0) {
        alert('Nenhum rascunho salvo.\n\nPara criar um rascunho:\n1. Clique em "Novo Comunicado"\n2. Preencha os campos\n3. Clique em "Salvar rascunho"');
        return;
      }
      
      const lista = rascunhos
        .map((r: any, i: number) => `${i + 1}. ${r.subject || '[Sem assunto]'} (${r.savedAt})`)
        .join('\n');
      
      const escolha = prompt(`Rascunhos salvos (${rascunhos.length}):\n${lista}\n\nDigite o número para carregar ou 0 para cancelar:`);
      
      console.log('Escolha do usuário:', escolha);
      
      if (escolha && parseInt(escolha) > 0 && parseInt(escolha) <= rascunhos.length) {
        const rascunho = rascunhos[parseInt(escolha) - 1];
        console.log('Rascunho selecionado:', rascunho);
        sessionStorage.setItem('rascunhoCarregado', JSON.stringify(rascunho));
        this.router.navigateByUrl('/escrever-comunicado');
      }
    } catch (error) {
      console.error('Erro ao carregar rascunhos:', error);
      alert('Erro ao carregar rascunhos. Tente novamente.');
    }
  }

  abrirRascunhos() {
    // Alias para verRascunhos para manter compatibilidade com o template
    this.verRascunhos();
  }

  openComunicado(comunicadoId: number) {
    console.log('Abrindo comunicado com ID:', comunicadoId);
    const comunicado = this.comunicados.find(c => c.id === comunicadoId);
    
    if (comunicado) {
      console.log('Comunicado encontrado:', comunicado.title);
      console.log('Comunicado completo:', comunicado);
      
      // Navegar para página de detalhes passando o ID
      this.router.navigate(['/comunicado-detalhe', comunicadoId]);
    } else {
      console.error('Comunicado não encontrado com ID:', comunicadoId);
      alert('Comunicado não encontrado.');
    }
  }

  goToMenu() {
    this.router.navigateByUrl('/menu-docente');
  }
}