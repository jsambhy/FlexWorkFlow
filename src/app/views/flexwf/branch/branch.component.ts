import { Component, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { DatePickerComponent, DateTimePickerComponent } from '@syncfusion/ej2-angular-calendars';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { ToolbarService, EditService, PageService, ExcelExportService, PdfExportService, FreezeService, ContextMenuService, GridComponent, GridLine, ToolbarItems, ContextMenuItem, FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { FormGroup, FormControl} from '@angular/forms';
import { ToastPositionModel, ToastComponent } from '@syncfusion/ej2-angular-notifications';
import { RadioButtonComponent } from '@syncfusion/ej2-angular-buttons';
import { StepColumnsService } from '../../../services/step-columns.service';
import { BranchService } from '../../../services/branch.service';
import { WorkflowdesignerService } from '../../../services/workflowdesigner.service';
import { NextStepmodel } from '../../../models/workflow-diagram-model';
import { branchmodel } from '../../../models/branch.model';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.html',
  styleUrls: ['./branch.component.css'],
  providers: [StepColumnsService, BranchService, DashboardService, ToolbarService, EditService, PageService, ExcelExportService, PdfExportService, FreezeService, ContextMenuService]
})
/** branch component*/
export class BranchComponent {
  constructor(private _colservice: StepColumnsService, private _service: BranchService, private _WFservice: WorkflowdesignerService) {

    //initializing the form control
    this.Branchconditioncreateform = new FormGroup({
      actionlabel: new FormControl('')
    });
  }

  // getting parent from component message
  @Input() configuringWFId: number;
  @Input() destinationnodetext: string;
  @Input() sourcenodetext: string;
  @Input() actionNameforBranching: string;
  @Input() configuringWFLabel: string;
  @Input() configuringFlexTableId: number;
  @Input() configuringStepActionId: number;
  @Input() sourceStepId: number;
  @Input() destinationId: number;
  @Input() sourceStepNvarcharId: string;
  @Input() destinationStepNvarcharId: string;
  @Input() BranchPopupFlag: boolean;
  @Input() level: string;
  @Input() configuringstepid: number;
  @Input() configuringstepname: string;

  ConfiguredEntityType: string='FlexTables';
  // created view child for the various components which needs to be used further
  @ViewChild('toasttype', { static: false }) private toastObj: ToastComponent;
  @ViewChild('radiobutton1', { static: false }) public radiobutton1: RadioButtonComponent;
  @ViewChild('radiobutton2', { static: false }) public radiobutton2: RadioButtonComponent;
  @ViewChild('ManageBranchgrid', { static: false }) public ManageBranchgrid: GridComponent;
  @ViewChild('addconditionobj', { static: false }) public addconditionobj: DropDownListComponent;
  @ViewChild('entity', { static: false }) public entity: DropDownListComponent;
  @ViewChild('operatorobj', { static: false }) public operatorobj: DropDownListComponent;
  @ViewChild('Tobj', { static: false }) public Tobj: TextBoxComponent;
  @ViewChild('MLobj', { static: false }) public MLobj: TextBoxComponent;
  @ViewChild('ManageBranchConditionDialogue', { static: false }) public ManageBranchConditionDialogue: DialogComponent;
  @ViewChild('BranchConditionDialog', { static: false }) public BranchConditionDialog: DialogComponent;
  @ViewChild('Dobj', { static: false }) public Dobj: DatePickerComponent;
  @ViewChild('DTobj', { static: false }) public DTobj: DateTimePickerComponent;
  @ViewChild('bitObj', { static: false }) public bitObj: DropDownListComponent;
  @ViewChild('AndOrobj', { static: false }) public AndOrobj: DropDownListComponent;
  @ViewChild('NTobj', { static: false }) public NTobj: TextBoxComponent;
  @ViewChild('ResultMLobj', { static: false }) public ResultMLobj: TextBoxComponent;
  @ViewChild('ResultTechobj', { static: false }) public ResultTechobj: TextBoxComponent;

  //Initiallizing the variables
  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };
  Branchconditioncreateform: FormGroup = null;
  public enabled: boolean;
  public Branchmodeldata: NextStepmodel[];
  public entityText: string;
  public tablenamefromcolumname: string;
  public columnnameofjoiningtable: string;
  public entityType: string;
  public entityId: number;
  public showMultiLineTextBox: boolean = false;
  public showDateTimePicker: boolean = false;
  public showDatePicker: boolean = false;
  public showTextBox: boolean = true;
  public showNumTextBox: boolean = false;
  public showBitDropDown: boolean = false;
  public showAndOr1: boolean = false;
  public dataTypeValue: string;
  public actualValueofEntity: string;
  public operatorValue: string;
  public Flag: string;
  public columnAttributeVal: string;
  public AndOrVal: string;
  public userFriendlyExpression: string;
  public userTechnicalExpression: string;
  public lines: GridLine;
  public toolbar: ToolbarItems[] | object;
  public editSettings: Object;
  public branchmodeldata: branchmodel = new branchmodel();
  public existingBranchCondition: string;
  public configuringStepActionIconId: number;
  public nextstepdata: NextStepmodel = new NextStepmodel();
  public isChanged: boolean;
  public choosecolumn: string[];
  public AndOrdata: Object = [{ text: 'AND', value: 'AND' }, { text: 'OR', value: 'OR' }];
  public BitValues: Object = [{ text: 'TRUE', value: 'TRUE' }, { text: 'FALSE', value: 'FALSE' }];
  public operators: Object = [];
  public choosecolumnfields: Object = { text: 'FieldName', value: 'DataFieldId' };
  public ShowManageBranchCondition: boolean;
  public showBranch: boolean;
  public ManageBranchconditionHeader: string;

  //--------------------------------methods block-------------------------------------
  
  dialogClose() {
    
    window.location.reload();
    
    //this.PostBranchEvent.emit();
  }
  @Output() PostBranchEvent = new EventEmitter();

  //getting all the controls of the form for validation purpose, it usage is done on html page
  get f() { return this.Branchconditioncreateform.controls; }
  public isFieldValid(field: string) {
    return !this.Branchconditioncreateform.get(field).valid && (this.Branchconditioncreateform.get(field).dirty || this.Branchconditioncreateform.get(field).touched);
  }
  ////method called on the change of the entity dropdown column
  //public entityChange(args: any): void {
  //  
  //  let str = args.itemData.FieldName;
  //  //var splitted = str.split("] ");
  //  //this.tablenamefromcolumname = splitted[0].replace('[', '');
  //  //this.columnnameofjoiningtable = splitted[1]; 
  //  //this.entityText = this.columnnameofjoiningtable;
  //  this.entityType = args.itemData.EntityType;
  //  this.entityId = args.itemData.EntityId;
  //  this.getAttributeByColConfigId(args.itemData.Value);
  //  this.entityText = str.replaceAll("] ", "].");
  //  this.actualValueofEntity = "{" + this.entityText + "}";
  //  //this.actualValueofEntity = "{[" + this.tablenamefromcolumname + "]" + "." + this.entityText + "}";
  //  this._service.getDataType(this.entityId, this.entityText, this.entityType)
  //    .subscribe(
  //      data => {
  //        this.dataTypeValue = data;
  //        if (this.dataTypeValue == "nvarchar") {            
  //          this.operators = [{ text: 'LIKE', value: 'LIKE' }, { text: '=', value: '=' }];
  //          this.operatorobj.enabled = true;
  //          this.Flag = "string";
  //          this.enabled = true;
  //          this.showTextBox = true;
  //          this.showMultiLineTextBox = false;
  //          this.showBitDropDown = false;
  //          this.showDateTimePicker = false;
  //          this.showDatePicker = false;
  //          this.showNumTextBox = false;
            
            
  //        }
  //        else if ((this.dataTypeValue == "int") || (this.dataTypeValue == "numeric")) {
  //          this.operators = [{ text: '>', value: '>' }, { text: '<', value: '<' }, { text: '=', value: '=' }, { text: '<>', value: '<>' }, { text: '<=', value: '<=' }];
  //          this.Flag = "number";
  //          //showNumTextBox
  //          this.enabled = true;
  //          this.operatorobj.enabled = true;
  //          this.showTextBox = false;
  //          this.showNumTextBox = true;
  //          this.showMultiLineTextBox = false;
  //          this.showBitDropDown = false;
  //          this.showDateTimePicker = false;
  //          this.showDatePicker = false;
            

  //        }

  //        else if (this.dataTypeValue == "bit") {
  //          this.operators = [{ text: '=', value: '=' }];
  //          this.Flag = "bit";
  //          this.operatorobj.enabled = true;
  //          this.showNumTextBox = false;
  //          this.showTextBox = false;
  //          this.showMultiLineTextBox = false;
  //          this.showBitDropDown = true;
  //          this.showDateTimePicker = false;
  //          this.showDatePicker = false;
  //          this.enabled = true;
            
  //        }

  //        else if (this.dataTypeValue == "datetime") {
            
  //          this.operators = [{ text: '>', value: '>' }, { text: '=', value: '=' }];
  //          this.Flag = "datetime";
  //          this.operatorobj.enabled = true;
  //          this.showTextBox = false;
  //          this.showMultiLineTextBox = false;
  //          this.showBitDropDown = false;
  //          this.showDateTimePicker = true;
  //          this.showDatePicker = false;
  //          this.showNumTextBox = false;
  //          this.enabled = true;
  //        }


  //        else if (this.dataTypeValue == "date") {
            
  //          this.operators = [{ text: '>', value: '>' }, { text: '=', value: '=' }];
  //          this.Flag = "date";
  //          this.operatorobj.enabled = true;
  //          this.showTextBox = false;
  //          this.showMultiLineTextBox = false;
  //          this.showBitDropDown = false;
  //          this.showDateTimePicker = false;
  //          this.showDatePicker = true;
  //          this.showNumTextBox = false;
  //          this.enabled = true;
            
  //        }

  //        else if (this.dataTypeValue == "multiline") {
           
  //          this.operators = [{ text: '>', value: '>' }, { text: '=', value: '=' }];
  //          this.Flag = "multiline";
  //          this.operatorobj.enabled = true;
  //          this.showTextBox = false;
  //          this.showMultiLineTextBox = true;
  //          this.showBitDropDown = false;
  //          this.showDateTimePicker = false;
  //          this.showDatePicker = false;
  //          this.showNumTextBox = false;
  //          this.enabled = true;
            
  //        }
  //      }
  //    );

  //}

  ////getting selected column attribute value
  //getAttributeByColConfigId(Value) {
  //  this._service.getAttributeByColConfigId(Value)
  //    .subscribe(
  //      data => {
  //        this.columnAttributeVal = data;          
  //      }
  //    );
  //}

  ////method called on the operators dropdown change
  //public operatorChange(args: any): void {
  //  
  //  this.enabled = true;    
  //  this.operatorValue = args.itemData.value;
  //}
  
  ////method to add the expresssions--------->
  //fnAddCondition() {
  //  
  //  var UserInputValue;
  //  var selectedAndOr = "";//this.AndOrVal;
  //  if (this.Flag == "string") {
  //    UserInputValue = this.Tobj.value;
  //  }
  //  if (this.Flag == "multiline") {
  //    UserInputValue = this.MLobj.value;
  //  }
  //  if (this.Flag == "date") {
  //    UserInputValue = this.Dobj.value;
  //  }

  //  if (this.Flag == "datetime") {
  //    UserInputValue = this.DTobj.value;
  //  }

  //  if (this.Flag == "bit") {
  //    UserInputValue = this.bitObj.value;
  //  }

  //  if (this.Flag == "number") {
  //    UserInputValue = this.NTobj.value;
  //  }
  //  if (this.radiobutton1 != undefined) {
  //    if (this.radiobutton1.checked) {
  //      selectedAndOr = "And"
  //    }
  //  }
  //  if (this.radiobutton1 != undefined) {
  //    if (this.radiobutton2.checked) {
  //      selectedAndOr = "Or"
  //    }
  //  }   
  //  this.userFriendlyExpression = this.ResultMLobj.value;
  //  this.branchmodeldata.SelectedField = this.actualValueofEntity;
  //  this.branchmodeldata.SelectedOperator = this.operatorValue
  //  this.branchmodeldata.SelectedInput = UserInputValue;
  //  this.branchmodeldata.selectedAndOr = selectedAndOr;
  //  this.branchmodeldata.expression = this.userFriendlyExpression;
  //  this.branchmodeldata.datatypevalue = this.dataTypeValue;
  //  this.branchmodeldata.SelectedColumnName = this.columnAttributeVal;
  //  
  //  this._service.AddCondition(this.branchmodeldata)
  //    .subscribe(
  //      data => {
  //        this.entity.value = null;
  //        this.operatorobj.value = null;
  //        if (this.Flag == "string") {
  //          this.Tobj.value = null;
  //        }
  //        if (this.Flag == "multiline") {
  //          this.MLobj.value = null;
  //        }
  //        if (this.Flag == "date") {
  //          this.Dobj.value = null;
  //        }
  //        if (this.Flag == "datetime") {
  //          this.DTobj.value = null;
  //        }
  //        if (this.Flag == "bit") {
  //          this.bitObj.value = null;
  //        }
  //        if (this.Flag == "number") {
  //          this.NTobj.value = null;
  //        }
  //        this.ResultMLobj.value = data.ResultantExpression;
          
  //        //this.showAndOr1 = true;
  //        //this.entity.enabled = false;
  //        //this.operatorobj.enabled = false;


  //        this.showAndOr1 = true;
  //        this.entity.enabled = true;
  //        this.operatorobj.enabled = true;
  //      }
  //    );
  //}

  ////method called on Reset button to make null all the prior filled values
  //Reset() {
  //  this.showAndOr1 = false;
  //  this.ResultMLobj.value = null;
  //  this.entity.value = null;
  //  this.operatorobj.value = null;
  //}

  ////method for validating expression called on validate buton
  //Validate() {
  //  
  //  this.nextstepdata.StepActionId = this.configuringStepActionId;
  //  this.nextstepdata.BranchCondition = this.ResultMLobj.value;
  //  this.nextstepdata.StepId = this.sourceStepId;
  //  this.existingBranchCondition = this.ResultMLobj.value;
  //  if (this.Branchconditioncreateform.invalid) {
  //    return;
  //  }
  //  else {
  //    this._service.fnValidate(this.nextstepdata)
  //      .subscribe(
  //        Validateddata => {
  //          let MsgPrefix: string = Validateddata.substring(0, 2);
  //          let Showmsg: string = Validateddata.substring(2, Validateddata.length);
  //          if (Validateddata == "S:Expression is validated successfully") {             
             
  //            if (MsgPrefix == 'S:') {//Means success
  //              this.toasts[1].content = Showmsg;
  //              this.toastObj.show(this.toasts[1]);
  //            }
             
  //            this._service.fnGetStepActionDetail(this.configuringStepActionId, this.sourceStepId)
  //              .subscribe(
  //                data => {
  //                  this.configuringStepActionIconId = data.ActionIconId;
  //                }
  //              );
  //          }
  //          else {
  //            if (MsgPrefix == 'I:') {//Information message
  //              this.toasts[3].content = Showmsg;
  //              this.toastObj.show(this.toasts[3]);
  //            }
  //            else if (MsgPrefix == 'W:') {//Warning Message
  //              this.toasts[0].content = Showmsg;
  //              this.toastObj.show(this.toasts[0]);
  //            }
  //            else {//Error Message
  //              this.toasts[2].content = Showmsg;
  //              this.toastObj.show(this.toasts[2]);
  //            }

  //          }

  //        }
  //      );
  //  }
  //}

  ////method for saving the expression but first we will validate here as well.(called on save button)
  //ValidateAndSave() {    
  //  //first it will be validated and once validated then it gets save.
  //  this.nextstepdata.StepActionId = this.configuringStepActionId;
  //  this.nextstepdata.BranchCondition = this.ResultMLobj.value;
  //  this.nextstepdata.StepId = this.sourceStepId;
  //  this.nextstepdata.NextStepId = this.destinationId;
  //  if (this.Branchconditioncreateform.invalid) {
  //    return;
  //  }
  //  else {
  //    this._service.fnValidate(this.nextstepdata)
  //      .subscribe(
  //        data => {
  //          let MsgPrefix: string = data.substring(0, 2);
  //          let Showmsg: string = data.substring(2, data.length);
  //          if (data == "S:Expression is validated successfully") {              
  //            this._service.fnGetStepActionDetail(this.configuringStepActionId, this.sourceStepId)
  //              .subscribe(
  //                data => {
  //                  this.configuringStepActionIconId = data.ActionIconId;
  //                  this.Save(data.ActionIconId);
  //                }
  //            );
  //          }
  //          else {              
  //            if (MsgPrefix == 'I:') {//Information message
  //              this.toasts[3].content = Showmsg;
  //              this.toastObj.show(this.toasts[3]);
  //            }
  //            else if (MsgPrefix == 'W:') {//Warning Message
  //              this.toasts[0].content = Showmsg;
  //              this.toastObj.show(this.toasts[0]);
  //            }
  //            else {//Error Message
  //              this.toasts[2].content = Showmsg;
  //              this.toastObj.show(this.toasts[2]);
  //            }
  //          }
  //        }
  //    );
  //  }

    
  //}
  
  //method for saving
  Save() {
    
    this.nextstepdata.StepId = this.sourceStepId;
    this.nextstepdata.NextStepId = this.destinationId;
    this.nextstepdata.NVarcharStepId = this.sourceStepNvarcharId;
    this.nextstepdata.NVarcharNextStepId = this.destinationStepNvarcharId;
    this.nextstepdata.WorkFlowId = this.configuringWFId;
    this.nextstepdata.ActionLabel = this.actionNameforBranching;
    this.nextstepdata.ActionIconId = this.configuringStepActionIconId;
    this.nextstepdata.StepActionId = this.configuringStepActionId;
    this.nextstepdata.WorkFlowName = this.configuringWFLabel;
    this._WFservice.SaveLinkdata(this.nextstepdata)
      .subscribe(
        (data: any) => {
          if (this.BranchPopupFlag == true) {
              this.toasts[1].content = "Branch condition updated successfully";
              this.toastObj.show(this.toasts[1]);
              this.ShowManageBranchCondition = true;//manage branch condition pop up will be visible
              this.showBranch = false;//branch condition pop up will be hidden
              //below method will get the data for all the steps at the worklfow level
              if (this.level == "workflowlevel") {
                this.GetBranchData(this.configuringWFId, 0);
              }
              if (this.level == "steplevel") {
                this.GetBranchData(this.configuringWFId, this.configuringstepid);
              }

            this.ShowManageBranchCondition = true;//manage branch condition pop up will be visible
            this.showBranch = false;//branch condition pop up will be hidden
          }

          if (this.BranchPopupFlag == false) {
            if (data.ParameterCarrier == "Successfully linked with updated branch condition") {
              this.ShowManageBranchCondition = false;//manage branch condition pop up will be visible
              this.showBranch = false;//branch condition pop up will be hidden
              window.location.reload();
            }

          }
        }
      );
  }


  PostWhereClauseEvent(val) {
    
    this.nextstepdata.BranchCondition = val.WhereExpression;
    this._service.fnGetStepActionDetail(this.configuringStepActionId, this.sourceStepId)
      .subscribe(
        data => {
          this.configuringStepActionIconId = data.ActionIconId;
          //this.Save();
        }
      );
  }


  //toolbar click event
  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'stepactionsgrid_pdfexport') {
      this.ManageBranchgrid.pdfExport();
    }
    if (args.item.id === 'stepactionsgrid_excelexport') {
      this.ManageBranchgrid.excelExport();
    }
    if (args.item.id === 'stepactionsgrid_csvexport') {
      this.ManageBranchgrid.csvExport();
    }
    if (args.item.id === 'Edit') {
      const selectedRecords = this.ManageBranchgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        //show info for selection of atleast one row in grid
        this.toastObj.timeOut = 3000;
        this.toasts[3].content = "No record selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.EditById(selectedRecords[0]['StepId'], selectedRecords[0]['NextStepId'], selectedRecords[0]['StepActionId'], selectedRecords[0]['ActionLabel'], selectedRecords[0]['StepName'], selectedRecords[0]['NextStepName']);

      }
    }
    if (args.item.id === 'Delete') {
      const selectedRecords = this.ManageBranchgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {

      }
      else {
        this.DeleteById(selectedRecords[0]['StepId'], selectedRecords[0]['NextStepId'], selectedRecords[0]['StepActionId']);

      }
    }
  }

  //method called for gettng the detail of edited row
  EditById(StepId, NextStepId, StepActionId, Action, FromStep, ToStep) {
    this._service.GetBranchConditionDataForEdit(StepId, NextStepId, StepActionId).subscribe(
      (data: any) => {
        this.sourcenodetext = FromStep;
        this.destinationnodetext = ToStep;
        this.actionNameforBranching = Action;
        this.Branchconditioncreateform.patchValue({
          actionlabel: data.BranchCondition
        });
        this.enabled = true;
        this.nextstepdata.StepActionId = StepActionId;
        this.nextstepdata.StepId = StepId;
        this.configuringStepActionId = StepActionId;
        this.sourceStepId = StepId;
        this.destinationId = NextStepId;
        if (data.BranchCondition == null) {
          this.showAndOr1 = false;
        }
        else {
          this.showAndOr1 = true;
        }
        
        this.showBranch = true;
      },
      (error: any) => alert(error)
    );
  }

  public recordDoubleClick(args): void {
    this.EditById(args.rowData['StepId'], args.rowData['NextStepId'], args.rowData['StepActionId'], args.rowData['ActionLabel'], args.rowData['StepName'], args.rowData['NextStepName']);
  }

  //method for deletion of the selected record
  DeleteById(StepId, NextStepId, StepActionId) {
    this._service.DeleteBranchCondition(StepId, NextStepId, StepActionId, this.configuringWFId).subscribe(
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
        if (this.level == "workflowlevel") {
          this.GetBranchData(this.configuringWFId, 0);
        }
        if (this.level == "steplevel") {
          this.GetBranchData(this.configuringWFId, this.configuringstepid);
        }

        this.ShowManageBranchCondition = true;//manage branch condition pop up will be visible
        this.showBranch = false;//branch condition pop up will be hidden

      },
      //(error: any) => alert(error)
    );
  }
  filterSettings: FilterSettingsModel;
  //angular cycle init component
  ngOnInit() {
    this.lines = 'Both';
    this.filterSettings = { type: 'CheckBox' }; // inorder to remove extra filtering from the grid we set it to this type.
    this.toolbar = [{ text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' }, 'ExcelExport', 'PdfExport', 'CsvExport', 'Search']
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    //method for getting all the column data for dropdown
    this._colservice.GetAllFlattenedDFsForEntity('FlexTables',this.configuringFlexTableId)
      .subscribe(
        data => {
          
          this.choosecolumn = (data);
        }
      );
    if (this.BranchPopupFlag == true) {
      this.ShowManageBranchCondition = true;//manage branch condition pop up will be visible
      this.showBranch = false;//branch condition pop up will be hidden
      //below method will get the data for all the steps at the worklfow level
      if (this.level == "steplevel") {
        this.ManageBranchconditionHeader = "Manage Branch Condition for Step '" + this.configuringstepname + "'"
        this.GetBranchData(this.configuringWFId, this.configuringstepid)
      }
      if (this.level == "workflowlevel") {
        this.ManageBranchconditionHeader = "Manage Branch Condition for Workflow '" + this.configuringWFLabel + "'"
        this.GetBranchData(this.configuringWFId,0)
      }
      
    }

    if (this.BranchPopupFlag == false) {
      this.ShowManageBranchCondition = false;
      this.showBranch = true;
    }
  }

  //method for getting the branches data and show in grid
  GetBranchData(workflowId, stepId){
    this._service.fnGetBranchesData(workflowId, stepId)
      .subscribe(
        data => {
          this.Branchmodeldata = (data);
        }
    );
}

  //row selected event of the grid
  rowSelected(e) {    
    if (e.data.BranchCondition) {
      this.toolbar = [{ text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' }, { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' }, 'ExcelExport', 'PdfExport', 'CsvExport', 'Search']
    }
    else {
      this.toolbar = [{ text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' }, 'ExcelExport', 'PdfExport', 'CsvExport', 'Search']
    }
  }
}
