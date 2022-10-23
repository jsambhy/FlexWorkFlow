import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Ajax } from '@syncfusion/ej2-base';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { environment } from '../../../../environments/environment';
import { AccountService } from '../../../services/auth';
@Component({
  selector: 'app-policy-acceptance',
  templateUrl: './policy-acceptance.component.html',
})
export class PolicyAcceptanceComponent{
  PolicyText: any;
  PolicyDetails: any;
  returnUrl: string;
  UserId: number;
  //UserName: string; 

  readonly baseUrl = environment.baseUrl;
  @ViewChild('toasttype', { static: false })
  private toastObj: ToastComponent;
  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: '', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: '', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: '', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: '', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };
  constructor(
    private AccountService: AccountService,
    private router: Router,
    private route: ActivatedRoute
  ) {
   
    //getting the id from the url
    this.route.params.subscribe((params: Params) => {
      this.UserId = +params['UserId'];
     // this.UserName = params['UserName']; 
    });
     
   // this.returnUrl = "/dashboard";
    this.AccountService.GetPolicyText(this.UserId)
      .subscribe(
        result => {
          if (result == null || result.length == 0) {//if no policy exists, move ahead
            this.AccountService.DecideLoginNavigation(this.UserId);
          }
          this.PolicyDetails = result;
        }
      );
  }
  
  OnCancel() { 
    this.toastObj.timeOut = 2000;
    this.toasts[3].content = "In order to continue, you must accept the policy.";
    this.toastObj.show(this.toasts[3]);
    setTimeout(() => {
      this.router.navigate(['login']);
    }, 2000);
  }

  UpdatePolicy() { 
    this.AccountService.UpdatePolicy(this.UserId)
      .subscribe(
        result => {
          //log activity  is using Session storage info. Session is not set till this time which is causing exceptions due to null session values
          this.AccountService.DecideLoginNavigation(this.UserId);
          //this.AccountService.LogUserActivity('PolicyAccepted', 'PolicyAccepted', true)
          //  .subscribe(data => {
          //    this.AccountService.DecideLoginNavigation(this.Email);
          //  });          
       });
  }

  //getUserInfo() {
  //  this.AccountService.DecideLoginNavigation(this.Email);
  //  //this.AccountService.GetUserInfo(this.Email)
  //  //  .subscribe(
  //  //    user => {
  //  //      const callback: Ajax = new Ajax(this.baseUrl + '/Account/IsResetPasswordRequired?LoginEmail=' +
  //  //        user.Email + "&ProjectId=" + user.ProjectId, 'GET', false, 'application/json; charset=utf-8');
  //  //      callback.onSuccess = (ResetResult: string): void => {
  //  //        if ((ResetResult == "true") || (user.IsADResetPasswordRequired)) {
  //  //          this.router.navigate(["/prelogin/ResetPassword", user.Email]);
  //  //        }
  //  //        else {
  //  //          const callback: Ajax = new Ajax(this.baseUrl + '/Account/RequireQuestions?UserId=' +
  //  //            user.Id, 'GET', false, 'application/json; charset=utf-8');
  //  //          callback.onSuccess = (QuestionResult: string): void => {
  //  //            if (QuestionResult == "true") {
  //  //              this.router.navigate(["/prelogin/SecurityQuestions", user.Id, user.Email]);
  //  //            }
  //  //            else {
  //  //              this.AccountService.setSessionVariables(user);
  //  //              this.AccountService.LogUserActivity('LoggedIn', 'LoggedIn', true).subscribe(data => {
  //  //                this.router.navigate([this.returnUrl]);
  //  //              })
  //  //            }
  //  //          };
  //  //          callback.send().then();
  //  //        }
  //  //      };
  //  //      callback.send().then();
  //  //    })
  //}
}  
