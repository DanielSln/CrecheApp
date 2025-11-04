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
    console.log('Selecionar remetente');
  }

  selecionarDestinatarios() {
    console.log('Selecionar destinatários');
  }

  anexarArquivo() {
    console.log('Anexar arquivo');
  }

  inserirLink() {
    console.log('Inserir link');
  }

  inserirEmoji() {
    console.log('Inserir emoji');
  }

  inserirImagem() {
    console.log('Inserir imagem');
  }

  mostrarOpcoes() {
    console.log('Mostrar opções');
  }

  formatarTexto() {
    console.log('Formatar texto');
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
    this.to = '';
    this.cc = '';
    this.bcc = '';
    this.subject = '';
    this.message = '';
    this.showCcBcc = false;
    console.log('Comunicado descartado');
  }

  enviarComunicado() {
    console.log('Enviando comunicado...');
    console.log({ 
      from: this.from, 
      to: this.to, 
      cc: this.cc,
      bcc: this.bcc,
      subject: this.subject, 
      message: this.message 
    });
    this.router.navigateByUrl('/menu-docente');
  }
}
