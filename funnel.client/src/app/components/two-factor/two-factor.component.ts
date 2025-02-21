import { Component } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Globals } from '../../services/globals';
import { TwoFactor } from '../../interfaces/cambiar-contraseña';
import { environment } from '../../../enviroment/enviroment';
import { CambiarContrasenaService } from '../../services/cambiar-contrasenia.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { LoginUser } from '../../interfaces/LoginUser';

@Component({
  selector: 'app-two-factor',
  standalone: false,
  templateUrl: './two-factor.component.html',
  styleUrl: './two-factor.component.css',
})
export class TwoFactorComponent {
  public backgroundImg: SafeStyle | undefined;
  baseUrl: string = environment.baseURLAssets;
  twoFactorForm: FormGroup = new FormGroup({});
  usuario: string = '';
  showErrors: boolean = false;
  errorLogin: string = '';
  codigo: number | null = null;
  disabled: boolean = true;
  timeLeft: number = 120;
  interval: any;
  datosUsuario: LoginUser = {} as LoginUser;
  constructor(
    private router: Router,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private authService: AuthenticationService,
  ) {}
  ngOnInit(): void {
    this.backgroundImg =
      'background-image: url(' +
      this.baseUrl +
      '/assets/img/PMA_GRISES.png' +
      ')';
    this.usuario = Globals.usuario = localStorage.getItem('username') as string;
    this.codigo = null;
    this.disabled = true;
    this.datosUsuario = this.authService.desencriptaSesion();
    this.startTimer();
  }
  onCodigoChange(value: number): void {
    if (value && value.toString().length === 6) {
      this.disabled = false;
    }else{
      this.disabled = true;
    }
  }
  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  enviarCorreoTwoFactor() {
    this.authService.reenviarTwoFactor(this.datosUsuario.usuario, this.datosUsuario.pass).subscribe({
      next: () => {
        this.startTimer();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Se ha producido un error en la generación del código: ' +
            err.errorMessage,
        });
      }
    });
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
  EnviarCodigo() {
    let TwoFactor: TwoFactor = { codigo: this.codigo, usuario: this.usuario };
    this.authenticationService.TwoFactor(TwoFactor).subscribe({
      next: (data) => {
        if (data.tipoMensaje == 1) {
          this.router.navigate(['/empresas']);
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
}
