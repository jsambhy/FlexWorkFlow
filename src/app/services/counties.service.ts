import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { clientsModel } from '../models/clientsModel';

@Injectable()
export class CountiesService {
  
  constructor(private httpClient: HttpClient) { }
  
  getCounties(): Observable<any> {
   
    return this.httpClient.get("https://localhost:443/api/Counties");
  }

  
}
