import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { ActivatedRoute, RouterEvent, Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { ToolbarService, GridComponent, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ToastPositionModel, ToastComponent } from '@syncfusion/ej2-angular-notifications';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  templateUrl: 'dashboard.component.html',
  providers: [ToolbarService, DashboardService]
})
export class DashboardComponent{

  TipData: any;
  WorkflowStatuColumns: any;
  WorkflowStatusData: any;
  NewsData: any;
  toolbar: ToolbarItems[] | object;
  position: ToastPositionModel = { X: 'Center' };
  UserRoleId: number;
  ProjectId: number;
  EntityType: string;
  EntityId: number;
  LoggedInRoleId: number;
  ShowTipGridFlag: boolean = true;
  Title: string;
  PanelId: number;
  showWidgetPopUp: boolean = false;
  LabelTile1: string='Custom Tile';
  LabelTile2: string = 'Custom Tile';
  LabelTile3: string = 'Custom Tile';
  LabelTile4: string = 'Custom Tile';
  ContentTile1: string;
  ContentTile2: string;
  ContentTile3: string;
  ContentTile4: string;
  Url1: string;
  Url2: string;
  Url3: string;
  Url4: string;

  @ViewChild('tipGrid', { static: false }) public TipGrid: GridComponent;
  @ViewChild('toasttype', { static: false }) private toastObj: ToastComponent;
  locale: string;
  //toast definition
  toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];

  constructor(private route: ActivatedRoute, private router: Router, private _service: DashboardService) {
    
   
  }

  ngOnInit() {
    
    this.route.params.subscribe(val => {
      this.locale = Intl.DateTimeFormat().resolvedOptions().locale;
     this.UserRoleId = +sessionStorage.getItem("UserRoleId");
      this.ProjectId = +sessionStorage.getItem("ProjectId");
      this.EntityType = sessionStorage.getItem("LoggedInScopeEntityType");
      this.EntityId = +sessionStorage.getItem("LoggedInScopeEntityId");
      this.LoggedInRoleId = +sessionStorage.getItem("LoggedInRoleId");

      //IsReload session item will set only on Role change event from default layot component. In this case we need to reload the window.
      let Reload = sessionStorage.getItem("IsReload");
      sessionStorage.removeItem("IsReload");
      if (Reload == 'Yes') {
        window.location.reload();
      }
      
      this._service.GetLandingPagePanelsData(this.UserRoleId, this.ProjectId, this.EntityType, this.EntityId)
     
        .subscribe(
          Paneldata => {
            
            for (let i = 0; i < Paneldata.length; i++)
            {
              if (Paneldata[i].PanelId == -1)
              {
                this.LabelTile1 = Paneldata[i].Label;
                this.ContentTile1 = Paneldata[i].Content
                this.Url1 = Paneldata[i].Url
              }
              if (Paneldata[i].PanelId == -2) {
                this.LabelTile2 = Paneldata[i].Label;
                this.ContentTile2 = Paneldata[i].Content
                this.Url2 = Paneldata[i].Url
              }
              if (Paneldata[i].PanelId == -3) {
                this.LabelTile3 = Paneldata[i].Label;
                this.ContentTile3 = Paneldata[i].Content
                this.Url3 = Paneldata[i].Url
              }
              if (Paneldata[i].PanelId == -4) {
                this.LabelTile4 = Paneldata[i].Label;
                this.ContentTile4 = Paneldata[i].Content
                this.Url4 = Paneldata[i].Url
              }
            }
            
          }
      );
      
     //Get Tips by UserRole
      this.GetTipsByUserRole();

      //GetNewsByEntity
      this._service.GetNewsByEntity(this.EntityType, this.EntityId)
        .subscribe(
          NewData => {
            this.NewsData = NewData;
          }
        );

     

      this._service.GetLandingPageColumnsGridData(this.EntityType, this.EntityId, this.UserRoleId)
        .subscribe(
          ColumnsDetails => {
            this.WorkflowStatuColumns = ColumnsDetails;
            //Get Workflow Details
            this._service.GetLandingPageGridData(this.EntityType, this.EntityId, this.UserRoleId)
              .subscribe(
                WFDetails => {
                  this.WorkflowStatusData = WFDetails;
                
                }
              );
          }
        );
     

    });

    this.GetLandingDashBoardTags();
    

  }


  MyInfoDetails: any;
  GetLandingDashBoardTags() {
    
    this._service.GetLandingDashBoardTags(this.EntityType, this.EntityId, this.UserRoleId, this.locale)
      .subscribe(
        InfoDetails => {
          this.MyInfoDetails = InfoDetails;

        }
      );
  }

  GetTipsByUserRole() {
    this._service.GetTipsByUserRole(this.UserRoleId)
      .subscribe(
        TipsData => {
          if (TipsData.length > 0) {
            this.TipData = TipsData;
            this.TipGrid.refresh();
          }
          else {
            this.TipData = null;
            this.TipGrid.refresh();
            //this.ShowTipGridFlag = false;
          }
          this.TipGrid.refresh();
        }
    );
   
  }

  DismissAllTips()
  {
    
   
    let TipIds = '';
    for (let i = 0; i < this.TipData.length; i++)
    {
      TipIds = TipIds + this.TipData[i].Id + '^';
    }
    TipIds = TipIds.substring(0, (TipIds.length) - 1);
    this.DismissTips(TipIds);
  }

  DismissTip(TipId) {
    this.DismissTips(TipId);
  }

  DismissTips(TipIds) {
    //dismiss the tip
    
    this._service.DismissTipsByUserRole(TipIds, this.UserRoleId)
      .subscribe(
        data => {
          //Call the Tip data function again and referesh the Grid
          this.GetTipsByUserRole();
          this.TipGrid.refresh();
        }
      );
  }

  OpenWidget(PanelId) {
   
    this.PanelId = PanelId;
    this.showWidgetPopUp = true;
  }
 
  
  
  

  // lineChart1
  public lineChart1Data: Array<any> = [
    {
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Series A'
    }
  ];
  public lineChart1Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart1Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: 40 - 5,
          max: 84 + 5,
        }
      }],
    },
    elements: {
      line: {
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart1Colours: Array<any> = [
    {
      backgroundColor: getStyle('--primary'),
      borderColor: 'rgba(255,255,255,.55)'
    }
  ];
  public lineChart1Legend = false;
  public lineChart1Type = 'line';

  // lineChart2
  public lineChart2Data: Array<any> = [
    {
      data: [1, 18, 9, 17, 34, 22, 11],
      label: 'Series A'
    }
  ];
  public lineChart2Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart2Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: 1 - 5,
          max: 34 + 5,
        }
      }],
    },
    elements: {
      line: {
        tension: 0.00001,
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart2Colours: Array<any> = [
    { // grey
      backgroundColor: getStyle('--info'),
      borderColor: 'rgba(255,255,255,.55)'
    }
  ];
  public lineChart2Legend = false;
  public lineChart2Type = 'line';


  // lineChart3
  public lineChart3Data: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40],
      label: 'Series A'
    }
  ];
  public lineChart3Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart3Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart3Colours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
    }
  ];
  public lineChart3Legend = false;
  public lineChart3Type = 'line';


  // barChart1
  public barChart1Data: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40, 78, 81, 80, 45, 34, 12, 40, 12, 40],
      label: 'Series A',
      barPercentage: 0.6,
    }
  ];
  public barChart1Labels: Array<any> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
  public barChart1Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
      }],
      yAxes: [{
        display: false
      }]
    },
    legend: {
      display: false
    }
  };
  public barChart1Colours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.3)',
      borderWidth: 0
    }
  ];
  public barChart1Legend = false;
  public barChart1Type = 'bar';

  // mainChart

  public mainChartElements = 27;
  public mainChartData1: Array<number> = [];
  public mainChartData2: Array<number> = [];
  public mainChartData3: Array<number> = [];

  public mainChartData: Array<any> = [
    {
      data: this.mainChartData1,
      label: 'Current'
    },
    {
      data: this.mainChartData2,
      label: 'Previous'
    },
    {
      data: this.mainChartData3,
      label: 'BEP'
    }
  ];
  /* tslint:disable:max-line-length */
  public mainChartLabels: Array<any> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  /* tslint:enable:max-line-length */
  public mainChartOptions: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips,
      intersect: true,
      mode: 'index',
      position: 'nearest',
      callbacks: {
        labelColor: function(tooltipItem, chart) {
          return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value: any) {
            return value.charAt(0);
          }
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
          stepSize: Math.ceil(250 / 5),
          max: 250
        }
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public mainChartColours: Array<any> = [
    { // brandInfo
      backgroundColor: hexToRgba(getStyle('--info'), 10),
      borderColor: getStyle('--info'),
      pointHoverBackgroundColor: '#fff'
    },
    { // brandSuccess
      backgroundColor: 'transparent',
      borderColor: getStyle('--success'),
      pointHoverBackgroundColor: '#fff'
    },
    { // brandDanger
      backgroundColor: 'transparent',
      borderColor: getStyle('--danger'),
      pointHoverBackgroundColor: '#fff',
      borderWidth: 1,
      borderDash: [8, 5]
    }
  ];
  public mainChartLegend = false;
  public mainChartType = 'line';

  // social box charts

  public brandBoxChartData1: Array<any> = [
    {
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Facebook'
    }
  ];
  public brandBoxChartData2: Array<any> = [
    {
      data: [1, 13, 9, 17, 34, 41, 38],
      label: 'Twitter'
    }
  ];
  public brandBoxChartData3: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40],
      label: 'LinkedIn'
    }
  ];
  public brandBoxChartData4: Array<any> = [
    {
      data: [35, 23, 56, 22, 97, 23, 64],
      label: 'Google+'
    }
  ];

  public brandBoxChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public brandBoxChartOptions: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
      }],
      yAxes: [{
        display: false,
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public brandBoxChartColours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.1)',
      borderColor: 'rgba(255,255,255,.55)',
      pointHoverBackgroundColor: '#fff'
    }
  ];
  public brandBoxChartLegend = false;
  public brandBoxChartType = 'line';

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

 
  
}
