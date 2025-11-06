import { Component } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonInput,
  IonTextarea,
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
    IonIcon,
    IonInput,
    IonTextarea,
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

  toggleCcBcc() {
    this.showCcBcc = !this.showCcBcc;
  }

  fecharComposer() {
    this.location.back();
  }

  async selecionarRemetente() {
    
    const remetentes = [
      { email: 'docente@crecheapp.com', nome: 'Professor(a)' },
      { email: 'coordenacao@crecheapp.com', nome: 'Coordenação' },
      { email: 'direcao@crecheapp.com', nome: 'Direção' }
    ];
    
    const alert = await this.alertController.create({
      header: 'Selecionar Remetente',
      inputs: remetentes.map((r, i) => ({
        name: 'remetente',
        type: 'radio',
        label: `${r.nome} (${r.email})`,
        value: i,
        checked: this.from === r.email
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: (data: any) => {
            if (data !== undefined) {
              this.from = remetentes[data].email;
            }
          }
        }
      ]
    });
    
    await alert.present();
  }

  async selecionarDestinatarios() {
    
    const grupos = ['Todos os Pais', 'Professores', 'Funcionários'];
    
    const alert = await this.alertController.create({
      header: 'Selecionar Destinatários',
      inputs: grupos.map((g, i) => ({
        name: 'destinatario',
        type: 'radio',
        label: g,
        value: i,
        checked: this.to === g
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: (data: any) => {
            if (data !== undefined) {
              this.to = grupos[data];
            }
          }
        }
      ]
    });
    
    await alert.present();
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

  async agendarEnvio() {
    
    const opcoes = ['Em 1 hora', 'Amanhã às 8h', 'Segunda-feira'];
    
    const alert = await this.alertController.create({
      header: 'Agendar Envio',
      message: 'Quando enviar o comunicado?',
      inputs: opcoes.map((opcao, i) => ({
        name: 'agendamento',
        type: 'radio',
        label: opcao,
        value: i
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: async (data: any) => {
            if (data !== undefined) {
              const toast = await this.toastController.create({
                message: `Agendado: ${opcoes[data]}`,
                duration: 2000,
                position: 'bottom'
              });
              await toast.present();
            }
          }
        }
      ]
    });
    
    await alert.present();
  }

  async inserirLink() {
    
    const alert = await this.alertController.create({
      header: 'Inserir Link',
      inputs: [
        {
          name: 'texto',
          type: 'text',
          placeholder: 'Texto do link'
        },
        {
          name: 'url',
          type: 'url',
          placeholder: 'URL (https://...)'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Adicionar',
          handler: async (data: any) => {
            if (data.texto && data.url) {
              this.message += ` [${data.texto}](${data.url})`;
              const toast = await this.toastController.create({
                message: 'Link adicionado!',
                duration: 2000,
                position: 'bottom'
              });
              await toast.present();
            }
          }
        }
      ]
    });
    
    await alert.present();
  }

  async inserirEmoji() {
    
    const emojis = ['😊', '👍', '❤️', '🎉', '⭐', '🎄', '🎂', '🎨'];
    
    const alert = await this.alertController.create({
      header: 'Inserir Emoji',
      inputs: emojis.map((emoji, i) => ({
        name: 'emoji',
        type: 'radio',
        label: emoji,
        value: i
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Adicionar',
          handler: async (data: any) => {
            if (data !== undefined) {
              const emoji = emojis[data];
              this.message += ` ${emoji}`;
              const toast = await this.toastController.create({
                message: `Emoji ${emoji} adicionado!`,
                duration: 2000,
                position: 'bottom'
              });
              await toast.present();
            }
          }
        }
      ]
    });
    
    await alert.present();
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

  async definirPrioridade() {
    
    const prioridades = [
      { nivel: 'Baixa', icone: '📝' },
      { nivel: 'Normal', icone: '📢' },
      { nivel: 'Alta', icone: '⚠️' },
      { nivel: 'Urgente', icone: '🚨' }
    ];
    
    const alert = await this.alertController.create({
      header: 'Definir Prioridade',
      inputs: prioridades.map((p, i) => ({
        name: 'prioridade',
        type: 'radio',
        label: `${p.icone} ${p.nivel}`,
        value: i
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: async (data: any) => {
            if (data !== undefined) {
              this.selectedIcon = prioridades[data].icone;
              const toast = await this.toastController.create({
                message: `Prioridade: ${prioridades[data].nivel}`,
                duration: 2000,
                position: 'bottom'
              });
              await toast.present();
            }
          }
        }
      ]
    });
    
    await alert.present();
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

  async aplicarNegrito() {
    
    const alert = await this.alertController.create({
      header: 'Formatar Texto',
      inputs: [
        {
          name: 'texto',
          type: 'text',
          placeholder: 'Digite o texto para negrito'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Adicionar',
          handler: async (data: any) => {
            if (data.texto) {
              this.message += ` **${data.texto}**`;
              const toast = await this.toastController.create({
                message: 'Texto em negrito adicionado!',
                duration: 2000,
                position: 'bottom'
              });
              await toast.present();
            }
          }
        }
      ]
    });
    
    await alert.present();
  }
  
  async criarLista() {
    
    const alert = await this.alertController.create({
      header: 'Criar Lista',
      inputs: [
        {
          name: 'itens',
          type: 'textarea',
          placeholder: 'Digite os itens (separados por vírgula)'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Adicionar',
          handler: async (data: any) => {
            if (data.itens) {
              const lista = data.itens.split(',').map((item: string) => `• ${item.trim()}`).join('\n');
              this.message += `\n\n${lista}\n`;
              const toast = await this.toastController.create({
                message: 'Lista adicionada!',
                duration: 2000,
                position: 'bottom'
              });
              await toast.present();
            }
          }
        }
      ]
    });
    
    await alert.present();
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
  }

  async salvarRascunho() {
    
    if (!this.subject && !this.message) {
      const toast = await this.toastController.create({
        message: 'Nada para salvar! Digite pelo menos o assunto ou mensagem.',
        duration: 3000,
        position: 'bottom',
        color: 'warning'
      });
      await toast.present();
      return;
    }
    
    const toast = await this.toastController.create({
      message: 'Rascunho salvo com sucesso!',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }

  async descartarComunicado() {
    const temConteudo = this.to || this.subject || this.message;
    
    if (!temConteudo) {
      const toast = await this.toastController.create({
        message: 'Não há conteúdo para descartar.',
        duration: 2000,
        position: 'bottom',
        color: 'warning'
      });
      await toast.present();
      return;
    }
    
    const alert = await this.alertController.create({
      header: 'Descartar Comunicado',
      message: 'Tem certeza que deseja descartar este comunicado? Todo o conteúdo será perdido.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Descartar',
          role: 'destructive',
          handler: async () => {
            this.to = '';
            this.subject = '';
            this.message = '';
            this.selectedIcon = '📝';
            this.showIconPicker = false;
            
            const toast = await this.toastController.create({
              message: 'Comunicado descartado com sucesso!',
              duration: 2000,
              position: 'bottom',
              color: 'success'
            });
            await toast.present();
          }
        }
      ]
    });
    
    await alert.present();
  }

  async enviarComunicado() {
    
    if (!this.to || !this.subject || !this.message) {
      const toast = await this.toastController.create({
        message: 'Preencha todos os campos obrigatórios!',
        duration: 3000,
        position: 'bottom',
        color: 'warning'
      });
      await toast.present();
      return;
    }
    
    const alert = await this.alertController.create({
      header: 'Confirmar Envio',
      message: `Enviar comunicado para: ${this.to}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Enviar',
          handler: async () => {
            // Criar o novo comunicado
            const agora = new Date();
            const dataFormatada = `${agora.getDate().toString().padStart(2, '0')}/${(agora.getMonth() + 1).toString().padStart(2, '0')}`;
            
            const novoComunicado = {
              id: Date.now(),
              title: this.subject,
              preview: this.message.length > 50 ? this.message.substring(0, 50) + '...' : this.message,
              content: this.message,
              date: dataFormatada,
              type: this.selectedIcon === '🚨' ? 'urgent' : this.selectedIcon === '⚠️' ? 'info' : 'default',
              emoji: this.selectedIcon,
              from: this.from,
              to: this.to
            };
            
            console.log('Novo comunicado criado:', novoComunicado);
            
            // Salvar no localStorage
            const comunicadosExistentes = JSON.parse(localStorage.getItem('comunicados_enviados') || '[]');
            comunicadosExistentes.unshift(novoComunicado); // Adiciona no início
            localStorage.setItem('comunicados_enviados', JSON.stringify(comunicadosExistentes));
            
            console.log('Comunicados salvos no localStorage:', comunicadosExistentes);
            
            const toast = await this.toastController.create({
              message: 'Comunicado enviado com sucesso!',
              duration: 2000,
              position: 'bottom',
              color: 'success'
            });
            await toast.present();
            
            // Navegar para comunicados-docente para ver o resultado
            setTimeout(() => {
              this.router.navigateByUrl('/comunicados-docente');
            }, 500);
          }
        }
      ]
    });
    
    await alert.present();
  }
}
