import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder,FormGroup ,FormControl,Validators} from '@angular/forms';
import { AccountService } from '../../services/auth';
import { CountryModel } from '../../models/country-model';
import { SignUpModel } from '../../models/sign-up-model';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { environment } from '../../../environments/environment';
import { Auth } from 'aws-amplify';
import { SendEmailModel } from '../../models/SendEmailModel';
import { Title } from '@angular/platform-browser';



@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.scss']
})
export class FrontComponent implements OnInit {
  readonly AuthSource = environment.AuthSource;
  CountryList: any[];
  //CountryList: CountryModel[];
  public countryDropdownFields: Object = { text: 'CountryName', value: 'CountryCode' };
  SignUpForm: FormGroup = null;
  SignUpModel: SignUpModel = new SignUpModel();
  Env: string;

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

  @ViewChild('prefix', { static: false }) public prefix: TextBoxComponent;

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
  constructor(private formBuilder: FormBuilder, public router: Router, private _AccountService: AccountService,
    private titleService: Title  ) {
    //clear out all session as sometime user might hit front page without logout which won't clear session
    sessionStorage.clear();
    this.titleService.setTitle('FlexWF');
    this.SignUpForm = this.formBuilder.group({
      FirstName: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      LastName: new FormControl('', [Validators.maxLength(255)]),
      LoginEmail: new FormControl('', [Validators.required, Validators.email]),
      Company: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      //PhoneNumber: new FormControl('', [Validators.pattern("^[+][(][0-9]*[)][.][0-9]*$")]),
      PhoneNumber: new FormControl(),
      Prefix: new FormControl(),
      JobTitle: new FormControl(),
      Country: new FormControl('', [Validators.required])
    });
   }

  ngOnInit() {

    this.CountryList = [
      { "CountryName": "United States of America (the)", "CountryCode": "USA", "PhoneCode": "+1" },
      { "CountryName": "Singapore", "CountryCode": "SGP", "PhoneCode": "+65" },
      { "CountryName": "New Zealand", "CountryCode": "NZL", "PhoneCode": "+64" },
      { "CountryName": "Japan", "CountryCode": "JPN", "PhoneCode": "+81" },
      { "CountryName": "Italy", "CountryCode": "ITA", "PhoneCode": "+39" },
      { "CountryName": "Israel", "CountryCode": "ISR", "PhoneCode": "+972" },
      { "CountryName": "Ireland", "CountryCode": "IRL", "PhoneCode": "+353" },
      { "CountryName": "India", "CountryCode": "IND", "PhoneCode": "+91" },
      { "CountryName": "Greece", "CountryCode": "GRC", "PhoneCode": "+30" },
      { "CountryName": "Germany", "CountryCode": "DEU", "PhoneCode": "+49" },
      { "CountryName": "France", "CountryCode": "FRA", "PhoneCode": "+33" },
      { "CountryName": "Australia", "CountryCode": "AUS", "PhoneCode": "+61" }
    ]

    this._AccountService.GetSystemProjectId()
      .subscribe(
        SystemProjectId => {
          this._AccountService.GetValueFromGKeyValues('ProjectEnviournment', SystemProjectId)
            .subscribe(
              Env => {
                this.Env = Env;
              }
            );
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

  ProjectId: any;
  signUpUser() {
   
    
    this.submitted = true;
    if (this.SignUpForm.invalid) {
      return;
    }
    let PhoneNumber;
    if (this.g.PhoneNumber.value != null) {
      PhoneNumber = this.g.Prefix.value + this.g.PhoneNumber.value;
    }
    else {
      PhoneNumber = null;
    }
    this.SignUpModel.FirstName = this.g.FirstName.value;
    this.SignUpModel.LastName = this.g.LastName.value;
    this.SignUpModel.LoginEmail = this.g.LoginEmail.value;
    this.SignUpModel.CompanyName = this.g.Company.value;
    this.SignUpModel.JobTitle = this.g.JobTitle.value;
    this.SignUpModel.PhoneNumber = PhoneNumber;
    this.SignUpModel.CountryName = this.g.Country.value;
   // let Username = this.g.LoginEmail.value.split('@')[0];//TEMP: splitting on @ since our userpool does not consider email address as username
    let Email = this.g.LoginEmail.value;
    let Username = Email.replace('@', '(');
    Username = Username + ')';

    this.SignUpModel.UserName = Username;

    let pwd = "";
    pwd = environment.Password;
   
    //We are commenting this code on temporary basis
    //We will uncomment this code once we start sending emails with Randam generated pwd in Prod
    //Use this.Env variable
    //if (environment.Env == 'dev' || environment.Env == 'Test') {
    //  pwd = environment.Password;
    //}
    //else {
    //  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    //  var string_length = 12;
    //  var randomstring = '';
    //  for (var i = 0; i < string_length; i++) {
    //    var rnum = Math.floor(Math.random() * chars.length);
    //    randomstring += chars.substring(rnum, rnum + 1);
    //  }
    //  pwd = randomstring;
    //}
   
    
    if (this.SignUpModel.CompanyName == "system@flexwf.com") {
      this.toastObj.timeOut = 0;
      this.toasts[2].content = "This company name is for system use. Can not be used here";
      this.toastObj.show(this.toasts[2]);

    }
    else {


      this._AccountService.SignUpUser(this.SignUpModel)
        .subscribe(
          data => {
           
            this.SignUpModel.Id = (data).split('^')[0];
            this.ProjectId = data.split('^')[1];
            //After creating User in Database, Now create user in Cognito/AD, depend on AuthSource

            //Create User in Cognito Directory
            if (this.AuthSource == 'Cognito') {
              //user object for cognito signup
              var user=null;
              if (PhoneNumber == null || PhoneNumber == "" || PhoneNumber == undefined) {
                user = {
                  username: Username,
                  password: pwd,
                  attributes: {
                    email: Email       
                  }
                }

              }
              else if (Email == null || Email == "" || Email == undefined) {

                user = {
                  username: Username,
                  password: pwd,
                  attributes: {
                 
                    phone_number: PhoneNumber 

                  }
                }
              }

              else if (Email == null && PhoneNumber == null) {
                user = {
                  username: Username,
                  password: pwd,

                }

              }
              else {
                user = {
                  username: Username,
                  password: pwd,
                  attributes: {
                    email: Email  ,     // optional
                    phone_number: PhoneNumber  // optional - E.164 number convention

                  }
                }

              }
            

              Auth.signUp(user)
                .then(data => {
                  console.log(data);

                  //Send Mails
                  this.SendUserCreationEmails(this.SignUpModel.Id, pwd);

                  //ConfirmSignUp call
                  this.toastObj.timeOut = 3000;
                  this.toasts[1].content = "User Register successfully. Please SignIn";
                  this.toastObj.show(this.toasts[1]);
                  setTimeout(() => { this.router.navigate(['/login']); }, 3000);
                })
                .catch(err => {
                  this.DeleteSignUpUser(this.SignUpModel.Id, this.ProjectId);
                });
            }

            //Create User in Active Directory
            if (this.AuthSource == 'ActiveDirectory') {
              this._AccountService.CreateADUser(this.SignUpModel.Id)
                .subscribe(
                  data => {

                     //Send Mails
                    this.SendUserCreationEmails(this.SignUpModel.Id, data);

                    this.toastObj.timeOut = 3000;
                    this.toasts[1].content = "User Register successfully. Please SignIn";
                    this.toastObj.show(this.toasts[1]);
                    setTimeout(() => { this.router.navigate(['/login']); }, 3000);
                  },
                  (error: any) => {
                    this.DeleteSignUpUser(this.SignUpModel.Id, this.ProjectId);
                   
                  }
                );
             
            }


            
          },
          (error: any) => {
            
            this.toastObj.timeOut = 0;
            this.toasts[2].content = error.error.Message;
            this.toastObj.show(this.toasts[2]);
          }
        );
     
    }
  }

  DeleteSignUpUser(UserId, ProjectId) {
    this._AccountService.DeleteSignUpUser(UserId, ProjectId)
      .subscribe(
        data => {
         
        });

  }


  EmailModel = new SendEmailModel();
  SendUserCreationEmails(UserId, Password) {
    this.EmailModel.UserId = UserId;
    this.EmailModel.Password = Password;
    this.EmailModel.Source = 'SignUp';
    this.EmailModel.ProjectId = this.ProjectId;
    this._AccountService.SendUserCreationEmails(this.EmailModel)
      .subscribe(
        data => {

        });

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


  public CountryChange(args: any): void {
    let PhoneCode = args.itemData.PhoneCode;
    this.SignUpForm.patchValue({
      Prefix: PhoneCode,
    });
    
  }
}
