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
    try {
      const rascunhosSalvos = JSON.parse(localStorage.getItem('rascunhos') || '[]');
      this.rascunhos = rascunhosSalvos.sort((a: any, b: any) => 
        new Date(b.savedAt || 0).getTime() - new Date(a.savedAt || 0).getTime()
      );
    } catch (error) {
      console.error('Erro ao carregar rascunhos:', error);
      this.rascunhos = [];
    }
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

  private confirmarExclusao(rascunho: any) {
    try {
      const rascunhosAtuais = JSON.parse(localStorage.getItem('rascunhos') || '[]');
      const rascunhosFiltrados = rascunhosAtuais.filter((r: any) => 
        r.savedAt !== rascunho.savedAt || r.subject !== rascunho.subject
      );
      
      localStorage.setItem('rascunhos', JSON.stringify(rascunhosFiltrados));
      this.carregarRascunhos();
      
      // Mostrar mensagem de sucesso
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