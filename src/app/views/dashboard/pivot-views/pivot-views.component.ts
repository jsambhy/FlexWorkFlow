import { Component, OnInit, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { IDataOptions, FieldListService, PivotView, DisplayOption, PivotChartService, IDataSet, GroupingBarService, PivotViewComponent } from '@syncfusion/ej2-angular-pivotview';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { ChartSettings } from '@syncfusion/ej2-pivotview/src/pivotview/model/chartsettings';
import { enableRipple } from '@syncfusion/ej2-base';
import { ReportPivotViewsService } from '../../../services/reportpivotviews.service';
import { SwitchComponent } from '@syncfusion/ej2-angular-buttons';
import { DashboardDetailsModel } from '../../../models/dashboard-detail-model';
/*enableRipple(false);*/
@Component({
  selector: 'app-pivot-views',
  templateUrl: './pivot-views.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./pivot-views.component.css'],
  /*providers: [FieldListService, PivotChartService]*/
  providers: [GroupingBarService, FieldListService, PivotChartService]
})

export class PivotViewsComponent implements OnInit {
    constructor(private _Service: ReportPivotViewsService) {

  }
  @Input() source;
  @Input() panelId;
  @Input() configJson;
  public dataSourceSettings: IDataOptions;
  public chartddl: DropDownList;
  public chartSettings: ChartSettings;
  public displayOption: DisplayOption;  showChart = false;
 showGrid = true;
  @Input() jsonSource; @Input() chartSource;
  modeldata: DashboardDetailsModel = new DashboardDetailsModel();
  //@ViewChild('pivotview')
  //public pivotObj: PivotViewComponent;
    @ViewChild('pivotview', { static: false })
  public pivotGridObj: PivotViewComponent;
  public chartTypes = [
    "Column",
    "Bar",
    "Line",
    "Spline",
    "Area",
    "SplineArea",
    "StepLine",
    "StepArea",
    "StackingColumn",
    "StackingBar",
    "StackingArea",
    "StackingColumn100",
    "StackingBar100",
    "StackingArea100",
    "Scatter",
    "Bubble",
    "Polar",
    "Radar",
    "Pareto",
    "Pie",
    "Doughnut",
    "Funnel",
    "Pyramid"
  ];
    @ViewChild('ViewType', { static: false })
  public ViewType: SwitchComponent;
/*  public chartddl: DropDownList;*/
  public showDD: boolean;
  selectedUnit: string; UserRoleId: number;
  public height: string = '220px';
  public waterMark: string = 'Select a chart type';
  public myArray: any[]; public selectedChartName: string;
  public onChange(args: any): void {
    this.pivotGridObj.chartSettings.chartSeries.type = args.value as any;
    this.myArray = JSON.parse(this.configJson)
    this.myArray.valueOf()['chartType'] = args.value;
    let updatedjsonstring = JSON.stringify(this.myArray);
    this.modeldata.PanelId = this.panelId;
    /* this.modeldata.ConfigJson = this.configJson;*/
    this.modeldata.ConfigJson = updatedjsonstring;
    this.modeldata.UserRoleId = this.UserRoleId;
    
    this._Service.UpdatePivotJson(this.modeldata)
      .subscribe(
        data => { });
  }
  //  onChange(args: ChangeEventArgs): void {
  //  
  //  this.chartSettings = { chartSeries: { type: args.value } } as ChartSettings;
  //  this.myArray = JSON.parse(this.configJson)
  //  this.myArray.valueOf()['chartType'] = args.value;
  //  let updatedjsonstring = JSON.stringify(this.myArray);
  //  this.modeldata.PanelId = this.panelId;
  //  /* this.modeldata.ConfigJson = this.configJson;*/
  //  this.modeldata.ConfigJson = updatedjsonstring;
  //  this._Service.UpdatePivotJson(this.modeldata)
  //    .subscribe(
  //      data => { });
  //}
  /* tslint:disable */
  ngOnInit(): void {
   
    this.UserRoleId = +sessionStorage.getItem("UserRoleId");
    this.chartSettings = {
      //title: 'Sales Analysis',
      //chartSeries: { type: 'Column' },
      title: JSON.parse(this.configJson)['Label'],
     chartSeries: { type: JSON.parse(this.configJson)['chartType'] },
    } as ChartSettings;

    this.displayOption = { view: 'Chart' } as DisplayOption;
    let PivotJson = JSON.parse(this.chartSource);
   
    this.dataSourceSettings = {
      enableSorting: true,
      rows: PivotJson['rows'],
      values: PivotJson['values'],
      //rows: [{ "name": "#Boys", "caption": "Boys Y axis" }],
      //values: [{ "name": "#Girls", "caption": "Girls" }],
      columns: PivotJson['columns'],
      dataSource: this.getPivotData(),
      expandAll: true,
      formatSettings: PivotJson['formatsetting'],
      filters: []
    };
    this.chartddl = new DropDownList({
      placeholder: "Chart Types",
      floatLabelType: "Auto",
      change: this.onChange.bind(this),
      value: JSON.parse(this.configJson)['chartType']
    });
    this.chartddl.appendTo('#charttypesddl');
  }

  getPivotData() {
    let data = JSON.parse(this.jsonSource);
   
    return data;
  }
    change(event) {
    if (event.checked == true) { //chart view
      this.showChart = true;
      this.showGrid = false;
      this.showDD = true;
      this.selectedChartName = JSON.parse(this.configJson)['chartType'];
    }
    else { //grid view
      this.showChart = false;
      this.showGrid = true;
      this.showDD = false;
      this.selectedChartName = JSON.parse(this.configJson)['chartType'];
    }
  }

}
/** pivot component*/
//export class PivotViewsComponent {
//  /** pivot ctor */
//  constructor(private _Service: ReportPivotViewsService) {

//  }
//  Source: Object[] = [{ text: 'Column', value: 'Column' },
//  { text: 'Bar', value: 'Bar' },
//  { text: 'Line', value: 'Line' },
//  { text: 'Spline', value: 'Spline' },
//  { text: 'Area', value: 'Area' },
//  { text: 'SplineArea', value: 'SplineArea' },
//  { text: 'StepLine', value: 'StepLine' },
//  { text: 'StepArea', value: 'StepArea' },
//  { text: 'StackingColumn', value: 'StackingColumn' },
//  { text: 'StackingBar', value: 'StackingBar' },
//  { text: 'StackingArea', value: 'StackingArea' },
//  { text: 'StackingColumn100', value: 'StackingColumn100' },
//  { text: 'StackingBar100', value: 'StackingBar100' },
//  { text: 'StackingArea100', value: 'StackingArea100' },
//  { text: 'Scatter', value: 'Scatter' },
//    { text: 'Bubble', value: 'Bubble' },
//    { text: 'Polar', value: 'Polar' },
//    { text: 'Radar', value: 'Radar' }, { text: 'Pareto', value: 'Pareto' }, { text: 'Pie', value: 'Pie' }

//    , { text: 'Doughnut', value: 'Doughnut' }
//    , { text: 'Funnel', value: 'Funnel' }
//    , { text: 'Pyramid', value: 'Pyramid' }
//  ];
//  DataFields: Object = { text: 'text', value: 'value' };
//  modeldata: DashboardDetailsModel = new DashboardDetailsModel();
//  @Input() jsonSource;
//  @Input() chartSource;
//  @Input() source;
//  @Input() panelId;
//  @Input() configJson;
//  public pivotData: any[];
//  public dataSourceSettings: IDataOptions;
//  public displayOption: DisplayOption;
//  public chartSettings: ChartSettings;
//  public myArray: any[]; public selectedChartName: string;
//  onChange(args: ChangeEventArgs): void {
//    
//    this.chartSettings = { chartSeries: { type: args.value } } as ChartSettings;
//    this.myArray = JSON.parse(this.configJson)
//    this.myArray.valueOf()['chartType'] = args.value;
//    let updatedjsonstring = JSON.stringify(this.myArray);
//    this.modeldata.PanelId = this.panelId;
//    /* this.modeldata.ConfigJson = this.configJson;*/
//    this.modeldata.ConfigJson = updatedjsonstring;
//    this._Service.UpdatePivotJson(this.modeldata)
//      .subscribe(
//        data => { });
//  }

//  public chartTypesDropDown: DropDownList;
//  @ViewChild('pivotview', { static: false })
//  public pivotGridObj: PivotViewComponent;



//  @ViewChild('ViewType', { static: false })
//  public ViewType: SwitchComponent;
//  public chartddl: DropDownList;
//  public showDD: boolean;
//  selectedUnit: string;
//  @ViewChild('pivotview', { static: false })
//  public pivotObj: PivotView;

//  //demo 1
//  showChart = true;
//  showGrid = true;
//  ngOnInit(): void {
//    

//    console.log(this.configJson)
//    console.log(this.panelId)
//    console.log(this.jsonSource)
//    console.log(this.chartSource)
//    if (this.source == "design") {
//      this.showDD = true;

//    }
//    else {
//      this.showDD = false;
//    }
//    this.selectedChartName = JSON.parse(this.configJson)['chartType'];
//    this.pivotData = JSON.parse(this.jsonSource)
//    this.chartSettings = {
//      title: JSON.parse(this.configJson)['Label'],
//      chartSeries: { type: JSON.parse(this.configJson)['chartType'] },

//    } as ChartSettings;

//    this.displayOption = { view: 'Chart' } as DisplayOption;
//    let PivotJson = JSON.parse(this.chartSource);
//    this.dataSourceSettings = {
//      enableSorting: true,
//      rows: PivotJson['rows'],
//      values: PivotJson['values'],
//      columns: PivotJson['columns'],
//      dataSource: this.pivotData,
//      expandAll: true,
//      formatSettings: PivotJson['formatsetting'],
//      filters: []
//    };

//  }

//  //**************************************************************************************************************************
//  // demo 2
//  //ngOnInit(): void {
//  //  this.pivotData = JSON.parse(this.jsonSource)
//  //  this.chartSettings = {
//  //    title: JSON.parse(this.chartSource)['title'],
//  //    chartSeries: { type: JSON.parse(this.chartSource)['chartType'] },      
//  //  } as ChartSettings;

//  //  this.displayOption = { view: 'Chart' } as DisplayOption;

//  //  this.dataSourceSettings = {
//  //    enableSorting: true,
//  //    columns: [{ name: JSON.parse(this.chartSource)['columns'][0].name}],
//  //    rows: [{ name: JSON.parse(this.chartSource)['rows'][0].name }],
//  //    values: [{ name: JSON.parse(this.chartSource)['values'][0].name }],  
//  //    valueSortSettings: { headerDelimiter: ' - ' },
//  //    dataSource: this.pivotData,
//  //    expandAll: true,
//  //    formatSettings: [{ name: JSON.parse(this.chartSource)['values'][0].name, format: JSON.parse(this.chartSource)['formatName'] }],    
//  //    filters: []
//  //  };

//  //  //this.chartddl = new DropDownList({
//  //  //    placeholder: "Chart Types",
//  //  //    floatLabelType: "Auto",
//  //  //    change: this.onChange.bind(this) 
//  //  //});
//  //  //this.chartddl.appendTo('#charttypesddl');
//  //}
//  change(event) {
//    if (event.checked == true) { //chart view
//      this.showChart = true;
//      this.showGrid = false;
//      this.showDD = true;
//      this.selectedChartName = JSON.parse(this.configJson)['chartType'];
//    }
//    else { //grid view
//      this.showChart = false;
//      this.showGrid = true;
//      this.showDD = false;
//      this.selectedChartName = JSON.parse(this.configJson)['chartType'];
//    }
//  }
//}
 //let data = [{
    //  "In_Stock": 34,
    //  "Sold": 51,
    //  "Amount": 383,
    //  "Country": "France",
    //  "Product_Categories": "Accessories",
    //  "Products": "Bottles and Cages",
    //  "Order_Source": "Retail Outlets",
    //  "Year": "FY 2015",
    //  "Quarter": "Q1"
    //},
    //{
    //  "In_Stock": 4,
    //  "Sold": 423,
    //  "Amount": 3595.5,
    //  "Country": "France",
    //  "Product_Categories": "Accessories",
    //  "Products": "Bottles and Cages",
    //  "Order_Source": "Sales Person",
    //  "Year": "FY 2015",
    //  "Quarter": "Q1"
    //},
    //{
    //  "In_Stock": 38,
    //  "Sold": 234,
    //  "Amount": 1813.5,
    //  "Country": "France",
    //  "Product_Categories": "Accessories",
    //  "Products": "Bottles and Cages",
    //  "Order_Source": "Teleshopping",
    //  "Year": "FY 2015",
    //  "Quarter": "Q1"
    //},


    //];
