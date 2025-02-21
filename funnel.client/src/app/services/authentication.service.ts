
import { Injectable } from '@angular/core';
import { environment } from '../../enviroment/enviroment';
import { BehaviorSubject, finalize, map, Observable } from 'rxjs';
import { UsuarioLogin } from '../interfaces/Usuarios';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TwoFactor} from '../interfaces/cambiar-contraseña';
import { LoginUser } from '../interfaces/LoginUser';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseUrl: string = environment.baseURL;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser: Observable<UsuarioLogin>;

  private sessionTimeout = 30 * 60 * 1000;
  private timer: any;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<UsuarioLogin>(JSON.parse(localStorage.getItem('currentUser')!));
    this.currentUser = this.currentUserSubject.asObservable();
    this.checkInitialSession();
   }

   private checkInitialSession() {
    const currentUser = localStorage.getItem('currentUser');
    const lastActivity = localStorage.getItem('lastActivity');

    if (currentUser && lastActivity) {
      const timeDiff = Date.now() - parseInt(lastActivity);
      if (timeDiff > this.sessionTimeout) {
        this.logout();
      } else {
        this.currentUserSubject.next(JSON.parse(currentUser));
        this.startSessionTimer();
      }
    }
  }

   public get currentUserValue(): UsuarioLogin {
    return this.currentUserSubject.value;
  }

  login(user: string, pass: string) {
    const datos = { usuario: user, pass: pass };
    return this.http.post<any>(this.baseUrl + "api/Login/Autenticacion", datos)
    .pipe(map(usuario => {
      var user = usuario;
      if (user.idUsuario > 0) {
            localStorage.setItem('currentUser', JSON.stringify(user.idUsuario));
            localStorage.setItem('tipoUsuario', user.tipoUsuario);
            localStorage.setItem('username', datos.usuario);
            localStorage.setItem('nombre', user.nombre);
            localStorage.setItem('correo', user.correo);
            localStorage.setItem('lastActivity', Date.now().toString());
            this.currentUserSubject.next(user);
            sessionStorage.setItem('sesion', window.btoa(JSON.stringify(datos)));
            this.startSessionTimer();
      }
      return user;
    }));
  }

  reenviarTwoFactor(user: string, pass: string) {
    const datos = { usuario: user, pass: pass };
    return this.http.post<any>(this.baseUrl + "api/Login/Autenticacion", datos);
  }



  startSessionTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.logout();
    }, this.sessionTimeout);
  }

  resetTimer() {
    localStorage.setItem('lastActivity', Date.now().toString());
    this.startSessionTimer();
  }

  logout(): void {
    this.http.post(`${this.baseUrl}api/Login/Logout`, {}, { responseType: 'text' })
      .pipe(
        finalize(() => {
          localStorage.removeItem('currentUser');
          localStorage.removeItem('tipoUsuario');
          localStorage.removeItem('username');
          localStorage.removeItem('lastActivity');
          localStorage.removeItem('nombre');
          localStorage.removeItem('correo');

          sessionStorage.clear();

          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.currentUserSubject.next(null);
          this.router.navigate(['/login']);
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Sesión cerrada exitosamente');
        },
        error: (error) => {
          console.log('Error al cerrar sesión:', error);
        }
      });
  }

  handleSessionExpired(): void {
    console.log('La sesión ha expirado');
    this.logout();
  }

  verificarSesion() {
    if (!localStorage.getItem('currentUser')) {
      this.logout();
      this.router.navigate(['/']);
    }
  }

  desencriptaSesion(): LoginUser {
    const sesion = sessionStorage.getItem("sesion");
    if (sesion) {
        return JSON.parse(window.atob(sesion));
    } else {
        return {} as LoginUser;
    }
}

  recuperarContrasena(user: string) {
    let datos = { usuario: user };
    return this.http.get<any>(this.baseUrl + "api/Login/RecuperarContrasena", { params: datos });
  }
  TwoFactor(usuariodosPasos: TwoFactor) {
    return this.http.post<any>(this.baseUrl + "api/Login/TwoFactor",usuariodosPasos);
  }
}
