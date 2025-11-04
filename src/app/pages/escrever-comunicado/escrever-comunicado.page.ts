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
    const opcoes = [
      '1. Link personalizado',
      '2. Link para formulário',
      '3. Link para reunião online',
      '4. Contato da escola'
    ];
    
    const escolha = prompt(`Tipo de link:\n${opcoes.join('\n')}\n\nDigite o número:`);
    
    switch(escolha) {
      case '1':
        const texto = prompt('Digite o texto do link:');
        if (!texto) return;
        const url = prompt('Digite a URL:');
        if (url) this.message += ` [${texto}](${url})`;
        break;
      case '2':
        this.message += ` \n\n📋 [Clique aqui para preencher o formulário](https://forms.google.com/exemplo)`;
        break;
      case '3':
        this.message += ` \n\n📹 [Participar da reunião online](https://meet.google.com/exemplo)`;
        break;
      case '4':
        this.message += ` \n\n📞 Contatos:\n` +
          `Telefone: (11) 1234-5678\n` +
          `WhatsApp: (11) 9876-5432\n` +
          `Email: contato@crecheapp.com`;
        break;
    }
  }

  inserirEmoji() {
    const categorias = [
      '1. Emojis de comunicação',
      '2. Emojis de eventos',
      '3. Emojis de emoções',
      '4. Emojis de atividades',
      '5. Inserir texto decorativo'
    ];
    
    const categoria = prompt(`Categorias:\n${categorias.join('\n')}\n\nDigite o número:`);
    
    switch(categoria) {
      case '1':
        const comunicacao = ['📢', '📝', '📞', '✉️', '💬', '📣'];
        this.selecionarEmoji(comunicacao, 'Comunicação');
        break;
      case '2':
        const eventos = ['🎉', '🎄', '🎂', '🎆', '🎪', '🎈'];
        this.selecionarEmoji(eventos, 'Eventos');
        break;
      case '3':
        const emocoes = ['😊', '😄', '❤️', '👍', '😍', '🤗'];
        this.selecionarEmoji(emocoes, 'Emoções');
        break;
      case '4':
        const atividades = ['🎨', '📚', '⚽', '🎵', '🧩', '🍽️'];
        this.selecionarEmoji(atividades, 'Atividades');
        break;
      case '5':
        this.inserirTextoDecorativo();
        break;
    }
  }
  
  selecionarEmoji(emojis: string[], categoria: string) {
    const opcoes = emojis.map((e, i) => `${i + 1}. ${e}`).join('  ');
    const escolha = prompt(`${categoria}:\n${opcoes}\n\nDigite o número:`);
    
    if (escolha && parseInt(escolha) > 0 && parseInt(escolha) <= emojis.length) {
      const emoji = emojis[parseInt(escolha) - 1];
      this.message += ` ${emoji}`;
    }
  }
  
  inserirTextoDecorativo() {
    const opcoes = [
      '1. Separador de seção',
      '2. Caixa de destaque',
      '3. Assinatura da escola',
      '4. Rodapé com contatos'
    ];
    
    const escolha = prompt(`Texto decorativo:\n${opcoes.join('\n')}\n\nDigite o número:`);
    
    switch(escolha) {
      case '1':
        this.message += `\n\n───────────────\n`;
        break;
      case '2':
        const destaque = prompt('Digite o texto para destacar:');
        if (destaque) {
          this.message += `\n\n┌───────────────┐\n│  ✨ ${destaque} ✨  │\n└───────────────┘\n`;
        }
        break;
      case '3':
        this.message += `\n\n🏠 Atenciosamente,\nEquipe Creche PokeCreche\n👶 Cuidando com amor e carinho`;
        break;
      case '4':
        this.message += `\n\n───────────────\n` +
          `📞 (11) 1234-5678 | 📧 contato@pokecreche.com\n` +
          `📍 Rua das Crianças, 123 - São Paulo/SP\n` +
          `🌐 www.pokecreche.com.br`;
        break;
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
      '1. Ver rascunhos salvos',
      '2. Ver comunicados enviados',
      '3. Modelos de mensagem',
      '4. Configurações de envio',
      '5. Estatísticas'
    ];
    
    const escolha = prompt(`Menu de opções:\n${opcoes.join('\n')}\n\nDigite o número:`);
    
    switch(escolha) {
      case '1':
        this.verRascunhos();
        break;
      case '2':
        this.verEnviados();
        break;
      case '3':
        this.usarModelo();
        break;
      case '4':
        this.configurarEnvio();
        break;
      case '5':
        this.mostrarEstatisticas();
        break;
    }
  }
  
  verRascunhos() {
    const rascunhos = JSON.parse(localStorage.getItem('rascunhos') || '[]');
    
    if (rascunhos.length === 0) {
      alert('Nenhum rascunho salvo.');
      return;
    }
    
    const lista = rascunhos.map((r, i) => 
      `${i + 1}. ${r.subject} (${r.savedAt})`
    ).join('\n');
    
    const escolha = prompt(`Rascunhos salvos (${rascunhos.length}):\n${lista}\n\nDigite o número para carregar ou 0 para cancelar:`);
    
    if (escolha && parseInt(escolha) > 0 && parseInt(escolha) <= rascunhos.length) {
      const rascunho = rascunhos[parseInt(escolha) - 1];
      this.carregarRascunho(rascunho);
    }
  }
  
  carregarRascunho(rascunho: any) {
    this.from = rascunho.from;
    this.to = rascunho.to;
    this.cc = rascunho.cc;
    this.bcc = rascunho.bcc;
    this.subject = rascunho.subject === '[Sem assunto]' ? '' : rascunho.subject;
    this.message = rascunho.message;
    this.selectedIcon = rascunho.icon;
    
    alert('Rascunho carregado com sucesso!');
    console.log('Rascunho carregado:', rascunho);
  }
  
  verEnviados() {
    const enviados = JSON.parse(localStorage.getItem('comunicados_enviados') || '[]');
    
    if (enviados.length === 0) {
      alert('Nenhum comunicado enviado ainda.');
      return;
    }
    
    const lista = enviados.slice(0, 5).map((c, i) => 
      `${i + 1}. ${c.subject}\n   Para: ${c.to}\n   Enviado: ${c.sentAt}\n`
    ).join('\n');
    
    alert(`Últimos comunicados enviados:\n\n${lista}${enviados.length > 5 ? '\n... e mais ' + (enviados.length - 5) + ' comunicados' : ''}`);
  }
  
  usarModelo() {
    const modelos = [
      {
        nome: 'Reunião de Pais',
        assunto: 'Reunião de Pais - Turma [TURMA]',
        texto: 'Prezados pais,\n\nConvidamos para a reunião de pais que acontecerá:\n\nData: [DATA]\nHorário: [HORÁRIO]\nLocal: [LOCAL]\n\nContamos com a presença de todos.\n\nAtenciosamente,\nEquipe [CRECHE]',
        icone: '👥'
      },
      {
        nome: 'Festa/Evento',
        assunto: '[EVENTO] - [DATA]',
        texto: 'Queridos pais,\n\nTemos o prazer de convidar para [EVENTO]:\n\nData: [DATA]\nHorário: [HORÁRIO]\nLocal: [LOCAL]\n\nObservações: [OBSERVAÇÕES]\n\nAguardamos vocês!',
        icone: '🎉'
      },
      {
        nome: 'Comunicado Geral',
        assunto: 'Comunicado - [ASSUNTO]',
        texto: 'Prezados pais,\n\n[MENSAGEM]\n\nQualquer dúvida, estamos à disposição.\n\nAtenciosamente,\nEquipe Pedagógica',
        icone: '📢'
      }
    ];
    
    const lista = modelos.map((m, i) => `${i + 1}. ${m.nome}`).join('\n');
    const escolha = prompt(`Modelos disponíveis:\n${lista}\n\nDigite o número:`);
    
    if (escolha && parseInt(escolha) > 0 && parseInt(escolha) <= modelos.length) {
      const modelo = modelos[parseInt(escolha) - 1];
      this.subject = modelo.assunto;
      this.message = modelo.texto;
      this.selectedIcon = modelo.icone;
      alert(`Modelo "${modelo.nome}" carregado!\nLembre-se de substituir os campos entre [COLCHETES].`);
    }
  }
  
  configurarEnvio() {
    const opcoes = [
      '1. Solicitar confirmação de leitura',
      '2. Enviar cópia para coordenação',
      '3. Marcar como confidencial',
      '4. Definir como urgente'
    ];
    
    const escolha = prompt(`Configurações de envio:\n${opcoes.join('\n')}\n\nDigite o número:`);
    
    switch(escolha) {
      case '1':
        alert('✅ Confirmação de leitura ativada\nOs pais receberão solicitação para confirmar a leitura.');
        break;
      case '2':
        this.cc = this.cc ? `${this.cc}, coordenacao@crecheapp.com` : 'coordenacao@crecheapp.com';
        alert('✅ Cópia para coordenação adicionada');
        break;
      case '3':
        alert('🔒 Comunicado marcado como confidencial\nApenas destinatários selecionados receberão.');
        break;
      case '4':
        this.selectedIcon = '🚨';
        alert('🚨 Comunicado marcado como URGENTE\nÍcone alterado automaticamente.');
        break;
    }
  }
  
  mostrarEstatisticas() {
    const enviados = JSON.parse(localStorage.getItem('comunicados_enviados') || '[]');
    const rascunhos = JSON.parse(localStorage.getItem('rascunhos') || '[]');
    
    const hoje = new Date().toDateString();
    const enviadosHoje = enviados.filter(c => 
      new Date(c.sentAt.split(' ')[0].split('/').reverse().join('-')).toDateString() === hoje
    ).length;
    
    const stats = `📊 ESTATÍSTICAS\n\n` +
      `📤 Total enviados: ${enviados.length}\n` +
      `📝 Rascunhos salvos: ${rascunhos.length}\n` +
      `📅 Enviados hoje: ${enviadosHoje}\n\n` +
      `🎯 Destinatário mais usado: ${this.getDestinatarioMaisUsado(enviados)}\n` +
      `📋 Último envio: ${enviados.length > 0 ? enviados[0].sentAt : 'Nenhum'}`;
    
    alert(stats);
  }
  
  getDestinatarioMaisUsado(enviados: any[]): string {
    if (enviados.length === 0) return 'Nenhum';
    
    const contagem = enviados.reduce((acc, c) => {
      acc[c.to] = (acc[c.to] || 0) + 1;
      return acc;
    }, {});
    
    const maisUsado = Object.keys(contagem).reduce((a, b) => 
      contagem[a] > contagem[b] ? a : b
    );
    
    return `${maisUsado} (${contagem[maisUsado]}x)`;
  }

  aplicarNegrito() {
    const opcoes = [
      '1. Adicionar texto em negrito',
      '2. Adicionar texto em itálico', 
      '3. Adicionar texto sublinhado',
      '4. Adicionar cabeçalho'
    ];
    
    const escolha = prompt(`Formatar texto:\n${opcoes.join('\n')}\n\nDigite o número:`);
    
    switch(escolha) {
      case '1':
        const negrito = prompt('Digite o texto para negrito:');
        if (negrito) this.message += ` **${negrito}**`;
        break;
      case '2':
        const italico = prompt('Digite o texto para itálico:');
        if (italico) this.message += ` *${italico}*`;
        break;
      case '3':
        const sublinhado = prompt('Digite o texto para sublinhar:');
        if (sublinhado) this.message += ` __${sublinhado}__`;
        break;
      case '4':
        const cabecalho = prompt('Digite o cabeçalho:');
        if (cabecalho) this.message += `\n\n## ${cabecalho}\n`;
        break;
    }
  }
  
  criarLista() {
    const opcoes = [
      '1. Lista com marcadores (•)',
      '2. Lista numerada (1, 2, 3...)',
      '3. Lista de tarefas (☐)',
      '4. Horário/Cronograma'
    ];
    
    const escolha = prompt(`Tipo de lista:\n${opcoes.join('\n')}\n\nDigite o número:`);
    
    switch(escolha) {
      case '1':
        const itens = prompt('Digite os itens (separados por vírgula):');
        if (itens) {
          const lista = itens.split(',').map(item => `• ${item.trim()}`).join('\n');
          this.message += `\n\n${lista}\n`;
        }
        break;
      case '2':
        const numerados = prompt('Digite os itens (separados por vírgula):');
        if (numerados) {
          const lista = numerados.split(',').map((item, i) => `${i + 1}. ${item.trim()}`).join('\n');
          this.message += `\n\n${lista}\n`;
        }
        break;
      case '3':
        const tarefas = prompt('Digite as tarefas (separadas por vírgula):');
        if (tarefas) {
          const lista = tarefas.split(',').map(item => `☐ ${item.trim()}`).join('\n');
          this.message += `\n\n${lista}\n`;
        }
        break;
      case '4':
        this.criarCronograma();
        break;
    }
  }
  
  criarCronograma() {
    const cronograma = `\n\n🕰️ CRONOGRAMA:\n` +
      `08:00 - Chegada e acolhimento\n` +
      `09:00 - Café da manhã\n` +
      `10:00 - Atividades pedagógicas\n` +
      `11:30 - Almoço\n` +
      `13:00 - Descanso\n` +
      `15:00 - Lanche da tarde\n` +
      `16:00 - Atividades livres\n` +
      `17:00 - Saída\n`;
    
    const usar = confirm('Usar modelo de cronograma padrão?\n\n' + cronograma + '\nClique OK para usar ou Cancelar para criar personalizado.');
    
    if (usar) {
      this.message += cronograma;
    } else {
      const personalizado = prompt('Digite o cronograma personalizado\n(use formato: HH:MM - Atividade, separado por vírgula):');
      if (personalizado) {
        const horarios = personalizado.split(',').map(h => `${h.trim()}`).join('\n');
        this.message += `\n\n🕰️ CRONOGRAMA:\n${horarios}\n`;
      }
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
    if (!this.subject && !this.message) {
      alert('Nada para salvar. Digite pelo menos o assunto ou mensagem.');
      return;
    }
    
    const rascunho = {
      id: Date.now(),
      from: this.from,
      to: this.to,
      cc: this.cc,
      bcc: this.bcc,
      subject: this.subject || '[Sem assunto]',
      message: this.message,
      icon: this.selectedIcon,
      savedAt: new Date().toLocaleString('pt-BR'),
      status: 'rascunho'
    };
    
    // Simular salvamento local
    const rascunhos = JSON.parse(localStorage.getItem('rascunhos') || '[]');
    rascunhos.push(rascunho);
    localStorage.setItem('rascunhos', JSON.stringify(rascunhos));
    
    console.log('Rascunho salvo:', rascunho);
    alert(`Rascunho salvo com sucesso!\nTotal de rascunhos: ${rascunhos.length}`);
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
    // Validações mais detalhadas
    const erros = [];
    if (!this.to) erros.push('- Destinatários');
    if (!this.subject) erros.push('- Assunto');
    if (!this.message) erros.push('- Mensagem');
    
    if (erros.length > 0) {
      alert(`Campos obrigatórios não preenchidos:\n${erros.join('\n')}`);
      return;
    }
    
    // Confirmação antes do envio
    const confirmacao = confirm(
      `Confirmar envio do comunicado?\n\n` +
      `Para: ${this.to}\n` +
      `Assunto: ${this.subject}\n` +
      `Ícone: ${this.selectedIcon}\n\n` +
      `Clique OK para enviar ou Cancelar para revisar.`
    );
    
    if (!confirmacao) return;
    
    const comunicado = {
      id: Date.now(),
      from: this.from,
      to: this.to,
      cc: this.cc,
      bcc: this.bcc,
      subject: this.subject,
      message: this.message,
      icon: this.selectedIcon,
      sentAt: new Date().toLocaleString('pt-BR'),
      status: 'enviado'
    };
    
    // Simular envio (salvar no localStorage)
    const enviados = JSON.parse(localStorage.getItem('comunicados_enviados') || '[]');
    enviados.unshift(comunicado); // Adiciona no início
    localStorage.setItem('comunicados_enviados', JSON.stringify(enviados));
    
    console.log('Comunicado enviado:', comunicado);
    alert(`✅ Comunicado enviado com sucesso!\n\nPara: ${this.to}\nHorário: ${comunicado.sentAt}`);
    
    this.router.navigateByUrl('/menu-docente');
  }
}
