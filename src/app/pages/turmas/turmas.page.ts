import { Component, OnInit } from '@angular/core';
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

  constructor(private router: Router, private http: HttpClient) {
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
  }

  carregarTurmas() {
    this.http.get<any[]>(`${this.apiUrl}/turmas`).subscribe({
      next: (turmas) => {
        this.turmas = turmas;
      },
      error: (err) => {
        console.error('Erro ao carregar turmas:', err);
        this.turmas = [];
      }
    });
  }



  filteredTurmas() {
    const q = this.query?.trim();
    if (!q) return this.turmas;
    return this.turmas.filter((t) => t.nome.includes(q));
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
        this.studentsByTurma[t.id].forEach(aluno => this.carregarContadorAluno(aluno));
      },
      error: () => {
        this.studentsByTurma[t.id] = [];
      }
    });
  }

  carregarContadorAluno(aluno: any) {
    this.http.get<any[]>(`${this.apiUrl}/registros/${aluno.id}`).subscribe({
      next: (registros) => {
        const registrosOrdenados = registros.sort((a, b) => 
          new Date(b.data).getTime() - new Date(a.data).getTime()
        );
        const totalRegistros = registrosOrdenados.length;
        const registroAtual = (totalRegistros % 5) || (totalRegistros > 0 ? 5 : 0);
        aluno.contador = `${registroAtual} / 5`;
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
    this.alunoSelecionado = { ...student };
    this.carregarContadorRegistros(student.id);
    this.showAlunoModal = true;
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
        next: () => {
          alert('Registro salvo com sucesso!');
          this.fecharAlunoModal();
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
    this.showEditModal = true;
  }

  fecharModal() {
    this.showEditModal = false;
    this.novoNomeTurma = '';
  }

  salvarNomeTurma() {
    if (this.novoNomeTurma && this.novoNomeTurma.trim()) {
      const novoNome = this.novoNomeTurma.trim();
      const payload = { 
        nome: novoNome, 
        ano: this.selectedTurma.ano || new Date().getFullYear().toString() 
      };
      
      console.log('Atualizando turma:', this.selectedTurma.id, payload);
      
      this.http.put(`${this.apiUrl}/turmas/${this.selectedTurma.id}`, payload).subscribe({
        next: (response) => {
          console.log('Resposta do servidor:', response);
          this.selectedTurma.nome = novoNome;
          const turma = this.turmas.find(t => t.id === this.selectedTurma.id);
          if (turma) turma.nome = novoNome;
          alert('Nome da turma atualizado com sucesso!');
          this.fecharModal();
        },
        error: (err) => {
          console.error('Erro completo:', err);
          alert('Erro ao atualizar nome da turma: ' + (err.error?.message || err.message));
        }
      });
    } else {
      this.fecharModal();
    }
  }

  abrirModalExcluir() {
    this.showDeleteModal = true;
  }

  fecharModalExcluir() {
    this.showDeleteModal = false;
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
  }

  fecharModalRemover() {
    this.showRemoveModal = false;
    this.alunoParaRemover = null;
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
    console.log('Buscando alunos...');
    this.http.get<any[]>(`${this.apiUrl}/alunos`).subscribe({
      next: (alunos) => {
        console.log('Alunos recebidos:', alunos);
        const alunosNaTurma = this.studentsByTurma[this.selectedTurma.id] || [];
        this.alunosDisponiveis = alunos.filter(a => !alunosNaTurma.find(s => s.id === a.id));
        console.log('Alunos disponíveis:', this.alunosDisponiveis);
        this.showAddAlunoModal = true;
      },
      error: (err) => {
        console.error('Erro ao buscar alunos:', err);
        this.alunosDisponiveis = [];
        this.showAddAlunoModal = true;
      }
    });
  }

  fecharAddAlunoModal() {
    this.showAddAlunoModal = false;
    this.alunosDisponiveis = [];
    this.searchAluno = '';
  }

  filteredAlunosDisponiveis() {
    const q = this.searchAluno?.trim().toLowerCase();
    if (!q) return this.alunosDisponiveis;
    return this.alunosDisponiveis.filter(a => 
      a.nome.toLowerCase().includes(q) || 
      a.matricula.toLowerCase().includes(q)
    );
  }

  abrirAdicionarTurma() {
    this.showAddTurmaModal = true;
  }

  fecharAddTurmaModal() {
    this.showAddTurmaModal = false;
    this.novaTurmaNome = '';
    this.novaTurmaAno = '';
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

  adicionarAluno(aluno: any) {
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
        this.fecharAddAlunoModal();
      },
      error: (err) => {
        console.error('Erro ao adicionar aluno:', err);
        alert('Erro ao adicionar aluno à turma');
      }
    });
  }
}
