import { Component, ViewChild } from '@angular/core';
import { MasterDataService } from '../../../services/master-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GridComponent, FilterSettingsModel, ToolbarItems, PageSettingsModel, SelectionSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ToastPositionModel, ToastComponent } from '@syncfusion/ej2-angular-notifications';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { LReferenceModel } from '../../../models/lreference-model';
import { RolesService } from '../../../services/roles.service';
import { MultiSelectComponent, DropDownListComponent, SelectEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { environment } from '../../../../environments/environment';
import { Ajax } from '@syncfusion/ej2-base';
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
import { SupportingDocumentService } from '../../../services/supporting-document.service';
import { CheckBoxComponent, RadioButtonComponent } from '@syncfusion/ej2-angular-buttons';
import { DropdownsComponent } from '../../buttons/dropdowns.component';
import { UserService } from '../../../services/user.service';
import { FlexWorkflowsService } from '../../../services/flex-workflows.service';
import { isUndefined } from 'util';
import { RWorkFlows } from '../../../models/rworkflow-model';
@Component({
  selector: 'app-reference',
  templateUrl: './references.component.html',
  styleUrls: ['./references.component.css'],
})
export class ReferencesComponent {
  ProjectId: number;
  LoggedInUserId: number;
  LoggedInRoleId: number;
  LoggedInScopeEntityId: number;
  LoggedInScopeEntityType: string;
  showConfirmDialog: boolean = false;

  showUploader: boolean = false;
  IsEdit: boolean = false;
  ProjectName: string = sessionStorage.getItem("DefaultEntityName");
  HelpFilePath: string;
  TargetPath: string;
  HelpFileName: string;
  
  @ViewChild('tagging', { static: false }) public tagging: CheckBoxComponent;
  //creating viewChilds for the componenets that needs to be used
  @ViewChild('confirmDialog', { static: false }) public confirmDialog: DialogComponent;
  public confirmcontent: string = "Data Fields are not configured, Do you want to configure now?";

  public confirmDlgYesBtnClick = (): void => {
    const selectedRecords = this.MasterDataGrid.getSelectedRecords();
    if (selectedRecords.length == 0) {
      this.toastObj.timeOut = 3000;
      this.toasts[3].content = "No record selected for this operation";
      this.toastObj.show(this.toasts[3]);
    }
    else {
      sessionStorage.setItem("IsAuth", "true");//This is to stop url tempering
      this.router.navigate(['/flexwf/form-labels', 'MasterData', selectedRecords[0]['Id']]);
    }
    this.showConfirmDialog = false;
    this.confirmDialog.hide();
    return;
  }

  public confirmDlgBtnNoClick = (): void => {
    this.showConfirmDialog = false;
    this.confirmDialog.hide();
    return;
  }
  //Delete WF confirmation box definition
  public confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmDlgYesBtnClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];
  public roleForUserDataSource: any[];
  public fieldsForUser: Object = { text: 'RoleName', value: 'RoleName' };
  public roleDataSource: any[];
  // maps the appropriate column to fields property
  public fields: Object = { text: 'RoleName', value: 'Id' };
  public RoleValueList: number[] = new Array();
  public ViewRoleValueList: number[] = new Array();

  public MasterDataForGrid: any[];
  @ViewChild('MasterDataGrid', { static: false })
  public MasterDataGrid: GridComponent;
  public filterSettings: FilterSettingsModel;
  lines: string;
  public toolbar: ToolbarItems[] | object;
  public editSettings: Object;
  readonly baseUrl = environment.baseUrl;
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

  MasterDataForm: FormGroup;
  ShowPopupForCreate: boolean = false;
  ShowAddBtn: boolean = false;
  ShowUpdateBtn: boolean = false;
  header: string;
  WorkflowId: number;
  //Popup Dialogue
  //@ViewChild('CreateDialogue', { static: false }) public CreateDialogue: DialogComponent;
  public animationSettings: Object = { effect: 'Zoom', duration: 400, delay: 0 };
  model: LReferenceModel;

  @ViewChild('roleList', { static: false })
  public roleList: DropdownsComponent;
  @ViewChild('roleListForUser', { static: false })
  public roleListForUser: DropdownsComponent;

  RefName: string;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private _service: MasterDataService,
    private _WFservice: FlexWorkflowsService,
    private _roleService: RolesService,
    private _SupportingDocService: SupportingDocumentService,
    private _UserService: UserService) {
    this.ProjectId = +sessionStorage.getItem('ProjectId');
    this.LoggedInUserId = +sessionStorage.getItem('LoggedInUserId');
    this.LoggedInRoleId = +sessionStorage.getItem('LoggedInRoleId');
    this.LoggedInScopeEntityId = +sessionStorage.getItem("LoggedInScopeEntityId");
    this.LoggedInScopeEntityType = sessionStorage.getItem("LoggedInScopeEntityType");
    this.WorkflowId = +sessionStorage.getItem("WorkflowId");

    this.model = new LReferenceModel();
  }

  ngOnInit() {
    this.selectionOptionsForTag = { type: 'Multiple' };
    this.filterSettings = { type: 'Excel' };
    this.lines = 'Both';
    this.toolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add', align: 'Left' },
      { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit', align: 'Left' },
      { text: 'Data Fields', tooltipText: 'Data Fields', prefixIcon: 'e-custom-icons e-action-Icon-datafields', id: 'DataFields', align: 'Left' },
      { text: 'Data', tooltipText: 'Data', prefixIcon: 'e-custom-icons e-action-Icon-wysiwyg', id: 'Data', align: 'Left' },
    ];
    //this.editSettings = { allowEditing: true, allowAdding: true, /*allowDeleting: true,*/ mode: 'Dialog' };
    this.GetGrid();
    this._roleService.getAllRoles(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId).subscribe(rolesdata => {
      this.roleDataSource = rolesdata;
    })

    this.MasterDataForm = new FormGroup({
      Name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      Description: new FormControl(),
      MappedRole: new FormControl(),
      MappedViewRole: new FormControl(),
      Allocations: new FormControl(false)
    });
    this.GetTagsByEntity();
  }
  submitted = false;
  goToPrevious() { }
  get f() { return this.MasterDataForm.controls; }


  @ViewChild('TagGrid', { static: false })
  public TagGrid: GridComponent;

  selectedTagIndexes = [];
  onTabSelect(args ) {
    
    this.selectedTagIndexes = [];
    if (args.selectedIndex == 1)//Attribute tab
    {
      this.SelectedTagIdList = ''; // setting to blank string as we are creating this string while populating model altgether 
      this._WFservice.GetSelectedTagsByEntity("LReferences", this.selectedReferenceId)
        .subscribe(
          (SelecedTagData) => {
            if (SelecedTagData.length != 0) {
              for (let i = 0; i < SelecedTagData.length; i++) {
                (this.TagGrid.dataSource as object[]).forEach((sdata, index) => {
                  if (sdata["Id"] === SelecedTagData[i]['TagCategoryId']) {
                    this.selectedTagIndexes.push(index);
                  }
                });
              }
            }
             //This was working in test but in dev it is late binding issue
            this.TagGrid.selectRows(this.selectedTagIndexes); 
          }
        );
    }
  }

   //This was working in dev but in test it is not working due to early calling before setting selectedTagIndexes
  //tagGridDataBound(args) {

  //  if ( !isUndefined( this.TagGrid))
  //    this.TagGrid.selectRows(this.selectedTagIndexes); 
  //}


  public recordDoubleClick(args): void {
    //
    this.GetById(args.rowData['Id']);
    this.header = "Edit Master Data";
    this.ShowPopupForCreate = true;
    this.ShowAddBtn = false;
    this.ShowUpdateBtn = true;
    this.IsEdit = true;
    this.HelpFileName = null;
    sessionStorage.removeItem("UploadedFile");  
  }
   

  selectedReferenceId : number;
  //toolbarclick event
  toolbarClick(args: ClickEventArgs): void {
    let ActionName: string; 
    if (args.item.id === 'Add') {
      ActionName = 'Create'
      this.MasterDataForm.setValue({
        Name: '', Description: null, MappedRole: null, MappedViewRole:null, Allocations:false
      });
      this.header = "Create Master Data";
      this.ShowPopupForCreate = true;
      this.ShowAddBtn = true;
      this.ShowUpdateBtn = false;
      this.roleListForUserValue = '';
    }
    else if (args.item.id === 'Edit') {

      this.IsEdit = true;
      this.HelpFileName = null;
      sessionStorage.removeItem("UploadedFile");

      ActionName = 'Edit'
      const selectedRecords = this.MasterDataGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toastObj.timeOut = 3000;
        this.toasts[3].content = "No record selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.selectedReferenceId = selectedRecords[0]['Id'];
        this.GetById(selectedRecords[0]['Id']);
        this.header = "Edit Master Data";
        this.ShowPopupForCreate = true;
        this.ShowAddBtn = false;
        this.ShowUpdateBtn = true;
      }
      
    }
    else if (args.item.id === 'DataFields') {
      const selectedRecords = this.MasterDataGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toastObj.timeOut = 3000;
        this.toasts[3].content = "No record selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        sessionStorage.setItem("IsAuth", "true");//This is to stop url tempering
        this.router.navigate(['/flexwf/form-labels', 'MasterData', selectedRecords[0]['Id']]);
      }
    }
    else if (args.item.id === 'Data') {
      const selectedRecords = this.MasterDataGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toastObj.timeOut = 3000;
        this.toasts[3].content = "No record selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        //when Type = FormGrid, Dont let user to enter Data
        let type = selectedRecords[0]['Type'];
        if (type == 'FormGrid') {
          this.toastObj.timeOut = 3000;
          this.toasts[3].content = "You can not enter data for Form Grid as it is used for user input in forms.";
          this.toastObj.show(this.toasts[3]);
          return;
        }
        const callback: Ajax = new Ajax(
          this.baseUrl + '/LReferenceData/GetMasterGridColumnsByRefId?ReferenceId=' + selectedRecords[0]['Id'], 'GET', false, 'application/json; charset=utf-8'
        );
        callback.onSuccess = (data: any): void => {
          if (JSON.parse(data).length == 0) {
            //this.toastObj.timeOut = 3000;
            //this.toasts[3].content = "Please configure data fields and then proceed.";
            //this.toastObj.show(this.toasts[3]);
            this.showConfirmDialog = true;
            this.confirmDialog.show();
          }
          else {
            sessionStorage.setItem("IsAuth", "true");//This is to stop url tempering
            this.router.navigate(['/flexwf/RefData', selectedRecords[0]['Id'],true]);
          }
        };
        callback.send().then();
       
      }
    }


  }
  GetGrid() {
    
    this._service.GetMasterDataByEntity(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId).subscribe(data => {
      this.MasterDataForGrid = data;
    })
  }
  GetById(Id) {
    let roleId: any[] = new Array();
    let viewRoleId: any[] = new Array();
    this._service.GetById(Id)
      .subscribe(data => {
        
        this.RefName = data.Name;
        //This path will use for uploading the help file
        this.TargetPath = "/" + this.ProjectId + "_" + this.ProjectName + "/masterdata/" + data.Name + "/help";

        this.model = data;
        const callback: Ajax = new Ajax(
          this.baseUrl + "/LReferences/GetRoleMapping?ReferenceId=" + Id, 'GET', false, 'application/json; charset=utf-8'
        );
        callback.onSuccess = (rolesdata: any): void => {
          let configRoleData = JSON.parse(rolesdata)['configRoleData'];
          let viewRoleData = JSON.parse(rolesdata)['viewRoleData'];
          //let Roles = JSON.parse(rolesdata);
          for (let j = 0; j < configRoleData.length; j++) {
            roleId.push(configRoleData[j]);
          }
          this.RoleValueList = roleId;
          for (let j = 0; j < viewRoleData.length; j++) {
            viewRoleId.push(viewRoleData[j]);
          }
          this.ViewRoleValueList = viewRoleId;
        };
        callback.send().then(); 
        let type = data.Type;
        this.RefTypeValue = type;
        if (type == 'Users') { 
          this.roleListForUserValue = data.Name;
          this.GetRolesListforUserRefData(); 
          this.showFields = false;
        }
        //else if (type == 'MasterData') {
        //  this.masterdatachecked = true;
        //  this.userschecked = false;
        //  this.IsMasterData = true;
        //}
        else
        {
          //this.masterdatachecked = false;
          //this.userschecked = false;
          //this.formgridchecked = true;
          //this.IsMasterData = true; 
          this.showFields = true;
        }
        this.MasterDataForm.patchValue({
          Name: data.Name,
          Description: data.Description,
          MappedRole: roleId,
          MappedViewRole:viewRoleId,
          Allocations: data.IsPortfolioEnabled
        });

        //Need to show the Help FileName on the pop up
        if (data.HelpFilePath != '' && data.HelpFilePath != null)
        {
          this.HelpFilePath = data.HelpFilePath;
          var Array = this.HelpFilePath.split("/");
          this.HelpFileName = Array[Array.length - 1];
        }
      })
   }



  SelectedTagIdList: string = "";
  GetSelectedTags() {
    if (this.TagGrid != undefined) {
      var SelecedTags = this.TagGrid.getSelectedRecords();
      for (let i = 0; i < SelecedTags.length; i++) {
        this.SelectedTagIdList = this.SelectedTagIdList + SelecedTags[i]['Id'] + "^";
      }
      this.SelectedTagIdList = this.SelectedTagIdList.substring(0, (this.SelectedTagIdList.length) - 1);
    }
  }

  Save() {
    this.submitted = true; 
    if (this.MasterDataForm.invalid) {
      return;
    }
    this.GetSelectedTags();
    this.PopulateModelData();
    this.model.CreatedById = this.LoggedInUserId;
    this.model.CreatedByRoleId = this.LoggedInRoleId; 
    this.model.CreatedDateTime = new Date();
    this.model.ScopeEntityType = this.LoggedInScopeEntityType;
    this.model.ScopeEntityId = this.LoggedInScopeEntityId;
    this._service.AddNewReferenceWithoutData(this.model).subscribe(data => {
      this.toastObj.timeOut = 3000;
      this.toasts[1].content = "Data Saved successfully.";
      this.toastObj.show(this.toasts[1]);
      this.ShowPopupForCreate = false;
      this.GetGrid();
    }
    )
  }

  Update() {
    
    this.GetSelectedTags();
    this.PopulateModelData();

    var UploadedFileInfo = JSON.parse(sessionStorage.getItem("UploadedFile"));
    sessionStorage.removeItem("UploadedFile");
    if (UploadedFileInfo != null) {
      this.model.HelpFilePath = this.TargetPath + "/" + UploadedFileInfo[0].FileName;//In case of Image uploading, only  one file is allowed thats why we are taking Filename from zeroth element
    }

    this._service.UpdateReference(  this.model).subscribe(data => {
      this.toastObj.timeOut = 3000;
      this.toasts[1].content = "Data updated successfully.";
      this.toastObj.show(this.toasts[1]);
      this.ShowPopupForCreate = false;
      this.GetGrid();
    });

  }

  PopulateModelData() {
    this.model.UpdatedById = this.LoggedInUserId; this.model.UpdatedByRoleId = this.LoggedInRoleId;
    this.model.UpdatedDateTime = new Date();
    this.model.Name = this.MasterDataForm.get('Name').value;
    this.model.Description = this.MasterDataForm.get('Description').value;
    this.model.MappedRoleIds = this.MasterDataForm.get('MappedRole').value;
    this.model.MappedViewRoleIds = this.MasterDataForm.get('MappedViewRole').value;
    this.model.IsPortfolioEnabled = (this.tagging==undefined) ? false : this.tagging.checked;
    this.model.ScopeEntityType = this.LoggedInScopeEntityType;
    this.model.ScopeEntityId = this.LoggedInScopeEntityId;
    this.model.Type = this.RefTypeValue;
    this.model.SelectedTagIdList = this.SelectedTagIdList;
  }

  //This function is used to just open the dialog box of uploader
  FileUpload() {
    this.showUploader = true;
  }

  PostUploadEvent() { 
    var UploadedFileInfo = JSON.parse(sessionStorage.getItem("UploadedFile"));
    if (UploadedFileInfo != null) {
      this.HelpFileName = UploadedFileInfo[0].FileName;
    }
  }

  DownloadHelpFile() {
    this._SupportingDocService.DownloadFromS3(this.HelpFilePath);
  }
  @ViewChild('masterDataType', { static: false }) public masterDataType: DropDownListComponent;
  public RefTypeFields: Object = { text: 'text', value: 'value' };
  public RefTypeDataSource: any[] = [{ text: 'MasterData', value: 'MasterData' },
    { text: 'Users', value: 'Users' }, { text: 'FormGrid', value: 'FormGrid' }];
  RefTypeValue: string = "MasterData";
  //@ViewChild('masterDataType', { static: false }) public masterDataType: RadioButtonComponent;
  public selectedmasterDataType: string;
  //IsMasterData: boolean = true;

  headerText: Object = [{ text: "MasterData" }, { text: "Tag Category" }];
  //masterdatachecked = true;
  //userschecked = false;
  //formgridchecked = false;
  showFields = true;
  roleListForUserValue = "";
  TagData: any[];
  selectionOptionsForTag: SelectionSettingsModel;
  
  GetTagsByEntity() {
    debugger
    
    this._UserService.GetEntityTags(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
      .subscribe(
        data => {
          this.TagData = data;
        }
      );
  }
  optionChanged() { 
    this.RefTypeValue = this.masterDataType.text;
    if (this.masterDataType.text === "MasterData") {
      this.selectedmasterDataType = "MasterData";
      this.showFields = true;
    }
    else if (this.masterDataType.text === "Users") {
      this.selectedmasterDataType = "Users";
      this.showFields = false;
      this.GetRolesListforUserRefData();
    }
    if (this.masterDataType.text === "FormGrid") {
      this.selectedmasterDataType = "FormGrid";
      this.showFields = true;
    }
  }

  GetRolesListforUserRefData() {
    this._roleService.GetRolesListforUserRefData(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId).
      subscribe(rolesdata => {
        this.roleForUserDataSource = rolesdata;
        this.roleForUserDataSource.push({ 'RoleName': this.roleListForUserValue })
    })
  }
}

