import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { environment } from '../../../enviroment/enviroment';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({});
  showErrors: boolean = false;
  errorLogin: string = '';
  baseUrl: string = environment.baseURLAssets;
  public backgroundImg: SafeStyle | undefined;
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private sanitizer: DomSanitizer, private router: Router, private authService: AuthenticationService) {


  }

  ngOnInit(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.backgroundImg = 'background-image: url(' + this.baseUrl + '/assets/img/PMA_GRISES.png' + ')';
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required]],
      password: ['', [Validators.required]],
      sesion: [false]
    });
  }

  iniciarSesion():void{
    localStorage.clear();
    sessionStorage.clear();
    if (this.loginForm.invalid) {
      this.showErrors = true;
      this.errorLogin = "Por favor ingrese su usuario y contraseña"
      return;
    }
    this.showErrors = false;
    this.authService.login(this.loginForm.get('usuario')?.value, this.loginForm.get('password')?.value).subscribe({
      next: (data: any) => {
        if (data.result && data.idUsuario > 0) {
          this.router.navigate(['/two-factor']);
        } else {
          this.showErrors = true;
          this.errorLogin = "Usuario y/o Contraseña no validos."
        }
      },
      error: (err: Error) => {
        this.showErrors = true;
        this.errorLogin = "Ocurrio un error, intentalo más tarde."
      }
    });

  }

  get usuario(){ return this.loginForm.get('usuario'); }
  get password(){ return this.loginForm.get('password'); }
  get sesion(){ return this.loginForm.get('sesion'); }
}
