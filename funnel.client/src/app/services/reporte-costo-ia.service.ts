import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from  'rxjs';
import { environment } from '../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ReporteCostoIaService {baseUrl:string = environment.baseURL;
  constructor(private http: HttpClient ) {}
  getReporte(): Observable<any>{
    return this.http.get(this.baseUrl + 'api/CostoIa/ObtenerReporteCosto');
  }}