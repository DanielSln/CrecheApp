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
   */
  private fetchUserAvatar(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.http.get<any>(`${this.apiUrl}/alunos`).subscribe({
        next: (alunos) => {
          const aluno = alunos.find((a: any) => a.id == userId);
          if (aluno?.avatar) {
            this.userAvatarSubject.next(aluno.avatar);
            localStorage.setItem('userAvatar', aluno.avatar);
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
   */
  updateAvatar(avatarData: string): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.http.put(`${this.apiUrl}/alunos/${userId}/avatar`, { avatar: avatarData }).subscribe({
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
