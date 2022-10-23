import { Component, ViewChild, Inject } from '@angular/core';
import { SelectEventArgs, TabComponent, ClickEventArgs, MenuEventArgs } from '@syncfusion/ej2-angular-navigations';
import { GridComponent, GroupSettingsModel, ToolbarService, EditService, PageService, ContextMenuService, ContextMenuItemModel, ToolbarItems, FilterService, RowSelectEventArgs, FilterSettingsModel, ColumnMenuService, ReorderService, ExcelExportService, PdfExportService, PageSettingsModel, DataStateChangeEventArgs, ResizeService, GroupService, TextWrapSettingsModel } from '@syncfusion/ej2-angular-grids';
import { Ajax } from '@syncfusion/ej2-base';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
import { RadioButtonComponent } from '@syncfusion/ej2-angular-buttons';
import { environment } from '../../../../environments/environment';
import { NodeModel, ConnectorModel, PointPortModel, Connector, Node, IClickEventArgs } from '@syncfusion/ej2-diagrams';
import { DiagramComponent, DiagramTools } from '@syncfusion/ej2-angular-diagrams';
import { WorkflowdesignerService } from '../../../services/workflowdesigner.service';
import { RWorkFlows } from '../../../models/rworkflow-model';
import { WSteps } from '../../../models/wsteps-model';
import { GenericGridColumns } from '../../../models/generic-grid-column-model';
import { RworkFlowsService } from '../../../services/rworkflows.service';
import { GenericGridService } from '../../../services/generic-grid.service';
import { FormRendererService } from '../../../services/form-renderer.service';
import { SupportingDocumentService } from '../../../services/supporting-document.service';
import { SubProcessService } from '../../../services/subprocess.service';
import { FormDesignerService } from '../../../services/form-designer.service';
import { TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';

/*
L10n.load({
  'de-DE': {
    'grid': {
      'EmptyRecord': 'Keine Aufzeichnungen angezeigt',
      'GroupDropArea': 'Ziehen Sie einen Spaltenkopf hier, um die Gruppe ihre Spalte',
      'UnGroup': 'Klicken Sie hier, um die Gruppierung aufheben',
      'EmptyDataSourceError': 'DataSource darf bei der Erstauslastung nicht leer sein, da Spalten aus der dataSource im AutoGenerate Spaltenraster',
      'Item': 'Artikel',
      'Items': 'Artikel'
    },
    'pager': {
      'currentPageInfo': '{0} von {1} Seiten',
      'totalItemsInfo': '({0} Beiträge)',
      'firstPageTooltip': 'Zur ersten Seite',
      'lastPageTooltip': 'Zur letzten Seite',
      'nextPageTooltip': 'Zur nächsten Seite',
      'previousPageTooltip': 'Zurück zur letzten Seit',
      'nextPagerTooltip': 'Zum nächsten Pager',
      'previousPagerTooltip': 'Zum vorherigen Pager'
    }
  }
});*/
//setCulture('de'); // Change the Grid culture
//setCurrencyCode('EUR');// Change the currency code

@Component({
  selector: 'app-generic-grid',
  templateUrl: './generic-grid.component.html',
  styleUrls: ['./generic-grid.component.css'],
  providers: [ToolbarService, EditService, PageService, ContextMenuService, FilterService, ColumnMenuService,
    ReorderService, ExcelExportService, PdfExportService, ResizeService, WorkflowdesignerService, FormDesignerService, GroupService]
})

export class GenericGridComponent {
  //These variables are using in Image Uploader
  showUploader: boolean = false;
  uploadPath: string;//passing this to uploader
  AllowedFileTypes: string = ".xlsx";
  public WorkflowId: number;
  public WorkflowsDetails: RWorkFlows;
  public TabsDetails: any[];
  public changeTabsDetails: any = null;
  public stepName: WSteps;
  public gridDataSource: any;
  public genericGridData: any;
  public state: DataStateChangeEventArgs;
  public gridColumns: GenericGridColumns[];
  public branchIconImageSource: string = "assets/flex-images/BranchIcon.png";
  public ShowBranchPopupFlag: boolean = false;
  public branchStepInfo: WSteps[];
  public branchStepId: number;
  public showTabItemFlag: boolean = true;
  public gridStepAction: object;
  public selectedTransactionIds: string = "";
  public stepActionId: any;
  public filterSettings: FilterSettingsModel;
  public pageSetting: PageSettingsModel;
  public wrapSettings: TextWrapSettingsModel;
  LoggedInScopeEntityType: string;
  LoggedInScopeEntityId: number;

  public pagesize: number;
  public pageNumber: number;
  public sortDataFieldName: string;
  public filterQuery: string;
  public sortOrder: string;
  public stepid: number;
  public nvarcharStepId: string;
  public IsChangeStep: boolean = false;
  public transactionStatus: string = "Active";
  public ConfirmationBoxMsg: string;
  public loggedInUserId: number;
  public loggedInRoleId: number;
  public ProjectId: number;
  public UserRoleId: number;
  public ActionName: string;
  public locale: string;
  public timeZone: string;
  public offSet: number;
  public selectedStepId: number;
  DateTimeFormat: string = "MM-dd-yyyy H:mm:ss";
  hidden = false;
  ShowSubProgressPopUp: Boolean = false;
  ShowFormsDialoge = false;
  formsData: any;
  public data: Observable<DataStateChangeEventArgs>;

  @ViewChild('confirmDialog', { static: false })
  public confirmDialog: DialogComponent;
  public confirmFlag: boolean;
  public confirmHeader: string = 'Confirm';
  public confirmCloseIcon: Boolean = true;
  public confirmWidth: string = '400px';
  public animationSettings: Object = { effect: 'None' };


  //public toolbar: ToolbarItems[] | object;
  public toolbar: any;
  public groupOptions: GroupSettingsModel;

  @ViewChild('branchStepGrid', { static: false })
  public branchStepGrid: GridComponent;

  @ViewChild('genericgrid', { static: false }) public genericgrid: GridComponent;
  @ViewChild('formsGrid', { static: false }) public formsGrid: GridComponent;

  @ViewChild('tabs', { static: false }) tabObj: TabComponent;

  @ViewChild('Comments', { static: false }) Comments: TextBoxComponent;


  public contextMenuItems: ContextMenuItemModel[]

  @ViewChild('toasttype', { static: false })

  private toastObj: ToastComponent;
  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };

  @ViewChild('radiobuttonorder', { static: false }) public radiobuttonorder: RadioButtonComponent;

  @ViewChild('diagram', { static: false }) public diagram: DiagramComponent; //added by RS
  public tool: DiagramTools = DiagramTools.ZoomPan;//added by RS

  readonly baseUrl = environment.baseUrl;



  constructor(
    private _serviceRWorkflows: RworkFlowsService,
    @Inject(GenericGridService) private _service: GenericGridService,
    private router: Router, private route: ActivatedRoute,
    private _rendererService: FormRendererService,
    private _SupportDocService: SupportingDocumentService,
    private _SubProcessService: SubProcessService,
    private _formDesignerService: FormDesignerService,
    private datePipe: DatePipe,
    private titleService: Title
  ) {
    this.titleService.setTitle('FlexWF');
    this.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.locale = Intl.DateTimeFormat().resolvedOptions().locale;
    // let nf = Intl.NumberFormat().resolvedOptions().locale;
    this.offSet = new Date().getTimezoneOffset();
  }

  DefaultStepId: number = 0;
  IsDefaultSet: Boolean = false;
  DefaultStepIndex: number;
  DefaultFlag: Boolean = false;
  EntityType: string;
  EntityId: number;
  ngOnInit() {
    //We did this because we need to call generic Grid from more than one menu item. We get issue when we are already on one url and hit again same url.
    this.route.params.subscribe(val => {
      
      // put the code from ngOnInit here
      this.loggedInUserId = +sessionStorage.getItem("LoggedInUserId");
      this.loggedInRoleId = +sessionStorage.getItem("LoggedInRoleId");
      this.ProjectId = +sessionStorage.getItem("ProjectId");
      this.DefaultStepId = +sessionStorage.getItem('CurrentStepId');
      this.LoggedInScopeEntityType = sessionStorage.getItem("LoggedInScopeEntityType");
      this.LoggedInScopeEntityId = +sessionStorage.getItem("LoggedInScopeEntityId");
      this.pageNumber = 0;
      sessionStorage.removeItem('CurrentStepId');
      //Getting workflowId from parameters
      this.route.params.subscribe((params: Params) => {
        this.WorkflowId = parseInt(params['WorkflowId']);
      });

      //dont change the order of below two lines.
      var PreviousWFId = +sessionStorage.getItem("WorkflowId");

      sessionStorage.setItem("WorkflowId", this.WorkflowId.toString());

      //We did this because when we goes from one workflow to another from menus, it keeps rendering the data of previous WF. this is the issue of same url. so we refreshing screen at the parameter change.
      if (this.WorkflowId != PreviousWFId) {
        window.location.reload();
      }

      this.changeTabsDetails = JSON.parse(sessionStorage.getItem('ChangeTabDetails'));
      sessionStorage.removeItem('ChangeTabDetails');


      this.groupOptions = { showGroupedColumn: true };

      //below two setting are necessary for filter in front end along with server side filtering, any change in these two may cause stop filtering or server side paging
      //this.filterSettings = { type: 'CheckBox' };
      this.filterSettings = { type: 'Menu' };
      this.pageSetting = { pageSize: 10, pageCount: 4 };
      //this.pageSetting = { pageSizes: true,pageCount: 4 };
      this.wrapSettings = { wrapMode: 'Content' };


      this.filterQuery = "";

      //Getting workflow details
      this._serviceRWorkflows.GetWorkflowById(this.WorkflowId)
        .subscribe(
          data => {
            this.WorkflowsDetails = data;
            this.EntityType = this.WorkflowsDetails.EntityType;
            this.EntityId = this.WorkflowsDetails.EntityId;
          }
        );

      //this.GetTabsData();

    });
  }

  GetTabsData() {
    
    this._service.GetUserRoleId(this.loggedInUserId, this.loggedInRoleId)
      .subscribe(
        data => {
          this.UserRoleId = data;
          this._service.GetTabsByWorkflow(this.WorkflowId, 0, this.loggedInRoleId)
            .subscribe(
              data => {
                //At first time when page will render then changeTabsDetails will null and TabsDetails will use to render tabs on page but when it comes from generic Grid initial component then changeStepdetails will work
                this.TabsDetails = data;
                console.log(this.TabsDetails);
                if (this.changeTabsDetails != null) {
                  this.TabsDetails = this.changeTabsDetails;
                }

                //this.DefaultStepId == 0 means it comes from Menu directly not from form renderer
                if (this.DefaultStepId == 0 || this.DefaultStepId == undefined) {
                  //set default step Id
                  for (let i = 0; i < this.TabsDetails.length; i++) {
                    if (this.TabsDetails[i].IsDefault == true) {
                      this.DefaultStepId = this.TabsDetails[i].Id;
                      this.IsDefaultSet = true;
                      this.DefaultStepIndex = i;
                      break;
                    }
                  }
                  if (!this.IsDefaultSet) {
                    this.DefaultStepId = this.TabsDetails[0].Id;
                    this.DefaultStepIndex = 0;
                  }
                }
                else {
                  let rowIndex = this.TabsDetails.findIndex(x => x.Id == this.DefaultStepId);
                  this.DefaultStepIndex = rowIndex;
                }
                this.DefaultFlag = true;

                //if (this.DefaultFlag) {
                //  this.tabObj.selectedItem = this.DefaultStepIndex;
                //  this.DefaultFlag = false;
                //}

                //this.stepName = this.TabsDetails[0];
                this.stepid = this.DefaultStepId;//this.stepName.Id;
                this.LoadDefaultStep();
                this.GetGenericGridContextMenu();

              }
            );
        }
      );
  }

  ngAfterViewInit() {
    //this.tabObj.selectedItem = this.DefaultStepIndex;

    //Getting selectedStepId from parameters.This code is just to show the tab selected if we have selectedstepid. this will happen when we will come here from Generic Grid change step component not from Menu
    //this.route.params.subscribe((params: Params) => {
    //  this.selectedStepId = parseInt(params['SelectedStepId']);
    //  if (this.selectedStepId != null) {
    //    let rowIndex = this.TabsDetails.findIndex(x => x.Id == this.selectedStepId);
    //    this.tabObj.select(rowIndex);
    //  }
    //});

    let S3BucketRootFolder = environment.S3BucketRootFolder;
    this.FilePath = "/" + this.ProjectId + "_" + this.ProjectName + "/workflow/"; //+ this.WorkflowsDetails.UILabel;
    this.uploadPath = S3BucketRootFolder + this.FilePath + "/uploads"
  }


  public confirmDlgYesBtnClick = (): void => {
    this.confirmDialog.hide();
    if (this.ActionName == 'Create') {
      sessionStorage.setItem("IsAuth", "true");
      this.router.navigate(['/flexwf/form-renderer', -1, this.stepid, this.ActionName, 'workflow', this.WorkflowId, -1]);
    }
    if (this.ActionName == 'Edit' || this.ActionName == 'Review') {
      sessionStorage.setItem("IsAuth", "true");
      this._rendererService.GetTransactionDataById(this.selectedTransactionIds, this.EntityType, this.EntityId).
        subscribe(data => {
          let FormId = data[0]['FormId']
          //this.router.navigate(['/flexwf/form-renderer', this.selectedTransactionIds, this.stepid, this.ActionName, 'workflow', this.WorkflowId, FormId]);
          this.router.navigate(['/flexwf/form-renderer', this.selectedTransactionIds, this.stepid, this.ActionName, 'workflow', this.WorkflowId, FormId]);
        });

    }
    this.fnExecuteAction();
  }
  public confirmDlgBtnNoClick = (): void => {

    this.confirmDialog.hide();
    //this.pagesize = this.genericgrid.pageSettings.pageSize;
    //Getting data for genericGrid by StepId(tab)
    this.GetGridData(this.stepName.Id);
    this.genericgrid.refresh();

    return;
  }

  public confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmDlgYesBtnClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];


  LoadDefaultStep() {


    //let DefaultStep: WSteps;
    //DefaultStep = this.TabsDetails[0];
    //Get Grid Columns
    this.GetGridColumn(this.DefaultStepId);
    this.pagesize = 50;//at the time of loading the page, we dont have grid state,thats why we are setting default
    this.sortDataFieldName = "";
    this.sortOrder = "";
    //Getting data for genericGrid by StepId(tab)
    this.GetGridData(this.DefaultStepId);//First time, we will give some default pagesize

    //Getting Step Action for making Grid toolbar
    this.GetGridStepActions(this.DefaultStepId);
  }

  onTabCreate(args: SelectEventArgs) {
    
    this.GetTabsData();
    console.log('onTabCreated called');
  }

  //Tab select event
  onTabSelect(args: SelectEventArgs) {
    
    console.log('onTabSelect called');
    //This will called first time to show the default step selected, data has already come
    if (this.DefaultFlag) {
      this.tabObj.selectedItem = this.DefaultStepIndex;
      console.log('Default index' + this.DefaultStepIndex);
      this.DefaultFlag = false;
      return;
    }

    this.selectedTransactionIds = "";
    this.stepName = this.TabsDetails[args.selectedIndex];
    this.stepid = this.stepName.Id;
    this.nvarcharStepId = this.stepName.NVarcharId;
    //Get Grid Columns
    this.GetGridColumn(this.stepName.Id);

    // this.pagesize = this.genericgrid.pageSettings.pageSize;
    this.pageSetting = { pageSizes: true, pageSize: this.pagesize };
    //Getting data for genericGrid by StepId(tab)
    this.GetGridData(this.stepName.Id);


    //Getting Step Action for making Grid toolbar
    this.GetGridStepActions(this.stepName.Id);

    this.GetGenericGridContextMenu();
  }//End of onTabSelect


  public dataStateChange(state: DataStateChangeEventArgs) {
    
    let requestType = state.action.requestType;
    if (requestType == 'paging') {
      this.pagesize = state.take;
      this.pageNumber = state.action['currentPage'] - 1;//PageNumber starts from 0 but from the front end it starts from 1.
    }
    else if (requestType == 'sorting') {
      if (state.sorted != undefined) {
        this.sortDataFieldName = state.sorted[0].name;
        if (state.sorted[0].direction == 'ascending') {
          this.sortOrder = 'asc';
        }
        else {
          this.sortOrder = 'desc';
        }
      }
      else {
        this.sortOrder = '';
        this.sortDataFieldName = '';
      }
    }
    else if (requestType == 'filtering') {

      if (state.action['action'] != 'clearFilter') {
        this.BuildFilterQuery(state);
      }
      else {
        this.filterQuery = "";
      }
    }
    this.GetGridData(this.stepid);

  }

  BuildFilterQuery(state) {
    let filtersCount = state.where[0].predicates.length;

    var where = "";
    var filterValue = "";
    var filterCondition = "";
    var filterDataField = "";

    for (var i = 0; i < filtersCount; i += 1) {


      //If filter applied on DateType column than In case of equal and Notequal operator, we have predicates within predicates(menas we need to go one level down)
      if (state.where[0].predicates[i].value == undefined && state.where[0].predicates[0].predicates.length == 2) {
        filterValue = state.where[0].predicates[0].predicates[0].value;
        filterDataField = state.where[0].predicates[0].predicates[0].field;
        var operator1 = state.where[0].predicates[0].predicates[0].operator;
        var operator2 = state.where[0].predicates[0].predicates[1].operator;
        if (operator1 == "lessthanorequal" && operator2 == "greaterthanorequal") {
          filterCondition = "notequal";
        }
        else if (operator1 == "greaterthan" && operator2 == "lessthan") {
          filterCondition = "equal";
        }
      }
      else {
        filterValue = state.where[0].predicates[i].value;
        filterCondition = state.where[0].predicates[i].operator;
        filterDataField = state.where[0].predicates[i].field;
      }


      //Convert date from Javascript to sql form if filter appled on datetime column
      var FilteredColDatatype = this.gridColumns.filter(xx => xx.Label == filterDataField)[0]['Datatype'];

      filterDataField = "[" + filterDataField + "]";

      if (FilteredColDatatype == "datetime") {
        filterValue = new Date(filterValue).toISOString().slice(0, 19).replace('T', ' ');
        var dateFormat = this.DateTimeFormat.slice(0, this.DateTimeFormat.indexOf(" "));
        filterValue = this.datePipe.transform(filterValue, dateFormat, null, this.locale);
        filterDataField = "Format(" + filterDataField + ",'" + dateFormat + "','" + this.locale + "')";
      }


      where = " AND ";
      // build the "WHERE" clause depending on the filter's condition, value and datafield.
      where += this.GetFilterCondition(filterCondition, filterDataField, filterValue);

    }
    this.filterQuery += where;

  }



  //convert the filter condtion in a sql statement
  public GetFilterCondition(filterCondition, filterDataField, filterValue) {
    //List of available filters present in JqxGrid are present in case statements to form Sql Query
    switch (filterCondition) {

      case "contains":
        return " " + filterDataField + " LIKE '%" + filterValue + "%'";

      case "equal":
        return " " + filterDataField + " = '" + filterValue + "'";

      case "notequal":
        return " " + filterDataField + " <> '" + filterValue + "'";

      case "startswith":
        return " " + filterDataField + " LIKE '" + filterValue + "%'";

      case "endswith":
        return " " + filterDataField + " LIKE '%" + filterValue + "'";

      //DateTime filters
      case "greaterthan":
        return " " + filterDataField + " > '" + filterValue + "'";
      case "lessthan":
        return " " + filterDataField + " < '" + filterValue + "'";
      case "greaterthanorequal":
        return " " + filterDataField + " >= '" + filterValue + "'";
      case "lessthanorequal":
        return " " + filterDataField + " <= '" + filterValue + "'";
    }
    return "";
  }

  changeStatus() {
    this.selectedTransactionIds = "";
    if (this.radiobuttonorder.getSelectedValue() == "Canceled") {
      this.transactionStatus = "Canceled";
      this.toolbar = [{ text: 'Make Active', tooltipText: 'Make Active', prefixIcon: 'e-custom-icons e-action-Icon-make_active', id: 'MakeActive' },
      { text: 'RV', tooltipText: 'Review', prefixIcon: 'e-custom-icons e-action-Icon-review2', id: 'RV' }
      ];
    }
    else if (this.radiobuttonorder.getSelectedValue() == "SubProcess") {
      this.transactionStatus = "SubProcess";
      this.toolbar = [{ text: 'RV', tooltipText: 'Review', prefixIcon: 'e-custom-icons e-action-Icon-review1', id: 'RV' },
      { text: 'Sub Processes Progress', tooltipText: 'Sub Processes Progress', prefixIcon: 'e-custom-icons e-action-Icon-SubProcessProgress', id: 'SPP' }];
    }
    else {
      this.transactionStatus = "Active";
      this.GetGridStepActions(this.stepid);
    }

    this.GetGridData(this.stepid);
  }


  //Get Grid Column
  GetGridColumn(StepId) {
    
    const callback: Ajax = new Ajax(
      this.baseUrl + '/GenericGrid/GetGenericGridColumnsByStep?StepId=' + StepId + '&LoggedInRoleId=' + this.loggedInRoleId, 'GET', false, 'application/json; charset=utf-8'
    );
    callback.onSuccess = (data: any): void => {
      this.gridColumns = JSON.parse(data);
      console.log(this.gridColumns);
    };
    callback.send().then();
  }

  IsSubProExist: Boolean = false;
  IsCanceledRecExist: Boolean = false;
  ActiveCount: number;
  CanceledCount: number;
  SubProcessCount: number;
  GetGridData(StepId) {
    
    this._service.GetGridDataByStepId(StepId, this.UserRoleId, this.transactionStatus, this.pagesize, this.pageNumber, this.sortDataFieldName, this.sortOrder, this.filterQuery, this.locale, this.timeZone, this.offSet)
      .subscribe(
        data => {

          var SubProcessSrc = data.filter(x => x.Status == 'SubProcess');
          this.SubProcessCount = data.filter(x => x.Status == 'SubProcess').length;
          if (SubProcessSrc.length > 0) { this.IsSubProExist = true; }
          else this.IsSubProExist = false;

          var CanceledSrc = data.filter(x => x.Status == 'Cancelled');
          this.CanceledCount = data.filter(x => x.Status == 'Cancelled').length;
          if (CanceledSrc.length > 0) { this.IsCanceledRecExist = true; }
          else this.IsCanceledRecExist = false;

          this.ActiveCount = data.filter(x => x.Status == 'Active').length;

          if (this.transactionStatus == 'SubProcess') {
            data = data.filter(x => x.Status == 'SubProcess');

          }
          else if (this.transactionStatus == 'Cancelled') {
            data = data.filter(x => x.Status == 'Cancelled');

          }
          else {
            data = data.filter(x => x.Status == 'Active');
          }

          this.genericGridData = data;
          this.gridDataSource = { result: data, count: data.length };


        }
      );
  }

  IsCreateAvailable: Boolean = false;
  GetGridStepActions(StepId) {
    
    const callback2: Ajax = new Ajax(
      this.baseUrl + '/GenericGrid/GetGenericGridStepActionsByRole?UserId=' + this.loggedInUserId + '&StepId=' + StepId + ' &LoggedInScopeEntityType=' + this.LoggedInScopeEntityType + '&LoggedInScopeEntityId=' + this.LoggedInScopeEntityId, 'GET', false, 'application / json; charset = utf - 8'
    );
    callback2.onSuccess = (stepActionData: any): void => {
      if (this.transactionStatus = 'Active') {
        this.gridStepAction = JSON.parse(stepActionData);
        this.toolbar = this.gridStepAction;
        let isAssigned = JSON.stringify(this.gridStepAction).includes('Create');
        if (isAssigned) {
          this.IsCreateAvailable = true;
        }
        else {
          this.IsCreateAvailable = false;
        }
      }

      // this.tabObj.refreshActiveTab();
    };
    callback2.send().then();
  }

  GetGenericGridContextMenu() {
    //this.contextMenuItems = [{ text: 'Copy with headers', target: '.e-content', id: 'copywithheader' }];
    this.contextMenuItems = [{ text: 'Delete', target: '.e-content', id: '421' }, { text: 'Edit', target: '.e-content', id: '422' }, { text: 'Review', target: '.e-content', id: '430' }, { text: 'Submit', target: '.e-content', id: '76' }];
  }

  IndexIdJson = [];
  //It will provide the Transaction Ids list of selected rows
  rowSelected(e) {
    
    if (e.data.length != undefined) {
      for (let i = 0; i < e.rowIndexes.length; i++) {
        this.selectedTransactionIds = this.selectedTransactionIds + e.data[i].Id + "^";
        this.IndexIdJson.push({ Id: e.data[i].Id, Index: e.rowIndexes[i] });
      }
    }
    else {
      this.selectedTransactionIds = this.selectedTransactionIds + e.data.Id + "^";
      this.IndexIdJson.push({ Id: e.data.Id, Index: e.rowIndexes[0] });
    }
    //this.selectedTransactionIds = this.selectedTransactionIds + this.genericGridData[e.rowIndex].Id + "^";
    //this.IndexIdJson.push({ Id: this.genericGridData[e.rowIndex].Id, Index: e.rowIndex });
  }

  rowDeselected(e) {
    
    if (e.data.length != undefined) {
      for (let i = 0; i < e.rowIndexes.length; i++) {
        let deselectList: string = e.data[i].Id;
        this.selectedTransactionIds = this.selectedTransactionIds.replace(deselectList + '^', '')
      }
    }
    else {
      let deselectList: string = e.data.Id;
      this.selectedTransactionIds = this.selectedTransactionIds.replace(deselectList + '^', '')
    }
    //let deselectList: string = this.genericGridData[e.rowIndex].Id;
    //this.selectedTransactionIds = this.selectedTransactionIds.replace(deselectList + '^', '')
  }

  rowSelectedForms(e) {
    //let formId = this.formsGrid[e.rowIndex].Id;
    let formId = e.data["FormId"];
    sessionStorage.setItem("IsAuth", "true");
    this.router.navigate(['/flexwf/form-renderer', -1, this.stepid, this.ActionName, 'workflow', this.WorkflowId, formId]);
  }



  public SelectedRowIndex: number[] = [];
  ValidationTransactionId: number;
  fnExecuteAction() {
    
    let StepActionComments = this.Comments.value;
    this._service.ExecuteAction(this.selectedTransactionIds, this.stepActionId, this.WorkflowsDetails.EntityId, this.loggedInUserId, this.WorkflowsDetails.Id, StepActionComments)
      .subscribe(
        data => {
          this.selectedTransactionIds = '';
          //In case of Validation Voilation, we need to highlight the row in which Validation error is coming.
          if (data.indexOf('_#') > 0) {
            this.ValidationTransactionId = + data.slice(data.indexOf('#') + 1, data.indexOf('_#'));
            let ItemIndex = this.IndexIdJson.findIndex(item => item.Id === this.ValidationTransactionId);
            this.SelectedRowIndex.push(this.IndexIdJson[ItemIndex].Index);
            this.genericgrid.selectRows(this.SelectedRowIndex);

            data = data.replace("TransactionId#" + this.ValidationTransactionId.toString() + "_#", "");

            this.ValidationTransactionId = null;

          }

          this.selectedTransactionIds = '';
          this.IndexIdJson = [];

          this.toastObj.timeOut = 0;
          this.toasts[3].content = data;
          this.toastObj.show(this.toasts[3]);
          this.GetGridData(this.stepid);
          //this.genericgrid.refresh();




          //this.selectedTransactionIds = '';
          //this.toastObj.timeOut = 3000;
          ////We are recieving Message with a prefix which will decide that at what type of Toast we will display to user. It can be Success,warning and Error
          //let MsgPrefix: string = data[0].OutputMessage.substring(0, 2);
          //let Showmsg: string = data[0].OutputMessage.substring(2, data[0].OutputMessage.length);
          //if (MsgPrefix == 'S:') {//Means success
          //  this.toasts[1].content = Showmsg;
          //  this.toastObj.show(this.toasts[1]);
          //  //Getting data for genericGrid by StepId(tab)
          //  this.GetGridData(this.stepid);
          //  this.genericgrid.refresh();
          //}
          //else if (MsgPrefix == 'I:') {//Information message
          //  this.toasts[3].content = Showmsg;
          //  this.toastObj.show(this.toasts[3]);
          //  //Getting data for genericGrid by StepId(tab)
          //  this.GetGridData(this.stepid);
          //  this.genericgrid.refresh();
          //}
          //else if (MsgPrefix == 'W:') {//Warning Message
          //  this.toasts[0].content = Showmsg;
          //  this.toastObj.show(this.toasts[0]);
          //  //Getting data for genericGrid by StepId(tab)
          //  this.GetGridData(this.stepid);
          //  this.genericgrid.refresh();
          //}
          //else {//Error Message
          //  this.toastObj.timeOut = 0;
          //  this.toasts[2].content = Showmsg;
          //  this.toastObj.show(this.toasts[2]);

          //  //Getting data for genericGrid by StepId(tab)
          //  //this.GetGridData(this.stepid);
          //  //this.genericgrid.refresh();

          //  //Show error row highlighted

          //  let ItemIndex = this.IndexIdJson.findIndex(item => item.Id === data[0].ValidationErrorTransactionId);
          //  this.SelectedRowIndex.push(this.IndexIdJson[ItemIndex].Index);
          //  this.genericgrid.selectRows(this.SelectedRowIndex);
          //  this.IndexIdJson = [];
          //}

          //this.pagesize = this.genericgrid.pageSettings.pageSize;

        });
  }

  //It will ba called whenever we will click any toolbar action
  SubProcessData: any;
  clickHandler(args: ClickEventArgs): void {
    
    this.toastObj.timeOut = 3000;

    this.selectedTransactionIds = this.selectedTransactionIds.substring(0, (this.selectedTransactionIds.length) - 1);
    let tranArray: string[] = this.selectedTransactionIds.split('^');
    let transCount: number = tranArray.length;

    this.ActionName = args.item.tooltipText;
    let text: string = args.item.text;
    if (text == 'CSV Export') {
      this.genericgrid.csvExport();
    }
    else if (text == 'Print') {
      return;
    }
    else if (text == 'PDF Export') {
      this.genericgrid.pdfExport();
    }
    else if (text == 'Excel Export') {
      this.genericgrid.excelExport();
    }
    else if (text == 'RV') {
      sessionStorage.setItem("IsAuth", "true");
      this.router.navigate(['/flexwf/form-renderer', this.selectedTransactionIds, this.stepid, 'Review', 'workflow', this.WorkflowId, null]);
    }
    else if (text == 'Sub Processes Progress') {
      if (transCount == 1 && tranArray[0] == '') {
        this.toasts[3].content = "No selected record found";
        this.toastObj.timeOut = 0;
        this.toastObj.show(this.toasts[3]);
        this.genericgrid.refresh();
        this.selectedTransactionIds = "";
        return;
      }
      else if (transCount > 1) {
        this.toasts[3].content = "You selected more than one transaction. Please select only one for this action";
        this.toastObj.timeOut = 0;
        this.toastObj.show(this.toasts[3]);
        this.genericgrid.refresh();
        this.selectedTransactionIds = "";
        return;
      }
      else {

        //Make subProcesses grid here
        this._SubProcessService.GetSubProcessesByParentTxnId(tranArray[0])
          .subscribe(
            data => {
              this.SubProcessData = data;
              this.ShowSubProgressPopUp = true;
            }
          );
      }

    }

    else if (text == 'Make Active') {
      this._service.MakeTxnActive(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId, this.selectedTransactionIds)
        .subscribe(
          data => {
            this.toasts[1].content = "Transaction will be visible on Active tab now.";
            this.toastObj.show(this.toasts[1]);
            this.selectedTransactionIds = "";
            this.GetGridData(this.stepid);
            this.genericgrid.refresh();
            return;
          }
        );
    }

    else if (this.ActionName == 'Create') {
      // sessionStorage.setItem("IsAuth", "true");
      //this.router.navigate(['/flexwf/form-renderer', -1, this.stepid, this.ActionName, 'workflow', this.WorkflowId]);
      this._formDesignerService.GetAvailableForms('FlexTables', this.WorkflowsDetails.EntityId, this.UserRoleId)
        .subscribe(data => {
          if (data == null || data.length == 0) {//no form is configured
            sessionStorage.setItem("IsAuth", "true");//Authorization is applied on Form-Renderer. So this statement will make Form renderer authorized otherwise user wont be able to move on this page.
            this.router.navigate(['/flexwf/form-renderer', -1, this.stepid, this.ActionName, 'workflow', this.WorkflowId, -1]);
          }
          else if (data.length == 1) {//one form is configured
            sessionStorage.setItem("IsAuth", "true");
            let formId = data[0]['FormId'];
            this.router.navigate(['/flexwf/form-renderer', -1, this.stepid, this.ActionName, 'workflow', this.WorkflowId, formId]);
          }
          else// some form is configured
          {
            this.ShowFormsDialoge = true;
            this.formsData = data;
          }
        });

    }
    else if (args.item.id == 'grid_1359498477_1_search') {
      return;
    }

    else {
      //Checking whether user select any transaction before clicking on action


      if (transCount == 1 && tranArray[0] == '') {
        this.toasts[3].content = "No selected record found";
        this.toastObj.timeOut = 0;
        this.toastObj.show(this.toasts[3]);
        this.genericgrid.refresh();
        this.selectedTransactionIds = "";
        return;
      }

      //Getting is clicked action is Mass Action or not
      this.stepActionId = args.item.id;
      this._service.IsMassAction(this.stepActionId)
        .subscribe(
          data => {
            console.log(data);

            if (transCount > 1 && data == false) {
              this.toasts[3].content = "You selected more than one transaction. Please select only one for this action";
              this.toastObj.timeOut = 0;
              this.toastObj.show(this.toasts[3]);
              //alert("You selected more than one transaction. Please select only one for this action");
              this.genericgrid.refresh();
              this.selectedTransactionIds = "";
              return;
            }
            else if (transCount == 1 && tranArray[0] != '') {
              //If trasactionstatus is canceled then give user a message that he is performing action on cancel transaction and this will make transaction Active
              if (this.transactionStatus == 'Canceled') {
                this.ConfirmationBoxMsg = 'You are performing action on canceled Transaction.It will make Transaction Active. Do you want to continue?';
                this.confirmDialog.show();
                return;
              }
              if (this.ActionName == 'Edit' || this.ActionName == 'Review') {
                sessionStorage.setItem("IsAuth", "true");//This is to stop url tempering
                this._rendererService.GetTransactionDataById(this.selectedTransactionIds, this.EntityType, this.EntityId).
                  subscribe(data => {
                    let FormId = data[0]['FormId']
                    if (FormId == null) {
                      FormId = -1;
                    }
                    this.router.navigate(['/flexwf/form-renderer', this.selectedTransactionIds, this.stepid, this.ActionName, 'workflow', this.WorkflowId, FormId]);
                  });

              }
              else {
                //If trasactionstatus is canceled then give user a message that he is performing action on cancel transaction and this will make transaction Active
                if (this.transactionStatus == 'Canceled') {
                  this.ConfirmationBoxMsg = 'You are performing action on canceled Transaction.It will make Transaction Active. Do you want to continue?';
                  this.confirmDialog.show();
                  return;
                }
                if (this.ActionName == 'Cancel') {
                  this.ConfirmationBoxMsg = 'Are you sure you want to cancel these items ?';
                  this.confirmDialog.show();
                  return;
                }

                this.fnExecuteAction();
              }
            }
            else { //means transactionCount>1 and action is Mass Action
              if (this.transactionStatus == 'Canceled') {
                this.ConfirmationBoxMsg = 'You are performing action on canceled Transaction.It will make Transaction Active. Do you want to continue?';
                this.confirmDialog.show();
                return;
              }
              if (args.item.tooltipText == 'Cancel') {
                this.ConfirmationBoxMsg = 'Are you sure you want to cancel these items ?';
                this.confirmDialog.show();
                return;
              }

              this.fnExecuteAction();
            }


          }
        );

    }
  }

  public recordDoubleClick(args): void {
    let isAssigned = JSON.stringify(this.gridStepAction).includes('Review');
    if (isAssigned) {
      sessionStorage.setItem("IsAuth", "true");//This is to stop url tempering
      this.router.navigate(['/flexwf/form-renderer', args.rowData['Id'], this.stepid, 'Review', 'workflow', this.WorkflowId, -1]);
    }
    else {
      this.toasts[2].content = "You do not have rights to review";
      this.toastObj.show(this.toasts[2]);
    }

  }

  contextMenuClick(args: MenuEventArgs): void {
    let ContextMenutext: string = args.item.text;
    if (ContextMenutext == 'Edit' || ContextMenutext == 'Review' || ContextMenutext == 'Create') {
      sessionStorage.setItem("IsAuth", "true");
      this.router.navigate(['/flexwf/form-renderer']);
    }
    else {
      if (ContextMenutext == 'Delete') {
        this.confirmDialog.show();
        return;
      }

      this.selectedTransactionIds = this.selectedTransactionIds.substring(0, (this.selectedTransactionIds.length) - 1);
      this.stepActionId = args.item.id;
      this.fnExecuteAction();

    }
  }
  //This function will get step data to show on BranchPopUp
  fnBranchPopUp(BranchStepId) {
    this.ShowBranchPopupFlag = true;
    this._service.GetBranchStepInfo(BranchStepId)
      .subscribe(
        data => {
          this.branchStepInfo = data;
        }
      );
  }

  fnChangeStep() {

    let selectedRecord: object;
    selectedRecord = this.branchStepGrid.getSelectedRecords();

    //Getting Tabs details with forcedStep
    const callback2: Ajax = new Ajax(
      this.baseUrl + '/GenericGrid/GetStepsByWorkflow?WorkFlowId=' + this.WorkflowId + '&ForcedBranchStepId=' + selectedRecord[0].StepId + '&LoggedInRoleId=' + this.loggedInRoleId, 'GET', false, 'application/json; charset=utf-8'
    );
    callback2.onSuccess = (data: any): void => {


      //this.TabsDetails = JSON.parse(data);
      //sessionStorage.setItem("ChangeTabDetails", JSON.stringify(this.TabsDetails));
      //this.router.navigate(['/flexwf/generic-grid-changestep', this.selectedStepId]);//Passing selectedstepId because need to show this tab selected to front end user

      this.TabsDetails = JSON.parse(data);
      sessionStorage.setItem("ChangeTabDetails", JSON.stringify(this.TabsDetails));
      //this.router.navigate(['/flexwf/generic-grid-changestep', 285]);//Passing selectedstepId because need to show this tab selected to front end user
      window.location.reload();

      //this.zone.run(() => {
      //  //this.router.navigate(['/flexwf/roles']);
      //  this.router.navigateByUrl("/flexwf/roles");
      //});

      //this.router.navigate(['/flexwf/generic-grid-changestep', selectedRecord[0].StepId]);//Passing selectedstepId because need to show this tab selected to front end user
    };
    callback2.send().then();
  }


  //test() {
  //  this.router.navigate(['/flexwf/roles']);
  //  //this.router.navigate(['/flexwf/generic-grid-changestep', 288]);
  //}
  //------------------------------------------------------method created by RS on 18th June 2020------------------------->
  public ShowDiagramPopUp: boolean = false;

  //method to show the diagram on a pop up of the respective WF
  showDiagram() {
    this.ShowDiagramPopUp = true;
    this.diagram.fitToPage();
    this.GetNodes();
  }

  //method to get the stepid on it's clicking
  click(args: IClickEventArgs) {
    this.ShowDiagramPopUp = false;
    let objclick = args.element;
    if (objclick instanceof Node) {
      let rowIndex = this.TabsDetails.findIndex(x => x.NVarcharId == objclick["id"]);

      if (rowIndex == -1)//It means user selected a tab which is not loaded already
      {
        //Getting StepId from step NVarcharId
        const callback1: Ajax = new Ajax(
          this.baseUrl + '/WorkflowDesigner/GetStepDetailfromNVarcharId?WorkflowId=' + this.WorkflowId + '&Nvarcharid=' + objclick["id"], 'GET', false, 'application/json; charset=utf-8'
        );
        callback1.onSuccess = (data: any): void => {
          let stepdata = JSON.parse(data);
          this.selectedStepId = stepdata.Id;
        };
        callback1.send().then();

        //Now we need to get new TabDetails containing to selected Tab
        //Getting Tabs details with forcedStep
        const callback: Ajax = new Ajax(
          this.baseUrl + '/GenericGrid/GetStepsByWorkflow?WorkFlowId=' + this.WorkflowId + '&ForcedBranchStepId=' + this.selectedStepId + '&LoggedInRoleId=' + this.loggedInRoleId, 'GET', false, 'application/json; charset=utf-8'
        );
        callback.onSuccess = (data: any): void => {

          this.TabsDetails = JSON.parse(data);
          sessionStorage.setItem("ChangeTabDetails", JSON.stringify(this.TabsDetails));
          window.location.reload();
          // this.router.navigate(['/flexwf/generic-grid-changestep', this.selectedStepId]);//Passing selectedstepId because need to show this tab selected to front end user
        };
        callback.send().then();
      }
      else//It means user selected already loaded tab
      {
        this.tabObj.select(rowIndex);
      }
    }

  }



  //connector definition
  connDefaults(obj: Connector): void {
    if (obj.id.indexOf('connector') !== -1) {
      obj.type = 'Orthogonal';
      obj.targetDecorator = { shape: 'Arrow', width: 10, height: 10 };
    }
  }

  //node definition
  getNodeDefaults(node: NodeModel) {
    let obj: NodeModel = {};
    if (obj.width === undefined) {
      obj.width = 145;
    } else {
      let ratio: number = 100 / obj.width;
      obj.width = 100;
      obj.height *= ratio;
    }
    obj.style = { fill: '#357BD2', strokeColor: '#717171' };
    obj.annotations = [{ style: { color: 'white', fill: 'transparent' } }];
    obj.ports = getPorts(node);
    return obj;
  }

  //method to get nodes of the respective WF
  GetNodes() {
    const callback: Ajax = new Ajax(
      this.baseUrl + '/WorkflowDesigner/GetWFNodes?WorkflowId=' + this.WorkflowsDetails.Id, 'GET', false, 'application/json; charset=utf-8'
    );
    callback.onSuccess = (JsonString: any): void => {
      let diagramInstance = this;
      setTimeout(function () {
        //get a diagram node from database 
        let parsedData = JSON.parse(JsonString);
        if (parsedData.length > 0) {
          //iterate a  node data 
          for (let i = 0; i < parsedData.length; i++) {
            //create a node 
            let node: NodeModel = {
              id: parsedData[i].nodeId, offsetX: parsedData[i].offsetX, offsetY: parsedData[i].offsetY,
              annotations: [{ content: parsedData[i].annotation }],
              shape: { type: parsedData[i].shapeType, shape: parsedData[i].shapeName }
            }
            //add a node in the diagram dynamically using add method.
            diagramInstance.diagram.add(node);
          }
        }
      }, 100)
    };
    callback.send().then();
    this.GetConnectors();//after nodes render then only we will get the connectors data
  }

  //method to get the connectors of the respective Workflow
  GetConnectors() {
    const getconnectors: Ajax = new Ajax(
      this.baseUrl + '/WorkflowDesigner/GetWFConnectors?WorkflowId=' + this.WorkflowsDetails.Id, 'GET', false, 'application/json; charset=utf-8'
    );
    getconnectors.onSuccess = (JsonString: any): void => {
      let diagramInstance = this;
      setTimeout(function () {
        //get a diagram node from database 
        let parsedData = JSON.parse(JsonString);
        //console.log(JsonString);
        if (parsedData.length > 0) {
          //iterate a  node data 
          for (let i = 0; i < parsedData.length; i++) {
            //create a node 
            let conn: ConnectorModel = {
              id: parsedData[i].connectorId, sourceID: parsedData[i].sourceID, targetID: parsedData[i].targetID, annotations: [{ content: parsedData[i].annotation, style: { fill: "white" } }]

            }
            //console.log(node)
            //add a node in the diagram dynamically using add method. 
            diagramInstance.diagram.add(conn);

          }
        }
      }, 100)
    };
    getconnectors.send().then();
    //this.LoadDiagram();
  }

  //--------------------------------------------------------------------------------------------------------------
  FilePath: string;
  ProjectName: string = sessionStorage.getItem("DefaultEntityName");
  //path for support docs
  public TargetPath: string;//passing this variable in supporting Document selector
  DownloadTemplate() {

    this.TargetPath = this.FilePath + "/attachments";
    let TemplatePath = this.FilePath + "/template";
    this._rendererService.GenerateTemplateFileName(this.ProjectId, "FlexTables", this.WorkflowsDetails.EntityId)
      .subscribe(filename => {
        //this._SupportDocService.DownloadFromS3(TemplatePath, filename);
        this._SupportDocService.DownloadFromS3(TemplatePath + "/" + filename);
      })

  }

  OpenUploader() {
    sessionStorage.removeItem("UploadedFile");
    //this.showUploader = true;
    this.router.navigate(['/flexwf/TransactionUpload', 'FlexTables', this.WorkflowsDetails.EntityId, this.ProjectId, this.WorkflowId]);

  }
  //This event will be called after uploading the file
  PostUploadEvent(event) {
    var UploadedFileInfo = JSON.parse(sessionStorage.getItem("UploadedFile"));
    if (UploadedFileInfo != null) {
      this._rendererService.ReadAndValidateExcelData(UploadedFileInfo[0]['FileName'], "FlexTables", this.WorkflowsDetails.EntityId,
        this.ProjectId, this.loggedInUserId, this.loggedInRoleId, 'DeltaLoad')
        .subscribe(data => { console.log('here in subscribe') });
    }
  }

  ngOnDestroy() {
    document.getElementById("element").remove();
  }
}
function getPorts(obj: NodeModel): PointPortModel[] {
  let ports: PointPortModel[] = [
    { id: 'port1', shape: 'Circle', offset: { x: 0, y: 0.5 } },
    { id: 'port2', shape: 'Circle', offset: { x: 0.5, y: 1 } },
    { id: 'port3', shape: 'Circle', offset: { x: 1, y: 0.5 } },
    { id: 'port4', shape: 'Circle', offset: { x: 0.5, y: 0 } }
  ];
  return ports;
}
