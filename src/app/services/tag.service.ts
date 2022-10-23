import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { GProject } from '../models/project-model';
import { RFileExtensions } from '../models/file-extension-model';
import { EntityModel } from '../models/entity.model';
import { tagsmodel } from '../models/tag.model';
import { bool } from 'aws-sdk/clients/signer';


@Injectable()
export class TagsService {
  baseUrl = environment.baseUrl;


  constructor(private httpClient: HttpClient) {

  }


  GetTagDataByCategoryId(TagCategoryId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/Tags/GetTagDataByCategoryId?CategoryId=" + TagCategoryId);
  }

  GetData(EntityId): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/Tags/GetTagsCategories?EntityId=" + EntityId);
  }
  Save(model: tagsmodel): Observable<tagsmodel> {
    return this.httpClient.post<tagsmodel>(this.baseUrl + "/Tags/Post", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetById(Id: number): Observable<tagsmodel> {
    return this.httpClient.get<tagsmodel>(this.baseUrl + "/Tags/GetById?Id=" + Id);
  }

  Update(model: tagsmodel): Observable<tagsmodel> {
    
    return this.httpClient.post<tagsmodel>(this.baseUrl + "/Tags/updateTag", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  //Delete(Id: number): Observable<string> {
  //  return this.httpClient.delete<string>(this.baseUrl + "/Tags/Delete?Id=" + Id);
  //}
  Delete(model: tagsmodel): Observable<tagsmodel>
  {
    return this.httpClient.post<tagsmodel>(this.baseUrl + "/Tags/DeleteTag", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  //*******************************************************************************************************************************//
  SaveCategory(model: tagsmodel): Observable<tagsmodel> {
    return this.httpClient.post<tagsmodel>(this.baseUrl + "/Tags/SaveCategory", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }


  //getRepeatedCatName
  getRepeatedCatName(model: tagsmodel): Observable<tagsmodel> {
    return this.httpClient.get<tagsmodel>(this.baseUrl + "/Tags/getRepeatedCatName?Name=" + model.Name + " &EntityId=" + model.LoggedInScopeEntityId + "&EntityType=" + model.LoggedInScopeEntityType)
  }
  GetCategoryById(Id: number): Observable<tagsmodel> {

    return this.httpClient.get<tagsmodel>(this.baseUrl + "/Tags/GetCategoryById?Id=" + Id);
  }
  
  UpdateTagCategory(model: tagsmodel): Observable<string> {
    
    return this.httpClient.put<string>(this.baseUrl + "/Tags/Put", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  DeleteCategory(Id: number): Observable<string> {
    return this.httpClient.delete<string>(this.baseUrl + "/Tags/DeleteCategory?Id=" + Id);
  }
  checkIfExists(model): Observable<tagsmodel> {
    return this.httpClient.post<tagsmodel>(this.baseUrl + "/Tags/checkIfExists", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }
  //GetCategoryById
  //SaveCategory
}
