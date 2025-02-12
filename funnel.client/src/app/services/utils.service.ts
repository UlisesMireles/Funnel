import { Injectable } from "@angular/core";
import { environment } from "../../enviroment/enviroment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UtilsService { 
    baseUrl: string = environment.baseURL;

    constructor(private http: HttpClient) { }

    getVersion() {
        return this.http.get<any>(this.baseUrl + "api/Login/ObtenerVersion");
    }
}