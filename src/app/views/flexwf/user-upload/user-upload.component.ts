import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';

@Component({
    selector: 'app-user-upload',
    templateUrl: './user-upload.component.html',
    styleUrls: ['./user-upload.component.css']
})
/** User-Upload component*/
export class UserUploadComponent {
  showUploader: Boolean = false;
  ProjectId: number;
  public loggedInUserId: number;
  public loggedInRoleId: number;
  uploadPath = "/users/uploads"

  @ViewChild('toasttype', { static: false })
  private toastObj: ToastComponent;
  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };


  constructor(private route: ActivatedRoute, private router: Router,
    private _userService: UserService) {
    this.ProjectId = +sessionStorage.getItem("ProjectId");
    this.loggedInUserId = +sessionStorage.getItem("LoggedInUserId");
    this.loggedInRoleId = +sessionStorage.getItem("LoggedInRoleId");
    }

  OpenUploader() {
    sessionStorage.removeItem("UploadedFile");
    this.showUploader = true;
  }

  //This event will be called after uploading the file
  PostUploadEvent(event) {
    console.log(this.uploadPath);
    var UploadedFileInfo = JSON.parse(sessionStorage.getItem("UploadedFile"));
    if (UploadedFileInfo != null) {
      this._userService.ReadAndValidateUserExcel(UploadedFileInfo[0]['FileName'],
        this.ProjectId, this.loggedInUserId, this.loggedInRoleId)
        .subscribe(data => {
          //get Transaction status here
        },
          (error: any) => {
            this.toastObj.timeOut = 3000;
            this.toasts[2].content = error.error["Message"];
            this.toastObj.show(this.toasts[2]);
          });
    }
  }

}
