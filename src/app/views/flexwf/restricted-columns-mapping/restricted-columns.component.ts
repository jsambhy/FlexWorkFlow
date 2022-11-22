import { Component, ViewChild } from '@angular/core';

import { Ajax } from '@syncfusion/ej2-base';
import { PageService, EditService, GridComponent } from '@syncfusion/ej2-angular-grids';
import { ToastPositionModel, ToastComponent } from '@syncfusion/ej2-angular-notifications';
import { environment } from '../../../../environments/environment';
import { MenuRoleService } from '../../../services/menu-role.service';
import { DataFieldService } from '../../../services/data-fields.service';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { FormGroup, FormControl } from '@angular/forms';
import { RestrictionsModel } from '../../../models/restrictions.model';
import { rolesModel, RoleViewModel } from '../../../models/rolesModel';

@Component({
  selector: 'app-restricted-columns',
  templateUrl: './restricted-columns.component.html',
  styleUrls: ['./restricted-columns.component.css'],
  providers: [PageService, EditService, DataFieldService]
})
/** menu-role-mapping component*/
export class RestrictedColumnsComponent {
  public ProjectId: Number;
  public gridColumns: RoleViewModel[];
  public gridDataSource: any;
  public initialPage: Object;
  public editSettings;
  public UpdatedColumnId: number;
  public selectedMatrixdata: Object[] = [];

  @ViewChild('Grid', { static: false }) public Grid: GridComponent;

  @ViewChild('toasttype', { static: false })
  private toastObj: ToastComponent;
  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };
  LoggedInRoleId: number;
  LoggedInUserId: number;
  EntityId: number;
  EntityType: string;
  ShowGrid = false;
  ShowSaveButton = false;
  SelectedWorkflow: string='';
  //Workflow Dropdown
  @ViewChild('WorkflowlistObj', { static: false }) public WorkflowlistObj: DropDownListComponent;
  public workflowList: Object[] = [{ text: "Workflow", value: "FlexTables" },
    { text: "Master Data", value: "MasterData" }, 
    { text: "Form Grid", value: "FormGrid" }];
  public WorkflowFields: Object = { text: 'text', value: 'value' };
  //EntityList Dropdown
  public EntityIdList: Object[];
  public EntityIdFields: Object = { text: 'DisplayTableName', value: 'Value' };
  @ViewChild('EntityIdlistObj', { static: false }) public EntityIdlistObj: DropDownListComponent;


  readonly baseUrl = environment.baseUrl;
  LoggedInScopeEntityId: number;
  LoggedInScopeEntityType: string;


  constructor(private _dataFieldService: DataFieldService) {
    this.LoggedInUserId = + sessionStorage.getItem('LoggedInUserId');
    this.LoggedInRoleId = + sessionStorage.getItem('LoggedInRoleId');
    this.LoggedInScopeEntityId = +sessionStorage.getItem("LoggedInScopeEntityId");
    this.LoggedInScopeEntityType = sessionStorage.getItem("LoggedInScopeEntityType");
  }
  

  ngOnInit(): void {
   
    this.initialPage = { pageSizes: true, pageCount: 4 };
    this.editSettings = { allowEditing: true};
    this.ProjectId = +sessionStorage.getItem("ProjectId");
    
       
  }
  public onChangeWorkflow(args: any): void {
    this.EntityType = args.value;
    
    //populate Entity
    this._dataFieldService.GetTableNamesByProjectIdWithType(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId, this.EntityType)
      .subscribe(result => {
        this.EntityIdlistObj.text = null;//clear the existing selection
        this.EntityIdList = result;
        
      });
  }
  participantDataSource: any;
  public participantFields: Object = { text: 'RoleName', value: 'Id' };
  @ViewChild('ParticipantList', { static: false }) public ParticipantList: DropDownListComponent;
  RestrictionTypeDataSource = [{ text: "None", value: "None" }, { text: "Readonly", value: "Readonly" }, { text: "Hidden", value: "Hidden" }];
  public RestrictionTypeFields: Object = { text: 'text', value: 'value' };
  @ViewChild('RestrictionTypeList', { static: false }) public RestrictionTypeList: DropDownListComponent;


  public onChangeSelecter(args: any): void {
    this.EntityId = args.value;
    let text = args.itemData['DisplayTableName'].replace(/\s/g, "");
    this.GridLoop = [{ 'Text': text,'Value': args.value}];
    this.ShowSaveButton = true;
    
   // this.GetGridColumns();
    this.GetGridData();
    this._dataFieldService.GetColumnForRestrictedColumnsMapping(this.EntityType, this.EntityId, this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
      .subscribe(ParticipantData => {
        this.participantDataSource = ParticipantData;
       // this.GetGridDetails();
      })
  }
  GetGridColumns() {
     
    const callback: Ajax = new Ajax(
      this.baseUrl + '/DataFields/GetColumnForRestrictedColumnsMapping?EntityType=' + this.EntityType +
      '&EntityId=' + this.EntityId + "&ScopeEntityType=" + this.LoggedInScopeEntityType + "&ScopeEntityId=" + this.LoggedInScopeEntityId, 'GET', false, 'application/json; charset=utf-8'
    );
    callback.onSuccess = (data: any): void => {
      this.gridColumns = JSON.parse(data); 
      console.log('cols: ' + this.gridColumns);
    };
    callback.send().then();

   
  }
  participantGridDataSource: any; GridId = ""; GridLoop :any;
  GetGridData() {
    this._dataFieldService.GetRestrictedColumns(this.EntityType, this.EntityId, this.ProjectId)
      .subscribe(
        data => {
          this.GridId = "Grid_" + this.EntityId;
          this.gridDataSource = data; 
          this.participantGridDataSource = { result: data, count: data.length };
          this.ShowGrid = true;
        }
      );
  }

  //dialogue settings
  public animationSettings: Object = { effect: 'Zoom', duration: 400, delay: 0 };
  ShowModifyRestrictions = false;
  PopupHeader = ""; SelectedDatafieldId: number; RestrictionForm: FormGroup;
  restrictionValue = ""; model: RestrictionsModel = new RestrictionsModel();;
  public recordDoubleClick(args): void {
    this.ShowModifyRestrictions = true;
    this.SelectedDatafieldId = args.rowData['ColumnId'];
    this.PopupHeader = "Edit Restriction for " + args.rowData['ColumnName'];
    this.RestrictionForm = new FormGroup({
      RestrictionType: new FormControl(''),
      Comments: new FormControl(''),
      Participant: new FormControl(''),
    })
  }

  //ItemcheckedEvent(RoleName, e): void {//this event will be called when checkbox in matrix will get checked/unchecked
  //  const selectedRecords = this.Grid.getSelectedRecords();
  //  if (selectedRecords.length != 0) {
  //    this.UpdatedColumnId = selectedRecords[0]['ColumnId'];
  //  }
    
  //  this.selectedMatrixdata.push({
  //    ColumnId: this.UpdatedColumnId, RoleName: RoleName, NewResponse: e.checked,
  //    ProjectId: this.ProjectId, LoggedInUserId: this.LoggedInUserId, LoggedInRoleId: this.LoggedInUserId
  //  });
  //}

  //fnSaveMappingdata() {
  //  this._dataFieldService.SaveMappingData(this.selectedMatrixdata)
  //    .subscribe(
  //      data => {
  //        this.toasts[1].content = "Date saved successfully";
  //        this.toastObj.timeOut = 3000;
  //        this.toastObj.show(this.toasts[1]);
  //        setTimeout(() => { this.GetGridData(); }, 3000);
  //      }
  //    );
  //}

  onChangeParticipant(args) {
    //get selected Participantinfo for datafield 
    let ParticipantId = args.value;
    this._dataFieldService.GetFieldRestrictionsForParticipant(ParticipantId, this.SelectedDatafieldId)
      .subscribe(data => {
        this.model = data;
        if (data != null) {
          this.restrictionValue = data.RestrictionType
          this.RestrictionForm.patchValue({
            RestrictionType: data.RestrictionType,
            Comments: data.Comments,
            Participant: data.RoleId
          })
        } else {
          this.restrictionValue = 'None';
          this.RestrictionForm.patchValue({
            RestrictionType: 'None',
            Comments: '',
            Participant: ParticipantId
          })
        }
    })
  }

  UpdateRestrictions() {
    
    if (this.model == null) {
      this.model = new RestrictionsModel();
      this.model.CreatedByRoleId = this.LoggedInRoleId;
      this.model.CreatedDateTime = new Date();
      this.model.CreatedById = this.LoggedInUserId;
    }
    this.model.DataFieldId = this.SelectedDatafieldId;
    this.model.UpdatedDateTime = new Date();
    this.model.UpdatedByRoleId = this.LoggedInRoleId;
    this.model.UpdatedById = this.LoggedInUserId;
    this.model.Comments = this.RestrictionForm.get('Comments').value;
    this.model.RestrictionType = this.RestrictionForm.get('RestrictionType').value;
    this.model.RoleId = this.RestrictionForm.get('Participant').value;
    //save data
    this._dataFieldService.UpdateRestrictedColumnsMapping(this.model).subscribe(data => {
      this.toasts[1].content = "Data updated successfully";
      this.toastObj.timeOut = 3000;
      this.toastObj.show(this.toasts[1]);
      this.ShowModifyRestrictions = false;
      setTimeout(() => { this.GetGridData(); }, 3000);
    })
  }

}
