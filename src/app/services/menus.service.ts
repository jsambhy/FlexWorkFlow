import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";




@Injectable()
export class MenusService {
  readonly basrUrl = environment.baseUrl;
  constructor(private httpClient: HttpClient) {

  }


  getMenusByUserRole(LoggedInUserId: number, LoggedInRoleId: number, EntityType: string, EntityId: number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/GMenus/GetGMenusRolesByUserRole?RoleId=" + LoggedInRoleId + "&LoggedInUserId=" + LoggedInUserId + "&LoggedInScopeEntityType=" + EntityType + "&LoggedInScopeEntityId=" + EntityId);
  }

  GetMenuByUrl(MenuUrl: string): Observable<string> {
    return this.httpClient.get<string>(this.basrUrl + "/GMenus/GetMenuByUrl?MenuUrl=" + MenuUrl);
  }

  CheckExistenceByUrl(MenuUrl: string): Observable<any> {
    return this.httpClient.get<any>(this.basrUrl + "/GMenus/CheckExistenceByUrl?MenuUrl=" + MenuUrl);
  }
}
