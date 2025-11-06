import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonMenuButton,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { camera } from 'ionicons/icons';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-filho',
  templateUrl: './filho.page.html',
  styleUrls: ['./filho.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonMenuButton,
    IonButtons,
    IonButton,
    IonIcon,
  ],
})
export class FilhoPage implements OnInit {
  profileImage: string = 'assets/img/avatar.jpg';

  async selectImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });
      
      if (image.dataUrl) {
        this.profileImage = image.dataUrl;
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  }
  escola: string = 'SENAC';
  nome: string = '';
  matricula: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.nome = localStorage.getItem('userName') || 'Não informado';
    const matriculaCompleta =
      localStorage.getItem('userEmail') || 'Não informado';
    // Extrai apenas o número da matrícula
    this.matricula = matriculaCompleta.includes(':')
      ? matriculaCompleta.split(':')[1].trim()
      : matriculaCompleta;
    // Adicione outras informações conforme necessário
  }

  goToMenu() {
    this.router.navigateByUrl('/menu');
  }
}
