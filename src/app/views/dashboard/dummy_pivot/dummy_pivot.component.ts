import { Component, Input, ViewChild } from '@angular/core';
import { ChangeEventArgs, DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { DisplayOption, FieldListService, GroupingBarService, IDataOptions, IDataSet, PivotChartService, PivotViewComponent } from '@syncfusion/ej2-angular-pivotview';
import { ChartSettings } from '@syncfusion/ej2-pivotview/src/pivotview/model/chartsettings';
@Component({
    selector: 'app-dummy_pivot',
    templateUrl: './dummy_pivot.component.html',
  styleUrls: ['./dummy_pivot.component.css'],

  providers: [GroupingBarService, FieldListService, PivotChartService]
})
/** dummy_pivot component*/
export class Dummy_pivotComponent {
    /** dummy_pivot ctor */
    constructor() {

    }
  @Input() jsonSource;
  @Input() chartSource; 
  public pivotData: any [];
  public dataSourceSettings: IDataOptions;
  public displayOption: DisplayOption;
  public chartSettings: ChartSettings;
  public width: string;
  //ngOnInit(): void {
  //  this.pivotData = /*[{ "Name": "53248", "Age": 26624 }, { "Name": "6656", "Age": 3328 }, { "Name": "Namita", "Age": 18 }, { "Name": "Jas", "Age": 20 }, { "Name": "VG", "Age": 20 }, { "Name": "new", "Age": 13 }, { "Name": "IT", "Age": 11 }, { "Name": "Finance" }, { "Name": "UpdateViasCode", "Age": 22 }, { "Name": "InsertViaCode", "Age": 52 }, { "Name": "RefProcTesting" }, { "Name": "test2", "Age": 20 }, { "Name": "test4", "Age": 30 }, { "Name": "test2", "Age": 20 }, { "Name": "test1", "Age": 1 }, {}, {}, {}, {}, { "Name": "18MayTest" }, { "Name": "new cust", "Age": 10 }, { "Name": "shivangi goyal", "Age": 10 }, { "Name": "Shivani", "Age": 201306 }, { "Name": "Namita", "Age": 113001 }, { "Name": "Rakhi", "Age": 123456 }, { "Name": "Jas", "Age": 144559 }, { "Name": "SB" }, { "Name": "sg" }, { "Name": "Namsin", "Age": 110034 }, { "Name": "Default", "Age": 12345 }, { "Name": "newtest" }, { "Name": "tttttt" }, { "Name": "Edited_1", "Age": 110034 }, { "Name": "Default", "Age": 12345 }, { "Name": "Default", "Age": 12345 }, { "Name": "Txn_IT", "Age": 10 }, { "Name": "Txn_HR" }, { "Name": "Txn_IT", "Age": 10 }, { "Name": "TestCraete", "Age": 12345 }, { "Name": "20May", "Age": 123456 }, { "Name": "20May1", "Age": 123456 }, { "Name": "InsertViaCode", "Age": 52 }, { "Name": "sg" }, { "Name": "newtest", "Age": 2 }, { "Name": "Namita", "Age": 32 }, { "Name": "Namita", "Age": 32 }, { "Name": "Txn_Itupdate29", "Age": 10 }, { "Name": "testsg", "Age": 4 }, { "Name": "sssss", "Age": 1 }, { "Name": "ddcdvffd", "Age": 6 }, { "Name": "wwww", "Age": 3 }, { "Name": "dsf", "Age": 1 }, { "Name": "sgtest29may" }, { "Name": "myname" }, { "Name": "11June" }, { "Name": "gbggbg" }, { "Name": "t1" }, { "Name": "coretest" }, { "Name": "testsg", "Age": 4 }, { "Name": "testsg", "Age": 4 }, { "Name": "testsg", "Age": 4 }, { "Name": "testsg", "Age": 4 }, { "Name": "SgTest1", "Age": 4 }, { "Name": "testing for tags", "Age": 18 }, { "Name": "testing for tags", "Age": 18 }, { "Name": "testing for tags", "Age": 18 }, { "Name": "testing for tags", "Age": 18 }, { "Name": "test for new json", "Age": 1 }, { "Name": "jsontesting SG", "Age": 4 }, { "Name": "jsontesting SG", "Age": 4 }, { "Name": "jsontesting SG" }, { "Name": "fgb" }, { "Name": "SgTes2" }, { "Name": "erfSG", "Age": 4 }]*/
  //    [{ 'Sold': 31, 'Amount': 52824, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2015', 'Quarter': 'Q1' },
  //    { 'Sold': 51, 'Amount': 86904, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2015', 'Quarter': 'Q2' },
  //    { 'Sold': 90, 'Amount': 153360, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2015', 'Quarter': 'Q3' },
  //    { 'Sold': 25, 'Amount': 42600, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2015', 'Quarter': 'Q4' },
  //    { 'Sold': 27, 'Amount': 46008, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2016', 'Quarter': 'Q1' }];
  //  this.dataSourceSettings = {
  //    dataSource: this.pivotData
  //    //columns: [{ name: 'Year', caption: 'Production Year' }, { name: 'Quarter' }], //Collection of fields that needs to be displayed in column axis of the pivot table.
  //    //values: [{ name: 'Sold', caption: 'Units Sold' }, { name: 'Amount', caption: 'Sold Amount' }], //Collection of fields that needs to be displayed as aggregated numeric values in the pivot table.
  //    //rows: [{ name: 'Country' }, { name: 'Products' }],  //Collection of fields that needs to be displayed in row axis of the pivot table.
  //    //  formatSettings: [{ name: 'Amount', format: 'C0' }],
  //    //filters: []
  //  };
  //  this.dataSourceSettings = {
  //    dataSource: this.pivotData,
  //    expandAll: false,
  //    drilledMembers: [{ name: 'Country', items: ['France'] }],
  //    columns: [{ name: 'Year', caption: 'Production Year' }, { name: 'Quarter' }],
  //    values: [{ name: 'Sold', caption: 'Units Sold' }, { name: 'Amount', caption: 'Sold Amount' }],
  //    rows: [{ name: 'Country' }, { name: 'Products' }],
  //    formatSettings: [{ name: 'Amount', format: 'C0' }],
  //    filters: []
  //  };

  //  this.width = '100%';
  //  this.displayOption = { view: 'Chart' } as DisplayOption;
  //  this.chartSettings = { chartSeries: { type: 'Column' } } as ChartSettings;
  //}



  public chartTypesDropDown: DropDownList;
  @ViewChild('pivotview', { static: false })
  public pivotGridObj: PivotViewComponent;

  onChange(args: ChangeEventArgs): void {
    this.chartSettings = { chartSeries: { type: args.value } } as ChartSettings;
  }
  ngOnInit(): void {
    console.log(this.jsonSource);
    //this.griddata = JSON.parse(this.chartSource);
    //console.log(JSON.parse(this.chartSource))
   
    this.pivotData = this.jsonSource;
      //[{ 'Sold': 31, 'Amount': 52824, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2015', 'Quarter': 'Q1' },
      //{ 'Sold': 51, 'Amount': 86904, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2015', 'Quarter': 'Q2' },
      //{ 'Sold': 90, 'Amount': 153360, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2015', 'Quarter': 'Q3' },
      //{ 'Sold': 25, 'Amount': 42600, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2015', 'Quarter': 'Q4' },
      // { 'Sold': 27, 'Amount': 46008, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2016', 'Quarter': 'Q1' }];


 /*[{ "Name": "53248", "Age": 26624 }, { "Name": "6656", "Age": 3328 }, { "Name": "Namita", "Age": 18 }, { "Name": "Jas", "Age": 20 }, { "Name": "VG", "Age": 20 }, { "Name": "new", "Age": 13 }, { "Name": "IT", "Age": 11 }, { "Name": "Finance" }, { "Name": "UpdateViasCode", "Age": 22 }, { "Name": "InsertViaCode", "Age": 52 }, { "Name": "RefProcTesting" }, { "Name": "test2", "Age": 20 }]*/
    this.dataSourceSettings = {
      dataSource: this.jsonSource,
      expandAll: false,
     //// columns: [{ name: 'Year' }, { name: 'Products' }],
     // columns: [{ name: 'Products' }],
     //// rows: [{ name: 'Country' }, { name: 'Quarter' }],
     // rows: [{ name: 'Country' }, { name: 'Year' }, { name: 'Quarter' }],
     // //formatSettings: [{ name: 'Amount', format: 'C' }],
     // values: [{ name: 'Sold' }]

      //*******************************************************************************************
      
      columns: [{ name: 'Age'}],
      rows: [{ name: 'Name' }],     
      values: [{ name: 'Age' }]


      //columns: JSON.parse(this.chartSource).columns[0],
      ////rows: JSON.parse(this.chartSource).rows[0],
      //rows: [{ name: 'Name' }],  
      //values: JSON.parse(this.chartSource).values[0]

    };
    console.log(this.dataSourceSettings)
    this.displayOption = { view: 'Chart' } as DisplayOption;
    this.chartSettings = { chartSeries: { type: 'Pie' } } as ChartSettings;
    //this.chartTypesDropDown = new DropDownList({
    //  floatLabelType: 'Auto',
    //  change: this.onChange.bind(this)
    //});
    //this.chartTypesDropDown.appendTo('#charttypes');
  }


}
