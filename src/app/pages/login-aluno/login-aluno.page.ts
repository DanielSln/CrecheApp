import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  AlertController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

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
    HttpClientModule
  ]
})
export class LoginAlunoPage implements OnInit {
  nome: string = '';
  cpf: string = '';
  matricula: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

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

    // Temporário: pular verificação do servidor
    localStorage.setItem('userType', 'aluno');
    localStorage.setItem('userName', this.nome);
    localStorage.setItem('userEmail', 'Matrícula: ' + this.matricula);
    this.router.navigateByUrl('/termos');

    /* Descomente quando o servidor estiver rodando:
    this.isLoading = true;
    this.http.post('http://127.0.0.1:3000/login/aluno', {
      matricula: this.matricula,
      cpf: this.cpf
    }).subscribe({
      next: async (response: any) => {
        this.isLoading = false;
        if (response.success && response.user) {
          localStorage.setItem('userType', 'aluno');
          localStorage.setItem('userName', response.user.nome);
          localStorage.setItem('userEmail', 'Matrícula: ' + response.user.matricula);
          localStorage.setItem('userToken', response.token || '');
          await this.mostrarAlerta('Sucesso', 'Login realizado com sucesso!');
          this.router.navigateByUrl('/termos');
        } else {
          await this.mostrarAlerta('Erro', response.message || 'Credenciais inválidas!');
        }
      },
      error: async (error: any) => {
        this.isLoading = false;
        await this.mostrarAlerta('Erro', 'Erro ao conectar com o servidor!');
      }
    });
    */
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