import { Component, ViewEncapsulation, Inject, ViewChild } from '@angular/core';
import { Maps, Legend, Marker, MapsTooltip } from '@syncfusion/ej2-angular-maps';
import { MapsComponent, LegendService, DataLabelService, MapsTooltipService } from '@syncfusion/ej2-angular-maps';
import { DashboardService } from '../../../services/dashboard.service';
Maps.Inject(Legend, Marker, MapsTooltip);
import { Ajax } from '@syncfusion/ej2-base';
import { DashboardLayoutComponent, PanelModel } from '@syncfusion/ej2-angular-layouts';
import { environment } from '../../../../environments/environment';
import { DashboardPanelModel } from '../../../models/dashboard-panel-model';

@Component({
    selector: 'app-configure-dashboard',
    templateUrl: './configure-dashboard.component.html',
  styleUrls: ['./configure-dashboard.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [MapsComponent, LegendService, DataLabelService, MapsTooltipService, DashboardService]
})
/** ConfigureDashboard component*/
export class ConfigureDashboardComponent {
  public dashboard: DashboardLayoutComponent;
  public showDashboardLayout: boolean = true;
  public showCreateDashboard: boolean;
  public create: boolean;
  
  showConfigureDashboardRender : boolean = true;
  showConfigureDashboardDesign : boolean;
  // Sidebar data

  public enableDock: boolean = true;
  public type: string = 'Over';
  public dockSize: string = '60px';
  public closeOnDocumentClick: boolean = true;
  public target: string = '#target';
  public enablesmartlabel: boolean = true;
  public startAngle: number = 0;
  public endAngle: number = 360;
  public UserRoleId: number;
  passcounts: number;
  //panels: Panel_Model = new Panel_Model();
  public panels: any[]; //=[{ "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: '<div class="card">testing</div>' }];\
  public contents: any[];
  cardLabel: string;
  public ComponentName: string;


  public dataLabel: Object = {
    visible: true, position: 'Inside',
    name: 'text',
    font: { color: 'white', fontWeight: '600', size: '14px' }
  };
  public palettes: any = ['#357cd2', '#00bdae', '#e36593'];
  public legendSettings: Object = {
    visible: false, toggleVisibility: false,
    position: 'Right', height: '28%', width: '44%'
  };
  public tooltip: Object = {
    enable: true,
    header: '<b>${point.x}</b>',
    format: 'Composition : <b>${point.y}%</b>'
  };

  public cellSpacing: number[] = [3, 3];
  public aspectRatio: any = 100 / 85;
 
  readonly baseUrl = environment.baseUrl;
  constructor(private _DashboardService: DashboardService) {
   


  }


  ngAfterViewInit() {
    //this.centerTitle.innerHTML = 'Active <br> users  &nbsp';
    //this.centerTitle.style.position = 'absolute';
    //this.centerTitle.style.visibility = 'hidden';
  }

   

  fnShowConfigureDashboardRender() {
    //window.location.reload();
    this.create = false;
    this.showConfigureDashboardRender = true;
    this.showConfigureDashboardDesign = false;
   
  }
  fnShowConfigureDashboardDesign() {   
    this.create = true;
    this.showConfigureDashboardRender = false;
    this.showConfigureDashboardDesign = true;
  }
}
