import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private readonly cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  // Cache com TTL (Time To Live)
  setCache(key: string, data: any, ttlMs: number = 300000): void { // 5 min default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    });
  }

  getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  // Debounce para otimizar chamadas frequentes
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

  // Lazy loading para imagens
  lazyLoadImage(img: HTMLImageElement, src: string): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          img.src = src;
          observer.unobserve(img);
        }
      });
    });
    observer.observe(img);
  }

  // Preload de recursos críticos
  preloadResource(url: string, type: 'image' | 'script' | 'style' = 'image'): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    document.head.appendChild(link);
  }
}
