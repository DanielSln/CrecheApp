import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonTitle,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { create } from 'ionicons/icons';

@Component({
  selector: 'app-ver-rascunhos',
  templateUrl: './ver-rascunhos.page.html',
  styleUrls: ['./ver-rascunhos.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonTitle,
    CommonModule,
    FormsModule,
  ],
})
export class VerRascunhosPage implements OnInit {
  rascunhos: any[] = [];

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({ create });
  }

  ngOnInit() {
    this.carregarRascunhos();
  }

  carregarRascunhos() {
    const docenteId = localStorage.getItem('userId');
    
    fetch(`https://creche-app.vercel.app/rascunhos/${docenteId}`)
      .then(res => res.json())
      .then(data => {
        this.rascunhos = data;
      })
      .catch(err => {
        console.error('Erro ao carregar rascunhos:', err);
        this.rascunhos = [];
      });
  }

  carregarRascunho(rascunho: any) {
    sessionStorage.setItem('rascunhoCarregado', JSON.stringify(rascunho));
    this.router.navigateByUrl('/escrever-comunicado');
  }

  criarNovoRascunho() {
    sessionStorage.removeItem('rascunhoCarregado');
    this.router.navigateByUrl('/escrever-comunicado');
  }

  async excluirRascunho(rascunho: any, event: Event) {
    event.stopPropagation();
    
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: 'Você realmente quer deletar este rascunho?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Deletar',
          role: 'confirm',
          cssClass: 'alert-button-delete',
          handler: () => {
            this.confirmarExclusao(rascunho);
          }
        }
      ]
    });

    await alert.present();
  }

  private async confirmarExclusao(rascunho: any) {
    try {
      const response = await fetch(`https://creche-app.vercel.app/rascunhos/${rascunho.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erro ao excluir');
      
      this.carregarRascunhos();
      this.mostrarMensagemSucesso('Rascunho excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir rascunho:', error);
      this.mostrarMensagemErro('Erro ao excluir rascunho. Tente novamente.');
    }
  }

  private async mostrarMensagemSucesso(mensagem: string) {
    const alert = await this.alertController.create({
      header: 'Sucesso',
      message: mensagem,
      buttons: ['OK'],
      cssClass: 'alert-success'
    });
    await alert.present();
  }

  private async mostrarMensagemErro(mensagem: string) {
    const alert = await this.alertController.create({
      header: 'Erro',
      message: mensagem,
      buttons: ['OK'],
      cssClass: 'alert-error'
    });
    await alert.present();
  }
}
