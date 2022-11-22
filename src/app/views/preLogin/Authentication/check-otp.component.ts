import { ViewChild,Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AccountService } from '../../../services/auth';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
@Component({
  templateUrl: './check-otp.component.html',
})
export class CheckOTPComponent implements OnInit  {
  loggedInUserId: string;
  returnUrl: string;
  Email: string;
  OTPValidity: string = '30';
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
    private router: Router,
    private AccountService: AccountService,
    private route: ActivatedRoute
  ) {
    //'CheckOtp/:Email:/:UserId'
    //getting the id from the url
    this.route.params.subscribe((params: Params) => {
      this.loggedInUserId = params['UserId'];
      this.Email = params['Email'];
    });
    this.returnUrl = "/dashboard";
  }

  ngOnInit() {
   
  }

  VerifyOtp(Otp) {
    this.AccountService.VerifyOTP(Otp,   this.loggedInUserId)
      .subscribe(result => {
        this.router.navigate(['/prelogin/SetPassword', this.Email, this.loggedInUserId]);
      },
        (error: any) => {
          this.toastObj.timeOut = 0;
          this.toasts[2].content = error.error["Message"];
          this.toastObj.show(this.toasts[2]);
        })
  }

}

