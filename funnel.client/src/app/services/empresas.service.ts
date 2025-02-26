import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../enviroment/enviroment";
import { requestEmpresa } from '../interfaces/Empresa'

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {
  baseUrl: string = environment.baseURL;

  constructor(private http: HttpClient) { }

  // Método GET
  getEmpresas(): Observable<any> {
    return this.http.get(this.baseUrl +'api/empresa/ConsultarEmpresas');
  }
  getLicencias(): Observable<any> {
    return this.http.get(this.baseUrl + 'api/empresa/ComboLicencias');
  }

  // Método POST
  postINSUPDEmpresa(data: requestEmpresa): Observable<any> {
    return this.http.post(this.baseUrl+"api/empresa/GuardarEmpresa", data);
  }
}
