import { Component, ViewEncapsulation, ViewChild, EventEmitter, Output } from '@angular/core';
import { DashboardLayoutComponent, PanelModel } from '@syncfusion/ej2-angular-layouts';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { DashboardService } from '../../../../services/dashboard.service';
import { DashboardDetailsModel } from '../../../../models/dashboard-detail-model';
@Component({
  selector: 'app-configure-dashboard-design',
  templateUrl: './configure-dashboard-design.component.html',
  styleUrls: ['./configure-dashboard-design.component.css'],
  providers: [DashboardService],
  encapsulation: ViewEncapsulation.None
})
/** configure-dashboard-design component*/
export class ConfigureDashboardDesignComponent {
  @ViewChild('default_dashboard', { static: false }) public dashboard: DashboardLayoutComponent;
  @ViewChild('toasttype', { static: false }) private toastObj: ToastComponent;
  position: ToastPositionModel = { X: 'Center' };
  LoggedInUserId: number;
  LoggedInRoleId: number;
  UserRoleId: number;
  ProjectId: number;
  LoggedInScopeEntityId: number;
  Id: number;//table identification id required to pass on widget component
  LoggedInScopeEntityType: string;
  showWidgetPopUp: boolean = false; //dashboard widget component show/hide flag
  constructor(private _DashboardService: DashboardService) {
    this.LoggedInUserId = +sessionStorage.getItem("LoggedInUserId");
    this.LoggedInRoleId = +sessionStorage.getItem("LoggedInRoleId");
    this.UserRoleId = +sessionStorage.getItem("UserRoleId");
    this.LoggedInScopeEntityId = +sessionStorage.getItem("LoggedInScopeEntityId");
    this.LoggedInScopeEntityType = sessionStorage.getItem("LoggedInScopeEntityType");
    this.ProjectId = +sessionStorage.getItem("ProjectId");
   
    this._DashboardService.GetPanelId(this.UserRoleId)
      .subscribe(
        newpanelid => {
          this.newpanelid = newpanelid;
          
        }

      );

  }
  cellSpacing: number[] = [10, 10];
  dashboardDetails: DashboardDetailsModel = new DashboardDetailsModel();
  panels: any[]
  Source = "onDemandDashboard";//source name required to pass on widget component
  PanelId: any;//panelid required to pass on widget component
  PanelJson: string;
  count: number;
  newpanelid: number;
  passdashboard: any;
  //initialization method
  ngOnInit() {
    
    
  }
  created(args) {
   
    
    this._DashboardService.GetDesigningDashboard(this.UserRoleId, this.ProjectId, this.LoggedInScopeEntityType, this.LoggedInScopeEntityId, "design")
      .subscribe(
        data => {
          this.panels = JSON.parse(data);
          ////this._DashboardService.GetPanelCount(this.UserRoleId)
          ////  .subscribe(
          ////    newpanelid => {
          ////      this.count = newpanelid;

          ////    }

          ////  );
          (this.dashboard as any).panels = JSON.parse(data);
          this.count = (this.dashboard as any).panels.length;              

        }

    );
    var proxy = this;
    setTimeout(function () {
      for (let i = 0; i < proxy.count; i++) {
        // fetch the close icon 
        let closeElement = document
          .getElementById(proxy.dashboard.panels[i].id.toString())
          .querySelector('.classDel');
        // bind the click event of close icon. 
        closeElement.addEventListener('click', function () {
          if ((<HTMLElement>event.target).offsetParent) {
            proxy.DeletePanel((<HTMLElement>event.target).offsetParent.id,proxy);           
          }
        })
      }

      for (let y = 0; y < proxy.count; y++) {
        // fetch the close icon 
        let addElement = document
          .getElementById(proxy.dashboard.panels[y].id.toString())
          .querySelector('.classAdd');
        // bind the click event of close icon. 
        addElement.addEventListener('click', function () {
          if ((<HTMLElement>event.target).offsetParent) {
            proxy.onAddIconHandler((<HTMLElement>event.target).offsetParent.id, proxy);
          }
        })

        //let addElement = document.getElementById(proxy.dashboard.panels[i].id.toString()).querySelector(".classAdd");
        //addElement.addEventListener('click', function () {
        //  if ((<HTMLElement>event.target).offsetParent) {
        //    proxy.onAddIconHandler((<HTMLElement>event.target).offsetParent.id, proxy);

        //  }


        //})
      }
    }, 100);
  }




  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  //method called on add panel button
  addPanel(): void {
    
    this.newpanelid = this.newpanelid + 1;
    /*this.count = this.count + 1;*/
   /* alert(this.newpanelid);*/
    let panel: PanelModel[] = [
      {
        id: this.newpanelid.toString(),
        sizeX: 1,
        sizeY: 1,
        row: 0,
        col: 0,
        header: '<div style="text-align: right;" id="myDiv"><a class="classAdd"><img src="./assets/flex-images/outline_settings_black_24dp.png" alt=' + this.newpanelid.toString() + ' title="Update Component"></a><a class="classDel"><img src="./assets/flex-images/Delete_1.png" alt=' + this.newpanelid.toString() + ' title="Delete Component"></a></div>'
      }
    ];
    this.dashboard.addPanel(panel[0]);
    var proxy = this;//declare here as was giving error since onload it will be undefined for a function call



    //let closeElement = document
    //  .getElementById(proxy.dashboard.panels[i].id.toString())
    //  .querySelector('.classDel');
    //// bind the click event of close icon. 
    //closeElement.addEventListener('click', function () {
    //  if ((<HTMLElement>event.target).offsetParent) {
    //    proxy.DeletePanel((<HTMLElement>event.target).offsetParent.id, proxy);
    //  }
    //})





    //let closeElement = document.getElementById(this.count.toString()).querySelector('.classDel');
    //closeElement.addEventListener('click', this.onCloseIconHandler.bind(this));

    let closeElement = document.getElementById(this.newpanelid.toString()).querySelector('.classDel');
    closeElement.addEventListener('click', function () {
      if ((<HTMLElement>event.target).offsetParent) {
        proxy.DeletePanel((<HTMLElement>event.target).offsetParent.id, proxy);
      }
    });


    //let addElement = document
    //  .getElementById(proxy.dashboard.panels[y].id.toString())
    //  .querySelector('.classAdd');
    //// bind the click event of close icon. 
    //addElement.addEventListener('click', function () {
    //  if ((<HTMLElement>event.target).offsetParent) {
    //    proxy.onAddIconHandler((<HTMLElement>event.target).offsetParent.id, proxy);
    //  }
    //})

    //let addElement = document.getElementById(this.count.toString()).querySelector('.classAdd');
    //addElement.addEventListener('click', this.onAddIconHandler.bind(this));
    let addElement = document.getElementById(this.newpanelid.toString()).querySelector('.classAdd');
    addElement.addEventListener('click', function () {
      if ((<HTMLElement>event.target).offsetParent) {
        proxy.onAddIconHandler((<HTMLElement>event.target).offsetParent.id, proxy);
      }
    })

    this.dashboardDetails.Operation = "Add";
    this.dashboardDetails.PanelId = 0;
    this.dashboardDetails.UIComponentId = 0;
    this.dashboardDetails.UserRoleId = this.UserRoleId;
    this.dashboardDetails.ConfigJson = "";//adding blank panel therfore this is blank    
    this.dashboardDetails.CreatedUpdatedRoleId = this.LoggedInRoleId;
    this.dashboardDetails.CreatedUpdatedId = this.LoggedInUserId;
    this.dashboardDetails.CreatedById = this.LoggedInUserId;
    this.dashboardDetails.UpdatedById = this.LoggedInUserId;
    this.dashboardDetails.CreatedByRoleId = this.LoggedInRoleId;
    this.dashboardDetails.UpdatedByRoleId = this.LoggedInRoleId;
    this.dashboardDetails.CreatedDateTime = new Date();
    this.dashboardDetails.UpdatedDateTime = new Date();
    this.dashboardDetails.EntityType = "";
    this.dashboardDetails.EntityId = 0;
    this.dashboardDetails.Label = "";
    this.dashboardDetails.AggFunction = "";
    this.dashboardDetails.WhereClause = "";
    this.dashboardDetails.HavingClause = "";
    this.dashboardDetails.TechnicalQuery = "";
    this.dashboardDetails.PanelJson = JSON.stringify(proxy.dashboard.serialize());
    this.dashboardDetails.RoleId = 0;
    this.dashboardDetails.EntityId = 0;
    this.dashboardDetails.DataFieldId = 0;
    this.dashboardDetails.ReportId = 0;
    this.PostPanelInfo(this.dashboardDetails)
  }
  //method called on the delete icon on panels
  onCloseIconHandler(event: any): void {
    if ((<HTMLElement>event.target).offsetParent) {
      let id = (<HTMLElement>event.target).offsetParent.id;
      this.DeletePanel(id, this);
    }
    //
    //if ((<HTMLElement>event.target).offsetParent) {
    //  let id = (<HTMLElement>event.target).offsetParent.id;
    //  //if (id.includes("layout")) {
    //  //  id = event.currentTarget.innerHTML.split("alt=")[1].split("title")[0].replace(/['"]+/g, '')
    //  //}
    //  //else {
    //  //  id = (<HTMLElement>event.target).offsetParent.id;
    //  //}
    //  var proxy = this;
    //  proxy.dashboard.removePanel((<HTMLElement>event.target).offsetParent.id);
    //  //this.dashboard.removePanel((<HTMLElement>event.target).offsetParent.id);
    //  this.DeletePanel(id);
    //}
  }
  //method called on the settings icon on panels
  onAddIconHandler(id,inst): void {
    
   
    //GetPanelInfoById
   // if ((<HTMLElement>event.target).offsetParent) {
     // let id = (<HTMLElement>event.target).offsetParent.id;
      //if (id.includes("layout")) {
      //  id = event.currentTarget.innerHTML.split("alt=")[1].split("title")[0].replace(/['"]+/g, '')
      //}
      //else {
      //  id = (<HTMLElement>event.target).offsetParent.id;
      //}
      //this.dashboard.removePanel((<HTMLElement>event.target).offsetParent.id);
      //this.DeletePanel(id);
      this.PanelJson = JSON.stringify(this.dashboard.serialize());

      this.PanelId = id;
      this.GetById(this.PanelId);
    //}

  }
  GetById(Id) {
    this._DashboardService.GetPanelInfoById(Id)
      .subscribe(
        data => {
          this.PanelJson = data[0].PanelJson;
          this.Id = data[0].Id; //table identificationid          
        }
      );
    this.showWidgetPopUp = true;
  }
  DeletePanel(panelId, inst) {
   
    this.dashboardDetails.Operation = "Delete";
    this.dashboardDetails.PanelId = panelId;
    this.dashboardDetails.UIComponentId = 0;
    this.dashboardDetails.UserRoleId = this.UserRoleId;
    this.dashboardDetails.ConfigJson = "";//adding blank panel therfore this is blank    
    this.dashboardDetails.CreatedUpdatedRoleId = this.LoggedInRoleId;
    this.dashboardDetails.CreatedUpdatedId = this.LoggedInUserId;
    this.dashboardDetails.CreatedDateTime = new Date();
    this.dashboardDetails.UpdatedDateTime = new Date();
    this.dashboardDetails.EntityType = "";
    this.dashboardDetails.EntityId = 0;
    this.dashboardDetails.Label = "";
    this.dashboardDetails.AggFunction = "";
    this.dashboardDetails.WhereClause = "";
    this.dashboardDetails.HavingClause = "";
    this.dashboardDetails.TechnicalQuery = "";
    this.dashboardDetails.PanelJson = JSON.stringify(this.dashboard.serialize());
    this.dashboardDetails.RoleId = 0;
    this.dashboardDetails.EntityId = 0;
    this.dashboardDetails.DataFieldId = 0;
    this.dashboardDetails.ReportId = 0;
    this._DashboardService.PerformPanelOperations(this.dashboardDetails)
      .subscribe(data => {
        this.toasts[1].content = data;
        this.toastObj.show(this.toasts[1]);
      });

    this.dashboard.removePanel(panelId);

  }
  PostPanelInfo(dashboarddetails) {
    this._DashboardService.PerformPanelOperations(dashboarddetails)
      .subscribe(data => {
        this.toasts[1].content = data;
        this.toastObj.show(this.toasts[1]);
      }
      );
  }
  //Dashboard Layout's resizestop event function
  onResizeStop(event: any) {
    this.dashboardDetails.Operation = "Resize";
    this.dashboardDetails.PanelId = 0;
    this.dashboardDetails.UIComponentId = 0;
    this.dashboardDetails.UserRoleId = this.UserRoleId;
    this.dashboardDetails.ConfigJson = "";//adding blank panel therfore this is blank    
    this.dashboardDetails.CreatedUpdatedRoleId = this.LoggedInRoleId;
    this.dashboardDetails.CreatedUpdatedId = this.LoggedInUserId;
    this.dashboardDetails.CreatedDateTime = new Date();
    this.dashboardDetails.UpdatedDateTime = new Date();
    this.dashboardDetails.EntityType = "";
    this.dashboardDetails.EntityId = 0;
    this.dashboardDetails.Label = "";
    this.dashboardDetails.AggFunction = "";
    this.dashboardDetails.WhereClause = "";
    this.dashboardDetails.HavingClause = "";
    this.dashboardDetails.TechnicalQuery = "";
    this.dashboardDetails.PanelJson = JSON.stringify(this.dashboard.serialize());
    this.dashboardDetails.RoleId = 0;
    this.dashboardDetails.EntityId = 0;
    this.dashboardDetails.DataFieldId = 0;
    this.dashboardDetails.ReportId = 0;
    this._DashboardService.PerformPanelOperations(this.dashboardDetails)
      .subscribe(data => {
        this.toasts[1].content = data;
        this.toastObj.show(this.toasts[1]);
      });
  }
  //Dashboard Layout's dragstop event function
  onDragStop(event: any) {
    this.dashboardDetails.Operation = "Update";
    this.dashboardDetails.PanelId = 0;
    this.dashboardDetails.UIComponentId = 0;
    this.dashboardDetails.UserRoleId = this.UserRoleId;
    this.dashboardDetails.ConfigJson = "";//adding blank panel therfore this is blank    
    this.dashboardDetails.CreatedUpdatedRoleId = this.LoggedInRoleId;
    this.dashboardDetails.CreatedUpdatedId = this.LoggedInUserId;
    this.dashboardDetails.CreatedDateTime = new Date();
    this.dashboardDetails.UpdatedDateTime = new Date();
    this.dashboardDetails.EntityType = "";
    this.dashboardDetails.EntityId = 0;
    this.dashboardDetails.Label = "";
    this.dashboardDetails.AggFunction = "";
    this.dashboardDetails.WhereClause = "";
    this.dashboardDetails.HavingClause = "";
    this.dashboardDetails.TechnicalQuery = "";
    this.dashboardDetails.PanelJson = JSON.stringify(this.dashboard.serialize());
    this.dashboardDetails.RoleId = 0;
    this.dashboardDetails.EntityId = 0;
    this.dashboardDetails.DataFieldId = 0;
    this.dashboardDetails.ReportId = 0;
    this._DashboardService.PerformPanelOperations(this.dashboardDetails)
      .subscribe(data => {
        this.toasts[1].content = data;
        this.toastObj.show(this.toasts[1]);
      });
  }
  UpdatePosition(dashboarditems) {
    this._DashboardService.UpdatePosition(dashboarditems)
      .subscribe(data => {
        this.toasts[1].content = data;
        this.toastObj.show(this.toasts[1]);
      });
  }
}

//------------------------------
//var proxy = this;//declare here as was giving error since onload it will be undefined for a function call
    //  //let closeElement = document.getElementById("myDiv").querySelectorAll(".classDel");

    ////let closeElement = document.getElementById("default_dashboard").querySelectorAll(".classDel");
    //let closeElement = document.querySelectorAll(".classDel");
    // for (let i = 0; i < closeElement.length; i++) {
    //  closeElement[i].addEventListener(
    //    "click",
    //    proxy.onCloseIconHandler.bind(this)//binding delete functionality with the delete icon
    //  );
    //}

    ////let addElement = document.getElementById("myDiv").querySelectorAll(".classAdd");
    //let addElement = document.querySelectorAll(".classAdd"); 
    //for (let i = 0; i < addElement.length; i++) {
    //  addElement[i].addEventListener(
    //    "click",
    //    proxy.onAddIconHandler.bind(this)//binding delete functionality with the delete icon
    //  );
    //}
