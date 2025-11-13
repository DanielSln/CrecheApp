import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface DayEvent {
  date: string;
  title: string;
}

interface DayCell {
  iso: string;
  dayNumber: number;
  inMonth: boolean;
  event?: DayEvent | null;
}

@Component({
  selector: 'app-calendario-docente',
  templateUrl: './calendario-docente.page.html',
  styleUrls: ['./calendario-docente.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
  ],
})
export class CalendarioDocentePage implements OnInit {
  current = new Date();
  currentYear = this.current.getFullYear();
  currentMonth = this.current.getMonth(); // 0-11
  weeks: DayCell[][] = [];

  editingDateIso: string | null = null;
  editTitle = '';
  panelOpen = false;

  private apiUrl = 'https://back-end-pokecreche-production.up.railway.app';
  private allEvents: DayEvent[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.loadEvents();
  }

  private loadEvents() {
    this.http.get<any[]>(`${this.apiUrl}/eventos`).subscribe({
      next: (eventos) => {
        this.allEvents = eventos.map(e => ({
          date: e.date.slice(0, 10),
          title: e.title
        }));
        this.buildCalendar(this.currentYear, this.currentMonth);
      },
      error: () => {
        this.allEvents = [];
      }
    });
  }

  goToMenu() {
    this.router.navigateByUrl('/menu-docente');
  }

  buildCalendar(year: number, month: number) {
    const firstOfMonth = new Date(year, month, 1);
    const startDay = firstOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: DayCell[] = [];

    for (let i = 0; i < startDay; i++) {
      cells.push({ iso: '', dayNumber: 0, inMonth: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(year, month, d);
      const iso = dt.toISOString().slice(0, 10);
      const event = this.getEvent(iso);
      cells.push({ iso, dayNumber: d, inMonth: true, event });
    }

    while (cells.length % 7 !== 0) {
      cells.push({ iso: '', dayNumber: 0, inMonth: false });
    }

    this.weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
      this.weeks.push(cells.slice(i, i + 7));
    }
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.buildCalendar(this.currentYear, this.currentMonth);
    this.closePanel();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.buildCalendar(this.currentYear, this.currentMonth);
    this.closePanel();
  }

  openEdit(day: DayCell) {
    if (!day.inMonth) return;
    this.editingDateIso = day.iso;
    const ev = this.getEvent(day.iso);
    if (ev) {
      this.editTitle = ev.title;
    } else {
      this.editTitle = '';
    }
    this.panelOpen = true;
  }

  saveEdit() {
    if (!this.editingDateIso) return;
    if (!this.editTitle.trim()) {
      this.removeEvent(this.editingDateIso);
    } else {
      const payload = {
        date: this.editingDateIso,
        title: this.editTitle.trim(),
        color: 'blue'
      };
      this.http.post(`${this.apiUrl}/eventos`, payload).subscribe({
        next: () => {
          this.loadEvents();
        },
        error: (err) => {
          console.error('Erro ao salvar evento:', err);
          alert('Erro ao salvar evento');
        }
      });
    }
    this.refreshAndClose();
  }

  removeEdit() {
    if (!this.editingDateIso) return;
    this.removeEvent(this.editingDateIso);
    this.refreshAndClose();
  }

  cancelEdit() {
    this.closePanel();
  }

  private refreshAndClose() {
    this.buildCalendar(this.currentYear, this.currentMonth);
    this.closePanel();
  }

  private closePanel() {
    this.panelOpen = false;
    this.editingDateIso = null;
    this.editTitle = '';
  }

  getEvent(dateIso: string): DayEvent | null {
    const ev = this.allEvents.find((e) => e.date === dateIso);
    return ev ?? null;
  }



  removeEvent(dateIso: string) {
    this.http.delete(`${this.apiUrl}/eventos/${dateIso}`).subscribe({
      next: () => {
        this.loadEvents();
      },
      error: (err) => {
        console.error('Erro ao remover evento:', err);
      }
    });
  }

  getMonthNameShort(monthIndex: number) {
    return [
      'JAN',
      'FEV',
      'MAR',
      'ABR',
      'MAI',
      'JUN',
      'JUL',
      'AGO',
      'SET',
      'OUT',
      'NOV',
      'DEZ',
    ][monthIndex];
  }

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler() {
    this.closePanel();
  }
}
