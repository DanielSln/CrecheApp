import { Component } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonBackButton,
  IonIcon,
  IonInput,
  IonTextarea,
  IonTitle,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  closeOutline, 
  linkOutline, 
  happyOutline, 
  ellipsisVertical,
  chevronDownOutline,
  sendOutline,
  textOutline,
  saveOutline,
  trashOutline,
  timeOutline,
  flagOutline,
  listOutline
} from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-escrever-comunicado',
  templateUrl: './escrever-comunicado.page.html',
  styleUrls: ['./escrever-comunicado.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonBackButton,
    IonIcon,
    IonInput,
    IonTextarea,
    IonTitle,
    CommonModule,
    FormsModule,
  ],
})
export class EscreverComunicadoPage {
  from: string = 'docente@crecheapp.com';
  to: string = '';
  cc: string = '';
  bcc: string = '';
  subject: string = '';
  message: string = '';
  showCcBcc: boolean = false;
  selectedIcon: string = '📝';
  showIconPicker: boolean = false;
  availableIcons: string[] = ['🚨', '📝', '🎄', '🍽️', '📚', '🏅', '🎆', '📢', '⚠️', '💡', '🎉', '📅'];

  constructor(private router: Router, private location: Location) {
    addIcons({
      'close-outline': closeOutline,
      'link-outline': linkOutline,
      'happy-outline': happyOutline,
      'ellipsis-vertical': ellipsisVertical,
      'chevron-down-outline': chevronDownOutline,
      'send-outline': sendOutline,
      'text-outline': textOutline,
      'save-outline': saveOutline,
      'trash-outline': trashOutline,
      'time-outline': timeOutline,
      'flag-outline': flagOutline,
      'list-outline': listOutline
    });
  }

  toggleCcBcc() {
    this.showCcBcc = !this.showCcBcc;
  }

  fecharComposer() {
    this.location.back();
  }

  selecionarRemetente() {
    const remetentes = [
      { email: 'docente@crecheapp.com', nome: 'Professor(a)' },
      { email: 'coordenacao@crecheapp.com', nome: 'Coordenação' },
      { email: 'direcao@crecheapp.com', nome: 'Direção' }
    ];
    
    const opcoes = remetentes.map(r => `${r.nome} (${r.email})`).join('\n');
    const escolha = prompt(`Selecione o remetente:\n${opcoes}\n\nDigite 1, 2 ou 3:`);
    
    if (escolha && ['1', '2', '3'].includes(escolha)) {
      this.from = remetentes[parseInt(escolha) - 1].email;
      console.log('Remetente selecionado:', this.from);
    }
  }

  selecionarDestinatarios() {
    const grupos = [
      'Todos os Pais',
      'Turma Berçário',
      'Turma Maternal I', 
      'Turma Maternal II',
      'Turma Pré I',
      'Turma Pré II',
      'Professores',
      'Funcionários'
    ];
    
    const opcoes = grupos.map((g, i) => `${i + 1}. ${g}`).join('\n');
    const escolha = prompt(`Selecione os destinatários:\n${opcoes}\n\nDigite o número:`);
    
    if (escolha && parseInt(escolha) > 0 && parseInt(escolha) <= grupos.length) {
      this.to = grupos[parseInt(escolha) - 1];
      console.log('Destinatários selecionados:', this.to);
    }
  }

  agendarEnvio() {
    const agora = new Date();
    const amanha = new Date(agora.getTime() + 24 * 60 * 60 * 1000);
    const dataFormatada = amanha.toISOString().slice(0, 16);
    
    const dataEscolhida = prompt(`Agendar envio para quando?\n\nFormato: AAAA-MM-DD HH:MM\nExemplo: ${dataFormatada}`);
    
    if (dataEscolhida) {
      console.log('Comunicado agendado para:', dataEscolhida);
      alert(`Comunicado será enviado em: ${new Date(dataEscolhida).toLocaleString('pt-BR')}`);
    }
  }

  inserirLink() {
    const texto = prompt('Digite o texto do link:');
    if (!texto) return;
    
    const url = prompt('Digite a URL:');
    if (url) {
      const link = `[${texto}](${url})`;
      this.message += ` ${link}`;
      console.log('Link inserido:', { texto, url });
    }
  }

  inserirEmoji() {
    const emojis = ['😊', '👍', '❤️', '🎉', '⭐', '✅', '❗', '📌', '🚨', '📝', '🎄', '🍽️'];
    const opcoes = emojis.map((e, i) => `${i + 1}. ${e}`).join('  ');
    
    const escolha = prompt(`Escolha um emoji:\n${opcoes}\n\nDigite o número (1-${emojis.length}):`);
    
    if (escolha && parseInt(escolha) > 0 && parseInt(escolha) <= emojis.length) {
      const emoji = emojis[parseInt(escolha) - 1];
      this.message += ` ${emoji}`;
      console.log('Emoji inserido:', emoji);
    }
  }

  definirPrioridade() {
    const prioridades = [
      { nivel: 'baixa', cor: '🟢', desc: 'Informação geral' },
      { nivel: 'normal', cor: '🟡', desc: 'Comunicado padrão' },
      { nivel: 'alta', cor: '🟠', desc: 'Importante' },
      { nivel: 'urgente', cor: '🔴', desc: 'Urgente - Ação necessária' }
    ];
    
    const opcoes = prioridades.map((p, i) => `${i + 1}. ${p.cor} ${p.nivel.toUpperCase()} - ${p.desc}`).join('\n');
    const escolha = prompt(`Definir prioridade:\n${opcoes}\n\nDigite o número:`);
    
    if (escolha && parseInt(escolha) > 0 && parseInt(escolha) <= prioridades.length) {
      const prioridade = prioridades[parseInt(escolha) - 1];
      console.log('Prioridade definida:', prioridade);
      alert(`Prioridade definida: ${prioridade.nivel.toUpperCase()}`);
    }
  }

  mostrarOpcoes() {
    const opcoes = [
      '1. Solicitar confirmação de leitura',
      '2. Enviar cópia para coordenação',
      '3. Marcar como confidencial',
      '4. Adicionar lembrete automático'
    ];
    
    const escolha = prompt(`Opções avançadas:\n${opcoes.join('\n')}\n\nDigite o número:`);
    
    switch(escolha) {
      case '1':
        alert('Confirmação de leitura ativada');
        console.log('Confirmação de leitura solicitada');
        break;
      case '2':
        this.cc = this.cc ? `${this.cc}, coordenacao@crecheapp.com` : 'coordenacao@crecheapp.com';
        alert('Cópia para coordenação adicionada');
        break;
      case '3':
        alert('Comunicado marcado como confidencial');
        console.log('Comunicado confidencial');
        break;
      case '4':
        alert('Lembrete automático em 3 dias ativado');
        console.log('Lembrete automático configurado');
        break;
    }
  }

  aplicarNegrito() {
    const texto = prompt('Digite o texto para deixar em negrito:');
    if (texto) {
      this.message += ` **${texto}**`;
      console.log('Texto em negrito adicionado:', texto);
    }
  }
  
  criarLista() {
    const itens = prompt('Digite os itens da lista (separados por vírgula):');
    if (itens) {
      const lista = itens.split(',').map(item => `• ${item.trim()}`).join('\n');
      this.message += `\n\n${lista}`;
      console.log('Lista criada:', lista);
    }
  }

  mostrarIcones() {
    this.showIconPicker = !this.showIconPicker;
  }

  selecionarIcone(icon: string) {
    this.selectedIcon = icon;
    this.showIconPicker = false;
    console.log('Ícone selecionado:', icon);
  }

  salvarRascunho() {
    console.log('Salvando rascunho...');
    console.log({ 
      from: this.from, 
      to: this.to, 
      cc: this.cc,
      bcc: this.bcc,
      subject: this.subject, 
      message: this.message 
    });
  }

  descartarComunicado() {
    const confirmar = confirm('Tem certeza que deseja descartar este comunicado?');
    if (confirmar) {
      this.to = '';
      this.cc = '';
      this.bcc = '';
      this.subject = '';
      this.message = '';
      this.selectedIcon = '📝';
      this.showCcBcc = false;
      this.showIconPicker = false;
      console.log('Comunicado descartado');
    }
  }

  enviarComunicado() {
    if (!this.to || !this.subject || !this.message) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    console.log('Enviando comunicado...');
    console.log({ 
      from: this.from, 
      to: this.to, 
      cc: this.cc,
      bcc: this.bcc,
      subject: this.subject, 
      message: this.message,
      icon: this.selectedIcon,
      timestamp: new Date().toISOString()
    });
    
    alert('Comunicado enviado com sucesso!');
    this.router.navigateByUrl('/menu-docente');
  }
}
