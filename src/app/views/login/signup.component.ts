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
@Component({
  selector: 'app-signup',
  templateUrl: 'signup.component.html'
})
export class SignUpComponent {
  readonly baseUrl = environment.baseUrl;
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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _AccountService: AccountService
  ) {
    this.SignUpForm = this.formBuilder.group({
      FirstName: new FormControl('', [Validators.required, Validators.minLength(255)]),
      LastName: new FormControl('', [Validators.minLength(255)]),
      LoginEmail: new FormControl('', [Validators.required, Validators.email]),
      Company: new FormControl('', [Validators.required, Validators.minLength(255)]),
      PhoneNumber: new FormControl(),
      JobTitle: new FormControl(),
      Country: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    
    this._AccountService.GetCountryList()
      .subscribe(
        data => {
          this.CountryList = data;
        }
      );
  }

  get g() { return this.SignUpForm.controls; }

  signUpUser() {
    
    this.SignUpModel.FirstName = this.g.FirstName.value;
    this.SignUpModel.LastName = this.g.LastName.value;
    this.SignUpModel.LoginEmail = this.g.LoginEmail.value;
    this.SignUpModel.CompanyName = this.g.Company.value;
    this.SignUpModel.JobTitle = this.g.JobTitle.value;
    this.SignUpModel.PhoneNumber = this.g.PhoneNumber.value;
    this.SignUpModel.CountryName = this.g.Country.value;

    this._AccountService.SignUpUser(this.SignUpModel)
      .subscribe(
        data => {
          this.toastObj.timeOut = 3000;
          this.toasts[1].content = "User Register successfully";
          this.toastObj.show(this.toasts[1]);
          setTimeout(() => { this.router.navigate(['login']); }, 3000);
        }
      );
  }
}
