import { Component, HostListener, OnInit } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { Globals } from './services/globals';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  login: boolean = false;

  constructor(private authService: AuthenticationService, private router: Router) {

  }
  ngOnInit(): void {
    Globals.usuario = localStorage.getItem('username') as string;
    Globals.idUsuario = parseInt(localStorage.getItem('currentUser') as string);
    Globals.tipoUsuario = localStorage.getItem('tipoUsuario') as string;

    this.router.events.subscribe(() => {
      if(this.router.url === '/' || this.router.url === '/recuperar-contrasena'  || this.router.url === '/login'){
        this.login = true;
      }else{
        this.login = false;
      }
    });

  }

  @HostListener('window:click')
  onUserActivity() {
    if (parseInt(localStorage.getItem('currentUser') as string) > 0) {
      this.authService.resetTimer();
    }
  }
}
