import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-escrever-comunicado',
  templateUrl: './escrever-comunicado.page.html',
  styleUrls: ['./escrever-comunicado.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
  ],
})
export class EscreverComunicadoPage {
  destinatario = '';
  assunto = '';
  mensagem = '';

  constructor(private router: Router) {}

  voltar() {
    this.router.navigateByUrl('/comunicados-docente');
  }

  enviarComunicado() {
    if (!this.assunto || !this.mensagem) {
      alert('Por favor, preencha o assunto e a mensagem.');
      return;
    }

    console.log('Comunicado enviado:', {
      para: this.destinatario,
      assunto: this.assunto,
      mensagem: this.mensagem,
    });

    alert('Comunicado enviado com sucesso!');
    this.router.navigateByUrl('/comunicados-docente');
  }

  limparCampos() {
    this.destinatario = '';
    this.assunto = '';
    this.mensagem = '';
  }
}
