import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { ChangePasswordModel } from '../../../models/loginModel';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AccountService } from '../../../services/auth';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { environment } from '../../../../environments/environment';
import { Auth } from 'aws-amplify';
//import {  ReorderService, ToolbarService, EditService } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  //providers: [ReorderService, ToolbarService, EditService]
})
export class ResetPasswordComponent implements OnInit {

  readonly AuthSource = environment.AuthSource;
  UserId: number;
  ProjectId:number
  LoginEmail: string;
  ResetPwdMsg: string;
  model: ChangePasswordModel = new ChangePasswordModel();
  changePwdForm: FormGroup;

  @ViewChild('toasttype', { static: false })
  private toastObj: ToastComponent;
  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: '', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: '', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: '', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: '', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };

  submitted = false;

  MinLowerCase: number = 1
  MinUpperCase: number = 1;
  MinNumbers: number = 1;
  MinSpecialChars: number = 1;
  MinLength: number = 8;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private AccountService: AccountService,
    private route: ActivatedRoute
  ) {
    //getting the id from the url
    this.route.params.subscribe((params: Params) => {
      this.LoginEmail = params['Email'];
      this.UserId = +params['UserId'];
      this.ProjectId = +params['ProjectId'];
    });
    //get passwordPolicies from database
    this.AccountService.GetPasswordPolicyByProjectId(this.ProjectId).subscribe(policies => {
      this.MinLowerCase = policies.MinLowerCase;
      this.MinUpperCase = policies.MinUpperCase;
      this.MinNumbers = policies.MinNumbers;
      this.MinSpecialChars = policies.MinSpecialChars;
      this.MinLength = policies.MinLength;
    })
  }
  goToPrevious(): void {
    if (sessionStorage.length > 2)
      this.router.navigateByUrl('/dashboard');
    else
      this.router.navigateByUrl('/login');
  }
   
  ngOnInit() {
    this.changePwdForm = this.formBuilder.group({
      Password: ['', [Validators.required]],
      NewPassword: ['', Validators.required ],
      ConfirmPassword: ['', Validators.required ]
    }
     //'{
        //validator: this.MustMatch('NewPassword', 'ConfirmPassword')
       // Validators: this.checkPasswords.bind(this)
        //validator: this.ConfirmPasswordValidator("NewPassword", "ConfirmPassword")
   // }
    );
    
  }
  //ConfirmPasswordValidator(controlName: string, matchingControlName: string) {
    
  //  return (formGroup: FormGroup) => {
     
  //    let control = formGroup.controls[controlName];
  //    let matchingControl = formGroup.controls[matchingControlName]
  //    if (matchingControl.errors && !matchingControl.errors.confirmPasswordValidator ) {
  //      return;
  //    }
  //    if (control.value !== matchingControl.value) {
  //      matchingControl.setErrors({ confirmPasswordValidator: true });
  //    } else {
  //      matchingControl.setErrors(null);
  //    }
  //  };
  //}

  get f() { return this.changePwdForm.controls; }
  passwordIsValid = false;
  passwordValid(event) {
    this.passwordIsValid = event;
  }
  public isFieldValid(field: string) {
    return !this.changePwdForm.get(field).valid && (this.changePwdForm.get(field).dirty || this.changePwdForm.get(field).touched);
  }
  
  ChangePassword() {
    
    this.submitted = true;
    let newPwd = this.f.NewPassword.value;
    let ConfirmPwd = this.f.ConfirmPassword.value;
    if (newPwd != ConfirmPwd) {
      this.toastObj.timeOut = 3000;
      this.toasts[2].content = 'New Password and Confirm Password does not match.';
      this.toastObj.show(this.toasts[2]);
      return;
    }
    //if (this.changePwdForm.invalid) {
    //  return;
    //}
    this.model.Email = this.LoginEmail;
    this.model.Password = this.f.Password.value;
    this.model.NewPassword = newPwd;
    this.model.ConfirmPassword = ConfirmPwd;

    if (this.AuthSource == 'Cognito') {
     
      Auth.currentAuthenticatedUser().then(user => {
        console.log(user);
        Auth.changePassword(user, this.model.Password, this.model.NewPassword).then(data => {
          this.AccountService.UpdateResetFlag(this.UserId, this.ProjectId).subscribe(data => {
            this.toastObj.timeOut = 3000;
            this.toasts[1].content = "Password updated successfully";
            this.toastObj.show(this.toasts[1]);
            setTimeout(() => { this.router.navigate(['/prelogin/PasswordConfirmation']); }, 3000);
          },
            (error: any) => {
              this.toastObj.timeOut = 3000;
              this.toasts[2].content = error.error["Message"];
              this.toastObj.show(this.toasts[2]);
            }
          );
        }).catch(e => {
          this.toastObj.timeOut = 3000;
          this.toasts[2].content = 'Old Password is incorrect';
          this.toastObj.show(this.toasts[2]);
        });

      })
      .catch (e => {
        this.toastObj.timeOut = 3000;
        this.toasts[2].content = e;
        this.toastObj.show(this.toasts[2]);
      });

      
    }
    else//means AD
    {
        this.AccountService.ChangePassword(this.model).subscribe(
         result => {
            if (result == true || result == 'true') {
            this.AccountService.LogUserActivity('ResetPassword', 'ResetPassword', true).subscribe(data => {
              this.toastObj.timeOut = 3000;
              this.toasts[1].content = "Password updated successfully";
              this.toastObj.show(this.toasts[1]);
              setTimeout(() => { this.router.navigate(['/prelogin/PasswordConfirmation']); }, 3000);
            },
              (error: any) => {
                this.toastObj.timeOut = 3000;
                this.toasts[2].content = error.error["Message"];
                this.toastObj.show(this.toasts[2]);
              }
            );
          }
          },
         (error: any) => {
          this.toastObj.timeOut = 3000;
          this.toasts[2].content = error.error["Message"];
          this.toastObj.show(this.toasts[2]);
        }
       );
    }
  }
  
}  
