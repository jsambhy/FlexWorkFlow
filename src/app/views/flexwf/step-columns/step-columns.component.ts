import { ViewChild, Component, Inject, Input, EventEmitter, Output} from '@angular/core';
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
import { FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';

import {
  GridComponent, ToolbarService, EditService, PageService, ExcelExportService,
  PdfExportService, FreezeService, ContextMenuItem, ContextMenuService, Column, SelectionSettingsModel, ToolbarItems, RowDDService, FilterSettingsModel
} from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { GridLine } from '@syncfusion/ej2-angular-grids';
import { RadioButtonComponent, CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { StepColumnsService } from '../../../services/step-columns.service';
import { stepcolumnsmodel } from '../../../models/step-columns-model';
import { WorkflowdesignerService } from '../../../services/workflowdesigner.service';
@Component({
    selector: 'app-step-columns',
    templateUrl: './step-columns.component.html',
    styleUrls: ['./step-columns.component.css'],
  providers: [StepColumnsService, RowDDService,ToolbarService, EditService, PageService, ExcelExportService, PdfExportService, FreezeService, ContextMenuService]
})

export class StepColumnsComponent {
   // -------------------getting parent from component message
  @Input() configuringstepname: string; 
  @Input() configuringstepid: number; 
  @Input() configuringWFId: number;
  @Input() configuringFlexTableId: number;
  @Input() configuringWFLabel: string;
  @Input() level: string;
  public hidden: Boolean = false;
  submitted: boolean = false;
  //--------------------creating view child of the required componnets used to handle
  @ViewChild('confirmDialog', { static: false }) public confirmDialog: DialogComponent;
  @ViewChild('columnobj', { static: false }) public columnobj: DropDownListComponent;
  @ViewChild('checkBoxvisible', { static: false }) public checkBoxvisible: CheckBoxComponent;
  @ViewChild('columnCreateDialogue', { static: false }) public columnCreateDialogue: DialogComponent;
  @ViewChild('columnCreateDialogue', { static: false }) public columndetailDialogue: DialogComponent;
  @ViewChild('labelTextBoxobj', { static: false }) public labelTextBoxobj: TextBoxComponent;
  @ViewChild('step', { static: false }) public step: DropDownListComponent;
  @ViewChild('StepSelectiondlg', { static: false }) public StepSelectiondlg: DialogComponent;
  @ViewChild('stepcolumngrid', { static: false }) public stepcolumngrid: GridComponent;
  @ViewChild('stepselectiongrid', { static: false }) public stepselectiongrid: GridComponent;
  @ViewChild('entity', { static: true }) public entity: DropDownListComponent;
  @ViewChild('radiobuttonorder', { static: false }) public radiobuttonorder: RadioButtonComponent;
  @ViewChild('toasttype', { static: false }) private toastObj: ToastComponent;

  //--------------------Initailizing required variables
  public ShowconfirmFlag: boolean = false;
  public ShowPopupSelectionstep: boolean = false;
  public promptWidth: string = '400px';
  public stepcolumndata: stepcolumnsmodel = new stepcolumnsmodel();//declaring and initializing the variable to use further
  public stepColumnGriddata: stepcolumnsmodel[];  
  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };
  public lines: GridLine;
  public toolbar: ToolbarItems[] | object;
  public SourceStepColumns: string[];
  public stepcollectionexceptsourcestep: string[];
  public isJoin: string;
  public choosecolumn: string[];  
  public selectionOptions: SelectionSettingsModel;
  public ShowPopupFlag: boolean = true;
  public ShowPopupcreatestepcolumn: boolean = false;
  public ShowStepdropdown: boolean = false;
  public ShowColumndropdown: boolean = false;
  public selectedColumnConfigId: number;
  public tablenamefromcolumname: string;
  public selectedorder: string;
  public data: Object[];
  public ShowCreateBtn: boolean = true;
  public selecteddataId: number;
  public ShowUpdateBtn: boolean = false;
  public managecolumnheader: string;
  public editparams: Object;
  public createcolumnheader: string;
  public showstep: boolean;
  public confirmcontent: string;
  public showClonebutton: boolean = false;
  public editSettings: Object;
  public fields: Object = { text: 'Label', value: 'Id' };
  public choosecolumnfields: Object = { text: 'FieldName', value: 'FieldName' };
  stepcolumncreate: FormGroup = null;
  public choosecolumnplaceholder: string = 'Choose Column*';
  public columnnameofjoiningtable: string;
  public Flextablejoincolconfigid: number;
  public referenceid: number;
  public selectedstepId: number;
  public selectedsteplabel: string;
  public nonechecked: boolean = false;
  public ascchecked: boolean = false;
  public descchecked: boolean = false;
  public confirmBoxFlag: string = "";
  public parentDataFieldId: number;
  public filterSettings: FilterSettingsModel;
  public selectedBaseStepIdforClonning: number;
  public selectedBaseStepForClonning: number;
  public selectedTransactionIds: string = "";
  public Step_count: number;
  public DataField_count: number;
  public LandingPage_count: number;
  public Action_count: number;
  public Notification_count: number;
  public sourceId: number;
  @Output() PostStepColumnEvent = new EventEmitter();

  ngOnInit() {

    this.lines = 'Both';

    this.filterSettings = { type: 'CheckBox' }; // inorder to remove extra filtering from the grid we set it to this type.

    if (this.level == "workflowlevel") {
      this.managecolumnheader = "Manage landing page for Workflow '" + this.configuringWFLabel + "'";
      this.createcolumnheader = "Add new column to the landing page"     
      this.getColumnDetails(0, this.configuringWFId);
    }

    if (this.level == "steplevel") {
      this.managecolumnheader = "Manage landing page for Step '" + this.configuringstepname + "'";
      this.createcolumnheader = "Add New Column to the landing page for Step '" + this.configuringstepname + "'"
      this.getColumnDetails(this.configuringstepid, this.configuringWFId);      
    }

    this.toolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' }, { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' }, { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' }, 'ExcelExport', 'PdfExport', 'CsvExport', 'Search'];

    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };

    this.selectionOptions = { type: 'Multiple', enableSimpleMultiRowSelection: true }

    this.editparams = { params: { popupHeight: '300px' } };    

    this._service.getAllSteps(this.configuringWFId, this.configuringWFLabel)
      .subscribe(
        data => {
          this.SourceStepColumns = (data);
        }
     );
  }

  dialogClose() {
    this.PostStepColumnEvent.emit();
  }  
 
  ClonedialogClose() {
    this.ShowPopupSelectionstep = false;
  }
  
  public getComponentsCounts() {
    this._WFDesignerService.getWFComponentsCounts(this.configuringWFId, this.configuringFlexTableId).subscribe(
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

  public getColumnDetails(StepId, WFId) {
    
    this._service.getColumndetailforstep(StepId, WFId)
      .subscribe(
        data => {
          if (data.length > 0) {
            this.showClonebutton = true;
          }
          if (data.length == 0) {
            this.showClonebutton = false;
          }
          this.stepColumnGriddata = (data);
          this.ShowColumndropdown = true;
          this.stepcolumngrid.refresh();
        }
      );
  }

  //function called on the dropdown change od step dropdown
  public stepentityChange(args: any): void {
    this.selectedstepId = args.itemData.Id;    
    this.selectedsteplabel=args.itemData.Label;
    this.columnobj.enabled = true;
  }

  //confirmation dialogue yes and no button functionality
  public confirmDlgBtnNoClick = (): void => {
    this.confirmDialog.hide();
  }

  public confirmDlgBtnYesClick = (): void => {  
    if (this.confirmBoxFlag =="deletecolumn") {
      this._service.DeleteById(this.stepcolumndata).subscribe(
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
          if (this.level == "steplevel") {
            this.getColumnDetails(this.configuringstepid, this.configuringWFId);
          }
          if (this.level == "workflowlevel") {
            this.getColumnDetails(0, this.configuringWFId);
          }
          this.getComponentsCounts();          
        }
        //(error: any) => alert(error)
      );
    }
    if (this.confirmBoxFlag == "addcolumn") {
      
      this._service.AddFields(this.selectedBaseStepIdforClonning, this.configuringWFId, this.configuringFlexTableId, this.configuringWFLabel).subscribe(
        (data: string) => {
         
          this.columnCreateDialogue.hide();
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
            this.getColumnDetails(this.configuringstepid, this.configuringWFId);
          }
          if (this.level == "workflowlevel") {
            this.getColumnDetails(0, this.configuringWFId);
          } 

          this.getComponentsCounts();
          
        },
        (error: any) => console.log(error)
      );
    }
    
    this.confirmDialog.hide();
  }

  public confirmDlgButtons: ButtonPropsModel[] =
  [
    {click: this.confirmDlgBtnNoClick.bind(this),buttonModel: { content: 'No' }},
    {click: this.confirmDlgBtnYesClick.bind(this),buttonModel: { content: 'Yes', isPrimary: true } }
  ];

  //function called on the clonning of the column
  AddAllFields() {
    if (this.level == "steplevel") {
        this.confirmBoxFlag = "addcolumn"
      this.selectedBaseStepIdforClonning = this.configuringstepid;
      
        this.confirmcontent = "Are you sure you want to add all the columns to Step '" + this.configuringstepname + "'"
        this.confirmDialog.show();
      
      }
    else if (this.level == "workflowlevel") {
        this.confirmBoxFlag = "addcolumn"
        this.selectedBaseStepIdforClonning = this.selectedstepId;
        if (this.selectedBaseStepIdforClonning == undefined) {
          this.toasts[3].content = "Please select step before proceed";
          this.toastObj.show(this.toasts[3]);
        }
        else {
          this.confirmcontent = "Are you sure you want to add all the columns to Step '" + this.selectedsteplabel + "'"
          this.confirmDialog.show();
        }      
      }
  }

  //function called on the clonning of the action
  Clonethis() {
    if (this.configuringstepid == undefined || this.configuringstepid == null) {
      this.toastObj.timeOut = 0;
      this.toasts[2].content = 'From Step can not be blank';
      this.toastObj.show(this.toasts[2]);
    }
    else { 
    const selectedrecords: object[] = this.stepselectiongrid.getSelectedRecords();  // Get the selected records.
    for (var i = 0; i < selectedrecords.length; i++) {
      let StepId = selectedrecords[i]['Id'];
      this.selectedTransactionIds += StepId + "^";
    }
    this.selectedTransactionIds = this.selectedTransactionIds.substring(0, (this.selectedTransactionIds.length) - 1);
    if (this.level == "steplevel") {
      this.stepcolumndata.WStepId = this.configuringstepid;
    }
    if (this.level == "workflowlevel") {
      this.stepcolumndata.WStepId = this.selectedBaseStepIdforClonning;
    }

    this.stepcolumndata.SelectedSteps = this.selectedTransactionIds;
    this.stepcolumndata.wfId = this.configuringWFId;
    this._service.CloneToSelectedSteps(this.stepcolumndata)
      .subscribe(
        data => {
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
          this.StepSelectiondlg.hide();

          if (this.level == "steplevel") {
            this.getColumnDetails(this.configuringstepid, this.configuringWFId);
          }
          if (this.level == "workflowlevel") {
            this.getColumnDetails(0, this.configuringWFId);
          }
          this.getComponentsCounts();
        }
      );
  }
  }

  //opening cloning page on condition
  showpopup() {
    this.ShowPopupSelectionstep = true;
    if (this.level == "workflowlevel") {
      this.showstep = true;
    }
    if (this.level == "steplevel") {
      this.showstep = false;
     
      this._service.GetAllStepsFromWFExceptSourceStep(this.configuringWFId, this.configuringstepid)
      .subscribe(
        data => {
          this.stepcollectionexceptsourcestep = (data);
        }
      );
    }    
  }

  //method to save the column
  onFormSubmit() {
    
    this.submitted = true;
    if (this.tablenamefromcolumname == this.configuringWFLabel) {
      this.isJoin = "no";
    }
    else {
      this.isJoin = "yes";
    }

    //this.stepcolumndata.JoiningTableColumn = this.columnnameofjoiningtable;    
    this.stepcolumndata.Label = this.stepcolumncreate.get('columnlabel').value;
    this.stepcolumndata.DataFieldId = this.selectedColumnConfigId;
    this.stepcolumndata.AscDesc = this.selectedorder;
    this.stepcolumndata.ShouldBeVisible = this.checkBoxvisible.checked;
    this.stepcolumndata.ParentDataFieldId = this.parentDataFieldId;
    if (this.stepcolumndata.AscDesc == undefined) {
      this.stepcolumndata.AscDesc = "none";
    }
    if (this.level == "steplevel") {
      this.stepcolumndata.WStepId = this.configuringstepid;
    }
    if (this.level == "workflowlevel") {
      this.stepcolumndata.WStepId = this.selectedstepId;
    }    
    this.stepcolumndata.IsJoin = this.isJoin;
    //this.stepcolumndata.tablenamefromcolumname = this.tablenamefromcolumname;
    this.stepcolumndata.wfname = this.configuringWFLabel;
    //this.stepcolumndata.RefTableJoinColConfigId = this.Flextablejoincolconfigid
    //this.stepcolumndata.ReferenceId = this.referenceid;
    //this.stepcolumndata.JoiningEntityId = this.referenceid;
    
    //this.stepcolumndata.Ordinal = this.stepcolumncreate.get('columnordinal').value;//not needed after application of drag and drop
    if (this.stepcolumncreate.invalid) {
      return;
    }
    else {
      this._service.Save(this.stepcolumndata).subscribe(
        (data: string) => {
          //this.toasts[1].content = data;
          //this.toastObj.show(this.toasts[1]);

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

          this.columnCreateDialogue.hide();
          this.columndetailDialogue.show();
          //this.stepcolumngrid.refresh();//it is not working for now
          if (this.level == "steplevel") {
            
            this.getColumnDetails(this.configuringstepid, this.configuringWFId);
          }
          if (this.level == "workflowlevel") {
            //this.stepcolumndata.WStepId = this.selectedstepId;
            this.getColumnDetails(0, this.configuringWFId);
          }
          this.getComponentsCounts();
         
        },
        (error: any) => console.log(error)
      );
    }
    //this.stepcolumndata.AscDesc = 
    //alert(this.stepcolumndata.ColumnConfigId);
    //alert(this.stepcolumncreate.get('entity').value);
  
  }


  //event for radio button
  public changeHandler1(): void {
   
    if (this.radiobuttonorder.getSelectedValue() === "none") {
      this.selectedorder = "none";
      
    }
    if (this.radiobuttonorder.getSelectedValue() === "asc") {
      this.selectedorder = "asc";

    }

    if (this.radiobuttonorder.getSelectedValue() === "desc") {
      this.selectedorder = "desc";

    }
  }

  //method called on the step dropdown change on clonning page
  public clonestepentitychange(args: any): void {    
    this.selectedBaseStepIdforClonning = args.itemData.Id;
    this._service.GetAllStepsFromWFExceptSourceStep(this.configuringWFId, args.itemData.Id)
      .subscribe(
        data => {
          this.stepcollectionexceptsourcestep = (data);
        }
      );
  }

  //method called on the changing of the column dropdown
  public change(args: any): void {
    
    this.selectedColumnConfigId = args.itemData.DataFieldId;
    this.parentDataFieldId = args.itemData.ParentDataFieldId;
    this.labelTextBoxobj.enabled = true;
    //this.positionTextBoxobj.enabled = true;
    var str = args.itemData.FieldName;
    var splitted = str.split("] ");
    this.tablenamefromcolumname = splitted[0].replace('[', '');
    this.columnnameofjoiningtable = splitted[1];
    this.columnnameofjoiningtable = this.columnnameofjoiningtable.replace('[', '');
    this.stepcolumncreate.patchValue({
      columnlabel: this.columnnameofjoiningtable,
    });
    //this.stepcolumncreate.set('columnlabel').value = this.columnnameofjoiningtable;
    //this.Flextablejoincolconfigid = args.itemData.FlexTableJoinColConfigId;
    //if (this.Flextablejoincolconfigid == null) {
    //  this.Flextablejoincolconfigid = 0;
    //}
    //this.referenceid = args.itemData.EntityId;
  }

  //method to get the column data for its edition
  GetById(Id) {
    this.ShowCreateBtn = false;
    this.ShowUpdateBtn = true;
    
    this._service.GetById(Id)
      .subscribe(
        data => {
          if (data.AscDesc == "asc") {
            this.ascchecked = true;
          }
          if (data.AscDesc == "desc") {
            this.descchecked = true;
          }
          if (data.AscDesc == "none") {
            this.nonechecked = true;
          }
         
          //this.positionTextBoxobj.enabled = true;
          this.stepcolumncreate.patchValue({
            columnlabel: data.Label,
           // columnordinal: data.Ordinal,
            visible: data.ShouldBeVisible
          });
        }
    );
    this.ShowStepdropdown = false;
    this.ShowColumndropdown = false;
    
    this.ShowPopupcreatestepcolumn = true;
   
    this.selecteddataId = Id;
    this.labelTextBoxobj.enabled = true;
  }

  //method called on the updation of the column data
  Update() {
    
    this.submitted = true;
    this.stepcolumndata.Label = this.stepcolumncreate.get('columnlabel').value;
    this.stepcolumndata.AscDesc = this.selectedorder;
    this.stepcolumndata.ShouldBeVisible = this.checkBoxvisible.checked;//this.stepcolumncreate.get('visible').value;
    if (this.stepcolumndata.AscDesc == undefined) {
      this.stepcolumndata.AscDesc = "none";
    }
   // this.stepcolumndata.Ordinal = this.stepcolumncreate.get('columnordinal').value;
    this.stepcolumndata.Id = this.selecteddataId;
    this.stepcolumndata.wfname = this.configuringWFLabel;
    //if (this.stepcolumncreate.invalid) {
    //  return;
    //}
    //else
    {
      this._service.Put(this.stepcolumndata).subscribe(
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
          this.columnCreateDialogue.hide();
          this.columndetailDialogue.show();          
          this.getColumnDetails(this.configuringstepid, this.configuringWFId);
          this.getComponentsCounts();
         
        },
        //(error: any) => alert(error)
      );
    }   
  }


  //method called on the deletion of the column
  DeleteById(Id) {
    this.confirmcontent="Are you sure you want to delete?"
    this.confirmBoxFlag="deletecolumn"
    this.stepcolumndata.Id = Id;
    this.stepcolumndata.wfname = this.configuringWFLabel;
    this.confirmDialog.show();
  }

  //Context menu define called whle right clicking on the grid component
  public contextMenuItems: ContextMenuItem[] = ['AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending',
    'Copy', 'Edit', 'Delete', 'Save', 'Cancel',
    'PdfExport', 'ExcelExport', 'CsvExport', 'FirstPage', 'PrevPage',
    'LastPage', 'NextPage', 'Group', 'Ungroup'];

  //toolbar click events showing on the manage landing page grid
  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'stepcolumngrid_pdfexport') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      console.log(this.stepcolumngrid);    
      this.stepcolumngrid.pdfExport();
    }
    if (args.item.id === 'stepcolumngrid_excelexport') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      console.log(this.stepcolumngrid);
      this.stepcolumngrid.excelExport();
    }
    if (args.item.id === 'stepcolumngrid_csvexport') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      console.log(this.stepcolumngrid);
      this.stepcolumngrid.csvExport();
    }
    if (args.item.id === 'Add') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      
      this._service.GetAllFlattenedDFsForEntity('FlexTables',this.configuringFlexTableId)
        .subscribe(
          data => {
            
            this.choosecolumn = data.filter(a => a.ReferenceType != 'FormGrid');
          }
      );
      if (this.level == "workflowlevel") {
        this.ShowStepdropdown = true;
        this.createcolumnheader = "Add new column to the landing page"
      }
      if (this.level == "steplevel") {
        this.ShowStepdropdown = false;
        this.createcolumnheader = "Add New Column to the landing page for Step '" + this.configuringstepname + "'"
      }

      //condition for showing add pop up at workflow level
      if (this.ShowStepdropdown == true) {
        this.stepcolumncreate.patchValue({
          columnlabel: null,
          visible: true,
          stepdrop: null,//condition at workflow level
          order: "none",
          country: null,
          coldrop: null,
        });
      }
      //condition for showing add pop up at step level
      if (this.ShowStepdropdown == false) {
        this.stepcolumncreate.patchValue({
          columnlabel: null,
          visible: true,          
          order: "none",
          country: null,
          coldrop: null,
        });
      }
      
      
      this.ShowCreateBtn = true;
      this.ShowUpdateBtn = false;
      this.ShowPopupcreatestepcolumn = true;
      this.nonechecked = true;//by default none will get checked
    }

    if (args.item.id === 'Edit') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      
      //this.ShowPopupcreatestepcolumn = true;
      const selectedRecords = this.stepcolumngrid.getSelectedRecords();
      
      //if (selectedRecords.length == 0) {
      //  this.ShowconfirmFlag = true;
      //}
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No record selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        //this.router.navigate([this.returnUrl, selectedRecords[0].Id]);
        //this.ShowconfirmFlag = false;
        this.createcolumnheader = "Edit"
        this.GetById(selectedRecords[0]['Id']);
      }
    }

    if (args.item.id === 'Delete') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name

      const selectedRecords = this.stepcolumngrid.getSelectedRecords();
      //if (selectedRecords.length == 0) {
      //  this.ShowconfirmFlag = true;
      //}
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No record selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
       
        //this.ShowconfirmFlag = false;
        this.DeleteById(selectedRecords[0]['Id']);
      }
    }


  }

  public recordDoubleClick(args): void {
    this.ShowconfirmFlag = false;
    this.createcolumnheader = "Edit"
    this.GetById(args.rowData['Id']);
   
  }

  //event call for drag and drop functinality
  rowDrop(args) {
    let SoucreId = args.data[0]['Id']
    let dropIndex = args['dropIndex'];
    let targetdata = this.stepColumnGriddata[dropIndex];
    let TargetId = targetdata['Id'];
    this._service.DragAndDropRowDynamic(SoucreId, TargetId, this.configuringstepid).subscribe(data => {
      if (this.level == "workflowlevel") {
        this.getColumnDetails(0, this.configuringWFId);
      }
      if (this.level == "steplevel") {
        this.getColumnDetails(this.configuringstepid, this.configuringWFId);
      }
    })
  }
  //------------------------------------------------------------validations--------------------------------------------------------
  get f() { return this.stepcolumncreate.controls; }

  public isFieldValid(field: string) {
    return !this.stepcolumncreate.get(field).valid && (this.stepcolumncreate.get(field).dirty || this.stepcolumncreate.get(field).touched);
  }
  constructor(private _WFDesignerService: WorkflowdesignerService,@Inject(FormBuilder) private builder: FormBuilder, private _service: StepColumnsService) {
    this.stepcolumncreate = new FormGroup({      
      columnlabel: new FormControl('', [Validators.required,Validators.maxLength(255)]),
      //columnordinal: new FormControl('', [Validators.required]),
      visible: new FormControl(''),
      order: new FormControl(''),
      country: new FormControl(''),
      coldrop: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      stepdrop: new FormControl('',[Validators.required, Validators.maxLength(255)])
    });
  }
  
}
