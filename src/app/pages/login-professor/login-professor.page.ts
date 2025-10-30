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
    HttpClientModule
  ],
})
export class LoginProfessorPage implements OnInit {
  nome: string = '';
  id: string = '';
  senha: string = '';
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

  async aceitarTermos() {
    if (!this.nome || !this.id || !this.senha) {
      await this.mostrarAlerta('Erro', 'Por favor, preencha todos os campos!');
      return;
    }

    this.isLoading = true;
    alert('Tentando conectar ao servidor em http://127.0.0.1:3000');

    this.http.post('http://127.0.0.1:3000/login/docente', {
      identificador: this.id,
      senha: this.senha
    }).subscribe({
      next: async (response: any) => {
        this.isLoading = false;

        if (response.success && response.user) {
          localStorage.setItem('userType', 'docente');
          localStorage.setItem('userName', response.user.nome);
          localStorage.setItem('userEmail', 'Cargo: Docente');
          localStorage.setItem('userToken', response.token || '');

          await this.mostrarAlerta('Sucesso', 'Login realizado com sucesso!');
          this.router.navigateByUrl('/menu-docente');
        } else {
          await this.mostrarAlerta('Erro', response.message || 'Credenciais inválidas!');
        }
      },
      error: async (error: any) => {
        this.isLoading = false;
        alert('Erro na requisição: ' + JSON.stringify(error.message));
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