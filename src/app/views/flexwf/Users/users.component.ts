import { Component, ViewChild, ViewContainerRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';


import { ReorderService, ToolbarService, EditService, ExcelExportService, PdfExportService, ToolbarItems, GridComponent, SelectionSettingsModel, DetailRowService, FilterSettingsModel, PageService } from '@syncfusion/ej2-angular-grids';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { ClickEventArgs, SelectEventArgs } from '@syncfusion/ej2-angular-navigations';
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
import { CountryModel } from '../../../models/country-model';
import { UserRoleViewModel } from '../../../models/loginModel';
import { UserService } from '../../../services/user.service';
import { AccountService } from '../../../services/auth';
import { LUser } from '../../../models/UserModel';
import { UserRoleTag } from '../../../models/UserRoleTagModel';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./user.component.css'],
  providers: [ReorderService, ToolbarService, EditService, ExcelExportService, PdfExportService, DetailRowService, PageService]
})
/** users component*/
export class UsersComponent {
  LoggedInScopeEntityId: number;
  LoggedInScopeEntityType: string;
  LoggedInRoleName: string;
  EntityName: string;
  GridDataSource: LUser[];
  ProjectUserList: LUser[];
  NonProjectUserList: LUser[];
  public toolbar: ToolbarItems[] | object;
  //public editSettings: Object;
  showPopup: boolean = false;
  //showTagPopup: boolean = false;
  //ShowCreateBtn: boolean = false;;
  //ShowUpdateBtn: boolean = false;
  ShowTabs: boolean = false;
  ShowUserGrid: boolean = false;
  LoggedInUserId: number;
  LoggedInRoleId: number;
  ProjectId: number;
  SelectedRowId: number;
  public Enable: boolean = false;
  public SelectedRoleId: number;
  public selectionOptions: SelectionSettingsModel;
  ConfirmationBoxMsg: string;
  public confirmHeader: string = 'Confirm';
  public confirmCloseIcon: Boolean = true;
  public confirmWidth: string = '400px';
  isGroupColumnVisible: boolean = true;
  public TransactionId: number;
  hidden: boolean = false;
  thumbnail: any;
  Source: string = 'Users';
  filterSettings: FilterSettingsModel;
  headerText: Object = [{ text: "Manage Users" }, { text: "Other Projects" }];

  @ViewChild('childtemplate', { static: false }) public childtemplate: any;
  //public childtemplate: any;
  public childGrid: any;

  @ViewChild('userGrid', { static: false })
  public UserGrid: GridComponent;

  @ViewChild('projectUserGrid', { static: false })
  public ProjectUserGrid: GridComponent;

  @ViewChild('nonProjectUserGrid', { static: false })
  public NonProjectUserGrid: GridComponent;

  @ViewChild('toasttype', { static: false })
  private toastObj: ToastComponent;


  @ViewChild('confirmDialog', { static: false })
  public confirmDialog: DialogComponent;

  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };

 

  constructor(
    private _service: UserService, private router: Router,
    private AccountService: AccountService, private sanitizer: DomSanitizer,
    @Inject(ViewContainerRef) private viewContainerRef?: ViewContainerRef) {
    this.LoggedInScopeEntityId = +sessionStorage.getItem('LoggedInScopeEntityId');
    this.LoggedInScopeEntityType = sessionStorage.getItem('LoggedInScopeEntityType');
    this.LoggedInRoleName = sessionStorage.getItem('LoggedInRoleName');
    this.LoggedInUserId = +sessionStorage.getItem("LoggedInUserId");
    this.LoggedInRoleId = +sessionStorage.getItem("LoggedInRoleId");
    this.ProjectId = +sessionStorage.getItem("ProjectId");

  }



  ngOnInit() {
    this.filterSettings = { type: 'CheckBox' }; // inorder to remove extra filtering from the grid we set it to this type.

    this.toolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add', align: 'Left' }
      , { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit', align: 'Left' },
      { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete', align: 'Left' },
      { text: 'Data Fields', tooltipText: 'Data Fields', prefixIcon: 'e-custom-icons e-action-Icon-datafields', id: 'DataFields', align: 'Left' },
      'ExcelExport', 'PdfExport', 'CsvExport', 'Search'];
   // this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };//it opened the dialogue while doing ADD, EDIT, DELETE
    this.selectionOptions = { checkboxOnly: true }; 

    //When Company Admin is logged in then we will not show Group column, it should be visible only to Group Admin and Application Admin
    if (this.LoggedInScopeEntityType == 'GCompanies') { this.isGroupColumnVisible = false; }

    //If LoggedIn EntityType is GProjects then we will show two tabs, one for Projects and other for non projects, but user can see all UserList belongs to that company
    if (this.LoggedInScopeEntityType == 'GProjects') {
      this.ShowTabs = true;
      this.ShowUserGrid = false;
      this.SelectedGridName = 'projectUserGrid';//default selection tab
    }
    else {
      this.ShowTabs = false;
      this.ShowUserGrid = true;
    }

    
    this._service.ManageUsersByEntity(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId, 'Get', 0)
      .subscribe(
        data => {
          this.GridDataSource = (data);
          console.log(this.GridDataSource);

          //In case of Project Admin role, get Project Specific and non project specific users saperately
          if (this.LoggedInScopeEntityType == 'GProjects') {
            this.ProjectUserList = this.GridDataSource.filter(p => p.IsProjectMember == true);
            this.NonProjectUserList = this.GridDataSource.filter(p => p.IsProjectMember == false);
          }
         
     
          //Load ChildUserGrid
          this.childGrid = {
            dataSource: this.GridDataSource,
            queryCellInfo: this.customiseCell,
            queryString: 'UserId',
            load() {
              this.registeredTemplate = {};   // set registertemplate value as empty in load event
            },
            columns: [
              { headerText: 'Employee Image', textAlign: 'Center', template: '<div class="e-avatar e-avatar-circle"><img></div>', width: 150 },
              //{ headerText: 'Employee Image', textAlign: 'Center', template: this.childtemplate, width: 150 },
              { field: 'FirstName', headerText: 'First Name', width: 150, height: 200 },
              { field: 'LastName', headerText: 'Last Name', width: 150, height: 200  }
            ],
          };


        }
      );

     

  }//end of ngOnInit

  ngAfterViewInit() {
    this.childtemplate.elementRef.nativeElement._viewContainerRef = this.viewContainerRef;
    this.childtemplate.elementRef.nativeElement.propName = 'template';
  }


  customiseCell(args: any) {
    
   //to show user image on child template
    if (args.column.headerText == 'Employee Image' && args.data.Image != null) {
      args.cell.querySelector('img').setAttribute('src', 'data:image/png;base64 ,' + args.data.Image);
    }
    //if image is null then show some default image
    else if (args.column.headerText == 'Employee Image' && args.data.Image == null)
    {
      args.cell.querySelector('img').setAttribute('src', "assets/img/avatars/User Pic.jpg");
    }
  }

  //get g() { return this.UserForm.controls; }

  public confirmDlgYesBtnClick = (): void => {
    this.confirmDialog.hide();
   
      //On delete button, we will update the status of User from Active to Terminated

    this._service.ManageUsersByEntity(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId, 'Delete', this.SelectedRowId)
      .subscribe(
        data => {
          this.toastObj.timeOut = 2000;
          this.toasts[1].content = "User Terminated Successfully";
          this.toastObj.show(this.toasts[1]);
          this.showPopup = false;
          setTimeout(() => { window.location.reload(); }, 2000);
        }
    );
    
  }

  public confirmDlgBtnNoClick = (): void => {
    this.confirmDialog.hide();
    return;
  }
  public confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmDlgYesBtnClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];

  toolbarClick(args: ClickEventArgs): void {
    
    if (args.item.id === 'userGrid_pdfexport' || args.item.id === 'projectUserGrid_pdfexport' || args.item.id === 'nonProjectUserGrid_pdfexport') {
      this.UserGrid.pdfExport();
    }
    if (args.item.id === 'userGrid_excelexport' || args.item.id === 'projectUserGrid_pdfexport' || args.item.id === 'nonProjectUserGrid_pdfexport') {
      this.UserGrid.excelExport();
    }
    if (args.item.id === 'userGrid_csvexport' || args.item.id === 'projectUserGrid_pdfexport' || args.item.id === 'nonProjectUserGrid_pdfexport') {
      this.UserGrid.csvExport();
    }

    if (args.item.id == 'Add') {
      sessionStorage.removeItem("UploadedFileInfo");//It may contain the info of old session value
      this.TransactionId = -1;
      this.showPopup = true;
      //this.ShowUpdateBtn = false;
      //this.ShowCreateBtn = true;
     
    }
    else if (args.item.id === 'DataFields') {
        sessionStorage.setItem("IsAuth", "true");//This is to stop url tempering
        this.router.navigate(['/flexwf/form-labels', 'Users', 0]);
    }
    if (args.item.id == 'Edit') {
      sessionStorage.removeItem("UploadedFileInfo");//It may contain the info of old session value
      let selectedRecords=null;
      if (this.SelectedGridName == 'projectUserGrid')
      {
        selectedRecords = this.ProjectUserGrid.getSelectedRecords();
      }
      else if (this.SelectedGridName == 'nonProjectUserGrid')
      {
        selectedRecords = this.NonProjectUserGrid.getSelectedRecords();
      }
      else
      {
        selectedRecords = this.UserGrid.getSelectedRecords();
      }

   
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No User selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {

        this.showPopup = true;
        this.SelectedRowId = selectedRecords[0]['UserId'];
        this.TransactionId = this.SelectedRowId;
        
      }

     
    }

    if (args.item.id == 'Delete') {
      const selectedRecords = this.UserGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No User selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        //Get the count of workflows for selected project
        this.SelectedRowId = selectedRecords[0]['UserId'];
        this.ConfirmationBoxMsg = 'Are you sure you want to delete this Project ?';
             
              this.confirmDialog.show();
            }
     }
  }

  public recordDoubleClick(args): void {
    sessionStorage.removeItem("UploadedFileInfo");//It may contain the info of old session value
      this.showPopup = true;
      this.SelectedRowId = args.rowData['UserId'];
      this.TransactionId = this.SelectedRowId;

  }

  SelectedGridName: string;
  onTabSelect(args: SelectEventArgs) {
    
    if (args.selectedIndex == 0) {
      this.SelectedGridName = 'projectUserGrid';
    }
    else if (args.selectedIndex == 1) {
      this.SelectedGridName = 'nonProjectUserGrid';
    }
  }
}
