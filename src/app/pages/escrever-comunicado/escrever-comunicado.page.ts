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
  IonBackButton,
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
    IonBackButton,
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
  
  comunicado = {
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    message: '',
    icon: '📝'
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
    this.carregarRascunho();
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

  salvarRascunho() {
    if (!this.comunicado.subject && !this.comunicado.message) {
      this.mostrarMensagem('Aviso', 'Preencha pelo menos o assunto ou a mensagem para salvar como rascunho.');
      return;
    }

    try {
      const rascunhos = JSON.parse(localStorage.getItem('rascunhos') || '[]');
      
      const novoRascunho = {
        ...this.comunicado,
        savedAt: new Date().toLocaleString('pt-BR')
      };

      rascunhos.unshift(novoRascunho);
      localStorage.setItem('rascunhos', JSON.stringify(rascunhos));
      
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
      const comunicados = JSON.parse(localStorage.getItem('comunicados_enviados') || '[]');
      
      const novoComunicado = {
        id: Date.now(),
        ...this.comunicado,
        from: 'docente@crecheapp.com',
        date: new Date().toLocaleString('pt-BR'),
        type: 'default',
        preview: this.comunicado.message.substring(0, 100) + (this.comunicado.message.length > 100 ? '...' : ''),
        emoji: this.comunicado.icon
      };

      comunicados.unshift(novoComunicado);
      localStorage.setItem('comunicados_enviados', JSON.stringify(comunicados));
      
      // Limpar formulário após envio
      this.comunicado = {
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        message: '',
        icon: '📝'
      };
      
      this.showCc = false;
      this.showBcc = false;
      
      this.mostrarMensagem('Sucesso', 'Comunicado enviado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao enviar comunicado:', error);
      this.mostrarMensagem('Erro', 'Não foi possível enviar o comunicado.');
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