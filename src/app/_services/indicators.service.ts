import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class IndicatorsService {
    url = "https://mindicador.cl/api/"
    constructor(private http: HttpClient) { }

    getAll(){
        return this.http.get(this.url).toPromise();
    }

    findIndicators(indicators: string){
        return this.http.get(this.url+indicators).toPromise();
    }

    findIndicatorDate(indicators: string, date: string){
        return this.http.get(this.url+indicators+'/'+date).toPromise();
    }



}
