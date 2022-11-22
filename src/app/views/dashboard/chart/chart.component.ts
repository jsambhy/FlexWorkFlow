import { Component, NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { ChartModule, ILoadedEventArgs, ChartTheme, IAccLoadedEventArgs, AccumulationTheme, BarSeriesService, CategoryService } from '@syncfusion/ej2-angular-charts';

import { ChartSeriesType } from '@syncfusion/ej2-charts';
/**
 * Module
 */
@NgModule({
  imports: [
    BrowserModule, ChartModule
  ],
  providers: [BarSeriesService, CategoryService],
})

@Component({
  selector: 'app-chart',
  //templateUrl: './chart.component.html',
  template: `<ejs-chart id="chart-container" [primaryXAxis]='primaryXAxis'>
    <e-series-collection>
        <e-series [dataSource]='chartData' type='Line' xName='month' yName='sales' name='Sales'></e-series>
    </e-series-collection>
</ejs-chart>`,
  styleUrls: ['./chart.component.css']
})
/** Chart component*/
export class ChartComponent {
  /** Chart ctor */

  public primaryXAxis: Object;
  public chartData: Object[];
  ngOnInit(): void {
    // Data for chart series
    this.chartData = [
      { month: 'Jan', sales: 35 }, { month: 'Feb', sales: 28 },
      { month: 'Mar', sales: 34 }, { month: 'Apr', sales: 32 },
      { month: 'May', sales: 40 }, { month: 'Jun', sales: 32 },
      { month: 'Jul', sales: 35 }, { month: 'Aug', sales: 55 },
      { month: 'Sep', sales: 38 }, { month: 'Oct', sales: 30 },
      { month: 'Nov', sales: 25 }, { month: 'Dec', sales: 32 }
    ];
    this.primaryXAxis = {
      valueType: 'Category'
    };

  }
}
