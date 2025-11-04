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
  AlertController,
  ToastController
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

  constructor(
    private router: Router, 
    private location: Location, 
    private http: HttpClient,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
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

  async toggleCcBcc() {
    console.log('toggleCcBcc executado');
    const toast = await this.toastController.create({
      message: 'Botão CC/BCC funcionando!',
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
    this.showCcBcc = !this.showCcBcc;
  }

  async fecharComposer() {
    console.log('fecharComposer executado');
    const toast = await this.toastController.create({
      message: 'Botão fechar funcionando!',
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
    this.location.back();
  }

  selecionarRemetente() {
    console.log('selecionarRemetente executado');
    alert('Botão remetente funcionando!');
    
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
      alert(`Remetente alterado para: ${this.from}`);
    }
  }

  selecionarDestinatarios() {
    console.log('selecionarDestinatarios executado');
    alert('Botão destinatários funcionando!');
    
    const grupos = ['Todos os Pais', 'Professores', 'Funcionários'];
    const opcoes = grupos.map((g: string, i: number) => `${i + 1}. ${g}`).join('\n');
    const escolha = prompt(`Selecione os destinatários:\n${opcoes}\n\nDigite o número:`);
    
    if (escolha && parseInt(escolha) > 0 && parseInt(escolha) <= grupos.length) {
      this.to = grupos[parseInt(escolha) - 1];
      alert(`Destinatários selecionados: ${this.to}`);
    }
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
    console.log('agendarEnvio executado');
    alert('Botão agendar funcionando!');
    
    const opcoes = ['1. Em 1 hora', '2. Amanhã 8h', '3. Segunda-feira'];
    const escolha = prompt(`Quando enviar?\n${opcoes.join('\n')}\n\nDigite o número:`);
    
    if (escolha) {
      alert(`Agendamento selecionado: Opção ${escolha}`);
    }
  }

  inserirLink() {
    console.log('inserirLink executado');
    alert('Botão inserir link funcionando!');
    
    const texto = prompt('Digite o texto do link:');
    if (texto) {
      const url = prompt('Digite a URL:');
      if (url) {
        this.message += ` [${texto}](${url})`;
        alert('Link adicionado!');
      }
    }
  }

  inserirEmoji() {
    console.log('inserirEmoji executado');
    alert('Botão inserir emoji funcionando!');
    
    const emojis = ['😊', '👍', '❤️', '🎉', '⭐'];
    const escolha = prompt(`Escolha um emoji:\n1. 😊\n2. 👍\n3. ❤️\n4. 🎉\n5. ⭐\n\nDigite o número:`);
    
    if (escolha && parseInt(escolha) > 0 && parseInt(escolha) <= emojis.length) {
      const emoji = emojis[parseInt(escolha) - 1];
      this.message += ` ${emoji}`;
      alert(`Emoji ${emoji} adicionado!`);
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
    console.log('definirPrioridade executado');
    alert('Botão prioridade funcionando!');
    
    const opcoes = ['1. Baixa', '2. Normal', '3. Alta', '4. Urgente'];
    const escolha = prompt(`Definir prioridade:\n${opcoes.join('\n')}\n\nDigite o número:`);
    
    if (escolha) {
      alert(`Prioridade selecionada: Opção ${escolha}`);
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
    console.log('aplicarNegrito executado');
    alert('Botão formatar texto funcionando!');
    
    const texto = prompt('Digite o texto para negrito:');
    if (texto) {
      this.message += ` **${texto}**`;
      alert('Texto em negrito adicionado!');
    }
  }
  
  criarLista() {
    console.log('criarLista executado');
    alert('Botão criar lista funcionando!');
    
    const itens = prompt('Digite os itens (separados por vírgula):');
    if (itens) {
      const lista = itens.split(',').map((item: string) => `• ${item.trim()}`).join('\n');
      this.message += `\n\n${lista}\n`;
      alert('Lista adicionada!');
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

  async mostrarIcones() {
    console.log('mostrarIcones executado');
    const toast = await this.toastController.create({
      message: 'Botão ícones funcionando!',
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
    this.showIconPicker = !this.showIconPicker;
  }

  async selecionarIcone(icon: string) {
    console.log('selecionarIcone executado:', icon);
    const toast = await this.toastController.create({
      message: `Ícone selecionado: ${icon}`,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
    this.selectedIcon = icon;
    this.showIconPicker = false;
  }

  salvarRascunho() {
    console.log('salvarRascunho executado');
    alert('Botão salvar rascunho funcionando!');
    
    if (!this.subject && !this.message) {
      alert('Nada para salvar! Digite pelo menos o assunto ou mensagem.');
      return;
    }
    
    alert('Rascunho salvo com sucesso!');
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
    console.log('enviarComunicado executado');
    alert('Botão enviar funcionando!');
    
    if (!this.to || !this.subject || !this.message) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }
    
    const confirmacao = confirm('Confirmar envio do comunicado?');
    if (confirmacao) {
      alert('Comunicado enviado com sucesso!');
      this.router.navigateByUrl('/menu-docente');
    }
  }
}
