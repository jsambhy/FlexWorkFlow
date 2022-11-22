import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToolbarService, EditService, PageService, ExcelExportService, PdfExportService, ContextMenuService, GridLine, ToolbarItems, GridComponent, FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ToastPositionModel, ToastComponent } from '@syncfusion/ej2-angular-notifications';
import { CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';
import { ButtonPropsModel, DialogComponent } from '@syncfusion/ej2-angular-popups';
import { Router } from '@angular/router';
import { RolesService } from '../../../services/roles.service';
import { LRoles } from '../../../models/RoleModel';
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  providers: [RolesService, ToolbarService, EditService, PageService, ExcelExportService, PdfExportService, ContextMenuService]
})
/** roles component*/
export class RolesComponent {
  @ViewChild('Rolesgrid', { static: false }) public Rolesgrid: GridComponent;
  @ViewChild('toasttype', { static: false }) private toastObj: ToastComponent;
  @ViewChild('chkIsExternal', { static: false }) public chkIsExternal: CheckBoxComponent;
  @ViewChild('confirmDialog', { static: false }) public confirmDialog: DialogComponent;
  @ViewChild('confirmDialogForDelete', { static: false }) public confirmDialogForDelete: DialogComponent;


  lstRoles: LRoles[];
  ShowPopupFlag: boolean = false;
  ShowCreateBtn: boolean = false;
  ShowUpdateBtn: boolean = false;
  ShowCreatePopup: boolean = false;
  RoleCreateHeader: string;
  RoleId: number;
  RolecreateForm: FormGroup = null;
  roleModel = new LRoles();
  lines: GridLine;
  toolbar: ToolbarItems[] | object;
  editSettings: Object;
  public Iscontinuetodelete: string;
  RoleIdToDelete: number;
  RoleNameToDelete: number;
  confirmcontent: string;
  promptWidth: string = '400px';
  position: ToastPositionModel = { X: 'Center' };
  confirmcontentForDelete: string;
  deleteFlag: boolean;
  filterSettings: FilterSettingsModel;
  hidden = false;
  headerText: Object = [{ text: "Roles" }, { text: "Attachments" }];
  ProjectId: number = +sessionStorage.getItem("ProjectId");
  ProjectName: string = sessionStorage.getItem("DefaultEntityName");
  LoggedInScopeEntityId: number;
  LoggedInScopeEntityType: string;
  //Supporting Document Variables
  EntityType: string = "LRoles";//passing this variable in supporting Document selector
  EntityId: number;//passing this variable in supporting Document selector
  public TargetPath: string = "/" + this.ProjectId + "_" + this.ProjectName + "/roles/attachments";//passing this variable in supporting Document selector

  previousUrl: string;
  constructor(private _service: RolesService, private formBuilder: FormBuilder, private router: Router) {
    this.LoggedInScopeEntityId = +sessionStorage.getItem("LoggedInScopeEntityId");
    this.LoggedInScopeEntityType = sessionStorage.getItem("LoggedInScopeEntityType");
    this.RolecreateForm = this.formBuilder.group({
      Name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      IsExternalChk: new FormControl('')
    });
  }
  //validation regarding functions  
  get f() { return this.RolecreateForm.controls; }
  isFieldValid(field: string) {
    return !this.RolecreateForm.get(field).valid && (this.RolecreateForm.get(field).dirty || this.RolecreateForm.get(field).touched);
  }
  ngOnInit() {
    this.filterSettings = { type: 'Excel' }; // inorder to remove extra filtering from the grid we set it to this type.
    this.GetRoles(); //getting list of RoleNames to display on grid
    this.lines = 'Both';//indicated both the lines in grid(horizontal and vertical)
    this.toolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' },
    { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' },
    { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' },
      'ExcelExport', 'PdfExport', 'CsvExport', 'Search'];
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };//it openeds the dialogue while doing ADD, EDIT, DELETE
    this.ShowCreateBtn = true;
    this.ShowUpdateBtn = false;
  }

  //toast definition
  toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  //toolbarclick event
  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'Rolesgrid_pdfexport') {
      this.Rolesgrid.pdfExport();
    }
    if (args.item.id === 'Rolesgrid_excelexport') {
      this.Rolesgrid.excelExport();
    }
    if (args.item.id === 'Rolesgrid_csvexport') {
      this.Rolesgrid.csvExport();
    }
    if (args.item.id === 'Add') {
      sessionStorage.removeItem("supportingDocumentList");
      this.RoleCreateHeader = "Create Role";
      this.RolecreateForm.patchValue({
        Name: null,
        IsExternalChk: false
      });
      this.EntityId = -1//// we are passing it in supporting document selector, -1 means it is the case of create
      this.ShowCreatePopup = true;
    }
    if (args.item.id === 'Edit') {
      sessionStorage.removeItem("supportingDocumentList");
      const selectedRecords = this.Rolesgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No Role selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.EntityId = selectedRecords[0]['Id'];// we are passing it in supporting document selector
        this.GetById(selectedRecords[0]['Id']);
      }
    }
    if (args.item.id === 'Delete') {
      const selectedRecords = this.Rolesgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No Role selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.RoleNameToDelete = selectedRecords[0]['RoleName'];
        this.DeleteById(selectedRecords[0]['Id']);
      }
    }

  }

  public recordDoubleClick(args): void {
    sessionStorage.removeItem("supportingDocumentList");
    this.EntityId = args.rowData['Id'];// we are passing it in supporting document selector
    this.GetById(args.rowData['Id']);
  }

  //method to get the roles list
  GetRoles() {
    this._service.getAllRoles(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
      .subscribe(
        data => {
          this.lstRoles = (data);
        }
      );
  }
  //Saving the role
  Save() {

    if (this.RolecreateForm.invalid) {
      return;
    }
    else {

      //Add Supporting Document in Model
      var SupportingDocuments = JSON.parse(sessionStorage.getItem("supportingDocumentList"));
      sessionStorage.removeItem("supportingDocumentList");

      var SupportingDocComments = "";

      if (SupportingDocuments != null) {
        this.roleModel.supportingDocuments = SupportingDocuments;
        SupportingDocComments = sessionStorage.getItem("SupportingDocComments");
        sessionStorage.removeItem("SupportingDocComments");
        this.roleModel.SupportingDocComments = SupportingDocComments;
      }

      this.roleModel.RoleName = this.RolecreateForm.get('Name').value;
      //this.roleModel.IsExternal = this.chkIsExternal.checked;
      this.roleModel.ScopeEntityType = this.LoggedInScopeEntityType;
      this.roleModel.ScopeEntityId = this.LoggedInScopeEntityId;
      this._service.Save(this.roleModel).subscribe(
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
          this.ShowCreatePopup = false;
          this.GetRoles();
        },
        //(error: any) => alert(error) //If 552 error comes, then error gets alerted from API if this statement is written here, it will again aleart it.
      );

    }
  }
  //Get role information by id
  GetById(Id) {
    this.ShowCreateBtn = false;
    this.ShowUpdateBtn = true;
    this.RoleCreateHeader = "Edit Role";
    this._service.GetById(Id)
      .subscribe(
        data => {
          this.RolecreateForm.patchValue({
            Name: data.RoleName
            //IsExternalChk: data.IsExternal
          });
          this.RoleId = data.Id;//Id is not the part of Form thats why we need to take it in variable so that at the time of update, we can use it
        }
      );
    this.ShowCreatePopup = true;
  }
  //updating the role
  Update() {
    //No need in update because we are sending entry at the time of upload in Edit case
    //Add Supporting Document in Model
    //var SupportingDocuments = JSON.parse(sessionStorage.getItem("supportingDocumentList"));
    //sessionStorage.removeItem("supportingDocumentList");
    //if (SupportingDocuments != null) {
    //  this.roleModel.supportingDocuments = SupportingDocuments;
    //}
    
    this.roleModel.RoleName = this.RolecreateForm.get('Name').value;
    //this.roleModel.IsExternal = this.chkIsExternal.checked;
    this.roleModel.Id = this.RoleId;
    this.roleModel.ScopeEntityType = this.LoggedInScopeEntityType;
    this.roleModel.ScopeEntityId = this.LoggedInScopeEntityId;
    this._service.Update(this.roleModel).subscribe(
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
        this.ShowCreatePopup = false;
        this.GetRoles();
      })
    //(error: any) => alert(error);
  }
  //deleting the role
  DeleteById(Id) {
    
    this.Iscontinuetodelete = "False";
    this.RoleIdToDelete = Id;
    this.FnDelete(this.RoleIdToDelete);
  }

  FnDelete(Id) {
    this._service.Delete(Id, this.Iscontinuetodelete, this.RoleNameToDelete, this.LoggedInScopeEntityType, this.LoggedInScopeEntityId).subscribe(
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
        else if (MsgPrefix == 'C:') {//Confirmation message
          this.confirmcontent = Showmsg;
          this.confirmDialog.show();
        }
        else {//Error Message
          this.toasts[2].content = Showmsg;
          this.toastObj.show(this.toasts[2]);
        }
        this.GetRoles();
      },
      (error: any) => console.log(error)
    );
  }
  confirmDlgBtnYesClick = (): void => {
    this.Iscontinuetodelete = "True";
    this.FnDelete(this.RoleIdToDelete);
    this.confirmDialog.hide();
  }
  confirmDlgBtnNoClick = (): void => {
    this.confirmDialog.hide();
  }
  confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmDlgBtnYesClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];


}




