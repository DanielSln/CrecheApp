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
import { HttpClient, provideHttpClient } from '@angular/common/http';

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

  constructor(private router: Router, private location: Location, private http: HttpClient) {
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
    
    const opcoes = remetentes.map((r: any) => `${r.nome} (${r.email})`).join('\n');
    const escolha = prompt(`Selecione o remetente:\n${opcoes}\n\nDigite 1, 2 ou 3:`);
    
    if (escolha && ['1', '2', '3'].includes(escolha)) {
      this.from = remetentes[parseInt(escolha) - 1].email;
      console.log('Remetente selecionado:', this.from);
    }
  }

  selecionarDestinatarios() {
    // Buscar pais do banco de dados
    this.http.get<any[]>('https://api-cadastro-six.vercel.app/pais').subscribe({
      next: (pais) => {
        const opcoes = [
          '1. Todos os Pais',
          '2. Professores',
          '3. Funcionários',
          '4. Selecionar pais específicos'
        ];
        
        const escolha = prompt(`Selecione os destinatários:\n${opcoes.join('\n')}\n\nDigite o número:`);
        
        switch(escolha) {
          case '1':
            this.to = `Todos os Pais (${pais.length} cadastrados)`;
            break;
          case '2':
            this.to = 'Professores';
            break;
          case '3':
            this.to = 'Funcionários';
            break;
          case '4':
            this.selecionarPaisEspecificos(pais);
            break;
        }
        
        console.log('Destinatários selecionados:', this.to);
      },
      error: (error) => {
        console.error('Erro ao buscar pais:', error);
        alert('Erro ao conectar com o banco de dados. Usando opções padrão.');
        // Fallback para opções estáticas
        const grupos = ['Todos os Pais', 'Professores', 'Funcionários'];
        const opcoes = grupos.map((g: string, i: number) => `${i + 1}. ${g}`).join('\n');
        const escolha = prompt(`Selecione os destinatários:\n${opcoes}\n\nDigite o número:`);
        
        if (escolha && parseInt(escolha) > 0 && parseInt(escolha) <= grupos.length) {
          this.to = grupos[parseInt(escolha) - 1];
        }
      }
    });
  }
  
  selecionarPaisEspecificos(pais: any[]) {
    if (pais.length === 0) {
      alert('Nenhum pai/responsável encontrado no banco de dados.');
      return;
    }
    
    const lista = pais.map((pai: any, i: number) => 
      `${i + 1}. ${pai.nome} (Email: ${pai.email || 'Não informado'})`
    ).join('\n');
    
    const escolha = prompt(`Pais cadastrados (${pais.length}):\n${lista}\n\nDigite os números separados por vírgula ou 0 para todos:`);
    
    if (escolha === '0') {
      this.to = `Todos os pais cadastrados (${pais.length} pais)`;
    } else if (escolha) {
      const indices = escolha.split(',').map((n: string) => parseInt(n.trim()) - 1);
      const paisSelecionados = indices
        .filter((i: number) => i >= 0 && i < pais.length)
        .map((i: number) => pais[i].nome);
      
      if (paisSelecionados.length > 0) {
        this.to = `Pais selecionados: ${paisSelecionados.join(', ')}`;
      }
    }
  }

  agendarEnvio() {
    const opcoes = [
      '1. Enviar em 1 hora',
      '2. Enviar amanhã às 8h',
      '3. Enviar na segunda-feira',
      '4. Definir data/hora personalizada'
    ];
    
    const escolha = prompt(`Quando enviar o comunicado?\n${opcoes.join('\n')}\n\nDigite o número:`);
    
    const agora = new Date();
    let dataAgendada: Date;
    
    switch(escolha) {
      case '1':
        dataAgendada = new Date(agora.getTime() + 60 * 60 * 1000);
        break;
      case '2':
        dataAgendada = new Date(agora);
        dataAgendada.setDate(dataAgendada.getDate() + 1);
        dataAgendada.setHours(8, 0, 0, 0);
        break;
      case '3':
        dataAgendada = new Date(agora);
        const diasAteSegunda = (8 - dataAgendada.getDay()) % 7 || 7;
        dataAgendada.setDate(dataAgendada.getDate() + diasAteSegunda);
        dataAgendada.setHours(8, 0, 0, 0);
        break;
      case '4':
        const dataPersonalizada = prompt('Digite a data e hora (formato: DD/MM/AAAA HH:MM):');
        if (dataPersonalizada) {
          try {
            const [data, hora] = dataPersonalizada.split(' ');
            const [dia, mes, ano] = data.split('/');
            const [h, m] = hora.split(':');
            dataAgendada = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia), parseInt(h), parseInt(m));
          } catch {
            alert('Formato inválido. Use: DD/MM/AAAA HH:MM');
            return;
          }
        } else {
          return;
        }
        break;
      default:
        return;
    }
    
    if (dataAgendada && dataAgendada > agora) {
      console.log('Comunicado agendado para:', dataAgendada);
      alert(`⏰ Comunicado agendado para:\n${dataAgendada.toLocaleString('pt-BR')}`);
    } else {
      alert('Data inválida. Escolha uma data futura.');
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
      { nivel: 'baixa', cor: '🟢', desc: 'Informação geral', icone: '📝' },
      { nivel: 'normal', cor: '🟡', desc: 'Comunicado padrão', icone: '📢' },
      { nivel: 'alta', cor: '🟠', desc: 'Importante', icone: '⚠️' },
      { nivel: 'urgente', cor: '🔴', desc: 'Urgente - Ação necessária', icone: '🚨' }
    ];
    
    const opcoes = prioridades.map((p: any, i: number) => `${i + 1}. ${p.cor} ${p.nivel.toUpperCase()} - ${p.desc}`).join('\n');
    const escolha = prompt(`Definir prioridade do comunicado:\n${opcoes}\n\nDigite o número:`);
    
    if (escolha && parseInt(escolha) > 0 && parseInt(escolha) <= prioridades.length) {
      const prioridade = prioridades[parseInt(escolha) - 1];
      
      // Alterar ícone automaticamente baseado na prioridade
      this.selectedIcon = prioridade.icone;
      
      console.log('Prioridade definida:', prioridade);
      alert(`${prioridade.cor} Prioridade definida: ${prioridade.nivel.toUpperCase()}\nÍcone alterado para: ${prioridade.icone}`);
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
    
    const lista = rascunhos.map((r: any, i: number) => 
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
    
    const lista = enviados.slice(0, 5).map((c: any, i: number) => 
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
    const enviadosHoje = enviados.filter((c: any) => 
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
    
    const contagem = enviados.reduce((acc: any, c: any) => {
      acc[c.to] = (acc[c.to] || 0) + 1;
      return acc;
    }, {} as any);
    
    const maisUsado = Object.keys(contagem).reduce((a: string, b: string) => 
      contagem[a] > contagem[b] ? a : b
    );
    
    return `${maisUsado} (${contagem[maisUsado]}x)`;
  }

  aplicarNegrito() {
    const opcoes = [
      '1. Texto em negrito',
      '2. Texto em itálico', 
      '3. Texto sublinhado',
      '4. Cabeçalho',
      '5. Texto destacado'
    ];
    
    const escolha = prompt(`Formatar texto:\n${opcoes.join('\n')}\n\nDigite o número:`);
    
    switch(escolha) {
      case '1':
        const negrito = prompt('Digite o texto para negrito:');
        if (negrito) {
          this.message += ` **${negrito}**`;
          console.log('Negrito adicionado:', negrito);
        }
        break;
      case '2':
        const italico = prompt('Digite o texto para itálico:');
        if (italico) {
          this.message += ` *${italico}*`;
          console.log('Itálico adicionado:', italico);
        }
        break;
      case '3':
        const sublinhado = prompt('Digite o texto para sublinhar:');
        if (sublinhado) {
          this.message += ` __${sublinhado}__`;
          console.log('Sublinhado adicionado:', sublinhado);
        }
        break;
      case '4':
        const cabecalho = prompt('Digite o cabeçalho:');
        if (cabecalho) {
          this.message += `\n\n## ${cabecalho}\n`;
          console.log('Cabeçalho adicionado:', cabecalho);
        }
        break;
      case '5':
        const destaque = prompt('Digite o texto para destacar:');
        if (destaque) {
          this.message += `\n\n✨ ${destaque} ✨\n`;
          console.log('Destaque adicionado:', destaque);
        }
        break;
    }
  }
  
  criarLista() {
    const opcoes = [
      '1. Lista com marcadores (•)',
      '2. Lista numerada (1, 2, 3...)',
      '3. Lista de tarefas (☐)',
      '4. Cronograma escolar',
      '5. Lista de materiais'
    ];
    
    const escolha = prompt(`Tipo de lista:\n${opcoes.join('\n')}\n\nDigite o número:`);
    
    switch(escolha) {
      case '1':
        const itens = prompt('Digite os itens (separados por vírgula):\nExemplo: Item 1, Item 2, Item 3');
        if (itens) {
          const lista = itens.split(',').map((item: string) => `• ${item.trim()}`).join('\n');
          this.message += `\n\n${lista}\n`;
          console.log('Lista com marcadores criada');
        }
        break;
      case '2':
        const numerados = prompt('Digite os itens (separados por vírgula):\nExemplo: Primeiro item, Segundo item, Terceiro item');
        if (numerados) {
          const lista = numerados.split(',').map((item: string, i: number) => `${i + 1}. ${item.trim()}`).join('\n');
          this.message += `\n\n${lista}\n`;
          console.log('Lista numerada criada');
        }
        break;
      case '3':
        const tarefas = prompt('Digite as tarefas (separadas por vírgula):\nExemplo: Trazer autorização, Confirmar presença, Enviar documento');
        if (tarefas) {
          const lista = tarefas.split(',').map((item: string) => `☐ ${item.trim()}`).join('\n');
          this.message += `\n\n**TAREFAS:**\n${lista}\n`;
          console.log('Lista de tarefas criada');
        }
        break;
      case '4':
        this.criarCronograma();
        break;
      case '5':
        this.criarListaMateriais();
        break;
    }
  }
  
  criarCronograma() {
    const modelos = [
      '1. Cronograma diário padrão',
      '2. Cronograma de evento',
      '3. Cronograma personalizado'
    ];
    
    const escolha = prompt(`Tipo de cronograma:\n${modelos.join('\n')}\n\nDigite o número:`);
    
    switch(escolha) {
      case '1':
        const cronogramaDiario = `\n\n🕰️ **CRONOGRAMA DIÁRIO:**\n` +
          `07:30 - Chegada e acolhimento\n` +
          `08:30 - Café da manhã\n` +
          `09:30 - Atividades pedagógicas\n` +
          `11:00 - Recreio\n` +
          `11:30 - Almoço\n` +
          `13:00 - Descanso\n` +
          `15:00 - Lanche da tarde\n` +
          `15:30 - Atividades livres\n` +
          `17:00 - Saída\n`;
        this.message += cronogramaDiario;
        break;
      case '2':
        const cronogramaEvento = `\n\n🎉 **CRONOGRAMA DO EVENTO:**\n` +
          `14:00 - Chegada dos convidados\n` +
          `14:30 - Apresentação das crianças\n` +
          `15:00 - Lanche coletivo\n` +
          `15:30 - Atividades recreativas\n` +
          `16:30 - Entrega de lembranças\n` +
          `17:00 - Encerramento\n`;
        this.message += cronogramaEvento;
        break;
      case '3':
        const personalizado = prompt('Digite o cronograma personalizado:\n(Formato: HH:MM - Atividade, separado por vírgula)\n\nExemplo: 08:00 - Início, 10:00 - Intervalo, 12:00 - Almoço');
        if (personalizado) {
          const horarios = personalizado.split(',').map((h: string) => h.trim()).join('\n');
          this.message += `\n\n🕰️ **CRONOGRAMA:**\n${horarios}\n`;
        }
        break;
    }
    console.log('Cronograma adicionado');
  }
  
  criarListaMateriais() {
    const tiposMaterial = [
      '1. Material escolar básico',
      '2. Material para atividade específica',
      '3. Lista personalizada'
    ];
    
    const escolha = prompt(`Tipo de lista de materiais:\n${tiposMaterial.join('\n')}\n\nDigite o número:`);
    
    switch(escolha) {
      case '1':
        const materiaisBasicos = `\n\n🎨 **LISTA DE MATERIAIS:**\n` +
          `• Lápis de cor (12 cores)\n` +
          `• Giz de cera\n` +
          `• Cola bastão\n` +
          `• Tesoura sem ponta\n` +
          `• Papel sulfite\n` +
          `• Caderno de desenho\n`;
        this.message += materiaisBasicos;
        break;
      case '2':
        const atividade = prompt('Digite o nome da atividade:');
        if (atividade) {
          this.message += `\n\n🎨 **MATERIAIS PARA: ${atividade.toUpperCase()}**\n` +
            `• [Material 1]\n` +
            `• [Material 2]\n` +
            `• [Material 3]\n\n` +
            `*Substitua os itens entre colchetes pelos materiais necessários*\n`;
        }
        break;
      case '3':
        const materiais = prompt('Digite os materiais (separados por vírgula):\nExemplo: Papel, Cola, Tinta, Pincel');
        if (materiais) {
          const lista = materiais.split(',').map((item: string) => `• ${item.trim()}`).join('\n');
          this.message += `\n\n🎨 **LISTA DE MATERIAIS:**\n${lista}\n`;
        }
        break;
    }
    console.log('Lista de materiais adicionada');
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
    const temConteudo = this.to || this.subject || this.message || this.cc || this.bcc;
    
    if (!temConteudo) {
      alert('Não há conteúdo para descartar.');
      return;
    }
    
    const confirmar = confirm(
      'Tem certeza que deseja descartar este comunicado?\n\n' +
      'Todo o conteúdo será perdido e não poderá ser recuperado.'
    );
    
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
      alert('🗑️ Comunicado descartado com sucesso!');
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
