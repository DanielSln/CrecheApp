import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonIcon,
  IonTitle,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { chevronBack, searchOutline, addCircleOutline, createOutline, trashOutline, closeOutline, schoolOutline } from 'ionicons/icons';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-turmas',
  templateUrl: './turmas.page.html',
  styleUrls: ['./turmas.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonMenuButton,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
  ],
})
export class TurmasPage implements OnInit {
  query: string = '';
  showEditModal: boolean = false;
  novoNomeTurma: string = '';
  fotoTurma: File | null = null;
  turmaImage: string = 'assets/img/avatar.jpg';
  showAlunoModal: boolean = false;
  alunoSelecionado: any = null;
  showAddAlunoModal: boolean = false;
  alunosDisponiveis: any[] = [];
  showDeleteModal: boolean = false;
  searchAluno: string = '';
  showAddTurmaModal: boolean = false;
  novaTurmaNome: string = '';
  novaTurmaAno: string = '';
  isDocente: boolean = false;

  turmas: any[] = [];

  selectedTurma: any = null;
  studentsByTurma: Record<string, any[]> = {};

  private apiUrl = 'https://back-end-pokecreche-production.up.railway.app';

  constructor(private router: Router, private http: HttpClient, private cdr: ChangeDetectorRef) {
    addIcons({ 
      chevronBack, 
      searchOutline, 
      addCircleOutline, 
      createOutline, 
      trashOutline, 
      closeOutline,
      schoolOutline
    });
  }

  ngOnInit() {
    this.isDocente = localStorage.getItem('userType') === 'docente';
    this.carregarTurmas();
    this.setupMobileOptimizations();
    this.preloadImages();
  }
  
  private preloadImages() {
    const defaultAvatar = new Image();
    defaultAvatar.src = 'assets/img/avatar.jpg';
  }
  
  private setupMobileOptimizations() {
    // Detecta se é dispositivo móvel
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // Adiciona classe para otimizações móveis
      document.body.classList.add('mobile-device');
      
      // Otimiza scroll em modais
      document.addEventListener('touchmove', (e) => {
        if (this.showAlunoModal || this.showEditModal || this.showDeleteModal || 
            this.showAddAlunoModal || this.showAddTurmaModal || this.showRemoveModal) {
          e.preventDefault();
        }
      }, { passive: false });
    }
  }

  carregarTurmas() {
    this.http.get<any[]>(`${this.apiUrl}/turmas`).subscribe({
      next: (turmas) => {
        this.turmas = turmas;
        this._filteredTurmas = turmas;
      },
      error: (err) => {
        console.error('Erro ao carregar turmas:', err);
        this.turmas = [];
        this._filteredTurmas = [];
      }
    });
  }



  private _filteredTurmas: any[] = [];
  private _lastQuery = '';
  
  filteredTurmas() {
    const q = this.query?.trim().toLowerCase() || '';
    if (q === this._lastQuery) return this._filteredTurmas;
    
    this._lastQuery = q;
    if (!q) {
      this._filteredTurmas = this.turmas;
    } else {
      this._filteredTurmas = this.turmas.filter((t) => 
        t.nome.toLowerCase().includes(q) || 
        t.ano.toString().includes(q)
      );
    }
    return this._filteredTurmas;
  }

  selectTurma(t: any) {
    this.selectedTurma = t;
    
    this.http.get<any[]>(`${this.apiUrl}/turmas/${t.id}/alunos`).subscribe({
      next: (alunos) => {
        this.studentsByTurma[t.id] = alunos.map((aluno) => ({
          id: aluno.id,
          name: aluno.nome,
          matricula: aluno.matricula,
          avatar: aluno.avatar || 'assets/img/avatar.jpg',
          falta: false,
          contador: '0 / 5'
        }));
        
        // Carrega contadores de forma assíncrona
        this.studentsByTurma[t.id].forEach((aluno, index) => {
          setTimeout(() => this.carregarContadorAluno(aluno), index * 25);
        });
      },
      error: () => {
        this.studentsByTurma[t.id] = [];
        console.error('Erro ao carregar alunos da turma');
      }
    });
  }

  carregarContadorAluno(aluno: any) {
    this.http.get<any[]>(`${this.apiUrl}/registros/${aluno.id}`).subscribe({
      next: (registros) => {
        const registrosOrdenados = registros.sort((a, b) => 
          new Date(b.data).getTime() - new Date(a.data).getTime()
        );
        
        // Pega os últimos 5 registros (semana atual)
        const ultimosRegistros = registrosOrdenados.slice(0, 5);
        const totalRegistros = registrosOrdenados.length;
        const registroAtual = Math.min(totalRegistros, 5);
        
        aluno.contador = `${registroAtual} / 5`;
        this.cdr.detectChanges();
      },
      error: () => {
        aluno.contador = '0 / 5';
      }
    });
  }

  backToList() {
    this.selectedTurma = null;
  }

  toggleFalta(student: any, ev?: Event) {
    ev?.stopPropagation();
    student.falta = !student.falta;
  }

  abrirRegistroAluno(student: any) {
    this.alunoSelecionado = { 
      ...student, 
      alimentacao: '', 
      comportamento: '', 
      presenca: '' 
    };
    this.carregarContadorRegistros(student.id);
    this.showAlunoModal = true;
    document.body.classList.add('modal-open');
    
    setTimeout(() => {
      const firstInput = document.querySelector('.modal-content select') as HTMLElement;
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }

  carregarContadorRegistros(alunoId: number) {
    this.http.get<any[]>(`${this.apiUrl}/registros/${alunoId}`).subscribe({
      next: (registros) => {
        const registrosOrdenados = registros.sort((a, b) => 
          new Date(b.data).getTime() - new Date(a.data).getTime()
        );
        const totalRegistros = registrosOrdenados.length;
        const registroAtual = (totalRegistros % 5) || 5;
        this.alunoSelecionado.contador = `${registroAtual} / 5`;
      },
      error: () => {
        this.alunoSelecionado.contador = '0 / 5';
      }
    });
  }

  fecharAlunoModal() {
    this.showAlunoModal = false;
    this.alunoSelecionado = null;
    
    // Remove classe de otimização móvel
    document.body.classList.remove('modal-open');
  }

  salvarRegistroAluno() {
    if (this.alunoSelecionado && this.alunoSelecionado.alimentacao && this.alunoSelecionado.comportamento && this.alunoSelecionado.presenca) {
      const hoje = new Date().toISOString().split('T')[0];
      const registro = {
        aluno_id: this.alunoSelecionado.id,
        turma_id: this.selectedTurma.id,
        data: hoje,
        alimentacao: this.alunoSelecionado.alimentacao,
        comportamento: this.alunoSelecionado.comportamento,
        presenca: this.alunoSelecionado.presenca,
        observacoes: ''
      };

      this.http.post(`${this.apiUrl}/registros`, registro).subscribe({
        next: (response) => {
          const alunoId = this.alunoSelecionado.id;
          this.fecharAlunoModal();
          setTimeout(() => {
            if (this.selectedTurma && this.studentsByTurma[this.selectedTurma.id]) {
              const alunoNaLista = this.studentsByTurma[this.selectedTurma.id].find(a => a.id === alunoId);
              if (alunoNaLista) {
                this.carregarContadorAluno(alunoNaLista);
              }
            }
          }, 500);
        },
        error: (err) => {
          console.error('Erro ao salvar registro:', err);
          alert('Erro ao salvar registro');
        }
      });
    } else {
      this.fecharAlunoModal();
    }
  }

  editarNomeTurma() {
    this.novoNomeTurma = this.selectedTurma.nome;
    this.fotoTurma = null;
    this.turmaImage = this.selectedTurma.foto || 'assets/img/avatar.jpg';
    this.showEditModal = true;
    document.body.classList.add('modal-open');
  }

  fecharModal() {
    this.showEditModal = false;
    this.novoNomeTurma = '';
    this.fotoTurma = null;
    this.turmaImage = 'assets/img/avatar.jpg';
    document.body.classList.remove('modal-open');
  }

  selectTurmaImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.fotoTurma = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.turmaImage = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  salvarNomeTurma() {
    if (this.novoNomeTurma && this.novoNomeTurma.trim()) {
      const novoNome = this.novoNomeTurma.trim();
      
      if (this.fotoTurma) {
        // Se há foto, converte para base64 e envia
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          const payload = { 
            nome: novoNome, 
            ano: this.selectedTurma.ano || new Date().getFullYear().toString(),
            foto: base64
          };
          this.atualizarTurma(payload);
        };
        reader.readAsDataURL(this.fotoTurma);
      } else {
        // Sem nova foto, mantém a existente
        const payload = { 
          nome: novoNome, 
          ano: this.selectedTurma.ano || new Date().getFullYear().toString(),
          foto: this.selectedTurma.foto
        };
        this.atualizarTurma(payload);
      }
    } else {
      this.fecharModal();
    }
  }

  private atualizarTurma(payload: any) {
    this.http.put(`${this.apiUrl}/turmas/${this.selectedTurma.id}`, payload).subscribe({
      next: (response) => {
        this.selectedTurma.nome = payload.nome;
        if (payload.foto) this.selectedTurma.foto = payload.foto;
        const turma = this.turmas.find(t => t.id === this.selectedTurma.id);
        if (turma) {
          turma.nome = payload.nome;
          if (payload.foto) turma.foto = payload.foto;
        }
        alert('Turma atualizada com sucesso!');
        this.fecharModal();
        // Força recarregamento das turmas para garantir que a foto apareça
        this.carregarTurmas();
      },
      error: (err) => {
        console.error('Erro:', err);
        alert('Erro ao atualizar turma: ' + (err.error?.message || err.message));
      }
    });
  }

  abrirModalExcluir() {
    this.showDeleteModal = true;
    document.body.classList.add('modal-open');
  }

  fecharModalExcluir() {
    this.showDeleteModal = false;
    document.body.classList.remove('modal-open');
  }

  confirmarExcluirTurma() {
    this.http.delete(`${this.apiUrl}/turmas/${this.selectedTurma.id}`).subscribe({
      next: () => {
        this.turmas = this.turmas.filter(t => t.id !== this.selectedTurma.id);
        delete this.studentsByTurma[this.selectedTurma.id];
        this.fecharModalExcluir();
        this.backToList();
      },
      error: (err) => {
        console.error('Erro ao excluir turma:', err);
        alert('Erro ao excluir turma');
      }
    });
  }

  showRemoveModal: boolean = false;
  alunoParaRemover: any = null;

  abrirModalRemover(aluno: any) {
    this.alunoParaRemover = aluno;
    this.showRemoveModal = true;
    document.body.classList.add('modal-open');
  }

  fecharModalRemover() {
    this.showRemoveModal = false;
    this.alunoParaRemover = null;
    document.body.classList.remove('modal-open');
  }

  confirmarRemoverAluno() {
    if (this.alunoParaRemover) {
      this.http.delete(`${this.apiUrl}/turmas/${this.selectedTurma.id}/alunos/${this.alunoParaRemover.id}`).subscribe({
        next: () => {
          this.studentsByTurma[this.selectedTurma.id] = this.studentsByTurma[this.selectedTurma.id].filter(s => s.id !== this.alunoParaRemover.id);
          this.fecharModalRemover();
        },
        error: (err) => {
          console.error('Erro ao remover aluno:', err);
          alert('Erro ao remover aluno da turma');
        }
      });
    }
  }

  abrirAdicionarAluno() {
    this.http.get<any[]>(`${this.apiUrl}/alunos`).subscribe({
      next: (alunos) => {
        const alunosNaTurma = this.studentsByTurma[this.selectedTurma.id] || [];
        
        // Filtra apenas alunos que não estão na turma atual
        this.alunosDisponiveis = alunos.filter(a => {
          return !alunosNaTurma.find(s => s.id === a.id);
        });
        
        this.showAddAlunoModal = true;
        document.body.classList.add('modal-open');
      },
      error: (err) => {
        console.error('Erro ao buscar alunos:', err);
        this.alunosDisponiveis = [];
        this.showAddAlunoModal = true;
        document.body.classList.add('modal-open');
      }
    });
  }

  fecharAddAlunoModal() {
    this.showAddAlunoModal = false;
    this.alunosDisponiveis = [];
    this.searchAluno = '';
    document.body.classList.remove('modal-open');
  }

  private _filteredAlunos: any[] = [];
  private _lastAlunoQuery = '';
  
  filteredAlunosDisponiveis() {
    const q = this.searchAluno?.trim().toLowerCase() || '';
    if (q === this._lastAlunoQuery) return this._filteredAlunos;
    
    this._lastAlunoQuery = q;
    if (!q) {
      this._filteredAlunos = this.alunosDisponiveis;
    } else {
      this._filteredAlunos = this.alunosDisponiveis.filter(a => 
        a.nome.toLowerCase().includes(q) || 
        a.matricula.toLowerCase().includes(q)
      );
    }
    return this._filteredAlunos;
  }

  abrirAdicionarTurma() {
    this.showAddTurmaModal = true;
    document.body.classList.add('modal-open');
  }

  fecharAddTurmaModal() {
    this.showAddTurmaModal = false;
    this.novaTurmaNome = '';
    this.novaTurmaAno = '';
    document.body.classList.remove('modal-open');
  }

  salvarNovaTurma() {
    if (this.novaTurmaNome.trim() && this.novaTurmaAno.trim()) {
      this.http.post(`${this.apiUrl}/turmas`, { nome: this.novaTurmaNome.trim(), ano: this.novaTurmaAno.trim() }).subscribe({
        next: (turma: any) => {
          this.turmas.push(turma);
          this.fecharAddTurmaModal();
        },
        error: (err) => {
          console.error('Erro ao criar turma:', err);
          alert('Erro ao criar turma');
        }
      });
    }
  }

  getAlunosOrdenados(turmaId: string) {
    const alunos = this.studentsByTurma[turmaId] || [];
    return alunos.sort((a, b) => {
      const statusA = parseInt(a.contador?.split(' / ')[0] || '0');
      const statusB = parseInt(b.contador?.split(' / ')[0] || '0');
      return statusA - statusB;
    });
  }

  adicionarAluno(aluno: any) {
    // Valida os dados antes de enviar
    if (!this.selectedTurma || !this.selectedTurma.id) {
      alert('Turma não selecionada');
      return;
    }

    if (!aluno || !aluno.id) {
      alert('Aluno inválido');
      return;
    }

    // Tenta primeiro com formato aluno_id
    let payload: any = { aluno_id: aluno.id };
    
    console.log('Adicionando aluno à turma');
    console.log('Aluno:', aluno);
    console.log('Turma ID:', this.selectedTurma.id);
    console.log('Payload:', payload);
    
    this.http.post(`${this.apiUrl}/turmas/${this.selectedTurma.id}/alunos`, payload).subscribe({
      next: () => {
        if (!this.studentsByTurma[this.selectedTurma.id]) {
          this.studentsByTurma[this.selectedTurma.id] = [];
        }
        this.studentsByTurma[this.selectedTurma.id].push({
          id: aluno.id,
          name: aluno.nome,
          matricula: aluno.matricula,
          avatar: aluno.avatar || 'assets/img/avatar.jpg',
          falta: false,
        });
        // Remove o aluno da lista de disponíveis
        this.alunosDisponiveis = this.alunosDisponiveis.filter(a => a.id !== aluno.id);
        this.fecharAddAlunoModal();
        alert('✅ Aluno adicionado/transferido com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao adicionar aluno:', err);
        console.error('Status:', err.status);
        console.error('Response:', err.error);
        
        // Se o erro for "Aluno já está em outra turma", tenta remover e adicionar novamente
        if (err.status === 400 && err.error?.message?.includes('já está em outra turma')) {
          console.log('Tentando transferir aluno...');
          // Primeiro remove o aluno de qualquer turma
          this.http.put(`${this.apiUrl}/alunos/${aluno.id}/turma`, { turma_id: null }).subscribe({
            next: () => {
              // Depois tenta adicionar novamente
              this.http.post(`${this.apiUrl}/turmas/${this.selectedTurma.id}/alunos`, { aluno_id: aluno.id }).subscribe({
                next: () => {
                  if (!this.studentsByTurma[this.selectedTurma.id]) {
                    this.studentsByTurma[this.selectedTurma.id] = [];
                  }
                  this.studentsByTurma[this.selectedTurma.id].push({
                    id: aluno.id,
                    name: aluno.nome,
                    matricula: aluno.matricula,
                    avatar: aluno.avatar || 'assets/img/avatar.jpg',
                    falta: false,
                  });
                  this.alunosDisponiveis = this.alunosDisponiveis.filter(a => a.id !== aluno.id);
                  this.fecharAddAlunoModal();
                  alert('✅ Aluno transferido com sucesso!');
                },
                error: () => {
                  alert('❌ Erro ao transferir aluno');
                }
              });
            },
            error: () => {
              alert('❌ Erro ao remover aluno da turma anterior');
            }
          });
        } else if (err.status === 500) {
          alert('❌ Erro no servidor ao adicionar aluno. Tente novamente mais tarde.');
        } else {
          const mensagem = err.error?.message || 'Erro ao adicionar aluno à turma';
          alert(`❌ Erro: ${mensagem}`);
        }
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
}
