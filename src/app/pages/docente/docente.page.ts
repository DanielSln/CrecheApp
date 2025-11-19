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
import { AvatarService } from '../../services/avatar.service';

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
  profileImage: string = '';
  instituicao: string = 'SENAC';
  nome: string = '';
  id: string = '';
  private apiUrl = 'https://back-end-pokecreche-production.up.railway.app';

  constructor(private router: Router, private http: HttpClient, private avatarService: AvatarService) {
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
          // Atualiza o avatar através do serviço
          this.avatarService.updateAvatar(image.dataUrl);
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
          this.profileImage = docente?.avatar || 'assets/img/avatar.jpg';
        },
        error: () => {
          this.profileImage = 'assets/img/avatar.jpg';
        }
      });
    } else {
      this.profileImage = 'assets/img/avatar.jpg';
    }
  }

  navegarParaHome() {
    this.router.navigate(['/menu-docente']);
  }
}
