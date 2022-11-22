import { Component, EventEmitter, Output } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { DashboardService } from '../../../../services/dashboard.service';
import { DashboardLayoutComponent } from '@syncfusion/ej2-angular-layouts';

@Component({
    selector: 'app-configure-dashboard-render',
    templateUrl: './configure-dashboard-render.component.html',
    styleUrls: ['./configure-dashboard-render.component.css']
})
/** configure-dashboard-render component*/
export class ConfigureDashboardRenderComponent {
    /** configure-dashboard-render ctor */
  public dashboard: DashboardLayoutComponent;
  public showDashboardLayout: boolean;
  public showCreateDashboard: boolean;
  public create: boolean;
  public layout: boolean;

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

  public cellSpacing: number[] = [10, 10];
  public aspectRatio: any = 100 / 85;
  public centerTitle: any;
  LoggedInUserId: number;
  LoggedInRoleId: number;
  ProjectId: number;
  LoggedInScopeEntityId: number;
  LoggedInScopeEntityType: string;
  col: number;
  row: number;
  sizeX: number;
  sizeY: number;
  content: number;
  PanelJson: any;
  readonly baseUrl = environment.baseUrl;
  constructor(private _DashboardService: DashboardService) {
    this.centerTitle = (document.createElement('div') as HTMLElement);
    this.UserRoleId = +sessionStorage.getItem("UserRoleId");


    this.LoggedInUserId = +sessionStorage.getItem("LoggedInUserId");
    this.LoggedInRoleId = +sessionStorage.getItem("LoggedInRoleId");
    this.UserRoleId = +sessionStorage.getItem("UserRoleId");
    this.ProjectId = +sessionStorage.getItem("ProjectId");
    this.LoggedInScopeEntityId = +sessionStorage.getItem("LoggedInScopeEntityId");
    this.LoggedInScopeEntityType = sessionStorage.getItem("LoggedInScopeEntityType");



  }

  ngOnInit() {
    
    this._DashboardService.GetOnDemandDashboardData(this.UserRoleId, this.ProjectId, this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)

      .subscribe(
        data => {
       
          this.panels = JSON.parse(data);
          

        }
      );

  }
  showRender: boolean = false;
  PostEvent1() {
    this.showCreateDashboard = true;
    this.showDashboardLayout = false;
  }
  @Output() PostEvent = new EventEmitter();
  created(args) {
    
    var proxy = this;//declare here as was giving error since onload it will be undefined for a function call
    //let closeElement = document.getElementById("myDiv").querySelectorAll(".classDel");

    //let closeElement = document.getElementById("default_dashboard").querySelectorAll(".classDel");
    let closeElement = document.querySelectorAll(".classDel");
    for (let i = 0; i < closeElement.length; i++) {
      closeElement[i].addEventListener(
        "click",
        proxy.onCloseIconHandler.bind(this)//binding delete functionality with the delete icon
      );
    }

    //let addElement = document.getElementById("myDiv").querySelectorAll(".classAdd");
    let addElement = document.querySelectorAll(".classAdd");
    for (let i = 0; i < addElement.length; i++) {
      addElement[i].addEventListener(
        "click",
        proxy.onAddIconHandler.bind(this)//binding delete functionality with the delete icon
      );
    }


  }
  onCloseIconHandler(event: any): void {
    alert("abc");
    //
    //if ((<HTMLElement>event.target).offsetParent) {
    //  let id = (<HTMLElement>event.target).offsetParent.id;
    //  //if (id.includes("layout")) {
    //  //  id = event.currentTarget.innerHTML.split("alt=")[1].split("title")[0].replace(/['"]+/g, '')
    //  //}
    //  //else {
    //  //  id = (<HTMLElement>event.target).offsetParent.id;
    //  //}
    //  this.dashboard.removePanel((<HTMLElement>event.target).offsetParent.id);
    //  this.DeletePanel(id);
    //}
  }

  onAddIconHandler(event: any): void {
    alert("abc3");
    //

    ////GetPanelInfoById
    //if ((<HTMLElement>event.target).offsetParent) {
    //  let id = (<HTMLElement>event.target).offsetParent.id;
    //  //if (id.includes("layout")) {
    //  //  id = event.currentTarget.innerHTML.split("alt=")[1].split("title")[0].replace(/['"]+/g, '')
    //  //}
    //  //else {
    //  //  id = (<HTMLElement>event.target).offsetParent.id;
    //  //}
    //  //this.dashboard.removePanel((<HTMLElement>event.target).offsetParent.id);
    //  //this.DeletePanel(id);
    //  this.PanelJson = JSON.stringify(this.dashboard.serialize());

    //  this.PanelId = id;
    //  this.GetById(this.PanelId);
    //}

  }
  ngAfterViewInit() {
    this.centerTitle.innerHTML = 'Active <br> users  &nbsp';
    this.centerTitle.style.position = 'absolute';
    this.centerTitle.style.visibility = 'hidden';
    this.PostEvent.emit();
  }

  fnCreateDashboard() {
    this.showCreateDashboard = true;
    this.showDashboardLayout = false;
    this.create = true;
    this.layout = false;

  }
  fnDashboardLayout() {
    this.create = false;
    this.layout = false;
    this.showCreateDashboard = false;
    this.showDashboardLayout = true;
  }

}
