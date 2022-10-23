import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { AccountService } from '../../services/auth';
import { CountryModel } from '../../models/country-model';
import { ILogin } from '../../models/loginModel';
import { ToastPositionModel, ToastComponent } from '@syncfusion/ej2-angular-notifications';
import { SignUpModel } from '../../models/sign-up-model';
import { environment } from '../../../environments/environment';
import { Ajax } from '@syncfusion/ej2-base';
import { IAMService } from '../../services/iam';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  providers: [IAMService]
})
export class LoginComponent {
  readonly baseUrl = environment.baseUrl;
  readonly AuthSource = environment.AuthSource;

  loginForm: FormGroup;
  returnreturnUrl: string;
  CountryList: CountryModel[];
  model: ILogin = new ILogin();
  submitted = false;
  returnUrl: string;
  public countryDropdownFields: Object = { text: 'CountryName', value: 'CountryCode' };
  //SignUpForm: FormGroup = null;
  //SignUpModel: SignUpModel = new SignUpModel();

  @ViewChild('toasttype', { static: false })
  private toastObj: ToastComponent;
  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: '', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: '', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: '', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: '', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center'};

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private _AccountService: AccountService,
    private _iam: IAMService) {
  }

  ngOnInit() {
   
    this.loginForm = this.formBuilder.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required]],
      //RememberMe:[true]
    });
    //update url by Namita
    this.returnUrl = '/dashboard';
   
    this._AccountService.GetCountryList()
      .subscribe(
        data => {
          this.CountryList = data;
        }
      );
  }

  // convenience getter for easy access to form fields  
  get f() { return this.loginForm.controls; }
  login(UserName, Password) {
    // 
    this.submitted = true;
    // stop here if form is invalid  
    //if (this.loginForm.invalid) {
    //  return;
    //}
    //else
    {
      let lastActiveUrl = localStorage.getItem("currentURL");
      sessionStorage.setItem('currentURL', lastActiveUrl);//get value from localStorage and set in sessionstorage
      localStorage.clear();
      this.model.UserName = UserName; 
      this.model.Password = Password;

      if (this.AuthSource == 'ActiveDirectory') {
        //call to our webAPI for AD authentication
        this._AccountService.ADAuthenticate(this.model).subscribe(data => {
          this.FetchUserDetails(UserName,'UserName');
        },
        (error: any) => {
          this.toastObj.timeOut = 3000;
          this.toasts[2].content = error.error["Message"];
          this.toastObj.show(this.toasts[2]);
        });
      }
      else if (this.AuthSource == 'Cognito') {
        //call to cognito API
        Auth.signIn(UserName, Password).then(user => {
          console.log(user);
          sessionStorage.setItem('UserName', UserName); 
         // sessionStorage.setItem('CognitoUser', JSON.stringify(user));
          let LoginUserNameType = '';

          //There is difference when we are creating user from Console or code. 
          if (user.challengeParam == undefined) {  //user created from code
          
            if (UserName == user.attributes.email) {
              LoginUserNameType = 'Email';
            }
            else if (UserName == user.attributes.phone_number) {
              
              LoginUserNameType = 'PhoneNumber';
            }
            else {
              LoginUserNameType = 'UserName';
            }
          }
          else {//user created from console
            if (UserName == user.challengeParam.userAttributes.email) {
              LoginUserNameType = 'Email';
            }
            else if (UserName == user.challengeParam.userAttributes.phone_number) {
             
              LoginUserNameType = 'PhoneNumber';
            }
            else {
              LoginUserNameType = 'UserName';
            }

          }

          this.FetchUserDetails(UserName, LoginUserNameType);           
        })
          .catch(err => {
            console.log(err)
            this.toastObj.timeOut = 3000;
            this.toasts[2].content = err.message;
            this.toastObj.show(this.toasts[2]);
            //return err;
          });
        
      } 
        
    }

  }

  SignUpPage() {
   
    this.router.navigate(['front']);
  }

  FetchUserDetails(UserName, LoginUserNameType) {
    const logincallback: Ajax = new Ajax(this.baseUrl + "/Account/DBUserAuthenticateAndGetUser?UserName=" + UserName + '&LoginUserNameType=' + LoginUserNameType);
    logincallback.onSuccess = (loginDetails): void => {
      let result = JSON.parse(loginDetails);
      console.log(result);
      if (result.IsMFARequired == true && result.IsMFASet == false) {
        this.router.navigate(["/prelogin/MFARegistration", result.Id, result.UserName, result.PolicyAccepted]);
      }
      else if (result.IsMFARequired == true && result.IsMFASet == true) {
        this.router.navigate(["/prelogin/MFAScreen", result.Id, result.SecretKey, result.PolicyAccepted]);
      }
      else {//It means MFA is not required

        //Check for policy Acceptance here
        if (!result.PolicyAccepted) {
          this._AccountService.GetPolicyText(result.Id)
            .subscribe(
              policytext => {
                if (policytext == null || policytext.length == 0) {//if no policy exists, move ahead
                  this._AccountService.DecideLoginNavigation(result.Id );
                } else {
                  this.router.navigate(['/prelogin/PolicyAcceptance', result.Id ]);
                }
              }
            );
        }
        else {//MFA not required and Policy already accepted case
          this._AccountService.DecideLoginNavigation(result.Id );
        }
      }
    },
      logincallback.onFailure = (errors): void => {
        this.toastObj.timeOut = 0;
        this.toasts[2].content = JSON.parse(errors.response)["Message"];
        this.toastObj.show(this.toasts[2]);

      }
    logincallback.send().then();
  }

  //get g() { return this.SignUpForm.controls; }

  //signUpUser() {
    
  //  this.SignUpModel.FirstName = this.g.FirstName.value;
  //  this.SignUpModel.LastName = this.g.LastName.value;
  //  this.SignUpModel.LoginEmail = this.g.LoginEmail.value;
  //  this.SignUpModel.CompanyName = this.g.Company.value;
  //  this.SignUpModel.JobTitle = this.g.JobTitle.value;
  //  this.SignUpModel.PhoneNumber = this.g.PhoneNumber.value;
  //  this.SignUpModel.CountryName = this.g.Country.value;

  //  this._AccountService.SignUpUser(this.SignUpModel)
  //    .subscribe(
  //      data => {
  //        this.toastObj.timeOut = 3000;
  //        this.toasts[1].content = "User Register successfully";
  //        this.toastObj.show(this.toasts[1]);
  //        setTimeout(() => { window.location.reload(); }, 3000);
  //      }
  //    );
  //}

  forgotPassword(Email) {
    //let Email: string = this.f.Email.value;
    if (Email == '') {
      this.toastObj.timeOut = 0;
      this.toasts[2].content = "Email is required.";
      this.toastObj.show(this.toasts[2]);
      return;
    }
    //check email existence in db
    this._AccountService.CheckEmailExists(Email)
      .subscribe(EmailExists => {
        if (EmailExists) {
          this.router.navigate(['/prelogin/ForgotPassword', Email]);
        } else {
          this.toastObj.timeOut = 3000;
          this.toasts[2].content = "User not registered.";
          this.toastObj.show(this.toasts[2]);
          setTimeout(() => { this.router.navigate(['']); }, 3000);

        }
      });
  }

}
