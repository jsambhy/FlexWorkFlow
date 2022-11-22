import { Component, Input, ViewChild } from '@angular/core';
import { ClickEventArgs, SelectEventArgs } from '@syncfusion/ej2-angular-navigations';
import { GridComponent, ToolbarService, EditService, PageService, ExcelExportService, PdfExportService, FreezeService, ContextMenuService, GridLine, ToolbarItems, FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { TextBoxComponent} from '@syncfusion/ej2-angular-inputs';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { StepColumnsService } from '../../../services/step-columns.service';
import { CalculationsService } from '../../../services/calculations.service';
import { BranchService } from '../../../services/branch.service';
import { calculationmodel } from '../../../models/calculations.model';
import { DashboardService } from '../../../services/dashboard.service';
import { RadioButtonComponent } from '@syncfusion/ej2-angular-buttons';


@Component({
  selector: 'app-calculations',
  templateUrl: './Calc.html',
  styleUrls: ['./calculations.component.css'],
  providers: [StepColumnsService, CalculationsService, BranchService, ToolbarService, EditService, PageService,
    ExcelExportService, PdfExportService, FreezeService, ContextMenuService, DashboardService]
})
export class CalculationsComponent {
  // getting parent from component message
  @Input() configuringstepname: string;
  @Input() configuringstepid: number;
  @Input() configuringWFId: number;
  @Input() configuringEntityId: number;
  @Input() configuringWFLabel: string;
  @Input() configuringStepActionId: number;
  @Input() configuringStepActionLabel: string;
  @Input() sourceStepId: number;
  @Input() popupHeader: string;
  @Input() calcSource: string;
  @Input() configuringEntityType: string;
  filterSettings: FilterSettingsModel;
  PopUpHeader: string;

  //Creating ViewChilds of the Components used for the further operations
  @ViewChild('toasttype', { static: false }) private toastObj: ToastComponent;
  @ViewChild('confirmDialog', { static: false }) public confirmDialog: DialogComponent;
  @ViewChild('radiobutton', { static: false }) public radiobutton: RadioButtonComponent;  
  @ViewChild('stepactioncalcgrid', { static: false }) public stepactioncalcgrid: GridComponent;
  @ViewChild('FormGridDD', { static: false }) public FormGridDD: DropDownListComponent;
  @ViewChild('Targetentity', { static: false }) public Targetentity: DropDownListComponent;
  @ViewChild('Nameobj', { static: false }) public Nameobj: TextBoxComponent;
  @ViewChild('ResultMLobj', { static: false }) public ResultMLobj: TextBoxComponent;
  @ViewChild('resultCal', { static: false }) public resultCal: TextBoxComponent;

  //Variable Initialization
  CalcForm: FormGroup = null;
  public choosecolumn: any[];
  public FieldData: string[];
  public lines: GridLine;
  public toolbarCalc: ToolbarItems[] | object;
  public editSettings: Object;
  public showAddCalcPopUp: boolean = false;
  public position: ToastPositionModel = { X: 'Center' };
  public calcmodeldata: calculationmodel[];
  public enabled: boolean = false;
  public entityText: string;
  public confirmWidth: string = '400px';
  public entityType: string;
  public confirmBoxFlag: string;
  public entityId: number;
  public createbutton: boolean = true;
  public updatebutton: boolean = false;
  public columnAttributeVal: string;
  public userFriendlyExpression: string;
  public confirmcontent: string;
  //showSpecialCalculations: boolean = false;
  showFormGridDD: boolean = false;
  public TargetColumnConfigId: number;
  public showCalculationdiv: boolean = false;
  public showWherediv: boolean = false;
  hidden: boolean = false;
  public selectedTargetColumnId: number;
  //public SelectedFieldTextCalculation: string;
  public calcData: calculationmodel = new calculationmodel();
/* public choosecolumnfields: Object = { text: 'FieldName', value: 'DataFieldId' };*/
  public choosecolumnfields: Object = { text: 'FieldName', value: 'FieldName' };
  FormGridfields: Object = { text: 'Label', value: 'Label' };
  YesChecked: Boolean = true;
  NoRBChecked: Boolean = false;
  CalculationExpression: string;
  ConditionExpression: string;
  StepActionId: number;
  NoteText: string;
  DataFieldSrc: any;
 
  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];

  constructor(private formBuilder: FormBuilder, private _calservice: CalculationsService, private _colservice: StepColumnsService, private _service: BranchService) {
    this.CalcForm = this.formBuilder.group({
      CalcName: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      TargetCol: new FormControl('', [Validators.required]),
      //Calc: new FormControl('', [Validators.required]),
      //Cond: new FormControl(''),
      FormGridName: new FormControl('')
    });
  }


  //method for validation purpose
  get f() { return this.CalcForm.controls; }

  //angular cycle Init event, to initaialize the required methods/components/variables
  ngOnInit() {

    
    this.lines = 'Both';
    this.filterSettings = { type: 'CheckBox' }; // inorder to remove extra filtering from the grid we set it to this type.
    // this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    this.toolbarCalc = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' }, { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' }, { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' }, 'ExcelExport', 'PdfExport', 'CsvExport', 'Search'];

    if (this.calcSource == "Datafield") {
      this.popupHeader = "Manage Calculation for DataFields";
      this.NoteText = "Use this functionality if you want any calculation to happen on Form";
      this.StepActionId = 0;
    }
    else {
      this.StepActionId = this.configuringStepActionId;
      this.popupHeader = "Manage Calculation for Action " + this.configuringStepActionLabel;
      this.NoteText = "Use this functionality if you want any calculation to happen when user presses this action.";
    }
    this.getCalcData();

    this._colservice.GetAllFlattenedDFsForEntity(this.configuringEntityType, this.configuringEntityId)
      this.GetAllFlattenedDFsForEntity();
    
  }

    GetAllFlattenedDFsForEntity() {
      this._colservice.GetAllFlattenedDFsForEntity(this.configuringEntityType, this.configuringEntityId)
      .subscribe(
        data => {
          
          this.DataFieldSrc = data;
          this.choosecolumn = data.filter(a => a.UserDataType != 'WhoColumns');
          console.log(this.choosecolumn);
        }
      );
  }

  IsFormGrid: Boolean;
  public changeHandler(): void {
    
    if (this.radiobutton.getSelectedValue() === "Yes") { //this means special handling is required
      this.showFormGridDD = true;
      //this.showCalculationdiv = false;
      this.IsFormGrid = true;
      this.GetFormGridDataByEntity();
    }
    else {
      this.showFormGridDD = false;
      this.IsFormGrid = false;
      this.showCalculationdiv = true;
      this.showWherediv = true;
    }
    
  }

  FormGridName: string;
  public FormGridChange(args: any): void {
    
    this.FormGridName=args.itemData.Label;
    this.showCalculationdiv = false;
  }

  onTabSelect(args: SelectEventArgs) {
    

    let TabIndex = args.selectedIndex;
    if (TabIndex == 1 || TabIndex == 2) {
      this.showCalculationdiv = true;
      this.showWherediv = true;
    }
    //else {
    //  this.showCalculationdiv = false;
    //}
  }

  FormGridData: any;
  GetFormGridDataByEntity() {
    this._service.GetFormGridDataByEntity(this.configuringEntityType, this.configuringEntityId)
      .subscribe(
        data => {
          this.FormGridData = data;
        }
      );
  }

  //method called on the Target entity dropdown change event
  public TargetentityChange(args: any): void {
    
   
    this.TargetColumnConfigId = args.itemData.DataFieldId;
    if (this.resultCal != undefined) {
      if (this.resultCal.value != null) {
        this.confirmBoxFlag = "resetCalculation";
        this.confirmcontent = 'You are updating Target column, this will wipe out existing calculation, do you wish to continue?'
        this.confirmDialog.show();
      }
    }
    
  }

  
  //method to get the attricute column value of the selected entity
  getAttributeByColConfigId(Value) {
    this._service.getAttributeByColConfigId(Value)
      .subscribe(
        data => {
          this.columnAttributeVal = data;
        }
      );
  }

  

  //method to get the calculation data by stepActionId
  public getCalcData() { 
    this._calservice.getCalcDetails(this.StepActionId, this.configuringEntityType, this.configuringEntityId)
      .subscribe(
        data => {
          this.calcmodeldata = (data);
        }
      );
  }


  //method called on the toolbar click
  toolbarClickCalc(args: ClickEventArgs): void {
    if (args.item.id === 'stepactioncalcgrid_pdfexport') {
      this.stepactioncalcgrid.pdfExport();
    }
    if (args.item.id === 'stepactioncalcgrid_excelexport') {
      this.stepactioncalcgrid.excelExport();
    }
    if (args.item.id === 'stepactioncalcgrid_csvexport') {
      this.stepactioncalcgrid.csvExport();
    }
    if (args.item.id === 'Add') {
      this.calcData.Id = 0;
      this.showAddCalcPopUp = true;

      this.showFormGridDD = true;
      this.IsFormGrid = true;
      this.showCalculationdiv = false;
      this.showWherediv = false;
      this.GetFormGridDataByEntity();
      this.CalculationExpression = "";
      this.ConditionExpression = "";

      this.CalcMappingDFIds = "";

      //if (this.calcSource == "DataField") {
      //  //this.showSpecialCalculations = true;
      //  this.showFormGridDD = true;
      //  this.IsFormGrid = true;
      //  this.showCalculationdiv = false;
      //  this.GetFormGridDataByEntity();
      //  this.CalculationExpression = "";
      //  this.ConditionExpression = "";
      //}
      //else {
      //  this.showCalculationdiv = true;
      //}

      this.CalcForm.patchValue({
        CalcName: null,
        TargetCol: null,
        FormGridName: null
      });
      this.YesChecked = true;
    }
    if (args.item.id === 'Edit') {
      const selectedRecords = this.stepactioncalcgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
      }
      else {
        //Get Mapped DF Ids 
        this._calservice.GetMappedDFIDsByCalcId(selectedRecords[0]['Id']).subscribe(
          (data) => {
            this.CalcMappingDFIds = data;
          });

        this.EditById(selectedRecords[0]['Id']);
        this.calcData.Id = selectedRecords[0]['Id'];
        this.createbutton = false;
        this.updatebutton = true;
        this.showAddCalcPopUp = true;
        this.showCalculationdiv = true;
        this.showWherediv = true;
      }
    }
    if (args.item.id === 'Delete') {
      const selectedRecords = this.stepactioncalcgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {

      }
      else {
        this.DeleteById(selectedRecords[0]['Id']);
      }
    }
  }

  //method called on the edition of data
  EditById(Id) {
    
    this._calservice.EditById(Id).subscribe(
      (data: any) => {

        var TargetField = this.choosecolumn.filter(x => x.DataFieldId == data.TargetDatafieldId)[0].FieldName;
        this.calcData = data;
        this.showCalculationdiv = true;
        this.showWherediv = true;
        this.CalculationExpression = data.Calculation;
        this.ConditionExpression = data.Condition;
        this.WhereClause = data.Condition;
        this.Calculation = data.Calculation;
        this.TargetColumnConfigId = data.TargetDatafieldId;
        this.IsFormGrid = data.IsFormGrid;
        this.FormGridName = data.FormGridName;

        this.CalcForm.patchValue({
          CalcName: data.Name,
          TargetCol: TargetField,
          FormGridName: data.FormGridName
         });
        
        if (data.IsFormGrid) {
          //this.showSpecialCalculations = true;
          this.GetFormGridDataByEntity();
          this.YesChecked = true;
          this.NoRBChecked = false;
          this.showFormGridDD = true;
        }
        else {
          this.YesChecked = false;
          this.NoRBChecked = true;
          this.showFormGridDD = false;
        }

        
        
      },
      (error: any) => console.log(error)
    );
    
  }

  //method called on the deletion of the data
  DeleteById(Id) {
    var r = confirm('Are you sure you want to delete?');
    if (r == false)
      return; //if user select no from confirm popup then it will not further proceed
    else {
      this._calservice.DeleteById(Id).subscribe(
        (data: string) => {         
          //if (data =="Successfully Deleted") {
          //  this.toasts[1].content = data;
          //  this.toastObj.show(this.toasts[1]);
          //}
          this.toastObj.timeOut = 3000;
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
            this.toastObj.timeOut = 0;
            this.toasts[2].content = Showmsg;
            this.toastObj.show(this.toasts[2]);
          }
          this.getCalcData();
          
        },
        //(error: any) => alert(error)
      );
    }

  }

  //method called on the saving of the data
  SaveData() {
    
    //if (this.CalcForm.invalid) {
    //  return;
    //}
    //else {
    //  var str = this.resultCal.value;
    //var res = str.replace("+", "plus");
    this.calcData.Calculation = this.Calculation;
     
    this.calcData.Condition = this.WhereClause;
    this.calcData.Name = this.Nameobj.value.trim();//removing front and end spaces
    this.calcData.TargetDatafieldId = this.TargetColumnConfigId;
    this.calcData.wfname = this.configuringWFLabel;
    this.calcData.WStepActionId = this.configuringStepActionId;
    this.calcData.Type = this.calcSource;
    this.calcData.EntityType = this.configuringEntityType;
    this.calcData.EntityId = this.configuringEntityId;
    this.calcData.IsFormGrid = this.IsFormGrid;
    this.calcData.FormGridName = this.FormGridName;
    this.calcData.CalcMappingDFIds = this.CalcMappingDFIds;
      this._calservice.Save(this.calcData).subscribe(
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
          this.showAddCalcPopUp = false;
          this.getCalcData();
        },
        //(error: any) => console.log(error)
      );
   // }

  }

  //method called while updation of data
  UpdateData() {
    
    if (this.CalcForm.invalid) {
      return;
    }
    else {
      //var str = this.resultCal.value;
      //var res = str.replace("+", "plus");
     // this.calcData.Calculation = res;
      //this.calcData.Condition = this.ResultMLobj.value;
      this.calcData.Calculation = this.Calculation;

      this.calcData.Condition = this.WhereClause;
      this.calcData.Name = this.Nameobj.value;
      this.calcData.TargetDatafieldId = this.TargetColumnConfigId;
      this.calcData.wfname = this.configuringWFLabel;
      this.calcData.WStepActionId = this.configuringStepActionId;
      this.calcData.Type = this.calcSource;
      this.calcData.EntityType = this.configuringEntityType;
      this.calcData.EntityId = this.configuringEntityId;
      this.calcData.IsFormGrid = this.IsFormGrid;
      this.calcData.FormGridName = this.FormGridName;
      this.calcData.CalcMappingDFIds = this.CalcMappingDFIds;
      this._calservice.Update(this.calcData).subscribe(
        (data: string) => {
          //console.log(data);         
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
          this.showAddCalcPopUp = false;
          this.getCalcData();
        },
        (error: any) => console.log(error)
      );
    }
  }
 
 
  Calculation: string = '';
  CalcMappingDFIds: string='';
  PostHavingClauseEvent(val) {
    
    this.Calculation = val.Expression;

    if (val.IsResetPressed)//If reset is pressed in case of reset then need to create new CalcMappingDFIds else append in existing CalcMappingDFIds
    {
      this.CalcMappingDFIds = "";
    }

    //In case if CalcMappingDFIds is already populated then we need to append one comma otherwise two ids will be together.
    if (this.CalcMappingDFIds != "") {
      this.CalcMappingDFIds = this.CalcMappingDFIds + ",";
    }

      if (val.CalcParticpantDFIDs != '') {
        var ParticpantDFIDArr = val.CalcParticpantDFIDs.split(',');
        for (let i = 0; i < ParticpantDFIDArr.length; i++) {
          var DFInfo = this.DataFieldSrc.filter(x => x.DataFieldId == ParticpantDFIDArr[i]);

          //In case of dropdown, we need to add ParentDataFieldId in MCustomCalculationDependentDataFields
          //else we need to add DataFieldId in MCustomCalculationDependentDataFields
          if (DFInfo[0].ParentUserDataType == 'MultiColumnList' || DFInfo[0].ParentUserDataType == 'SingleColumnList') {
            this.CalcMappingDFIds = this.CalcMappingDFIds + DFInfo[0].ParentDataFieldId + ',';
          }
          else {
            this.CalcMappingDFIds = this.CalcMappingDFIds + DFInfo[0].DataFieldId + ',';
          }
        }

        this.CalcMappingDFIds = this.CalcMappingDFIds.substring(0, (this.CalcMappingDFIds.length) - 1);
      }
    
  }

  WhereClause: string = '';
  PostWhereClauseEvent(val) {
    this.WhereClause = val.WhereExpression;
  }
}

