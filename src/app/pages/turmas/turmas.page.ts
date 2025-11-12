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

  turmas = Array.from({ length: 12 }).map((_, i) => ({
    id: (i * 37 + 32).toString().padStart(4, '0'),
    selected: false,
  }));

  selectedTurma: any = null;
  studentsByTurma: Record<string, any[]> = {};

  constructor(private router: Router) {
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
      this.studentsByTurma[t.id] = Array.from({ length: 6 }).map((_, i) => ({
        id: `${t.id}-${i + 1}`,
        name: 'Nome',
        avatar: 'assets/img/avatar.jpg',
        falta: false,
      }));
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
}
