import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ILogin, ChangePasswordModel, ChangeSecurityQuestionsModel, ForgotPasswordViewModel, LoginViewModel, LogActivityViewModel } from '../models/loginModel';
import { CountryModel } from '../models/country-model';
import { SignUpModel } from '../models/sign-up-model';
import { PersonalizationViewModel } from '../models/Personalization.model';
import { UserActivityViewModel } from '../models/UserActivityViewModel';
import { Ajax } from '@syncfusion/ej2-base';
import { SendEmailModel } from '../models/SendEmailModel';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  readonly baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient, private router: Router) {
  }
  logout(): void {
    this.LogUserActivity('LoggedOut', 'LoggedOut', true).subscribe(data => {
      sessionStorage.clear();
      this.router.navigate(['/']);
    });
  }

  signIn(): void {

  }



  GetPolicyText(UserId): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/Account/GetPolicyText?UserId=" + UserId);
  }

  //GetFileNameByEntity(EntityType: string, EntityId: number): Observable<any> {
  //  return this.httpClient.get(this.baseUrl + "/Account/GetFileNameByEntity?EntityType=" + EntityType + "&EntityId=" + EntityId);
  //}
  ADAuthenticate(model: ILogin): Observable<any> { 
    return this.httpClient.post(this.baseUrl + "/Account/ADAuthenticate", model,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }
  UserAuthenticate(Email ): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/Account/UserAuthenticate?Email=" +  Email );
    //return this.httpClient.get(this.baseUrl + "/Account/UserAuthenticate?HostBrowserDetails=" +
    //  "&HostIP=&HostTimeZone=&Email=" + model.Email + "&Password=" + model.Password);
  }
  GetUserInfo(UserId ): Observable<any> { 
    //return this.httpClient.get<any>(this.baseUrl + "/Account/UserInfo?UserName=" + UserName)
    return this.httpClient.get<any>(this.baseUrl + "/Account/UserInfo?UserId=" + UserId)
  }

  GetUserIdByUserName(UserName:string): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/Account/GetUserIdByUserName?UserName=" + UserName)
  }

  IsResetPasswordRequired(LoginEmail: string, ProjectId: number): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/Account/IsResetPasswordRequired?LoginEmail=" +
      LoginEmail + "&ProjectId=" + ProjectId)

  }

  UpdateResetFlag(UserId: number, ProjectId:number): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/Account/UpdateResetFlag?UserId=" + UserId + "&ProjectId=" + ProjectId)
  }


  CheckEmailExists(email: string): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/LUser/CheckEmailExists?Email=" + email);
  }
  ChangePassword(model: ChangePasswordModel): Observable<any> {
    return this.httpClient.post(this.baseUrl + "/Account/ChangePassword", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  ChangeSecurityQuestions(model: ChangeSecurityQuestionsModel): Observable<any> {
    return this.httpClient.post(this.baseUrl + "/Account/ChangeSecurityQuestions", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  GetSecurityQuestions(userid: string): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/Account/GetQuestionAnswersByUser?userid=" + userid);
  }
  //GetPolicyText(Key: string, ProjectId: string): Observable<any> {
  //  return this.httpClient.get(this.baseUrl + "/GKeyValues/GetByKey?Key=" + Key + "&ProjectId=" + ProjectId );
  //}

  UpdatePolicy(UserId: number) {
    return this.httpClient.get(this.baseUrl + "/LUser/UpdatePolicyAcceptedTrue?UserId=" + UserId);
  }

  GetCountryList(): Observable<CountryModel[]> {
    return this.httpClient.get<CountryModel[]>(this.baseUrl + "/Account/GetCountryList");
  }
  VerifyQuestion(model: ForgotPasswordViewModel): Observable<any> {
    return this.httpClient.post(this.baseUrl + "/Account/VerifyQuestion", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GenerateOTPnSendMail(UserId): Observable<any> {
    return this.httpClient.get<CountryModel[]>(this.baseUrl + "/Account/GenerateOTPnSendMail?UserId=" + UserId);
  }

  VerifyOTP(Otp: string,  UserId: string) {
    return this.httpClient.get(this.baseUrl + "/Account/VerifyOTP?OTP=" + Otp   + "&UserId=" + UserId);
  }
  SignUpUser(model: SignUpModel): Observable<any> {
    return this.httpClient.post(this.baseUrl + "/Account/SignUpUser", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  RequestDemo(model: SignUpModel): Observable<any> {
    return this.httpClient.post(this.baseUrl + "/Account/RequestDemo", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  CreateADUser(UserId: number): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/Account/CreateADUser?userId=" + UserId);
  }

  SendUserCreationEmails(model: SendEmailModel): Observable<any> {
    return this.httpClient.post(this.baseUrl + "/Account/SendUserCreationEmails", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  DeleteSignUpUser(UserId: number, ProjectId:number): Observable<void> {
    return this.httpClient.delete<void>(this.baseUrl + "/Account/DeleteSignUpUser?UserId=" + UserId + "&ProjectId=" + ProjectId);
  }

  setSessionVariablesAndLogActivity(result: LoginViewModel, LogActivity: LogActivityViewModel) { 
    
    this.GetExistingInfoByEntityType(result.UserRoles[0].EntityType, result.UserRoles[0].EntityId)
      .subscribe(
        EntityDetails => {
          sessionStorage.setItem('DefaultEntityName', EntityDetails[0].Name);
          sessionStorage.setItem('LogoPath', EntityDetails[0].LogoPath);
          sessionStorage.setItem('Logo', EntityDetails[0].Logo);
          sessionStorage.setItem('PunchLine', EntityDetails[0].PunchLine);
          sessionStorage.setItem('ProjectId', result.ProjectId.toString());
          sessionStorage.setItem('LoggedInRoleId', result.UserRoles[0].RoleId.toString());
          sessionStorage.setItem('UserRoleId', result.UserRoles[0].Id.toString());
          sessionStorage.setItem('LoggedInScopeEntityId', result.UserRoles[0].EntityId.toString());
          sessionStorage.setItem('LoggedInScopeEntityType', result.UserRoles[0].EntityType.toString());
          sessionStorage.setItem('LoggedInRoleName', result.UserRoles[0].RoleName.toString());
          sessionStorage.setItem('LoggedInUserId', result.Id.toString());
          sessionStorage.setItem('LoginEmail', result.Email);
          sessionStorage.setItem('UserName', result.FullName);
          sessionStorage.setItem('isLoggedIn', "true");
          sessionStorage.setItem('UserRoles', JSON.stringify(result.UserRoles));
          sessionStorage.setItem('UserImagePath', result.UserImagePath);
          sessionStorage.setItem('Environment', result.Environment);
          sessionStorage.setItem('IsSystemUser', result.IsSystemUser.toString());
          this.GetKeyValue('Version', 0).subscribe(ReleaseNo => {
            sessionStorage.setItem('ReleaseNumber', ReleaseNo['Value']);
            if (LogActivity != null) {
              //log user activity
              this.LogUserActivity(LogActivity.Activity, LogActivity.Remarks, LogActivity.IsActivitySuccess).subscribe(data => {
                this.router.navigate([LogActivity.ReturnUrl]);
              })
            }
          })
          
        }
    );
    

    //this.GetProjectDetail(result.ProjectId).subscribe(
    //  projectDetails => {
    //    sessionStorage.setItem('ProjectName', projectDetails.Name);
    //    sessionStorage.setItem('LogoPath', projectDetails.LogoPath);
    //    sessionStorage.setItem('Logo', projectDetails.Logo);
    //    sessionStorage.setItem('PunchLine', projectDetails.PunchLine);
    //    sessionStorage.setItem('ProjectId', result.ProjectId.toString());
    //    sessionStorage.setItem('LoggedInRoleId', result.UserRoles[0].RoleId.toString());
    //    sessionStorage.setItem('UserRoleId', result.UserRoles[0].Id.toString());
    //    sessionStorage.setItem('LoggedInScopeEntityId', result.UserRoles[0].EntityId.toString());
    //    sessionStorage.setItem('LoggedInScopeEntityType', result.UserRoles[0].EntityType.toString());
    //    sessionStorage.setItem('LoggedInRoleName', result.UserRoles[0].RoleName.toString());
    //    sessionStorage.setItem('LoggedInUserId', result.Id.toString());
    //    sessionStorage.setItem('LoginEmail', result.Email);
    //    sessionStorage.setItem('isLoggedIn', "true");
    //    sessionStorage.setItem('UserRoles', JSON.stringify(result.UserRoles));
    //    sessionStorage.setItem('UserImage', JSON.stringify(result.UserImage));
    //    if (LogActivity != null) {
    //      //log user activity
    //      this.LogUserActivity(LogActivity.Activity, LogActivity.Remarks, LogActivity.IsActivitySuccess).subscribe(data => {
    //        this.router.navigate([LogActivity.ReturnUrl]);
    //      })
    //    }
    //  }
    //);
  }
  GetKeyValue(Key, Projectid): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/GKeyValues/GetByKey?Key=" + Key + '&Projectid=' + Projectid);
  }
  GetProjectDetail(ProjectId) {
    //let ProjectId = +sessionStorage.getItem('ProjectId');
    return this.httpClient.get<any>(this.baseUrl + "/GProjects/GetProjectById?ProjectId=" + ProjectId);
  }

  GetUserRoleId(LoggedInUserId: number, LoggedInRoleId: number): Observable<number> {
    return this.httpClient.get<number>(this.baseUrl + "/LUser/GetUserRoleId?UserId=" + LoggedInUserId + "&RoleId=" + LoggedInRoleId);
  }

  GetUserRoleTips(UserRoleId: number, EntityType: string, EntityId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(this.baseUrl + "/Account/GetUserRoleTips?UserRoleId=" + UserRoleId + "&EntityType=" + EntityType + "&EntityId=" + EntityId);
  }

  UpdateDontShowFlag(UserRoleId: number): Observable<void> {
    return this.httpClient.get<void>(this.baseUrl + "/Account/UpdateDontShowFlag?UserRoleId=" + UserRoleId);
  }
  GetExistingInfoByEntityType(EntityType: string, EntityId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/Account/GetExistingInfoByEntityType?EntityType=" + EntityType + "&EntityId=" + EntityId);
  }

  UpdateInfoByEntityId(PersonalizationViewModel: PersonalizationViewModel): Observable<void> {
    return this.httpClient.put<void>(this.baseUrl + "/Account/UpdateInfoByEntityId", PersonalizationViewModel, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  LogUserActivity(Activity, Remarks, IsActivitySuccess): Observable<void> {
    let model: UserActivityViewModel = new UserActivityViewModel(); 
    model.Activity = Activity;
    model.IsActivitySucceeded = IsActivitySuccess;
    model.Remarks = Remarks;
    model.ActionById = +sessionStorage.getItem('LoggedInUserId');
    model.ActionForId = +sessionStorage.getItem('LoggedInUserId');
    model.ProjectId = +sessionStorage.getItem('ProjectId');
    model.ActivityDateTime = new Date();
    model.ParameterCarrier = "UserName=" + sessionStorage.getItem('LoginEmail');
    return this.httpClient.post<void>(this.baseUrl + "/Account/LogUserActivity", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  DecideLoginNavigation(UserId) {
   // let result: LoginViewModel = new LoginViewModel();
    this.GetUserInfo(UserId).subscribe(
      result => {
        const Resetcallback: Ajax = new Ajax(this.baseUrl + '/Account/IsResetPasswordRequired?UserId=' +
          UserId + "&ProjectId=" + result.ProjectId, 'GET', false, 'application/json; charset=utf-8');
        Resetcallback.onSuccess = (ResetResult: string): void => {
          if ((ResetResult == "true") || (result.IsADResetPasswordRequired)) {//password reset required
            this.router.navigate(["/prelogin/ResetPassword", result.Email, result.Id, result.ProjectId]);
          }
          else {
            const questioncallback: Ajax = new Ajax(this.baseUrl + '/Account/RequireQuestions?UserId=' +
              result.Id, 'GET', false, 'application/json; charset=utf-8');
            questioncallback.onSuccess = (QuestionResult: string): void => {
              if (QuestionResult == "true") {//required to setup questions
                this.router.navigate(["/prelogin/SecurityQuestions", result.Id]);
              }
              else {
                let logModel: LogActivityViewModel = new LogActivityViewModel();
                logModel.Activity = 'LoggedIn';
                logModel.Remarks = 'LoggedIn';
                logModel.IsActivitySuccess = true;
              
                logModel.ReturnUrl = '/dashboard';
               
                this.setSessionVariablesAndLogActivity(result, logModel);

              }
            };
            questioncallback.send().then();
          }
        };
        Resetcallback.send().then();
      });
  }

  GetPasswordPolicyByProjectId(ProjectId): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/LPasswordPolicies/GetPasswordPolicyByProjectId?ProjectId=" + ProjectId);
  }

  GetValueFromGKeyValues(Key: string, ProjectId: number): Observable<string> {
    return this.httpClient.get<any>(this.baseUrl + "/GKeyValues/GetByKey?Key=" + Key +"&ProjectId=" + ProjectId);

  }

  GetSystemProjectId(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/GProjects/GetSystemProjectId");

  }

}



