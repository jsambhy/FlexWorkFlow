import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastPositionModel, ToastComponent } from '@syncfusion/ej2-angular-notifications';
import { Auth } from 'aws-amplify';

@Component({
    selector: 'app-create-cognito-user',
    templateUrl: './create-cognito-user.component.html',
    styleUrls: ['./create-cognito-user.component.css']
})
/** CreateCognitoUser component*/
export class CreateCognitoUserComponent {
  CognitoUserForm: FormGroup = null;
  submitted: Boolean = false;
  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };


  @ViewChild('toasttype', { static: false })
  private toastObj: ToastComponent;


  constructor(private formBuilder: FormBuilder) {
    this.CognitoUserForm = this.formBuilder.group({
      UserName: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      Email: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      PhoneNumber: new FormControl(''),
      Password: new FormControl('', [Validators.required, Validators.maxLength(8)])
      });
  }

  get f() { return this.CognitoUserForm.controls; }

  Save() {
    
    var UserName = this.CognitoUserForm.get('UserName').value;
    var Email = this.CognitoUserForm.get('Email').value;
    var PhoneNumber = this.CognitoUserForm.get('PhoneNumber').value;
    var Password = this.CognitoUserForm.get('Password').value;
    const user = {
      username: UserName,
      password: Password,
      attributes: {
        email: Email,          // optional
        phone_number: PhoneNumber,   // optional - E.164 number convention

      }

    }

    

    Auth.signUp(user)
      .then(data => {
        console.log(data);
        //ConfirmSignUp call

        this.toastObj.timeOut = 3000;
        this.toasts[1].content = "User Created successfully in Cognito.";
        this.toastObj.show(this.toasts[1]);
        window.location.reload();
      })
      .catch(err => {
        this.toastObj.timeOut = 0;
        this.toasts[2].content = err;
        this.toastObj.show(this.toasts[0]);
        
      });
  }

}
