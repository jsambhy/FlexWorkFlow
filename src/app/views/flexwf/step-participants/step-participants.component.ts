import { Component, Input, ViewChild } from '@angular/core';
import { ToolbarService, EditService, PageService, ExcelExportService, PdfExportService, ContextMenuService, GridComponent, GridLine, ToolbarItems, Grid, FreezeService } from '@syncfusion/ej2-angular-grids';
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
import { ToastPositionModel, ToastComponent } from '@syncfusion/ej2-angular-notifications';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { StepColumnsService } from '../../../services/step-columns.service';
import { StepParticipantsService } from '../../../services/step-participants.service';
import { stepparticipantsmodel } from '../../../models/step-participants-model';
import { stepactionsmodel } from '../../../models/step-actions-model';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { LRoles } from '../../../models/RoleModel';

@Component({
    selector: 'app-step-participants',
    templateUrl: './step-participants.component.html',
  styleUrls: ['./step-participants.component.css'],
  providers: [StepParticipantsService, FreezeService,StepColumnsService, ToolbarService, EditService, PageService, ExcelExportService, PdfExportService, ContextMenuService]
})
/** step-participants component*/
export class StepParticipantsComponent {
/** step-participants ctor */
  get f() { return this.AddParticipantForm.controls; }
  get f1() { return this.AssignActionForm.controls; }

  public isFieldValid(field: string) {
    return !this.AddParticipantForm.get(field).valid && (this.AddParticipantForm.get(field).dirty || this.AddParticipantForm.get(field).touched);
  }
  constructor(private _service: StepParticipantsService, private _colservice: StepColumnsService) {
    this.AddParticipantForm = new FormGroup({
      participantdrp: new FormControl('', [Validators.required])
    });
    this.AssignActionForm = new FormGroup({
      stepdrpcontrol: new FormControl('', [Validators.required])
    });
  }
  AddParticipantForm: FormGroup = null;
  AssignActionForm: FormGroup = null;
  public Columns: LRoles[];
  //public matrixData: participantactionmatrixmodel[];
  public matrixData: any[];
  public gridDataSource: any;
  //@Input() popupflag: boolean; // getting parent from component message
  @Input() configuringstepname: string; // getting parent from component message
  @Input() configuringstepid: number; // getting parent from component message
  @Input() configuringWFId: number; // getting parent from component message
  @Input() configuringFlexTableId: number;
  @Input() configuringWFLabel: string;
  @Input() level: string;
  @Input() isRefresh: boolean;
  @ViewChild('toasttype', { static: false })
  private toastObj: ToastComponent;
  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };
  public configuringParticipantName: string;
  public stepparticipantmodeldata: stepparticipantsmodel[];
  public participantactions: stepactionsmodel[];
  public ShowMatrixpopup: boolean = false;
  public actionslist: object[] = [];
  @ViewChild('stepparticipantsgrid', { static: false })  public stepparticipantsgrid: GridComponent;
  @ViewChild('chkbx', { static: false }) public chkbx: GridComponent;
  @ViewChild('assignedactiongrid', { static: false })  public assignedactiongrid: GridComponent;
  @ViewChild('grid', { static: false })  public grid: GridComponent;
  @ViewChild('StepParticipantsDialogue', { static: false }) public StepParticipantsDialogue: DialogComponent;
  @ViewChild('participantactionsdlg', { static: false }) public participantactionsdlg: DialogComponent;
  @ViewChild('confirmDialog', { static: false })  public confirmDialog: DialogComponent;
  public participantAllowedActionsData: string = "";
  public lines: GridLine;
  public toolbar: ToolbarItems[] | object;
  public editSettings: Object;
  public ShowParticipantActionspopup: boolean = false;
  public projectId: number;
  public sessionprojectid: string;
  public sampledata: object[];
  public steps: string[];
  public fields: Object = { text: 'Label', value: 'Id' };
  public participants: string[];
  public participantfields: Object = { text: 'RoleName', value: 'Id' }; 
  public showAddMoreParticipant: boolean;
  public showStepDropdown: boolean;
  public showgrid: boolean;
  public childGrid: any;
  LoggedInScopeEntityId: number;
  LoggedInScopeEntityType: string;
  ngOnInit() {
    this.sessionprojectid = sessionStorage.getItem("ProjectId");
    this.LoggedInScopeEntityId = +sessionStorage.getItem("LoggedInScopeEntityId");
    this.LoggedInScopeEntityType = sessionStorage.getItem("LoggedInScopeEntityType");
    this.projectId = +this.sessionprojectid; // conversion from string to int   
    this.lines = 'Both';
    this.toolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: '', id: 'Add', align: 'Left' }, { text: 'Delete', tooltipText: 'Delete', prefixIcon: '', id: 'Delete', align: 'Left' }, { text: 'Manage Actions', tooltipText: 'Manage Actions', prefixIcon: '', id: 'ManageAction', align: 'Left' },  'ExcelExport', 'PdfExport', 'CsvExport', 'Search'];


    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    if (this.level == "steplevel") {
      this.showStepDropdown = false;
      this.showgrid = true;
      this.dvLinksOnGrid = true;
      this.manageactiononParticipant = true;
      this.manageparticipantHeader = "Manage Participants for Step '" + this.configuringstepname +"'";
      this.getData(this.configuringstepid, this.configuringWFId);
      this.fnGetDataForMapping(this.configuringstepid);
    }

    if (this.level == "workflowlevel") {
      this.showgrid = false;
      this.manageactiononParticipant = false;
      this.dvLinksOnGrid = false;
      this.manageparticipantHeader = "Manage Participants for Workflow '" + this.configuringWFLabel + "'";
      this.getData(0, this.configuringWFId);
      this._colservice.getAllSteps(this.configuringWFId, this.configuringWFLabel)
        .subscribe(
          data => {
            this.steps = (data);
          }
        );
      this.showStepDropdown = true;
     
    }
  }

  public abc: any;
  getData(stepid, workflowid) {
    
    this._service.getParticipantsInformation(stepid, workflowid)
      .subscribe(
        data => {
          this.stepparticipantmodeldata = data;
          console.log(this.stepparticipantmodeldata)
          //document.getElementById('icondv').outerHTML = data.AssociatedActions;
          ////for (var j = 0; j < data.length; j++) {
          ////  var htmlSTring = data[j].AssociatedActions;           
          ////}
           this.abc = data.AssociatedActions;
        }
      );
  }
  bound(e) {
    
    alert("hi");
    //Here you can replace the assign the subcomponent to the grid and append it to the detail template. 
    //let stepparticipantsgrid: Grid = GridComponent.
   // this.stepparticipantsgrid.appendTo('#icondv');
    //this.abc.appendTo('#icondv');
    document.getElementById('icondv').innerHTML = this.abc;
  } 

  public manageparticipantHeader: string;
  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'stepparticipantsgrid_pdfexport') {
      this.stepparticipantsgrid.pdfExport();
    }
    if (args.item.id === 'stepparticipantsgrid_excelexport') {
      this.stepparticipantsgrid.excelExport();
    }
    if (args.item.id === 'stepparticipantsgrid_csvexport') {
      this.stepparticipantsgrid.csvExport();
    }
    if (args.item.id === 'Add') {
      this._service.GetColumnForMenuRoles()
        .subscribe(
          data => {
            this.Columns = data;           
            this.ShowMatrixpopup = true;
          }
        );
    }
    if (args.item.id === 'Delete') {
      const selectedRecords = this.stepparticipantsgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {

      }
      else {
        this.Delete(selectedRecords[0]['ParticipantId'], selectedRecords[0]['StepId1']);
      }
    }


    if (args.item.id === 'ManageAction') {      
      const selectedRecords = this.stepparticipantsgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {

      }
      else {
        
        this.configuringParticipantName = selectedRecords[0]['ParticipantName'];
        this.configuringstepname = selectedRecords[0]['StepName'];
        //this.fnOpenManageActionsPopup(selectedRecords[0]['ParticipantId'], selectedRecords[0]['StepId1']);
        this.participantId = selectedRecords[0]['ParticipantId'];
        this.selectedStepId = selectedRecords[0]['StepId1'];
        this.headerParticipantAction = "Assigned Actions to the Participant '" + selectedRecords[0]['ParticipantName'] + "' for Step '" + selectedRecords[0]['StepName'] + "'"

       
        this.ShowParticipantActionspopup = true;
        this._service.GetSelectedActionsForParticipant(selectedRecords[0]['ParticipantId'], selectedRecords[0]['StepId1'])
          .subscribe(
            data => {
              this.participantactions = (data);
            }
          );



      }
    }

    
  }

  public MatrixStepActionId: number ;
  public configuredParticipantId: number;
  public selectedMatrixdata: Object[] = [];//array in which all the selected items will get pushed(rollname,stepid,stepactionid..etc)

  ItemcheckedEvent(RoleName, e): void {//this event will be called when checkbox in matrix will get checked/unchecked
    const selectedRecords = this.grid.getSelectedRecords();
    if (selectedRecords.length == 0) {
    }
    else {
      this.MatrixStepActionId = selectedRecords[0]['StepActionId'];     
    }
    this.selectedMatrixdata.push({ StepActionId: this.MatrixStepActionId, ColumnName: RoleName, NewResponse: e.checked, ProjectId: this.projectId });

    //below can be used further--------------------------------------------------------->
    //this.selectedMatrixdata.push(this.MatrixStepActionId)
    //type MyArrayType = Array<{ StepActionId: number, ColumnName: string, NewResponse: boolean,ProjectId: number }>;
    //const arr: MyArrayType = [
    //  { StepActionId: this.MatrixStepActionId, ColumnName: RoleName, NewResponse: e.checked,ProjectId:2}     
    //];    
    //this.selectedMatrixdata.push(this.data);
    //below can be used further--------------------------------------------------------->
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
              this.participantactionsdlg.hide();
              if (this.level == "steplevel") {
                this.fnGetDataForMapping(this.configuringstepid);
              }
              if (this.level == "workflowlevel") {
                this.fnGetDataForMapping(this.selectedStepId);
              }
            }
          );
      }
    
    
  }
  fnGetDataForMapping(stepid) {
    this._service.GetDataForActionRoleMapping(stepid)
      .subscribe(
        data => {
          this.matrixData = data;
        }
      );

  }
  fnOpenManageActionsPopup(ParticipantId, StepId) {
    this.configuredParticipantId = ParticipantId;   
    if (this.level == "steplevel") {
      this.headerParticipantAction = "Assigned Actions to the Participant '" + this.configuringParticipantName + "' for Step '" + this.configuringstepname + "'"
    }
    if (this.level == "workflowlevel") {
      this.headerParticipantAction = "Assigned Actions to the Participant '" + this.selectedParticipant + "' for Step '" + this.selectedStepLabel + "'"

    }
    this.ShowParticipantActionspopup = true;
    this._service.GetSelectedActionsForParticipant(ParticipantId, StepId)
      .subscribe(
        data => {
          this.participantactions = (data);
        }
      );
  }
  public headerParticipantAction: string;
  public selectedActionIds: string = "";
  public confirmcontent: string = "";
  public ParticipantIdToDelete: number;
  public StepIdToDelete: number;
  public stepparticipantdata: stepparticipantsmodel = new stepparticipantsmodel();
  FnUpdateActionsForParticipant() {
    
    const selectedrecords: object[] = this.assignedactiongrid.getSelectedRecords();  // Get the selected records.
    for (var i = 0; i < selectedrecords.length; i++) {
      let ActionId = selectedrecords[i]['Id'];
      this.selectedActionIds += ActionId + "^";
    }
    this.selectedActionIds = this.selectedActionIds.substring(0, (this.selectedActionIds.length) - 1);

    if (this.level == "steplevel") {
      this.stepparticipantdata.ParticipantId = this.participantId;
      this.stepparticipantdata.StepId = this.configuringstepid;
    }
    if (this.level == "workflowlevel") {
      this.stepparticipantdata.ParticipantId = this.participantId;
      this.stepparticipantdata.StepId = this.selectedStepId;
    }
    this.stepparticipantdata.WorkflowId = this.configuringWFId;
    this.stepparticipantdata.StepActionIdList = this.selectedActionIds;
    this.stepparticipantdata.WorkflowName = this.configuringWFLabel;
    this._service.UpdateActionsForParticipant(this.stepparticipantdata)
      .subscribe(
        (data: string) => {
          this.ShowParticipantActionspopup = false;
          this.showAddMoreParticipant = false;
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
          if (this.level == "steplevel") {
            this.fnGetDataForMapping(this.configuringstepid);
          }
          if (this.level == "workflowlevel") {
            this.fnGetDataForMapping(this.selectedStepId);
          }
        }
      );
  }
  Delete(ParticipantId, StepId) {
    this.ParticipantIdToDelete = ParticipantId;
      this.StepIdToDelete = StepId;
    this.confirmcontent = "Are you sure to delete the selected item?";
    this.confirmDialog.show();
   
    //if (r == true) {
    //  this._service.DeleteById(ParticipantId, StepId, this.configuringWFId).subscribe(
    //    (data: string) => { 
    //      this.toasts[1].content = "Deleted successfully";
    //      this.toastObj.show(this.toasts[1]);
    //    },
    //    (error: any) => alert(error)
    //  );
    //}
    //else {
    //  return;
    //}
  }
  public manageactiononParticipant: boolean;
  public showmanageactions: boolean;
  public participantId: number;
  public selectedStepId: number;
  public selectedStepLabel: string;

  fnShowActions() {
    this.showmanageactions = true;
  }

  fnAddMoreParticipants() {
    if (this.level == "steplevel") {
      this._service.getParticipantsByStepId(this.configuringstepid, this.configuringWFId, this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
        .subscribe(
          data => {
            this.participants = (data);
          }
        );
    }
    if (this.level == "workflowlevel") {
      this._service.getParticipantsByStepId(this.selectedStepId, this.configuringWFId, this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
        .subscribe(
          data => {
            this.participants = (data);
          }
        );
    }
    this.showAddMoreParticipant = true;
  }
  public selectedParticipant: number;
  public dvLinksOnGrid: boolean;
  public change(args: any): void {
    this.selectedParticipant = args.itemData.RoleName;
    this.participantId = args.itemData.Id;
  }
  public stepchange(args: any): void {
    this.selectedStepId = args.itemData.Id;
    this.manageactiononParticipant = false;
         this.selectedStepLabel = args.itemData.Label;
      this.fnGetDataForMapping(this.selectedStepId);
      this.showgrid = true;
      this.dvLinksOnGrid = true;
  }
  fnSaveParticipants() {
    this.stepparticipantdata.ParticipantId = this.participantId;
    this.stepparticipantdata.WorkflowId = this.configuringWFId;
    this.stepparticipantdata.WorkflowName = this.configuringWFLabel;

    if (this.level == "steplevel") {
      this.stepparticipantdata.StepId = this.configuringstepid;
    }
    if (this.level == "workflowlevel") {
      this.stepparticipantdata.StepId = this.selectedStepId;
    }

    if (this.AddParticipantForm.invalid) {
      return;
    }
    else {
      this._service.SaveParticipants(this.stepparticipantdata).subscribe(
        (data: string) => {
          this.fnOpenManageActionsPopup(this.stepparticipantdata.ParticipantId, this.stepparticipantdata.StepId);
        },
        (error: any) => console.log(error)
      );
    }
  }

  public confirmDlgBtnNoClick = (): void => {
    this.confirmDialog.hide();
  }
  public confirmDlgBtnYesClick = (): void => {
    this._service.DeleteById(this.ParticipantIdToDelete, this.StepIdToDelete, this.configuringWFId).subscribe(
      (data: string) => {
        
        this.toasts[1].content = "Deleted successfully";
        this.toastObj.show(this.toasts[1]);
        if (this.level =="steplevel") {
          this.getData(this.configuringstepid, this.configuringWFId);
          this.fnGetDataForMapping(this.configuringstepid);
        }
        if (this.level == "workflowlevel") {
          this.getData(0, this.configuringWFId);
          this.fnGetDataForMapping(0);
        }
      },
      (error: any) => alert(error)
    );

    this.confirmDialog.hide();
  }
  public confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmDlgBtnYesClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];
  
}


