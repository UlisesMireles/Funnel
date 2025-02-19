import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from  'rxjs';
import { environment } from '../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  baseUrl:string = environment.baseURL;
  constructor(private http: HttpClient ) {}
  getStats(): Observable<any>{
    return this.http.get(this.baseUrl + 'api/Stats/ObtenerStats');
  }
}
