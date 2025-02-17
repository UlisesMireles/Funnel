import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

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

  constructor(private fb:FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthenticationService) {

  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required]],
      password: ['', [Validators.required]],
      sesion: [false]
    });
  }

  iniciarSesion():void{
    localStorage.clear();
    if (this.loginForm.invalid) {
      this.showErrors = true;
      this.errorLogin = "Por favor ingrese su usuario y contraseña"
      return;
    }
    this.showErrors = false;
    this.authService.login(this.loginForm.get('usuario')?.value, this.loginForm.get('password')?.value).subscribe({
      next: (data: any) => {
        if (data.result && data.idUsuario > 0) {
          this.router.navigate(['/empresas']);
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
