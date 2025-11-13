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
import { HttpClient } from '@angular/common/http';

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
  private apiUrl = 'https://back-end-pokecreche-production.up.railway.app';

  constructor(private router: Router, private http: HttpClient) {
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
        const userId = localStorage.getItem('userId');
        if (userId) {
          this.http.put(`${this.apiUrl}/docentes/${userId}/avatar`, { avatar: image.dataUrl }).subscribe();
        }
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  }

  carregarDados() {
    this.nome = localStorage.getItem('userName') || 'Não informado';
    this.id = localStorage.getItem('userIdentificador') || 'Não informado';
    
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.http.get<any>(`${this.apiUrl}/docentes`).subscribe({
        next: (docentes) => {
          const docente = docentes.find((d: any) => d.id == userId);
          if (docente?.avatar) {
            this.profileImage = docente.avatar;
          }
        }
      });
    }
  }

  navegarParaHome() {
    this.router.navigate(['/menu-docente']);
  }
}
