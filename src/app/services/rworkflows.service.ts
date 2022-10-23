import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient} from "@angular/common/http";
import { environment } from "../../environments/environment";
import { RWorkFlows } from '../models/rworkflow-model';


@Injectable()
export class RworkFlowsService {
  readonly basrUrl = environment.baseUrl;
  constructor(private httpClient: HttpClient) {
    //this.getData();
  }

  GetWorkflowById(Id: number): Observable<any> {
    return this.httpClient.get<any>(this.basrUrl + "/FlexWorkFlows/GetById?id=" + Id);
  }

  GetAllWorkflowsByProject(ProjectId): Observable<any> {
    return this.httpClient.get<any>(this.basrUrl + "/FlexWorkFlows/GetWorkFlowsByProjectId?ProjectId=" + ProjectId);
  }
  
}
