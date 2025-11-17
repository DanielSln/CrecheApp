import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutoRefreshService {
  private intervals: Map<string, any> = new Map();

  startAutoRefresh(key: string, callback: () => void, intervalMs: number = 5000) {
    this.stopAutoRefresh(key);
    const interval = setInterval(callback, intervalMs);
    this.intervals.set(key, interval);
  }

  stopAutoRefresh(key: string) {
    const interval = this.intervals.get(key);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(key);
    }
  }

  stopAll() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
  }
}