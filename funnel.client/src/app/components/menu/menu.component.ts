import { Component, HostListener, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { environment } from '../../../enviroment/enviroment';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  isUserPanelVisible = false;
  baseUrl: string = environment.baseURLAssets;
  rutaImgen: string = this.baseUrl + '/assets/img/persona_icono_principal.png';
  nombreUsuario: string = '';
  rol: string = '';
  tipoUsuario: string = '';
  isMobile: boolean = false;
  constructor(private authService: AuthenticationService, private router: Router, private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 991.98px)'])
      .subscribe((result:any) => {
        this.isMobile = result.matches;
      });
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
