import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder,FormGroup ,FormControl,Validators} from '@angular/forms';
import { AccountService } from '../../services/auth';
import { CountryModel } from '../../models/country-model';
import { SignUpModel } from '../../models/sign-up-model';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';



@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.scss']
})
export class FrontComponent implements OnInit {
  CountryList: CountryModel[];
  public countryDropdownFields: Object = { text: 'CountryName', value: 'CountryCode' };
  SignUpForm: FormGroup = null;
  SignUpModel: SignUpModel = new SignUpModel();

  submitted = false;
  @ViewChild('toasttype', { static: false })
  private toastObj: ToastComponent;
  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: '', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: '', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: '', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: '', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };

 customOptions: any = {
      loop: true,
      mouseDrag: false,
      touchDrag: false,
      pullDrag: false,
      dots: false,
      navSpeed: 700,
      navText: ['', ''],
      responsive: {
        0: {
          items: 1
        },
        400: {
          items: 2
        },
        740: {
          items: 3
        },
        940: {
          items: 4
        }
      },
      nav: true
    }
  

  
  submit_initialized=0;
  constructor(private formBuilder: FormBuilder, public router: Router, private _AccountService: AccountService) {
    this.SignUpForm = this.formBuilder.group({
      FirstName: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      LastName: new FormControl('', [Validators.maxLength(255)]),
      LoginEmail: new FormControl('', [Validators.required, Validators.email]),
      Company: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      PhoneNumber: new FormControl(),
      JobTitle: new FormControl(),
      Country: new FormControl('', [Validators.required])
    });
   }

  ngOnInit() {
    
    this._AccountService.GetCountryList()
      .subscribe(
        CountryList => {
          this.CountryList = CountryList;
          
        }
      );
  }

  LoginPage() {
    this.router.navigate(['login']);
  }

  ContactUs() {
    this.router.navigate(['contactus']);
  }

  get g() { return this.SignUpForm.controls; }

  signUpUser() {
    
    this.submitted = true;
    if (this.SignUpForm.invalid) {
      return;
    }
    this.SignUpModel.FirstName = this.g.FirstName.value;
    this.SignUpModel.LastName = this.g.LastName.value;
    this.SignUpModel.LoginEmail = this.g.LoginEmail.value;
    this.SignUpModel.CompanyName = this.g.Company.value;
    this.SignUpModel.JobTitle = this.g.JobTitle.value;
    this.SignUpModel.PhoneNumber = this.g.PhoneNumber.value;
    this.SignUpModel.CountryName = this.g.Country.value;

    if (this.SignUpModel.CompanyName == "system@flexwf.com") {
      this.toastObj.timeOut = 0;
      this.toasts[2].content = "This company name is for system use. Can not be used here";
      this.toastObj.show(this.toasts[2]);

    }
    else {
      this._AccountService.SignUpUser(this.SignUpModel)
        .subscribe(
          data => {
            
            this.toastObj.timeOut = 3000;
            this.toasts[1].content = "User Register successfully. Please SignIn";
            this.toastObj.show(this.toasts[1]);
            setTimeout(() => { window.location.reload(); }, 3000);
          },
          (error: any) => {
            
            this.toastObj.timeOut = 0;
            this.toasts[2].content = error.error.Message;
            this.toastObj.show(this.toasts[2]);
          }
        );
    }
  }

  RequestDemo()
  {
    this.SignUpModel.FirstName = this.g.FirstName.value;
    this.SignUpModel.LastName = this.g.LastName.value;
    this.SignUpModel.LoginEmail = this.g.LoginEmail.value;
    this.SignUpModel.CompanyName = this.g.Company.value;
    this.SignUpModel.JobTitle = this.g.JobTitle.value;
    this.SignUpModel.PhoneNumber = this.g.PhoneNumber.value;
    this.SignUpModel.CountryName = this.g.Country.value;

    this._AccountService.RequestDemo(this.SignUpModel)
      .subscribe(
        data => {
          this.toastObj.timeOut = 3000;
          this.toasts[1].content = "Demo request has been registered successfully. Soon you will get call from FlexWF Team.";
          this.toastObj.show(this.toasts[1]);
          setTimeout(() => { window.location.reload(); }, 3000);
        }
      );
  }



}
