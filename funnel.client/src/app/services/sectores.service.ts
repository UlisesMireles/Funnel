import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from  'rxjs';
import { environment } from '../../enviroment/enviroment';


import { requestSector } from '../interfaces/Sector';
import { baseOut } from '../interfaces/utils/baseOut';

@Injectable({
  providedIn: 'root'
})
export class SectoresService {
  baseUrl:string = environment.baseURL;
  constructor(private http: HttpClient ) {}

  getSectores(): Observable<any>{
    return this.http.get(this.baseUrl + 'api/Sector/SEL_Sectores');
  }
  getSectores_cmb(): Observable<any>{
    return this.http.get(this.baseUrl + 'api/Sector/SEL_Sectores_CMB');
  }
  postINSUPDSector(data: requestSector): Observable <baseOut>{
    return this.http.post<baseOut>(this.baseUrl+'api/Sector/INS_UPD_Sector', data);
  }
}
