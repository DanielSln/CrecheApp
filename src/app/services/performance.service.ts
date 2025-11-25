import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private imageCache = new Map<string, string>();

  // Cache de imagens para carregamento mais rápido
  async preloadImage(src: string): Promise<string> {
    if (this.imageCache.has(src)) {
      return this.imageCache.get(src)!;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.imageCache.set(src, src);
        resolve(src);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  // Lazy loading para componentes pesados
  async loadComponent<T>(importFn: () => Promise<T>): Promise<T> {
    try {
      return await importFn();
    } catch (error) {
      console.error('Erro ao carregar componente:', error);
      throw error;
    }
  }

  // Debounce para otimizar chamadas de API
  debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // Monitora performance da aplicação
  measurePerformance(name: string, fn: () => void): void {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name} executado em ${end - start} ms`);
  }
}