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
import { API_CONFIG } from '../../config/api.config';
import { HttpService } from '../../services/http.service';

interface LoginResponse {
  success: boolean;
  user?: {
    id: string;
    nome: string;
    matricula: string;
  };
  token?: string;
  message?: string;
}

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
  nome = '';
  cpf = '';
  matricula = '';
  isLoading = false;
  rememberMe = false;
  private readonly apiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN_ALUNO}`;

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertController: AlertController,
    private authService: AuthService,
    private avatarService: AvatarService,
    private httpService: HttpService
  ) {}

  ngOnInit() {
    this.loadSavedCredentials();
  }

  private loadSavedCredentials() {
    const savedRemember = localStorage.getItem('rememberMeAluno');
    if (savedRemember === 'true') {
      this.nome = localStorage.getItem('rememberedNomeAluno') || '';
      this.cpf = localStorage.getItem('rememberedCpfAluno') || '';
      this.matricula = localStorage.getItem('rememberedMatriculaAluno') || '';
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
    if (!this.isFormValid()) {
      await this.mostrarAlerta('Erro', 'Por favor, preencha todos os campos!');
      return;
    }

    this.isLoading = true;
    
    try {
      const response = await this.httpService.post<LoginResponse>(API_CONFIG.ENDPOINTS.LOGIN_ALUNO, {
        matricula: this.matricula,
        cpf: this.cpf
      }).toPromise();

      if (response?.success && response.user) {
        await this.handleSuccessfulLogin(response);
      } else {
        await this.mostrarAlerta('Erro', response?.message || 'Credenciais inválidas!');
      }
    } catch (error: any) {
      console.error('Erro na requisição:', error);
      await this.mostrarAlerta('Erro', error.message || 'Erro ao conectar com o servidor!');
    } finally {
      this.isLoading = false;
    }
  }

  private isFormValid(): boolean {
    return !!(this.nome.trim() && this.cpf.trim() && this.matricula.trim());
  }

  private async handleSuccessfulLogin(response: LoginResponse) {
    this.authService.login('aluno');
    
    localStorage.setItem('userId', response.user!.id);
    localStorage.setItem('userName', response.user!.nome);
    localStorage.setItem('userEmail', `Matrícula: ${response.user!.matricula}`);
    localStorage.setItem('userToken', response.token || '');

    this.avatarService.reloadAvatar();
    this.handleRememberMe();

    const termosAceitos = localStorage.getItem('termosAceitos');
    const nextRoute = termosAceitos === 'true' ? '/menu' : '/termos';
    this.router.navigateByUrl(nextRoute);
  }

  private handleRememberMe() {
    const keys = ['rememberedNomeAluno', 'rememberedCpfAluno', 'rememberedMatriculaAluno', 'rememberMeAluno'];
    
    if (this.rememberMe) {
      localStorage.setItem('rememberedNomeAluno', this.nome);
      localStorage.setItem('rememberedCpfAluno', this.cpf);
      localStorage.setItem('rememberedMatriculaAluno', this.matricula);
      localStorage.setItem('rememberMeAluno', 'true');
    } else {
      keys.forEach(key => localStorage.removeItem(key));
    }
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
