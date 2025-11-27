import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private readonly defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  constructor(private http: HttpClient) {}

  private getFullUrl(endpoint: string): string {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Erro desconhecido';
    
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      switch (error.status) {
        case 0:
          errorMessage = 'Erro de conexão. Verifique sua internet ou tente novamente.';
          break;
        case 401:
          errorMessage = 'Credenciais inválidas';
          break;
        case 404:
          errorMessage = 'Serviço não encontrado';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor';
          break;
        default:
          errorMessage = `Erro ${error.status}: ${error.message}`;
      }
    }
    
    console.error('Erro HTTP:', error);
    return throwError(() => new Error(errorMessage));
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(
      this.getFullUrl(endpoint),
      data,
      { 
        headers: this.defaultHeaders,
        withCredentials: false // Importante para CORS
      }
    ).pipe(
      timeout(10000), // 10 segundos de timeout
      catchError(this.handleError)
    );
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(
      this.getFullUrl(endpoint),
      { 
        headers: this.defaultHeaders,
        withCredentials: false
      }
    ).pipe(
      timeout(10000),
      catchError(this.handleError)
    );
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(
      this.getFullUrl(endpoint),
      data,
      { 
        headers: this.defaultHeaders,
        withCredentials: false
      }
    ).pipe(
      timeout(10000),
      catchError(this.handleError)
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(
      this.getFullUrl(endpoint),
      { 
        headers: this.defaultHeaders,
        withCredentials: false
      }
    ).pipe(
      timeout(10000),
      catchError(this.handleError)
    );
  }
}