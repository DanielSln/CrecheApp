import { Component } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonBackButton,
  IonIcon,
  IonInput,
  IonTextarea,
  IonTitle,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  closeOutline, 
  attachOutline, 
  linkOutline, 
  happyOutline, 
  imageOutline, 
  ellipsisVertical,
  chevronDownOutline,
  sendOutline,
  textOutline,
  saveOutline,
  trashOutline
} from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-escrever-comunicado',
  templateUrl: './escrever-comunicado.page.html',
  styleUrls: ['./escrever-comunicado.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonBackButton,
    IonIcon,
    IonInput,
    IonTextarea,
    IonTitle,
    CommonModule,
    FormsModule,
  ],
})
export class EscreverComunicadoPage {
  from: string = 'docente@crecheapp.com';
  to: string = '';
  cc: string = '';
  bcc: string = '';
  subject: string = '';
  message: string = '';
  showCcBcc: boolean = false;
  selectedIcon: string = '📝';
  showIconPicker: boolean = false;
  availableIcons: string[] = ['🚨', '📝', '🎄', '🍽️', '📚', '🏅', '🎆', '📢', '⚠️', '💡', '🎉', '📅'];

  constructor(private router: Router, private location: Location) {
    addIcons({
      'close-outline': closeOutline,
      'attach-outline': attachOutline,
      'link-outline': linkOutline,
      'happy-outline': happyOutline,
      'image-outline': imageOutline,
      'ellipsis-vertical': ellipsisVertical,
      'chevron-down-outline': chevronDownOutline,
      'send-outline': sendOutline,
      'text-outline': textOutline,
      'save-outline': saveOutline,
      'trash-outline': trashOutline
    });
  }

  toggleCcBcc() {
    this.showCcBcc = !this.showCcBcc;
  }

  fecharComposer() {
    this.location.back();
  }

  selecionarRemetente() {
    const remetentes = ['docente@crecheapp.com', 'coordenacao@crecheapp.com', 'direcao@crecheapp.com'];
    console.log('Remetentes disponíveis:', remetentes);
  }

  selecionarDestinatarios() {
    const grupos = ['Todos os Pais', 'Turma A', 'Turma B', 'Turma C', 'Professores'];
    console.log('Grupos disponíveis:', grupos);
  }

  anexarArquivo() {
    console.log('Abrindo seletor de arquivos...');
    // Simular seleção de arquivo
    const tiposPermitidos = ['.pdf', '.doc', '.docx', '.jpg', '.png'];
    console.log('Tipos permitidos:', tiposPermitidos);
  }

  inserirLink() {
    const url = prompt('Digite a URL do link:');
    if (url) {
      this.message += ` ${url}`;
      console.log('Link inserido:', url);
    }
  }

  inserirEmoji() {
    const emojis = ['😊', '👍', '❤️', '🎉', '⭐', '✅', '❗', '📌'];
    console.log('Emojis disponíveis:', emojis);
    // Adicionar primeiro emoji como exemplo
    this.message += ' 😊';
  }

  inserirImagem() {
    console.log('Abrindo galeria de imagens...');
    const formatosPermitidos = ['.jpg', '.jpeg', '.png', '.gif'];
    console.log('Formatos permitidos:', formatosPermitidos);
  }

  mostrarOpcoes() {
    const opcoes = ['Agendar envio', 'Definir prioridade', 'Solicitar confirmação de leitura'];
    console.log('Opções disponíveis:', opcoes);
  }

  formatarTexto() {
    const opcoes = ['Negrito', 'Itálico', 'Sublinhado', 'Lista', 'Numeração'];
    console.log('Opções de formatação:', opcoes);
  }

  mostrarIcones() {
    this.showIconPicker = !this.showIconPicker;
  }

  selecionarIcone(icon: string) {
    this.selectedIcon = icon;
    this.showIconPicker = false;
    console.log('Ícone selecionado:', icon);
  }

  salvarRascunho() {
    console.log('Salvando rascunho...');
    console.log({ 
      from: this.from, 
      to: this.to, 
      cc: this.cc,
      bcc: this.bcc,
      subject: this.subject, 
      message: this.message 
    });
  }

  descartarComunicado() {
    const confirmar = confirm('Tem certeza que deseja descartar este comunicado?');
    if (confirmar) {
      this.to = '';
      this.cc = '';
      this.bcc = '';
      this.subject = '';
      this.message = '';
      this.selectedIcon = '📝';
      this.showCcBcc = false;
      this.showIconPicker = false;
      console.log('Comunicado descartado');
    }
  }

  enviarComunicado() {
    if (!this.to || !this.subject || !this.message) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    console.log('Enviando comunicado...');
    console.log({ 
      from: this.from, 
      to: this.to, 
      cc: this.cc,
      bcc: this.bcc,
      subject: this.subject, 
      message: this.message,
      icon: this.selectedIcon,
      timestamp: new Date().toISOString()
    });
    
    alert('Comunicado enviado com sucesso!');
    this.router.navigateByUrl('/menu-docente');
  }
}
