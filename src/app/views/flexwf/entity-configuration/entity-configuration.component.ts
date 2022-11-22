import { Component, ViewChild } from '@angular/core';
import { ToolbarService, EditService, ExcelExportService, PdfExportService, ToolbarItems, GridComponent } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { ButtonPropsModel, DialogComponent } from '@syncfusion/ej2-angular-popups';
import { MultiSelectComponent } from '@syncfusion/ej2-angular-dropdowns';
import { CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';
import { NodeSelection, RichTextEditorComponent, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';
import { CountryModel } from '../../../models/country-model';
import { LUser } from '../../../models/UserModel';
import { AccountService } from '../../../services/auth';
import { GProject } from '../../../models/project-model';
import { ProjectService } from '../../../services/project.service';
import { DomSanitizer } from '@angular/platform-browser';
import { EntityModel } from '../../../models/entity.model';
import { EntityConfigurationService } from '../../../services/entity.configuration.service';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-entity-configuration',
    templateUrl: './entity-configuration.component.html',
  styleUrls: ['./entity-configuration.component.css'],
  providers: [ExcelExportService, PdfExportService]
})
/** entity-configuration component*/
export class EntityConfigurationComponent {
  LoggedInScopeEntityId: number;
  LoggedInScopeEntityType: string;
  LoggedInRoleName: string;
  EntityName: string;
  CompanyId: number;
  ApplicationId: number;
  GroupId: number;
  GridDataSource: GProject[];
  toolbar: ToolbarItems[] | object;
  showPopup: boolean = false;
  ShowCreateBtn: boolean = false;
  IsEdit: boolean = false;
  ShowUpdateBtn: boolean = false;
  showUserPopup: boolean = false;
  EntityForm: FormGroup = null;
  EntityModel: EntityModel = new EntityModel();
  LoggedInUserId: number;
  LoggedInRoleId: number;
  SelectedRowId: number;
  ConfirmationBoxMsg: string;
  InActiveFlag: boolean = false;
  confirmHeader: string = 'Confirm';
  confirmCloseIcon: Boolean = true;
  CountryList: CountryModel[];
  countryDropdownFields: Object = { text: 'CountryName', value: 'CountryCode' };
  adminDataSource: any[];
  value: number[] = new Array();
  PreSelectedUserList: any[] = new Array();
  FileTypeList: any[] = new Array();
  PreSelectedFileTypeList: string[];
  UserForm: FormGroup = null;
  UserModel: LUser = new LUser();
  TransactionId: number = -1;//In case of create
  Source: string;
  hidden: boolean = false;
  locale: string;
  AllowedFileTypesSource: any[];
  AllowedTypes: string = ".png,.jpg,.jpeg";
  thumbnail: any;
  // maps the appropriate column to fields property
  public fields: Object = { text: 'LoginEmail', value: 'EntityUserId' };
  public fileTypesFields: Object = { text: 'Extension', value: 'ID' };


  constructor(private formBuilder: FormBuilder, private _service: EntityConfigurationService,
    private AccountService: AccountService, private sanitizer: DomSanitizer, private _UserService: UserService) {
    this.EntityForm = this.formBuilder.group({
      Name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      LogoPath: new FormControl(''),
      PunchLine: new FormControl(''),
      Description: new FormControl(''),
      LoginPolicy: new FormControl(''),
      Country: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      AllowedFileTypes: new FormControl(''),
      Admin: new FormControl(''),
      AddressLine1: new FormControl(''),
      AddressLine2: new FormControl(''),
      City: new FormControl(''),
      State: new FormControl(''),
      PostalCode: new FormControl(''),
    });

  }

  @ViewChild('toasttype', { static: false })
  private toastObj: ToastComponent;
  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };

  @ViewChild('entitygrid', { static: false })
  public entitygrid: GridComponent;

  @ViewChild('confirmDialog', { static: false })
  public confirmDialog: DialogComponent;

  @ViewChild('adminList', { static: false })
  public adminList: MultiSelectComponent;

  @ViewChild('AllowedFileTypes', { static: false })
  public AllowedFileTypes: MultiSelectComponent;

  @ViewChild('isMFAreq', { static: false })
  public isMFAreq: CheckBoxComponent;

  @ViewChild('blockNotification', { static: false })
  public blockNotification: CheckBoxComponent;


  @ViewChild('EntityDialog', { static: false })
  public EntityDialog: DialogComponent;

  @ViewChild('customRTE', { static: false })
  public rteObj: RichTextEditorComponent;

  //tools for the Rich Text editor
  documentEditorToolbarSettings = {
    enableFloating: true, //by this the tollbar gets separated into multiple rows
    items: [
      "Bold",
      "Italic",
      "Underline",
      "StrikeThrough",
      "|",
      "Formats",
      "FontName",
      "FontSize",
      "FontColor",
      "BackgroundColor",
      "|",
      "Alignments",
      "OrderedList",
      "UnorderedList",
      "|",
      "Undo",
      "Redo",
      "ClearFormat",
      "|",
      "CreateLink",
      "CreateTable",
      "|",
      "Print",
      "|",
      "Outdent",
      "Indent",
      "|",
      "SuperScript",
      "SubScript",
      "|",
      "UpperCase",
      "LowerCase",
      "|",
      "FullScreen",
      {
        tooltipText: 'Select placeholder value',
        template: '<input type="text" id="dropdown" />'
      }//custom tool (dropdown) we are defining here
    ]
  };

  public selection: NodeSelection = new NodeSelection();
  public iframe: object = { enable: false };
  public range: Range;
  public customBtn: HTMLElement;
  public dialogCtn: HTMLElement;
  public saveSelection: NodeSelection;

  Title: string;
  DialogHeader: string;
  EntityType: string;

  ngOnInit() {

    this.locale = Intl.DateTimeFormat().resolvedOptions().locale;
    this.toolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add', align: 'Left' }, { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit', align: 'Left' }, { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete', align: 'Left' }, 'ExcelExport', 'PdfExport', 'CsvExport', 'Search'];
    this.LoggedInScopeEntityId = +sessionStorage.getItem('LoggedInScopeEntityId');
    this.LoggedInScopeEntityType = sessionStorage.getItem('LoggedInScopeEntityType');
    this.LoggedInRoleName = sessionStorage.getItem('LoggedInRoleName');
    this.LoggedInUserId = +sessionStorage.getItem("LoggedInUserId");
    this.LoggedInRoleId = +sessionStorage.getItem("LoggedInRoleId");

    let index = this.LoggedInRoleName.indexOf("(");
    this.EntityName = this.LoggedInRoleName.substring(index + 1, this.LoggedInRoleName.length - 1)

    if (this.LoggedInScopeEntityType == "GCompanies") {
      this.CompanyId = this.LoggedInScopeEntityId;
      this.Title = 'Manage Projects for Company: ' + this.EntityName;
      this.EntityType = "GProjects";
    }
    else if (this.LoggedInScopeEntityType == "GGroups") {
      this.GroupId = this.LoggedInScopeEntityId;
      this.Title = 'Manage Companies for Group: ' + this.EntityName;
      this.EntityType = "GCompanies";
    }
    else//this.LoggedInScopeEntityType == "GApplication"
    {
      this.ApplicationId = this.LoggedInScopeEntityId;
      this.Title = 'Manage Groups for Application: ' + this.EntityName;
      this.EntityType = "GGroups";
    }

    
    //Getting ProjectList based on Loggedin Company
    this._service.GetDataByLoggedInEntity(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
      .subscribe(
        EntityData => {
          this.GridDataSource = (EntityData);
        }
      );

    //Getting all country list
    this.AccountService.GetCountryList()
      .subscribe(
        CountrydataList => {
          this.CountryList = CountrydataList;
        }
      );

    //Getting ProjectList based on Loggedin Company
    this._service.getFileExtensions()
      .subscribe(
        FileExtensions => {
          this.AllowedFileTypesSource = (FileExtensions);
          console.log(this.AllowedFileTypesSource);
        }
      );

    //Get datasource for Admin Dropdown
    //we will get all list of user related to that comapny thats why we are picking from session because we are logged in by Company Admin
    this.GetAdminUserdata();




  }

  //method to refresh the Rich Text Editor UI  
  opened() {
    this.rteObj.refreshUI();

  }

  get g() { return this.EntityForm.controls; }


  //Getting Company Level Admin User list here
  GetAdminUserdata() {

    this._service.GetEntityUsers(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
      .subscribe(
        EntityUserdata => {
          this.adminDataSource = EntityUserdata;
          console.log(this.adminDataSource);
        }
      );
  }
  confirmDlgYesBtnClick = (): void => {
    
    this.confirmDialog.hide();
    //If entity has been used in other configurations then we are updating status only
    if (this.InActiveFlag == true) {
      //Update the status of Entity to InActive
      this._service.UpdateEntityStatus(this.EntityType,this.SelectedRowId)
        .subscribe(
          data => {
            this.showToast("Deleted successfully");
          }
        );
    }
    else {

      //If no dependency exist under this entity then we are Deleting the same
      this._service.DeleteEntity(this.EntityType,this.SelectedRowId)
        .subscribe(
          data => {
            this.showToast("Deleted successfully");
          }
        );
    }
  }

  showToast(msg) {
    this.toastObj.timeOut = 2000;
    this.toasts[1].content = msg;
    this.toastObj.show(this.toasts[1]);
    setTimeout(() => { window.location.reload(); }, 2000);
  }

  confirmDlgBtnNoClick = (): void => {
    this.confirmDialog.hide();
    return;
  }
  confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmDlgYesBtnClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];

  EntityId: number;
  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'entitygrid_pdfexport') {
      this.entitygrid.pdfExport();
    }
    if (args.item.id === 'entitygrid_excelexport') {
      this.entitygrid.excelExport();
    }
    if (args.item.id === 'entitygrid_csvexport') {
      this.entitygrid.csvExport();
    }

    if (args.item.id == 'Add') {
      sessionStorage.removeItem("UploadedFileInfo");//It may contain the info of old session value
      this.showPopup = true;
      this.IsEdit = false;
      this.ShowUpdateBtn = false;
      this.ShowCreateBtn = true;
      this.DialogHeader = 'Create';
      //Get Information by Company Id so that we can prepopulate necessary company info at the time of Creation also
      this._service.GetEntityById(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
        .subscribe(
          data => {

            //pre populate the values of allowedFileType muliselect dropdown
            if (data.AllowedFileTypes != null && data.AllowedFileTypes != undefined && data.AllowedFileTypes != "") {
              this.FileTypeList = data.AllowedFileTypes.split(",");
            }
            this.PreSelectedFileTypeList = this.FileTypeList;
             
            this.EntityForm.patchValue({
              Name: "",
              Description: data.Description,
              LogoPath: data.LogoPath,
              PunchLine: data.PunchLine,
              LoginPolicy: data.LoginPolicy,
              Country: data.CountryCode,
              AddressLine1: data.AddressLine1,
              AddressLine2: data.AddressLine2,
              City: data.City,
              State: data.State,
              PostalCode: data.PostalCode,
              Admin: '',
              AllowedFileTypes: this.PreSelectedFileTypeList
            });
            if (data.Logo != null) {
              let objectURL = 'data:image/jpeg;base64,' + data.Logo;
              this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            }
            else {
              //set default image here
              this.thumbnail = "./assets/img/avatars/mega-cube.png"
            }

          }
        );

    }

    if (args.item.id == 'Edit') {
      
      this.DialogHeader = 'Edit';
      this.PreSelectedUserList = null;
      this.value = [];
      sessionStorage.removeItem("UploadedFileInfo");//It may contain the info of old session value
      this.ShowUpdateBtn = true;
      this.ShowCreateBtn = false;
      const selectedRecords = this.entitygrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No Project selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.SelectedRowId = selectedRecords[0]['Id'];
        this.EntityId = this.SelectedRowId;
        this.GetById(selectedRecords[0]['Id']);
      }
    }

    if (args.item.id == 'Delete') {
      
      const selectedRecords = this.entitygrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No row selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        //Get the count of workflows for selected project
        this.SelectedRowId = selectedRecords[0]['Id'];
        if (this.EntityType == 'GProjects') {
          this._service.GetWFCountByProjectId(selectedRecords[0]['Id'])
            .subscribe(
              WorkflowExistenceCount => {
                if (WorkflowExistenceCount > 0)//means workflow exist against this ProjectId
                {
                  this.ConfirmationBoxMsg = WorkflowExistenceCount + ' workflows exist against this Project, do you still want to delete it?';
                  this.InActiveFlag = true;
                }
                else {
                  this.ConfirmationBoxMsg = 'Are you sure you want to delete this Project?';
                }
                this.confirmDialog.show();
              }
            );
        }//if (this.EntityType == 'GProjects')
        else if (this.EntityType == 'GCompanies') {
          this._service.GetProjectCountByCompanyId(selectedRecords[0]['Id'])
            .subscribe(
              ProjectCount => {
                if (ProjectCount > 0)//means workflow exist against this ProjectId
                {
                  this.ConfirmationBoxMsg = ProjectCount + ' projects exist against this company, do you still want to delete it?';
                  this.InActiveFlag = true;
                }
                else {
                  this.ConfirmationBoxMsg = 'Are you sure you want to delete this Company?';
                }
                this.confirmDialog.show();
              }
            );
        }//else if (this.EntityType == 'GCompanies')
        else//means this.EntityType == 'GGroups'
        {
          this._service.GetCompanyCountByGroupId(selectedRecords[0]['Id'])
            .subscribe(
              CompanyCount => {
                if (CompanyCount > 0)//means workflow exist against this ProjectId
                {
                  this.ConfirmationBoxMsg = CompanyCount + ' companies exist against this group, do you still want to delete it?';
                  this.InActiveFlag = true;
                }
                else {
                  this.ConfirmationBoxMsg = 'Are you sure you want to delete this Group?';
                }
                this.confirmDialog.show();
              }
            );
        }
      }
    }
  }

  public recordDoubleClick(args): void {
    this.DialogHeader = 'Edit';
    this.PreSelectedUserList = null;
    this.value = [];
    sessionStorage.removeItem("UploadedFileInfo");//It may contain the info of old session value
    this.ShowUpdateBtn = true;
    this.ShowCreateBtn = false;
     
      this.EntityId = args.rowData['Id'];
    this.GetById(args.rowData['Id']);
  }

  GetById(SelectedRowId) {
    this._service.GetEntityById(this.EntityType, SelectedRowId)
        .subscribe(
          data => {
            this.EntityModel = data;
            //pre populate the values of allowedFileType muliselect dropdown
            if (data.AllowedFileTypes != null && data.AllowedFileTypes != undefined && data.AllowedFileTypes != "") {
              this.FileTypeList = data.AllowedFileTypes.split(",");
            }
            this.PreSelectedFileTypeList = this.FileTypeList;

            //pre populate the values ofadminmuliselect dropdown
            this._service.GetAssignedAdminForEntity(this.EntityType, this.SelectedRowId)
              .subscribe(
                EntityUserList => {
                  for (let j = 0; j < EntityUserList.length; j++) {
                    this.value.push((EntityUserList[j].Id));
                  }
                  this.PreSelectedUserList = this.value;

                  this.EntityForm.patchValue({
                    Name: data.Name,
                    Description: data.Description,
                    LogoPath: data.LogoPath,
                    PunchLine: data.PunchLine,
                    ProjectDescription: data.Description,
                    LoginPolicy: data.LoginPolicy,
                    Country: data.CountryCode,
                    AddressLine1: data.AddressLine1,
                    AddressLine2: data.AddressLine2,
                    City: data.City,
                    State: data.State,
                    PostalCode: data.PostalCode,
                    AllowedFileTypes: this.PreSelectedFileTypeList,
                    Admin: this.PreSelectedUserList
                  });
                }
              );



            //show image code
            if (data.Logo != null) {
              this.IsEdit = true;
              let objectURL = 'data:image/jpeg;base64,' + data.Logo;
              this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            }

            this.showPopup = true;
          }
        );
    }
  

  Save() {
    
    if (this.EntityForm.invalid) {
      return;
    }
    else
    {

      //Add uploaded Logo path to model
      var UploadedFileInfo = JSON.parse(sessionStorage.getItem("UploadedFile"));
      sessionStorage.removeItem("UploadedFileInfo");
      if (UploadedFileInfo != null) {
        this.EntityModel.LogoPath = this.logoPath + "/" + UploadedFileInfo[0].FileName;//In case of Image uploading, only  one file is allowed thats why we are taking Filename from zeroth element
      }

      this.EntityModel.EntityType = this.EntityType;
      this.EntityModel.Name = this.EntityForm.get('Name').value;
      this.EntityModel.PunchLine = this.EntityForm.get('PunchLine').value;
      this.EntityModel.Description = this.EntityForm.get('Description').value;
      this.EntityModel.LoginPolicy = this.rteObj.value;//this.EntityForm.get('LoginPolicy').value;
      this.EntityModel.CompanyId = this.CompanyId;
      this.EntityModel.GroupId = this.GroupId;
      this.EntityModel.ApplicationId = this.ApplicationId;
      this.EntityModel.CreatedById = this.LoggedInUserId;
      this.EntityModel.UpdatedById = this.LoggedInUserId;
      this.EntityModel.CreatedByRoleId = this.LoggedInRoleId;
      this.EntityModel.UpdatedByRoleId = this.LoggedInRoleId;
      this.EntityModel.CreatedDateTime = new Date();
      this.EntityModel.UpdatedDateTime = new Date();
      this.EntityModel.locale = this.locale;
      this.EntityModel.CountryCode = this.EntityForm.get('Country').value;
      this.EntityModel.AdminUsers = this.EntityForm.get('Admin').value;
      let FileTypeArray = this.EntityForm.get('AllowedFileTypes').value;
      this.EntityModel.AllowedFileTypes = FileTypeArray.join(",");//We are taking AllowedFileTypes as a string because we need to save in database a comma separeated string. It because we will use it in uploader as its from database
      this.EntityModel.AddressLine1 = this.EntityForm.get('AddressLine1').value;
      this.EntityModel.AddressLine2 = this.EntityForm.get('AddressLine2').value;
      this.EntityModel.City = this.EntityForm.get('City').value;
      this.EntityModel.State = this.EntityForm.get('State').value;
      this.EntityModel.PostalCode = this.EntityForm.get('PostalCode').value;
      this.EntityModel.ParameterCarrier = "|UserName=" + sessionStorage.getItem("LoginEmail") + "|RoleName=" + sessionStorage.getItem("LoggedInRoleName")
        + "|SessionValues=" + sessionStorage;
      //Add data in database
      this._service.PostEntityData(this.EntityModel)
        .subscribe(
          data => {
            this.showPopup = false;
            if (this.LoggedInScopeEntityType == "GCompanies")
              this.showToast("Project has been created successfully");
            else if (this.LoggedInScopeEntityType == "GGroups")
              this.showToast("Company has been created successfully");
            else
              this.showToast("Group has been created successfully");
          }
        );
    }
  }

  Update() {
    
    //if (this.EntityForm.invalid) {
    //  return;
    //}
    //else
    {

      //Add uploaded Logo path to model
      var UploadedFileInfo = JSON.parse(sessionStorage.getItem("UploadedFile"));
      sessionStorage.removeItem("UploadedFileInfo");
      if (UploadedFileInfo != null) {
        this.EntityModel.LogoPath = this.logoPath + "/" + UploadedFileInfo[0].FileName;//In case of Image uploading, only  one file is allowed thats why we are taking Filename from zeroth element
      }
      this.EntityModel.EntityType = this.EntityType;
      this.EntityModel.EntityId = this.EntityId;
      this.EntityModel.Name = this.EntityForm.get('Name').value;
      //this.EntityModel.LogoPath = this.EntityForm.get('LogoPath').value;
      this.EntityModel.PunchLine = this.EntityForm.get('PunchLine').value;
      this.EntityModel.Description = this.EntityForm.get('Description').value;
      this.EntityModel.LoginPolicy = this.rteObj.value;//this.EntityForm.get('LoginPolicy').value;
      this.EntityModel.UpdatedById = this.LoggedInUserId;
      this.EntityModel.UpdatedByRoleId = this.LoggedInRoleId;
      this.EntityModel.UpdatedDateTime = new Date();
      this.EntityModel.locale = this.locale;
      this.EntityModel.CountryCode = this.EntityForm.get('Country').value;
      let FileTypeArray = this.EntityForm.get('AllowedFileTypes').value;
      this.EntityModel.AllowedFileTypes = FileTypeArray.join(",");//We are taking AllowedFileTypes as a string because we need to save in database a comma separeated string. It because we will use it in uploader as its from database
      this.EntityModel.AdminUsers = this.EntityForm.get('Admin').value;
      this.EntityModel.Id = this.SelectedRowId;
      this.EntityModel.AddressLine1 = this.EntityForm.get('AddressLine1').value;
      this.EntityModel.AddressLine2 = this.EntityForm.get('AddressLine2').value;
      this.EntityModel.City = this.EntityForm.get('City').value;
      this.EntityModel.State = this.EntityForm.get('State').value;
      this.EntityModel.PostalCode = this.EntityForm.get('PostalCode').value;
      this.EntityModel.ParameterCarrier = "|UserName=" + sessionStorage.getItem("LoginEmail") + "|RoleName=" + sessionStorage.getItem("LoggedInRoleName")
        + "|SessionValues=" + sessionStorage;
      //Add data in database
      this._service.PutEntityData(this.EntityModel)
        .subscribe(
          data => {
            this.showPopup = false;
            if (this.LoggedInScopeEntityType == "GCompanies")
              this.showToast("Project has been updated successfully");
            else if (this.LoggedInScopeEntityType == "GGroups")
              this.showToast("Company has been updated successfully");
            else
              this.showToast("Group has been updated successfully");
          }
        );
    }
  }

  //for opening popup of create user
  CreateUser() {
    this.Source = "GProjects";
    this.showUserPopup = true;
  }


  //This event will called after creating user, user is a different component and SaveUser method exist on that componnet. Therefore after creating user we need to close the dialog box and get AdminUserdata again so that newly created user can exist in the dropdown
  PostUserEvent() {
    this.showUserPopup = false;
    this.GetAdminUserdata();
  }

  //This function is used to just open the dialog box of uploader
  showUploader: boolean = false;
  logoPath: string = "/logo";//passing this to uploader
  UploadLogo() {
    sessionStorage.removeItem("UploadedFileInfo");//It may contain the info of old session value
    this.showUploader = true;
  }

  PostUploadEvent() {
    var UploadedFileInfo = JSON.parse(sessionStorage.getItem("UploadedFile"));
    if (UploadedFileInfo != null) {
      var CompletePath = this.logoPath + "/" + UploadedFileInfo[0].FileName;
      this._UserService.GetImageFromS3(CompletePath)
        .subscribe(
          data => {
            let objectURL = 'data:image/jpeg;base64,' + data;
            this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          }
        );
    }
  }

}
