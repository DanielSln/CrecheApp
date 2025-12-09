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
  selector: 'app-login-professor',
  templateUrl: './login-professor.page.html',
  styleUrls: ['./login-professor.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonItem,
    IonCheckbox,
    IonLabel,
    HttpClientModule,
  ],
})
export class LoginProfessorPage implements OnInit {
  nome: string = '';
  id: string = '';
  senha: string = '';
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
    const savedNome = localStorage.getItem('rememberedNome');
    const savedId = localStorage.getItem('rememberedId');
    const savedSenha = localStorage.getItem('rememberedSenha');
    const savedRemember = localStorage.getItem('rememberMe');

    if (savedRemember === 'true' && savedId && savedSenha) {
      this.nome = savedNome || '';
      this.id = savedId;
      this.senha = savedSenha;
      this.rememberMe = true;
    }
  }

  async aceitarTermos() {
    if (!this.nome || !this.id || !this.senha) {
      await this.mostrarAlerta('Erro', 'Por favor, preencha todos os campos!');
      return;
    }

    this.isLoading = true;

    this.http
      .post('https://backend-crecheapp-59gt4rjzl-anthony3043s-projects.vercel.app/login/docente', {
        identificador: this.id,
        senha: this.senha,
      })
      .subscribe({
        next: async (response: any) => {
          this.isLoading = false;
          if (response.success && response.user) {
            // Autentica o usuário através do AuthService
            this.authService.login('docente');
            
            localStorage.setItem('userId', response.user.id);
            localStorage.setItem('userName', response.user.nome);
            localStorage.setItem('userEmail', 'ID: ' + (response.user.id || this.id));
            localStorage.setItem('userIdentificador', this.id);
            localStorage.setItem('userToken', response.token || '');

            // Recarrega o avatar para o novo usuário
            this.avatarService.reloadAvatar();

            if (this.rememberMe) {
              localStorage.setItem('rememberedNome', this.nome);
              localStorage.setItem('rememberedId', this.id);
              localStorage.setItem('rememberedSenha', this.senha);
              localStorage.setItem('rememberMe', 'true');
            } else {
              localStorage.removeItem('rememberedNome');
              localStorage.removeItem('rememberedId');
              localStorage.removeItem('rememberedSenha');
              localStorage.removeItem('rememberMe');
            }

            const termosAceitos = localStorage.getItem('termosAceitosDocente');
            if (termosAceitos === 'true') {
              this.router.navigateByUrl('/menu-docente');
            } else {
              this.router.navigateByUrl('/termos-docente');
            }
          } else {
            await this.mostrarAlerta(
              'Erro',
              response.message || 'Credenciais inválidas!'
            );
          }
        },
        error: async (error: any) => {
          this.isLoading = false;
          console.error('Erro na requisição:', error);
          await this.mostrarAlerta('Erro', 'Erro ao conectar com o servidor!');
        },
      });
  }

  private async mostrarAlerta(titulo: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // ✅ Corrige o erro do HTML
  irParaLoginAluno() {
    this.router.navigateByUrl('/login-aluno');
  }
}
