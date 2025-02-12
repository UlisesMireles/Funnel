import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  isUserPanelVisible = false;
  rutaImgen: string = '../assets/img/persona_icono_principal.png';
  nombreUsuario: string = '';
  rol: string = '';
  tipoUsuario: string = '';
  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    if (this.authService.currentUser) {
      this.nombreUsuario = localStorage.getItem('username')!;
      this.rol = localStorage.getItem('tipoUsuario')!;
      if(this.rol == "Tenant")
        {
            this.tipoUsuario = "Usuario Master";
        }
        else
        {
            this.tipoUsuario = this.rol;
        }
    }
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleUserPanel(event: Event): void {
    event.stopPropagation();
    this.isUserPanelVisible = !this.isUserPanelVisible;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    this.isUserPanelVisible = false;
  }
}
