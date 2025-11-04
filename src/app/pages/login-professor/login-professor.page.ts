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
    private alertController: AlertController
  ) {}

  ngOnInit() {
    const savedId = localStorage.getItem('rememberedId');
    const savedSenha = localStorage.getItem('rememberedSenha');
    const savedRemember = localStorage.getItem('rememberMe');

    if (savedRemember === 'true' && savedId && savedSenha) {
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
      .post('https://api-cadastro-six.vercel.app/login/docente', {
        identificador: this.id,
        senha: this.senha,
      })
      .subscribe({
        next: async (response: any) => {
          this.isLoading = false;
          if (response.success && response.user) {
            localStorage.setItem('userType', 'docente');
            localStorage.setItem('userName', response.user.nome);
            localStorage.setItem('userEmail', 'Cargo: Docente');
            localStorage.setItem('userToken', response.token || '');

            if (this.rememberMe) {
              localStorage.setItem('rememberedId', this.id);
              localStorage.setItem('rememberedSenha', this.senha);
              localStorage.setItem('rememberMe', 'true');
            } else {
              localStorage.removeItem('rememberedId');
              localStorage.removeItem('rememberedSenha');
              localStorage.removeItem('rememberMe');
            }

            await this.mostrarAlerta('Sucesso', 'Login realizado com sucesso!');
            this.router.navigateByUrl('/menu-docente');
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
