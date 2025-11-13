import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonItem,
  IonIcon,
  IonLabel,
  IonProgressBar,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { restaurantOutline, happyOutline, peopleOutline } from 'ionicons/icons';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-status',
  templateUrl: './status.page.html',
  styleUrls: ['./status.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonMenuButton,
    IonItem,
    IonIcon,
    IonLabel,
    IonProgressBar,
  ],
})

export class StatusPage implements OnInit {
  registroAtual: number = 0;
  totalRegistros: number = 5;

  status = [
    {
      titulo: 'Alimentação',
      mensagem: 'Seu filho está indo bem!',
      icone: 'restaurant-outline',
      cor: 'danger',
      valor: 0
    },
    {
      titulo: 'Comportamento',
      mensagem: 'Seu filho é um exemplo para todos!',
      icone: 'happy-outline',
      cor: 'success',
      valor: 0
    },
    {
      titulo: 'Presença',
      mensagem: 'Seu filho está comparecendo frequentemente!',
      icone: 'people-outline',
      cor: 'primary',
      valor: 0
    }
  ];

  private apiUrl = 'https://back-end-pokecreche-production.up.railway.app';

  constructor(private router: Router, private http: HttpClient) {
    addIcons({
      'restaurant-outline': restaurantOutline,
      'happy-outline': happyOutline,
      'people-outline': peopleOutline
    });
  }

  ngOnInit() {
    this.calcularPorcentagens();
  }

  calcularPorcentagens() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.http.get<any[]>(`${this.apiUrl}/registros/${userId}`).subscribe({
      next: (registros) => {
        const registrosOrdenados = registros.sort((a, b) => 
          new Date(b.data).getTime() - new Date(a.data).getTime()
        );

        const totalRegistros = registrosOrdenados.length;
        const semanaAtual = Math.floor(totalRegistros / 5);
        const inicioSemana = semanaAtual * 5;
        const registrosSemana = registrosOrdenados.slice(inicioSemana, inicioSemana + 5);
        const total = registrosSemana.length;

        this.registroAtual = total;

        if (total > 0) {
          const valores = { 'Ótimo': 100, 'Bom': 75, 'Regular': 50, 'Ruim': 25 };
          const presencaValores = { 'Presente': 100, 'Ausente': 0 };

          const somaAlimentacao = registrosSemana.reduce((acc, r) => acc + (valores[r.alimentacao as keyof typeof valores] || 0), 0);
          const somaComportamento = registrosSemana.reduce((acc, r) => acc + (valores[r.comportamento as keyof typeof valores] || 0), 0);
          const somaPresenca = registrosSemana.reduce((acc, r) => acc + (presencaValores[r.presenca as keyof typeof presencaValores] || 0), 0);

          this.status[0].valor = Math.round(somaAlimentacao / total);
          this.status[1].valor = Math.round(somaComportamento / total);
          this.status[2].valor = Math.round(somaPresenca / total);
        }
      },
      error: (err) => {
        console.error('Erro ao carregar registros:', err);
      }
    });
  }

  getInicioSemana(data: Date): Date {
    const d = new Date(data);
    d.setHours(0, 0, 0, 0);
    const dia = d.getDay();
    const diff = d.getDate() - dia + (dia === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  getDiasPassadosSemana(data: Date): number {
    const dia = data.getDay();
    return dia === 0 ? 6 : dia - 1;
  }
  
  goToMenu() {
    this.router.navigateByUrl('/menu');
  }
}
