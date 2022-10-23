import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { bool } from 'aws-sdk/clients/signer';


@Injectable()
export class ConstraintsService {
  readonly baseUrl = environment.baseUrl;
  constructor(private httpClient: HttpClient) {
  }
  GetRestrictionById(Id): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/RestrictDropdownDataByUserRoles/GetById?"
      + "Id=" + Id );
  }

  GetRestrictionForTxn(EntityType, EntityId, TransactionId): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/RestrictDropdownDataByUserRoles/GetRestrictionForTxn?"
      + "EntityType=" + EntityType + "&EntityId=" + EntityId + "&TransactionId=" + TransactionId);
  }
  AddRestrictions(postData): Observable<any> {
    return this.httpClient.post(this.baseUrl + "/RestrictDropdownDataByUserRoles/Post",
      postData, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  DeleteRestrictions(Id): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/RestrictDropdownDataByUserRoles/Delete?"
      + "Id=" + Id);
  }
  GetConstraints(EntityType, EntityId, ProjectId): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/Constraints/GetCustomConstraints?"
      + "EntityType=" + EntityType + "&EntityId=" + EntityId + "&ProjectId=" + ProjectId);
  }

  GetConstraintById(Id): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/Constraints/GetById?"
      + "Id=" + Id);
  }
  CheckIfPrimaryKeyExists(EntityType, EntityId, ProjectId, ConstraintId): Observable<bool> {
    return this.httpClient.get<bool>(this.baseUrl + "/Constraints/CheckIfPrimaryKeyExists?"
      + "EntityType=" + EntityType + "&EntityId=" + EntityId + "&ProjectId=" + ProjectId + "&ConstraintId=" + ConstraintId);
  }

  Add(postData): Observable<any> {
    return this.httpClient.post(this.baseUrl + "/Constraints/Post",
      postData, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  Update(ConstraintId, putdata): Observable<any> {
    return this.httpClient.put<string>(this.baseUrl + "/Constraints/Update?Id=" + ConstraintId, putdata,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })

  }
  Delete(Id): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/Constraints/Delete?"
      + "Id=" + Id);
  }

}
