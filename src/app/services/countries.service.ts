import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { clientsModel } from '../models/clientsModel';

@Injectable()
export class CountriesService {
  
  constructor(private httpClient: HttpClient) { }
  

  getCountries(): Observable<any> {
    return this.httpClient.get("https://localhost:443/api/Countries");
  }

  
}
