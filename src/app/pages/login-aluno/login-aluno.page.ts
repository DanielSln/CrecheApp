import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  AlertController,
  IonItem,
  IonCheckbox,
  IonLabel,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AvatarService } from '../../services/avatar.service';

@Component({
  selector: 'app-login-aluno',
  templateUrl: './login-aluno.page.html',
  styleUrls: ['./login-aluno.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonItem,
    IonCheckbox,
    IonLabel,
  ]
})
export class LoginAlunoPage implements OnInit {
  nome: string = '';
  cpf: string = '';
  matricula: string = '';
  isLoading: boolean = false;
  rememberMe: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertController: AlertController,
    private authService: AuthService,
    private avatarService: AvatarService
  ) {}

  ngOnInit() {
    const savedNome = localStorage.getItem('rememberedNomeAluno');
    const savedCpf = localStorage.getItem('rememberedCpfAluno');
    const savedMatricula = localStorage.getItem('rememberedMatriculaAluno');
    const savedRemember = localStorage.getItem('rememberMeAluno');

    if (savedRemember === 'true' && savedCpf && savedMatricula) {
      this.nome = savedNome || '';
      this.cpf = savedCpf || '';
      this.matricula = savedMatricula || '';
      this.rememberMe = true;
    }
  }

  irParaLoginAluno() {
    this.router.navigateByUrl('/login-aluno');
  }

  irParaLoginProfessor() {
    this.router.navigateByUrl('/login-professor');
  }

  async irParaTermos() {
    if (!this.nome || !this.cpf || !this.matricula) {
      await this.mostrarAlerta('Erro', 'Por favor, preencha todos os campos!');
      return;
    }

    this.isLoading = true;
    
    this.http.post('https://back-end-pokecreche-production.up.railway.app/login/aluno', {
      matricula: this.matricula,
      cpf: this.cpf
    }).subscribe({
      next: async (response: any) => {
        this.isLoading = false;
        if (response.success && response.user) {
          // Autentica o usuário através do AuthService
          this.authService.login('aluno');
          
          localStorage.setItem('userId', response.user.id);
          localStorage.setItem('userName', response.user.nome);
          localStorage.setItem('userEmail', 'Matrícula: ' + response.user.matricula);
          localStorage.setItem('userToken', response.token || '');

          // Recarrega o avatar para o novo usuário
          this.avatarService.reloadAvatar();

          if (this.rememberMe) {
            localStorage.setItem('rememberedNomeAluno', this.nome);
            localStorage.setItem('rememberedCpfAluno', this.cpf);
            localStorage.setItem('rememberedMatriculaAluno', this.matricula);
            localStorage.setItem('rememberMeAluno', 'true');
          } else {
            localStorage.removeItem('rememberedNomeAluno');
            localStorage.removeItem('rememberedCpfAluno');
            localStorage.removeItem('rememberedMatriculaAluno');
            localStorage.removeItem('rememberMeAluno');
          }

          const termosAceitos = localStorage.getItem('termosAceitos');
          if (termosAceitos === 'true') {
            this.router.navigateByUrl('/menu');
          } else {
            this.router.navigateByUrl('/termos');
          }
        } else {
          await this.mostrarAlerta('Erro', response.message || 'Credenciais inválidas!');
        }
      },
      error: async (error: any) => {
        this.isLoading = false;
        console.error('Erro na requisição:', error);
        await this.mostrarAlerta('Erro', 'Erro ao conectar com o servidor!');
      }
    });
  }

  private async mostrarAlerta(titulo: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });
    await alert.present();
  }
}