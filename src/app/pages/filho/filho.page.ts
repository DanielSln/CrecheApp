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
import { HttpClient } from '@angular/common/http';

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
  private apiUrl = 'https://back-end-pokecreche-production.up.railway.app';

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
          this.http.put(`${this.apiUrl}/alunos/${userId}/avatar`, { avatar: image.dataUrl }).subscribe();
        }
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  }
  escola: string = 'SENAC';
  nome: string = '';
  matricula: string = '';

  constructor(private router: Router, private http: HttpClient) {}

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
          if (aluno?.avatar) {
            this.profileImage = aluno.avatar;
          }
        }
      });
    }
  }

  goToMenu() {
    this.router.navigateByUrl('/menu');
  }
}
