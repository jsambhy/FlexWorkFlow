import { Component, Input, TemplateRef, ViewChild, ViewContainerRef, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RadioButtonComponent } from '@syncfusion/ej2-angular-buttons';
import { DatePickerComponent, DateTimePickerComponent } from '@syncfusion/ej2-angular-calendars';
import { DropDownListComponent, MultiSelectComponent } from '@syncfusion/ej2-angular-dropdowns';
import { TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { branchmodel } from '../../../models/branch.model';
import { DashboardDetailsModel } from '../../../models/dashboard-detail-model';
import { DashboardPanelModel } from '../../../models/dashboard-panel-model';
import { whereconditionmodel } from '../../../models/WhereCondition.model';
import { NextStepmodel } from '../../../models/workflow-diagram-model';
import { BranchService } from '../../../services/branch.service';
import { CalculationsService } from '../../../services/calculations.service';
import { DashboardService } from '../../../services/dashboard.service';
import { RolesService } from '../../../services/roles.service';
import { StepColumnsService } from '../../../services/step-columns.service';
import { beginDrillThrough } from '@syncfusion/ej2-angular-pivotview';
import { FlexWorkflowsService } from '../../../services/flex-workflows.service';
import { ReportService } from '../../../services/report.service';
import { bool } from 'aws-sdk/clients/signer';
import { UserService } from '../../../services/user.service';

import { ReportPivotViewsService } from '../../../services/reportpivotviews.service';

@Component({
  selector: 'app-dashboard-widget',
  templateUrl: './dashboard-widget.component.html',
  styleUrls: ['./dashboard-widget.component.css'],
  providers: [StepColumnsService, BranchService, CalculationsService, DashboardService, RolesService, FlexWorkflowsService, ReportService]
})
/** dashboard-widget component*/
export class DashboardWidgetComponent {
  chartRowForm: FormGroup;
  items: FormArray;
  @ViewChild('toasttype', { static: false }) private toastObj: ToastComponent;
  @ViewChild('componentsobj', { static: false }) private ddlComponent: DropDownListComponent;
  @ViewChild('ColumnNameobj', { static: false }) private ColumnNameList: DropDownListComponent;
  @ViewChild('entity', { static: false }) private DataFieldList: DropDownListComponent;
  @ViewChild('Aggregarteobj', { static: false }) private Aggregarteobj: DropDownListComponent;

  //#widgetdialog
  @ViewChild('widgetdialog', { static: false }) private widgetdialog: DialogComponent;
  //public AgreegateFunc: Object = [];
  AgreegateFunc: Object[] = [{ text: 'AVG', value: 'AVG' }, { text: 'COUNT', value: 'COUNT' }, { text: 'MAX', value: 'MAX' }, { text: 'MIN', value: 'MIN' }, { text: 'SUM', value: 'SUM' }];
  public uicomponents: Object = [];
  public tablenames: Object = [];
  public Columns: any = [];
  public choosecolumn: any = [];
  public componentsFields: Object = { text: 'text', value: 'value' };//added by RS on 4th May
  public chooseReportsfields: object = { text: 'Name', value: 'ReportId' }
  public PivotViewDDfields: object = { text: 'Name', value: 'Id' }
  ChartsDataColumnfields: object = { text: 'Label', value: 'Label' }
  public chooseTablefields: Object = { text: 'EntityName', value: 'EntityId' };
  public Rolefields: Object = { text: 'RoleName', value: 'Id' };
  public chooseColumnfields: Object = { text: 'FieldName', value: 'DataFieldId' };
  public choosecolumnfieldsforcondition: Object = { text: 'FieldName', value: 'DataFieldId' };
  // public AggFuncfields: Object = { text: 'ShowText', value: 'Id' };
  AggFuncfields: Object = { text: 'text', value: 'value' };
  public cellSpacing: number[] = [10, 10];
  public showCard: boolean = false;
  public showColumn: boolean = false;
  public showAgreegate: boolean = false;
  Branchconditioncreateform: FormGroup = null;
  dashboardForm: FormGroup = null;
  public showCondition: boolean = false;
  public TableEntityId: any;
  public Tablenamecollection: string[];
  LoggedInUserId: number;
  LoggedInRoleId: number;
  UserRoleId: number;
  ProjectId: number;
  LoggedInScopeEntityId: number;
  LoggedInScopeEntityType: string;
  selectedComponentId: number; showYAxisColumnLabel = false;
  public selectedComponent: string;
  public dashboardDetails: DashboardDetailsModel = new DashboardDetailsModel();
  ExpressionVal: string;
  ShowRoleDropdown: Boolean = false;
  @Input() PanelId;
  @Input() Source;
  @Input() PanelJson;
  @Input() isEdit;
  @Input() Id;
  selectedChartName: string;
  submitted: boolean = false;

  ReportsDataSource: any; ChartsDataColumnSource: any; ChartsDataRowSource: any; showValues = false; PivotViewDDDataSource: any;
  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };
  showReports: boolean = false;
  constructor(private _DashboardService: DashboardService, private _reportsservice: ReportService,
    private _calservice: CalculationsService,
    private _colservice: StepColumnsService,
    private _branchService: BranchService,
    private _roleService: RolesService,
    private _workflowService: FlexWorkflowsService,
    private _PivotService: ReportPivotViewsService,
    private formBuilder: FormBuilder
  ) {

    this.Branchconditioncreateform = new FormGroup({
      actionlabel: new FormControl('')
    });

    this.dashboardForm = new FormGroup({
    
      EntityName: new FormControl('', [Validators.required]),
      Label: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      AggFunction: new FormControl('', [Validators.required]),
      ComponentName: new FormControl('', [Validators.required]),
      ColumnName: new FormControl('', [Validators.required]),
      ReportsName: new FormControl('', [Validators.required]),
      PivotViewName: new FormControl('', [Validators.required]),
      PivotViewForReport: new FormControl('')
    });
    this.LoggedInUserId = +sessionStorage.getItem("LoggedInUserId");
    this.LoggedInRoleId = +sessionStorage.getItem("LoggedInRoleId");
    this.UserRoleId = +sessionStorage.getItem("UserRoleId");
    this.ProjectId = +sessionStorage.getItem("ProjectId");
    this.LoggedInScopeEntityId = +sessionStorage.getItem("LoggedInScopeEntityId");
    this.LoggedInScopeEntityType = sessionStorage.getItem("LoggedInScopeEntityType");
  }
 
  ngOnInit() {
    //form array initialization
    this.chartRowForm = this.formBuilder.group({
      items: this.formBuilder.array([this.createItem()])
    });
    this.GetDashboardUIComponents();
    this._roleService.IsSystemRole(this.LoggedInRoleId)
      .subscribe(
        IsSystemRole => {
          this.IsLoggedRoleSystem = IsSystemRole;
          if (this.IsLoggedRoleSystem) {
            this.ShowRoleDropdown = true;
            this.GetRoles();
          }
          else {
            this.ShowRoleDropdown = false;
          }
        });
  }
   //form array definition
  createItem(): FormGroup {
    return this.formBuilder.group({
      name: '',
      caption: ''
    });
  }

  flag: number = 0;

  //method to add item in form array
  addItem(): void {
    
    this.flag = 1;
    this.items = this.chartRowForm.get('items') as FormArray;
    this.items.push(this.createItem());
    this.chartRowData = this.chartRowForm.getRawValue();    
  }
  //method to delete item in form array
  deleteItem(index: number) {
    this.items = this.chartRowForm.get('items') as FormArray;
    this.items.removeAt(index);
  }
  ngAfterViewInit() {
    if (this.Source == "onDemandDashboard") {
      if (this.isEdit == "true") {
        this.GetPanelDetailsByPanelId(this.PanelId);
      }
    }
    this.GetPanelDetailsByPanelId(this.PanelId);
  }

  RoleData: any;
  GetRoles() {
    this._roleService.getAllRoles(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
      .subscribe(
        data => {
          this.RoleData = data;
        });
  }


  //get f() { return this.Branchconditioncreateform.controls; }
  get f() { return this.dashboardForm.controls; }

  public isFieldValid(field: string) {
    return !this.dashboardForm.get(field).valid && (this.dashboardForm.get(field).dirty || this.dashboardForm.get(field).touched);
  }
  url: string;
  GetLinkUrl() {

    if (this.IsLoggedRoleSystem && this.RoleId == 0) {

      if (this.selectedTablename == 'Roles') {
        this.url = '/flexwf/roles'
      }
      else if (this.selectedTablename == 'Workflows') {
        this.url = '/flexwf/flexworkflows'
      }
      //else if (this.selectedTablename = 'Transactions') {
      //  this.url = '/flexwf/roles'
      //}

      else if (this.selectedTablename == 'Users') {
        this.url = '/flexwf/users/null'
      }
      else if (this.selectedTablename == 'EmailTemplates') {
        this.url = '/flexwf/email-template'
      }
      else if (this.selectedTablename == 'Master Data"') {
        this.url = '/flexwf/master-data'
      }
    }
    else {
      if (this.TableEntityType == 'FlexTables') {

        this.url = '/flexwf/generic-grid/' + this.WorkflowId;

      }
      else if (this.TableEntityType == 'LReferences') {
        this.url = '/flexwf/RefData/' + this.TableEntityId + '/true'
      }
    }
    //After this condition will apply on selectedTablename, this will happen in case of System Roles


  }
  public ReportId: number; 
  save(Label) {
    
    
      //if (Label == null) {
      //  //this.toastObj.timeOut = 2000;
      //  this.toasts[2].content = "Label can not be blank";
      //  this.toastObj.show(this.toasts[2]);
      //  //setTimeout(() => { window.location.reload(); }, 2000);
      //}
      //else if (Label.length > 12) {
      //  this.toasts[2].content = "Label Length can not exceed by 12 chars";
      //  this.toastObj.show(this.toasts[2]);
      //}


      let Content;
    //rs put component check if block
      if (this.selectedComponent == "Card") {

        this.dashboardForm.removeControl("ReportsName")
        this.dashboardForm.removeControl("PivotViewName")
        //this.dashboardForm.removeControl("ColumnName")
        //this.dashboardForm.get('ReportsName').clearValidators();
        //this.dashboardForm.get('PivotViewName').clearValidators();

      if (this.selectedTablename == "" || this.selectedTablename == undefined || this.selectedTablename == null) {
        this.toasts[2].content = "Select Table name";
        this.toastObj.show(this.toasts[2]);
      }
      else if ((this.selectedAgreeFunc == "" || this.selectedAgreeFunc == undefined || this.selectedAgreeFunc == null) && (!this.IsLoggedRoleSystem)) {
        this.toasts[2].content = "Select Aggregate function";
        this.toastObj.show(this.toasts[2]);
      }
      else if ((this.selectedColName == "" || this.selectedColName == undefined || this.selectedColName == null) && (this.selectedAgreeFunc != "COUNT")
        && (!this.IsLoggedRoleSystem)) {
        this.toasts[2].content = "Select Column name";
        this.toastObj.show(this.toasts[2]);
      }
      else if (this.DoNotSave) {
        this.toasts[2].content = "Condition is not validated yet";
        this.toastObj.show(this.toasts[2]);
      }
      else {

        this.GetLinkUrl();
        if (this.url != null && this.url != undefined && this.url != "") {
          Content = { "Label": Label, "Url": this.url };
          this.url = "";
        }
        if (this.RoleId != 0) {
          this.dashboardDetails.RoleId = this.RoleId;
        }
        else {
          this.dashboardDetails.UserRoleId = this.UserRoleId;
        }
        this.dashboardDetails.PanelId = this.PanelId;
        this.dashboardDetails.UIComponentId = this.selectedComponentId;//for POC only
        this.dashboardDetails.ConfigJson = JSON.stringify(Content);
        this.dashboardDetails.CreatedById = this.LoggedInUserId;
        this.dashboardDetails.CreatedByRoleId = this.LoggedInRoleId;
        this.dashboardDetails.UpdatedById = this.LoggedInUserId;
        this.dashboardDetails.UpdatedByRoleId = this.LoggedInRoleId;
        this.dashboardDetails.CreatedDateTime = new Date();
        this.dashboardDetails.UpdatedDateTime = new Date();
        this.dashboardDetails.EntityType = this.TableEntityType;
        this.dashboardDetails.EntityId = this.TableEntityId;
        this.dashboardDetails.Label = Label;
        this.dashboardDetails.AggFunction = this.selectedAgreeFunc;
        this.dashboardDetails.WhereClause = this.WhereClause;// this.ResultMLobj.value;
        this.dashboardDetails.DataFieldId = this.DataFieldId;
        this.dashboardDetails.ReportId = 0;
        this.dashboardDetails.PivotId = 0;
        if (this.Source == "onDemandDashboard") {
          this.dashboardDetails.PanelJson = this.PanelJson; //added by RS on 5th march
          this.dashboardDetails.Id = this.Id;
        }
        if (this.val == "") {
          this.Query();
          if (this.IsLoggedRoleSystem && this.RoleId == 0) {
            this.dashboardDetails.TechnicalQuery = this.val;
            if (this.Source == "onDemandDashboard") {
              this.UpdatePanelInfo();
            }
            else {
              this.PostPanelInfo();
            }
          }
          else {
            this._DashboardService.getTechExp(this.whereconditionmodeldata)
              .subscribe(
                data => {
                  if (this.url != null && this.url != undefined && this.url != "") {
                    this.GetLinkUrl();
                    Content = { "Label": Label, "Url": this.url };
                    this.dashboardDetails.ConfigJson = JSON.stringify(Content);
                    this.url = "";
                  }
                  this.showfinalQuery = true;
                  this.val = data;
                  this.dashboardDetails.TechnicalQuery = this.val;
                  if (this.Source == "onDemandDashboard") {
                    this.UpdatePanelInfo();
                  }
                  else {
                    this.PostPanelInfo();
                  }
                });
          }
        }
        else {
          this.dashboardDetails.TechnicalQuery = this.val;
          if (this.Source == "onDemandDashboard") {
            this.UpdatePanelInfo();
          }
          else {
            this.PostPanelInfo();
          }
        }
      }
    }

    if (this.selectedComponent == "Grid") {
      
      //this.dashboardForm.get('EntityName').clearValidators();
      //this.dashboardForm.get('AggFunction').clearValidators();
      //this.dashboardForm.get('ColumnName').clearValidators();
      this.dashboardForm.removeControl("EntityName")
      this.dashboardForm.removeControl("AggFunction")
      this.dashboardForm.removeControl("ColumnName")
      this.dashboardForm.removeControl("PivotViewName")
     //PivotViewName
      if (this.dashboardForm.invalid) {
        return;
      }
      else {
      //  this.GetLinkUrl();

      //  if (this.url != null && this.url != undefined && this.url != "") {
      Content = {
        "Label": Label,
        "chartType": "Column"
      };
      //this.url = "";
      //  }
      if (this.RoleId != 0) {
        this.dashboardDetails.RoleId = this.RoleId;
      }
      else {
        this.dashboardDetails.UserRoleId = this.UserRoleId;
      }

      if (this.chosenPivotViewId != undefined) {
        this.dashboardDetails.PivotId = this.chosenPivotViewId;
      }
      else {
        this.dashboardDetails.PivotId = null;
      }
      this.dashboardDetails.Id = this.Id;
      this.dashboardDetails.PanelId = this.PanelId;
      this.dashboardDetails.PanelJson = this.PanelJson;
      this.dashboardDetails.UIComponentId = this.selectedComponentId;
      this.dashboardDetails.ConfigJson = JSON.stringify(Content);
      this.dashboardDetails.CreatedById = this.LoggedInUserId;
      this.dashboardDetails.CreatedByRoleId = this.LoggedInRoleId;
      this.dashboardDetails.UpdatedById = this.LoggedInUserId;
      this.dashboardDetails.UpdatedByRoleId = this.LoggedInRoleId;
      this.dashboardDetails.CreatedDateTime = new Date();
      this.dashboardDetails.UpdatedDateTime = new Date();
      this.dashboardDetails.EntityType = this.TableEntityType;
      this.dashboardDetails.EntityId = this.TableEntityId;
      this.dashboardDetails.Label = Label;
      this.dashboardDetails.AggFunction = this.selectedAgreeFunc;
      this.dashboardDetails.WhereClause = null;// this.ResultMLobj.value;
      this.dashboardDetails.DataFieldId = 0;
      this.dashboardDetails.TechnicalQuery = "";
      this.dashboardDetails.ReportId = this.chosenReportId;
      //this.dashboardDetails.PivotId = 0;
      this.UpdatePanelInfo();
    }
      //if (this.Source == "onDemandDashboard") {
      //  this.dashboardDetails.PanelJson = this.PanelJson; //added by RS on 5th march
      //  this.dashboardDetails.Id = this.Id;
      //}
    }

      if (this.selectedComponent == "Chart") {
        //this.dashboardForm.get('EntityName').clearValidators();
        //this.dashboardForm.updateValueAndValidity();
        //this.dashboardForm.get('AggFunction').clearValidators();
        //this.dashboardForm.updateValueAndValidity();
        //this.dashboardForm.get('ColumnName').clearValidators();
        //this.dashboardForm.updateValueAndValidity();

        this.dashboardForm.removeControl("EntityName")
        this.dashboardForm.removeControl("AggFunction")
        this.dashboardForm.removeControl("ColumnName")
        if (this.dashboardForm.invalid) {
          return;
        }
        else {
          if (this.chosenPivotViewId != undefined) {
            this.dashboardDetails.PivotId = this.chosenPivotViewId;
          }
          else {
            this.dashboardDetails.PivotId = 0;
          }

        
          Content = {
            "Label": Label,
            "chartType": "Column"
          };
          if (this.RoleId != 0) {
            this.dashboardDetails.RoleId = this.RoleId;
          }
          else {
            this.dashboardDetails.UserRoleId = this.UserRoleId;

          }

          this.Query();
          this.dashboardDetails.Id = this.Id;
          this.dashboardDetails.PanelId = this.PanelId;
          this.dashboardDetails.PanelJson = this.PanelJson;
          this.dashboardDetails.UIComponentId = this.selectedComponentId;
          this.dashboardDetails.ConfigJson = JSON.stringify(Content);
          this.dashboardDetails.CreatedById = this.LoggedInUserId;
          this.dashboardDetails.CreatedByRoleId = this.LoggedInRoleId;
          this.dashboardDetails.UpdatedById = this.LoggedInUserId;
          this.dashboardDetails.UpdatedByRoleId = this.LoggedInRoleId;
          this.dashboardDetails.CreatedDateTime = new Date();
          this.dashboardDetails.UpdatedDateTime = new Date();
          this.dashboardDetails.EntityType = this.TableEntityType;
          this.dashboardDetails.EntityId = this.TableEntityId;
          this.dashboardDetails.Label = Label;
          this.dashboardDetails.AggFunction = this.selectedAgreeFunc;
          this.dashboardDetails.WhereClause = null;// this.ResultMLobj.value;
          this.dashboardDetails.DataFieldId = 0;
          this.dashboardDetails.TechnicalQuery = "";
          this.dashboardDetails.ReportId = this.chosenReportId;

          this.UpdatePanelInfo();
        }
      
      //if (this.Source == "onDemandDashboard") {
      //  this.dashboardDetails.PanelJson = this.PanelJson; //added by RS on 5th march
      //  this.dashboardDetails.Id = this.Id;
      //}
    }
  

  }
 
 
  PostPanelInfo() {
    
    this._DashboardService.PostPanelInfo(this.dashboardDetails)
      .subscribe(data => {

        this.toastObj.timeOut = 2000;
        this.toasts[1].content = "Content for this panel have been saved";;
        this.toastObj.show(this.toasts[1]);
        setTimeout(() => { window.location.reload(); }, 2000);
      }
      );
  }

  UpdatePanelInfo() {
    
    console.log(this.dashboardDetails);
    this._DashboardService.UpdatePanelInfo(this.dashboardDetails)
      .subscribe(data => {

        this.toastObj.timeOut = 2000;
        this.toasts[1].content = "Panel updated successfully";;
        this.toastObj.show(this.toasts[1]);
        setTimeout(() => { window.location.reload(); }, 2000);
        //this.widgetdialog.close();
      }
      );
  }

  RoleId: number = 0;
  public RoleChange(args: any): void {
    console.log(args);
    this.RoleId = args.itemData.Id;
    this.GetTableNamesForNonSystemRoles(this.RoleId);
    this.GetPanelDetailsByRoleId(args.itemData.Id);
  }
  showButton = false; showPivot = false; visibleReports = false; chartColumnData: string;
  public chartTypeChange(args: any): void {
    
    this.visibleReports = true;
    this.selectedChartName = args.itemData.value;

  }
  public componentsChange(args: any): void {
    
    this.selectedComponentId = args.itemData.value;
    //commented by rs issue raised
    //this.dashboardForm.patchValue({
    //  Label: null
    //})
    /*if (args.itemData.value == 1) {*/ //commented by rs on 27th may, we cannot hardcode id here
    if (args.itemData.text == "Card") {
      this.showCard = true;
      //this.selectedComponent = "card";
      this.selectedComponent = "Card";
      this.GetAllTableNames();
      this.showAgreegate = true;
      this.showPivot = false;
      //this.showAgreegateFunc();
      this.showButton = true;
      this.showReports = false;
    }
    //else if (args.itemData.value == 2) {
    //  this.showCard = true;
    //  this.selectedComponent = "bar-chart";
    //  this.GetAllTableNames();
    //  this.showAgreegate = true;
    //  //this.showAgreegateFunc();
    //}

    //below line of code added by rs
    if (args.itemData.text == "Grid") {
      this.selectedComponent = "Grid";
      this.showCard = false;
      this.showReports = true;
      this.showPivot = false;
      this.GetReportData();
      this.showButton = true;
    }
    if (args.itemData.text == "Chart") {
      this.selectedComponent = "Chart";
     
      this.showCard = false;
      this.showReports = false;
      this.showPivot = true;
      this.GetReportData();
      this.showButton = true;
    }

  }
  GetReportData() {
    this._reportsservice.GetReports(this.LoggedInRoleId, this.LoggedInUserId)
      .subscribe(
        data => {
          this.ReportsDataSource = JSON.parse(data);

        }
      );
  }
  GetPivotViewData(ReportId) {
    this._PivotService.GetDataByReportId(ReportId)
      .subscribe(
        data => {
          this.PivotViewDDDataSource = data;

        }
      );
  }

  public selectedTablename: string;
  public TableEntityType: string;
  WorkflowId: number;
  chosenReportId: number;
  Technicalqry: string;
  ValuesDataSource: any; chartRowData: any; chartValueData: string;
  ChartColumnNameChange(args: any): void {
    
    this.chartColumnData = args.itemData.Label;
    this._reportsservice.GetReportsColumnWithDataTypeByReportId(this.chosenReportId)
      .subscribe(
        data => {
          this.ChartsDataRowSource = data;
          console.log("dropdown " + this.ChartsDataRowSource)
        }
      );
    //this.showYAxisColumnLabel = true;
    //this._reportsservice.GetReportsColumnWithDataTypeByReportId(this.chosenReportId, '', '-')
    //  .subscribe(
    //    data => {

    //      if (data.length === 0) {
    //        alert("no data for showing on  x axis");
    //        this.showValues = false;
    //      }
    //      else {
    //        this.showValues = true;
    //        this.ValuesDataSource = data;
    //      }
    //    }
    //  );
  }
  ChartRowNameChange(args: any): void {
    this.chartRowData = args.itemData.Label;    

  }
  formatName: string; showcurrencycode = false;
  ChartValueChange(args: any): void {
    this.chartValueData = args.itemData.Label;
  }
  formatTypeChange(args: any): void {
    this.formatName = args.itemData.value;
    if (this.formatName == "C") {
      this.showcurrencycode = true;
    }
    else {
      this.showcurrencycode = false;
    }
  }
  ReportsNamesChange(args: any): void {
    
    this.chosenReportId = args.itemData.ReportId;
    //if (this.showPivot == true) {
    this.GetPivotViewData(this.chosenReportId);
    //}
  }
  chosenPivotViewId: number;
  PivotViewNamesChange(args: any): void {
    this.chosenPivotViewId = args.itemData.Id;
   
  }
  public tablenamesChange(args: any): void {
    /* this.showCondition = false;*/
    if (this.ColumnNameList != undefined) {
      this.ColumnNameList.value = "";
    }
    if (this.DataFieldList != undefined) {
      this.DataFieldList.value = "";
    }
    this.TableEntityType = args.itemData.EntityType;
    this.TableEntityId = args.itemData.EntityId;

    this.selectedTablename = args.itemData.EntityName;
    if (this.IsLoggedRoleSystem && this.RoleId == 0) {
      this.showAgreegate = false;
    }
    else {
      this.GetColumnListByEntity();
      this.showAgreegate = true; //since it is showing while selecting grid componnet which is not needed so putting code 464 to hide it

      //this.showAgreegateFunc();
      if (this.Aggregarteobj != undefined) {
        this.Aggregarteobj.value = "";
      }

    }

    //----added by rs on 10 may, as in grid compoonent aggregate is not needed
    if (this.selectedComponent == "Grid") {
      this.showAgreegate = false; //hiding aggregate func
    }

    if (this.TableEntityType == 'FlexTables') {

      this._workflowService.GetWFIdByFlexId(this.TableEntityId)
        .subscribe(
          data => {
            this.WorkflowId = data;
          });
    }


  }

  public selectedAgreeFunc: string;
  public AgreegateFuncChange(args: any): void {
    
    if (args.itemData.value == "COUNT") {
      this.showColumn = false;

      this.GetColumnListByEntity();
      this.selectedAgreeFunc = "COUNT"
    }

    if ((args.itemData.value == "AVG") || (args.itemData.value == "SUM")) { //here id was taken
      this.showColumn = true;
      this._colservice.GetAllFlattenedDFsForEntity(this.TableEntityType, this.TableEntityId)
        .subscribe(
          data => {

            this.Columns = data.filter(x => x.DataType == 'int' || x.DataType.includes('numeric'));

            this.choosecolumn = (data);
          }
        );
      

      if (args.itemData.value == "AVG") {
        this.selectedAgreeFunc = "AVG"
      }
      if (args.itemData.value == "SUM") {
        this.selectedAgreeFunc = "SUM"
      }
      //this.showCondition = false; //discussion done iwth ns on 28, show where clause in all cases as well. so removing this
    }

    if ((args.itemData.value == "MAX") || (args.itemData.value == "MIN")) {
      this.GetColumnListByEntity();
      this.showColumn = true;
      //this.showCondition = false; //discussion done iwth ns on 28, show where clause in all cases as well. so removing this
      if (args.itemData.value == "MAX") {
        this.selectedAgreeFunc = "MAX"
      }
      if (args.itemData.value == "MIN") {
        this.selectedAgreeFunc = "MIN"
      }
    }
    this.showCondition = true;
  }

  SelectedColText: string;
  DataFieldId: number;



  public multicolumnnamesChange(args: any): void {
    this.showCondition = true;

  }

  public columnnamesChange(args: any): void {
    this.showCondition = true;
    this.SelectedColText = args.itemData.FieldName;
    this.DataFieldId = args.itemData.DataFieldId;

    // this.getAttributeByColConfigId(args.itemData.Value);
    this._branchService.getAttributeByColConfigId(args.itemData.DataFieldId)
      .subscribe(
        data => {
          this.selectedColName = data;

        }
      );

    this.GetColumnListByEntity();
  }




  //----------------------------Below required for WHERE condition------------------------------------
  public tablenamefromcolumname: string;
  public columnnameofjoiningtable: string;
  public entityType: string;
  public entityId: number;
  public columnAttributeVal: string;
  public showDateTimePicker: boolean = false;
  public showDatePicker: boolean = false;
  public showTextBox: boolean = true;
  public showNumTextBox: boolean = false;
  public showBitDropDown: boolean = false;
  public showAndOr2: boolean = false;
  public dataTypeValue: string;
  public actualValueofEntity: string;
  public operatorValue: string;
  public Flag: string;
  public AndOrVal: string;
  public userFriendlyExpression: string;
  public userTechnicalExpression: string;
  public entityText: string;
  public enabled: boolean;
  public editSettings: Object;
  public showMultiLineTextBox: boolean = false;
  public operators: Object = [];
  //public branchmodeldata: branchmodel = new branchmodel();
  //@ViewChild('AndOrobj', { static: false }) public AndOrobj: DropDownListComponent;
  //@ViewChild('entity', { static: false }) public entity: DropDownListComponent;
  //@ViewChild('operatorobj', { static: false }) public operatorobj: DropDownListComponent;
  //@ViewChild('Tobj', { static: false }) public Tobj: TextBoxComponent;
  //@ViewChild('MLobj', { static: false }) public MLobj: TextBoxComponent;
  //@ViewChild('ManageBranchConditionDialogue', { static: false }) public ManageBranchConditionDialogue: DialogComponent;
  //@ViewChild('BranchConditionDialog', { static: false }) public BranchConditionDialog: DialogComponent;
  //@ViewChild('Dobj', { static: false }) public Dobj: DatePickerComponent;
  //@ViewChild('DTobj', { static: false }) public DTobj: DateTimePickerComponent;
  //@ViewChild('bitObj', { static: false }) public bitObj: DropDownListComponent;
  //@ViewChild('NTobj', { static: false }) public NTobj: TextBoxComponent;
  //@ViewChild('ResultMLobj', { static: false }) public ResultMLobj: TextBoxComponent;
  //@ViewChild('ResultTechobj', { static: false }) public ResultTechobj: TextBoxComponent;
  //@ViewChild('radiobutton1', { static: false }) public radiobutton1: RadioButtonComponent;
  //@ViewChild('radiobutton2', { static: false }) public radiobutton2: RadioButtonComponent;

  @ViewChild('viewContainer', { read: ViewContainerRef, static: true }) viewContainer: ViewContainerRef;
  @ViewChild('CustomTemplate', { static: true }) CustomTemplate: TemplateRef<any>;

  public whereconditionmodeldata: whereconditionmodel = new whereconditionmodel();
  public dashboardpanelmodeldata: DashboardPanelModel = new DashboardPanelModel();
  public Branchmodeldata: NextStepmodel[];
  public showfinalQuery: boolean = false;
  public isDisable: boolean = true;
  public val: string = "";
  public TechWhereCondition: string = "";
  public query: string = "";
  groupByClause: string = "";

  getQuery() {

    this.Query();
    this._DashboardService.getTechExp(this.whereconditionmodeldata)
      .subscribe(
        data => {
          this.showfinalQuery = true;
          this.val = data;


        });



  }

  UserProvidedCondition: string;
  Query() {
    
    this.query = '';
    if (this.SelectedColText != null && this.SelectedColText != '') {
      //let SelectedColArray = this.SelectedColText.split("] ");
      //this.SelectedColText = SelectedColArray[0] + '].' + SelectedColArray[1];
      this.SelectedColText = this.SelectedColText.replace("] ", "].");
    }

    if (this.IsLoggedRoleSystem && this.RoleId == 0) {
      this.BuildQryForSystemRoles();
    }
    else {
      let DataTableName;
      let ConditionParameter;
      if (this.TableEntityType == "FlexTables") {
        DataTableName = "FlexTableData";
        ConditionParameter = "FlexTableId";
      }
      else {
        DataTableName = "LReferenceData";
        ConditionParameter = "ReferenceId";
      }


      //check whenther user provide condition or not
      let UserProvidedCondition;
      if (this.WhereClause == "") {
        UserProvidedCondition = "where "
      }
      else {
        UserProvidedCondition = this.WhereClause + " and "
      }


      if (this.selectedAgreeFunc == "COUNT") {
        this.query = "Select @x=Count(*)" + " From " + DataTableName + " " + UserProvidedCondition + ConditionParameter + " = " + this.TableEntityId;
      }

      if (this.selectedAgreeFunc == "AVG") {
        this.query = "Select @x=AVG({" + this.SelectedColText + "}) From " + DataTableName + " " + UserProvidedCondition + ConditionParameter + " = " + this.TableEntityId
      }

      if (this.selectedAgreeFunc == "SUM") {
        this.query = "Select @x=SUM({" + this.SelectedColText + "}) From " + DataTableName + " " + UserProvidedCondition + ConditionParameter + " = " + this.TableEntityId
      }

      if (this.selectedAgreeFunc == "MIN") {
        this.query = "Select @x=MIN({" + this.SelectedColText + "}) From " + DataTableName + " " + UserProvidedCondition + ConditionParameter + " = " + this.TableEntityId
      }

      if (this.selectedAgreeFunc == "MAX") {
        this.query = "Select @x=MAX({" + this.SelectedColText + "}) From " + DataTableName + " " + UserProvidedCondition + ConditionParameter + " = " + this.TableEntityId
      }
    }

    this.whereconditionmodeldata.Condition = this.query;
    this.whereconditionmodeldata.EntityId = this.TableEntityId;
    this.whereconditionmodeldata.EntityType = this.TableEntityType;
  }
  gridcolumnlistarray: string[];
  result: string;
  //selectedColumnListArray: string[];
  public selectedColumnListArray: any = [];

  //following method created by rs on 12 may, this method will create the select query used to show column of grid
  //gridSourceQuery() {
  //  let gridcolumnlist = this.chooseColumnDD.text; // all the selected text from multiselect will come into this variable
  //  this.gridcolumnlistarray = gridcolumnlist.split(",");// since it is string we are converting it into array 
  //  for (let i = 0; i < this.gridcolumnlistarray.length; i++) { //on array length looping so to ocnvert the selected column into proper format
  //    let SelectedColArray = this.gridcolumnlistarray[i].split("] ");
  //    this.SelectedColText = SelectedColArray[0] + '].' + SelectedColArray[1];
  //    this.selectedColumnListArray.push(this.SelectedColText); // pushing all the formated columns into array
  //  }

  //  var strofSelectedColumn = this.selectedColumnListArray.toString(); //again the arrayis converting into string, since in select query we are using string not array
  //  if (this.IsLoggedRoleSystem && this.RoleId == 0) {
  //    this.BuildQryForSystemRoles();
  //  }
  //  else {
  //    let DataTableName;
  //    let ConditionParameter;
  //    if (this.TableEntityType == "FlexTables") {
  //      DataTableName = "FlexTableData";
  //      ConditionParameter = "FlexTableId";
  //    }
  //    else {
  //      DataTableName = "LReferenceData";
  //      ConditionParameter = "ReferenceId";
  //    }


  //    //check whenther user provide condition or not
  //    let UserProvidedCondition;
  //    if (this.WhereClause == "") {
  //      UserProvidedCondition = "where "
  //    }
  //    else {
  //      UserProvidedCondition = this.WhereClause + " and "
  //    }
  //    this.query = "Select " + strofSelectedColumn +" From FlexTableData AS [" + this.selectedTablename + "_FTD] WHERE FlexTableId = " + this.TableEntityId + " AND " + this.TechWhereCondition + this.groupByClause;


  //  }
  //  console.log(this.query);
  //  this.whereconditionmodeldata.Condition = this.query;
  //  this.whereconditionmodeldata.EntityId = this.TableEntityId;
  //  this.whereconditionmodeldata.EntityType = this.TableEntityType;
  //}

  //getQuery_old() {
  //  
  //  this.whereconditionmodeldata.Condition = this.ResultMLobj.value;
  //  this.whereconditionmodeldata.FlexTableId = this.TableEntityId;
  //  if (this.groupByColName != null && this.groupByColName != undefined && this.groupByColName != "") {
  //    this.groupByClause = this.groupByClause + " group by " + this.groupByColName
  //  }
  //  this._DashboardService.getTechExp(this.whereconditionmodeldata)
  //    .subscribe(
  //      data => {

  //        var splitted = data.split(" WHERE ");

  //        this.TechWhereCondition = splitted[1];
  //        this.showfinalQuery = true;

  //        var RestColumnListforBar = "";
  //        //if (this.selectedComponent == "Bar") {
  //        //  RestColumnListforBar = RestColumnListforBar + " as y," + this.groupByColName + " as x";
  //        //}
  //        if (this.IsLoggedRoleSystem)
  //        {
  //          this.BuildQryForSystemRoles();

  //        }
  //        else {
  //          if (this.selectedAgreeFunc == "COUNT") {
  //            this.query = "Select @x=Count(*)" +  " From FlexTableData AS [" + this.selectedTablename + "_FTD] WHERE FlexTableId = " + this.TableEntityId + " AND " + this.TechWhereCondition + this.groupByClause;
  //          }

  //          if (this.selectedAgreeFunc == "AVG") {
  //            this.query = "Select @x=AVG(" + this.selectedColName + ")" + RestColumnListforBar + " From FlexTableData AS [" + this.selectedTablename + "_FTD] WHERE FlexTableId = " + this.TableEntityId + " AND " + this.TechWhereCondition + this.groupByClause;
  //          }

  //          if (this.selectedAgreeFunc == "SUM") {
  //            this.query = "Select @x=SUM(" + this.selectedColName + ")" + RestColumnListforBar + " From FlexTableData AS [" + this.selectedTablename + "_FTD] WHERE FlexTableId = " + this.TableEntityId + " AND " + this.TechWhereCondition + this.groupByClause;
  //          }

  //          if (this.selectedAgreeFunc == "MIN") {
  //            this.query = "Select @x=MIN(" + this.selectedColName + ")" + RestColumnListforBar + " From FlexTableData AS [" + this.selectedTablename + "_FTD] WHERE FlexTableId = " + this.TableEntityId + " AND " + this.TechWhereCondition + this.groupByClause;
  //          }

  //          if (this.selectedAgreeFunc == "MAX") {
  //            this.query = "Select @x=MAX(" + this.selectedColName + ")" + RestColumnListforBar + " From FlexTableData AS [" + this.selectedTablename + "_FTD] WHERE FlexTableId = " + this.TableEntityId + " AND " + this.TechWhereCondition + this.groupByClause;
  //          }
  //        }

  //        this.val = this.query;



  //      }
  //    );

  //}

  BuildQryForSystemRoles() {
    let status;

    if (this.TableEntityId == 'LEmailTemplates' || this.TableEntityId == 'LReferenceData') {
      status = "";//because we dont have status column in these tables
    }
    else if (this.TableEntityId == 'LRoles') {
      status = "status = 'Active' and";
    }
    else {
      status = "status = 'Live' and";
    }

    if (this.TableEntityId != 'LUsers' && this.TableEntityId != 'FlexTableData') {
      if (this.LoggedInScopeEntityType == 'GProjects') {
        this.query = " select @x=Count(*) from " + this.TableEntityId + " where " + status + " ProjectId in (@LoggedInScopeEntityId)";
      }
      else if (this.LoggedInScopeEntityType == 'GCompanies') {
        this.query = " select @x=Count(*) from " + this.TableEntityId + " where " + status + " ProjectId in (select id from GProjects where status = 'Active' and CompanyId = @LoggedInScopeEntityId)";
      }
      else if (this.LoggedInScopeEntityType == 'GGroups') {
        this.query = " select @x=Count(*) from " + this.TableEntityId + " where " + status + " ProjectId in (select GP.Id from GCompanies GC inner join GProjects GP on GP.CompanyId = GC.Id where GC.status = 'Active' and GC.GroupId =@LoggedInScopeEntityId)";
      }
      else if (this.LoggedInScopeEntityType == 'GApplications') {
        this.query = " select @x=Count(*) from " + this.TableEntityId + " where " + status + " ProjectId in (Select id from GProjects where status = 'Active')";
      }
    } // if (this.TableEntityId != 'LUsers' && this.TableEntityId != 'FlexTableData') {
    else if (this.TableEntityId == 'FlexTableData')//FlextableData dont have ProjectId
    {
      this.query = " select @x=Count(*) from " + this.TableEntityId + " where status = 'Live'"
    }
    else if (this.TableEntityId == 'LUsers') {
      if (this.LoggedInScopeEntityType == 'GProjects') {
        this.query = "select @x=Count(*) from MUserRoles MUR inner join LUsers LU on LU.id = MUR.UserId where MUR.EntityType = @LoggedInScopeEntityType and MUR.EntityId =@LoggedInScopeEntityId";
      }
      else {

        /* this.query = "select @x=Count(*) from MEntityUsers MEU inner join LUsers LU on LU.id = MEU.UserId where MEU.EntityType =@LoggedInScopeEntityType and MEU.EntityId =@LoggedInScopeEntityId"*/

        this.query = "select @x=Count(*) from LUserScope LUS inner join LUsers LU on LU.id = LUS.UserId where LUS.ScopeEntityType =@LoggedInScopeEntityType and LUS.ScopeEntityId =@LoggedInScopeEntityId"

      }
    }
    this.val = this.query;
  }

  //public counts: number;
  //fnAddCondition() {
  //  var UserInputValue;
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
  //  var selectedAndOr = "";//this.AndOrVal;
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

  //  //public IHttpActionResult AddExpressionBuilderData(string SelectedField, string SelectedOperator, string SelectedInput, string SelectedAndOr, string expression, string SelectedColumnName, string datatypevalue, string Techexpression)
  //  this.branchmodeldata.SelectedField = this.actualValueofEntity;
  //  this.branchmodeldata.SelectedOperator = this.operatorValue
  //  this.branchmodeldata.SelectedInput = UserInputValue;
  //  this.branchmodeldata.SelectedAndOr = selectedAndOr;
  //  this.branchmodeldata.expression = this.userFriendlyExpression;
  //  this.branchmodeldata.datatypevalue = this.dataTypeValue;
  //  //this.branchmodeldata.Techexpression = this.userTechnicalExpression;
  //  this.branchmodeldata.SelectedColumnName = this.columnAttributeVal;

  //  this._branchService.AddCondition(this.branchmodeldata)
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
  //        this.showAndOr2 = true;
  //        this.entity.enabled = true;
  //        this.operatorobj.enabled = true;
  //      }
  //    );


  //}
  //Reset() {
  //  this.showAndOr2 = false;
  //  this.ResultMLobj.value = null;
  //  this.entity.value = null;
  //  this.operatorobj.value = null;
  //}
  public selectedColName: string;
  DoNotSave: boolean = false;
  public operatorChange(args: any): void {
    this.enabled = true;
    this.operatorValue = args.itemData.value;
  }
  //Validate() {
  //  
  //  this.whereconditionmodeldata.Condition = this.ResultMLobj.value;
  //  this.whereconditionmodeldata.EntityId = this.TableEntityId;
  //  this.whereconditionmodeldata.EntityType = this.TableEntityType;
  //  if (this.Branchconditioncreateform.invalid) {
  //    return;
  //  }
  //  else {
  //    this._DashboardService.Validate(this.whereconditionmodeldata)
  //      .subscribe(
  //        Validateddata => {
  //          let MsgPrefix: string = Validateddata.substring(0, 2);
  //          let Showmsg: string = Validateddata.substring(2, Validateddata.length);

  //          if (MsgPrefix == 'S:')
  //          {
  //            this.DoNotSave = false;
  //            this.isDisable = false;
  //            this.toasts[1].content = Showmsg;
  //            this.toastObj.show(this.toasts[1]);
  //          }
  //          else if (MsgPrefix == 'I:')
  //          {//Information message
  //            this.DoNotSave = false;
  //            this.isDisable = false;
  //            this.toasts[3].content = Showmsg;
  //            this.toastObj.show(this.toasts[3]);
  //          }
  //          else if (MsgPrefix == 'W:') {//Warning Message
  //            this.DoNotSave = false;
  //            this.isDisable = false;
  //            this.toasts[0].content = Showmsg;
  //            this.toastObj.show(this.toasts[0]);
  //          }
  //          else {
  //            this.isDisable = true;
  //            this.DoNotSave = true;
  //            this.toasts[2].content = Showmsg;
  //            this.toastObj.show(this.toasts[2]);
  //          }

  //        }
  //      );
  //  }
  //}
  //public AndOrchange(args: any): void {
  //  this.AndOrVal = args.itemData.value;
  //  this.entity.enabled = true;
  //  this.AndOrobj.enabled = false;
  //  this.enabled = true;
  //}
  getAttributeByColConfigId(Value) {
    this._branchService.getAttributeByColConfigId(Value)
      .subscribe(
        data => {
          this.columnAttributeVal = data;
          // this.selectedColName = data;
        }
      );
  }

  groupByColName: string;
  public groupColumn(args: any): void {
    
    this._branchService.getAttributeByColConfigId(args.itemData.DataFieldId)
      .subscribe(
        data => {
          this.groupByColName = data;
        }
      );

  }


  //public entityChange(args: any): void {
  //  let str = args.itemData.FieldName;
  //  var splitted = str.split("] ");
  //  this.tablenamefromcolumname = splitted[0].replace('[', '');
  //  this.columnnameofjoiningtable = splitted[1];
  //  this.entityText = this.columnnameofjoiningtable;
  //  this.entityType = args.itemData.EntityType;
  //  this.entityId = args.itemData.EntityId;
  //  this.getAttributeByColConfigId(args.itemData.DataFieldId);
  //  this.actualValueofEntity = "{[" + this.tablenamefromcolumname + "]" + "." + this.entityText + "}";
  //  this._branchService.getDataType(this.entityId, this.entityText, this.entityType)
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

  SelectedPanelId: number;
  GetPanelDetailsByPanelId(PanelId) {
    
    this.SelectedPanelId = PanelId;
    this._DashboardService.GetPanelDetailsByPanelId(PanelId, this.UserRoleId)
      .subscribe(
        data => {

          this.selectedComponentId = data.UIComponentId;
          if (data.Name == "Grid") {
            this.showCard = false;
            this.showReports = true;
            this.selectedComponent = "Grid";
            this.GetReportData();
            this.dashboardForm.patchValue({
              Label: data.Label,
              ComponentName: data.UIComponentId,
              ReportsName: data.ReportId
            });
            this.showCondition = true;
          }
          else if (data.Name == "Card") {
            this.showCard = true;
            this.showReports = false;
            this.selectedComponent = "Card";

            if (data.AggFunction == 'COUNT') {
              this.showColumn = false;
            }
            else {
              this.showColumn = true;
            }
            this.showAgreegate = true;
            this.TableEntityType = data.EntityType;
            this.TableEntityId = data.EntityId;
            this.selectedAgreeFunc = data.AggFunction;
            this.WhereClause = data.WhereClause;
            this.ExpressionVal = data.WhereClause;
            this.GetColumnListByEntity();
            this.GetAllTableNames();
            this.dashboardForm.patchValue({
              EntityName: data.EntityId,
              Label: data.Label,
              AggFunction: data.AggFunction,
              ComponentName: data.UIComponentId,
              ColumnName: data.DataFieldId
            });
            this.showCondition = true;
          }
          //this.showCard = false;
          //this.showReports = true;
          //this.GetReportData();


          else if (data.Name == "Chart") {
            this.selectedComponent = "Chart";
            this.showCard = false;
            this.showReports = false;
            this.showPivot = true
            this.GetReportData();
            this.GetPivotViewData(data.ReportId);
            this.dashboardForm.patchValue({
              ComponentName: data.UIComponentId,
            /* Label: JSON.parse(data.ConfigJson)['title'],*/
              Label: data.Label,
              ReportsName: data.ReportId,
              PivotViewName: data.PivotId
            });
          }
          this.showButton = true;
        });
  }

  GetPanelDetailsByRoleId(RoleId) {
    this._DashboardService.GetPanelDetailsByRoleId(this.SelectedPanelId, RoleId)
      .subscribe(
        data => {
          this.dashboardForm.patchValue({
            EntityName: data.EntityId,
            Label: data.Label,
            AggFunction: data.AggFunction,
            ComponentName: data.UIComponentId,
            ColumnName: data.DataFieldId
          });
          if (data.AggFunction == 'COUNT') {
            this.showColumn = false;
          }
          else {
            this.showColumn = true;
          }
          this.showAgreegate = true;
          this.TableEntityType = data.EntityType;
          this.TableEntityId = data.EntityId;
          this.showCondition = true;
          //Populate some variables
          this.selectedAgreeFunc = data.AggFunction;
          this.WhereClause = data.WhereClause;
          this.GetColumnListByEntity();
          this.ExpressionVal = data.WhereClause;
        });
  }

  Delete() {
    this._DashboardService.DeletePanelDetailsByPanelId(this.PanelId, this.UserRoleId)
      .subscribe(
        data => {
          this.toastObj.timeOut = 2000;
          this.toasts[1].content = "Content for this panel have been cleared and saved";;
          this.toastObj.show(this.toasts[1]);
          setTimeout(() => { window.location.reload(); }, 2000);
        });
  }

 

  GetDashboardUIComponents() {
    let UIComponentSource: any;
    this._DashboardService.getDashboardUIComponents()
      .subscribe(
        data => {
          if (this.Source == 'LandingPage') {
            UIComponentSource = data;
            this.uicomponents = UIComponentSource.filter(x => x.text == "Card");

            this.ddlComponent.text = "Card";
          }
          else {


            this.uicomponents = (data)
          }

        }
      );
  }

  IsLoggedRoleSystem: boolean;
  GetAllTableNames() {
    
    let participantId = this.LoggedInRoleId;

    if (this.IsLoggedRoleSystem) {
      this.tablenames = [
        { "EntityName": "Workflows", "EntityId": "RWorkflows" },
        { "EntityName": "Roles", "EntityId": "LRoles" },
        { "EntityName": "Users", "EntityId": "LUsers" },
        { "EntityName": "EmailTemplates", "EntityId": "LEmailTemplates" },
        { "EntityName": "Transactions", "EntityId": "FlexTableData" },
        { "EntityName": "Master Data", "EntityId": "LReferenceData" },
      ];
    }
    else {//for non system Roles
      this.GetTableNamesForNonSystemRoles(participantId);

    }

  }

  GetTableNamesForNonSystemRoles(RoleId) {
    this._DashboardService.GetEntiesByParticipant(RoleId, this.LoggedInScopeEntityType, this.LoggedInScopeEntityId) //project id was not sent
      .subscribe(
        data => {
          this.tablenames = (data);
        }
      );

  }

  GetColumnListByEntity() {
    this._colservice.GetAllFlattenedDFsForEntity(this.TableEntityType, this.TableEntityId)
      .subscribe(
        data => {
          this.Columns = (data);
          this.choosecolumn = (data);
        }
      );
  }

  showAgreegateFunc() {
    this.AgreegateFunc =
      [
        { ShowText: 'AVG', Id: 'AVG' },
        { ShowText: 'COUNT', Id: 'COUNT' },
        { ShowText: 'MAX', Id: 'MAX' },
        { ShowText: 'MIN', Id: 'MIN' },
        { ShowText: 'SUM', Id: 'SUM' }
      ];
  }



  WhereClause: string = '';
  PostWhereClauseEvent(val) {
    this.WhereClause = val.WhereExpression;
  }
  openPivotScreenPopUp = false;
  openPivotScreen() {
    this.Source = "dashboard";
    this.openPivotScreenPopUp = true;
  }
  //**********************************************************************************************

  //***********************************************************************************************


}
