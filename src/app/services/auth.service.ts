import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  login(userType: 'aluno' | 'docente'): void {
    localStorage.setItem('userType', userType);
  }

  logout(): void {
    localStorage.removeItem('userType');
    localStorage.removeItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('userType');
  }
}
