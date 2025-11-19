import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private apiUrl = 'https://back-end-pokecreche-production.up.railway.app';
  private userAvatarSubject = new BehaviorSubject<string>('assets/img/avatar.jpg');
  public userAvatar$ = this.userAvatarSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserAvatar();
  }

  /**
   * Carrega o avatar do usuário do localStorage ou do servidor
   */
  private loadUserAvatar(): void {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      this.userAvatarSubject.next(savedAvatar);
    } else {
      this.fetchUserAvatar();
    }
  }

  /**
   * Busca o avatar do usuário no servidor
   * Detecta automaticamente se é aluno ou docente pelo userType
   */
  private fetchUserAvatar(): void {
    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');
    
    if (userId) {
      const endpoint = userType === 'docente' ? 'docentes' : 'alunos';
      
      this.http.get<any>(`${this.apiUrl}/${endpoint}`).subscribe({
        next: (usuarios) => {
          const usuario = usuarios.find((u: any) => u.id == userId);
          if (usuario?.avatar) {
            this.userAvatarSubject.next(usuario.avatar);
            localStorage.setItem('userAvatar', usuario.avatar);
          }
        },
        error: () => {
          this.userAvatarSubject.next('assets/img/avatar.jpg');
        }
      });
    }
  }

  /**
   * Atualiza o avatar do usuário
   * Detecta automaticamente se é aluno ou docente pelo userType
   */
  updateAvatar(avatarData: string): void {
    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');
    
    if (userId) {
      const endpoint = userType === 'docente' ? 'docentes' : 'alunos';
      
      this.http.put(`${this.apiUrl}/${endpoint}/${userId}/avatar`, { avatar: avatarData }).subscribe({
        next: (response: any) => {
          this.userAvatarSubject.next(avatarData);
          localStorage.setItem('userAvatar', avatarData);
        },
        error: (error) => {
          console.error('Erro ao atualizar avatar:', error);
        }
      });
    }
  }

  /**
   * Recarrega o avatar do usuário (útil ao trocar de usuário)
   */
  reloadAvatar(): void {
    localStorage.removeItem('userAvatar');
    this.fetchUserAvatar();
  }

  /**
   * Retorna o avatar atual do usuário
   */
  getCurrentAvatar(): string {
    return this.userAvatarSubject.value;
  }

  /**
   * Retorna um observable do avatar do usuário
   */
  getAvatar(): Observable<string> {
    return this.userAvatar$;
  }
}
