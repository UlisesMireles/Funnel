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
import { LoginUser } from '../../interfaces/LoginUser';

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
  datosUsuario: LoginUser = {} as LoginUser;
  samePassword: boolean = false;
  longitudPass: boolean = false;
  patternPass: boolean = true;
  confirmarPass: boolean = false;
  regexPassword: RegExp = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_])[A-Za-z\\d\\W_]{1,16}$');

  constructor(private messageService: MessageService, private authService:AuthenticationService) {}
  ngOnInit(): void {
    this.usuario = Globals.usuario = localStorage.getItem('username') as string;
    this.nombre = Globals.usuario = localStorage.getItem('nombre') as string;
    this.correo = Globals.usuario = localStorage.getItem('correo') as string;
    this.password = '';
    this.confirmarPassword = '';
    this.datosUsuario = this.authService.desencriptaSesion();
  }
  cambiarPassword(): void {
    this.dataModal = { usuario: this.usuario, pass: this.password };
    this.modalVisible = true;
  }

  validacionesPass(): any{
    if (this.password.length > 16) {
      this.longitudPass = true;
      return;
    } else {
      this.longitudPass = false
    }
    this.samePassword = this.password == this.datosUsuario.pass ? true: false;  
    this.patternPass = this.password.length > 0 ? this.regexPassword.test(this.password): true;     
  }

  validacionesConfirmPass(){
    this.confirmarPass = this.password != this.confirmarPassword ? true: false;
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
