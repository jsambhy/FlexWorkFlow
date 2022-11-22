import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ReorderService, ToolbarService, EditService, ExcelExportService, PdfExportService, ToolbarItems, GridComponent, SelectionSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { CountryModel } from '../../../models/country-model';
import { UserRoleViewModel } from '../../../models/loginModel';
import { UserService } from '../../../services/user.service';
import { AccountService } from '../../../services/auth';
import { LUser } from '../../../models/UserModel';
import { UserRoleTag, Tag } from '../../../models/UserRoleTagModel';
import { DomSanitizer } from '@angular/platform-browser';
import { SupportingDocumentService } from '../../../services/supporting-document.service';
import { environment } from '../../../../environments/environment';
import * as AWS from 'aws-sdk';
import { SelectEventArgs, TabComponent } from '@syncfusion/ej2-angular-navigations';
import { ProjectService } from '../../../services/project.service';
import { MasterDataService } from '../../../services/master-data.service';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { Auth } from 'aws-amplify';
import { Router } from '@angular/router';
import { EntityConfigurationService } from '../../../services/entity.configuration.service';
import { SendEmailModel } from '../../../models/SendEmailModel';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-user-common-controls',
  templateUrl: './user-common-controls.component.html',
  styleUrls: ['./user-common-controls.component.css'],
  providers: [ReorderService, ToolbarService, EditService, ExcelExportService, PdfExportService]
})
/** users component*/
export class UsersCommonControlsComponent {
  LoggedInScopeEntityId: number;
  LoggedInScopeEntityType: string;
  LoggedInRoleName: string;
  EntityName: string;
  toolbar: ToolbarItems[] | object;
  showPopup: boolean = false;
  showTagPopup: boolean = false;
  ShowCreateBtn: boolean = false;;
  ShowUpdateBtn: boolean = false;
  LoggedInUserId: number;
  LoggedInRoleId: number;
  DefaultLoggedInEntityName: string;
  ProjectId: number;
  SelectedRowId: number;
  UserForm: FormGroup = null;
  UserModel: LUser = new LUser();
  CountryList: CountryModel[];
  countryDropdownFields: Object = { text: 'CountryName', value: 'CountryCode' };
  UserRoleData: UserRoleViewModel[];
  UserRolefields: Object = { text: 'RoleName', value: 'Id' };
  UserTagData: any[];
  RoleData: any[];
  TagData: any[];
  UserTagField: Object = { text: 'Name', value: 'Id' };
  UserRoleTags: UserRoleTag[] = [];
  SelectedRoleId: number;
  selectionOptions: SelectionSettingsModel;
  selectionOptionsForTag: SelectionSettingsModel
  ConfirmationBoxMsg: string;
  confirmHeader: string = 'Confirm';
  confirmCloseIcon: Boolean = true;
  confirmWidth: string = '400px';
  isGroupColumnVisible: boolean = true;
  @Input() TransactionId: number;
  @Input() Source: string;
  ShowRoleGrid: boolean = true;
  showUserPopup: boolean;
  submitted: boolean = false;
  IsEdit: boolean = false;
  ImageMsg: string;
  headerText: Object = [{ text: "Users" }, { text: "Attributes" } , { text: "Attachments" }];
  IsRowSelectedRequired: boolean;
  DisableAttributetab: boolean = true;
  IsUserNameRequired: boolean;
  readonly AuthSource = environment.AuthSource;

  thumbnail: any;
  //s3Url: string = 'https://project-lite-staging-flex20200415095037299600000001.s3-eu-west-1.amazonaws.com/dev/users/images/namita.png';

  //These variables are using in Image Uploader
  showUploader: boolean = false;
  imagePath: string = "/users/images";//passing this to uploader
  AllowedFileTypes: string = ".png,.jpg,.jpeg";

  //Supporting Document Variables
  EntityType: string = "LUsers";//passing this variable in supporting Document selector
  EntityId: number;//passing this variable in supporting Document selector
  TargetPath: string = "/users/attachments";//passing this variable in supporting Document selector
  FormMode: string
  AttributeFormMode: string;
  Src: string = "Users";

  ProjectNamefields: Object = { text: 'Name', value: 'Id' };
  RoleTypefields: Object = { text: 'Name', value: 'Id' };

  public RoleTypeData: Object[];

  @Output() PostUserEvent = new EventEmitter();

  @ViewChild('RoleGrid', { static: false })
  public RoleGrid: GridComponent;

  @ViewChild('TagGrid', { static: false })
  public TagGrid: GridComponent;

  @ViewChild('isMFAreq', { static: false })
  public isMFAreq: CheckBoxComponent;

  @ViewChild('blockNotification', { static: false })
  public blockNotification: CheckBoxComponent;

  @ViewChild('toasttype', { static: false })
  private toastObj: ToastComponent;

  @ViewChild('TagDialog', { static: false })
  private TagDialog: DialogComponent;

  @ViewChild('UserTabs', { static: false })
  public UserTabs: TabComponent;

  @ViewChild('ProjectsNameList', { static: false }) private ProjectsNameList: DropDownListComponent;

  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };



  constructor(
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder, 
    private _service: UserService,
    private AccountService: AccountService,
    private sanitizer: DomSanitizer,
    private SupportDocService: SupportingDocumentService,
    private ProjectService: ProjectService,
    private MasterDataService: MasterDataService,
    public router: Router,
    private EntityConfigurationService: EntityConfigurationService
  )
  {
    this.LoggedInScopeEntityId = +sessionStorage.getItem('LoggedInScopeEntityId');
    this.LoggedInScopeEntityType = sessionStorage.getItem('LoggedInScopeEntityType');
    this.LoggedInRoleName = sessionStorage.getItem('LoggedInRoleName');
    this.LoggedInUserId = +sessionStorage.getItem("LoggedInUserId");
    this.LoggedInRoleId = +sessionStorage.getItem("LoggedInRoleId");
    this.ProjectId = +sessionStorage.getItem("ProjectId");
    this.DefaultLoggedInEntityName = sessionStorage.getItem('DefaultEntityName');


    this.UserForm = this.formBuilder.group({
      UserName: new FormControl(''),//, [Validators.required, Validators.maxLength(255)]),
      FirstName: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      LastName: new FormControl('', [Validators.maxLength(255)]),
      LoginEmail: new FormControl(''),// [Validators.required, Validators.email]),
      Status: new FormControl(''),
      IsMFARequired: new FormControl(''),
      BlockNotifications: new FormControl(''),
      AddressLine1: new FormControl(''),
      AddressLine2: new FormControl(''),
      City: new FormControl(''),
      State: new FormControl(''),
      PostalCode: new FormControl(''),
      CountryCode: new FormControl('', [Validators.required]),
      PhoneNumber: new FormControl(),
      EmpCode:new FormControl('', [Validators.maxLength(255)])
      //Prefix: new FormControl()
    });
  }



  ngOnInit() {
     
    this.EntityId = this.TransactionId;
    this.selectionOptions = { checkboxOnly: true };
    this.selectionOptionsForTag = { type: 'Multiple' };

    this.MasterDataService.GetReferencesByTypeAndProjectId('Users', this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
      .subscribe(
        data => {
          this.RoleTypeData = data;
        }
      );

    // this.RoleTypeData = [
    //   { text: 'Internal Users', value: 'InternalUsers' },
    //   { text: 'External Users', value: 'ExternalUsers' }
    //];

    this.IsRowSelectedRequired = true;//we will use this Flag in rowselected event
    this.AccountService.GetCountryList()
      .subscribe(
        data => {
          this.CountryList = data;
        }
      );

    this._service.GetRolesByEntityId(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
      .subscribe(
        data => {
          this.RoleData = data;
        }
      );


    this._service.GetAllTagsForUser(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
      .subscribe(
        data => {
           
          this.TagData = data;
        }
      );

    this.EntityConfigurationService.IsUserNameRequired(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
      .subscribe(
        data => {
          this.IsUserNameRequired = data;
          if (this.IsUserNameRequired == true) {
            this.UserForm.controls['UserName'].setValidators([Validators.required, Validators.maxLength(255)]);
          }
          else {

            this.UserForm.controls['LoginEmail'].setValidators([Validators.required, Validators.maxLength(255)]);
          }
        }
      );


    if (this.Source == 'GProjects') {
      this.ShowRoleGrid = false;
    }


    if (this.TransactionId == -1)//This is the case of Create user
    {

      this.ImageMsg = "Click here to upload the photo";
      this.ShowCreateBtn = true;
      this.ShowUpdateBtn = false;
      this.FormMode = "Create";
      this.UserForm.patchValue({
        IsMFARequired: false,
        BlockNotifications: false
      });

    }
    else//This is the case of Edit User
    {
      this.DisableAttributetab = false;
      this.ImageMsg = "Click here to upload or change the photo";
      this.FormMode = "Edit";
      this.ShowCreateBtn = false;
      this.ShowUpdateBtn = true;
      this.GetUserById(this.TransactionId);
    }



  }//end of ngOnInit



  GetUserById(UserId) {
     
    console.log('In GetUserById');
    this._service.GetById(UserId)
      .subscribe(
        data => {
          console.log(data);
          this.UserModel = data;
          this.UserRoleTags = data.UserRoleTags;//we are assigning this.UserRoleTags to model while updating data back to database
          this.showPopup = true;
          this.UserForm.patchValue({
            UserName: data.UserName,
            FirstName: data.FirstName,
            LastName: data.LastName,
            LoginEmail: data.LoginEmail,
            IsMFARequired: data.IsMFARequired,
            BlockNotifications: data.BlockNotification,
            AddressLine1: data.AddressLine1,
            AddressLine2: data.AddressLine2,
            City: data.City,
            State: data.State,
            PostalCode: data.PostalCode,
            CountryCode: data.CountryCode,
            PhoneNumber: data.PhoneNumber,
            EmpCode: data.EmpCode
          });

          //show image code
          if (data.Image != null) {
            this.IsEdit = true;
            this.IsImageShow = true;
            let objectURL = 'data:image/jpeg;base64,' + data.Image;
            this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          }

          //Now select the assigned Roles
          this.UserRoleTags = data.UserRoleTags;
          console.log('Edit' + this.UserRoleTags);
          this.ShowRoleGrid = true;
          this.ShowSelectedRoleRows(data.UserRoleTags);

        }
      );

  }


  //public roleCreated(args): void {
  //   
  //  console.log('outer roleCreated');
  //  console.log('userRoleTags' + this.UserRoleTags);
  //  if (this.UserRoleTags != null && this.UserRoleTags.length > 0)
  //  {
  //    console.log('inner roleCreated');
  //    this.ShowSelectedRoleRows(this.UserRoleTags);
  //  }
  //}


  get g() { return this.UserForm.controls; }


  public SelectedRowIndexs: number[] = [];

  //This function will preselect some rows in RoleGrid based on indexes
  ShowSelectedRoleRows(UserRoleTags) {
    console.log('in ShowSelectedRoleRows function');
    if (UserRoleTags.length != 0) {
      for (let i = 0; i < UserRoleTags.length; i++) {
        (this.RoleGrid.dataSource as object[]).forEach((sdata, index) => {
          if (sdata["Id"] === UserRoleTags[i]['RoleId']) {
            this.SelectedRowIndexs.push(index);
          }
        });
      }
      console.log(this.SelectedRowIndexs.length);
      this.IsRowSelectedRequired = false;

    }
    else {
      this.IsRowSelectedRequired = true;
    }

  }

  public dataBound(args): void {
     
    console.log('outer if databound');
    console.log(this.SelectedRowIndexs.length);
    if (this.SelectedRowIndexs.length > 0) {
      console.log('inner if databound');
      this.RoleGrid.selectRows(this.SelectedRowIndexs);
    }
  }

  SaveAndClose() {
    this.SaveUserData(true);
  }

  SaveUserOpenAttributes()
  {
    this.SaveUserData(false);
  }

  SaveUserData(IsClose) {
     
    this.submitted = true;
    if (this.UserForm.invalid) {
      return;
    }
    else
    {
      this.spinner.show();
      //Add Supporting Document in Model
      var SupportingDocuments = JSON.parse(sessionStorage.getItem("supportingDocumentList"));
      sessionStorage.removeItem("supportingDocumentList");
      if (SupportingDocuments != null) {
        this.UserModel.supportingDocuments = SupportingDocuments;
      }

      //Add uploaded image path to model
      var UploadedFileInfo = JSON.parse(sessionStorage.getItem("UploadedFile"));
      sessionStorage.removeItem("UploadedFileInfo");
      if (UploadedFileInfo != null) {
        this.UserModel.ImagePath = this.imagePath + "/" + UploadedFileInfo[0].FileName;//In case of Image uploading, only  one file is allowed thats why we are taking Filename from zeroth element
      }


      var PhoneNumber;
      if (this.g.PhoneNumber.value != null) {
        //PhoneNumber = this.g.Prefix.value + this.g.PhoneNumber.value;
        PhoneNumber = this.g.PhoneNumber.value;
      }
      else {
        PhoneNumber = null;
      }

      this.UserModel.UserName = this.UserForm.get('UserName').value;
      if (this.UserModel.UserName == null || this.UserModel.UserName == undefined || this.UserModel.UserName == '')
      {
        let Email = this.UserForm.get('LoginEmail').value;
        let Username = Email.replace('@', '(');
        Username = Username + ')';
        this.UserModel.UserName = Username;
      }
      this.UserModel.FirstName = this.UserForm.get('FirstName').value;
      this.UserModel.LastName = this.UserForm.get('LastName').value;
      this.UserModel.LoginEmail = this.UserForm.get('LoginEmail').value;
      this.UserModel.PhoneNumber = PhoneNumber;
      this.UserModel.Status = 'Active';
      this.UserModel.IsMFARequired = this.isMFAreq.checked;
      this.UserModel.BlockNotification = this.blockNotification.checked;
      this.UserModel.ChangePwdAtNextLogin = false;
      this.UserModel.IsPolicyAccepted = false;
      this.UserModel.CreatedById = this.LoggedInUserId;
      this.UserModel.UpdatedById = this.LoggedInUserId;
      this.UserModel.CreatedByRoleId = this.LoggedInRoleId;
      this.UserModel.UpdatedByRoleId = this.LoggedInRoleId;
      this.UserModel.CreatedDateTime = new Date();
      this.UserModel.UpdatedDateTime = new Date();
      this.UserModel.AddressLine1 = this.UserForm.get('AddressLine1').value;
      this.UserModel.AddressLine2 = this.UserForm.get('AddressLine2').value;
      this.UserModel.City = this.UserForm.get('City').value;
      this.UserModel.State = this.UserForm.get('State').value;
      this.UserModel.PostalCode = this.UserForm.get('PostalCode').value;
      this.UserModel.CountryCode = this.UserForm.get('CountryCode').value;
      this.UserModel.EmpCode = this.UserForm.get('EmpCode').value;

      if (this.UserRoleTags == null)
      {
        this.UserModel.UserRoleTags = null;
      }
      else
      {
        this.UserModel.UserRoleTags = this.UserRoleTags;
      }
      this.UserModel.ScopeEntityType = this.LoggedInScopeEntityType;
      this.UserModel.ScopeEntityId = this.LoggedInScopeEntityId;

      //Add data in database
      this._service.SaveUser(this.UserModel)
        .subscribe(
          data => {
            ///////////////////////////////////////////////////
            console.log(data);

            this.EntityId = data;
            if (this.EntityId == 0) {

              this.toasts[0].content = "User with the same email already exists.";
              this.toastObj.show(this.toasts[0]);
              this.spinner.hide();
            }

            else {


              let pwd = "";
              pwd = environment.Password;
              //We are commenting this code on temporary basis
              //We will uncomment this code once we start sending emails with Randam generated pwd in Prod
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

              //console.log(this.AuthSource);

              //Create User in Cognito Directory
              if (this.AuthSource == 'Cognito') {
                //user object for cognito signup
                var user = null;
                if (PhoneNumber == null || PhoneNumber == "" || PhoneNumber == undefined || PhoneNumber == '+91') {
                  user = {
                    username: this.UserModel.UserName,
                    password: pwd,
                    attributes: {
                      email: this.UserModel.LoginEmail
                    }
                  }

                }
                else if (this.UserModel.LoginEmail == null || this.UserModel.LoginEmail == "" || this.UserModel.LoginEmail == undefined) {

                  user = {
                    username: this.UserModel.UserName,
                    password: pwd,
                    attributes: {

                      phone_number: PhoneNumber

                    }
                  }
                }
                else if (this.UserModel.LoginEmail == null && PhoneNumber == null) {
                  user = {
                    username: this.UserModel.UserName,
                    password: pwd,

                  }

                }
                else {
                  user = {
                    username: this.UserModel.UserName,
                    password: pwd,
                    attributes: {
                      email: this.UserModel.LoginEmail,     // optional
                      phone_number: PhoneNumber  // optional - E.164 number convention

                    }
                  }

                }

                console.log('IsClose=');
                Auth.signUp(user)
                  .then(data => {
                    console.log(data);
                    this.SendUserCreationEmails(this.EntityId, pwd);

                    //ConfirmSignUp call
                    this.AfterUserSave(IsClose);

                  })
                  .catch(err => {
                    //this.DeleteUser(data); commented by rs as it is calling just after save method and deleting all the assigned roles
                  });
              }

              //Create User in Active Directory
              if (this.AuthSource == 'ActiveDirectory') {
                this.AccountService.CreateADUser(data)
                  .subscribe(
                    data => {
                      this.SendUserCreationEmails(this.EntityId, data);
                      this.AfterUserSave(IsClose);
                    },
                    (error: any) => {
                      console.log(error);
                      // this.DeleteUser(data); commented by rs as it is calling just after save method and deleting all the assigned roles

                    }
                  );

              }

              this.spinner.hide();
            }
          }

        );


      //  //Add data in database
      //  this._service.SaveUser(this.UserModel)
      //    .subscribe(
      //      data => {
      //        ///////////////////////////////////////////////////

      //        this.EntityId = data;

      //        let pwd = "";
      //        pwd = environment.Password;
      //        //We are commenting this code on temporary basis
      ////We will uncomment this code once we start sending emails with Randam generated pwd in Prod
      //        //if (environment.Env == 'dev' || environment.Env == 'Test') {
      //        //  pwd = environment.Password;
      //        //}
      //        //else {
      //        //  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      //        //  var string_length = 12;
      //        //  var randomstring = '';
      //        //  for (var i = 0; i < string_length; i++) {
      //        //    var rnum = Math.floor(Math.random() * chars.length);
      //        //    randomstring += chars.substring(rnum, rnum + 1);
      //        //  }
      //        //  pwd = randomstring;
      //        //}

      //        //Create User in Cognito Directory
      //        if (this.AuthSource == 'Cognito') {
      //          //user object for cognito signup
      //          var user = null;
      //          if (PhoneNumber == null || PhoneNumber == "" || PhoneNumber == undefined || PhoneNumber == '+91') {
      //            user = {
      //              username: this.UserModel.UserName,
      //              password: pwd,
      //              attributes: {
      //                email: this.UserModel.LoginEmail
      //              }
      //            }

      //          }
      //          else if (this.UserModel.LoginEmail == null || this.UserModel.LoginEmail == "" || this.UserModel.LoginEmail == undefined) {

      //            user = {
      //              username: this.UserModel.UserName,
      //              password: pwd,
      //              attributes: {

      //                phone_number: PhoneNumber

      //              }
      //            }
      //          }

      //          else if (this.UserModel.LoginEmail == null && PhoneNumber == null) {
      //            user = {
      //              username: this.UserModel.UserName,
      //              password: pwd,

      //            }

      //          }
      //          else {
      //            user = {
      //              username: this.UserModel.UserName,
      //              password: pwd,
      //              attributes: {
      //                email: this.UserModel.LoginEmail,     // optional
      //                phone_number: PhoneNumber  // optional - E.164 number convention

      //              }
      //            }

      //          }


      //          Auth.signUp(user)
      //            .then(data => {
      //              console.log(data);
      //              this.SendUserCreationEmails(this.EntityId, pwd);

      //              //ConfirmSignUp call
      //              this.AfterUserSave(IsClose);
      //            })
      //            .catch(err => {
      //              this.DeleteUser(data);
      //            });
      //        }

      //        //Create User in Active Directory
      //        if (this.AuthSource == 'ActiveDirectory') {
      //          this.AccountService.CreateADUser(data)
      //            .subscribe(
      //              data => {
      //                this.SendUserCreationEmails(this.EntityId, data);
      //                this.AfterUserSave(IsClose);
      //              },
      //              (error: any) => {
      //                console.log(error);
      //                this.DeleteUser(data);

      //              }
      //            );

      //        }

      //      }
      //    );
    }
  }

  DeleteUser(UserId) {
    this._service.DeleteUser(UserId)
      .subscribe(
        data => {
          this.toastObj.timeOut = 0;
          this.toasts[2].content = "There are some technical error. Kindly report the issue to the support Team.";
          this.toastObj.show(this.toasts[2]);
          //if (this.Source == undefined || this.Source == 'Users' || this.Source == '')//If user come here through User management screen, only then we will relaod the page
          //{
          //  setTimeout(() => { window.location.reload(); }, 3000);
          //}
        },

      );
  }

  AfterUserSave(IsClose) {
    this.toastObj.timeOut = 2000;
    console.log(IsClose);
    if (IsClose) {
      this.toasts[1].content = "User has been created successfully.";
      if (this.Source == undefined || this.Source == 'Users' || this.Source == '')//If user come here through User management screen, only then we will reload the page
      {
        //setTimeout(() => { window.location.reload(); }, 2000);
        this.showPopup = false;
        this.showUserPopup = false;
      }
      else {
        //This event will caught from where this component is called
        this.PostUserEvent.emit();

      }
      //setTimeout(() => { window.location.reload(); }, 2000);
    }
    else {
      this.toasts[1].content = "User has been created successfully. Now you can also enter attribute fields";
      //enabled attribute tab after saving User data
      this.DisableAttributetab = false;
      this.showPopup = false;
      this.showUserPopup = false;
      //This event will caught from where this component is called
      this.PostUserEvent.emit();
    }
    this.toastObj.show(this.toasts[1]);
  }



  EmailModel = new SendEmailModel();
  SendUserCreationEmails(UserId, Password) {
    this.EmailModel.UserId = UserId;
    this.EmailModel.Password = Password;
    this.EmailModel.Source = 'User';
    this.EmailModel.ProjectId = this.ProjectId;
    this.AccountService.SendUserCreationEmails(this.EmailModel)
      .subscribe(
        data => {

        });

  }

  UpdateUser() {
     
    this.submitted = true;
    if (this.UserForm.invalid) {
      return;
    }
    else
    {
      //Add Supporting Document in Model
      var SupportingDocuments = JSON.parse(sessionStorage.getItem("supportingDocumentList"));
      sessionStorage.removeItem("supportingDocumentList");
      if (SupportingDocuments != null) {
        this.UserModel.supportingDocuments = SupportingDocuments;
      }

      //Add uploaded image path to model
      var UploadedFileInfo = JSON.parse(sessionStorage.getItem("UploadedFile"));
      sessionStorage.removeItem("UploadedFileInfo");
      if (UploadedFileInfo != null) {
        this.UserModel.ImagePath = this.imagePath + "/" + UploadedFileInfo[0].FileName;//In case of Image uploading, only  one file is allowed thats why we are taking Filename from zeroth element
      }

      var PhoneNumber;
      if (this.g.PhoneNumber.value != null) {
        //PhoneNumber = this.g.Prefix.value + this.g.PhoneNumber.value;
        PhoneNumber = this.g.PhoneNumber.value;
      }
      else {
        PhoneNumber = null;
      }

      this.UserModel.UserName = this.UserForm.get('UserName').value;

      this.UserModel.UserName = this.UserForm.get('UserName').value;
      this.UserModel.FirstName = this.UserForm.get('FirstName').value;
      this.UserModel.LastName = this.UserForm.get('LastName').value;
      this.UserModel.LoginEmail = this.UserForm.get('LoginEmail').value;
      this.UserModel.PhoneNumber = PhoneNumber;
      this.UserModel.Status = 'Active';
      this.UserModel.IsMFARequired = this.isMFAreq.checked;
      this.UserModel.BlockNotification = this.blockNotification.checked;
      this.UserModel.ChangePwdAtNextLogin = false;
      this.UserModel.IsPolicyAccepted = true;
      this.UserModel.UpdatedById = this.LoggedInUserId;
      this.UserModel.UpdatedByRoleId = this.LoggedInRoleId;
      this.UserModel.UpdatedDateTime = new Date();
      this.UserModel.AddressLine1 = this.UserForm.get('AddressLine1').value;
      this.UserModel.AddressLine2 = this.UserForm.get('AddressLine2').value;
      this.UserModel.City = this.UserForm.get('City').value;
      this.UserModel.State = this.UserForm.get('State').value;
      this.UserModel.PostalCode = this.UserForm.get('PostalCode').value;
      this.UserModel.CountryCode = this.UserForm.get('CountryCode').value;
      this.UserModel.ScopeEntityType = this.LoggedInScopeEntityType;
      this.UserModel.ScopeEntityId = this.LoggedInScopeEntityId;
      //this.UserModel.UserRoleTags = this.UserRoleTags;
      this.UserModel.UserRoleTagJson = JSON.stringify(this.UserRoleTags);
      this.UserModel.EntityType = this.LoggedInScopeEntityType;
      this.UserModel.EntityId = this.LoggedInScopeEntityId;
      this.UserModel.Id = this.TransactionId;
      this.UserModel.EmpCode = this.UserForm.get('EmpCode').value;
      console.log(JSON.stringify(this.UserModel));
      //Add data in database
      this._service.UpdateUser(this.UserModel)
        .subscribe(
          data => {
            this.toastObj.timeOut = 2000;
            this.toasts[1].content = "User has been updated successfully";
            this.toastObj.show(this.toasts[1]);
            this.showPopup = false;
            setTimeout(() => { window.location.reload(); }, 2000);

          }
        );
    }

  }

  selectedTagIndexes: number[] = [];
  selectedRoleIdForTag: number;
  //This function is just to show the popup of Tags
  GetTagsByRole(RowDetails) {
     
    this.selectedRoleIdForTag = RowDetails.Id;
    let row = this.UserRoleTags.find(x => x.RoleId == this.selectedRoleIdForTag);
    if (row != undefined)
    {
      if (row.Tags != null) {
        for (let i = 0; i < row.Tags.length; i++) {
          for (let j = 0; j < this.TagData.length; j++) {
            if (row.Tags[i]['Id'] == this.TagData[j]['Id']) {
              this.selectedTagIndexes.push(j);
            }
          }

          //this.selectedTagIndexes.push(row.Tags);
        }
      }
      this.showTagPopup = true;
      //this.selectedTagIndexes = [0, 1];
    }
    else
    {
      this.toastObj.timeOut = 3000;
      this.toasts[3].content = "Before assigning Tags to this role, select the role";
      this.toastObj.show(this.toasts[3]);
    }
  }


  public TagdataBound(args): void {
    if (this.selectedTagIndexes.length) {
      //alert(this.selectedTagIndexes);
      this.TagGrid.selectRows(this.selectedTagIndexes);
      this.selectedTagIndexes = [];
    }
  }

  //will called on Row selection and push selected value in UserRoleTags array
  roleRowSelected(e) {
    //this.SelectedRoleId = e.data.Id;
    if (e.data.length > 0) {
      for (var i = 0; i < e.data.length; i++) {
        this.UserRoleTags.push({ RoleId: e.data[i].Id, Tags: null });
      }
      //var model = new UserRoleTag();
      //model.RoleId = this.SelectedRoleId;
      //model.Tags = null;
      //this.UserRoleTags.push(model);
    }

    //if (this.IsRowSelectedRequired && this.SelectedRoleId != undefined) {
    //  this.UserRoleTags.push({ RoleId: this.SelectedRoleId, Tags: null });
    //  //var model = new UserRoleTag();
    //  //model.RoleId = this.SelectedRoleId;
    //  //model.Tags = null;

    //  //this.UserRoleTags.push(model);
    //}
    else {
      this.IsRowSelectedRequired = true;
    }
  }

  //will called on Row unselection and remove selected value from UserRoleTags array
  roleRowDeSelected(e) {
     
    if (e.data.Id != undefined) {
      this.UserRoleTags = this.UserRoleTags.filter(x => x.RoleId != e.data.Id);
    }
  }

  SaveTagsForRole() {

     
    let ExistingRole = this.UserRoleTags.find(x => x.RoleId == this.selectedRoleIdForTag);

    //let selectedRole = this.RoleGrid.getSelectedRecords();
    let selectedTags = this.TagGrid.getSelectedRecords();
    let RoleTagObj: UserRoleTag = new UserRoleTag();
    RoleTagObj.RoleId = this.selectedRoleIdForTag;
    RoleTagObj.Tags = selectedTags;
    //let TagObjArray: Tag[];

    //for (let i = 0; i < selectedTags.length; i++) {
    //  let TagObj: Tag = new Tag();
    //  TagObj[i].TagId = selectedTags[i]['Id'];
    //  TagObj[i].UserRoleId = this.LoggedInRoleId;
    //  TagObjArray.push(TagObj);
    //  //RoleTagObj.Tags[i] = selectedTags[i]['Id'];
    //}
    //RoleTagObj.Tags = TagObjArray;
    if (ExistingRole != undefined) {
      let index = this.UserRoleTags.findIndex(x => x.RoleId == this.selectedRoleIdForTag);
      this.UserRoleTags[index] = RoleTagObj;
    }
    else {
      this.UserRoleTags.push(RoleTagObj);
    }

    this.TagDialog.hide();
  }

  //This function is used to just open the dialog box of uploader
  ImageUpload() {
    this.showUploader = true;
  }

  //This event will be called after uploading the file
  IsImageShow: boolean = false;
  PostUploadEvent() {
     

    var UploadedFileInfo = JSON.parse(sessionStorage.getItem("UploadedFile"));
    if (UploadedFileInfo != null) {
      var CompletePath = this.imagePath + "/" + UploadedFileInfo[0].FileName;
      this._service.GetImageFromS3(CompletePath)
        .subscribe(
          data => {
            this.IsImageShow = true;
            let objectURL = 'data:image/jpeg;base64,' + data;
            this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          }
        );
    }
  }


  ProjectDataSource: any;
  ShowAttributes: boolean = false;
  DynamicControlEntityType: string = 'LReferences';
  DynamicControlEntityId: number;
  SelectedProjectId: number;
  RefDataTransactionId: number;
  onTabSelect(args: SelectEventArgs) {
     
    if (args.selectedIndex == 1)//Attribute tab
    {
      if (this.LoggedInScopeEntityType == 'GProjects')
      {
        this.ProjectDataSource = [
          { "Name": this.DefaultLoggedInEntityName, "Id": this.ProjectId }

        ];
        this.ProjectsNameList.text = this.DefaultLoggedInEntityName;
      }
      else
      {
        this.ProjectService.GetProjectNamesByUserId(this.EntityId)
          .subscribe(
            data => {
              this.ProjectDataSource = data;

            });
      }

    }
  }

  public ProjectChange(args: any): void {
    this.SelectedProjectId = args.value;
  }

  public RoleTypeChange(args: any): void {
     
    this.ShowAttributes = false;
    let selectedRoleType = args.itemData.Name;

    this.DynamicControlEntityId = args.itemData.Id;

    //this.MasterDataService.GetRefIdbyNameAndType(args.itemData.text, "Users", this.SelectedProjectId)
    //  .subscribe(
    //    data => {
    //      //This is the id of Reference against Type(Internal Users,External Users).If Type is Users
    //      this.DynamicControlEntityId = data;



    //Get LreferenceDataIdByUserId, it will decide that attribute tab will open in Create Mode or Edit mode
    this.ShowAttributes = true;

    //this.MasterDataService.GetRefDataIdByEntity(this.EntityType, this.EntityId, this.SelectedProjectId)
    //  .subscribe(
    //    data => {
    //      if (data == -1) {
    //        this.AttributeFormMode = "Create";
    //      }
    //      else {
    //        this.AttributeFormMode = "Edit";
    //      }
    //      this.RefDataTransactionId = data;
    //      this.ShowAttributes = true;
    //    });

    // });
  }

  public CountryChange(args: any): void {
    let PhoneCode = args.itemData.PhoneCode;
    this.UserForm.patchValue({
      PhoneNumber: PhoneCode,
    });

  }
}
