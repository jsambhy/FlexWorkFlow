import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { ReportService } from '../../../services/report.service';
import { SupportingDocumentService } from '../../../services/supporting-document.service';

@Component({
    selector: 'app-scheduler',
    templateUrl: './scheduler.component.html',
    styleUrls: ['./scheduler.component.css']
})
/** Scheduler component*/
export class SchedulerComponent {
  toolbar: object;
  ReportGroupId: number;
  LoggedInUserId: number;
  SchedulerData: any;
  locale: string;
  offSet: number;

  @ViewChild('SchedulerGrid', { static: false })
  public SchedulerGrid: GridComponent;

  @ViewChild('toasttype', { static: false })
  private toastObj: ToastComponent;

  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };


  constructor(private _reportService: ReportService,
    private route: ActivatedRoute,
    private _SupportingDocService: SupportingDocumentService  ) {
    this.LoggedInUserId = +sessionStorage.getItem("LoggedInUserId");
    this.locale = Intl.DateTimeFormat().resolvedOptions().locale;    this.offSet = new Date().getTimezoneOffset();
    }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.ReportGroupId = parseInt(params['ReportGroupId']);
     
    });

    this.toolbar = [{ text: 'Refresh', tooltipText: 'Refresh', prefixIcon: 'e-custom-icons e-action-Icon-refresh', id: 'refresh' },
    { text: 'Download', tooltipText: 'Download', prefixIcon: 'e-custom-icons e-action-Icon-downloadattachement1', id: 'download' }, 'Search'];

    this.GetSchedularData();

  }

  GetSchedularData() {
    
    //GetSchedulerData
    //if (this.ReportGroupId == NaN) {
    //  this.ReportGroupId = 0;
    //}
    this._reportService.GetSchedularData(this.ReportGroupId, this.LoggedInUserId, this.locale, this.offSet)
      .subscribe(
        Schedulerdata => {
          this.SchedulerData = Schedulerdata;
          this.SchedulerGrid.refresh();
        }
      );

  }



  toolbarClick(args: ClickEventArgs): void {
    
    if (args.item.id === 'refresh') {
      this.GetSchedularData();
      
    }
    if (args.item.id === 'download') {
      const selectedRecords = this.SchedulerGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No file is selected for download";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        //'/help/Users_help.pdf'
        //for (let i = 0; i < selectedRecords.length; i++)
        //{
        if (selectedRecords[0]['Status'] == "Completed") {
          var DownloadPath = selectedRecords[0]['DownloadFilePath'];
          this._SupportingDocService.DownloadFromS3(DownloadPath);
        }
        else {
          this.toasts[3].content = "File is under process. Please wait for sometime.";
          this.toastObj.show(this.toasts[3]);
        }
        //}
      }
    }
    
  }
}
