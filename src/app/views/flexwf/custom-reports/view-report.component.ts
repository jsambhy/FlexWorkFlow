import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GridComponent, ExcelExportService, PdfExportService, ToolbarService, FilterSettingsModel, TextWrapSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { IDataOptions } from '@syncfusion/ej2-angular-pivotview';
import { isUndefined } from 'util';
import { SchedulerModel, ViewReportDataModel } from '../../../models/scheduler-model';

import { ReportService } from '../../../services/report.service';
import { ReportPivotViewsService } from '../../../services/reportpivotviews.service';
import { SupportingDocumentService } from '../../../services/supporting-document.service';

@Component({
    selector: 'app-view-report',
    templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.css'],
  providers: [ToolbarService, ExcelExportService, PdfExportService]
})
/** ViewReport component*/
export class ViewReportComponent {
  ReportId: number;
  ReportData: any;
  Source: string;
  PivotViewId: number;
  ReportGroupId: number;
  PivotViewData: any;
  showOnlyReport: Boolean = false;
  showPivot: Boolean = false;
  LoggedInUserId: number;
  LoggedInRoleId: number;
  LoggedInScopeEntityId: number;
  LoggedInScopeEntityType: string;
  toolbar: object;
  filterSettings: FilterSettingsModel;
  public UserRoleId: number;
  ParamJson: string;
  SchedulerRunId: number;
  SchedulerModel = new SchedulerModel();
  ViewReportDataModel = new ViewReportDataModel();
 

  @ViewChild('ViewReportGrid', { static: false })
  public ViewReportGrid: GridComponent;

  public dataSourceSettings: IDataOptions;
  constructor(private route: ActivatedRoute,
    private _service: ReportService,
    private _pivotService: ReportPivotViewsService,
    private _SupportingDocService: SupportingDocumentService,
    private router: Router  ) {
    this.LoggedInUserId = +sessionStorage.getItem("LoggedInUserId");
    this.LoggedInRoleId = +sessionStorage.getItem("LoggedInRoleId");
    this.UserRoleId = +sessionStorage.getItem("UserRoleId");
    this.LoggedInScopeEntityId = +sessionStorage.getItem("LoggedInScopeEntityId");
    this.LoggedInScopeEntityType = sessionStorage.getItem("LoggedInScopeEntityType");
    }

  ngOnInit() {
    
    this.route.params.subscribe(val => {
      
      //Getting ReportId from parameters
      this.route.params.subscribe((params: Params) => {
        this.ReportId = parseInt(params['Id']);
        this.Source = (params['Source']);
      });

      this.toolbar = ['ExcelExport','CsvExport', 'Search'];
      this.filterSettings = { type: 'Excel' }; // inorder to remove extra filtering from the grid we set it to this type.

      this.ParamJson = '{ "UserProvided": [], "Fixed": [{ "@UserId":' + this.LoggedInUserId + ',"@RoleId":' + this.LoggedInRoleId + ',"@EntityType":"' + this.LoggedInScopeEntityType + '","@EntityId":' + this.LoggedInScopeEntityId + '}] }';
      //this.ParamJson = '{ "UserProvided": [{ "Period": { "Operator": "=", "value1": "^2021-06^" } }, { "Employee Name": { "Operator": "in", "value1": "^d.salunke@bagelectronics.in^" } }], "Fixed": [{ "@UserId":' + this.LoggedInUserId + ',"@RoleId":' + this.LoggedInRoleId + ',"@EntityType":"' + this.LoggedInScopeEntityType + '","@EntityId":' + this.LoggedInScopeEntityId + '}] }';
      var PreviousReportId = +sessionStorage.getItem("ReportId");
      var PreviousViewReportSource = sessionStorage.getItem("ViewReportSource");

      sessionStorage.setItem("ReportId", this.ReportId.toString());
      sessionStorage.setItem("ViewReportSource", this.Source);

      if (PreviousReportId != this.ReportId || PreviousViewReportSource != this.Source) {
        window.location.reload();

      }
      else {

        if (this.Source == "ReportGroup") {
          
          this.ReportGroupId = this.ReportId;
          this.GetReportIdByRptGrpId();
          this.GetReportGroupName(this.ReportGroupId);
          //this.SaveScheduler();
         
        }
        else {
          this.GetReportHeader();//main Report header
         
          if (this.Source == "PivotView") {//means we come from Pivot View Menu Item
            this.PivotViewId = this.ReportId;
            this.showPivot = true;
            //Get Pivot View Details here
            this._pivotService.GetById(this.PivotViewId)
              .subscribe(
                data => {
                  this.PivotViewData = data;
                  this.ReportId = data['ReportId'];
                  this.GetReportData();
                }
              );
          }
          else {
            this.GetHeaderOfReportGridData();//Data Header
            this.showOnlyReport = true;
            this.IsParametersExist(this.ReportId);
            //this.GetReportData();
          }
        }
      }
    });

  }

  

 
  GetReportIdByRptGrpId() {
    this._service.GetReportIdByRptGrpId(this.ReportGroupId)
      .subscribe(
        MasterReportId => {
          this.IsParametersExist(MasterReportId);
          this.ReportId = MasterReportId;
        });
  }

  ShowParamScreen: Boolean = false;
  IsParametersExist(ReportId) {
    this._service.IsParametersExist(ReportId)
      .subscribe(
        ReportParamCount => {
          if (ReportParamCount > 0) {
            this.ShowParamScreen = true;
          }
          else {

            if (this.Source == "ReportGroup") {
              //Before showing Scheduler screen, Process the excel file
              
              this.SaveScheduler();
            }
            else {
              this.GetReportData();
            }
          }
        } );
  }

  SaveScheduler() {
    this.SchedulerModel.ReportGroupId = this.ReportGroupId;
    this.SchedulerModel.LoggedInUserId = this.LoggedInUserId;
    this.SchedulerModel.LoggedInRoleId = this.LoggedInRoleId;
    this.SchedulerModel.ParamJson = this.ParamJson;

    this._service.SaveScheduler(this.SchedulerModel)
      .subscribe(
        SchedulerRunId => {
          this.SchedulerRunId = SchedulerRunId;
          this.ProcessReportGroup();

        }
      );
  }

  ProcessReportGroup() {
    this._service.ProcessReportGroup(this.SchedulerRunId, this.LoggedInUserId)
      .subscribe(
        data => {
          this.router.navigate(['/flexwf/scheduler', this.ReportGroupId]);
         
        }
      );

  }
  
 
  
  toolbarClick(args: ClickEventArgs): void {
    
    if (args.item.id === 'ViewReportGrid_pdfexport') {
      this.ViewReportGrid.pdfExport();
    }
    if (args.item.id === 'ViewReportGrid_excelexport') {
      this.ViewReportGrid.excelExport();
    }
    if (args.item.id === 'ViewReportGrid_csvexport') {
      this.ViewReportGrid.csvExport();
    }
  }
  GetReportData() {
    
    this.ViewReportDataModel.ReportId = this.ReportId;
    this.ViewReportDataModel.ParamJson = this.ParamJson;
    this._service.GetViewReportGridData(this.ViewReportDataModel)
      .subscribe(
        data => {
          this.ReportData = data;
          console.log(this.ReportData);
          if (this.Source == "PivotView") {
            this.PreparePivotDataSrc();
          }
        }
      );
  }

  HeaderList: any;
  GetHeaderOfReportGridData() {
    
    this._service.GetHeaderOfReportGridData(this.ReportId, this.LoggedInUserId, this.LoggedInRoleId)
      .subscribe(
        headers => {
          this.HeaderList = headers;
          console.log(this.HeaderList);
          //this.GetReportData();
        }
    );
  }

  ReportHeader: string;
  EntityName: string;
  GetReportHeader() {
    
    this._service.GetReportName(this.ReportId, this.Source)
      .subscribe(
        ReportName => {
          this.EntityName = 'Parameters - ' + ReportName.Name;
          this.ReportHeader = "Report: " + ReportName.Name;
        }
      );
  }


  GetReportGroupName(ReportGroupId) {
    this._service.GetReportGroupName(ReportGroupId)
      .subscribe(
        ReportGroupName => {
          this.EntityName = 'Parameters - ' + ReportGroupName.Name;
          this.ReportHeader = "Report: " + ReportGroupName.Name;
        }
      );
  }

  PreparePivotDataSrc() {
    
    let PivotJson = JSON.parse(this.PivotViewData.PivotJson);
     this.dataSourceSettings = {
              enableSorting: true,
              rows: PivotJson['rows'],
              values: PivotJson['values'],
              columns: PivotJson['columns'],
              dataSource: this.ReportData,
              expandAll: false,
              //formatSettings: [{
              //  name: JSON.parse(this.chartSource)['values'][0].name, format: JSON.parse(this.chartSource)['formatName'],
              //  currency: JSON.parse(this.chartSource)['currency']
              //}],    // formatSettings: [{ name: "#Boys", format: "N" }],
      
              filters: []
            };
  }

  
  PostParamJsonEvent(val) {
    
    if (val == null || val == '' || isUndefined(val)) { 
      this.ParamJson = '{ "UserProvided": [], "Fixed": [{ "@UserId":' + this.LoggedInUserId + ',"@RoleId":' + this.LoggedInRoleId + ',"@EntityType":"' + this.LoggedInScopeEntityType + '","@EntityId":' + this.LoggedInScopeEntityId + '}] }';
    }
    else {
      this.ParamJson = val;
    }
    this.ShowParamScreen = false;

    if (this.Source == "ReportGroup") {
      this.SaveScheduler();
    }
    else {
      this.GetReportData();
    }
  }
}
