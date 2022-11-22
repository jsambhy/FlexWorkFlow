import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { clientsModel } from '../models/clientsModel';

@Injectable()
export class FileUploadService {
  
  constructor(private httpClient: HttpClient) { }

  getFilesData(): Observable<any> {

    // return this.httpClient.get("https://localhost:443/api/FileUpload");
    return this.httpClient.get("https://localhost:44308/api/FileUpload");
  }
  getFileNameByHash(hash): Observable<any> {
   
   // return this.httpClient.get("https://localhost:443/api/FileUpload/"+hash);
    return this.httpClient.get("https://localhost:44308/api/FileUpload/"+hash);
  }

  
}
