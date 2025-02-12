import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INSUPDEmpresa } from '../interfaces/ins-upd-empresa'

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {
  private apiUrl = 'https://localhost:7249/'; // Reemplaza con tu URL de la API

  constructor(private http: HttpClient) { }

  // Método GET
  getEmpresas(): Observable<any> {
    return this.http.get(this.apiUrl +'api/empresa/SEL_Empresas');
  }
  getLicencias(): Observable<any> {
    return this.http.get(this.apiUrl + 'api/empresa/SEL_Licencias');
  }

  // Método POST (si necesitas enviar datos)
  postINSUPDEmpresa(data: INSUPDEmpresa): Observable<any> {
    return this.http.post(this.apiUrl+"api/empresa/INS_UPD_Empresa", data);
  }
}
