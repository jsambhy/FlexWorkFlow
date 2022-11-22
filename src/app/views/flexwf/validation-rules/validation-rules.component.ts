import { Component, ViewChild, Input } from '@angular/core';
import { ValidationsService } from '../../../services/validations.service';
import { FlexWorkflowsService } from '../../../services/flex-workflows.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { validationRulesmodel } from '../../../models/validations.model';
import { GridComponent, GridLine, ToolbarItems, FilterSettingsModel, ToolbarService, ExcelExportService, PdfExportService } from '@syncfusion/ej2-angular-grids';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
import { DropDownListComponent} from '@syncfusion/ej2-angular-dropdowns';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { DashboardService } from '../../../services/dashboard.service';
import { StepColumnsService } from '../../../services/step-columns.service';
import { Boolean } from 'aws-sdk/clients/ec2';
import { CheckBoxComponent, RadioButtonComponent } from '@syncfusion/ej2-angular-buttons';
import { Ajax } from '@syncfusion/ej2-base';
import { environment } from '../../../../environments/environment';
@Component({
    selector: 'app-validation-rules',
    templateUrl: './validation-rules.component.html',
  styleUrls: ['./validation-rules.component.css'],
  providers: [ToolbarService, ExcelExportService, PdfExportService, DashboardService]
})
/** validation-rules component*/
export class ValidationRulesComponent {
    /** validation-rules ctor */
  constructor(private formBuilder: FormBuilder, private _service: ValidationsService, private _flexWFService: FlexWorkflowsService,private _colservice: StepColumnsService
   ) {
    this.validationRulesForm = this.formBuilder.group({
      Name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      Description: new FormControl('', [Validators.maxLength(4000)]),
      Message: new FormControl('', [Validators.required, Validators.maxLength(4000)]),
      ValidationType: new FormControl(''),
      VoilationThreshold: new FormControl(''),
      Entity: new FormControl(''),
      IsActive: new FormControl('')
    });
  } //const ends
  @Input() Level: string;
  @Input() PreSelected_WFId: number;
  @Input() PreSelected_WFName: string;
  
  filterSettings: FilterSettingsModel;//--------inorder to remoive first unwanted row we have to define this filtersetting line
  confirmHeader: string = '';
  validationRulesForm: FormGroup = null;
  projectId: number;
  hidden = false;
  ShowCreateBtn = true;
  ShowUpdateBtn = false;
  confirmcontent: string;
  sessionprojectid: string;
  validationRuleId: number;
  LoggedInUserId: number;
  LoggedInRoleId: number;
  validationRulesGridData: validationRulesmodel[];
  Header: string;
  ShowVRGrid = false;
  selectedWFId: number;
  toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  @ViewChild('ValidationsRulesgrid', { static: false }) public ValidationsRulesgrid: GridComponent;
  @ViewChild('toasttype', { static: false }) private toastObj: ToastComponent;
  @ViewChild('confirmDialog', { static: false }) public confirmDialog: DialogComponent;
  @ViewChild('WFdropdown', { static: false }) public WFdropdown: DropDownListComponent;
  @ViewChild('IsActive', { static: false }) public IsActive: CheckBoxComponent;
  @ViewChild('radiobutton', { static: false }) public radiobutton: RadioButtonComponent;
  WFfields: Object = { text: 'UILabel', value: 'Id' }

  position: ToastPositionModel = { X: 'Center' };
  lines: GridLine; WFSource: string[]; editSettings: Object;
  
  ShowPopupCreateEditvalidationrules = false;
  toolbar: ToolbarItems[] | object;
  
  validationRulesmodelData: validationRulesmodel = new validationRulesmodel();//declaring and initializing the variable to use further  
  CurrentRoleName: string = sessionStorage.getItem("CurrentRoleName");
  LoginEmail: string = sessionStorage.getItem("LoginEmail");
  showWhereClause = false;
  showNumericTextBox = false;
  SessionValues :any = sessionStorage;
  choosecolumn: any = [];
  arraytext: any = [];
  choosecolumnfieldsforcondition: Object = { text: 'FieldName', value: 'DataFieldId' }; //DataFieldId
  Columns: any = [];
  ExpressionVal: string;
  ShowClauses = false;
  enableWFDD = true;
  ValidationTypes: Object[];
  ValidationTypeFields: Object = { text: 'text', value: 'value' };
  YesChecked = false; 
  Nochecked = true;
  tablenames: Object = [];
  chooseTablefields: Object = { text: 'EntityName', value: 'EntityId' };
  TableEntityType: string;
  TableEntityId: number;
  WhereClause: string;
  selectedcolumnstrings: string = "";
  selectedcolumnids: string = "";
  readonly baseUrl = environment.baseUrl;
  showValidationType = false;
  showColumns =  false;
  selectedcolumn = false;
  flexTableId: number;
  LoggedInScopeEntityId: number;
  LoggedInScopeEntityType: string;

  //-----------------------------method call on the toolbars of grid------------------------------
  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'ValidationsRulesgrid_pdfexport') {
      this.ValidationsRulesgrid.pdfExport();
    }
    if (args.item.id === 'ValidationsRulesgrid_excelexport') {
      this.ValidationsRulesgrid.excelExport();
    }
    if (args.item.id === 'ValidationsRulesgrid_csvexport') {
      this.ValidationsRulesgrid.csvExport();
    }
    if (args.item.id === 'Add') {
      this.Header = "Create Validation Rules"
      this.ShowCreateBtn = true;
      this.ShowUpdateBtn = false;
      this.Nochecked = true;
      this.ShowPopupCreateEditvalidationrules = true;//opening create form
      this.showWhereClause = true;
      
      this.validationRulesForm.patchValue({
        Name: null,
        Description: null,
        Message: null,
        WhereClause: null,
        ValidationType: null,
        VoilationThreshold: null,
        Entity: null,

      });
    }
    if (args.item.id === 'Edit') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      const selectedRecords = this.ValidationsRulesgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No validation selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.validationRuleId = selectedRecords[0]['Id'];// 
        this.GetById(this.validationRuleId);
      }
    }
    if (args.item.id === 'Delete') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      const selectedRecords = this.ValidationsRulesgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No validation selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.validationRuleId = selectedRecords[0]['Id'];// 
        this.Delete();
      }
    }
  }

  //to access all the controls of the defined form on html page created a comon method
  get f() { return this.validationRulesForm.controls; }
  public isFieldValid(field: string) {
    return !this.validationRulesForm.get(field).valid && (this.validationRulesForm.get(field).dirty || this.validationRulesForm.get(field).touched);
  }

  //--------------------------Init event -------------------------------------------------
  ngOnInit() {
    this.LoggedInScopeEntityId = +sessionStorage.getItem('LoggedInScopeEntityId');
    this.LoggedInScopeEntityType = sessionStorage.getItem('LoggedInScopeEntityType');
    this.ValidationTypes = [{ text: 'Atleast 1 row', value: 'Atleast 1 row' }, { text: 'Dupe Check', value: 'Dupe Check' }];
    this.lines = 'Both'; //to et both lines in grid
    this.filterSettings = { type: 'CheckBox' };

    //to show custom tool bar in grid with custom icons and method calls
    this.toolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' }, { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' }, { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' }, 'ExcelExport', 'PdfExport', 'CsvExport', 'Search'];

    //initializing events of grid record
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };

    //getting required parametrs value from session
    this.LoggedInRoleId = +sessionStorage.getItem("LoggedInRoleId");
    this.sessionprojectid = sessionStorage.getItem("ProjectId");
    this.projectId = +this.sessionprojectid; // conversion from string to int   
    this.LoggedInUserId = +sessionStorage.getItem("LoggedInUserId");
    this.getWFdata();//binding wf drpodown
    
  }

  //method to get the workflow data and fill in workflow dropdown
  getWFdata() {
    this._flexWFService.GetWorkFlowsByScopeEntity(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
      .subscribe(
        data => {
          this.WFSource = (data);
          if (this.Level == "ValidationLevel") {
            this.WFdropdown.value = this.PreSelected_WFId;
            this.enableWFDD = false;
          }
            
        }
    );
    
  
  }
  //event for radio button
  public changeHandler(): void {
    if (this.radiobutton.getSelectedValue() === "Yes") { //this means special handling is required
      this.showWhereClause = false;
      this.showValidationType = true;
      this.showColumns = true;
      this.YesChecked = true;
      this.Nochecked = false;
    }
    if (this.radiobutton.getSelectedValue() === "No") {
      this.showWhereClause = true;
      this.showValidationType = false;
      this.showColumns = false;
      this.YesChecked = false;
      this.Nochecked = true;
    }
  }
  //wf dropdown change event method
  WFNameChange(args: any): void {
    
    this.ShowVRGrid = true;
    this.selectedWFId = args.itemData.Id;
    this.TableEntityType = "FlexTables";
    this.TableEntityId = args.itemData.EntityId;
    //this.showWhereClause = true;
    this.GetColumnListByEntity();
    
    this._flexWFService.GetFlexIdByWFId(this.selectedWFId)
      .subscribe(
        data => {
          this.flexTableId = data;
        });
    this.getData(this.selectedWFId);
  }

  //validation type change
  
  ValidationTypeChange(args: any): void {
    
    if (args.itemData.value == "Dupe Check") {
      this.showNumericTextBox = true;
    }
    else {
      this.showNumericTextBox = false;
    }
  }
  GetColumnListByEntity() {
    this._colservice.GetAllFlattenedDFsForEntity(this.TableEntityType, this.TableEntityId)
      .subscribe(
        data => {
          
          this.choosecolumn = (data);
        
         
        }
      );
  }
  //method to get the records in grid
  getData(Id) {
    this._service.GetAllValidationRulesByWFId(Id)
      .subscribe(
        data => {
          this.validationRulesGridData = (data);
          this.ShowVRGrid = true;
        }
      );
  }

  
  PostWhereClauseEvent(val) {
    this.WhereClause = val;
  }
  selectedValues = [];

  entityChange(args: any) {
    
    //this.arraytext = args.element.innerText.split("\n")[0];
    this.arraytext = args.element.innerText.replace("\nSelect Column(s)", "");
    this.arraytext = this.arraytext.replaceAll("\n",",");
  }


  GetSelectedFormGridColumns() {

    this.arraytext = this.arraytext.replace(', ', ',');
    let testarray = this.arraytext.split(",");

    for (var i = 0; i < testarray.length; i++) {
      var splitted = testarray[i].split("] ");
      var tablenamefromcolumname = splitted[0].replace('[', '');
      var xx = "{[" + tablenamefromcolumname + "]." + splitted[1] + "}";
      this.selectedcolumnstrings = this.selectedcolumnstrings + "," + xx;
    }

    this.selectedcolumnstrings = this.selectedcolumnstrings.substring(1)
  }


  
  getcolumnsidlist() {
    let listOfColumnsids = this.validationRulesForm.get('Entity').value;
    if (listOfColumnsids != null && listOfColumnsids != undefined && listOfColumnsids != '') {
      for (var i = 0; i < listOfColumnsids.length; i++) {
        this.selectedcolumnids = this.selectedcolumnids + "," + listOfColumnsids[i];
      }

      this.selectedcolumnids = this.selectedcolumnids.substring(1)
    }
    else {
      this.selectedcolumnids = '';
    }
  }

  //method to save the record
  Save() {
    
    this.getcolumnsidlist();
    if (this.validationRulesForm.invalid) {
      return;
    }
    else {
      
      if (this.YesChecked === true) {
        this.GetSelectedFormGridColumns();//Prepare selectedcolumnstrings in desired format 
        this.validationRulesmodelData.WhereClause = "WHERE 1=1";
        this.validationRulesmodelData.VoilationThreshold = this.validationRulesForm.get('VoilationThreshold').value;
        this.validationRulesmodelData.Type = this.validationRulesForm.get('ValidationType').value
        this.validationRulesmodelData.FormGridColumn = "SELECT " + this.selectedcolumnstrings;
        this.validationRulesmodelData.FormGridColumnIds = this.selectedcolumnids;
      }
      else {
        this.validationRulesmodelData.WhereClause = this.WhereClause;
        this.validationRulesmodelData.VoilationThreshold = 0;
        this.validationRulesmodelData.Type = null,
          this.validationRulesmodelData.FormGridColumn = null;
        this.validationRulesmodelData.FormGridColumnIds = null;
      }
      
      this.validationRulesmodelData.Name = this.validationRulesForm.get('Name').value.trim();//removing lead and back space from the string
      this.validationRulesmodelData.Description = this.validationRulesForm.get('Description').value;
      this.validationRulesmodelData.Message = this.validationRulesForm.get('Message').value;      
      this.validationRulesmodelData.WorkflowId = this.selectedWFId;
      this.validationRulesmodelData.FlexTableId = this.flexTableId;
      this.validationRulesmodelData.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + "No Workflow" + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|" + "ProjectId=" + this.projectId + "|" + "FormGridColumn=" + this.selectedcolumnstrings.substring(1);
      this.validationRulesmodelData.CreatedById = this.LoggedInUserId;
      this.validationRulesmodelData.UpdatedById = this.LoggedInUserId;
      this.validationRulesmodelData.CreatedByRoleId = this.LoggedInRoleId;
      this.validationRulesmodelData.UpdatedByRoleId = this.LoggedInRoleId;
      this.validationRulesmodelData.IsActive = this.IsActive.checked;
      this.validationRulesmodelData.ProjectId = this.projectId;
      this._service.SaveValidationRule(this.validationRulesmodelData).subscribe(
        (data: any) => {
          this.toasts[1].content = "Validation Rule created successfully";
          this.toastObj.show(this.toasts[1]);
          this.ShowPopupCreateEditvalidationrules = false;
          this.getData(this.selectedWFId);
        },
        (error: any) => {
          this.toasts[2].content = error.error.Message;
          this.toastObj.show(this.toasts[2]);
          this.ShowPopupCreateEditvalidationrules = true;
        }
      );
    }
  }

  existingwhereclause: string;
  SelectedColArray = [];
  //FormGridValue: string;
  //method to get details of the selected data for edit
  GetById(Id) {
    
    this.ShowCreateBtn = false;
    this.ShowUpdateBtn = true;
    this._service.GetValidationRuleDataById(Id)
      .subscribe(
        data => {
          this.Header = "Edit Validation Rule"
          this.ShowPopupCreateEditvalidationrules = true;
          this.showWhereClause = true;

          if (data.Type !== null) {
            this.showWhereClause = false;
            this.showValidationType = true;
            this.showColumns = true;
            this.YesChecked = true;
            this.Nochecked = false;
            //this.FormGridType.value = data.Type;
            this.SelectedColArray = data.FormGridColumnIds.split(",");
          }
          else {
            this.showWhereClause = true;
            this.showValidationType = false;
            this.showColumns = false;
            this.YesChecked = false;
            this.Nochecked = true;
          }
          if (data.Type == "Dupe Check") {
            this.showNumericTextBox = true;
          }
          else {
            this.showNumericTextBox = false;
          }

          this.validationRulesForm.patchValue({
            Name: data.Name,
            Description: data.Description,
            Message: data.Message,
            ValidationType: data.Type,
            VoilationThreshold: data.VoilationThreshold,
            IsActive:data.IsActive,
           Entity: this.SelectedColArray
           // WhereClause: data.WhereClause
          });

          
          this.WhereClause = data.WhereClause;
          this.existingwhereclause = data.WhereClause;
          this.ExpressionVal = data.WhereClause;
          this.selectedWFId = data.WorkflowId;
          this.validationRuleId = Id; //to use if for further use stored in the variable

          //this.FormGridType.value = data.Type;
          console.log(data);
          //this.selectedValues = data.FormGridColumnIds;
        }
      );
  }

  //method for updating records
  Update() {
    debugger
    this.getcolumnsidlist();
    if (this.validationRulesForm.invalid) {
      return;
    }
    else {
      if (this.YesChecked === true) {
        this.GetSelectedFormGridColumns();//Prepare selectedcolumnstrings in desired format 
        this.validationRulesmodelData.WhereClause = "WHERE 1=1";
        this.validationRulesmodelData.VoilationThreshold = this.validationRulesForm.get('VoilationThreshold').value;
        this.validationRulesmodelData.Type = this.validationRulesForm.get('ValidationType').value
        this.validationRulesmodelData.FormGridColumn = "SELECT " + this.selectedcolumnstrings;
        this.validationRulesmodelData.FormGridColumnIds = this.selectedcolumnids;
      }
      else {
        this.validationRulesmodelData.WhereClause = this.WhereClause;
        this.validationRulesmodelData.VoilationThreshold = 0;
        this.validationRulesmodelData.Type = null,
          this.validationRulesmodelData.FormGridColumn = null;
        this.validationRulesmodelData.FormGridColumnIds = null;
      }

      this.validationRulesmodelData.FlexTableId = this.flexTableId;
      this.validationRulesmodelData.Id = this.validationRuleId;
      this.validationRulesmodelData.Name = this.validationRulesForm.get('Name').value.trim();//removing lead and back space from the string
      this.validationRulesmodelData.Description = this.validationRulesForm.get('Description').value;
      this.validationRulesmodelData.Message = this.validationRulesForm.get('Message').value;
      this.validationRulesmodelData.WorkflowId = this.selectedWFId;
      //It might possible that at the time of updation user did not make any change in Where clause and having clause
      //so we need to populate it with old value(Note: It is also possible that old value is also blank)
      if (this.WhereClause == "") {
        this.validationRulesmodelData.WhereClause = this.existingwhereclause;
      }
      else {
        this.validationRulesmodelData.WhereClause = this.WhereClause;
      }
      this.validationRulesmodelData.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + "No Workflow" + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|" + "ProjectId=" + this.projectId;
      this.validationRulesmodelData.UpdatedById = this.LoggedInUserId;
      this.validationRulesmodelData.CreatedByRoleId = this.LoggedInRoleId;
      this.validationRulesmodelData.UpdatedByRoleId = this.LoggedInRoleId;
      this.validationRulesmodelData.CreatedById = this.LoggedInUserId;
      this.validationRulesmodelData.IsActive = this.IsActive.checked;
      this.validationRulesmodelData.ProjectId = this.projectId;
      this._service.UpdateValidationRule(this.validationRulesmodelData).subscribe(
        (data: string) => {
          this.toasts[1].content = "Validation rule updated successfully";
          this.toastObj.show(this.toasts[1]);
          this.ShowPopupCreateEditvalidationrules = false;
          this.getData(this.selectedWFId);
        }),
        (error: any) => {
          console.log(error)
          this.toasts[2].content = error.error.Message;
          this.toastObj.show(this.toasts[2]);
          this.ShowPopupCreateEditvalidationrules = true;
        }
    }
  }

  //method to delete record, it will first ask for the confirmation message
  Delete() {
    this.confirmcontent = 'Are you sure you want to delete?';
    this.confirmDialog.show();
  }
  confirmDlgBtnNoClick = (): void => {
    this.confirmDialog.hide();
  }
  confirmDlgBtnYesClick = (): void => {
    this._service.DeleteValidationRule(this.validationRuleId).subscribe(
      (data: string) => {
        this.toasts[1].content = "Validation rule deleted successfully";
        this.toastObj.show(this.toasts[1]);
        this.getData(this.selectedWFId);
      },
      (error: any) => {
        this.toasts[2].content = error.error.message;
        this.toastObj.show(this.toasts[2]);
        this.getData(this.selectedWFId);
      }
    );
    this.confirmDialog.hide();
  }
  public confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmDlgBtnYesClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];


  
}
