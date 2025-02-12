import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  showErrors: boolean = false;
  errorLogin: SafeHtml = '';
  resetForm: FormGroup = new FormGroup({});

  constructor(private fb:FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthenticationService,
    private sanitizer: DomSanitizer) {
    
  }

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      usuario: ['', [Validators.required]]
    });
  }

  resetPassword(): void {
    if (this.resetForm.invalid) {
      this.showErrors = true;
      this.errorLogin = "Por favor ingrese su Usuario";
      return;
    }
    this.showErrors = false;
    const user = this.resetForm.get('usuario')?.value;
    this.authService.recuperarContrasena(user).subscribe({
      next: (data: any) => {
        this.showErrors = true;
        this.errorLogin = this.sanitizer.bypassSecurityTrustHtml(data.errorMessage);

      },
      error: (err: Error) => {
        this.showErrors = true;
        this.errorLogin = "Ocurrio un error, intentalo más tarde.";
        console.log(err);
      }

    });
  }

  regresar(): void {
    this.router.navigate(['/']);
  }

  get usuario(){ return this.resetForm.get('usuario'); }
}
