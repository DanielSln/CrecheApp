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

addIcons({ camera });
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { HttpClient } from '@angular/common/http';
import { AvatarService } from '../../services/avatar.service';

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
  profileImage: string = '';
  private apiUrl = 'https://backend-crecheapp.vercel.app';

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
        console.log('UserId:', userId);
        if (userId) {
          // Atualiza o avatar através do serviço
          this.avatarService.updateAvatar(image.dataUrl);
        } else {
          console.error('UserId não encontrado no localStorage');
        }
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  }
  escola: string = 'SENAC';
  nome: string = '';
  matricula: string = '';

  constructor(private router: Router, private http: HttpClient, private avatarService: AvatarService) {
    addIcons({ camera });
  }

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.nome = localStorage.getItem('userName') || 'Não informado';
    const matriculaCompleta =
      localStorage.getItem('userEmail') || 'Não informado';
    this.matricula = matriculaCompleta.includes(':')
      ? matriculaCompleta.split(':')[1].trim()
      : matriculaCompleta;
    
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.http.get<any>(`${this.apiUrl}/alunos`).subscribe({
        next: (alunos) => {
          const aluno = alunos.find((a: any) => a.id == userId);
          this.profileImage = aluno?.avatar || 'assets/img/avatar.jpg';
        },
        error: () => {
          this.profileImage = 'assets/img/avatar.jpg';
        }
      });
    } else {
      this.profileImage = 'assets/img/avatar.jpg';
    }
  }

  goToMenu() {
    this.router.navigateByUrl('/menu');
  }
}
