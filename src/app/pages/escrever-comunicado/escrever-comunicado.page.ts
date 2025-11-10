import { Component, OnInit, OnDestroy } from '@angular/core';
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
  ToastController,
  ModalController
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
import { HttpClient } from '@angular/common/http';

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
  providers: [HttpClient]
})
export class EscreverComunicadoPage implements OnInit, OnDestroy {
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
    private toastController: ToastController,
    private modalController: ModalController
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

  private beforeUnloadHandler = () => {
    this.saveCurrentDraftToTemp();
  }

  ngOnInit(): void {
    // Carregar rascunho selecionado de sessionStorage se houver
    try {
      const rascunhoCarregado = sessionStorage.getItem('rascunhoCarregado');
      if (rascunhoCarregado) {
        const rascunho = JSON.parse(rascunhoCarregado);
        if (rascunho && rascunho.to) {
          this.carregarRascunho(rascunho);
          sessionStorage.removeItem('rascunhoCarregado');
        }
      }
    } catch (err) {
      console.error('Erro ao carregar rascunho de sessionStorage:', err);
      sessionStorage.removeItem('rascunhoCarregado');
    }
    
    this.loadCurrentDraftIfAny();
    window.addEventListener('beforeunload', this.beforeUnloadHandler);
  }

  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', this.beforeUnloadHandler);
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
        value: r.email,
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
            if (data) {
              this.from = data;
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
      inputs: grupos.map((g) => ({
        name: 'destinatario',
        type: 'radio',
        label: g,
        value: g,
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
            if (data) {
              this.to = data;
            }
          }
        }
      ]
    });

    await alert.present();
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
        value: opcao
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: async (data: any) => {
            if (data) {
              const toast = await this.toastController.create({
                message: `Agendado: ${data}`,
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
        value: p.icone
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: async (data: any) => {
            if (data) {
              this.selectedIcon = data;
              const prioridadeSelecionada = prioridades.find(p => p.icone === data);
              const toast = await this.toastController.create({
                message: `Prioridade: ${prioridadeSelecionada?.nivel}`,
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
      inputs: emojis.map((emoji) => ({
        name: 'emoji',
        type: 'radio',
        label: emoji,
        value: emoji
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Adicionar',
          handler: async (data: any) => {
            if (data) {
              this.message += ` ${data}`;
              const toast = await this.toastController.create({
                message: `Emoji ${data} adicionado!`,
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

  mostrarIcones() {
    this.showIconPicker = !this.showIconPicker;
  }

  selecionarIcone(icon: string) {
    this.selectedIcon = icon;
    this.showIconPicker = false;
  }

  async salvarRascunho() {
    if (!this.subject && !this.message && !this.to) {
      const toast = await this.toastController.create({
        message: 'Nada para salvar! Digite pelo menos destinatário, assunto ou mensagem.',
        duration: 3000,
        position: 'bottom',
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const agora = new Date();
    const savedAt = this.formatDateTime(agora);
    const rascunho = {
      id: Date.now(),
      from: this.from,
      to: this.to,
      cc: this.cc,
      bcc: this.bcc,
      subject: this.subject && this.subject.trim() !== '' ? this.subject : '[Sem assunto]',
      message: this.message,
      icon: this.selectedIcon,
      savedAt
    };

    try {
      const rascunhos = JSON.parse(localStorage.getItem('rascunhos') || '[]');
      rascunhos.unshift(rascunho);
      localStorage.setItem('rascunhos', JSON.stringify(rascunhos));

      const toast = await this.toastController.create({
        message: 'Rascunho salvo com sucesso!',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();
      
      try { localStorage.removeItem('current_draft'); } catch(e) { /* ignore */ }
    } catch (err) {
      console.error('Erro ao salvar rascunho:', err);
      const toast = await this.toastController.create({
        message: 'Erro ao salvar rascunho.',
        duration: 3000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    }
  }

  private formatDateTime(d: Date) {
    const dd = d.getDate().toString().padStart(2, '0');
    const mm = (d.getMonth() + 1).toString().padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = d.getHours().toString().padStart(2, '0');
    const min = d.getMinutes().toString().padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  }

  private saveCurrentDraftToTemp() {
    try {
      const temp = {
        from: this.from,
        to: this.to,
        cc: this.cc,
        bcc: this.bcc,
        subject: this.subject,
        message: this.message,
        icon: this.selectedIcon,
        savedAt: this.formatDateTime(new Date())
      };
      localStorage.setItem('current_draft', JSON.stringify(temp));
    } catch (err) {
      console.error('Erro ao salvar rascunho temporário', err);
    }
  }

  private loadCurrentDraftIfAny() {
    try {
      const raw = localStorage.getItem('current_draft');
      if (!raw) return;
      const temp = JSON.parse(raw);
      const carregar = confirm(`Há um rascunho não salvo (salvo em ${temp.savedAt}). Deseja carregar?`);
      if (!carregar) return;
      this.from = temp.from || this.from;
      this.to = temp.to || this.to;
      this.cc = temp.cc || this.cc;
      this.bcc = temp.bcc || this.bcc;
      this.subject = temp.subject || this.subject;
      this.message = temp.message || this.message;
      this.selectedIcon = temp.icon || this.selectedIcon;
    } catch (err) {
      console.error('Erro ao carregar rascunho temporário', err);
    }
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
            try { localStorage.removeItem('current_draft'); } catch(e) { /* ignore */ }
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
              to: this.to,
              public: true
            };
            
            console.log('Novo comunicado criado:', novoComunicado);
            
            const comunicadosExistentes = JSON.parse(localStorage.getItem('comunicados_enviados') || '[]');
            comunicadosExistentes.unshift(novoComunicado);
            localStorage.setItem('comunicados_enviados', JSON.stringify(comunicadosExistentes));
            
            console.log('Comunicados salvos no localStorage:', comunicadosExistentes);
            
            const toast = await this.toastController.create({
              message: 'Comunicado enviado com sucesso!',
              duration: 2000,
              position: 'bottom',
              color: 'success'
            });
            await toast.present();
            
            try { localStorage.removeItem('current_draft'); } catch(e) { /* ignore */ }
            
            setTimeout(() => {
              this.router.navigateByUrl('/comunicados-docente');
            }, 500);
          }
        }
      ]
    });
    
    await alert.present();
  }

  // Métodos adicionais para funcionalidades do template
  async mostrarOpcoes() {
    const alert = await this.alertController.create({
      header: 'Opções',
      buttons: [
        {
          text: 'Ver Rascunhos',
          handler: () => {
            this.verRascunhos();
          }
        },
        {
          text: 'Ver Comunicados Enviados',
          handler: () => {
            this.verEnviados();
          }
        },
        {
          text: 'Usar Modelo',
          handler: () => {
            this.usarModelo();
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    
    await alert.present();
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
  }

  verEnviados() {
    const enviados = JSON.parse(localStorage.getItem('comunicados_enviados') || '[]');
    
    if (enviados.length === 0) {
      alert('Nenhum comunicado enviado ainda.');
      return;
    }
    
    const lista = enviados.slice(0, 5).map((c: any, i: number) => 
      `${i + 1}. ${c.title}\n   Para: ${c.to}\n   Enviado: ${c.date}\n`
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
}