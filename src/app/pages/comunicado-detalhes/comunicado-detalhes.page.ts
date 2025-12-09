import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  AlertController,
  ToastController,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-comunicado-detalhes',
  templateUrl: './comunicado-detalhes.page.html',
  styleUrls: ['./comunicado-detalhes.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    CommonModule,
  ],
})
export class ComunicadoDetalhesPage implements OnInit {
  comunicado: any;

  comunicados: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({ 'trash-outline': trashOutline });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID recebido:', id);
    
    // Buscar primeiro nos comunicados enviados (localStorage)
    const comunicadosEnviados = JSON.parse(localStorage.getItem('comunicados_enviados') || '[]');
    console.log('Comunicados do localStorage:', comunicadosEnviados);
    
    // Usar apenas comunicados do localStorage
    const todosComunicados = comunicadosEnviados;
    console.log('Todos os comunicados:', todosComunicados);
    
    // Buscar por ID (convertendo para string para comparação)
    this.comunicado = todosComunicados.find((c: any) => 
      String(c.id) === String(id)
    );
    
    console.log('Comunicado encontrado:', this.comunicado);
    
    if (!this.comunicado) {
      console.error('Comunicado não encontrado para ID:', id);
      console.log('IDs disponíveis:', todosComunicados.map((c: any) => c.id));
    }
  }

  getBadgeText(type: string): string {
    switch (type) {
      case 'urgent': return 'URGENTE';
      case 'info': return 'INFO';
      default: return 'AVISO';
    }
  }

  getFormattedContent(): string {
    return this.comunicado?.content.replace(/\n/g, '<br>') || '';
  }

  getBackUrl(): string {
    // Verifica o tipo de usuário para determinar a página de volta
    const userType = localStorage.getItem('userType');
    return userType === 'docente' ? '/comunicados-docente' : '/comunicados';
  }

  isDocente(): boolean {
    return localStorage.getItem('userType') === 'docente';
  }

  async excluirComunicado() {
    const alert = await this.alertController.create({
      header: 'Excluir Comunicado',
      message: 'Tem certeza que deseja excluir este comunicado? Esta ação não pode ser desfeita.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: async () => {
            await this.confirmarExclusao();
          }
        }
      ]
    });
    await alert.present();
  }

  async confirmarExclusao() {
    try {
      // Remover dos comunicados enviados (localStorage)
      const comunicadosEnviados = JSON.parse(localStorage.getItem('comunicados_enviados') || '[]');
      const comunicadosAtualizados = comunicadosEnviados.filter((c: any) => 
        String(c.id) !== String(this.comunicado.id)
      );
      localStorage.setItem('comunicados_enviados', JSON.stringify(comunicadosAtualizados));

      const toast = await this.toastController.create({
        message: 'Comunicado excluído com sucesso!',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();

      // Voltar para a página anterior
      const userType = localStorage.getItem('userType');
      const backUrl = userType === 'docente' ? '/comunicados-docente' : '/comunicados';
      this.router.navigateByUrl(backUrl);
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Erro ao excluir comunicado!',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    }
  }
}
