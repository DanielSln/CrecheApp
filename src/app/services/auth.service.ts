import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkAuth());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {}

  /**
   * Verifica se o usuário está autenticado consultando o localStorage
   */
  private checkAuth(): boolean {
    try {
      const userType = localStorage.getItem('userType');
      const token = localStorage.getItem('authToken'); // ou qualquer outro identificador de autenticação
      return !!userType; // Retorna true se userType existe
    } catch (e) {
      return false;
    }
  }

  /**
   * Marca o usuário como autenticado
   */
  login(userType: 'aluno' | 'docente'): void {
    localStorage.setItem('userType', userType);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Marca o usuário como desautenticado
   */
  logout(): void {
    localStorage.removeItem('userType');
    localStorage.removeItem('authToken');
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Retorna se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
