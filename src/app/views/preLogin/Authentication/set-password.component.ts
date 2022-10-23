import { ViewChild, Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AccountService } from '../../../services/auth';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { ChangePasswordModel } from '../../../models/loginModel';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Auth } from 'aws-amplify';
import { environment } from '../../../../environments/environment';
@Component({
  templateUrl: './set-password.component.html',
})
export class SetPasswordComponent implements OnInit {
  readonly AuthSource = environment.AuthSource;
  loggedInUserId: string;
  returnUrl: string;
  Email: string;
  OTPValidity: string = '30';

  model: ChangePasswordModel = new ChangePasswordModel();
  setPwdForm: FormGroup;
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
    private formBuilder: FormBuilder,
    private router: Router,
    private AccountService: AccountService,
    private route: ActivatedRoute
  ) {
    this.setPwdForm = this.formBuilder.group({
      OTP: ['', Validators.required],
      NewPassword: ['', Validators.required],
      ConfirmPassword: ['', Validators.required]
    });
    //getting the id from the url
    this.route.params.subscribe((params: Params) => {
      this.loggedInUserId = params['UserId'];
      this.Email = params['Email'];
    });
    this.returnUrl = "/dashboard";
  }

  ngOnInit() {
    this.setPwdForm.patchValue({
      OTP: null,
      NewPassword: null,
      ConfirmPassword:null
    })
  }
  passwordIsValid = false;
  passwordValid(event) {
    this.passwordIsValid = event;
  }


  // convenience getter for easy access to form fields  
  get f() { return this.setPwdForm.controls; }

  OTPStatus: string;
  VerifyOtp(Otp) {
    this.AccountService.VerifyOTP(Otp, this.loggedInUserId)
      .subscribe(result => {
        this.OTPStatus = "Verified";
      },
        (error: any) => {
          this.OTPStatus = error.error["Message"];
         
        })
  }

  UpdatePassword() {
    var OTP = this.setPwdForm.controls.OTP.value;
    if (this.AuthSource == 'Cognito') {
      var Pwd = this.setPwdForm.controls.NewPassword.value;
      Auth.forgotPasswordSubmit(this.Email, OTP, Pwd)
        .then(data => {
          this.toastObj.timeOut = 3000;
          this.toasts[1].content = "Password updated successfully";
          this.toastObj.show(this.toasts[1]);
          setTimeout(() => { this.router.navigate(['/prelogin/PasswordConfirmation']); }, 3000);

        })
        .catch(err => {
          this.toastObj.timeOut = 0;
          this.toasts[2].content = err;
          this.toastObj.show(this.toasts[2]);
        });
    }
    else {//AD
      //Verify OTP first
      this.VerifyOtp(OTP);
      if (this.OTPStatus == "Verified") {


        let model: ChangePasswordModel = new ChangePasswordModel();
        model.NewPassword = this.setPwdForm.controls.NewPassword.value;
        model.Email = this.Email;


        this.AccountService.ChangePassword(model)
          .subscribe(result => {
            if (result) {
              this.AccountService.LogUserActivity('SetPassword', 'SetPassword', true).subscribe(data => {
                console.log("Password updated");
                this.toastObj.timeOut = 3000;
                this.toasts[1].content = "Password updated successfully";
                this.toastObj.show(this.toasts[1]);
                setTimeout(() => { this.router.navigate(['/prelogin/PasswordConfirmation']); }, 3000);
              },
                (error: any) => {
                  this.toastObj.timeOut = 0;
                  this.toasts[2].content = error.error["Message"];
                  this.toastObj.show(this.toasts[2]);
                })
            }
          })
      }
      else {
        this.toastObj.timeOut = 0;
        this.toasts[2].content = this.OTPStatus;
        this.toastObj.show(this.toasts[2]);
        setTimeout(() => { this.router.navigate(['']); }, 0);
      }
    }
  }
}

