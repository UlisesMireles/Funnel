import { Injectable } from "@angular/core";
import { environment } from "../../enviroment/enviroment";
import { HttpClient } from "@angular/common/http";
import { Administrador } from "../interfaces/Administrador";

@Injectable({
  providedIn: 'root'
})
export class AdministradoresService {
  baseUrl: string = environment.baseURL;

  constructor(private http: HttpClient) { }

  getAdministradores() {
    return this.http.get<any>(this.baseUrl + "api/Administrador/CatalogoAdministradores");
  }

  insetarAdministradores(admin:Administrador) {
    return this.http.post<any>(this.baseUrl + "api/Administrador/InsertaAdministradores", admin);
  }

  editarAdministrador(admin:Administrador) {
    return this.http.post<any>(this.baseUrl + "api/Administrador/ModificaAdministradores", admin);
  }
}