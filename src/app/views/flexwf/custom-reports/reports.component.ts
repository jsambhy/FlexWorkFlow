import { Component, Input, ViewChild, ViewContainerRef, TemplateRef } from '@angular/core';
import { ToolbarService, ToolbarItems, GridComponent, ExcelExportService, PdfExportService, EditSettingsModel, IEditCell } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs, SelectEventArgs, TabComponent } from '@syncfusion/ej2-angular-navigations';
import { ToastPositionModel, ToastComponent } from '@syncfusion/ej2-angular-notifications';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { StepColumnsService } from '../../../services/step-columns.service';
import { DropDownListComponent, ListBoxComponent, DropDownList} from '@syncfusion/ej2-angular-dropdowns';
import { DashboardService } from '../../../services/dashboard.service';
import { BranchService } from '../../../services/branch.service';
import { Report, ReportParametersModel } from '../../../models/report-model';
import { ReportService } from '../../../services/report.service';
import { TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { RolesService } from '../../../services/roles.service';
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
import { UserService } from '../../../services/user.service';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { RadioButtonComponent } from '@syncfusion/ej2-angular-buttons';
import { bool } from 'aws-sdk/clients/signer';
import { CustomValidatorsService } from '../../../services/custom-validators.service';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  providers: [ToolbarService, ExcelExportService, PdfExportService, DashboardService]
})
/** Reports component*/
export class ReportsComponent {
  hidden: Boolean = false;
  toolbar: object;
  Columntoolbar: object;
  Parametertoolbar: object;
  ShowCreatePopup: boolean = false;
  ShowCreateBtn: boolean = false;
  ShowUpdateBtn: boolean = false;
  LoggedInUserId: number;
  LoggedInRoleId: number;
  UserRoleId: number;
  ProjectId: number;
  LoggedInScopeEntityId: number;
  LoggedInScopeEntityType: string;
  LoggedInRoleName: string;
  LoggedInEmail: string;
  tablenames: Object = [];
  chooseTablefields: Object = { text: 'EntityName', value: 'EntityId' };
  FuncColumnfields: Object = { text: 'Label', value: 'Id' };
  Columns: any = [];
  SelectList2DataSrc: any = [];
  OrderByList2DataSrc: any = [];
  AccessList2DataSrc: any = [];
  SelectedDataFieldsSrc: any = [];
  UserList2DataSrc: any = [];
  TagList2DataSrc: any = [];
/*  chooseColumnfields: Object = { text: 'FieldName', value: 'DataFieldId' };*/
  chooseColumnfields: Object = { text: 'FieldName', value: 'FieldName' };
  OrderByfields: Object = { text: 'Label', value: 'DataFieldId' };
  Accessfields: Object = { text: 'RoleName', value: 'Id' };
  Userfields: Object = { text: 'LoginEmail', value: 'UserId' };
  Tagfields: Object = { text: 'TagName', value: 'Id' };
  paramfields: Object = { text: 'text', value: 'value' };
  Listtoolbar = { items: ['moveUp', 'moveDown', 'moveTo', 'moveFrom', 'moveAllTo', 'moveAllFrom'] }
  AgreegateFunc: Object = [];
  SelectColList: string;
  FuncFieldVal: string;
  ShowClauses: Boolean = false;
  ShowHavingClauses: Boolean = false;
  ReportModel = new Report();
  ReportSelectReportParametersModel = new ReportParametersModel();
  operators: Object = [];
  AccessListDataSrc: any = [];
  RoleName: string;
  ReportData: any;
  ReportForm: FormGroup = null;
  HavingClauseForm: FormGroup = null;
  SelectClauseForm: FormGroup = null;
  OrderByForm: FormGroup = null;
  ParameterForm: FormGroup = null;
  Havingtoolbar: ToolbarItems[] | Object;
  editSettings: EditSettingsModel
  PivotSource: string = 'Report';
  SelectedReportId: number;
  openPivotScreenPopUp: boolean = false;
  openReportPivotViewPopUp: boolean = false;
  OrderTypeList: Object = [{ text: 'asc', value: 'asc' }, { text: 'desc', value: 'desc' }]
  NoFFChecked: Boolean = true;
  YesFFChecked: Boolean = false;
  ShowColumnDF: Boolean = true;
  ShowColumnFunctions: Boolean = false;
  FunctionList: any;
  ShowParamFormPopup: Boolean = false;

  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };




  @ViewChild('ReportGrid', { static: false })
  public ReportGrid: GridComponent;

  @ViewChild('ColumnsGrid', { static: false })
  public ColumnsGrid: GridComponent;


  @ViewChild('OrderByGrid', { static: false })
  public OrderByGrid: GridComponent;


  @ViewChild('toasttype', { static: false })
  private toastObj: ToastComponent;

  @ViewChild('Accesslistbox2', { static: false })
  public Accesslistbox2: ListBoxComponent;

  @ViewChild('Userlistbox2', { static: false })
  public Userlistbox2: ListBoxComponent;

  @ViewChild('Taglistbox2', { static: false })
  public Taglistbox2: ListBoxComponent;

  @ViewChild('funcDataField', { static: false })
  public funcDataField: DropDownListComponent;


  @ViewChild('ReportName', { static: false })
  public ReportName: TextBoxComponent;

  @ViewChild('DownLoadFileName', { static: false })
  public DownLoadFileName: TextBoxComponent;

  @ViewChild('TableNameobj', { static: false })
  public TableNameobj: TextBoxComponent;

  @ViewChild('confirmDialog', { static: false })
  public confirmDialog: DialogComponent;

  @ViewChild('HavingGrid', { static: false })
  public HavingGrid: GridComponent;

  @ViewChild('tab', { static: false })
  public TabObject: TabComponent;

  @ViewChild('radiobutton', { static: false })
  public radiobutton: RadioButtonComponent; 

  constructor(private _DashboardService: DashboardService,
    private _colservice: StepColumnsService,
    private _UserService: UserService,
    private _service: ReportService,
    private _RoleService: RolesService,
    private formBuilder: FormBuilder,
    private customValidatorsService: CustomValidatorsService) {
    this.LoggedInUserId = +sessionStorage.getItem("LoggedInUserId");
    this.LoggedInRoleId = +sessionStorage.getItem("LoggedInRoleId");
    this.UserRoleId = +sessionStorage.getItem("UserRoleId");
    this.ProjectId = +sessionStorage.getItem("ProjectId");
    this.LoggedInScopeEntityId = +sessionStorage.getItem("LoggedInScopeEntityId");
    this.LoggedInScopeEntityType = sessionStorage.getItem("LoggedInScopeEntityType");
    this.LoggedInRoleName = sessionStorage.getItem('LoggedInRoleName');
    this.LoggedInEmail = sessionStorage.getItem('LoginEmail');

    this.ReportForm = this.formBuilder.group({
      ReportName: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      DownLoadFileName: new FormControl(''),
      TableNames: new FormControl('', [Validators.required]),
      Description: new FormControl('')
    });

    this.HavingClauseForm = this.formBuilder.group({
      ColumnName: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      AggFuncName: new FormControl(''),
      Label: new FormControl('')
    });

    this.SelectClauseForm = this.formBuilder.group({
      SelectListColumnName: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      SelectListColumnLabel: new FormControl(''),
      FuncColumnName: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      Width: new FormControl('')
    });

    this.OrderByForm = this.formBuilder.group({
      ColumnName: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      Order: new FormControl('')
    });


    this.ParameterForm = new FormGroup({
      DataField: new FormControl(''),
      CustomFunc: new FormControl(''),
      ParameterLabel: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      DataType: new FormControl('', [Validators.required]),
      IsMandatory: new FormControl(false),
      IsActive: new FormControl(true),
      DefaultValue: new FormControl(''),
      MinLength: new FormControl(''),
      MaxLength: new FormControl(''),
      ToolTip: new FormControl(''),
      Width: new FormControl(''),
      DigitsAfterDecimal: new FormControl(''),
      MinValue: new FormControl(''),
      MaxValue: new FormControl(''),
      MinDateInclusive: new FormControl(''),
      MaxDateInclusive: new FormControl(''),
      DefaultDateValue: new FormControl(this.dateValue),
      DefaultBooleanValue: new FormControl(false),
      ListNameValue: new FormControl(''),
      EntityTypeValue: new FormControl(''),
      DisplayColumnListValue: new FormControl(''),
      PrepopulateColumnListValue: new FormControl(''),
      IsMultiSelection: new FormControl(false),
    },
      {
        validators: [
          this.customValidatorsService.startBeforeEnd('MinDateInclusive', 'MaxDateInclusive', 'endBeforeStart'),
        ]
      }
    );

    this.DataTypeSource = [
      { text: "Short Text", value: "ShortAnswer" },
      { text: "Paragraph", value: "Paragraph" },
      { text: "SingleColumnList", value: "SingleColumnList" },
      { text: "MultiColumnList", value: "MultiColumnList" },
      { text: "FormGrid", value: "FormGrid" },
      { text: "Date", value: "Date" },
      { text: "Number", value: "Number" },
      { text: "Yes/No", value: "Boolean" },
    ];
   }


  get f() { return this.ReportForm.controls; }

  public data: object[];
  ngOnInit() {
    this.data = [];
   
    this.toolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' },
      { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' },
      { text: 'Review', tooltipText: 'Review', prefixIcon: 'e-custom-icons e-action-Icon-review1', id: 'Review' },
      { text: 'Cloning', tooltipText: 'Cloning', prefixIcon: 'e-custom-icons e-action-Icon-clone', id: 'Clone' },
      { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' },
      { text: 'Pivot View', tooltipText: 'Pivot View', prefixIcon: 'e-custom-icons e-action-Icon-pivot', id: 'PivotView' },
      { text: 'Map Pivot Views', tooltipText: 'Display Pivot Views On Report', prefixIcon: 'e-custom-icons e-action-Icon-datafields', id: 'MapPivotView' },
      'ExcelExport', 'PdfExport', 'CsvExport', 'Search'];

    this.Havingtoolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' },
    { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' },
    { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' },
    { text: 'Grouping Filter', tooltipText: 'Grouping Filter', prefixIcon: 'e-custom-icons e-action-Icon-Filter', id: 'Grouping_Filter' }];


    this.Columntoolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' },
    { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' },
    { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' },
      'ExcelExport', 'PdfExport', 'CsvExport', 'Search'];

    this.Parametertoolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' },
      { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' },
      { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' }]

    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    
    this.GetReportData();
    this.GetEntiesByParticipant();
   

    //Get AccessListdataSrc
    this.GetAcessListDataSource();
    this.GetUserList();
    this.GetTagList();
    this.GetCustomFunctionWithInScope();
   
  }

  UserListDataSrc: any;
  GetUserList() {
    this._UserService.ManageUsersByEntity('GProjects', this.ProjectId, 'Get', 0)
      .subscribe(
        data => {
          this.UserListDataSrc = (data);
        }
      );
  }

  TagListDataSrc: any;
  GetTagList() {
    this._service.GetTagsForReport('GProjects', this.ProjectId)
      .subscribe(
        data => {
          this.TagListDataSrc = (data);
          console.log(this.TagListDataSrc);
        }
      );
  }

  GetReportData() {
    
    this._service.GetReports(this.LoggedInRoleId, this.LoggedInUserId)
      .subscribe(
        data => {
          this.ReportData = JSON.parse(data);
        }
      );
  }

  GetAcessListDataSource() {
    
    let index = this.LoggedInRoleName.indexOf("(");
    this.RoleName = this.LoggedInRoleName.substring(0, index-1)
    if (this.RoleName == 'Project Admin')
    {
      this._RoleService.getAllRoles(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
        .subscribe(
          data => {
            this.AccessListDataSrc = data;
            
          }
        );
    }
    else
    {
      this.AccessListDataSrc = [
        { "RoleName": this.RoleName, "Id": this.LoggedInRoleId }
      ];
    }
  }

  GetCustomFunctionWithInScope() {
    
    this._service.GetCustomFunctionWithInScope(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
      .subscribe(
        data => {
          this.FunctionList = data;
        }
      );
  }

  IsFuncField: Boolean=false;
  public changeHandler(): void {
    
    if (this.radiobutton.getSelectedValue() === "No") { //means it is not a function field
      this.ShowColumnDF = true;
      this.ShowColumnFunctions = false;
      this.IsFuncField = false;
      this.ShowParameterdd = false;
    }
    else {
      this.ShowColumnDF = false;
      this.ShowColumnFunctions = true;
      this.IsFuncField = true;
    }

  }

  Action: string;
  ReportIdToBeDeleted: number;
  confirmHeader: string;
  confirmcontent: string;
  Disable: Boolean = false;
  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'ReportGrid_pdfexport') {
      this.ReportGrid.pdfExport();
    }
    if (args.item.id === 'ReportGrid_excelexport') {
      this.ReportGrid.excelExport();
    }
    if (args.item.id === 'ReportGrid_csvexport') {
      this.ReportGrid.csvExport();
    }
    if (args.item.id === 'Add') {
      this.Disable = false;
      this.ShowCreatePopup = true;
      this.ShowCreateBtn = true;
      this.ShowUpdateBtn = false;
      this.ShowHavingClauses = false;
      this.AccessRoleIdList = null;
      this.SelectedUserListData = null;
      this.SelectedTagListData = null;
      
      this.SelectedColumnsData = null;
      this.OrderBySrc = null;
      this.AccessList2DataSrc = null;
      this.SelectListJSON = null;
      this.ReportForm.patchValue({
        ReportName: null,
        DownLoadFileName: null,
        TableNames: null
      });
      this.Action = 'Add';
    }

    if (args.item.id === 'Edit') {
      
      this.ShowCreatePopup = true;
      this.ShowCreateBtn = false;
      this.ShowUpdateBtn = true;
      this.Disable = false;
      const selectedRecords = this.ReportGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No record is selected for edit";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        var CreatedByOfSelectedRpt = this.ReportData.filter(x => x.Id == selectedRecords[0]['Id'])[0].CreatedBy;
        let index = this.LoggedInRoleName.indexOf("(");
        this.RoleName = this.LoggedInRoleName.substring(0, index)
        if (CreatedByOfSelectedRpt != this.LoggedInEmail && this.RoleName != 'Project Admin') {
          this.toasts[3].content = "Selected Report is not created by you. So you can not Edit this Report. Please contact to Project Admin.";
          this.toastObj.show(this.toasts[3]);
          return;
        }
       
       
        this.GetReportById(selectedRecords[0]['Id']);
        this.Action = 'Edit';
      }

    }

   
    if (args.item.id === 'Review') {
      
     
      const selectedRecords = this.ReportGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No record is selected for Review";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.ReportForm.disable();
        this.Disable = true;
        this.ShowCreatePopup = true;
        this.ShowCreateBtn = false;
        this.ShowUpdateBtn = true;
       
        this.GetReportById(selectedRecords[0]['Id']);
        this.Action = 'Review';
      }

    }

    if (args.item.id === 'Clone') {
      

      this.Disable = false;
      const selectedRecords = this.ReportGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No record is selected for edit";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.ShowCreatePopup = true;
        this.ShowCreateBtn = true;
        this.ShowUpdateBtn = false;

        this.GetReportById(selectedRecords[0]['Id']);
        this.Action = 'Clone';
      }

    }

    if (args.item.id === 'PivotView') {
      
      const selectedRecords = this.ReportGrid.getSelectedRecords();

      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No record is selected for delete";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.SelectedReportId = selectedRecords[0]['Id'];//need this to open Pivot View
        this.openPivotScreenPopUp = true;
      }
    }

    if (args.item.id === 'MapPivotView') {
      
      const selectedRecords = this.ReportGrid.getSelectedRecords();

      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No record is selected for Mapping Pivot Views";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.SelectedReportId = selectedRecords[0]['Id'];//need this to open Pivot View
        this.openReportPivotViewPopUp = true;
      }
    }

    if (args.item.id === 'Delete') {
      
      const selectedRecords = this.ReportGrid.getSelectedRecords();

      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No record is selected for delete";
        this.toastObj.show(this.toasts[3]);
      }
      else {

        var CreatedByOfSelectedRpt = this.ReportData.filter(x => x.Id == selectedRecords[0]['Id'])[0].CreatedBy;
        let index = this.LoggedInRoleName.indexOf("(");
        this.RoleName = this.LoggedInRoleName.substring(0, index)
        if (CreatedByOfSelectedRpt != this.LoggedInEmail && this.RoleName != 'Project Admin') {
          this.toasts[3].content = "Selected Report is not created by you. So you can not Delete this Report. Please contact to Project Admin.";
          this.toastObj.show(this.toasts[3]);
          return;
        }
        this.ReportIdToBeDeleted = selectedRecords[0]['Id'];
        this.confirmHeader = "Please confirm"
        this.confirmcontent = 'Associated Notifications will also deleted. Are you sure you want to delete?'
        this.confirmDialog.show();
       
      }
    }


  }
  

  public recordDoubleClick(args): void {
    this.ShowCreatePopup = true;
    this.ShowCreateBtn = false;
    this.ShowUpdateBtn = true;
    this.GetReportById(args.rowData['Id']);
    this.Action = 'Edit';
  }

  confirmDlgYesBtnClick = (): void => {

    this._service.Delete(this.ReportIdToBeDeleted).subscribe(
      () => {
        this.toasts[1].content = "Report deleted successfully";
        this.toastObj.show(this.toasts[1]);
        this.GetReportData();
        this.ReportGrid.refresh();
        this.confirmDialog.hide();
      },
      (error: any) => console.log(error)
    );
    

  }

  confirmDlgBtnNoClick = (): void => {
    this.confirmDialog.hide();
    return;
  }
  confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmDlgYesBtnClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];

  ReportInfo: any;
  ReportId: number;
  GetReportById(ReportId) {
    
    this._service.GetReportById(ReportId)
      .subscribe(
        data => {
          console.log(data);
          
          this.ReportInfo = data;
          this.ReportId = data[0].Id;
          this.GetAllFlattenedDFsForEntity(data[0].EntityType, data[0].EntityId);

          this.TableEntityType = data[0].EntityType;
          this.TableEntityId = data[0].EntityId;

          this.SelectedColumnsData = JSON.parse(data[0].SelectListJson);

          this.OrderBySrc = JSON.parse(data[0].OrderByJson);
         
          //this.SelectList2DataSrc = JSON.parse(data[0].SelectListJson);
         // this.OrderByList2DataSrc = JSON.parse(data[0].OrderByJson);
          this.AccessList2DataSrc = JSON.parse(data[0].AccessListJson);
          this.UserList2DataSrc = JSON.parse(data[0].UserIdListJson);
          this.TagList2DataSrc = JSON.parse(data[0].TagIdListJson);
          this.HavingGridDataSrc = JSON.parse(data[0].HavingGridDataSrc);

          this.ReportForm.patchValue({
            ReportName: data[0].Name,
            DownLoadFileName: data[0].DownLoadFileName,
            Description: data[0].Description,
            TableNames:data[0].EntityId
          });
          
        }
      );
  }

  GetEntiesByParticipant() {
    
    this._DashboardService.GetEntiesByParticipant(this.LoggedInRoleId, this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
      .subscribe(
        data => {
          this.tablenames = (data);
          
        }
      );
  }

  TableEntityType: string;
  TableEntityId: number;
  public tablenamesChange(args: any): void {
    this.TableEntityType = args.itemData.EntityType;
    this.TableEntityId = args.itemData.EntityId;
    this.GetAllFlattenedDFsForEntity(args.itemData.EntityType, args.itemData.EntityId)
  }

  FlattenedRecords: any[];
  GetAllFlattenedDFsForEntity(EntityType, EntityId) {
    this._colservice.GetAllFlattenedDFsForEntity(EntityType, EntityId)
      .subscribe(
        data => {
          this.FlattenedRecords = data;
          this.Columns = data;
          this.ShowClauses = true;
        }
      );
  }

  FuncDFEntityType: string;
  FuncDFEntityId: number;
  FuncDFDataType: string;
  FuncDFFieldName: string;
  FuncDFId: number;
  public FuncDFChange(args: any): void {
    
    this.FuncDFEntityType = args.itemData.EntityType;
    this.FuncDFEntityId = args.itemData.EntityId;
    this.FuncDFDataType = args.itemData.DataType;
    this.FuncDFFieldName = args.itemData.FieldName;
    this.FuncDFId = args.itemData.DataFieldId;
    var DTValue;
    var DTIndex = this.FuncDFDataType.indexOf('(');
    if (DTIndex != -1) {
      DTValue = this.FuncDFDataType.substring(0, DTIndex);
    }
    else {
      DTValue = this.FuncDFDataType;
    }

    if (DTValue == "nvarchar") {
      this.AgreegateFunc = [{ text: 'MAX', value: 'MAX' }, { text: 'MIN', value: 'MIN' }, { text: 'COUNT', value: 'COUNT' }];
    }
    else if ((DTValue == "int") || (DTValue == "numeric")) {
      this.AgreegateFunc = [{ text: 'AVG', value: 'AVG' }, { text: 'COUNT', value: 'COUNT' }, { text: 'MAX', value: 'MAX' }, { text: 'MIN', value: 'MIN' }, { text: 'SUM', value: 'SUM' }];
    }

    else if (DTValue == "bit") {
      this.AgreegateFunc = [{ text: 'COUNT', value: 'COUNT' }];
    }

    else if (DTValue == "datetime") {
      this.AgreegateFunc = [{ text: 'COUNT', value: 'COUNT' }, { text: 'MAX', value: 'MAX' }, { text: 'MIN', value: 'MIN' }];
   }

    else if (DTValue == "date") {
      this.AgreegateFunc = [{ text: 'COUNT', value: 'COUNT' }, { text: 'MAX', value: 'MAX' }, { text: 'MIN', value: 'MIN' }];
    }

  }

  
  HavingGridDataSrc: any = [];
  SaveFuncFields() {
    

    //In edit mode, if source is blank then this.HavingGridDataSrc is null and pushing value is throwing error.
    // so if it is null then we have to intialize it with blank array.
    if (this.HavingGridDataSrc == null) {
      this.HavingGridDataSrc = [];
    }

    if (this.HavingClauseForm.get('ColumnName').value != undefined
      && this.HavingClauseForm.get('ColumnName').value != null
      && this.HavingClauseForm.get('ColumnName').value != "") {
      this.HavingGridDataSrc.push({
        EntityType: this.FuncDFEntityType,
        EntityId: this.FuncDFEntityId,
        FieldName: this.HavingClauseForm.get('AggFuncName').value + '(' + this.FuncDFFieldName + ')',
        //DataFieldId: this.HavingClauseForm.get('ColumnName').value,
        DataFieldId: this.FuncDFId,
        AggFunc: this.HavingClauseForm.get('AggFuncName').value,
        DataType: this.FuncDFDataType,
        Label: this.HavingClauseForm.get('Label').value
      });
      this.HavingGrid.refresh();
    }
    else {
      this.toasts[3].content = "No field is selected to add";
      this.toastObj.show(this.toasts[3]);
    }
    this.ShowHavingCreatePopup = false;
  }

  UpdateFuncFields() {
    
    let ItemIndex = this.HavingGridDataSrc.findIndex(item => item.DataFieldId === this.HavingClauseForm.get('ColumnName').value);
    this.HavingGridDataSrc[ItemIndex]['AggFunc'] = this.HavingClauseForm.get('AggFuncName').value;
    this.HavingGridDataSrc[ItemIndex]['Label'] = this.HavingClauseForm.get('Label').value;

    //Update field Name also because we are updating AggFunc
    var FieldNameArr = this.HavingGridDataSrc[ItemIndex]['FieldName'].split('(');
    this.HavingGridDataSrc[ItemIndex]['FieldName'] = this.HavingClauseForm.get('AggFuncName').value + '(' + FieldNameArr[1] + ')';
    this.HavingGrid.refresh();
    this.ShowHavingCreatePopup = false;
    this.toasts[1].content = "Record updated successfully";
    this.toastObj.show(this.toasts[1]);
  }

  GroupByClause: string;
  ExpressionVal: string;
  onTabSelect(args: SelectEventArgs) {
    
  
    let TabIndex = args.selectedIndex;

    let TabPreviousIndex = args.previousIndex;
    
    if (TabIndex == 1 || TabIndex == 2 || TabIndex == 3 || TabIndex == 4) {
      if (this.TableEntityType == null || this.TableEntityType == undefined || this.TableEntityType == "") {
        this.toasts[3].content = "Select Source Table from Report Tab";
        this.toastObj.show(this.toasts[3]);
        this.TabObject.selectedItem = TabPreviousIndex;
        return;
      }
    }

    if (TabIndex == 2) {
      this.GetParametersData();
    }

    if (TabIndex == 3 && this.Action== 'Edit') {
      this.ExpressionVal = this.ReportInfo[0].WhereClause;
      this.ShowClauses = true;
    }
    if (TabIndex == 4) {
      
      this.ShowHavingCreatePopup = false;
      
     
    }
    if (TabIndex == 4 && this.Action == 'Edit') {
      this.ExpressionVal = this.ReportInfo[0].HavingClause;
      
    }
    

  }

  ShowHavingCreatePopup: Boolean = false;
  Enabled: Boolean = false;
  ShowGroupingCreateBtn: Boolean = false;
  ShowGroupingUpdateBtn: Boolean = false;
  HavingtoolbarClick(args: ClickEventArgs): void {
   
    if (args.item.id === 'Add') {
      this.ShowHavingCreatePopup = true;
      this.ShowGroupingCreateBtn = true;
      this.ShowGroupingUpdateBtn = false;
     
      this.Enabled = true;
      this.HavingClauseForm.patchValue({
        ColumnName: null,
        AggFuncName: null,
        Label: null
      });
    }

    if (args.item.id === 'Edit') {
      

      
      this.ShowGroupingCreateBtn = false;
      this.ShowGroupingUpdateBtn = true;
      const selectedRecords = this.HavingGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No record is selected for edit";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.ShowHavingCreatePopup = true;
        let ItemIndex = this.HavingGridDataSrc.findIndex(item => item.DataFieldId === selectedRecords[0]['DataFieldId']);
        this.HavingClauseForm.patchValue({
          ColumnName: this.HavingGridDataSrc[ItemIndex]['DataFieldId'],
          AggFuncName: this.HavingGridDataSrc[ItemIndex]['AggFunc'],
          Label: this.HavingGridDataSrc[ItemIndex]['Label']
        });
        this.Enabled = false;
      }

    }

    if (args.item.id === 'Delete') {
      
      const selectedRecords = this.HavingGrid.getSelectedRecords();

      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No record is selected for delete";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        let ItemIndex = this.HavingGridDataSrc.findIndex(item => item.DataFieldId === selectedRecords[0]['DataFieldId']);
        if (ItemIndex !== -1) {
          this.HavingGridDataSrc.splice(ItemIndex, 1);
        } 
        this.HavingGrid.refresh();
        this.toasts[1].content = "Record deleted successfully";
        this.toastObj.show(this.toasts[1]);
      }
    }

    if (args.item.id === 'Grouping_Filter') {
      
      this.DataJSON = JSON.stringify(this.HavingGridDataSrc);
      this.ShowHavingClauses = true;
    }
  }


  WhereClause: string = '';
  ReportParamJson: string;
  PostWhereClauseEvent(val) {
    
    this.WhereClause = val.WhereExpression;
    this.ReportParamJson = val.ReportParamJson;
  }

  HavingClause: string='';
  PostHavingClauseEvent(val) {
    
    this.HavingClause = val.Expression;
  }

  submitted: Boolean = false;
  Save() {
    
   this.submitted = true;

    var selectData;
    //if (this.Selectlistbox2 != undefined) {
    //  selectData = this.Selectlistbox2.getDataList();
    //}
    //else {
    //  selectData = this.SelectList2DataSrc;
    //}

    if (this.ColumnsGrid != undefined) {
      selectData = this.ColumnsGrid.dataSource;
    }
    else {
      selectData = this.SelectedColumnsData;
    }


    if (this.ReportForm.invalid) {
      return;
    }
    else if (selectData == undefined) {
      this.toastObj.timeOut = 3000;
      this.toasts[3].content = "Column list can not be blank";
      this.toastObj.show(this.toasts[3]);
      return;
    }
    else if (selectData.length == 0)
    {
      this.toastObj.timeOut = 3000;
      this.toasts[3].content = "Column list can not be blank";
      this.toastObj.show(this.toasts[3]);
      return;
    }
    else {
      this.GetSelectAndGroupByClause();

      this.GetOrderByClause();

      this.GetAccessRoleList();

      this.GetSelectedUserList();

      this.GetSelectedTags();

      //if (this.WhereClause == '') {

      //  this.WhereClause = 'where 1=1';
      //}

      this.ReportModel.Name = this.ReportForm.get('ReportName').value;
      this.ReportModel.DownloadFileName = this.DownLoadFileName.value;
      this.ReportModel.Description = this.ReportForm.get('DownLoadFileName').value;
      this.ReportModel.EntityType = this.TableEntityType;
      this.ReportModel.EntityId = this.TableEntityId;
      this.ReportModel.WhereClause = this.WhereClause;
      this.ReportModel.HavingClause = this.HavingClause;
      this.ReportModel.AggFuncDataJson = this.DataJSON;
      /*this.ReportModel.SelectClause = this.SelectColList;*/
      this.ReportModel.SelectClause = JSON.stringify(this.SelectListJSON);
      this.ReportModel.OrderByClause = JSON.stringify(this.OrderByListJSON);//this.OrderByString;
      this.ReportModel.GroupByClause = this.GroupByClause;
      this.ReportModel.SortOrder = "";//"asc";
      if (this.AccessRoleIdList == null) {
        this.AccessRoleIdList = "";
      }
      this.ReportModel.AccessRoleIdList = this.AccessRoleIdList;
      if (this.SelectedUserListData == null) {
        this.SelectedUserListData = "";
      }
      this.ReportModel.UserIdList = this.SelectedUserListData;

      if (this.SelectedTagListData == null) {
        this.SelectedTagListData = "";
      }
      this.ReportModel.TagIdList = this.SelectedTagListData;
      this.ReportModel.CreatedById = this.LoggedInUserId;
      this.ReportModel.CreatedByRoleId = this.LoggedInRoleId;
      this.ReportModel.UpdatedById = this.LoggedInUserId;
      this.ReportModel.UpdatedByRoleId = this.LoggedInRoleId;
      this.ReportModel.ScopeEntityType = this.LoggedInScopeEntityType;
      this.ReportModel.ScopeEntityId = this.LoggedInScopeEntityId;
      this.ReportModel.ReportParamJson = this.ReportParamJson;

      this._service.Save(this.ReportModel).subscribe(
        (data: string) => {
          let MsgPrefix: string = data.substring(0, 2);
          let Showmsg: string = data.substring(2, data.length);
          if (MsgPrefix == 'S:') {//Means success
            this.toastObj.timeOut = 3000;
            this.toasts[1].content = Showmsg.split('|')[0];
            this.toastObj.show(this.toasts[1]);
          }
          else if (MsgPrefix == 'I:') {//Information message
            this.toastObj.timeOut = 3000;
            this.toasts[3].content = Showmsg;
            this.toastObj.show(this.toasts[3]);
          }
          else if (MsgPrefix == 'W:') {//Warning Message
            this.toastObj.timeOut = 3000;
            this.toasts[0].content = Showmsg;
            this.toastObj.show(this.toasts[0]);
          }
          else {//Error Message
            this.toastObj.timeOut = 0;
            this.toasts[2].content = Showmsg;
            this.toastObj.show(this.toasts[2]);
          }
          this.ShowCreatePopup = false;
          //this.GetReportData();
          //this.ReportGrid.refresh();
          setTimeout(() => { window.location.reload(); }, 3000);
        },
        (error: any) => {
          this.toastObj.timeOut = 0;
          this.toasts[2].content = error.error['Message'];
          this.toastObj.show(this.toasts[2]);
        } 
      );
    }
  }

  Update() {
    

    var selectData;
    //if (this.Selectlistbox2 != undefined) {
    //  selectData = this.Selectlistbox2.getDataList();
    //}
    //else {
    //  selectData = this.SelectList2DataSrc;
    //}
    if (this.ColumnsGrid != undefined) {
      selectData = this.ColumnsGrid.dataSource;
    }
    else {
      selectData = this.SelectedColumnsData;
    }

    if (this.ReportForm.invalid) {
      return;
    }
    else if (selectData == undefined) {
      this.toastObj.timeOut = 3000;
      this.toasts[3].content = "Select clause can not be blank";
      this.toastObj.show(this.toasts[3]);
      return;
    }
    else if (selectData.length == 0) {
      this.toastObj.timeOut = 3000;
      this.toasts[3].content = "Select clause can not be blank";
      this.toastObj.show(this.toasts[3]);
      return;
    }
    else {
      this.GetSelectAndGroupByClause();

      this.GetOrderByClause();

      this.GetAccessRoleList();

      this.GetSelectedUserList();

      this.GetSelectedTags();

      this.ReportModel.Id = this.ReportInfo[0].Id;
      this.ReportModel.Name = this.ReportForm.get('ReportName').value;
      this.ReportModel.DownloadFileName = this.ReportForm.get('DownLoadFileName').value;
      this.ReportModel.Description = this.ReportForm.get('Description').value;
      this.ReportModel.EntityType = this.TableEntityType;
      this.ReportModel.EntityId = this.TableEntityId;

      //It might possible that at the time of updation user did not make any change in Where clause and having clause
      //so we need to populate it with old value(Note: It is also possible that old value is alos blank)
      if (this.WhereClause == "") {
        this.ReportModel.WhereClause = this.ReportInfo[0].WhereClause;
      }
      else {
        this.ReportModel.WhereClause = this.WhereClause;
      }

      if (this.HavingClause == "") {
        this.ReportModel.HavingClause = this.ReportInfo[0].HavingClause;
      }
      else {
        this.ReportModel.HavingClause = this.HavingClause;
      }

      if (this.DataJSON == "") {
        if (this.ReportInfo[0].HavingGridDataSrc == null) {
          this.ReportModel.AggFuncDataJson = "";
        }
        else { this.ReportModel.AggFuncDataJson = this.ReportInfo[0].HavingGridDataSrc;}
       
      }
      else {
        this.ReportModel.AggFuncDataJson = this.DataJSON;
      }
      /*this.ReportModel.SelectClause = this.SelectColList;*/
      this.ReportModel.SelectClause = JSON.stringify(this.SelectListJSON);
      this.ReportModel.OrderByClause = JSON.stringify(this.OrderByListJSON);//this.OrderByString;
      this.ReportModel.GroupByClause = this.GroupByClause;
      this.ReportModel.SortOrder = "";//"asc";
      this.ReportModel.AccessRoleIdList = this.AccessRoleIdList;
      this.ReportModel.UserIdList = this.SelectedUserListData;
      this.ReportModel.TagIdList = this.SelectedTagListData;
      this.ReportModel.CreatedById = this.LoggedInUserId;
      this.ReportModel.CreatedByRoleId = this.LoggedInRoleId;
      this.ReportModel.UpdatedById = this.LoggedInUserId;
      this.ReportModel.UpdatedByRoleId = this.LoggedInRoleId;
      this.ReportModel.ScopeEntityType = this.LoggedInScopeEntityType;
      this.ReportModel.ScopeEntityId = this.LoggedInScopeEntityId;

      this._service.Update(this.ReportModel).subscribe(
        (data: string) => {
          let MsgPrefix: string = data.substring(0, 2);
          let Showmsg: string = data.substring(2, data.length);
          if (MsgPrefix == 'S:') {//Means success
            this.toasts[1].content = Showmsg.split('|')[0];
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
          this.ShowCreatePopup = false;
         //this.GetReportData();
          //this.ReportGrid.refresh();
          setTimeout(() => { window.location.reload(); }, 3000);
        },
        (error: any) => {
          this.toastObj.timeOut = 0;
          this.toasts[2].content = error.error['Message'];
          this.toastObj.show(this.toasts[2]);
        } 
      );
    }
  }

  

  AccessRoleIdList: string='';
  GetAccessRoleList() {
    this.AccessRoleIdList = '';
    var AccessRoleData;
    if (this.Accesslistbox2 != undefined) {
      AccessRoleData = this.Accesslistbox2.getDataList();
    }
    else {
      AccessRoleData = this.AccessList2DataSrc;
    }


    if (AccessRoleData != null && AccessRoleData.length != 0) {
      for (let i = 0; i < AccessRoleData.length; i++) {
        this.AccessRoleIdList = this.AccessRoleIdList + AccessRoleData[i]['Id'] + ',';
      }
      this.AccessRoleIdList = this.AccessRoleIdList.substring(0, this.AccessRoleIdList.length - 1);
    }
  }


  SelectedUserListData: string = '';
  GetSelectedUserList() {
    var SelectedUserData;
    this.SelectedUserListData = '';
    if (this.Userlistbox2 != undefined) {
      SelectedUserData = this.Userlistbox2.getDataList();
    }
    else {
      SelectedUserData = this.UserList2DataSrc;
    }
    if (SelectedUserData != null && SelectedUserData.length != 0) {
      for (let i = 0; i < SelectedUserData.length; i++) {
        this.SelectedUserListData = this.SelectedUserListData + SelectedUserData[i]['UserId'] + ',';
      }
      this.SelectedUserListData = this.SelectedUserListData.substring(0, this.SelectedUserListData.length - 1);
    }
  }

  SelectedTagListData: string = '';
  GetSelectedTags() {
    this.SelectedTagListData = '';
    var SelectedTagData;
    if (this.Taglistbox2 != undefined) {
      SelectedTagData = this.Taglistbox2.getDataList();
    }
    else {
      SelectedTagData = this.TagList2DataSrc
    }

    if (SelectedTagData != null && SelectedTagData.length != 0) {
      for (let i = 0; i < SelectedTagData.length; i++) {
        this.SelectedTagListData = this.SelectedTagListData + SelectedTagData[i]['Id'] + ',';
      }
      this.SelectedTagListData = this.SelectedTagListData.substring(0, this.SelectedTagListData.length - 1);
    }
  }

  DataJSON: string='';

  //----------------------------------------------Select List CRUD code------------------------------------
  ShowSelectCreatePopup: Boolean = false;
  ShowSelectClauseCreateBtn: Boolean = true;
  ShowSelectClauseUpdateBtn: Boolean = false;
  ColIdForEdit: number;
  ColumntoolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'ColumnsGrid_pdfexport') {
      this.ColumnsGrid.pdfExport();
    }
    if (args.item.id === 'ColumnsGrid_excelexport') {
      this.ColumnsGrid.excelExport();
    }
    if (args.item.id === 'ColumnsGrid_csvexport') {
      this.ColumnsGrid.csvExport();
    }
    if (args.item.id === 'Add') {

      this.ShowSelectCreatePopup = true;
      this.ShowSelectClauseCreateBtn = true;
      this.ShowSelectClauseUpdateBtn= false;


      this.NoFFChecked = true;
      this.YesFFChecked = false;
      this.ShowColumnDF = true;
      this.ShowColumnFunctions = false;
      this.ShowParameterdd = false;
      
      this.SelectClauseForm.reset();
      
      
      //this.SelectClauseForm.patchValue({
      //  SelectListColumnName: null,
      //  SelectListColumnLabel: null,
      //  FuncColumnName: null,
      //  Width:null
      //});

    }

    if (args.item.id === 'Edit') {
      
      const selectedRecords = this.ColumnsGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No record is selected for edit";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        if (this.DropdownArr != undefined) {
          this.DropdownArr = null;
        }
        this.ShowSelectCreatePopup = true;
        this.ShowSelectClauseCreateBtn = false;
        this.ShowSelectClauseUpdateBtn = true;
        this.ColIdForEdit = selectedRecords[0]['Id'];
        if (selectedRecords[0]['IsFuncField'] == false)//means it is a normal datafield 
        {
          this.NoFFChecked = true;
          this.YesFFChecked = false;
          this.ShowColumnFunctions = false;
          this.ShowParameterdd = false;
          this.ShowColumnDF = true;
          let ItemIndex = this.SelectedColumnsData.findIndex(item => item.Id === selectedRecords[0]['Id']);
          this.SelectClauseForm.patchValue({
            SelectListColumnName: this.SelectedColumnsData[ItemIndex]['FieldName'],
            SelectListColumnLabel: this.SelectedColumnsData[ItemIndex]['Label']
            //CastValue: this.SelectedColumnsData[ItemIndex]['Cast']
          });
        }
        else//means it is a function datafield
        {
          this.NoFFChecked = false;
          this.YesFFChecked = true;
          this.ShowColumnFunctions = true;
          this.ShowParameterdd = true;
          this.ShowColumnDF = false;
         
          this.CustomFuncId = selectedRecords[0]['DataFieldId'];
          this.GetCustomFunctionParameters();
          let ItemIndex = this.SelectedColumnsData.findIndex(item => item.Id === selectedRecords[0]['Id']);
          this.SelectClauseForm.patchValue({
            FuncColumnName: this.SelectedColumnsData[ItemIndex]['DataFieldId'],
            SelectListColumnLabel: this.SelectedColumnsData[ItemIndex]['Label']
            //CastValue: this.SelectedColumnsData[ItemIndex]['Cast']
          });
        }

      }

    }

    if (args.item.id === 'Delete') {
      
      const selectedRecords = this.ColumnsGrid.getSelectedRecords();

      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No record is selected for delete";
        this.toastObj.show(this.toasts[3]);
      }
      else {

        let ItemIndex = this.SelectedColumnsData.findIndex(item => item.Id === selectedRecords[0]['Id']);
        if (ItemIndex !== -1) {
          this.SelectedColumnsData.splice(ItemIndex, 1);
        }
        this.ColumnsGrid.refresh();
        this.toasts[1].content = "Record deleted successfully";
        this.toastObj.show(this.toasts[1]);
      }
    }


  }

  SelectedColumnFieldName: string;
  SelectedDataFieldId: number;
  SelectDFChange(args: any): void {
    
    this.SelectedColumnFieldName = args.itemData.FieldName;
    this.SelectedDataFieldId = args.itemData.DataFieldId;
    var splittedFields = args.itemData.FieldName.split('] ');
    let lbl = splittedFields[splittedFields.length - 1];
    this.SelectClauseForm.patchValue({
      SelectListColumnLabel: lbl
    });
  }

  CustomFuncId: number;
  CustomFuncLabel: string;
  CustomFunctionName: string;
  ShowParameterdd: Boolean = false;
  SelectFuncChange(args: any): void {
    
    this.CustomFuncId = args.itemData.Id;
    this.CustomFuncLabel = args.itemData.Label;
    this.CustomFunctionName = args.itemData.Name;
    this.ShowParameterdd = true;
    this.DropdownArr = [];
    this.GetCustomFunctionParameters();
  }

  ParameterDFChange(Index: number, args: any): void {
    
    //this.ParamValueArray[Index]["ParamValue"] = args.itemData.value;
    this.ParamValueArray[Index] = args.itemData.value;
    this.ReportParametersModel.EntityType = args.itemData.EntityType;
  }

  DropdownArr: any[];
  ParamValueArray: any = [];
 
  GetCustomFunctionParameters() {
    
    this._service.GetCustomFunctionParameters(this.CustomFuncId, this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
      .subscribe(
        (CustomParamdata: any) => {
          //maintain a blank array here of CustomParamdata.length size, later we will push parameter value on same index in this array
          this.ParamValueArray = new Array<string>(CustomParamdata.length);

          for (let i = 0; i < CustomParamdata.length; i++) {
            if (CustomParamdata[i].IsUserProvided == 1)//it will become dropdown in front end
            {
              this.DropdownArr.push({ DataSource: JSON.parse(CustomParamdata[i].ParameterData), Index: i })
              this.SelectClauseForm.addControl('param_' + i, this.formBuilder.control(''));
              //this.ParamValueArray[i] = { Id: CustomParamdata[i].Id, UserProvided: true}
            }
            else//no need of dropdown
            {
              //this.ParamValueArray[i] = { Id: CustomParamdata[i].Id, UserProvided: false, ParamValue: CustomParamdata[i].ParameterData}
              this.ParamValueArray[i] = CustomParamdata[i].ParameterData;
            }
          }
          
      });
  }

  SelectedColumnsData: any;
  CustFuncGridCount: number = -1;
  SaveSelectColumn() {
    

    //if (this.SelectClauseForm.invalid) {
    //  return;
    //}


    if (this.SelectedColumnsData == null) {
      this.SelectedColumnsData = [];
    }

    if (this.SelectedColumnsData == undefined) {
      this.SelectedColumnsData = [];
    }

    if (this.SelectClauseForm.get('SelectListColumnName').value != undefined
      && this.SelectClauseForm.get('SelectListColumnName').value != null
      && this.SelectClauseForm.get('SelectListColumnName').value != "" && this.IsFuncField == false) {
      this.SelectedColumnsData.push({
        //DataFieldId: this.SelectClauseForm.get('SelectListColumnName').value,
        Id: this.CustFuncGridCount,
        DataFieldId: this.SelectedDataFieldId,
        Label: this.SelectClauseForm.get('SelectListColumnLabel').value,
        FieldName: this.SelectedColumnFieldName,
        IsFuncField: false,
        Type: 'DataField'
       });
      }
     else if (this.SelectClauseForm.get('FuncColumnName').value != undefined
        && this.SelectClauseForm.get('FuncColumnName').value != null
      && this.SelectClauseForm.get('FuncColumnName').value != "" && this.IsFuncField == true) {
      //this.PrepareCustomFuncParamJson();
      this.CustomFunctionParametersList = this.ParamValueArray.join(',');
      this.SelectedColumnsData.push({
        Id: this.CustFuncGridCount,
          DataFieldId: this.SelectClauseForm.get('FuncColumnName').value,
          Label: this.SelectClauseForm.get('SelectListColumnLabel').value,
          FieldName: this.CustomFuncLabel,
          FunctionName: this.CustomFunctionName,
          IsFuncField: true,
        CustomFunctionParametersList: this.CustomFunctionParametersList,
        Type:'Custom Function'
          //CommaSeperatedParametersList: this.CommaSeperatedParametersList
        });

      //here also prepare parameter list
      }
   else {
      this.toasts[3].content = "No field is selected to add";
      this.toastObj.show(this.toasts[3]);
    }
    this.CustFuncGridCount = this.CustFuncGridCount + (-1);
    this.ColumnsGrid.refresh();
    this.ShowSelectCreatePopup = false;

  }

  //CustomFuncParamJson: any;
  //CommaSeperatedParametersList: string="";
  //PrepareCustomFuncParamJson() {
  //  //{"UserProvided":  [{"Period Name":{"Operator":"like","value1":"2021-04"}},  {"Department":{"Operator":"in","value1":"Finance,IT"}}  ],
  //  //"Fixed": [{ "@UserId": 7253, "@RoleId": 8, "@EntityType": "GProjects", "@EntityId": 10152 }]}
  //  //this.CustomFuncParamJson = { "UserProvided": [{"1":"6"}],"Fixed": [{ "2": "#Txn#.CreatedById", "3": "#Txn#.CreatedByRoleId"}]}
  //  var UserProvidedJson = "";
  //  var FixedJson = ""
  //  for (let i = 0; i < this.ParamValueArray.length; i++) {
  //    this.CommaSeperatedParametersList = this.CommaSeperatedParametersList + this.ParamValueArray[i]["ParamValue"] + ",";
  //    if (this.ParamValueArray[i]["UserProvided"] == true) {
  //      UserProvidedJson = UserProvidedJson + '{"' + this.ParamValueArray[i]["Id"] + '":"' + this.ParamValueArray[i]["ParamValue"] + '","Ordinal":' + i+1 + '},'
  //    }
  //    else {
  //      FixedJson = FixedJson + '{"' + this.ParamValueArray[i]["Id"] + '":"' + this.ParamValueArray[i]["ParamValue"] + '","Ordinal":' + i+1 + '},'
  //    }
  //  }

  //  if (UserProvidedJson != "") {
  //    UserProvidedJson = UserProvidedJson.substring(0, UserProvidedJson.length - 1)
  //    this.CustomFuncParamJson = '{"UserProvided": [' + UserProvidedJson + ']';
  //  }
  //  else {
  //    this.CustomFuncParamJson = '{"UserProvided": []';
  //  }
  //  if (FixedJson != "") {
  //    FixedJson = FixedJson.substring(0, FixedJson.length - 1)
  //    this.CustomFuncParamJson = this.CustomFuncParamJson + ',"Fixed": [' + FixedJson + ']';
  //  }

  //  if (this.CustomFuncParamJson != "") {
  //    this.CustomFuncParamJson = this.CustomFuncParamJson + "}";
  //  }

  //  if (this.CommaSeperatedParametersList != "") {
  //    this.CommaSeperatedParametersList = this.CommaSeperatedParametersList.substring(0, this.CommaSeperatedParametersList.length - 1)
  //  }
    
  //}

  UpdateSelectColumn() {
  
    //let ItemIndex = this.SelectedColumnsData.findIndex(item => item.DataFieldId === this.SelectClauseForm.get('SelectListColumnName').value);

    let ItemIndex = this.SelectedColumnsData.findIndex(item => item.DataFieldId === this.ColIdForEdit);
    this.SelectedColumnsData[ItemIndex]['Label'] = this.SelectClauseForm.get('SelectListColumnLabel').value;
   
    //this.SelectedColumnsData[ItemIndex]['Cast'] = this.SelectClauseForm.get('CastValue').value;
    this.ColumnsGrid.refresh();
    this.ShowSelectCreatePopup = false;
    this.toasts[1].content = "Record updated successfully";
    this.toastObj.show(this.toasts[1]);
  }

  SelectListJSON: any=[];
  GetSelectAndGroupByClause() {
    
    this.SelectColList = "";
    var selectData;
   
    this.SelectListJSON = [];

    if (this.ColumnsGrid == undefined) {
      selectData = this.SelectedColumnsData;
    }
    else {
      selectData = this.ColumnsGrid.dataSource;
    }
   
    if (selectData != undefined) {
      for (let i = 0; i < selectData.length; i++) {

        let Label = selectData[i]['Label'];
        let DataFieldId = selectData[i]['DataFieldId'];
        let str;
        let entityText = "";
        if (selectData[i]['IsFuncField'] == true) {//means Column is a Function
          str = selectData[i]['FunctionName'];
          entityText = str + "(" + selectData[i]['CustomFunctionParametersList'] + ")";

        }
        else {//means Column is a DataField
          str = selectData[i]['FieldName'];
          entityText = str.replaceAll("] ", "].");
          entityText = "{" + entityText + "}";
        }
        
       


        this.SelectListJSON.push({
          DataFieldId: DataFieldId,
          FieldName: entityText,
          Label: Label,
          IsFuncField: selectData[i]['IsFuncField'],
          CustomFunctionParametersList: selectData[i]['CustomFunctionParametersList']
         /* CustomFunctionParametersList: selectData[i]['CommaSeperatedParametersList']*/
        });
        this.SelectColList = this.SelectColList + entityText + ",";
       

      }

      this.SelectColList = this.SelectColList.substring(0, this.SelectColList.length - 1);
      this.GroupByClause = 'group by ' + this.SelectColList;
    }

    let ActualFuncFieldVals = '';
    if (this.HavingGridDataSrc != null && this.HavingGridDataSrc.length != 0) {

      for (let i = 0; i < this.HavingGridDataSrc.length; i++) {

        let HavingEntityText = this.HavingGridDataSrc[i]['FieldName'].replaceAll("] ", "].");
        HavingEntityText = HavingEntityText.replace('(', '({');
        HavingEntityText = HavingEntityText.replace(')', '})');

        this.SelectListJSON.push({
          DataFieldId: this.HavingGridDataSrc[i]['DataFieldId'],
          FieldName: HavingEntityText,
          Label: this.HavingGridDataSrc[i]['Label'],
          AggFunc: this.HavingGridDataSrc[i]['AggFunc']
        });


      }

    }
    else {//In case of no Aggregate column, we don't need grouping
      this.GroupByClause = "";
    }
   
  }



  //---------------------------------------------------------------------------------------

  //---------------------------------------------Order By CRUD code---------------------------------
  ShowOrderByPopup: Boolean = false;
  ShowOrderByCreateBtn: Boolean = true;
  ShowOrderByUpdateBtn: Boolean = false;
  OrderBybarClick(args: ClickEventArgs): void {
    if (args.item.id === 'OrderByGrid_pdfexport') {
      this.ColumnsGrid.pdfExport();
    }
    if (args.item.id === 'OrderByGrid_excelexport') {
      this.ColumnsGrid.excelExport();
    }
    if (args.item.id === 'OrderByGrid_csvexport') {
      this.ColumnsGrid.csvExport();
    }
    if (args.item.id === 'Add') {

      this.ShowOrderByPopup = true;
      this.ShowOrderByCreateBtn = true;
      this.ShowOrderByUpdateBtn = false;

      this.OrderByForm.patchValue({
        ColumnName: null,
        Order: null
      });

    }

    if (args.item.id === 'Edit') {
      
      const selectedRecords = this.OrderByGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No record is selected for edit";
        this.toastObj.show(this.toasts[3]);
      }
      else {

        this.ShowOrderByPopup = true;
        this.ShowOrderByCreateBtn = false;
        this.ShowOrderByUpdateBtn = true;


        let ItemIndex = this.OrderBySrc.findIndex(item => item.DataFieldId === selectedRecords[0]['DataFieldId']);
        this.OrderByForm.patchValue({
          ColumnName: this.OrderBySrc[ItemIndex]['DataFieldId'],
          Order: this.OrderBySrc[ItemIndex]['OrderBy']
        });
       
      }

    }

    if (args.item.id === 'Delete') {
      
      const selectedRecords = this.OrderByGrid.getSelectedRecords();

      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No record is selected for delete";
        this.toastObj.show(this.toasts[3]);
      }
      else {

        let ItemIndex = this.OrderBySrc.findIndex(item => item.DataFieldId === selectedRecords[0]['DataFieldId']);
        if (ItemIndex !== -1) {
          this.OrderBySrc.splice(ItemIndex, 1);
        }
        this.OrderByGrid.refresh();
        this.toasts[1].content = "Record deleted successfully";
        this.toastObj.show(this.toasts[1]);
      }
    }
  }


  SelectedOrderByColumnFieldName: string;
  IsSortColumnIsFunc: Boolean;
  CustomFunctionParametersList: string;
  SortFieldLabel: string;
  OrderByDFChange(args: any): void {
    
    this.IsSortColumnIsFunc = args.itemData.IsFuncField;
    this.SelectedOrderByColumnFieldName = args.itemData.FieldName;
    this.SortFieldLabel = args.itemData.Label;
    this.CustomFunctionParametersList = args.itemData.CustomFunctionParametersList;
  }


  OrderBySrc: any;
  SaveOrderByColumn() {
    
    if (this.OrderBySrc == null) {
      this.OrderBySrc = [];
    }

    if (this.OrderBySrc == undefined) {
      this.OrderBySrc = [];
    }

    if (this.OrderByForm.get('ColumnName').value != undefined
      && this.OrderByForm.get('ColumnName').value != null
      && this.OrderByForm.get('ColumnName').value != "") {
      this.OrderBySrc.push({
        DataFieldId: this.OrderByForm.get('ColumnName').value,
        OrderBy: this.OrderByForm.get('Order').value,
        FieldName: this.SelectedOrderByColumnFieldName,
        Label: this.SortFieldLabel,
        IsFuncField: this.IsSortColumnIsFunc,
        CustomFunctionParametersList: this.CustomFunctionParametersList
      });
      this.OrderByGrid.refresh();
    }
    else {
      this.toasts[3].content = "No field is selected to add";
      this.toastObj.show(this.toasts[3]);
    }
    this.ShowOrderByPopup = false;
  }


  UpdateOrderByColumn() {
    
    let ItemIndex = this.OrderBySrc.findIndex(item => item.DataFieldId === this.OrderByForm.get('ColumnName').value);
    this.OrderBySrc[ItemIndex]['OrderBy'] = this.OrderByForm.get('Order').value;
    this.OrderByGrid.refresh();
    this.ShowOrderByPopup = false;
    this.toasts[1].content = "Record updated successfully";
    this.toastObj.show(this.toasts[1]);
  }

  OrderByListJSON: any;
  GetOrderByClause() {
    
    var OrderByData=null;
    this.OrderByListJSON = [];
    if (this.OrderByGrid == undefined) {
      OrderByData = this.OrderBySrc;
    }
    else {
      OrderByData = this.OrderByGrid.dataSource;
    }

    if (OrderByData != null) {

      for (let i = 0; i < OrderByData.length; i++)
      {

        let Order = OrderByData[i]['OrderBy'];
        let str = OrderByData[i]['FieldName'];
        let DataFieldId = OrderByData[i]['DataFieldId'];
        let IsFuncField = OrderByData[i]['IsFuncField'];
        let entityText;
        if (IsFuncField == false) {
          entityText = str.replaceAll("] ", "].");
          entityText = "{" + entityText + "}";
        }
        else//means selected column is func field
        {
          let FunctionName = this.FunctionList.filter(a => a.Id == DataFieldId);
          entityText = FunctionName[0].Name + "(" + OrderByData[i]['CustomFunctionParametersList'] + ")";
        }


        this.OrderByListJSON.push({
          DataFieldId: DataFieldId,
          FieldName: entityText,
          OrderBy: Order
        });


      }
    }
  }

  //------------------------------------------------------------------------------------------------

  //Code for Parameters

  showListName = true;
  showPrepopulatedColumn = false;
  showUserDropdowns: bool = false;
  public dateValue: Date = new Date();
  ReportParametersModel = new ReportParametersModel();

  @ViewChild('ParameterGrid', { static: false }) public ParameterGrid: GridComponent;



  @ViewChild('entityTypeListObj', { static: false }) public entityTypeListObj: DropDownListComponent;
  public entityTypeList: Object[] = [
    { text: "Workflow", value: "FlexTables" },
    { text: "Master Data", value: "MasterData" },
    { text: "Users", value: "Users" },
    { text: "Form Grid", value: "FormGrid" }
  ];
  public EntityTypeFields: Object = { text: 'text', value: 'value' };

  //EntityList Dropdown
  public EntityIdList: Object[];
  public EntityIdFields: Object = { text: 'DisplayTableName', value: 'Value' };
  @ViewChild('EntityIdlistObj', { static: false }) public EntityIdlistObj: DropDownListComponent;

  public ListName: Object[];
  public ListNameFields;
  @ViewChild('ListNamelistObj', { static: false }) public ListNamelistObj: DropDownListComponent;

  //EntityType dropdown  
  public EntityTypeSource = [
    { text: "Master Data", value: "MasterData" },
    { text: "Workflow Transactions", value: "FlexTables" }
  ];
  public EntityTypeDataFields: Object = { text: 'text', value: 'value' };
  @ViewChild('EntityTypeDD', { static: false }) public EntityTypeDD: DropDownListComponent;

  public PrepopulateColumnListSource: Object[];
  public PrepopulateColumnListDataFields: Object = { text: 'Label', value: 'Label' };
  @ViewChild('PrepopulateColumnListDD', { static: false })  public PrepopulateColumnListDD: DropDownListComponent;
  
  public DataTypeFields: Object = { text: 'text', value: 'value' };
  public DataTypeSource: Object[];

  showDropdowns = false;

  @ViewChild("DataTypeListObj", { static: false })
  DataTypeListObj: DropDownListComponent;
  public showdivCommonFields = false;
  public showdivCharFields = false;
  public showdivNumericFields = false;
  public showdivDateFields = false;
  public showdivTimeFields = false;
  public showCommonDefault = true;
  public showdivBooleanFields = false;
  public checkedBoolDefault = false;
  public showdivDropdownFields = false;
  public showFieldForEditing = true;
  @ViewChild('TimeFormatListObj', { static: false })
  public TimeFormatListObj: DropDownListComponent;
  public TimeFormat: string[] = ['AM', 'PM'];
  public TimeFormatValue: 'AM';

  public SelectedType: string = "Dropdown";
  @ViewChild('BooleanListObj', { static: false })
  public BooleanListObj: DropDownListComponent;
  public booleanSrc: string[] = ['true', 'false'];
  public booleanValue: 'true';
  paramsubmitted = false;
  enableDataType: boolean = true;
  Whole: boolean = true;
  Decimal: boolean = false;
  numbertypeDisable = false;

  showSimpleDropdown = false;
  showNewLink = false;
  showMultiselect = false;

  @ViewChild('PreviewMasterDataDropdownList', { static: false }) public PreviewMasterDataDropdownList: DropDownListComponent;

  public PreviewMasterData: Object[];
  public PreviewDataFields: Object = { text: 'AttributeC01', value: 'Id' };

  ShowMoreValuesDialogue: boolean = false;
  AddMoreValueHeader: string;

  @ViewChild('DisplayColumnListDD', { static: false })  public DisplayColumnListDD: DropDownListComponent;

  get k() { return this.ParameterForm.controls; }

  public changeDataType(args: any): void {
    this.showdivCommonFields = true;
    this.showCommonDefault = true;
    this.ShowMoreValuesDialogue = false;
    if (this.DataTypeListObj.value == 'ShortAnswer') {
      this.showdivCharFields = true;
      this.showdivNumericFields = false;
      this.showdivDateFields = false;
      this.showdivTimeFields = false;
      this.showdivBooleanFields = false;
      this.showdivDropdownFields = false;
      this.showdivDropdownFields = false;
    }
    else if (this.DataTypeListObj.value == 'Paragraph') {
      this.showdivCharFields = true;
      this.showdivNumericFields = false;
      this.showdivDateFields = false;
      this.showdivTimeFields = false;
      this.showdivBooleanFields = false;
      this.showdivDropdownFields = false;
    }
    else if (this.DataTypeListObj.value == 'Number') {
      this.showdivCharFields = false;
      this.showdivNumericFields = true;
      this.showdivDateFields = false;
      this.showdivTimeFields = false;
      this.showdivBooleanFields = false;
      this.showdivDropdownFields = false;
    }
    else if (this.DataTypeListObj.value == 'Date') {
      this.showdivCharFields = false;
      this.showdivNumericFields = false;
      this.showdivDateFields = true;
      this.showdivTimeFields = false;
      this.showdivBooleanFields = false;
      this.showCommonDefault = false;
      this.showdivDropdownFields = false;
    }
    else if (this.DataTypeListObj.value == 'Time') {
      this.showdivCharFields = false;
      this.showdivNumericFields = false;
      this.showdivDateFields = false;
      this.showdivTimeFields = true;
      this.showCommonDefault = false;
      this.showdivBooleanFields = false;
      this.showdivDropdownFields = false;
      this.showdivDropdownFields = false;
    }
    else if (this.DataTypeListObj.value == 'Boolean') {
      this.showdivCharFields = false;
      this.showdivNumericFields = false;
      this.showdivDateFields = false;
      this.showdivTimeFields = false;
      this.showCommonDefault = false;
      this.showdivBooleanFields = true;
      this.showdivDropdownFields = false;
    }
    else if (this.DataTypeListObj.value == 'SingleColumnList' || this.DataTypeListObj.value == 'MultiColumnList'
      || this.DataTypeListObj.value == 'FormGrid') {
      // this.EntityTypeDD.text = null;
      this.showdivCharFields = false;
      this.showdivNumericFields = false;
      this.showdivDateFields = false;
      this.showdivTimeFields = false;
      this.showCommonDefault = false;
      this.showdivBooleanFields = false;
      this.showdivDropdownFields = true;
      if (this.DataTypeListObj.value == 'FormGrid') {
        this.EntityTypeSource = [{ text: "FormGrid", value: "FormGrid" }]
        this.showPrepopulatedColumn = true;
      }
      else {
        this.showPrepopulatedColumn = false;
        this.EntityTypeSource = [
          { text: "Master Data", value: "MasterData" },
          { text: "Users", value: "Users" },
          { text: "Workflow Transactions", value: "FlexTables" },
        ];
      }
      if (this.DataTypeListObj.value == 'SingleColumnList') {
        this.showSimpleDropdown = true;
        //this.showNewLink = true;
        this.showMultiselect = false;
      }
      else {
        this.showSimpleDropdown = false;
        this.showNewLink = false;
        this.showMultiselect = true;
      }
    }
    else if (this.DataTypeListObj.value == 'FileUpload' || this.DataTypeListObj.value == 'Signature') {
      this.toastObj.timeOut = 3000;
      this.toasts[2].content = "Please choose other type.";
      this.toastObj.show(this.toasts[2]);
      this.DataTypeListObj.value = '';
      return;
    }
    if (!(this.DataTypeListObj.value == 'SingleColumnList' || this.DataTypeListObj.value == 'MultiColumnList' || this.DataTypeListObj.value == 'FormGrid')) {
      this.showSimpleDropdown = false;
      this.showPrepopulatedColumn = false;
      this.showNewLink = false;
      this.showMultiselect = false;
    }
  }

  ShowParamAddBtn: Boolean = false;
  ShowParamUpdateBtn: Boolean = false;
  SelectedParamId: number;
  ParametertoolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'ParameterGrid_pdfexport') {
      this.ParameterGrid.pdfExport();
    }
    if (args.item.id === 'ParameterGrid_excelexport') {
      this.ParameterGrid.excelExport();
    }
    if (args.item.id === 'ParameterGrid_csvexport') {
      this.ParameterGrid.csvExport();
    }
    if (args.item.id === 'Add') {

      this.ShowParamFormPopup = true;
      this.ShowParamAddBtn = true;
      this.ShowParamUpdateBtn = false;

      this.ParameterForm.reset();
    }

    if (args.item.id === 'Edit') {
      
      const selectedRecords = this.ParameterGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No record is selected for edit";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.SelectedParamId = selectedRecords[0]['Id'];
        this.ShowParamAddBtn = false;
        this.ShowParamUpdateBtn = true;
        this.GetReportParameterById(this.SelectedParamId);
      }

    }

    if (args.item.id === 'Delete') {
      
      const selectedRecords = this.ColumnsGrid.getSelectedRecords();

      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No record is selected for delete";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.SelectedParamId = selectedRecords[0]['Id'];//
        //this.ParamDelete(this.SelectedParamId);
       
      }
    }


  }

  RptParamDFId: number;
  ParamDFChange(args: any): void {
    
    this.RptParamDFId = args.itemData.DataFieldId;
  }

  ParamFuncChange(args: any): void {
    
    this.CustomFuncId = args.itemData.Id;
    this.CustomFuncLabel = args.itemData.Label;
    this.CustomFunctionName = args.itemData.Name;
    this.ShowParameterdd = true;
    this.DropdownArr = [];
    this.GetCustomFunctionParameters();
  }

  ParameterGridDataSrc: any;
  GetParametersData() {
    
    this._service.GetParametersData().subscribe(
      (data: any) => {
        this.ParameterGridDataSrc = data;
      },
      (error: any) => {
        this.toasts[2].content = error.error.Message;
        this.toastObj.show(this.toasts[2]);
        this.ShowParamFormPopup = true;
      }
    );
  }

  GetReportParameterById(ParamId) {
    
    this._service.GetReportParameterById(ParamId)
      .subscribe(
        data => {
          this.ReportParametersModel = data;
          this.SelectedParamId = data.Id;
          this.ShowParamFormPopup = true;
          this.showdivCommonFields = true;
          this.RptParamDFId = data.DataFieldId;
          let ParamFieldName;
          ParamFieldName = this.FlattenedRecords.filter(aa => aa.DataFieldId == data.DataFieldId);
          this.ParameterForm.patchValue({
            DataField: ParamFieldName[0].FieldName,
            CustomFunc: data.CustomFunc,
            ParameterLabel: data.Label,
            DataType: data.UserDataType,
            IsMandatory: data.IsMandatory,
            IsActive: data.IsActive,
            DefaultValue: data.DefaultValue,
            DefaultDateValue: data.DefaultValue,
            DefaultBooleanValue: data.DefaultValue,
            MinLength: data.MinimumLength,
            MaxLength: data.MaximumLength,
            ToolTip: data.ToolTip,
            Width: data.Width,
            DigitsAfterDecimal: data.DigitsAfterDecimal,
            MinValue: data.MinValueInclusive,
            MaxValue: data.MaxValueInclusive,
            MinDateInclusive: data.MinDate,
            MaxDateInclusive: data.MaxDate,
            ListNameValue: data.JoiningEntityId,
            EntityTypeValue: data.JoiningEntityType,
            //DisplayColumnListValue: DisplayColumn,
            PrepopulateColumnListValue: data.DefaultValue,
            IsMultiSelection: data.IsMultiSelection
          });
          
        }
      );
  }


  SaveParam() {
    
    
    this.PopulateModelData("Create");
    this._service.SaveReportParameter(this.ReportParametersModel).subscribe(
      (data: any) => {
        this.toasts[1].content = "Column created successfully";
        this.toastObj.show(this.toasts[1]);
        this.GetParametersData();
        this.ShowParamFormPopup = false;
      },
      (error: any) => {
        this.toasts[2].content = error.error.Message;
        this.toastObj.show(this.toasts[2]);
        this.ShowParamFormPopup = true;
      }
    );
  }

  UpdateParam() {

    
    this.PopulateModelData("Edit");
    this._service.UpdateReportParameter(this.ReportParametersModel).subscribe(
      (data: any) => {
        this.toasts[1].content = "Column updated successfully";
        this.toastObj.show(this.toasts[1]);
        this.GetParametersData();
        this.ShowParamFormPopup = false;
      },
      (error: any) => {
        this.toasts[2].content = error.error.Message;
        this.toastObj.show(this.toasts[2]);
        this.ShowParamFormPopup = true;
      }
    );
  }

  PopulateModelData(SaveType) {
    debugger
    this.ReportParametersModel.Label = this.ParameterForm.get('ParameterLabel').value;
    if (SaveType == 'Create') {
      //Set DataType
      if (this.DataTypeListObj.value == 'ShortAnswer' || this.DataTypeListObj.value == 'Time') {

        this.ReportParametersModel.DataType = "text";
      }
      else if (this.DataTypeListObj.value == 'Paragraph') {
        this.ReportParametersModel.DataType = "long text";
      }
      else if (this.DataTypeListObj.value == 'Number') {
        if (this.showDecimal) {
          this.ReportParametersModel.DataType = "numeric";
        }
        else {
          this.ReportParametersModel.DataType = "int";
        }
      }
      else if (this.DataTypeListObj.value == 'Date') {
        this.ReportParametersModel.DataType = "date";
      }
      else if (this.DataTypeListObj.value == 'Boolean') {
        this.ReportParametersModel.DataType = "bit";
      }
      else if (this.DataTypeListObj.value == 'SingleColumnList' || this.DataTypeListObj.value == 'MultiColumnList' || this.DataTypeListObj.value == 'FormGrid') {
        this.ReportParametersModel.DataType = "text";
      }
    }
    if (this.DataTypeListObj.value == 'SingleColumnList' || this.DataTypeListObj.value == 'MultiColumnList' || this.DataTypeListObj.value == 'FormGrid') {
      let DisplayCols = this.ParameterForm.get('DisplayColumnListValue').value;
      //User must choose some display column list for List type
      if (DisplayCols == null || DisplayCols == '') {
        this.toastObj.timeOut = 0;
        this.toasts[2].content = 'Please choose some columns for display in ' + this.DataTypeListObj.value;
        this.toastObj.show(this.toasts[2]);
        return;
      }
      let dropdownListType = this.ParameterForm.get('EntityTypeValue').value;
      if (dropdownListType == 'Internal Users' || dropdownListType == 'External Users') {
        this.ReportParametersModel.JoiningEntityType = 'LUsers';
        this.ReportParametersModel.JoiningEntityId = 0;
        this.ReportParametersModel.ControlProperties = "{SelectedType:" + this.SelectedType + "}";
      }
      else {
        //FormGrid,Users,MasterData are types of LReferences. 
        if (dropdownListType == 'FormGrid' || dropdownListType == 'Users' || dropdownListType == 'MasterData') {
          dropdownListType = 'LReferences';
        }
        this.ReportParametersModel.JoiningEntityType = dropdownListType;
        this.ReportParametersModel.JoiningEntityId = this.ParameterForm.get('ListNameValue').value;
        this.ReportParametersModel.ControlProperties = "{SelectedType:" + this.SelectedType + "}";
      }
      if (this.PrepopulateColumnListDD != undefined)
        this.ReportParametersModel.DefaultValue = this.PrepopulateColumnListDD.text;
      //this.ReportParametersModel.DefaultValue = this.ParameterForm.get('PrepopulateColumnListValue').value;
      this.ReportParametersModel.IsMultiSelection = this.ParameterForm.get('IsMultiSelection').value;
      this.ReportParametersModel.ParameterCarrier = "|DisplayColumnList=" + this.ParameterForm.get('DisplayColumnListValue').value;
    }
    this.ReportParametersModel.UserDataType = this.DataTypeListObj.value.toString();

    if (this.showDropdowns) {
      this.ReportParametersModel.EntityId = this.EntityIdlistObj.value.toString();
      let entityType = this.entityTypeListObj.value.toString();
      //EntityType for MasterData,Users,FormGrid is LReferences
      if (entityType == 'MasterData' || entityType == 'Users' || entityType == 'FormGrid') {
        this.ReportParametersModel.EntityType = 'LReferences';
      } else {
        this.ReportParametersModel.EntityType = this.entityTypeListObj.value.toString();
      }
    } else {
      let entityType = this.ReportParametersModel.EntityType;
      if (entityType == 'MasterData' || entityType == 'Users' || entityType == 'FormGrid') {
        this.ReportParametersModel.EntityType = 'LReferences';
      }
    }
    this.ReportParametersModel.ReportId = this.ReportId;
    this.ReportParametersModel.DataFieldId = this.RptParamDFId;
    this.ReportParametersModel.CustomFunctionId = this.ParameterForm.get('CustomFunc').value;
    if (this.DropdownArr != undefined) {
      this.ReportParametersModel.CustomFunctionParameters = this.DropdownArr.join(',');
    }
    this.ReportParametersModel.IsMandatory = this.ParameterForm.get('IsMandatory').value;
    this.ReportParametersModel.ProjectId = this.ProjectId
    this.ReportParametersModel.MinimumLength = this.ParameterForm.get('MinLength').value;
    this.ReportParametersModel.MaximumLength = this.ParameterForm.get('MaxLength').value;
    this.ReportParametersModel.MinValueInclusive = this.ParameterForm.get('MinValue').value;
    this.ReportParametersModel.MaxValueInclusive = this.ParameterForm.get('MaxValue').value;
    this.ReportParametersModel.Label = this.ParameterForm.get('ParameterLabel').value;
    if (this.ReportParametersModel.UserDataType == 'Date') {
      this.ReportParametersModel.DefaultValue = this.ParameterForm.get('DefaultDateValue').value;
      this.ReportParametersModel.MinDate = this.ParameterForm.get('MinDateInclusive').value;
      this.ReportParametersModel.MaxDate = this.ParameterForm.get('MaxDateInclusive').value;
    }
    else if (this.ReportParametersModel.UserDataType == 'Boolean') {
      this.ReportParametersModel.DefaultValue = this.ParameterForm.get('DefaultBooleanValue').value;
    }
    else if (this.DataTypeListObj.value == 'FormGrid') {
      this.ReportParametersModel.DefaultValue = this.PrepopulateColumnListDD.text;
    }
    else {
      this.ReportParametersModel.DefaultValue = this.ParameterForm.get('DefaultValue').value;
    }
    this.ReportParametersModel.ToolTip = this.ParameterForm.get('ToolTip').value;
    this.ReportParametersModel.Width = this.ParameterForm.get('Width').value;
    this.ReportParametersModel.IsActive = this.ParameterForm.get('IsActive').value;
    this.ReportParametersModel.DigitsAfterDecimal = this.ParameterForm.get('DigitsAfterDecimal').value;
    this.ReportParametersModel.Id = this.SelectedParamId;
  }

  showDecimal: boolean = false;
  SetNumberFieldType(value) {
    if (value == 'Decimal') {
      this.showDecimal = true;
      this.Whole = false;
      this.Decimal = true;
    } else {
      this.showDecimal = false;
      this.Whole = true;
      this.Decimal = false;
    }
  }

  //public LoadEntities(args: any): void {
  //  
  //  let EntityType = args.value;
  //  this.showListName = true;
  //  if (EntityType == 'FlexTables')
  //    this.showNewLink = false;
  //  //if (EntityType == 'LReferences')
  //  else {
  //    //New List cannot be created for MulticolumnList
  //    if (this.DataTypeListObj.value == 'MultiColumnList' || this.DataTypeListObj.value == 'FormGrid') {
  //      this.showNewLink = false;
  //    } else {
  //      this.showNewLink = true;
  //    }
  //  }
  //  //clear selection4
  //  if (this.ListNamelistObj != undefined) this.ListNamelistObj.text = null;
  //  if (this.DisplayColumnListDD != undefined) this.DisplayColumnListDD.text = null;
  //  this.getListData(EntityType);
  //}

  //getListData(EntityType) {
  //  //populate Entity
  //  this._DataFieldService.GetTableNamesByProjectIdWithType(this.ProjectId, EntityType)
  //    .subscribe(result => {
  //      this.ListNameFields = { text: 'DisplayTableName', value: 'Value' };
  //      // this.ListName = result;
  //      this.ListName = [];
  //      (result as object[]).forEach((sdata, index) => {
  //        if (sdata["DisplayTableName"] === this.EntityIdlistObjtext) {
  //          //Exclude the value for which Datafields are being configured.
  //        } else {
  //          this.ListName.push(sdata);
  //        }
  //      });
  //    });

  //}

  //public DisplayColumnListSource: Object[];
  //getDisplayColumnList(EntityType, EntityId, ProjectId) {
  //  this._DataFieldService.GetAllDataFieldsForEntity(EntityType, EntityId, ProjectId, this.ReportParametersModel.ControlProperties)
  //    .subscribe(result => {
  //      
  //      //filter only active Datafields
  //      this.DisplayColumnListSource = [];
  //      (result as object[]).forEach((sdata, index) => {
  //        if (sdata["IsActive"] === true) {
  //          this.DisplayColumnListSource.push(sdata);
  //        }
  //      });
  //      this.PrepopulateColumnListSource = [];
  //      (result as object[]).forEach((sdata, index) => { //filter active dropdowns
  //        if (sdata["JoiningEntityType"] != null && sdata["JoiningEntityType"] != '' && sdata["IsActive"] === true) {
  //          this.PrepopulateColumnListSource.push(sdata);
  //        }
  //      });
  //    });
  //}
  //public LoadMasterDataValues(args: any): void {
  //  this.DisplayColumnListDD.text = null;//clear selection
  //  let ListType = this.ListNamelistObj.text;
  //  let EntityType = this.EntityTypeDD.value;
  //  if (EntityType != 'FlexTables') {
  //    EntityType = 'LReferences';
  //  }
  //  //when EntityType is [Users] Internal Users or [Users] External Users for SingleColumnList, dont show DisplayColumnDropdown
  //  if (!(ListType.indexOf('[Users]') !== -1)) {
  //    this.getDisplayColumnList(EntityType, args.value, this.ProjectId);
  //  }
  //  else if (this.DataTypeListObj.text == 'SingleColumnList') {
  //    this.showSimpleDropdown = false; //dont show DisplayColumnDropdown
  //  }
  //  else {
  //    this.getDisplayColumnList(EntityType, args.value, this.ProjectId);
  //  }
  //}

  omit_special_char(event) {
    //These symbols are used for manipulating data during Excel data upload.
    var k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return !(k == 40 || k == 41 || k == 42 || k == 43 || k == 126);// (,),*,~,+
  }
}


