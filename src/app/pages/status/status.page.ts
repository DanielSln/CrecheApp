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

  constructor(private router: Router) {
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
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const relatorios = JSON.parse(localStorage.getItem('relatorios_alunos') || '{}');
    const alunoRelatorios = relatorios[user.id] || [];

    if (alunoRelatorios.length === 0) return;

    const valores = { 'Ótimo': 100, 'Bom': 75, 'Regular': 50, 'Ruim': 25 };
    
    // Alimentação
    const alimentacaoMedia = alunoRelatorios.reduce((acc: number, r: any) => 
      acc + (valores[r.alimentacao as keyof typeof valores] || 0), 0) / alunoRelatorios.length;
    this.status[0].valor = Math.round(alimentacaoMedia);

    // Comportamento
    const comportamentoMedia = alunoRelatorios.reduce((acc: number, r: any) => 
      acc + (valores[r.comportamento as keyof typeof valores] || 0), 0) / alunoRelatorios.length;
    this.status[1].valor = Math.round(comportamentoMedia);

    // Presença
    const presentes = alunoRelatorios.filter((r: any) => r.presenca === 'Presente').length;
    this.status[2].valor = Math.round((presentes / alunoRelatorios.length) * 100);
  }
  
  goToMenu() {
    this.router.navigateByUrl('/menu');
  }
}
