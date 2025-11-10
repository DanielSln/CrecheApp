import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { pencil } from 'ionicons/icons';

@Component({
  selector: 'app-comunicados-docente',
  templateUrl: './comunicados-docente.page.html',
  styleUrls: ['./comunicados-docente.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonIcon,
    CommonModule,
    FormsModule,
  ],
})
export class ComunicadosDocentePage implements OnInit {
  pencil = pencil;

  comunicados = [
    {
      id: 0,
      title: 'Reunião de Pais',
      preview: 'Reunião na sexta-feira, dia 20/12, às 19h...',
      content:
        'Informamos que haverá reunião de pais na próxima sexta-feira, dia 20/12, às 19h no auditório da creche.\n\nAssunto: Planejamento 2025\n\nTemas a serem abordados:\n• Calendário escolar 2025\n• Novos projetos pedagógicos\n• Melhorias na infraestrutura\n• Feedback dos pais\n\nContamos com a presença de todos!',
      date: '15/12/2024',
      type: 'urgent',
      emoji: '🚨',
    },
    {
      id: 1,
      title: 'Horário de Funcionamento',
      preview: 'Horário reduzido durante as festas natalinas...',
      content:
        'Durante o período de festas natalinas, a creche funcionará em horário reduzido.\n\nNovos horários:\n• 23/12 a 26/12: Fechado\n• 27/12 a 30/12: 8h às 16h\n• 31/12 a 02/01: Fechado\n• A partir de 03/01: Horário normal\n\nConsulte a secretaria para mais informações.',
      date: '12/12/2024',
      type: 'default',
      emoji: '📝',
    },
    {
      id: 2,
      title: 'Festa de Natal',
      preview: 'Festa no dia 22/12 às 14h. Venham fantasiados!',
      content:
        'Nossa festa de Natal será no dia 22/12 às 14h!\n\nAs crianças poderão vir fantasiadas de:\n• Papai Noel\n• Rena\n• Duende\n• Outros personagens natalinos\n\nHaverá:\n• Apresentações das turmas\n• Lanche especial\n• Troca de presentes\n• Visita do Papai Noel\n\nVenham participar desta festa mágica!',
      date: '10/12/2024',
      type: 'info',
      emoji: '🎄',
    },
    {
      id: 3,
      title: 'Cardápio da Semana',
      preview: 'Pratos especiais de Natal. Confira no mural...',
      content:
        'O cardápio desta semana inclui pratos especiais de Natal:\n\nSegunda: Sopa de legumes natalina\nTerça: Frango assado com farofa\nQuarta: Peixe grelhado com purê\nQuinta: Lasanha de frango\nSexta: Pizza caseira\n\nSobremesas especiais:\n• Pudim de leite\n• Gelatina colorida\n• Frutas da estação\n\nConfira no mural da entrada os detalhes de cada refeição.',
      date: '08/12/2024',
      type: 'default',
      emoji: '🍽️',
    },
    {
      id: 4,
      title: 'Material Escolar 2025',
      preview: 'Lista de materiais disponível na secretaria...',
      content:
        'A lista de materiais escolares para 2025 já está disponível!\n\nOnde retirar:\n• Secretaria da creche\n• Site oficial\n• WhatsApp da turma\n\nPrazo para compra:\n• Até 31/01/2025\n\nDicas:\n• Marque todos os materiais com o nome da criança\n• Prefira materiais de qualidade\n• Organize em uma caixa identificada\n\nDúvidas? Procure a coordenação.',
      date: '05/12/2024',
      type: 'default',
      emoji: '📚',
    },
    {
      id: 5,
      title: 'Gincana de Fim de Ano',
      preview: 'Atividades recreativas para todas as turmas...',
      content:
        'Gincana de Fim de Ano - 18/12 às 15h\n\nAtividades recreativas para todas as turmas:\n\n• Corrida do saco\n• Dança da cadeira\n• Caça ao tesouro\n• Pintura facial\n• Jogos educativos\n• Brincadeiras tradicionais\n\nPrêmios para todos os participantes!\n\nVenham torcer pelas crianças e participar desta tarde divertida.',
      date: '03/12/2024',
      type: 'default',
      emoji: '🏆',
    },
    {
      id: 6,
      title: 'Formatura ABC',
      preview: 'Cerimônia de formatura das turmas do ABC...',
      content:
        'Cerimônia de Formatura das Turmas do ABC\n\nData: 19/12/2024\nHorário: 19h\nLocal: Auditório da creche\n\nProgramação:\n• Entrada solene das crianças\n• Apresentação do coral infantil\n• Entrega dos certificados\n• Discurso da diretora\n• Foto oficial da turma\n• Coquetel de confraternização\n\nTraje: Social\n\nEste é um momento muito especial para as crianças que estão se formando. Contamos com a presença de toda a família!',
      date: '01/12/2024',
      type: 'info',
      emoji: '🎆',
    },
  ];

  constructor(private router: Router) {
    console.log('ComunicadosDocentePage constructor chamado');
  }

  ngOnInit() {
    console.log('ComunicadosDocentePage ngOnInit chamado');
    this.carregarComunicados();
    console.log('Total de comunicados:', this.comunicados.length);
  }
  
  ionViewWillEnter() {
    console.log('ionViewWillEnter - recarregando comunicados');
    this.carregarComunicados();
  }
  
  carregarComunicados() {
    // Carregar comunicados enviados do localStorage
    const comunicadosEnviados = JSON.parse(localStorage.getItem('comunicados_enviados') || '[]');
    console.log('Comunicados do localStorage:', comunicadosEnviados);
    
    // Usar apenas comunicados enviados pelos docentes
    this.comunicados = comunicadosEnviados;
    console.log('Total de comunicados após carregar:', this.comunicados.length);
  }

  irParaEscrever() {
    console.log('irParaEscrever chamado');
    // Limpar qualquer rascunho carregado anterior para começar novo
    sessionStorage.removeItem('rascunhoCarregado');
    console.log('Navegando para /escrever-comunicado');
    this.router.navigateByUrl('/escrever-comunicado');
  }

  verRascunhos() {
    console.log('verRascunhos chamado');
    const rascunhos = JSON.parse(localStorage.getItem('rascunhos') || '[]');
    console.log('Rascunhos encontrados:', rascunhos);
    
    if (rascunhos.length === 0) {
      alert('Nenhum rascunho salvo.\n\nPara criar um rascunho:\n1. Clique em "Novo Comunicado"\n2. Preencha os campos\n3. Clique em "Salvar rascunho"');
      return;
    }
    
    const lista = rascunhos
      .map((r: any, i: number) => `${i + 1}. ${r.subject || '[Sem assunto]'} (${r.savedAt})`)
      .join('\n');
    
    const escolha = prompt(`Rascunhos salvos (${rascunhos.length}):\n${lista}\n\nDigite o número para carregar ou 0 para cancelar:`);
    
    console.log('Escolha do usuário:', escolha);
    
    if (escolha && parseInt(escolha) > 0 && parseInt(escolha) <= rascunhos.length) {
      const rascunho = rascunhos[parseInt(escolha) - 1];
      console.log('Rascunho selecionado:', rascunho);
      sessionStorage.setItem('rascunhoCarregado', JSON.stringify(rascunho));
      this.router.navigateByUrl('/escrever-comunicado');
    }
  }

  openComunicado(index: number) {
    const comunicado = this.comunicados[index];
    console.log('Abrindo comunicado:', comunicado.title);
    console.log('ID do comunicado:', comunicado.id);
    console.log('Comunicado completo:', comunicado);
    this.router.navigate(['/comunicados-docente/detalhes', comunicado.id]);
  }

  goToMenu() {
    this.router.navigateByUrl('/menu-docente');
  }
}
