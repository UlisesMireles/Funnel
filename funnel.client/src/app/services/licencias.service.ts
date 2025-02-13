import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from  'rxjs';
import { environment } from '../../enviroment/enviroment';


import { requestLicencia } from '../interfaces/Licencia';
import { baseOut } from '../interfaces/utils/baseOut';

@Injectable({
  providedIn: 'root'
})
export class LicenciasService {
  baseUrl:string = environment.baseURL;
  constructor(private http: HttpClient ) {}
  getLicencias(): Observable<any>{
    return this.http.get(this.baseUrl + 'api/Licencia/SEL_Licencias');
  }
  postINSUPDLicencia(data: requestLicencia): Observable <baseOut>{
    return this.http.post<baseOut>(this.baseUrl + 'api/Licencia/INS_UPD_Licencia', data);
  }
}

