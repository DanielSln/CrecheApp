import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-comunicado-detalhes',
  templateUrl: './comunicado-detalhes.page.html',
  styleUrls: ['./comunicado-detalhes.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    CommonModule,
  ],
})
export class ComunicadoDetalhesPage implements OnInit {
  comunicado: any;

  comunicados = [
    {
      id: 0,
      title: 'Reunião de Pais',
      content: 'Informamos que haverá reunião de pais na próxima sexta-feira, dia 20/12, às 19h no auditório da creche.\n\nAssunto: Planejamento 2025\n\nTemas a serem abordados:\n• Calendário escolar 2025\n• Novos projetos pedagógicos\n• Melhorias na infraestrutura\n• Feedback dos pais\n\nContamos com a presença de todos!',
      date: '15/12/2024',
      type: 'urgent',
      emoji: '🚨',
    },
    {
      id: 1,
      title: 'Horário de Funcionamento',
      content: 'Durante o período de festas natalinas, a creche funcionará em horário reduzido.\n\nNovos horários:\n• 23/12 a 26/12: Fechado\n• 27/12 a 30/12: 8h às 16h\n• 31/12 a 02/01: Fechado\n• A partir de 03/01: Horário normal\n\nConsulte a secretaria para mais informações.',
      date: '12/12/2024',
      type: 'default',
      emoji: '📝',
    },
    {
      id: 2,
      title: 'Festa de Natal',
      content: 'Nossa festa de Natal será no dia 22/12 às 14h!\n\nAs crianças poderão vir fantasiadas de:\n• Papai Noel\n• Rena\n• Duende\n• Outros personagens natalinos\n\nHaverá:\n• Apresentações das turmas\n• Lanche especial\n• Troca de presentes\n• Visita do Papai Noel\n\nVenham participar desta festa mágica!',
      date: '10/12/2024',
      type: 'info',
      emoji: '🎄',
    },
    {
      id: 3,
      title: 'Cardápio da Semana',
      content: 'O cardápio desta semana inclui pratos especiais de Natal:\n\nSegunda: Sopa de legumes natalina\nTerça: Frango assado com farofa\nQuarta: Peixe grelhado com purê\nQuinta: Lasanha de frango\nSexta: Pizza caseira\n\nSobremesas especiais:\n• Pudim de leite\n• Gelatina colorida\n• Frutas da estação\n\nConfira no mural da entrada os detalhes de cada refeição.',
      date: '08/12/2024',
      type: 'default',
      emoji: '🍽️',
    },
    {
      id: 4,
      title: 'Material Escolar 2025',
      content: 'A lista de materiais escolares para 2025 já está disponível!\n\nOnde retirar:\n• Secretaria da creche\n• Site oficial\n• WhatsApp da turma\n\nPrazo para compra:\n• Até 31/01/2025\n\nDicas:\n• Marque todos os materiais com o nome da criança\n• Prefira materiais de qualidade\n• Organize em uma caixa identificada\n\nDúvidas? Procure a coordenação.',
      date: '05/12/2024',
      type: 'default',
      emoji: '📚',
    },
    {
      id: 5,
      title: 'Gincana de Fim de Ano',
      content: 'Gincana de Fim de Ano - 18/12 às 15h\n\nAtividades recreativas para todas as turmas:\n\n• Corrida do saco\n• Dança da cadeira\n• Caça ao tesouro\n• Pintura facial\n• Jogos educativos\n• Brincadeiras tradicionais\n\nPrêmios para todos os participantes!\n\nVenham torcer pelas crianças e participar desta tarde divertida.',
      date: '03/12/2024',
      type: 'default',
      emoji: '🏆',
    },
    {
      id: 6,
      title: 'Formatura ABC',
      content: 'Cerimônia de Formatura das Turmas do ABC\n\nData: 19/12/2024\nHorário: 19h\nLocal: Auditório da creche\n\nProgramação:\n• Entrada solene das crianças\n• Apresentação do coral infantil\n• Entrega dos certificados\n• Discurso da diretora\n• Foto oficial da turma\n• Coquetel de confraternização\n\nTraje: Social\n\nEste é um momento muito especial para as crianças que estão se formando. Contamos com a presença de toda a família!',
      date: '01/12/2024',
      type: 'info',
      emoji: '🎆',
    },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID recebido:', id);
    
    // Buscar primeiro nos comunicados enviados (localStorage)
    const comunicadosEnviados = JSON.parse(localStorage.getItem('comunicados_enviados') || '[]');
    console.log('Comunicados do localStorage:', comunicadosEnviados);
    
    // Combinar todos os comunicados (localStorage + estáticos)
    const todosComunicados = [...comunicadosEnviados, ...this.comunicados];
    console.log('Todos os comunicados:', todosComunicados);
    
    // Buscar por ID (convertendo para string para comparação)
    this.comunicado = todosComunicados.find(c => 
      String(c.id) === String(id)
    );
    
    console.log('Comunicado encontrado:', this.comunicado);
    
    if (!this.comunicado) {
      console.error('Comunicado não encontrado para ID:', id);
      console.log('IDs disponíveis:', todosComunicados.map(c => c.id));
    }
  }

  getBadgeText(type: string): string {
    switch (type) {
      case 'urgent': return 'URGENTE';
      case 'info': return 'INFO';
      default: return 'AVISO';
    }
  }

  getFormattedContent(): string {
    return this.comunicado?.content.replace(/\n/g, '<br>') || '';
  }
}