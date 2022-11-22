import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';

import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { DatePickerComponent, DateTimePickerComponent } from '@syncfusion/ej2-angular-calendars';
import { RadioButtonComponent } from '@syncfusion/ej2-angular-buttons';

import { ToastPositionModel, ToastComponent } from '@syncfusion/ej2-angular-notifications';
import { branchmodel } from '../../../models/branch.model';
import { whereconditionmodel } from '../../../models/WhereCondition.model';
import { StepColumnsService } from '../../../services/step-columns.service';
import { BranchService } from '../../../services/branch.service';
import { DashboardService } from '../../../services/dashboard.service';
import { DateTime } from '@syncfusion/ej2-angular-charts';
import { DatePipe } from '@angular/common';
import { ReportService } from '../../../services/report.service';



@Component({
    selector: 'app-where-clause',
    templateUrl: './where-clause.component.html',
    styleUrls: ['./where-clause.component.css']
})
/** WhereClause component*/
export class WhereClauseComponent {

  @Input() TableEntityType: string;
  @Input() TableEntityId: number;
  @Input() Source: string;
  @Input() HavingDataJSON: string;
  @Input() ExpressionVal: string;
  @Input() FormGridName: string;
  @Input() IsParamRequired: any;
  @Output() PostWhereClauseEvent = new EventEmitter<any>();
  @Output() PostHavingClauseEvent = new EventEmitter<any>();
  choosecolumn: any = [];
/*choosecolumnfieldsforcondition: Object = { text: 'FieldName', value: 'DataFieldId' };*/
  choosecolumnfieldsforcondition: Object = { text: 'FieldName', value: 'FieldName' };
  tablenamefromcolumname: string;
  columnnameofjoiningtable: string;
  entityType: string;
  entityId: number;
  entityText: string;
  columnAttributeVal: string;
  actualValueofEntity: string;
  dataTypeValue: string;
  operators: Object = [];
  SaprationOperatorsData: Object = [];
  DataTypeSrc: Object = [];
  Flag: string;
  enabled: Boolean;
  operatorValue: string;
  userFriendlyExpression: string="";
  branchmodeldata: branchmodel = new branchmodel();
  whereconditionmodeldata: whereconditionmodel = new whereconditionmodel();
  //showAndOr2: boolean = false;
  isDisable: boolean = true;
  ShowHavingBtn: Boolean = false;
  ShowWhereBtn: Boolean = false;
  DateTimeFormat: string = "MM-dd-yyyy H:mm:ss";
  HierarchyScopeData: Object;
  public BitValues: Object = [{ text: 'TRUE', value: 'TRUE' }, { text: 'FALSE', value: 'FALSE' }];
  AgreegateFunc: Object = [];

  NoParamChecked: boolean = true;
  YesParamChecked: boolean = false;
  ShowRadiobutton: boolean = false;
  LoggedInScopeEntityId: number;
  LoggedInScopeEntityType: string;
  FuncColumnfields: Object = { text: 'Label', value: 'Id' };

  //@ViewChild('AndOrobj', { static: false }) public AndOrobj: DropDownListComponent;
  @ViewChild('SaprationOperators', { static: false }) public SaprationOperators: DropDownListComponent;
  @ViewChild('entity', { static: false }) public entity: DropDownListComponent;
  @ViewChild('operatorobj', { static: false }) public operatorobj: DropDownListComponent;
  @ViewChild('DataType', { static: false }) public DataType: DropDownListComponent;
  @ViewChild('Tobj', { static: false }) public Tobj: TextBoxComponent;
  @ViewChild('MLobj', { static: false }) public MLobj: TextBoxComponent;
  @ViewChild('Dobj', { static: false }) public Dobj: DatePickerComponent;
  @ViewChild('DTobj', { static: false }) public DTobj: DateTimePickerComponent;
  @ViewChild('bitObj', { static: false }) public bitObj: DropDownListComponent;
  @ViewChild('NTobj', { static: false }) public NTobj: TextBoxComponent;
  @ViewChild('ResultMLobj', { static: false }) public ResultMLobj: TextBoxComponent;
  @ViewChild('radiobutton', { static: false }) public radiobutton: RadioButtonComponent; 
  @ViewChild('ParamLabel', { static: false }) public ParamLabel: TextBoxComponent;


  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };


  @ViewChild('toasttype', { static: false })
  private toastObj: ToastComponent;


  constructor(private _colservice: StepColumnsService,
    private _branchService: BranchService,
    private _DashboardService: DashboardService,
    private datePipe: DatePipe,
    private _reportService: ReportService,) {
    this.LoggedInScopeEntityId = +sessionStorage.getItem("LoggedInScopeEntityId");
    this.LoggedInScopeEntityType = sessionStorage.getItem("LoggedInScopeEntityType");

  }

  ngOnInit() {
    
    this.SaprationOperatorsData = [{ text: 'OR', value: 'OR' }, { text: 'AND', value: 'AND' },
      { text: '(', value: '(' }, { text: ')', value: ')' }, { text: 'None', value: 'None' }];

    this.operators = [{ text: 'LIKE', value: 'LIKE' }, { text: '=', value: '=' },
      { text: '>', value: '>' }, { text: '<', value: '<' }, { text: '<>', value: '<>' }, { text: '<=', value: '<=' },
      { text: '+', value: '+' }, { text: '-', value: '-' }, { text: '*', value: '*' }, { text: '/', value: '/' }
    ];

    this.DataTypeSrc = [{ text: 'String', value: 'nvarchar' }, { text: 'Number', value: 'numeric' }, 
      { text: 'Int', value: 'int' }, { text: 'Paragraph', value: 'multiline' }, { text: 'Date', value: 'date' },
      { text: 'DateTime', value: 'datetime' }, { text: 'True/False', value: 'bit' }];

    this.AgreegateFunc = [{ text: 'MAX', value: 'MAX' }, { text: 'MIN', value: 'MIN' },
      { text: 'COUNT', value: 'COUNT' }, { text: 'AVG', value: 'AVG' }, { text: 'SUM', value: 'SUM' },
      { text: 'Year', value: 'Year' }, { text: 'Month', value: 'Month' }];

    this.GetColumnListByEntity();

   
    if (this.Source == 'WhereClause')
    {
      this.ShowWhereBtn = true;
    }
    else if (this.Source == 'HavingClause' || this.Source == 'Calculation')
    {
      this.ShowHavingBtn = true;
      
    }
    

  //Prepare Datasource for Hierarchy Scope dropdown
    this.HierarchyScopeData = [
      { text: 'ShowOnlyMe', value: 'ShowOnlyMe' },
      { text: 'ShowOnlyChild', value: 'ShowOnlyChild' },
      { text: 'ShowChildandMe', value: 'ShowChildandMe' },
      { text: 'ShowOnyHierarchy', value: 'ShowOnyHierarchy' },
      { text: 'ShowHierarchyandMe', value: 'ShowHierarchyandMe' }
    ];

    if (this.IsParamRequired == "true") {
      this.ShowRadiobutton = true;
    }

    this.GetCustomFunctionWithInScope();

  }
  ngAfterViewInit() {
    if (this.ExpressionVal != null && this.ExpressionVal != undefined && this.ExpressionVal != '') {
      //this.showAndOr2 = true;
      this.ResultMLobj.value = this.ExpressionVal
    }
  }


  FunctionList: any;
  GetCustomFunctionWithInScope() {
    
    this._reportService.GetCustomFunctionWithInScope(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
      .subscribe(
        data => {
          this.FunctionList = data;
        }
      );
  }

  CustomFuncId: number;
  CustomFuncLabel: string;
  CustomFunctionName: string;
  ShowParameterdd: Boolean = false;
  IsFuncField: Boolean = false;
  SelectFuncChange(args: any): void {
    
    this.IsFuncField = true;
    this.CustomFuncId = args.itemData.Id;
    this.CustomFuncLabel = args.itemData.Label;
    this.CustomFunctionName = args.itemData.Name;
    this.ShowParameterdd = true;
    this.DropdownArr = [];
    this.GetCustomFunctionParameters();
  }

  DropdownArr: any[];
  ParamValueArray: any = [];

  GetCustomFunctionParameters() {
    
    this._reportService.GetCustomFunctionParameters(this.CustomFuncId, this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
      .subscribe(
        (CustomParamdata: any) => {
          //maintain a blank array here of CustomParamdata.length size, later we will push parameter value on same index in this array
          this.ParamValueArray = new Array<string>(CustomParamdata.length);

          for (let i = 0; i < CustomParamdata.length; i++) {
            if (CustomParamdata[i].IsUserProvided == 1)//it will become dropdown in front end
            {
              this.DropdownArr.push({ DataSource: JSON.parse(CustomParamdata[i].ParameterData), Index: i })
              //this.SelectClauseForm.addControl('param_' + i, this.formBuilder.control(''));

            }
            else//no need of dropdown
            {
              this.ParamValueArray[i] = CustomParamdata[i].ParameterData;
            }
          }

        });
  }
  ParameterDFChange(Index: number, args: any): void {
    
    console.log(Index);
    //let SelectedDropdownId = +args.item.parentElement.id.split('_')[0].substring('SCL'.length);
    this.ParamValueArray[Index] = args.itemData.value;
  }


  GetColumnListByEntity() {
    
    this._colservice.GetAllFlattenedDFsForEntity(this.TableEntityType, this.TableEntityId)
      .subscribe(
        data => {
          if (this.Source == 'WhereClause') {
            this.choosecolumn = (data);
          }
          else if (this.Source == 'Calculation')
          {
            //In case of formGrid calculation only fields that belongs to that FormGrid and fields of form and field of tbose dropdown which do not have multiselection will come.
            if (this.FormGridName != undefined && this.FormGridName != '' && this.FormGridName != null) {
              this.choosecolumn = data.filter(x => x.Level == 1 || (x.FieldName.includes(this.FormGridName) && x.IsMultiSelection == 0))
            }
            else {
              this.choosecolumn = (data);
            }
          }
          else//means havingclause
          {
            var HavingDataSrc = JSON.parse(this.HavingDataJSON);
            
            this.choosecolumn = HavingDataSrc;
           
          }
        }
      );
  }

  public hierarchyScopeChange(args: any): void {
    
    let scope = args.itemData.value;
    this.IsFuncField = false;
    if (this.ResultantExpression == "") {
      this.ResultantExpression = "WHERE #HeirarchyScope:" + scope + "##";
    }
    else if (this.ResultantExpression.includes("#HeirarchyScope:")) {
      let HeirarchyScopeText;
      HeirarchyScopeText = this.ResultantExpression.substring(this.ResultantExpression.indexOf('#')+1, this.ResultantExpression.indexOf('##'));
      this.ResultantExpression = this.ResultantExpression.replace("#" + HeirarchyScopeText + "##", "#HeirarchyScope:" + scope + "##");
    }
    else {
      this.ResultantExpression = this.ResultantExpression + " and #HeirarchyScope:" + scope + "##";
    }

    if (this.ResultMLobj == undefined) {
      this.ResultMLobj = null;
    }
    this.ResultMLobj.value = this.ResultantExpression;
  }

  CalcParticpantDFIDs: string = "";
  SelectedColDataFieldId: number;
  SelectedColDataType: string;
  public entityChange(args: any): void {
    
    this.IsFuncField = false;
    let str = args.itemData.FieldName;
    this.SelectedColDataFieldId = args.itemData.DataFieldId;
    this.SelectedColDataType = args.itemData.DataType;
    this.entityText =  str.replaceAll("] ", "].");

    if (this.Source == 'HavingClause') {
       
      this.entityText = this.entityText.replace('(', '({');
      this.entityText = this.entityText.replace(')', '})');
      this.actualValueofEntity = this.entityText;
    }
    else {

    /* this.actualValueofEntity = "{[" + this.tablenamefromcolumname + "]" + "." + this.entityText + "}";*/
      this.actualValueofEntity = "{" + this.entityText + "}";
    }

    if (this.Source == "Calculation") {
      this.CalcParticpantDFIDs = this.CalcParticpantDFIDs + args.itemData.DataFieldId + ",";
    }
    
    this.entityType = args.itemData.EntityType;
    this.entityId = args.itemData.EntityId;
    this.getAttributeByColConfigId(args.itemData.DataFieldId);
  
  }



  OperatorEnabled: Boolean = false;
  
  getAttributeByColConfigId(Value) {
    this._branchService.getAttributeByColConfigId(Value)
      .subscribe(
        data => {
          this.columnAttributeVal = data;
          // this.selectedColName = data;
        }
      );
  }

 
  UserInputValue: any;
  selectedSaprator: any;
  fnAddCondition() {
    
    if (this.IsParamField)//we are taking parameters also, till today(11 August 2021) this is in the case of Report only, we will take value of parameter at runtime
    {
      this.PrepareParameters();
    }
    else {
      if (this.Flag == "String") {
        this.UserInputValue = this.Tobj.value;
      }
      if (this.Flag == "Paragraph") {
        this.UserInputValue = this.MLobj.value;
      }
      if (this.Flag == "Date") {
        this.UserInputValue = this.Dobj.value;
      }
      if (this.Flag == "DateTime") {
        this.UserInputValue = this.DTobj.value;
      }
      if (this.Flag == "True/False") {
        this.UserInputValue = this.bitObj.value;

      }
      if (this.Flag == "Number" || this.Flag == "Int") {
        this.UserInputValue = this.NTobj.value;

      }

      if (this.SaprationOperators.value != null && this.SaprationOperators.value != undefined) {
        this.selectedSaprator = this.SaprationOperators.value.toString();
      }



      this.userFriendlyExpression = this.ResultMLobj.value;

      //later on we are replacing where to having
      if (this.Source == 'HavingClause' && this.userFriendlyExpression != null) {
        this.userFriendlyExpression = this.userFriendlyExpression.replace('having', 'WHERE');
      }



      this.PrepareExpression();

     

      if (this.Source == 'HavingClause') {
        this.ResultantExpression = this.ResultantExpression.replace('WHERE', 'having');
      }
      if (this.Source == 'Calculation') {
        this.ResultantExpression = this.ResultantExpression.replace('WHERE', '');
      }

      if (this.Flag == "String") {
        this.Tobj.value = null;
      }
      if (this.Flag == "Paragraph") {
        this.MLobj.value = null;
      }
      if (this.Flag == "Date") {
        this.Dobj.value = null;
      }

      if (this.Flag == "DateTime") {
        this.DTobj.value = null;
      }

      if (this.Flag == "True/False") {
        this.bitObj.value = null;

      }

      if (this.Flag == "Number" || this.Flag == "Int") {
        this.NTobj.value = null;

      }
     
    }
    this.ResultMLobj.value = this.ResultantExpression;
    this.entity.value = null;
    this.operatorobj.value = null;
    this.SaprationOperators.value = null;
    this.DataType.value = null;
    this.dataTypeValue = "";
    this.Flag = "";
    this.selectedSaprator = "";
    this.actualValueofEntity = "";
    this.operatorValue = "";
    this.ParamLabel.value = null;
    
  }

  ReportParamArr: any[];
  PrepareParameters() {
    //##ParamLabel: Period Name## and((Periods_RD.AttributeC01        ##operator##           @Period Name_ParamValue1) (OR @Period Name_ParamValue1 IS NULL) )
    let ParamLabel = this.ParamLabel.value;

   

    if (this.operatorValue == undefined || this.operatorValue == null) {
      this.operatorValue = "";
    }

    if (this.AggFuncValue == null || this.AggFuncValue == undefined) {
      this.AggFuncValue = "";
    }

    if (this.SaprationOperators.value != null && this.SaprationOperators.value != undefined) {
      this.selectedSaprator = this.SaprationOperators.value.toString();
    }
    else {
      this.selectedSaprator = "";
    }



    if (this.ReportParamArr == undefined) {
      this.ReportParamArr = [];
    }


    //--WHERE   #{[Achievements].[Period].Periods} #Period Name:operator# Period Name:value1## 
    //and #F_GetUserRoleTagsByCategory(@UserId, @RoleId, 1) #Department: operator# Department: value1##
    let paramExpression;
    if (this.IsFuncField) {
      this.ReportParamArr.push({
        Type: this.selectedSaprator,
        Label: ParamLabel,
        UserfriendlyDataField: this.CustomFuncLabel,
        DataFieldId: null,
        CustomFunctionId: this.CustomFuncId,
        CustomFunctionParameter: this.ParamValueArray.join(','),
        ValueDDType:null,
        ValueDDSelectClause: null,
        TechnicalFieldName: null
      });
      if (this.AggFuncValue != "") {
        /*paramExpression = " " + this.selectedSaprator + " #ParamLabel: " + ParamLabel + "# " + this.AggFuncValue + "(" + this.actualValueofEntity + ") #operator# " + ParamLabel + "_ParamValue##";*/
        paramExpression = " " + this.selectedSaprator + " " + this.AggFuncValue + "(" + this.CustomFunctionName + "(" + this.ParamValueArray.join(',') + ")) #" + ParamLabel + ":operator#  " + ParamLabel + ":value1##";

      }
      else {
        /*paramExpression = " " + this.selectedSaprator + " #ParamLabel: " + ParamLabel + "# "  + this.actualValueofEntity + " #operator# " + ParamLabel + "_ParamValue##";*/
        paramExpression = " " + this.selectedSaprator + " " + this.CustomFunctionName + "(" + this.ParamValueArray.join(',') + ") #" + ParamLabel + ":operator#  " + ParamLabel + ":value1##";
      }
    }
    else {
      this.ReportParamArr.push({
        Type: this.selectedSaprator,
        Label: ParamLabel,
        UserfriendlyDataField: this.actualValueofEntity,
        DataFieldId: this.SelectedColDataFieldId,
        CustomFunctionId: null,
        CustomFunctionParameter: null,
        ValueDDType: null,
        ValueDDSelectClause: null,
        TechnicalFieldName: null
      });
      if (this.AggFuncValue != "") {
        /*paramExpression = " " + this.selectedSaprator + " #ParamLabel: " + ParamLabel + "# " + this.AggFuncValue + "(" + this.actualValueofEntity + ") #operator# " + ParamLabel + "_ParamValue##";*/
        paramExpression = " " + this.selectedSaprator + " " + this.AggFuncValue + "(" + this.actualValueofEntity + ") #" + ParamLabel + ":operator#  " + ParamLabel + ":value1##";

      }
      else {
        /*paramExpression = " " + this.selectedSaprator + " #ParamLabel: " + ParamLabel + "# "  + this.actualValueofEntity + " #operator# " + ParamLabel + "_ParamValue##";*/
        paramExpression = " " + this.selectedSaprator + " " + this.actualValueofEntity + "  #" + ParamLabel + ":operator#  " + ParamLabel + ":value1##";
      }
    }

  
    
    


    if (this.ResultantExpression == "") {
      this.ResultantExpression = "WHERE " + paramExpression;
    }
    else {
      this.ResultantExpression = this.ResultantExpression + paramExpression;
    }

    if (this.ResultMLobj == undefined) {
      this.ResultMLobj = null;
    }
   

  }

  ResultantExpression: string = '';
  technicalresultantexpression: string = '';
  PrepareExpression() {
    let SelectedInputboolean = 0;
    if (this.UserInputValue == "TRUE") {
      SelectedInputboolean = 1;
    }
    if (this.UserInputValue == "FALSE") {
      SelectedInputboolean = 0;
    }
    let technicalexpressioninput = "";//string that contains database where clause
   
    if (this.dataTypeValue == "datetime") {
    /* technicalexpressioninput = "'" + new DateTime(this.UserInputValue) + "'";*/
      var locale = Intl.DateTimeFormat().resolvedOptions().locale;
      technicalexpressioninput = "'" + this.UserInputValue + "'";
      technicalexpressioninput = new Date(technicalexpressioninput).toISOString().slice(0, 19).replace('T', ' ');
      var dateFormat = this.DateTimeFormat.slice(0, this.DateTimeFormat.indexOf(" "));
      technicalexpressioninput = this.datePipe.transform(technicalexpressioninput, dateFormat, null, locale);
    }
    if (this.dataTypeValue == "date") {
      technicalexpressioninput = "'" + (this.UserInputValue) + "'";
    }
    if (this.dataTypeValue == "int" || this.dataTypeValue == "numeric") {
      technicalexpressioninput = this.UserInputValue;
    }
    if (this.dataTypeValue == "bit") {
      technicalexpressioninput = (SelectedInputboolean).toString();
    }
    if (this.dataTypeValue == "nvarchar" && this.operatorValue == "=") {
      if (this.UserInputValue == "null") {
        technicalexpressioninput = " is null";
        this.operatorValue = "";
      }
      else {
        technicalexpressioninput = "'" + this.UserInputValue + "'";
      }
    }

    if (this.dataTypeValue == "nvarchar" && this.operatorValue == "+") {
      if (this.UserInputValue == "null") {
        technicalexpressioninput = " is null";
        this.operatorValue = "";
      }
      else {
        technicalexpressioninput = "'" + this.UserInputValue + "'";
      }
    }
    if (this.dataTypeValue == "nvarchar" && this.operatorValue == "<>") {
      if (this.UserInputValue == "null") {
        technicalexpressioninput = " is not null";
        this.operatorValue = "";
      }
      else {
        technicalexpressioninput = "'" + this.UserInputValue + "'";
      }
    }
    if (this.dataTypeValue == "nvarchar" && this.operatorValue == "LIKE") {
      technicalexpressioninput = "'%" + this.UserInputValue + "%'";
    }

    if (technicalexpressioninput != null && technicalexpressioninput != "" && technicalexpressioninput != undefined) {
      technicalexpressioninput = technicalexpressioninput.replace('\'', '"').trim();
    }

    if (technicalexpressioninput == null || technicalexpressioninput == undefined)
    {
      technicalexpressioninput = "";
    }

    if (this.selectedSaprator == undefined || this.selectedSaprator == "None" || this.selectedSaprator == null) {
      this.selectedSaprator = "";
    }

    if (this.operatorValue == undefined || this.operatorValue == null) {
      this.operatorValue = "";
    }

    if (this.userFriendlyExpression == null) {
      this.userFriendlyExpression = "";
    }

    if (this.actualValueofEntity == null || this.actualValueofEntity == undefined)
    {
      this.actualValueofEntity = "";
    }

    if (this.AggFuncValue == null || this.AggFuncValue == undefined) {
      this.AggFuncValue = "";
    }
   

    //following expression will be saved for the fontend

    if (this.AggFuncValue != "")
    {
      this.ResultantExpression = this.userFriendlyExpression + " " + this.selectedSaprator + " " + this.AggFuncValue + "(" + this.actualValueofEntity + ") " + this.operatorValue + " " + technicalexpressioninput;
    }
    else
    {
      this.ResultantExpression = this.userFriendlyExpression +  " " + this.selectedSaprator + " " + this.actualValueofEntity + " " + this.operatorValue + " " + technicalexpressioninput;
    }
    if (this.ResultantExpression.includes("WHERE")) {
      this.ResultantExpression = this.userFriendlyExpression + " " + this.selectedSaprator + " " + this.actualValueofEntity + " " + this.operatorValue + " " + technicalexpressioninput;
    }
    else {
      this.ResultantExpression = "WHERE" + this.ResultantExpression;
    }
    //this.technicalresultantexpression = this.userTechnicalExpression + " " + this.selectedSaprator + " " + "[" + this.columnAttributeVal + "]" + " " + this.selectedSaprator + " " + technicalexpressioninput;
    //if (this.technicalresultantexpression.Contains("WHERE")) {
    //  this.technicalresultantexpression = model.Techexpression + " " + this.selectedSaprator + " " + "[" + this.columnAttributeVal + "]" + " " + this.selectedSaprator + " " + technicalexpressioninput;
    //}
    //else {
    //  this.technicalresultantexpression = "WHERE" + this.technicalresultantexpression;
    //}
  }

  IsResetPressed: Boolean = false;
  Reset() {
    
    //this.showAndOr2 = false;
   if (this.Source == 'Calculation') {
     this.IsResetPressed = true;
   }
    this.ResultantExpression = "";
    this.ResultMLobj.value = null;
    this.ParamLabel.value = null;
    this.entity.value = null;
    this.operatorobj.value = null;
   
   
  }
  public selectedColName: string;
  DoNotSave: boolean = false;
  public operatorChange(args: any): void {
    this.operatorValue = args.itemData.value;
  }

  AggFuncValue: string;
  public AggFuncChange(args: any): void {
    this.AggFuncValue = args.itemData.value;
  }

  public DataTypeChange(args: any): void {
    this.dataTypeValue = args.itemData.value;
    this.Flag = args.itemData.text;
  }

  Validate() {
    
    this.whereconditionmodeldata.Condition = this.ResultMLobj.value;
    this.whereconditionmodeldata.EntityId = this.TableEntityId;
    this.whereconditionmodeldata.EntityType = this.TableEntityType;
    //if (this.Branchconditioncreateform.invalid) {
    //  return;
    //}
    //else
    {
      this._DashboardService.Validate(this.whereconditionmodeldata)
        .subscribe(
          Validateddata => {
            let MsgPrefix: string = Validateddata.substring(0, 2);
            let Showmsg: string = Validateddata.substring(2, Validateddata.length);

            if (MsgPrefix == 'S:') {
              //this.DoNotSave = false;
              this.toastObj.timeOut = 2000;
              this.isDisable = false;
              this.toasts[1].content = Showmsg;
              this.toastObj.show(this.toasts[1]);
              if (this.ResultMLobj.value == null || this.ResultMLobj.value == "") {
                this.ResultMLobj.value = "where 1=1";
              }

              //this.PostHavingClauseEvent.emit({ Calculation: this.ResultMLobj.value, CalcParticpantDFIDs: this.CalcParticpantDFIDs, IsResetPressed: this.IsResetPressed });
              this.PostWhereClauseEvent.emit({ WhereExpression: this.ResultMLobj.value, ReportParamJson: JSON.stringify(this.ReportParamArr) });
            }
            else if (MsgPrefix == 'I:') {//Information message
              //this.DoNotSave = false;
              this.toastObj.timeOut = 2000;
              this.isDisable = false;
              this.toasts[3].content = Showmsg;
              this.toastObj.show(this.toasts[3]);
            }
            else if (MsgPrefix == 'W:') {//Warning Message
              //this.DoNotSave = false;
              this.toastObj.timeOut = 2000;
              this.isDisable = false;
              this.toasts[0].content = Showmsg;
              this.toastObj.show(this.toasts[0]);
            }
            else {
              this.toastObj.timeOut = 0;
              this.isDisable = true;
              //this.DoNotSave = true;
              this.toasts[2].content = Showmsg;
              this.toastObj.show(this.toasts[2]);
            }

          }
        );
    }
  }
 

  SetWhereClause() {
    
    this.Validate();
    
  }

  SetHavingClause() {
    
    if (this.Source == 'Calculation') {
      this.toasts[1].content = 'Calculation has been locked';
      this.CalcParticpantDFIDs = this.CalcParticpantDFIDs.substring(0, (this.CalcParticpantDFIDs.length) - 1);
    
    }
    else {
      this.toasts[1].content = 'having clause has been locked';
    }
    this.toastObj.timeOut = 2000;
    
    this.toastObj.show(this.toasts[1]);
    this.PostHavingClauseEvent.emit({ Expression: this.ResultMLobj.value, CalcParticpantDFIDs: this.CalcParticpantDFIDs, IsResetPressed: this.IsResetPressed});
  }

  ShowHeirarchyDD: boolean = true;
  ShowOperator: boolean = true;
  ShowValueTypeDD: boolean = true;
  ShowParamLabel: boolean = false;
  IsParamField: Boolean;
  public changeHandler(): void {
    
    if (this.radiobutton.getSelectedValue() === "No") { //means it is not a Param field
      this.ShowHeirarchyDD = true;
      this.ShowOperator = true;;
      this.ShowValueTypeDD = true;
      this.ShowParamLabel = false;
      this.IsParamField = false;
    }
    else { //means it is a Param field
      this.ShowHeirarchyDD = false;
      this.ShowOperator = false;
      this.ShowValueTypeDD = false;
      this.ShowParamLabel = true;
      this.IsParamField = true;
    }

  }
}
