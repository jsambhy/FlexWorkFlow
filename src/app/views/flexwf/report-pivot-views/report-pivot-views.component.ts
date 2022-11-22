import { Component, Input, ViewChild } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { ToolbarService, ToolbarItems, GridComponent, ExcelExportService, PdfExportService, EditSettingsModel, IEditCell } from '@syncfusion/ej2-angular-grids';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { ButtonPropsModel, DialogComponent } from '@syncfusion/ej2-angular-popups';
import { PivotViewOnReportModel } from '../../../models/pivotviewonreport-model';
import { ReportPivotViewsService } from '../../../services/reportpivotviews.service';

@Component({
    selector: 'app-report-pivot-views',
    templateUrl: './report-pivot-views.component.html',
  styleUrls: ['./report-pivot-views.component.css'],
  providers: [ToolbarService, ExcelExportService, PdfExportService]
})
/** ReportPivotViews component*/
export class ReportPivotViewsComponent {

  @Input() ReportId: number;

  LoggedInUserId: number;
  LoggedInRoleId: number;
  ProjectId: number;
  ReportData: any;
  toolbar: object;
  editSettings: EditSettingsModel;
  PivotViewOnReportData: any;
  PivotOnReportForm: FormGroup = null;
  ShowCreatePopUp: boolean = false;
  SelectedPivotOnReportId: number;
  confirmcontent: string;
  ShowCreateBtn: boolean = true;
  ShowUpdateBtn: boolean = false;
  submitted: boolean = false;
  PivotViewOnReportModel = new PivotViewOnReportModel;
  PopUpHeader: string;
  DataSourceReportFields: Object = { text: 'Name', value: 'ReportId' };
  PivotFields: Object = { text: 'Name', value: 'Id' };
  ChartTypeFields: Object = { text: 'text', value: 'value' };

  @ViewChild('ReportPivotGrid', { static: false }) public ReportPivotGrid: GridComponent;
  @ViewChild('toasttype', { static: false }) private toastObj: ToastComponent;
  @ViewChild('confirmDialog', { static: false }) public confirmDialog: DialogComponent;

  ChartTypeData: Object[] = [{ text: 'Column', value: 'Column' },
  { text: 'Bar', value: 'Bar' },
  { text: 'Line', value: 'Line' },
  { text: 'Spline', value: 'Spline' },
  { text: 'Area', value: 'Area' },
  { text: 'SplineArea', value: 'SplineArea' },
  { text: 'StepLine', value: 'StepLine' },
  { text: 'StepArea', value: 'StepArea' },
  { text: 'StackingColumn', value: 'StackingColumn' },
  { text: 'StackingBar', value: 'StackingBar' }
    , { text: 'StackingArea', value: 'StackingArea' },
  { text: 'StackingColumn100', value: 'StackingColumn100' },
  { text: 'StackingBar100', value: 'StackingBar100' },
  { text: 'StackingArea100', value: 'StackingArea100' },
  { text: 'Scatter', value: 'Scatter' },
  { text: 'Bubble', value: 'Bubble' }

    , { text: 'Polar', value: 'Polar' }, { text: 'Radar', value: 'Radar' }
    , { text: 'Pareto', value: 'Pareto' }
    , { text: 'Pie', value: 'Pie' }

    , { text: 'Doughnut', value: 'Doughnut' }
    , { text: 'Funnel', value: 'Funnel' }
    , { text: 'Pyramid', value: 'Pyramid' }
  ];

  //Toast content declaration
  toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  position: ToastPositionModel = { X: 'Center' };
  

  constructor(private _reportService: ReportService, private formBuilder: FormBuilder,
    private _pivotService: ReportPivotViewsService  ) {
      this.LoggedInUserId = +sessionStorage.getItem("LoggedInUserId");
      this.LoggedInRoleId = +sessionStorage.getItem("LoggedInRoleId");
    this.ProjectId = +sessionStorage.getItem("ProjectId");
    
    this.PivotOnReportForm = this.formBuilder.group({
      DataSourceReportName: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      PivotViewName: new FormControl('', [Validators.required]),
      ChartTypeName: new FormControl('', [Validators.required]),
      Ordinal: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
  

    this.toolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' },
    { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' },
    { text: 'Review', tooltipText: 'Review', prefixIcon: 'e-custom-icons e-action-Icon-review1', id: 'Review' },
    { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' },
    'ExcelExport', 'PdfExport', 'CsvExport', 'Search'];

    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };

    this.GetDisplayPivotViewOnReports();

    this._reportService.GetReportName(this.ReportId,"Report")
      .subscribe(
        ReportName => {
          this.PopUpHeader = "Manage Pivot Views for " + ReportName;

          console.log(ReportName);
        }
    );
    this.GetReportData();
   
  }

  get f() { return this.PivotOnReportForm.controls; }

  GetDisplayPivotViewOnReports() {
    
    this._reportService.GetDisplayPivotViewOnReports(this.ReportId)
      .subscribe(
        data => {
          this.PivotViewOnReportData = data;
        }
      );
  }

  GetReportData() {
   
    this._reportService.GetReports(this.LoggedInRoleId, this.LoggedInUserId)
      .subscribe(
        data => {
          this.ReportData = JSON.parse(data);
        }
      );
  }

  toolbarClick(args: ClickEventArgs): void {
    
    if (args.item.id === 'ReportPivotGrid_pdfexport') {
      this.ReportPivotGrid.pdfExport();
    }
    if (args.item.id === 'ReportPivotGrid_excelexport') {
      this.ReportPivotGrid.excelExport();
    }
    if (args.item.id === 'ReportPivotGrid_csvexport') {
      this.ReportPivotGrid.csvExport();
    }
    if (args.item.id === 'Add') {
      //making fields blank before open
      this.PivotOnReportForm.patchValue({
        DataSourceReportName:null,
        PivotViewName:null,
        ChartTypeName:null,
        Ordinal:null
      });
      this.GetReportData();
      this.ShowCreatePopUp = true;
    }

    if (args.item.id === 'Edit') {
      this.ShowCreateBtn = false;
      this.ShowUpdateBtn = true;
      this.ShowCreatePopUp = true;
      const selectedRecords = this.ReportPivotGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No record is selected for update";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.GetPivotViewOnReportById(selectedRecords[0]['Id']);
      }


    }

    if (args.item.id === 'Review') {
      this.ShowCreateBtn = false;
      this.ShowUpdateBtn = true;
      const selectedRecords = this.ReportPivotGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No record is selected for review";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.PivotOnReportForm.disable();
        this.GetPivotViewOnReportById(selectedRecords[0]['Id']);
      }


    }


    if (args.item.id === 'Delete') {
      const selectedRecords = this.ReportPivotGrid.getSelectedRecords();
      
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No Template selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        //this.DeletePivotViewOnReport(selectedRecords[0]['Id']);
        this.SelectedPivotOnReportId = selectedRecords[0]['Id'];
        this.ConfirmationForDelete();
      }
    }

  }

  GetPivotViewOnReportById(Id) {
    this._reportService.GetPivotViewOnReportById(Id)
      .subscribe(
        data => {
          this.GetPivotViewData(data.DataSourceReportId);
         
          this.PivotOnReportForm.patchValue({
            DataSourceReportName: data.DataSourceReportId,
            PivotViewName: data.PivotViewId,
            ChartTypeName: data.ChartType,
            Ordinal: data.Ordinal
          });
        

        }
      );
  }

  ConfirmationForDelete() {
    this.confirmcontent = 'Are you sure you want to delete?'
    this.confirmDialog.show();
  }

  
  confirmDlgYesBtnClick = (): void => {
    this.DeletePivotViewOnReport();
    this.confirmDialog.hide();
  }

  confirmDlgBtnNoClick = (): void => {
    this.confirmDialog.hide();
    return;
  }
  confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmDlgYesBtnClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];

  DeletePivotViewOnReport() {
    this._reportService.DeletePivotViewOnReport(this.SelectedPivotOnReportId).subscribe(
      () => {
        this.toasts[1].content = "Mapping of this Pivot View on Report deleted successfully";
        this.toastObj.show(this.toasts[1]);
        this.ShowCreatePopUp = false;
        this.GetDisplayPivotViewOnReports();
      },
      (error: any) => console.log(error)
    );
  }

  Save() {
    
    this.submitted = true;
    if (this.PivotOnReportForm.invalid) {
      return;
    }
    else {
      this.PivotViewOnReportModel.ReportId = this.ReportId;
      this.PivotViewOnReportModel.DataSourceReportId = this.PivotOnReportForm.get('DataSourceReportName').value;
      this.PivotViewOnReportModel.PivotViewId = this.PivotOnReportForm.get('PivotViewName').value;
      this.PivotViewOnReportModel.ChartType = this.PivotOnReportForm.get('ChartTypeName').value;
      this.PivotViewOnReportModel.Ordinal = this.PivotOnReportForm.get('Ordinal').value;
      this.PivotViewOnReportModel.ConfigJson = "";
      this._reportService.SavePivotViewOnReport(this.PivotViewOnReportModel).subscribe(
        (data) => {
          this.toasts[1].content = "Pivot View has been mapped with selected report successfully";
          this.toastObj.show(this.toasts[1]);
          this.ShowCreatePopUp = false;
          this.GetDisplayPivotViewOnReports();
        },
        (error: any) => console.log(error)
      );
    }

  }

  Update() {
    
    this.submitted = true;
    if (this.PivotOnReportForm.invalid) {
      return;
    }
    else {
      this.PivotViewOnReportModel.ReportId = this.ReportId;
      this.PivotViewOnReportModel.DataSourceReportId = this.PivotOnReportForm.get('DataSourceReportName').value;
      this.PivotViewOnReportModel.PivotViewId = this.PivotOnReportForm.get('PivotViewName').value;
      this.PivotViewOnReportModel.ChartType = this.PivotOnReportForm.get('ChartTypeName').value;
      this.PivotViewOnReportModel.Ordinal = this.PivotOnReportForm.get('Ordinal').value;
      this.PivotViewOnReportModel.ConfigJson = "";
      this._reportService.UpdatePivotViewOnReport(this.PivotViewOnReportModel).subscribe(
        (data) => {
          this.toasts[1].content = "Pivot View has been mapped with selected report successfully";
          this.toastObj.show(this.toasts[1]);
          this.ShowCreatePopUp = false;
          this.GetDisplayPivotViewOnReports();
        },
        (error: any) => console.log(error)
      );
    }

  }

  SelectedDataSourceReportId: number;
  onReportChange(args) {
    this.SelectedDataSourceReportId = args.itemData.ReportId;
    this.GetPivotViewData(this.SelectedDataSourceReportId);
  }

  PivotViewData: any;
  GetPivotViewData(DataSourceReportId){
    this._pivotService.GetDataByReportId(DataSourceReportId)
      .subscribe(
        data => {
          this.PivotViewData = (data);
          console.log(this.PivotViewData);
        }
      );
  }
}
