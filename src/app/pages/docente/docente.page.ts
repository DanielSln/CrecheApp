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
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { addIcons } from 'ionicons';
import { camera } from 'ionicons/icons';

@Component({
  selector: 'app-docente',
  templateUrl: './docente.page.html',
  styleUrls: ['./docente.page.scss'],
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
export class DocentePage implements OnInit {
  profileImage: string = 'assets/img/avatar.jpg';
  instituicao: string = 'SENAC';
  nome: string = '';
  id: string = '';

  constructor(private router: Router) {
    addIcons({ camera });
  }

  ngOnInit() {
    this.carregarDados();
  }

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

  carregarDados() {
    this.nome = localStorage.getItem('userName') || 'Não informado';
    this.id = localStorage.getItem('userIdentificador') || 'Não informado';
  }

  navegarParaHome() {
    this.router.navigate(['/menu-docente']);
  }
}
