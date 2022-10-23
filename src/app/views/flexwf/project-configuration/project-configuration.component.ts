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

@Component({
  selector: 'app-project-configuration',
  templateUrl: './project-configuration.component.html',
  styleUrls: ['./project-configuration.component.css'],
  providers: [ToolbarService, EditService, ExcelExportService, PdfExportService, HtmlEditorService]
})
/** project-configuration component*/
export class ProjectConfigurationComponent {
  LoggedInScopeEntityId: number;
  LoggedInScopeEntityType: string;
  LoggedInRoleName: string;
  EntityName: string;
  CompanyId: number;
  GridDataSource: GProject[];
  toolbar: ToolbarItems[] | object;
  showPopup: boolean = false;
  ShowCreateBtn: boolean = false;
  IsEdit: boolean = false;
  ShowUpdateBtn: boolean = false;
  showUserPopup: boolean = false;
  ProjectForm: FormGroup = null;
  ProjectModel: GProject = new GProject();
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
  //public AllowedFileTypesSource: { [key: string]: Object }[]  = [{ FileName: ".pdf", Id: ".pdf" },
  //  { FileName: ".csv", Id: ".csv" }, { FileName: ".png", Id: ".png" }, { FileName: ".sql", Id: ".sql" }];
  // maps the appropriate column to fields property
  public fields: Object = { text: 'LoginEmail', value: 'EntityUserId' };
  public fileTypesFields: Object = { text: 'Extension', value: 'ID' };


  constructor(private formBuilder: FormBuilder, private _service: ProjectService,
    private AccountService: AccountService, private sanitizer: DomSanitizer) {
    this.ProjectForm = this.formBuilder.group({
      ProjectName: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      LogoPath: new FormControl(''),
      PunchLine: new FormControl(''),
      ProjectDescription: new FormControl(''),
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

  @ViewChild('projectgrid', { static: false })
  public projectgrid: GridComponent;

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


  @ViewChild('ProjectDialog', { static: false })
  public ProjectDialog: DialogComponent;

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

  //method to refresh the Rich Text Editor UI
  //OnOpen() {
  //  this.rteSection.refreshUI();
  //}

  public selection: NodeSelection = new NodeSelection();
  public iframe: object = { enable: false };
  public range: Range;
  public customBtn: HTMLElement;
  public dialogCtn: HTMLElement;
  public saveSelection: NodeSelection;

  //public onCreate(): void {
  //  this.customBtn = document.getElementById('custom_tbar') as HTMLElement;
  //  this.dialogCtn = document.getElementById('rteSpecial_char') as HTMLElement;
  //  this.ProjectDialog.target = document.getElementById('rteSection');
  //  this.customBtn.onclick = (e: Event) => {
  //    (this.rteSection.contentModule.getEditPanel() as HTMLElement).focus();
  //    this.ProjectDialog.element.style.display = '';
  //    this.range = this.selection.getRange(document);
  //    this.saveSelection = this.selection.save(this.range, document);
  //    this.ProjectDialog.show();
  //  };
  //}

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
    }


    //Getting ProjectList based on Loggedin Company
    this._service.getAllProjects(this.CompanyId)
      .subscribe(
        ProjectData => {
          this.GridDataSource = (ProjectData);
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

  get g() { return this.ProjectForm.controls; }
 

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
    //If workflows exist under this Project then we are updating status only
    if (this.InActiveFlag == true) {
      //Update the status of Project to InActive
      this._service.UpdateProjectStatus(this.SelectedRowId)
        .subscribe(
          data => {
            this.showToast("Project has been deleted successfully");
          }
        );
    }
    else {

      //If no workflows exist under this project then we are Deleting the same
      this._service.DeleteProject(this.SelectedRowId)
        .subscribe(
          data => {
            this.showToast("Project has been deleted successfully");
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

  //dataBound() {
  //  this.projectgrid.autoFitColumns();//automatically adjust the columns width as per the content
  //}

  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'projectgrid_pdfexport') {
      this.projectgrid.pdfExport();
    }
    if (args.item.id === 'projectgrid_excelexport') {
      this.projectgrid.excelExport();
    }
    if (args.item.id === 'projectgrid_csvexport') {
      this.projectgrid.csvExport();
    }

    if (args.item.id == 'Add') {
      sessionStorage.removeItem("UploadedFileInfo");//It may contain the info of old session value
      this.showPopup = true;
      this.IsEdit = false;
      this.ShowUpdateBtn = false;
      this.ShowCreateBtn = true;
     
      //Get Information by Company Id so that we can prepopulate necessary company info at the time of Creation also
      this._service.GetCompanyById(this.LoggedInScopeEntityId)
        .subscribe(
          data => {

            //pre populate the values of allowedFileType muliselect dropdown
            if (data.AllowedFileTypes != null && data.AllowedFileTypes != undefined && data.AllowedFileTypes != "") {
              this.FileTypeList = data.AllowedFileTypes.split(",");
            }
            this.PreSelectedFileTypeList = this.FileTypeList;


            this.ProjectForm.patchValue({
              ProjectName: "",
              LogoPath: data.LogoPath,
              PunchLine: data.Punchline,
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
            else
            {
              //set default image here
              this.thumbnail = "./assets/img/avatars/mega-cube.png"
            }

          }
      );

     // this.adminList.value = null;
      //this.AllowedFileTypes.value = null;
    }

    if (args.item.id == 'Edit') {
      sessionStorage.removeItem("UploadedFileInfo");//It may contain the info of old session value
      this.ShowUpdateBtn = true;
      this.ShowCreateBtn = false;
      const selectedRecords = this.projectgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No Project selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.SelectedRowId = selectedRecords[0]['Id'];
        this._service.GetById(selectedRecords[0]['Id'])
          .subscribe(
            data => {
              this.ProjectModel = data;
           //pre populate the values of allowedFileType muliselect dropdown
              if (data.AllowedFileTypes != null && data.AllowedFileTypes != undefined && data.AllowedFileTypes != "")
              {
                this.FileTypeList = data.AllowedFileTypes.split(",");
              }
              this.PreSelectedFileTypeList = this.FileTypeList;

              //pre populate the values ofadminmuliselect dropdown
              this._service.GetEntityUsers("GProjects", this.SelectedRowId)
                .subscribe(
                  data => {
                    for (let j = 0; j < data.length; j++) {
                      this.value.push((data[j].EntityUserId));
                    }
                    this.PreSelectedUserList = this.value;
                  }
              );

              this.ProjectForm.patchValue({
                ProjectName: data.ProjectName,
                LogoPath: data.LogoPath,
                PunchLine: data.PunchLine,
                ProjectDescription: data.ProjectDescription,
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
    }

    if (args.item.id == 'Delete') {
      const selectedRecords = this.projectgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No Project selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        //Get the count of workflows for selected project
        this.SelectedRowId = selectedRecords[0]['Id'];
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
      }
    }
  }


  SaveProject() {
    
    if (this.ProjectForm.invalid) {
      return;
    }
    else {

      //Add uploaded Logo path to model
      var UploadedFileInfo = JSON.parse(sessionStorage.getItem("UploadedFile"));
      sessionStorage.removeItem("UploadedFileInfo");
      if (UploadedFileInfo != null) {
        this.ProjectModel.LogoPath = this.logoPath + "/" + UploadedFileInfo[0].FileName;//In case of Image uploading, only  one file is allowed thats why we are taking Filename from zeroth element
      }


      this.ProjectModel.ProjectName = this.ProjectForm.get('ProjectName').value;
     // this.ProjectModel.LogoPath = this.ProjectForm.get('LogoPath').value;
      this.ProjectModel.PunchLine = this.ProjectForm.get('PunchLine').value;
      this.ProjectModel.ProjectDescription = this.ProjectForm.get('ProjectDescription').value;
      this.ProjectModel.LoginPolicy = this.rteObj.value;//this.ProjectForm.get('LoginPolicy').value;
      this.ProjectModel.CompanyId = this.CompanyId;
      this.ProjectModel.CreatedById = this.LoggedInUserId;
      this.ProjectModel.UpdatedById = this.LoggedInUserId;
      this.ProjectModel.CreatedByRoleId = this.LoggedInRoleId;
      this.ProjectModel.UpdatedByRoleId = this.LoggedInRoleId;
      this.ProjectModel.CreatedDateTime = new Date();
      this.ProjectModel.UpdatedDateTime = new Date();
      this.ProjectModel.locale = this.locale;
      this.ProjectModel.CountryCode = this.ProjectForm.get('Country').value;
      this.ProjectModel.AdminUsers = this.ProjectForm.get('Admin').value;
      let FileTypeArray = this.ProjectForm.get('AllowedFileTypes').value;
      this.ProjectModel.AllowedFileTypes = FileTypeArray.join(",");//We are taking AllowedFileTypes as a string because we need to save in database a comma separeated string. It because we will use it in uploader as its from database
      this.ProjectModel.AddressLine1 = this.ProjectForm.get('AddressLine1').value;
      this.ProjectModel.AddressLine2 = this.ProjectForm.get('AddressLine2').value;
      this.ProjectModel.City = this.ProjectForm.get('City').value;
      this.ProjectModel.State = this.ProjectForm.get('State').value;
      this.ProjectModel.PostalCode = this.ProjectForm.get('PostalCode').value;
      this.ProjectModel.ParameterCarrier = "|UserName=" + sessionStorage.getItem("LoginEmail") + "|RoleName=" + sessionStorage.getItem("LoggedInRoleName")
        + "|SessionValues=" + sessionStorage;
      //Add data in database
      this._service.SaveProject(this.ProjectModel)
        .subscribe(
          data => {
            this.showPopup = false;
            this.showToast("Project has been created successfully");
          }
        );
    }
  }

  UpdateProject() {
    
    if (this.ProjectForm.invalid) {
      return;
    }
    else {

      //Add uploaded Logo path to model
      var UploadedFileInfo = JSON.parse(sessionStorage.getItem("UploadedFile"));
      sessionStorage.removeItem("UploadedFileInfo");
      if (UploadedFileInfo != null) {
        this.ProjectModel.LogoPath = this.logoPath + "/" + UploadedFileInfo[0].FileName;//In case of Image uploading, only  one file is allowed thats why we are taking Filename from zeroth element
      }

      this.ProjectModel.ProjectName = this.ProjectForm.get('ProjectName').value;
      //this.ProjectModel.LogoPath = this.ProjectForm.get('LogoPath').value;
      this.ProjectModel.PunchLine = this.ProjectForm.get('PunchLine').value;
      this.ProjectModel.ProjectDescription = this.ProjectForm.get('ProjectDescription').value;
      this.ProjectModel.LoginPolicy = this.rteObj.value;//this.ProjectForm.get('LoginPolicy').value;
      this.ProjectModel.UpdatedById = this.LoggedInUserId;
      this.ProjectModel.UpdatedByRoleId = this.LoggedInRoleId;
      this.ProjectModel.UpdatedDateTime = new Date();
      this.ProjectModel.locale = this.locale;
      this.ProjectModel.CountryCode = this.ProjectForm.get('Country').value;
      let FileTypeArray = this.ProjectForm.get('AllowedFileTypes').value;
      this.ProjectModel.AllowedFileTypes = FileTypeArray.join(",");//We are taking AllowedFileTypes as a string because we need to save in database a comma separeated string. It because we will use it in uploader as its from database
      this.ProjectModel.AdminUsers = this.ProjectForm.get('Admin').value;
      this.ProjectModel.Id = this.SelectedRowId;
      this.ProjectModel.AddressLine1 = this.ProjectForm.get('AddressLine1').value;
      this.ProjectModel.AddressLine2 = this.ProjectForm.get('AddressLine2').value;
      this.ProjectModel.City = this.ProjectForm.get('City').value;
      this.ProjectModel.State = this.ProjectForm.get('State').value;
      this.ProjectModel.PostalCode = this.ProjectForm.get('PostalCode').value;
      this.ProjectModel.ParameterCarrier = "|UserName=" + sessionStorage.getItem("LoginEmail") + "|RoleName=" + sessionStorage.getItem("LoggedInRoleName")
        + "|SessionValues=" + sessionStorage;
      //Add data in database
      this._service.UpdateProject(this.ProjectModel)
        .subscribe(
          data => {
            this.showPopup = false;
            this.showToast("Project has been updated successfully");
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
    this.showUploader = true;
  }
} 
