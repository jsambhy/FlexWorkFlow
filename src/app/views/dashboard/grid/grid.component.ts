import { Component, ViewEncapsulation,ViewChild, Input } from "@angular/core";
import {
  DashboardLayoutComponent
} from "@syncfusion/ej2-angular-layouts";
@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
  encapsulation: ViewEncapsulation.None
})
/** grid component*/
export class GridComponent {
/** grid ctor */
  @Input() gridSource; 
  @ViewChild("default_dashboard", { static: false })
  public dashboard: DashboardLayoutComponent;
  public griddata: any[];
  @ViewChild("grid", { static: false })
  public grid: GridComponent;
    constructor() {

    }
  ngOnInit(): void {
    this.griddata = JSON.parse(this.gridSource);
  }
}
