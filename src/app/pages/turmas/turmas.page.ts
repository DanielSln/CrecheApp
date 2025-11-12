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
import { chevronBack } from 'ionicons/icons';
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

  turmas = Array.from({ length: 12 }).map((_, i) => ({
    id: (i * 37 + 32).toString().padStart(4, '0'),
    selected: false,
  }));

  selectedTurma: any = null;
  studentsByTurma: Record<string, any[]> = {};

  private apiUrl = 'http://localhost:3000';

  constructor(private router: Router, private http: HttpClient) {
    addIcons({ chevronBack });
  }

  ngOnInit() {
    this.carregarTurmas();
  }

  carregarTurmas() {
    const turmasSalvas = localStorage.getItem('turmas');
    if (turmasSalvas) {
      this.turmas = JSON.parse(turmasSalvas);
    }
  }

  salvarTurmasNoStorage() {
    localStorage.setItem('turmas', JSON.stringify(this.turmas));
  }

  filteredTurmas() {
    const q = this.query?.trim();
    if (!q) return this.turmas;
    return this.turmas.filter((t) => t.id.includes(q));
  }

  selectTurma(t: any) {
    this.selectedTurma = t;
    if (!this.studentsByTurma[t.id]) {
      this.http.get<any[]>(`${this.apiUrl}/alunos`).subscribe({
        next: (alunos) => {
          this.studentsByTurma[t.id] = alunos.map((aluno) => ({
            id: aluno.id,
            name: aluno.nome,
            matricula: aluno.matricula,
            avatar: 'assets/img/avatar.jpg',
            falta: false,
          }));
        },
        error: () => {
          this.studentsByTurma[t.id] = [];
        }
      });
    }
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
    this.showAlunoModal = true;
  }

  fecharAlunoModal() {
    this.showAlunoModal = false;
    this.alunoSelecionado = null;
  }

  salvarRegistroAluno() {
    if (this.alunoSelecionado) {
      const aluno = this.studentsByTurma[this.selectedTurma.id].find(
        (s) => s.id === this.alunoSelecionado.id
      );
      if (aluno) {
        aluno.alimentacao = this.alunoSelecionado.alimentacao;
        aluno.comportamento = this.alunoSelecionado.comportamento;
        aluno.presenca = this.alunoSelecionado.presenca;
      }
    }
    this.fecharAlunoModal();
  }

  editarNomeTurma() {
    this.novoNomeTurma = this.selectedTurma.id;
    this.showEditModal = true;
  }

  fecharModal() {
    this.showEditModal = false;
    this.novoNomeTurma = '';
  }

  salvarNomeTurma() {
    if (this.novoNomeTurma && this.novoNomeTurma.trim()) {
      const oldId = this.selectedTurma.id;
      const newId = this.novoNomeTurma.trim();

      if (this.studentsByTurma[oldId]) {
        this.studentsByTurma[newId] = this.studentsByTurma[oldId];
        delete this.studentsByTurma[oldId];
      }

      this.selectedTurma.id = newId;
      this.salvarTurmasNoStorage();
    }
    this.fecharModal();
  }

  abrirModalExcluir() {
    this.showDeleteModal = true;
  }

  fecharModalExcluir() {
    this.showDeleteModal = false;
  }

  confirmarExcluirTurma() {
    this.turmas = this.turmas.filter(t => t.id !== this.selectedTurma.id);
    delete this.studentsByTurma[this.selectedTurma.id];
    this.salvarTurmasNoStorage();
    this.fecharModalExcluir();
    this.backToList();
  }

  removerAluno(aluno: any) {
    if (confirm(`Remover ${aluno.name} da turma?`)) {
      this.studentsByTurma[this.selectedTurma.id] = this.studentsByTurma[this.selectedTurma.id].filter(s => s.id !== aluno.id);
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

  adicionarAluno(aluno: any) {
    if (!this.studentsByTurma[this.selectedTurma.id]) {
      this.studentsByTurma[this.selectedTurma.id] = [];
    }
    this.studentsByTurma[this.selectedTurma.id].push({
      id: aluno.id,
      name: aluno.nome,
      matricula: aluno.matricula,
      avatar: 'assets/img/avatar.jpg',
      falta: false,
    });
    this.fecharAddAlunoModal();
  }
}
