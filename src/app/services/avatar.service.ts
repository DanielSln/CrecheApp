import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private readonly apiUrl = 'https://backend-crecheapp.vercel.app';
  private readonly defaultAvatar = 'assets/img/avatar.jpg';
  private userAvatarSubject = new BehaviorSubject<string>(this.defaultAvatar);
  public userAvatar$ = this.userAvatarSubject.asObservable();
  private avatarCache = new Map<string, string>();

  constructor(private http: HttpClient) {
    this.loadUserAvatar();
  }

  private loadUserAvatar(): void {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      this.userAvatarSubject.next(savedAvatar);
    } else {
      this.fetchUserAvatar();
    }
  }

  private fetchUserAvatar(): void {
    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');
    
    if (!userId || !userType) return;

    const cacheKey = `${userType}-${userId}`;
    if (this.avatarCache.has(cacheKey)) {
      const cachedAvatar = this.avatarCache.get(cacheKey)!;
      this.userAvatarSubject.next(cachedAvatar);
      return;
    }

    const endpoint = userType === 'docente' ? 'docentes' : 'alunos';
    
    this.http.get<any>(`${this.apiUrl}/${endpoint}/${userId}`).subscribe({
      next: (usuario) => {
        const avatar = usuario?.avatar || this.defaultAvatar;
        this.userAvatarSubject.next(avatar);
        localStorage.setItem('userAvatar', avatar);
        this.avatarCache.set(cacheKey, avatar);
      },
      error: () => {
        this.userAvatarSubject.next(this.defaultAvatar);
      }
    });
  }

  updateAvatar(avatarData: string): void {
    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');
    
    if (!userId || !userType) return;

    const endpoint = userType === 'docente' ? 'docentes' : 'alunos';
    
    this.http.put(`${this.apiUrl}/${endpoint}/${userId}/avatar`, { avatar: avatarData }).subscribe({
      next: () => {
        this.userAvatarSubject.next(avatarData);
        localStorage.setItem('userAvatar', avatarData);
        this.avatarCache.set(`${userType}-${userId}`, avatarData);
      },
      error: (error) => {
        console.error('Erro ao atualizar avatar:', error);
      }
    });
  }

  reloadAvatar(): void {
    localStorage.removeItem('userAvatar');
    this.avatarCache.clear();
    this.fetchUserAvatar();
  }

  getCurrentAvatar(): string {
    return this.userAvatarSubject.value;
  }

  getAvatar(): Observable<string> {
    return this.userAvatar$;
  }
}
