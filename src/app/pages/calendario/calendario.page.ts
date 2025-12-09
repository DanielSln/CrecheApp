import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonIcon,
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
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonIcon,
  ],
})
export class CalendarioPage implements OnInit {
  current = new Date();
  currentYear = this.current.getFullYear();
  currentMonth = this.current.getMonth(); // 0-11
  weeks: DayCell[][] = [];

  private apiUrl = 'https://backend-crecheapp.vercel.app';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.loadEvents();
  }

  goToMenu() {
    this.router.navigateByUrl('/menu');
  }

  // build calendar grid and read events from localStorage
  buildCalendar(year: number, month: number) {
    const firstOfMonth = new Date(year, month, 1);
    const startDay = firstOfMonth.getDay(); // 0 Sun - 6 Sat
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

  private allEvents: DayEvent[] = [];

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

  private getEvent(dateIso: string): DayEvent | null {
    const ev = this.allEvents.find((e) => e.date === dateIso);
    return ev ?? null;
  }

  // navigation controls
  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.buildCalendar(this.currentYear, this.currentMonth);
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.buildCalendar(this.currentYear, this.currentMonth);
  }

  refresh() {
    this.loadEvents();
  }

  showEventModal = false;
  selectedEvent: DayEvent | null = null;

  openEventModal(day: DayCell) {
    if (day.event && day.inMonth) {
      this.selectedEvent = day.event;
      this.showEventModal = true;
    }
  }

  closeEventModal() {
    this.showEventModal = false;
    this.selectedEvent = null;
  }

  getMonthNameShort(monthIndex: number) {
    return ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'][monthIndex];
  }
}
