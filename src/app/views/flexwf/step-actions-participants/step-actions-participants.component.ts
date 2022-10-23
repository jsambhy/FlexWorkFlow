import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FreezeService, GridComponent, GridLine, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { Router } from '@angular/router';
import { StepActionsParticipantsService } from '../../../services/step-actions-participants.service';
import { StepColumnsService } from '../../../services/step-columns.service';
import { WorkflowdesignerService } from '../../../services/workflowdesigner.service';
import { stepparticipantsmodel } from '../../../models/step-participants-model';
import { LRoles } from '../../../models/RoleModel';
import { StepActionsService } from '../../../services/step-actions.service';
import { MultiSelectComponent } from '@syncfusion/ej2-angular-dropdowns';
import { StepParticipantsService } from '../../../services/step-participants.service';
import { RadioButtonComponent, RadioButton } from '@syncfusion/ej2-angular-buttons';
@Component({
  selector: 'app-step-actions-participants',
  templateUrl: './step-actions-participants.component.html',
  styleUrls: ['./step-actions-participants.component.css'],
  providers: [FreezeService, StepColumnsService, StepActionsParticipantsService, StepActionsService, StepParticipantsService]
})
/** step-actions-participants component*/
export class StepActionsParticipantsComponent {
  constructor(private router: Router, private _workflowservice: WorkflowdesignerService,
    private _service: StepActionsParticipantsService,
    private _colservice: StepColumnsService,
    private _participantservice: StepParticipantsService,
    private _StepActionsService: StepActionsService) {
    this.AssignActionForm = new FormGroup({
      stepdrpcontrol: new FormControl('', [Validators.required]),
      participantcontrol: new FormControl('', [Validators.required]),
      ParticipantTypeValue: new FormControl('', [Validators.required]),
      HierarchyTypedrpcontrol: new FormControl(''),
      LevelValue: new FormControl(''),
      PositionTypedrpcontrol: new FormControl('')
    });
  }
  // getting parent from component message
  @Input() configuringstepid: number;
  @Input() configuringWFId: number;
  @Input() configuringFlexTableId: number;
  @Input() configuringWFLabel: string;
  @Input() configuringstepname: string;
  @Input() level: string;

  @ViewChild('toasttype', { static: false }) private toastObj: ToastComponent;
  @ViewChild('grid', { static: false }) public grid: GridComponent;
  @ViewChild('participantactionsdlg', { static: false }) public participantactionsdlg: DialogComponent;
  @ViewChild('radiobutton', { static: false }) public radiobutton: RadioButtonComponent;
  public Columns: LRoles[]; public LChecked: boolean = false; public JRChecked: boolean = true;
  public showStepLabel: boolean = false;
  public showmultiselect: boolean = true;
  AssignActionForm: FormGroup = null;
  public matrixData: any[];
  public ActionWidth: number = 120;
  public RoleWidth: number = 80;
  public GridHeight: number = 150;
  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  returnUrl: string; //URL for navigating to Roles Screen
  public SelectedActionName: string;
  public position: ToastPositionModel = { X: 'Center' };
  public stepparticipantmodeldata: stepparticipantsmodel[];
  participantmodel: stepparticipantsmodel = new stepparticipantsmodel();//declaring and initializing the variable to use further  
  public ShowMatrixpopup: boolean = false;
  public lines: GridLine;
  public toolbar: ToolbarItems[] | object;
  public editSettings: Object;
  public steps: string[];
  public fields: Object = { text: 'Label', value: 'Id' };
  public Participants: string[]; public HTypeSource: string[]; public PTypeSource: string[];
  public participantsFields: Object = { text: 'Label', value: 'Id' };
  public HTypefields: Object = { text: 'Label', value: 'Id' };
  public showStepDropdown: boolean;
  public showgrid: boolean;
  public projectId: number;
  public sessionprojectid: string;
  public Actions: string;
  public MatrixStepActionId: number;
  public Step_count: number;
  public DataField_count: number;
  public LandingPage_count: number;
  public Action_count: number;
  public Notification_count: number;
  public manageactiononParticipant: boolean;
  public showmanageactions: boolean;
  showmanagenotifications: boolean;
  public selectedStepId: number;
  public selectedStepLabel: string;
  public dvLinksOnGrid: boolean; public showHierarchyTypeDropdown: boolean = false;
  public selectedMatrixdata: Object[] = [];//array in which all the selected items will get pushed(rollname,stepid,stepactionid..etc)
  public ShowActionVisibility: boolean = false;
  public showLevelTxtbox: boolean = false;
  public showPositionTypeDD = false;
  get f1() { return this.AssignActionForm.controls; }
  isDialog: boolean;
  LoggedInScopeEntityId: number;
  LoggedInScopeEntityType: string;
  @ViewChild('participantcontrol', { static: false })
  public participantcontrol: MultiSelectComponent;

  PostNotificationEvent() {
    this.showmanagenotifications = false;
  }
  PostRolesEvent() {
    this.showManageRoles = false;
  }
  PostStepActionEvent() {
    this.showmanageactions = false;
    this.fnGetDataForMapping(this.configuringstepid);
  }
  dialogClose() {
    //window.location.reload();
    this.PostMatrixEvent.emit();
  }
  @Output() PostMatrixEvent = new EventEmitter();
  ManageRoledialogClose() {
    this.showManageRoles = false;
  }

  ngOnInit() {
    this.ShowMatrixpopup = true;
    this.returnUrl = '/roles';
    this.sessionprojectid = sessionStorage.getItem("ProjectId");
    this.LoggedInScopeEntityId = +sessionStorage.getItem("LoggedInScopeEntityId");
    this.LoggedInScopeEntityType = sessionStorage.getItem("LoggedInScopeEntityType");
    this.projectId = +this.sessionprojectid; // conversion from string to int   
    this.lines = 'Both';
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    if (this.level == "steplevel") {
      this.showStepLabel = true;
      this.showStepDropdown = false;
      this.dvLinksOnGrid = true;
      this.manageactiononParticipant = true;
    }

    if (this.level == "workflowlevel") {
      this.showStepLabel = false;
      this.showgrid = false;
      this.manageactiononParticipant = false;
      this.dvLinksOnGrid = false;
      this._colservice.getAllSteps(this.configuringWFId, this.configuringWFLabel)
        .subscribe(
          data => {
            this.steps = (data);
          }
        );
      this.showStepDropdown = true;
    }
  }
  SelectedStepActionId: number;
  rowSelected(para) {
    this.SelectedActionName = para.data.ActionName;
    this.SelectedStepActionId = para.data.StepActionId;
  }
  LoggedInRoleId: number = +sessionStorage.getItem("LoggedInRoleId");
  LoggedInUserId: number = +sessionStorage.getItem("LoggedInUserId");

  //this event will be called when checkbox in matrix will get checked/unchecked
  ItemcheckedEvent(Label, e): void {
    const selectedRecords = this.grid.getSelectedRecords();
    if (selectedRecords.length == 0) {
    }
    else {
      this.MatrixStepActionId = selectedRecords[0]['StepActionId'];

    }
    this.selectedMatrixdata.push({ StepActionId: this.MatrixStepActionId, ColumnName: Label, NewResponse: e.checked, ScopeEntityType: this.LoggedInScopeEntityType, ScopeEntityId: this.LoggedInScopeEntityId, StepId: this.selectedStepId, LoggedInRoleId: this.LoggedInRoleId, LoggedInUserId: this.LoggedInUserId, ParticipantType: this.selectedParticipantType, HierarchyTypeId: this.AssignActionForm.get('HierarchyTypedrpcontrol').value });
  }

  //function called to update the train in case of updation in actions and participants
  public getComponentsCounts() {
    this._workflowservice.getWFComponentsCounts(this.configuringWFId, this.configuringFlexTableId).subscribe(
      (data: any) => {
        document.getElementById('countSteps').innerHTML = data[0].StepCount;
        this.Step_count = data[0].StepCount;
        document.getElementById('countDataFields').innerHTML = data[0].DataFieldCount;
        this.DataField_count = data[0].DataFieldCount;
        document.getElementById('countLandingPages').innerHTML = data[0].LandingPageCount;
        this.LandingPage_count = data[0].LandingPageCount;
        document.getElementById('countActions').innerHTML = data[0].ActionCount;
        this.Action_count = data[0].ActionCount;
        document.getElementById('countNotifications').innerHTML = data[0].NotificationCount;
        this.Notification_count = data[0].NotificationCount;
      },
      (error: any) => console.log(error)
    );
  }

  //method called on the save of the matrix array
  fnSaveMappingdata() {
    if (this.selectedMatrixdata.length == 0) {
      this.toasts[3].content = "No selection made";
      this.toastObj.show(this.toasts[3]);
    }
    else {
      this._service.SaveMappingData(this.selectedMatrixdata)
        .subscribe(
          data => {
            this.toasts[1].content = data;
            this.toastObj.show(this.toasts[1]);
            if (this.level == "steplevel") {
              this.fnGetDataForMapping(this.configuringstepid);
            }
            if (this.level == "workflowlevel") {
              this.fnGetDataForMapping(this.selectedStepId);
            }
            this.getComponentsCounts();
          }
        );
    }
  }

  //method to get the assigned actions to the participant(matrix data)
  selectedValues = [];
  fnGetDataForMapping(stepid) {
    this.participantmodel.ParticipantType = this.selectedParticipantType;
    this.participantmodel.ParameterCarrier = "|EntityType=" + sessionStorage.getItem("LoggedInScopeEntityType") + "|EntityId=" + sessionStorage.getItem("LoggedInScopeEntityId") + "|StepId=" + stepid + "|TypeValues=" + this.AssignActionForm.get('participantcontrol').value + "|WFId=" + this.configuringWFId + "|LevelValue=" + this.AssignActionForm.get('LevelValue').value;
    this._service.GetDataForActionParticipantMapping(this.participantmodel)
      .subscribe(
        data => {
          this.matrixData = data;
        }
      );
    this.showgrid = true;
  }

  //method called on link to show the manage actions popup
  fnShowActions() {
    this.showmanageactions = true;
  }
  NotificationsHeader: string;
  //method called on email link to show the notification pop up
  fnShowNotifications(action, stepactionid) {
    this.SelectedActionName = action;
    this.SelectedStepActionId = stepactionid
    this.NotificationsHeader = "Manage Notification for Action '" + this.SelectedActionName + "' on Step '" + this.selectedStepLabel + "'"
    this.isDialog = true;
    this.showmanagenotifications = true;
  }

  //method called on the step dropdown change at workflow level
  stepchange(args: any): void {
    this.selectedStepId = args.itemData.Id;
    this.manageactiononParticipant = false;
    this.selectedStepLabel = args.itemData.Label;
    this.dvLinksOnGrid = true;
    if (!args.itemData.IsMandatory) {
      this.ShowActionVisibility = true;
    }
    else {
      this.ShowActionVisibility = false;
    }
  }

  fnshowMatrixdata() {
    this.participantmodel.ParameterCarrier = "|EntityType=" + sessionStorage.getItem("LoggedInScopeEntityType") + "|EntityId=" + sessionStorage.getItem("LoggedInScopeEntityId");
    if (this.selectedParticipantType == "LRole" || this.selectedParticipantType == "LUser") {
      this.participantmodel.ParameterCarrier = this.participantmodel.ParameterCarrier + "|TypeValues=" + this.AssignActionForm.get('participantcontrol').value + "|ParticipantType&Category=" + this.selectedParticipantType;
      this._service.GetColumnsForMatrixForDiferentParticipantTypes(this.participantmodel)
        .subscribe(
          data => {
            this.fnGetDataForMapping(this.selectedStepId);
            this.Columns = data;
          }
        );
    }

    if ((this.selectedParticipantType == "Hierarchy") && (this.radiobutton.getSelectedValue() === "Level")) {
      this.participantmodel.ParameterCarrier = this.participantmodel.ParameterCarrier + "|LevelValue=" + this.AssignActionForm.get('LevelValue').value + "|ParticipantType&Category=" + "Hierarchy_Level";
      this._service.GetColumnsForMatrixForDiferentParticipantTypes(this.participantmodel)
        .subscribe(
          data => {
            this.fnGetDataForMapping(this.selectedStepId);
            this.Columns = data;
          }
        );
    }

    if ((this.selectedParticipantType == "Hierarchy") && (this.radiobutton.getSelectedValue() === "Job Role")) {
      this.participantmodel.ParameterCarrier = this.participantmodel.ParameterCarrier + "|HierarchyTypeId=" + this.AssignActionForm.get('HierarchyTypedrpcontrol').value + "|ParticipantType&Category=" + "Hierarchy_JobRole";
      this._service.GetColumnsForMatrixForDiferentParticipantTypes(this.participantmodel)
        .subscribe(
          data => {
            this.fnGetDataForMapping(this.selectedStepId);
            this.Columns = data;
          }
        );
    }
  }

  showHierarchyCategory: boolean = false;
  hierarchyTypeChange(args: any): void {
    this.showHierarchyCategory = true;
  }


  //below method is to fill the dropdown of participant list in dropdown in frontend on changing of participant type
  participantTypeChange(args: any): void {
    this.showgrid = false;
    this.showHierarchyTypeDropdown = false;
    this.AssignActionForm.patchValue({
      participantcontrol: null,
      HierarchyTypedrpcontrol: null
    });

    if (this.level == "steplevel") {
      this.selectedStepId = this.configuringstepid;
    }
    else {
      this.selectedStepId = this.selectedStepId;
    }
    this.participantmodel.ParameterCarrier = "|EntityType=" + sessionStorage.getItem("LoggedInScopeEntityType") + "|EntityId=" + sessionStorage.getItem("LoggedInScopeEntityId");
    if (args.itemData.Type == "Role") {
      this.showHierarchyTypeDropdown = false;
      this.showmultiselect = true;
      this.showPositionTypeDD = true;
      this.selectedParticipantType = "LRole";
      this.participantmodel.ParameterCarrier = this.participantmodel.ParameterCarrier + "|ParticipantType&Category=" + this.selectedParticipantType;
      this.configuringstepid = this.selectedStepId;
      this.participantmodel.WorkflowId = this.configuringWFId;
      this.participantmodel.StepId = this.selectedStepId;
      this._service.GetParticipants(this.participantmodel)
        .subscribe(
          ParticipantListByRoleType => {
            this.Participants = ParticipantListByRoleType;
          }
        );
    }
    if (args.itemData.Type == "User") {
      this.showHierarchyTypeDropdown = false;
      this.showPositionTypeDD = true;
      this.selectedParticipantType = "LUser";
      this.showmultiselect = true;
      this.participantmodel.ParameterCarrier = this.participantmodel.ParameterCarrier + "|ParticipantType&Category=" + this.selectedParticipantType;
      this._service.GetParticipants(this.participantmodel)
        .subscribe(
          ParticipantListByUserType => {
            this.Participants = ParticipantListByUserType;

          }
        );
    }

    
    if (args.itemData.Type == "Hierarchy") {
      this.showHierarchyTypeDropdown = true;
      this.showPositionTypeDD = true;
      this.selectedParticipantType = "Hierarchy";
      this.showmultiselect = false;
      this.participantmodel.ParameterCarrier = this.participantmodel.ParameterCarrier + "|ParticipantType&Category=" + this.selectedParticipantType;
      this._service.GetParticipants(this.participantmodel)
        .subscribe(
          ParticipantListByHierarchyType => {
            this.HTypeSource = ParticipantListByHierarchyType;
          }
        );
    }

    if (args.itemData.Type == "Position") {
      this.showHierarchyTypeDropdown = true;
      this.showPositionTypeDD = true;
      this.selectedParticipantType = "Position";
      this.showmultiselect = false;
      this.participantmodel.ParameterCarrier = this.participantmodel.ParameterCarrier + "|ParticipantType&Category=" + this.selectedParticipantType;
      this._service.GetParticipants(this.participantmodel)
        .subscribe(
          ParticipantListByPositionType => {
            this.PTypeSource = ParticipantListByPositionType;
          }
        );
    }



  }
  selectedHierarchyCategory: string;
  selectedParticipantType: string;
  showManageRoles: boolean = false;
  OpenRolesScreen() {
    this.showManageRoles = true;
  }

  //********************Action Visibility Code**************************************
  showActionVisibilityScreen: boolean;
  ActionVisibilityScreen() {
    this.showActionVisibilityScreen = true;
    this.GetStepActionData();
  }

  StepsActionsData: any;
  GetStepActionData() {
    this._StepActionsService.getAllActionsDetailsByStepId(this.selectedStepId)
      .subscribe(
        data => {
          this.StepsActionsData = (data);
        }
      );
  }

  Participantdata: any;
  public Participantfields: Object = { text: 'RoleName', value: 'Id' };
  Listtoolbar = { items: ['moveUp', 'moveDown', 'moveTo', 'moveFrom', 'moveAllTo', 'moveAllFrom'] }
  StepActionChange(args: any): void {
    this._service.GetParticipantsByStepActionId(args.itemData.Id)
      .subscribe(
        data => {
          this.Participantdata = (data);
        }
      );
  }

  public onFocusOut(): void {
    if (this.radiobutton.getSelectedValue() === "Job Role") {
      this.participantmodel.ParticipantId = this.AssignActionForm.get('HierarchyTypedrpcontrol').value;
      this._service.GetParticipantByHierarchyJobRole(this.participantmodel.ParticipantId)
        .subscribe(
          ParticipantListByHierarchyJobRoleType => {
            this.Participants = ParticipantListByHierarchyJobRoleType;
          }
        );
    }

  }

  public PositionTypeChange(): void {
    this.participantmodel.ParticipantId = this.AssignActionForm.get('PositionTypedrpcontrol').value;
    this._service.GetParticipantByPositionType(this.participantmodel.ParticipantId)
    .subscribe(
      ParticipantListByPositionType => {
        this.Participants = ParticipantListByPositionType;
      }
    );
  }

  public changeHandler(): void {
    if (this.radiobutton.getSelectedValue() === "Level") {
      this.selectedHierarchyCategory = "Level";
      this.showLevelTxtbox = true;
      this.showmultiselect = false;
    }
    else {
      this.selectedHierarchyCategory = "Job Role";
      this.showLevelTxtbox = false;
      this.showmultiselect = true;

      this.participantmodel.ParticipantId = this.AssignActionForm.get('HierarchyTypedrpcontrol').value;
      this._service.GetParticipantByHierarchyJobRole(this.participantmodel.ParticipantId)
        .subscribe(
          ParticipantListByHierarchyJobRoleType => {
            this.Participants = ParticipantListByHierarchyJobRoleType;
          }
        );
    }

  }
  //********************Action Visibility Code**************************************

  public participantTypesData: Object[] = [
    { Id: 'User', Type: 'User' },
    { Id: 'Role', Type: 'Role' },
    { Id: 'Hierarchy', Type: 'Hierarchy' },
    { Id: 'Position', Type: 'Position' },
    { Id: 'Representative', Type: 'Representative' },    
    { Id: 'UserGroup', Type: 'UserGroup' }
  ];
  // maps the appropriate column to fields property
  public participantTypeFields: Object = { text: 'Type', value: 'Id' };
  // set the type of mode for how to visualized the selected items in input element.
  public default: string = 'Default';
  public delimiter: string = 'Delimiter';
}

