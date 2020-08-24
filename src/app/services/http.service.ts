import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
 
import { environment } from './../../environments/environment';
 
import { SuperMarket } from './../interfaces/super-market';


@Injectable()
export class HttpService {

  constructor(private http: HttpClient,) { }
     
  private httpOptions = {
    headers: new HttpHeaders({
    'Content-Type': 'application/json'
    })
  };

  getSuperMarket(): Observable<SuperMarket[]> {
    return this.http.get<SuperMarket[]>(`${environment.apiUrl}/superMarkets`);
  }
     
  addSuperMarket(SuperMarket: SuperMarket): Observable<SuperMarket> {
    return this.http.post<SuperMarket>(`${environment.apiUrl}/superMarket`, SuperMarket, this.httpOptions);
  }
     
  updateSuperMarket(superMarketId: string, superMarket: SuperMarket): Observable<SuperMarket> {
    return this.http.put<SuperMarket>(`${environment.apiUrl}/superMarket/${superMarketId}`, superMarket, this.httpOptions);
  }
     
  deleteSuperMarket(superMarketId: string): Observable<{}>  {
    return this.http.delete(`${environment.apiUrl}/superMarket/${superMarketId}`, this.httpOptions);
  }
}
