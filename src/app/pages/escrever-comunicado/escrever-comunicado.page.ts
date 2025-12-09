import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonButton, 
  IonIcon,
  IonInput,
  IonTextarea,
  AlertController,
  ActionSheetController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, ellipsisVertical, send, document, mailOpen, trash } from 'ionicons/icons';

@Component({
  selector: 'app-escrever-comunicado',
  templateUrl: './escrever-comunicado.page.html',
  styleUrls: ['./escrever-comunicado.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonInput,
    IonTextarea,
    CommonModule,
    FormsModule
  ]
})
export class EscreverComunicadoPage implements OnInit {
  showCc = false;
  showBcc = false;
  showIconSelector = false;
  showDestinatariosModal = false;
  tipoSelecionado = '';
  searchQuery = '';
  destinatariosSelecionados: string[] = [];
  alunos: any[] = [];
  docentes: any[] = [];
  nomeDocente: string = '';
  isEditing = false;
  pageTitle = 'Novo Comunicado';
  
  comunicado: any = {
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    message: '',
    icon: '📝',
    data: ''
  };

  availableIcons = ['📝', '📢', '⚠️', '🔔', '📚', '🎉', '🏫', '👶', '📅', '💡', '🔍', '✅'];

  constructor(
    private router: Router,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController
  ) {
    addIcons({ close, ellipsisVertical, send, document, mailOpen, trash });
  }

  ngOnInit() {
    this.nomeDocente = localStorage.getItem('userName') || 'Docente';
    this.carregarRascunho();
    this.carregarComunicadoEditar();
    this.carregarAlunos();
    this.carregarDocentes();
    this.updatePageTitle();
  }
  
  updatePageTitle() {
    this.isEditing = !!this.comunicado.id;
    this.pageTitle = this.isEditing ? 'Editar Comunicado' : 'Novo Comunicado';
  }

  carregarAlunos() {
    fetch('/alunos')
      .then(res => res.json())
      .then(data => this.alunos = data)
      .catch(() => this.alunos = []);
  }

  async carregarDocentes() {
    try {
      const response = await fetch('/docentes');
      this.docentes = await response.json();
    } catch {
      this.docentes = [];
    }
  }

  abrirDestinatarios() {
    this.showDestinatariosModal = true;
  }

  fecharDestinatarios() {
    this.showDestinatariosModal = false;
    this.tipoSelecionado = '';
    this.searchQuery = '';
  }

  selecionarOpcao(tipo: string) {
    if (tipo === 'Geral') {
      this.comunicado.to = 'Geral (Todos)';
      this.fecharDestinatarios();
    } else {
      this.tipoSelecionado = tipo;
      this.destinatariosSelecionados = [];
    }
  }

  filteredAlunos() {
    const q = this.searchQuery.toLowerCase();
    return this.alunos.filter(a => a.nome.toLowerCase().includes(q));
  }

  filteredDocentes() {
    const q = this.searchQuery.toLowerCase();
    return this.docentes.filter(d => d.nome.toLowerCase().includes(q));
  }

  toggleDestinatario(nome: string) {
    const index = this.destinatariosSelecionados.indexOf(nome);
    if (index > -1) {
      this.destinatariosSelecionados.splice(index, 1);
    } else {
      this.destinatariosSelecionados.push(nome);
    }
  }

  isSelected(nome: string) {
    return this.destinatariosSelecionados.includes(nome);
  }

  confirmarDestinatarios() {
    if (this.destinatariosSelecionados.length > 0) {
      this.comunicado.to = `${this.tipoSelecionado}: ${this.destinatariosSelecionados.join(', ')}`;
    }
    this.fecharDestinatarios();
  }

  carregarRascunho() {
    const rascunhoCarregado = sessionStorage.getItem('rascunhoCarregado');
    if (rascunhoCarregado) {
      try {
        const rascunho = JSON.parse(rascunhoCarregado);
        this.comunicado = { ...this.comunicado, ...rascunho };
        sessionStorage.removeItem('rascunhoCarregado');
      } catch (error) {
        console.error('Erro ao carregar rascunho:', error);
      }
    }
  }

  carregarComunicadoEditar() {
    const comunicadoEditar = sessionStorage.getItem('comunicadoEditar');
    if (comunicadoEditar) {
      try {
        const comunicado = JSON.parse(comunicadoEditar);
        this.comunicado = {
          id: comunicado.id,
          to: comunicado.destinatarios || '',
          cc: comunicado.cc || '',
          bcc: comunicado.bcc || '',
          subject: comunicado.subject || comunicado.title || '',
          message: comunicado.message || comunicado.content || '',
          icon: comunicado.icon || comunicado.emoji || '📝',
          data: comunicado.data || ''
        };
        
        // Mostrar campos CC/BCC se tiverem conteúdo
        if (this.comunicado.cc) this.showCc = true;
        if (this.comunicado.bcc) this.showBcc = true;
        
        sessionStorage.removeItem('comunicadoEditar');
        this.updatePageTitle();
      } catch (error) {
        console.error('Erro ao carregar comunicado para editar:', error);
      }
    }
  }

  toggleCc() {
    this.showCc = !this.showCc;
    if (!this.showCc) {
      this.comunicado.cc = '';
    }
  }

  toggleBcc() {
    this.showBcc = !this.showBcc;
    if (!this.showBcc) {
      this.comunicado.bcc = '';
    }
  }

  toggleIconSelector() {
    this.showIconSelector = !this.showIconSelector;
  }

  selectIcon(icon: string) {
    this.comunicado.icon = icon;
    this.showIconSelector = false;
  }

  async mostrarOpcoes() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opções',
      buttons: [
        {
          text: 'Ver Rascunhos',
          icon: 'document',
          handler: () => {
            this.verRascunhos();
          }
        },
        {
          text: 'Ver Comunicados Enviados',
          icon: 'mail-open',
          handler: () => {
            this.verComunicadosEnviados();
          }
        },
        {
          text: 'Usar Modelo',
          icon: 'document',
          handler: () => {
            this.usarModelo();
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  verRascunhos() {
    this.router.navigateByUrl('/ver-rascunhos');
  }

  verComunicadosEnviados() {
    this.router.navigateByUrl('/comunicados-docente');
  }

  async usarModelo() {
    const alert = await this.alertController.create({
      header: 'Usar Modelo',
      message: 'Escolha um modelo pré-definido:',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Comunicado Geral',
          handler: () => {
            this.carregarModeloGeral();
          }
        },
        {
          text: 'Comunicado Urgente',
          handler: () => {
            this.carregarModeloUrgente();
          }
        },
        {
          text: 'Lembrete',
          handler: () => {
            this.carregarModeloLembrete();
          }
        }
      ]
    });

    await alert.present();
  }

  carregarModeloGeral() {
    this.comunicado.subject = 'Comunicado Importante';
    this.comunicado.message = 'Prezados responsáveis,\n\nGostaríamos de comunicar que...\n\nAtenciosamente,\nEquipe Pedagógica';
    this.comunicado.icon = '📢';
  }

  carregarModeloUrgente() {
    this.comunicado.subject = 'URGENTE: Comunicado Imediato';
    this.comunicado.message = 'ATENÇÃO!\n\nComunicamos que...\n\nPor favor, tomem as providências necessárias.\n\nAtenciosamente,\nDireção';
    this.comunicado.icon = '⚠️';
  }

  carregarModeloLembrete() {
    this.comunicado.subject = 'Lembrete Importante';
    this.comunicado.message = 'Olá!\n\nLembramos que...\n\nNão se esqueçam!\n\nAtenciosamente,\nCoordenação';
    this.comunicado.icon = '🔔';
  }

  async salvarRascunho() {
    if (!this.comunicado.subject && !this.comunicado.message) {
      this.mostrarMensagem('Aviso', 'Preencha pelo menos o assunto ou a mensagem para salvar como rascunho.');
      return;
    }

    try {
      const docenteId = localStorage.getItem('userId') || '1';
      
      const response = await fetch('/rascunhos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docente_id: docenteId,
          title: this.comunicado.subject,
          subject: this.comunicado.subject,
          message: this.comunicado.message,
          destinatarios: this.comunicado.to,
          cc: this.comunicado.cc,
          bcc: this.comunicado.bcc,
          icon: this.comunicado.icon
        })
      });

      if (!response.ok) throw new Error('Erro ao salvar');
      
      this.mostrarMensagem('Sucesso', 'Rascunho salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error);
      this.mostrarMensagem('Erro', 'Não foi possível salvar o rascunho.');
    }
  }

  async enviarComunicado() {
    if (!this.comunicado.to || !this.comunicado.subject || !this.comunicado.message) {
      this.mostrarMensagem('Atenção', 'Preencha todos os campos obrigatórios: Destinatários, Assunto e Mensagem.');
      return;
    }

    try {
      const docenteId = localStorage.getItem('userId') || '1';
      const isEditing = !!this.comunicado.id;
      
      const url = isEditing 
        ? `/comunicados/${this.comunicado.id}`
        : '/comunicados';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docente_id: docenteId,
          title: this.comunicado.subject,
          subject: this.comunicado.subject,
          message: this.comunicado.message,
          destinatarios: this.comunicado.to || 'Geral',
          cc: this.comunicado.cc,
          bcc: this.comunicado.bcc,
          icon: this.comunicado.icon,
          data: this.comunicado.data
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        throw new Error(errorData.message || `Erro ao ${isEditing ? 'atualizar' : 'enviar'} comunicado`);
      }
      
      const result = await response.json();
      
      // Limpar formulário após envio/atualização
      this.comunicado = {
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        message: '',
        icon: '📝',
        data: ''
      };
      
      this.showCc = false;
      this.showBcc = false;
      
      this.mostrarMensagem('Sucesso', `Comunicado ${isEditing ? 'atualizado' : 'enviado'} com sucesso!`);
      
      // Navegar de volta para comunicados após envio/atualização
      setTimeout(() => {
        this.router.navigateByUrl('/comunicados-docente');
      }, 1500);
      
    } catch (error: any) {
      console.error('Erro ao processar comunicado:', error);
      this.mostrarMensagem('Erro', error.message || 'Não foi possível processar o comunicado.');
    }
  }

  async mostrarMensagem(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  cancelar() {
    this.router.navigateByUrl('/comunicados-docente');
  }
}
