import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { GProject } from '../models/project-model';
import { RFileExtensions } from '../models/file-extension-model';
import { EntityModel } from '../models/entity.model';
import { tagsmodel } from '../models/tag.model';
import { bool } from 'aws-sdk/clients/signer';
import { validationsmodel, validationRulesmodel } from '../models/validations.model';

@Injectable()
export class ValidationsService {
  baseUrl = environment.baseUrl;


  constructor(private httpClient: HttpClient) {

  }
  GetValidationsByStepActionId(StepActionId): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/Validations/GetAllValidations?StepActionId=" + StepActionId);
  }

  Save(model: validationsmodel): Observable<validationsmodel> {
    return this.httpClient.post<validationsmodel>(this.baseUrl + "/Validations/Save", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  GetValidationDataById(Id: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/Validations/GetValidationById?Id=" + Id);
  }
  //GetVRForValidationDataById
  GetVRForValidationDataById(WFId: number, StepActionValidationId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/Validations/GetVRForValidation?WFId=" + WFId + "&stepActionValidationId=" + StepActionValidationId);
  }

  Update(model: validationsmodel): Observable<string> {
    return this.httpClient.post<string>(this.baseUrl + "/Validations/Update", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  Delete(Id: number): Observable<string> {
    return this.httpClient.delete<string>(this.baseUrl + "/Validations/Delete?Id=" + Id);
  }

  //**************************************Validation-Rules methods*************************************************************
  
  GetAllValidationRulesByWFId(WFId): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/Validations/GetAllValidationRulesByWFId?WFId=" + WFId);
  }

  
  SaveValidationRule(model: validationRulesmodel): Observable<validationRulesmodel> {
    return this.httpClient.post<validationRulesmodel>(this.baseUrl + "/Validations/SaveValidationRule", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetValidationRuleDataById(Id: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/Validations/GetValidationRuleById?Id=" + Id);
  }
  //UpdateValidationRule
  UpdateValidationRule(model: validationRulesmodel): Observable<string> {
    return this.httpClient.post<string>(this.baseUrl + "/Validations/UpdateValidationRule", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  //DeleteValidationRule
  DeleteValidationRule(Id: number): Observable<string> {
    return this.httpClient.delete<string>(this.baseUrl + "/Validations/DeleteValidationRule?Id=" + Id);
  }

  //method to get the attribute column field for the entity column selected
  getAttributeByColConfigId(ColumnConfigId: number): Observable<string> {
    return this.httpClient.get<string>(this.baseUrl + "/DataFields/GetAttributeColumn?ColumnConfigId=" + ColumnConfigId);
  }
}
