import { Component, ViewChild } from '@angular/core';
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {
  ToolbarService, EditService, PageService,
  ExcelExportService, PdfExportService,
  ContextMenuItem, ContextMenuService,
  ToolbarItems, FilterSettingsModel, GridComponent, SelectionSettingsModel
} from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { GridLine } from '@syncfusion/ej2-angular-grids';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { environment } from '../../../../environments/environment';
import { RepresentativeService } from '../../../services/representative.service';
import { participantTypesModel } from '../../../models/participantTypes.model';
import { UserService } from '../../../services/user.service';
import { ListBoxComponent } from '@syncfusion/ej2-angular-dropdowns';

@Component({
  selector: 'app-Representatives',
  templateUrl: './representatives.component.html',
  styleUrls: ['./representatives.component.css'],
  providers: [   
    ToolbarService,
    EditService,
    PageService,
    ExcelExportService,
    PdfExportService,   
    ContextMenuService
  ]
})
export class RepresentativesComponent { 
  @ViewChild('confirmDialog', { static: false }) public confirmDialog: DialogComponent;
  @ViewChild('toasttype', { static: false }) private toastObj: ToastComponent;
  @ViewChild('Repsgrid', { static: false }) public Repsgrid: GridComponent;
  @ViewChild('SelectedUserlistbox', { static: false }) public SelectedUserlistbox: ListBoxComponent;
  hidden: boolean = false;
  RepcreateForm: FormGroup = null;
  ShowPopupFlag: boolean = false;
  confirmDialogueWidth: string = "400px";
  confirmcontent: string;
  RepHeader: string;
  lines: GridLine;
  toolbar: ToolbarItems[] | object;
  showCreateRepPopup: boolean;
  selectedUserIds: string = "";
  contextMenuItems: ContextMenuItem[] =
  [
    'AutoFit',
    'AutoFitAll',
    'SortAscending',
    'SortDescending',
    'Copy',
    'Edit',
    'Delete',
    'Save',
    'Cancel',
    'PdfExport',
    'ExcelExport',
    'CsvExport',
    'FirstPage',
    'PrevPage',
    'LastPage',
    'NextPage',
    'Group',
    'Ungroup'
  ];  
  editSettings: Object;
  position: ToastPositionModel = { X: 'Center' };
  toasts: { [key: string]: Object }[] =
  [
    { title: 'Warning!',content:'There was a problem with your network connection.',cssClass:'e-toast-warning',icon: 'e-warning toast-icons'},
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  dlgButtons: any =[{ click: this.Close.bind(this), buttonModel: { content: 'Ok', isPrimary: true }}];
  dialogClose() { this.ShowPopupFlag = false; }
  Close() { this.ShowPopupFlag = false; }
  confirmHeader: string;
  ShowCreateBtn: boolean;
  ShowUpdateBtn: boolean;
  confirmBoxFlag: string; 
  filterSettings: FilterSettingsModel;
  readonly baseUrl = environment.baseUrl;  
  LoggedInScopeEntityId: number;
  LoggedInScopeEntityType: string;
  Repsdata: [];
  Usersfields: Object = { text: 'LoginEmail', value: 'UserId' };
  Listtoolbar = { items: ['moveUp', 'moveDown', 'moveTo', 'moveFrom', 'moveAllTo', 'moveAllFrom'] }
  UsersDataSrc: any = [];
  SelectedUsersDataSrc: any = [];
  SelectedUserIdList: string = '';
  selectionOptions: SelectionSettingsModel;
  selectedRepId: number;
  sessionprojectid: string = sessionStorage.getItem("ProjectId");
  projectId: number = +this.sessionprojectid;
  UserName: string = sessionStorage.getItem("LoginEmail");
  CurrentRoleName: string = sessionStorage.getItem("CurrentRoleName");
  LoginEmail: string = sessionStorage.getItem("LoginEmail");
  LoggedInRoleId: number = +sessionStorage.getItem("LoggedInRoleId");
  LoggedInUserId: number = +sessionStorage.getItem("LoggedInUserId");
  selectedRepLabel: string;
  model: participantTypesModel = new participantTypesModel();
  repEditId: number;

  get f() { return this.RepcreateForm.controls; }

  isFieldValid(field: string) {
    return !this.RepcreateForm.get(field).valid && (this.RepcreateForm.get(field).dirty || this.RepcreateForm.get(field).touched);
  }

  confirmDlgYesBtnClick = (): void => {
    if (this.confirmBoxFlag == "Delete") {
      this.model.Id = this.selectedRepId;
      this.model.CreatedByRoleId = this.LoggedInRoleId;
      this.model.CreatedById = this.LoggedInUserId;
      this.model.ParameterCarrier = "ScopeEntityType=" + this.LoggedInScopeEntityType +
        "|ScopeEntityId=" + this.LoggedInScopeEntityId +
        "|RoleName=" + this.CurrentRoleName +
        "|UserName=" + this.UserName;

      this._service.delete(this.model).subscribe(
        (data: string) => {
          let MsgPrefix: string = data.substring(0, 2);
          let Showmsg: string = data.substring(2, data.length);
          if (MsgPrefix == 'S:') {//Means success
            this.toasts[1].content = Showmsg;
            this.toastObj.show(this.toasts[1]);
          }
          else if (MsgPrefix == 'I:') {//Information message
            this.toasts[3].content = Showmsg;
            this.toastObj.show(this.toasts[3]);
          }
          else if (MsgPrefix == 'W:') {//Warning Message
            this.toasts[0].content = Showmsg;
            this.toastObj.show(this.toasts[0]);
          }
          else {//Error Message
            this.toasts[2].content = Showmsg;
            this.toastObj.show(this.toasts[2]);
          }

          this.fnGetData();
        });
    }
    this.confirmDialog.hide();
    return;
  }

  confirmDlgBtnNoClick = (): void => {
    this.confirmDialog.hide();
    return;
  }

  confirmDlgButtons: ButtonPropsModel[] =
    [
      {
      click: this.confirmDlgBtnNoClick.bind(this),
      buttonModel: { content: 'No' }
      },
      {
        click: this.confirmDlgYesBtnClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true }
      }
    ];

  ngOnInit() {    
    this.filterSettings = { type: 'CheckBox' }; // inorder to remove extra filtering from the grid we set it to this type.
    this.lines = 'Both';//indicated both the lines in grid(horizontal and vertical)
    this.toolbar =
      [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' }, { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' }, { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' }, 'ExcelExport', 'PdfExport', 'CsvExport', 'Search'
      ];
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };//open while add/delete/edit 
    this.ShowCreateBtn = true;
    this.ShowUpdateBtn = false;
    this.LoggedInScopeEntityId = +sessionStorage.getItem('LoggedInScopeEntityId');
    this.LoggedInScopeEntityType = sessionStorage.getItem('LoggedInScopeEntityType');
    this.selectionOptions = { checkboxOnly: true };
    this.fnGetData();
    this.GetUsersList();      
  }

  toolbarClick(args: ClickEventArgs): void {
    const selectedRecords = this.Repsgrid.getSelectedRecords();
    if (args.item.id === 'grid_pdfexport') {
       this.Repsgrid.pdfExport();
    }
    if (args.item.id === 'grid_excelexport') {
      this.Repsgrid.excelExport();
    }
    if (args.item.id === 'grid_csvexport') {
      this.Repsgrid.csvExport();
    }
   
    if (args.item.id === 'Add') {
      this.RepHeader = "Create Representative";
     /* this.SelectedUsersDataSrc = null;*/
      this.RepcreateForm.patchValue({
        Name: null,
        Description: null
      });
     
      this.showCreateRepPopup = true;
      this.ShowCreateBtn = true;
      this.ShowUpdateBtn = false;
      
    }
    if (args.item.id === 'Edit') {
      this.RepHeader = "Edit Representative";
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No rep selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
       
        this.GetById(selectedRecords[0]['Id']);
      }
    }
    if (args.item.id === 'Delete') {
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No rep selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.selectedRepId = selectedRecords[0]['Id'];
        this.fnDelete();
      }
    }
  }

  recordDoubleClick(args): void {   
    //this.GetById(args.rowData['Id']);
  }

  constructor(private formBuilder: FormBuilder, private _service: RepresentativeService, private userservice: UserService)
  {
    //creating form fields and declaring validation that needs to be implemented
    this.RepcreateForm = this.formBuilder.group({
      Name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      Description: new FormControl('', [Validators.maxLength(4000)])      
    });
  }

  SelectedUserData: any[];

  GetSelectedUserList() {
    this.SelectedUserIdList = "";
    if (this.SelectedUserlistbox != undefined) {
      this.SelectedUserData = this.SelectedUserlistbox.getDataList();
    }
    else {
      this.SelectedUserData = this.SelectedUsersDataSrc;
    }
    if (this.SelectedUserData != null && this.SelectedUserData.length != 0) {
      for (let i = 0; i < this.SelectedUserData.length; i++) {
        this.SelectedUserIdList = this.SelectedUserIdList + this.SelectedUserData[i]['UserId'] + ',';
      }
      this.SelectedUserIdList = this.SelectedUserIdList.substring(0, this.SelectedUserIdList.length - 1);
    }
  }

  GetUsersList() {
    this.userservice.GetUsersByScope(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
      .subscribe(
        (data) => {          
          this.UsersDataSrc = data;
        }
      );
  }

  fnGetData() {
    this._service.getData(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
        .subscribe(
            (data) => {
              this.Repsdata = (data);
        }
      );
  }

  fnDelete() {    
      this.confirmBoxFlag = "Delete";
      this.confirmHeader = "Please confirm"
      this.confirmcontent = 'Are you sure you want to delete?'
      this.confirmDialog.show();
  }

  fnSave() {
    if (this.RepcreateForm.invalid) {
      return;
    }
    else {      
      this.model.Name = this.RepcreateForm.get('Name').value.trim();
      this.model.Description = this.RepcreateForm.get('Description').value;
      this.model.CreatedById = this.LoggedInUserId;
      this.model.UpdatedById = this.LoggedInUserId;
      this.model.CreatedByRoleId = this.LoggedInRoleId;
      this.model.UpdatedByRoleId = this.LoggedInRoleId;
      this.model.CreatedById = this.LoggedInUserId;
      this.model.UpdatedById = this.LoggedInUserId;
      this.GetSelectedUserList();
      this.model.ParameterCarrier = "|ScopeEntityType=" + this.LoggedInScopeEntityType +
        "|ScopeEntityId=" + this.LoggedInScopeEntityId + "|SelectedUserIdList=" + this.SelectedUserIdList;

      this._service.save(this.model).subscribe(
        (data: string) => {
          let MsgPrefix: string = data.substring(0, 2);
          let Showmsg: string = data.substring(2, data.length);
          if (MsgPrefix == 'S:') {//Means success
            this.toasts[1].content = Showmsg;
            this.toastObj.show(this.toasts[1]);
          }
          else if (MsgPrefix == 'I:') {//Information message
            this.toasts[3].content = Showmsg;
            this.toastObj.show(this.toasts[3]);
          }
          else if (MsgPrefix == 'W:') {//Warning Message
            this.toasts[0].content = Showmsg;
            this.toastObj.show(this.toasts[0]);
          }
          else {//Error Message
            this.toasts[2].content = Showmsg;
            this.toastObj.show(this.toasts[2]);
          }
          this.showCreateRepPopup = false;
          this.fnGetData();
        },
        (error: any) => console.log(error)
      );
    }
  }

  CompanyId: number;
  GetById(Id) {
    this.GetUsersList();
    this.repEditId = Id;
    this.ShowCreateBtn = false;
    this.ShowUpdateBtn = true;
    this._service.getRepDataById(Id)
      .subscribe(
        (data) => {         
          this.CompanyId = data[0].CompanyId;

          this._service.GetExistingUsersList(this.repEditId, this.CompanyId)
            .subscribe(
              (data) => {
                this.UsersDataSrc = data;
              }
            );
          this.RepcreateForm.patchValue({
            Name: data[0].Name,
            Description: data[0].Description          
          });
          this.SelectedUsersDataSrc = JSON.parse(data[0].SelectedUserListJson);
          
        }
      );

    this.showCreateRepPopup = true;
  }

  fnUpdate() {
  
    if (this.RepcreateForm.invalid) {
      return;
    }    
    else {
      this.SelectedUserIdList = "";
      this.GetSelectedUserList();
      this.model.Id = this.repEditId;
      this.model.Name = this.RepcreateForm.get('Name').value;      
      this.model.Description = this.RepcreateForm.get('Description').value; 
      this.model.CreatedById = this.LoggedInUserId;
      this.model.UpdatedById = this.LoggedInUserId;
      this.model.CreatedByRoleId = this.LoggedInRoleId;
      this.model.UpdatedByRoleId = this.LoggedInRoleId;
      this.model.CreatedById = this.LoggedInUserId;
      this.model.UpdatedById = this.LoggedInUserId;
      this.model.CompanyId = this.CompanyId;
      //this.model.ParameterCarrier = "|ScopeEntityType=" + this.LoggedInScopeEntityType +
      //  "|ScopeEntityId=" + this.LoggedInScopeEntityId + "|SelectedUserIdList=" + this.SelectedUserIdList;
      this.model.ParameterCarrier = "|SelectedUserIdList=" + this.SelectedUserIdList;
      this._service.update(this.model).subscribe(
        (data: string) => {
          let MsgPrefix: string = data.substring(0, 2);
          let Showmsg: string = data.substring(2, data.length);
          if (MsgPrefix == 'S:') {//Means success
            this.toasts[1].content = Showmsg.split('|')[0];
            this.toastObj.show(this.toasts[1]);
          }
          else if (MsgPrefix == 'I:') {//Information message
            this.toasts[3].content = Showmsg;
            this.toastObj.show(this.toasts[3]);
          }
          else if (MsgPrefix == 'W:') {//Warning Message
            this.toasts[0].content = Showmsg;
            this.toastObj.show(this.toasts[0]);
          }
          else {//Error Message
            this.toasts[2].content = Showmsg;
            this.toastObj.show(this.toasts[2]);
          }
          this.ShowCreateBtn = false;
          this.ShowUpdateBtn = true;
          this.showCreateRepPopup = false;
          this.fnGetData();
          
        },
        (error: any) => {
          this.toastObj.timeOut = 0;
          this.toasts[2].content = error.error['Message'];
          this.toastObj.show(this.toasts[2]);
        }
      );
    }
  }
  
}

