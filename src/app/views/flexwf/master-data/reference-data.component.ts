import { Component, ViewChild } from '@angular/core';
import { MasterDataService } from '../../../services/master-data.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { GridComponent, FilterSettingsModel, ToolbarItems, PageSettingsModel, DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';
import { ToastPositionModel, ToastComponent } from '@syncfusion/ej2-angular-notifications';
import { Ajax } from '@syncfusion/ej2-base';
import { environment } from '../../../../environments/environment';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { SupportingDocumentService } from '../../../services/supporting-document.service';
import { FormRendererService } from '../../../services/form-renderer.service';
import { FlexWorkflowsService } from '../../../services/flex-workflows.service';
import { ConstraintsService } from '../../../services/constraints.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { DropdownsComponent } from '../../buttons/dropdowns.component';
import { RolesService } from '../../../services/roles.service';
import { UserService } from '../../../services/user.service';
import { RestrictDropdownDataViewModel } from '../../../models/restrictDropdownData-constraint.model';
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
@Component({
  selector: 'app-reference-data',
  templateUrl: './reference-data.component.html',
  providers: [ConstraintsService]
})
export class ReferenceDataComponent {
  ProjectId: number;
  public MasterDataForGrid: any[];
  @ViewChild('MasterDataGrid', { static: false })  public MasterDataGrid: GridComponent;
  
  @ViewChild('ConstraintsGrid', { static: false })  public ConstraintsGrid: GridComponent;
  public pageSetting: PageSettingsModel;
  public filterSettings: FilterSettingsModel;
  lines: string;
  public toolbar: ToolbarItems[] | object;
  public constraintstoolbar: ToolbarItems[] | object;
  public editSettings: Object;

  //toast
  @ViewChild('toasttype', { static: false })
  private toastObj: ToastComponent;
  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };
  public pagesize: number;
  public sortDataFieldName: string;
  public sortOrder: string;
  public gridDataSource: any;
  public ReferenceDataGridData: any;
  public locale: string;
  public timeZone: string;
  public offSet: number;
  Previous: string;
  ReferenceId: number;
  public gridColumns: any;
  readonly baseUrl = environment.baseUrl;
  header: string;
  ShowEdit = 'true';
  AllowUpload = true;

  showConstraintsDialogue: boolean = false; ConstraintsDataSource = []; RestrictionsHeader: string;
  ShowModifyRestrictions: boolean = false;  
  RestrictionForm: FormGroup;
  LoggedInScopeEntityId: number;
  LoggedInScopeEntityType: string;

  @ViewChild('RefGrid', { static: false }) public RefGrid: GridComponent;

  ConfirmationBoxMsg: string;
  public confirmHeader: string = 'Confirm';
  public confirmCloseIcon: Boolean = true;
  public confirmWidth: string = '400px';
  @ViewChild('confirmDialog', { static: false }) public confirmDialog: DialogComponent;

  constructor(private route: ActivatedRoute, private router: Router,
    private _service: MasterDataService,
    private _rendererService: FormRendererService,
    private _SupportDocService: SupportingDocumentService,
    private _wfService: FlexWorkflowsService,
    private _constraintService: ConstraintsService,
    private _roleService: RolesService,
    private _userService: UserService
  ) {

    route.params.subscribe(val => {
      this.ProjectId = +sessionStorage.getItem('ProjectId');
      this.LoggedInScopeEntityId = +sessionStorage.getItem("LoggedInScopeEntityId");
      this.LoggedInScopeEntityType = sessionStorage.getItem("LoggedInScopeEntityType");
      //get previous url
      if (this.router.getCurrentNavigation().previousNavigation != null) {
        this.Previous = this.router.getCurrentNavigation().previousNavigation.finalUrl.toString();
        sessionStorage.setItem('previousUrl', this.Previous);
      }
      //read querystring params
      this.route.params.subscribe((params: Params) => {
        this.ReferenceId = params['ReferenceId'];
        this.ShowEdit =  params['ShowEdit'];
      });
      this.LoadDefault();
      this.GetMasterDetails(this.ReferenceId);
      this.filterSettings = { type: 'Excel' };
      this.pageSetting = { pageSizes: true };
      this.constraintstoolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add', align: 'Left' },
        //{ text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit', align: 'Left' },
        { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete', align: 'Left' },
      ];

      if (this.ShowEdit =='true') {
        this.toolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add', align: 'Left' },
          { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit', align: 'Left' },
          { text: 'Exclude/Include', tooltipText: 'Exclude/Include', prefixIcon: 'e-custom-icons e-action-Icon-constraints', id: 'Constraints', align: 'Left' },
        ];
        this.AllowUpload = true;
      }
      else {
        this.AllowUpload = false;
        this.toolbar = [
          //{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add', align: 'Left' },
         ];
      }
      });
  
  }
  
  GridId;
  LoadDefault() {
    this.GridId = "Grid_" + this.ReferenceId;
    this.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.locale = Intl.DateTimeFormat().resolvedOptions().locale;
    this.offSet = new Date().getTimezoneOffset();
    //Get Grid Columns
    this.GetGridColumn();
    this.pagesize = 500;//at the time of loading the page, we dont have grid state,thats why we are setting default
    this.sortDataFieldName = "";
    this.sortOrder = "";
    //Getting data
    this.GetGridData();//First time, we will give some default pagesize
  }

  //Get Grid Column
  GetGridColumn() {
    const callback: Ajax = new Ajax(
      this.baseUrl + '/LReferenceData/GetMasterGridColumnsByRefId?ReferenceId=' + this.ReferenceId, 'GET', false, 'application/json; charset=utf-8'
    );
    callback.onSuccess = (data: any): void => {
     
      this.gridColumns = JSON.parse(data);
      this.RefGrid.refresh();
    };
    callback.send().then();
  }

  goToPrevious(): void {
    sessionStorage.setItem("IsAuth", "true");//This is to stop url tempering
    this.router.navigateByUrl('/flexwf/master-data');
  }
  GetGridData() {
    
    //When user has only View rights, show only filtered data
    //when User Has create/edit rights, show all data not filtered.
    
    let filterData = this.ShowEdit == 'true' ? false : true; 
    
    this._service.GetMasterGridDataByReferenceId(this.ReferenceId, this.pagesize, 0, this.sortDataFieldName, this.sortOrder, "", this.locale, this.timeZone, this.offSet, filterData )
      .subscribe(
        data => {
          this.ReferenceDataGridData = data;
          this.gridDataSource = { result: data, count: data.length };
          this.RefGrid.refresh();
        }
      );
  }
  notes = '';
  GetMasterDetails(ReferenceId) {
    this._service.GetMasterDetails(ReferenceId).subscribe(data => {
      this.header = data['Name'];
      this.notes = "'" + data['Name'] + "' is used in following workflows / Steps.Please double click on a row where you want to create a new Transaction.";
    })
  }
  dataStateChange(state: DataStateChangeEventArgs) { 
    let requestType = state.action.requestType;
    if (requestType == 'paging') {
      this.pagesize = state.take;
    }
    else if (requestType == 'sorting') {
      this.sortDataFieldName = state.sorted[0].name;
      this.sortOrder = state.sorted[0].direction;
    }
    this.GetGridData();
  }
  
  toolbarClick(args: ClickEventArgs): void {
    let ActionName: string;
    if (args.item.id === 'Add') {
      ActionName = 'Create';
      sessionStorage.setItem("IsAuth", "true");
      this.router.navigate(['/flexwf/form-renderer', -1, -1, ActionName, 'MasterData', this.ReferenceId, -1]);
    }
    else if (args.item.id === 'Edit' || args.item.id === 'Review') {
      ActionName = args.item.id;
      const selectedRecords = this.MasterDataGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toastObj.timeOut = 3000;
        this.toasts[3].content = "No record selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        sessionStorage.setItem("IsAuth", "true");//This is to stop url tempering
        this.router.navigate(['/flexwf/form-renderer', selectedRecords[0]['Id'], -1, ActionName, 'MasterData', this.ReferenceId, -1]);
      }

    }
    else if (args.item.id === 'Constraints') {
      const selectedRecords = this.MasterDataGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toastObj.timeOut = 3000;
        this.toasts[3].content = "No record selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.SelectedTxnId = selectedRecords[0]['Id'];
        this.RestrictionsHeader = 'Exclude/Include';
        //get existing constraints/restrictions for the txn
        this.GetRestrictionGrid();
        //this._constraintService.GetRestrictionForTxn('LReferences', this.ReferenceId, this.SelectedTxnId).subscribe(data => {
        //  this.ConstraintsDataSource = data;
        //  this.showConstraintsDialogue = true;
        //}) 
      }
    }
  }
  SelectedTxnId: number;

  GetRestrictionGrid() {
    //get existing constraints/restrictions for the txn
    this._constraintService.GetRestrictionForTxn('LReferences', this.ReferenceId, this.SelectedTxnId).subscribe(data => {
      this.ConstraintsDataSource = data;
      this.showConstraintsDialogue = true;
    }) 
  }

  ConstraintstoolbarClick(args) { 
    this.submitted = false;
    if (args.item.id === 'Add') {
       
      this.ShowModifyRestrictions = true;
      this.RestrictionForm = new FormGroup({
        Type: new FormControl('Exclude'),
        RoleId: new FormControl('',[Validators.required]),
        UserId: new FormControl('', [Validators.required]),
      })
      this.restrictionModel = new RestrictDropdownDataViewModel();
      this.restrictionModel.EntityType = 'LReferences';
      this.restrictionModel.EntityId = this.ReferenceId;
      this.restrictionModel.TransactionId = this.SelectedTxnId;
      this._roleService.getAllRoles(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
        .subscribe(rolesdata => {
        this.roleDataSource = rolesdata;
      })
    }
    else if (args.item.id === 'Edit' ) { 
      const selectedRecords = this.ConstraintsGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toastObj.timeOut = 3000;
        this.toasts[3].content = "No record selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.SelectedRestrictionId = selectedRecords[0]['Id'];
        this.RestrictionForm = new FormGroup({
          Type: new FormControl('', [Validators.required]),
          RoleId: new FormControl('', [Validators.required]),
          UserId: new FormControl('', [Validators.required]),
        })
        this.GetRestrictionById();
      }

    }
    else if (args.item.id === 'Delete') { 
      const selectedRecords = this.ConstraintsGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toastObj.timeOut = 3000;
        this.toasts[3].content = "No record selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.SelectedRestrictionId = selectedRecords[0]['Id'];
        this.ConfirmationBoxMsg = 'Are you sure you want to delete this restriction ?';
        this.confirmDialog.show();
      }

    }
  }
  GetRestrictionById() {
    this._constraintService.GetRestrictionById(this.SelectedRestrictionId).subscribe(data => {
      this.RestrictionForm.patchValue({
        Type: data.Type,
        RoleId: data.RoleId,
        UserId: data.UserIds
      })
      this.restrictionModel = new RestrictDropdownDataViewModel();
      this.restrictionModel.EntityType = data.EntityType;
      this.restrictionModel.EntityId = data.EntityId;
      this.restrictionModel.TransactionId = data.TransactionId;
      this.restrictionModel.Type = data.Type;
      this.restrictionModel.RoleId = data.RoleId;
      this.restrictionModel.UserIds = data.UserIds;
      this.restrictionModel.Id = data.Id;
      this.ShowModifyRestrictions = true;
    })
  }
  
  PopupHeader = ''; WFDataSource: any; showConfiguredWFs = false; selectedDataId: number; selectedDataValue: number;
  public recordDoubleClick(args): void {
    //this.selectedDataId = this.ReferenceId;
    this.selectedDataValue = args.rowData['Id'];
    //sessionStorage.setItem("IsAuth", "true");//This is to stop url tempering
    //this.router.navigate(['/flexwf/form-renderer', args.rowData['Id'], -1, 'Edit', 'MasterData', this.ReferenceId]);
    //On double click instead of Edit, it should check how many workflows is it configured on where this role has a 'Create' action
    this.PopupHeader = "Create Transaction";
    //If result shows nothing, give message "You do not have rights to 'Create' any workflow transaction for this master data'
    //If 1 result found, open the create page for that WF(with that column in form renderer pre - populated with that master data value)
    //If more than 1 results, show grid
    //Workflow Name, Data Filed Label where that master data used,
    
    this._service.GetWFForCreateReference(this.ReferenceId).subscribe(data => {
      if (data.length == 0) {
        this.toastObj.timeOut = 0;
        this.toasts[3].content = "You do not have rights to 'Create' any workflow transaction for this master data";
        this.toastObj.show(this.toasts[3]);
      }
      else if (data.length == 1) {
        let WorkflowId = data[0]['WorkflowId'];
        let StepId = data[0]['StepId'];
        this.selectedDataId = data[0]['Id'];
        let Type = data[0]['Type']; 
        this.NavigateToCreateForm(WorkflowId, StepId,Type); 
      }
      else {
        this.WFDataSource = data
        this.showConfiguredWFs = true;
      }
    })
    
  }

  rowSelected(args) {
    let WorkflowId = args.data['WorkflowId'];
    let StepId = args.data['StepId'];
    this.selectedDataId = args.data['Id'];
    let Type = args.data['Type']; 
    this.NavigateToCreateForm(WorkflowId, StepId,Type);
    
  }

  NavigateToCreateForm(WorkflowId, StepId,Type) {
   // let UserRoleId = sessionStorage.getItem('UserRoleId');
    sessionStorage.setItem("IsAuth", "true");//This is StepId stop url tempering
    if (Type == 'FormGrid') {
      this.router.navigate(['/flexwf/form-renderer', -1, StepId, 'Create', 'workflow', WorkflowId,-1]);//open blank form
    }
    else {
      this.router.navigate(['/flexwf/form-renderer', -1, StepId, 'Create', 'workflow', WorkflowId, this.selectedDataId, this.selectedDataValue]);
    }
  }

  FilePath: string;
  ProjectName: string = sessionStorage.getItem("DefaultEntityName");
  TargetPath: string;
  DownloadTemplate() {
    this.FilePath = "/" + this.ProjectId + "_" + this.ProjectName + "/MasterData/" + this.header;
    this.TargetPath = this.FilePath + "/attachments";
    let TemplatePath = this.FilePath + "/template";
    this._rendererService.GenerateTemplateFileName(this.ProjectId, "LReferences", this.ReferenceId)
      .subscribe(filename => {
        this._SupportDocService.DownloadFromS3(TemplatePath + "/" + filename);
      })

  }
  OpenUploader() {
    sessionStorage.removeItem("UploadedFile");
    //this.showUploader = true;
    this.router.navigate(['/flexwf/TransactionUpload', 'LReferences', this.ReferenceId, this.ProjectId, this.ReferenceId]);

  }

  SelectedRestrictionId: number;
  @ViewChild('restrictionList', { static: false }) public restrictionList: DropDownListComponent;
  public restrictionDataSource: Object[] = [
    { text: "Exclude", value: "Exclude" },
    { text: "Include", value: "Include" } 
  ];

  public restrictionFields: Object = { text: 'text', value: 'value' };
  @ViewChild('roleList', { static: false })  public roleList: DropdownsComponent;
  public roleFields: Object = { text: 'RoleName', value: 'Id' };
  public roleDataSource: Object[] = [];

  @ViewChild('userList', { static: false }) public userList: DropdownsComponent;
  public userFields: Object = { text: 'LoginEmail', value: 'Id' };
  public UserDataSource: Object[] = [];

  restrictionModel: RestrictDropdownDataViewModel;
  onChangeRole(args) {
    let RoleId = args.value;
    this.restrictionModel.RoleId = RoleId;
    this._userService.GetByRoleId(RoleId).subscribe(users => {
      this.UserDataSource = users;
    })
  }
  submitted = false;

  get f() { return this.RestrictionForm.controls; }

  public confirmDlgYesBtnClick = (): void => {
    this.confirmDialog.hide();
    this._constraintService.DeleteRestrictions(this.SelectedRestrictionId)
      .subscribe(
        data => {
          this.toastObj.timeOut = 2000;
          this.toasts[1].content = "Deleted Successfully";
          this.toastObj.show(this.toasts[1]);
          this.GetRestrictionGrid();
          setTimeout(() => { window.location.reload(); }, 2000);
        }
      );

  }
  hidden: boolean = false;
  public confirmDlgBtnNoClick = (): void => {
    this.confirmDialog.hide();
    return;
  }
  public confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmDlgYesBtnClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];


  UpdateRestrictions() {
    this.submitted = true;
    if (this.RestrictionForm.invalid) {
      return;
    } 
    this.restrictionModel.Type = this.RestrictionForm.get('Type').value;
    this.restrictionModel.UserIds = this.RestrictionForm.get('UserId').value; 
    this._constraintService.AddRestrictions(this.restrictionModel).subscribe(data => {
      this.toasts[1].content = "Data updated successfully";
      this.toastObj.timeOut = 3000;
      this.toastObj.show(this.toasts[1]);
      setTimeout(() => {
        this.ShowModifyRestrictions = false;
        this.GetRestrictionGrid();
      }, 3000);
    })
  }
}
