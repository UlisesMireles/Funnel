import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../enviroment/enviroment";
import { UsuarioData} from '../interfaces/cambiar-contraseña';
@Injectable({
  providedIn: 'root'
})
export class CambiarContrasenaService {
  baseUrl: string = environment.baseURL;
  constructor(private http: HttpClient) { }
  postCambiarPass(data: UsuarioData): Observable<any> {
    return this.http.post(this.baseUrl+"api/Administrador/CambiarPass", data);
  }
  postCambiarPassTwoFactor(usuario:string): Observable<any> {
    const datos= {usuario: usuario};
    return this.http.post(this.baseUrl+"api/Administrador/CambiarPassTwoFactor?usuario="+usuario,datos);
  }
}
