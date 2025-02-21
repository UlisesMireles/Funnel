import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { baseOut } from '../../interfaces/utils/baseOut';
import { Globals } from '../../services/globals';
import { UsuarioData } from '../../interfaces/cambiar-contraseña';
import { TwoFactor } from '../../interfaces/cambiar-contraseña';
import { ActivatedRoute, Router } from '@angular/router';
import { CambiarContrasenaService } from '../../services/cambiar-contrasenia.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-cambiar-contrasena',
  standalone: false,
  templateUrl: './cambiar-contrasena.component.html',
  styleUrl: './cambiar-contrasena.component.css',
})
export class CambiarContrasenaComponent {
  dataModal: UsuarioData = {} as UsuarioData;
  modalVisible: boolean = false;
  nombre: string = '';
  usuario: string = '';
  correo: string = '';
  password: string = '';
  confirmarPassword: string = '';

  constructor(private messageService: MessageService) {}
  ngOnInit(): void {
    this.usuario = Globals.usuario = localStorage.getItem('username') as string;
    this.nombre = Globals.usuario = localStorage.getItem('nombre') as string;
    this.correo = Globals.usuario = localStorage.getItem('correo') as string;
    this.password = '';
  }
  cambiarPassword(): void {
    if (!this.validarPassword()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Las contraseñas no coinciden',
      });
      return;
    }

    if (this.password.length < 8) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La contraseña debe tener al menos 8 caracteres.',
      });
      return;
    }
    this.dataModal = { usuario: this.usuario, pass: this.password };
    this.modalVisible = true;
  }
  onModalClose() {
    this.modalVisible = false;    
  }

  resultadoModal(result: any) {
    if (result.res) {
      this.password = '';
      this.confirmarPassword = '';
    }
  }
  validarPassword(): boolean {
    const password = this.password?.trim();
    const confirmarPassword = this.confirmarPassword?.trim();
    
    return Boolean(password && confirmarPassword && password === confirmarPassword);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
  }
}

@Component({
  selector: 'twoFactorDialog',
  standalone: false,
  templateUrl: './twoFactorDialog.html',
  styleUrl: './cambiar-contrasena.component.css',
})
export class TwoFactorDialog {
  @Input() visible: boolean = false;
  @Input() data: UsuarioData = { usuario: '', pass: '' };

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() result: EventEmitter<baseOut> = new EventEmitter();

  disabled: boolean = true;
  timeLeft: number = 120;
  interval: any;

  usuario: string = '';
  codigo: number | null = null;
  constructor(
    private router: Router,
    private cambiarContrasenaService: CambiarContrasenaService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService
  ) {}
  onDialogShow() {
    this.usuario = Globals.usuario = localStorage.getItem('username') as string;
    this.codigo = null;
    this.disabled = true;
    this.enviarCorreoTwoFactor();
  }
  close() {
    this.visible = false;
    this.codigo = null;
    clearInterval(this.interval);
    this.visibleChange.emit(this.visible);
    this.closeModal.emit();
  }

  startTimer() {
    this.timeLeft = 120;
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  }
  onCodigoChange(value: number): void {
    if (value && value.toString().length === 6) {
      this.disabled = false;
    } else {
      this.disabled = true;
    }
  }
  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  enviarCorreoTwoFactor() {
    this.cambiarContrasenaService
      .postCambiarPassTwoFactor(this.usuario)
      .subscribe({
        next: (data) => {
          this.startTimer();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'Se ha producido un error en la generación del código: ' +
              error.errorMessage,
          });
        },
      });
  }
  EnviarCodigo() {
    let TwoFactor: TwoFactor = { codigo: this.codigo, usuario: this.usuario };
    this.authenticationService.TwoFactor(TwoFactor).subscribe({
      next: (data) => {
        if (data.tipoMensaje == 1) {
          this.cambiarPassword();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: data.errorMessage,
          });
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Se ha producido un error en la validación del código: ' +
            error.errorMessage,
        });
      },
    });
  }
  cambiarPassword() {
    this.cambiarContrasenaService.postCambiarPass(this.data).subscribe({
      next: (data) => {
        const result: any = {res: true}
        this.result.emit(result);
        this.close();
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'La contraseña se ha cambiado con éxito.',
        });
      },
      error: (error) => {
        const result: any = {res: false}
        this.result.emit(result);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Se ha producido un error en el cambio de la contraseña: ' +
            error.errorMessage,
        });
      },
    });
  }
}
