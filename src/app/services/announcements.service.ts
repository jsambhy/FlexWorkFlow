import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { GProject } from '../models/project-model';
import { RFileExtensions } from '../models/file-extension-model';
import { EntityModel } from '../models/entity.model';
import { tagsmodel } from '../models/tag.model';
import { bool } from 'aws-sdk/clients/signer';
import { announcementsmodel } from '../models/announcements.model';

@Injectable()
export class AnnouncementsService {
  baseUrl = environment.baseUrl;
  constructor(private httpClient: HttpClient) { }
  GetAnnouncements(): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/Announcements/GetAnnouncements");
  }
  Save(postdata: announcementsmodel): Observable<any> {
    return this.httpClient.post(this.baseUrl + "/Announcements/Save", postdata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetById(Id: number): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/Announcements/GetById?" + "id=" + Id);
  }

  Update(model: announcementsmodel): Observable<tagsmodel> {
    return this.httpClient.post<tagsmodel>(this.baseUrl + "/Announcements/update", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  Delete(model: announcementsmodel): Observable<tagsmodel> {
    return this.httpClient.delete<tagsmodel>(this.baseUrl + "/Announcements/Delete?" + "Id=" + model.Id)
  }
}
