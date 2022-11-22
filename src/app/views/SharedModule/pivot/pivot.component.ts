import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { actionComplete, FilterSettingsModel, GridComponent, GridLine, IEditCell, SelectionSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs, SelectEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { ButtonPropsModel, DialogComponent } from '@syncfusion/ej2-angular-popups';
import { PivotColumnModel, PivotModel, PivotRowModel, PivotValueModel } from '../../../models/pivot.model';
import { ReportService } from '../../../services/report.service';
import { ReportPivotViewsService } from '../../../services/reportpivotviews.service';
import { UserService } from '../../../services/user.service';
import { EditService, ToolbarService, PageService, NewRowPosition } from '@syncfusion/ej2-angular-grids';
import { ChangeEventArgs, DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';
import { Query } from '@syncfusion/ej2-data';
import { RadioButtonComponent } from '@syncfusion/ej2-angular-buttons';
import { TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
@Component({
  selector: 'app-pivot',
  templateUrl: 'pivot.component.html',
  providers: [ToolbarService, EditService, PageService, ReportService]
})
export class PivotComponent {
  toolbar: object;
  Rowtoolbar: object;
  Columntoolbar: object;
  toolbarValGrid: object;
  Header: string;
  ShowCreateBtn: Boolean = false;
  ShowUpdateBtn: Boolean = false;
  ShowPopupcreate: Boolean = false;
  pivotForm: FormGroup = null;
  pivotRowForm: FormGroup = null;
  pivotColumnForm: FormGroup = null;
  pivotValForm: FormGroup = null;
  chooseReportsfields: object = { text: 'Name', value: 'Id' }
  ReportsDataSource: any
  LoggedInUserId: number;
  LoggedInRoleId: number;
  LoggedInProjectId: number;
  pivotModelData: PivotModel = new PivotModel();
  @Input() ReportId;
  @Input() Source;
  pivotGridDataSource: any;
  confirmcontent: string;
  editSettings: Object;
  editSettingsConfig: Object;
  filterSettings: FilterSettingsModel;
  public selectionOptions: SelectionSettingsModel;
  confirmHeader: string = '';
  hidden: Boolean = false;

  @ViewChild('pivotGrid', { static: false }) public pivotGrid: GridComponent;
  @ViewChild('toasttype', { static: false }) private toastObj: ToastComponent;
  @ViewChild('confirmDialog', { static: false }) public confirmDialog: DialogComponent;
  @ViewChild('tab', { static: false }) public tab: TabComponent;
  @ViewChild('RowGrid', { static: false }) public RowGrid: GridComponent;
  @ViewChild('ColumnGrid', { static: false }) public ColumnGrid: GridComponent;
  @ViewChild('ValueGrid', { static: false }) public ValueGrid: GridComponent;
  @ViewChild('radiobutton', { static: false }) public radiobutton: RadioButtonComponent;


  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };

  constructor(private formBuilder: FormBuilder,
    private _reportsservice: ReportService,
    private _pivotService: ReportPivotViewsService  ) {

    this.LoggedInRoleId = +sessionStorage.getItem("LoggedInRoleId");
    this.LoggedInUserId = +sessionStorage.getItem("LoggedInUserId");
    this.LoggedInProjectId = +sessionStorage.getItem("LoggedInProjectId");

      this.pivotForm = this.formBuilder.group({
      Name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      Description: new FormControl(''),
      ReportName: new FormControl('', [Validators.required])      
      });

    this.pivotRowForm = this.formBuilder.group({
      RowDataField: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      Caption: new FormControl('', [Validators.required]),
      Ordinal: new FormControl('')
    });

    this.pivotColumnForm = this.formBuilder.group({
      ColumnDataField: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      Caption: new FormControl('', [Validators.required]),
      Ordinal: new FormControl('')
    });

      this.pivotValForm = this.formBuilder.group({     
      Caption: new FormControl('', [Validators.required]),
      formatType: new FormControl(''),
      ValueField: new FormControl('', [Validators.required]),
      AggFunc: new FormControl('', [Validators.required]),
      Formula: new FormControl(''),
      Ordinal: new FormControl('')
    });

  }

  get f() { return this.pivotForm.controls; }

  ngOnInit() {

    this.editSettingsConfig = { allowEditing: true, allowAdding: true, allowDeleting: true, newRowPosition: 'Top' };
    this.filterSettings = { type: 'CheckBox' };
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };

    this.toolbar = [
      { text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' },
      { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' },
      //{ text: 'Review', tooltipText: 'Review', prefixIcon: 'e-custom-icons e-action-Icon-review2', id: 'Review' },
      //{ text: 'Clone', tooltipText: 'Clone', prefixIcon: 'e-custom-icons e-action-Icon-clone', id: 'Clone' },
      { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' },
      'ExcelExport', 'PdfExport', 'CsvExport', 'Search'];

    this.Rowtoolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' },
    { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' },
    { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' },
      'ExcelExport', 'PdfExport', 'CsvExport', 'Search'];

    this.Columntoolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' },
    { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' },
    { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' },
      'ExcelExport', 'PdfExport', 'CsvExport', 'Search'];

    this.toolbarValGrid = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' },
    { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' },
    { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' },
      'ExcelExport', 'PdfExport', 'CsvExport', 'Search'];

      this.AggFuncSource = [{ text: 'Sum', value: 'Sum' }, { text: 'Count', value: 'Count' },
    { text: 'Distinct Count', value: 'Distinct Count' }, { text: ' Product', value: 'Product' }, { text: 'Min', value: 'Min' }, { text: 'Max', value: 'Max' },
    { text: 'Avg', value: 'Avg' }, { text: 'Median', value: 'Median' }, { text: 'Population Var', value: 'Population Var' },
    { text: 'Sample Var', value: 'Sample Var' }, { text: 'Population StDev', value: 'Population StDev' }, { text: 'Sample StDev', value: 'Sample StDev' }
    ];

    this.selectionOptions = { type: 'Single' };

    this.getData();
    this.GetReportData();
  }

  

  pivotid: number;

   toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'pivotGrid_pdfexport') {
      this.pivotGrid.pdfExport();
    }
    if (args.item.id === 'pivotGrid_excelexport') {
      this.pivotGrid.excelExport();
    }
    if (args.item.id === 'pivotGrid_csvexport') {
      this.pivotGrid.csvExport();
    }
    if (args.item.id === 'Add') {
      this.Header = "Create"
      this.pivotid = null;
      this.ShowCreateBtn = true;
      this.ShowUpdateBtn = false;
      //this.ShowCloseBtn = false;
      this.ShowPopupcreate = true;//opening create form
      this.pivotForm.patchValue({
        Name: null,
        Description: null,
        ReportName: null
      });
    }
    if (args.item.id === 'Edit') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      const selectedRecords = this.pivotGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No item selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.pivotid = selectedRecords[0]['Id'];//

        this._pivotService.getPivotManufacturerId(this.pivotid)
          .subscribe(
            manufacturerId => {

              if (this.LoggedInUserId != manufacturerId) {
                this.toasts[0].content = "This Pivot is not created by you, so you cannot edit it";
                this.toastObj.show(this.toasts[0]);
              }
              else {
                this.GetById(this.pivotid);
              }

            }
          );



      }
    }
    if (args.item.id === 'Delete') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      const selectedRecords = this.pivotGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No item selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.pivotid = selectedRecords[0]['Id'];//
        this._pivotService.getPivotManufacturerId(this.pivotid)
          .subscribe(
            manufacturerId => {

              if (this.LoggedInUserId != manufacturerId) {
                this.toasts[0].content = "This Pivot is not created by you, so you cannot delete it";
                this.toastObj.show(this.toasts[0]);
              }
              else {
                this.Delete(this.pivotid);
              }

            }
          );


      }
    }

   
   }

  GetReportData() {
    
    this._reportsservice.GetReports(this.LoggedInRoleId, this.LoggedInUserId)
      .subscribe(
        data => {

          this.ReportsDataSource = JSON.parse(data);
        }
      );
  }

  
  Save() {
    
    this.pivotModelData.ReportId = this.pivotForm.get('ReportName').value;
    this.pivotModelData.Name = this.pivotForm.get('Name').value;
    this.pivotModelData.Description = this.pivotForm.get('Description').value;
    this.pivotModelData.PivotJson = '{"values": [],"rows": [],"columns": []}';
    this.pivotModelData.CreatedById = this.LoggedInUserId;
    this.pivotModelData.CreatedByRoleId = this.LoggedInRoleId;
    this.pivotModelData.UpdatedById = this.LoggedInUserId;
    this.pivotModelData.UpdatedByRoleId = this.LoggedInRoleId;
    this.pivotModelData.CreatedDateTime = new Date();
    this.pivotModelData.UpdatedDateTime = new Date();
    this._pivotService.Save(this.pivotModelData).subscribe(
      (data: any) => {
        this.pivotid = data;
          this.toasts[1].content = "Pivot created successfully";
          this.toastObj.show(this.toasts[1]);
          //this.ShowPopupcreate = false;
          if ((this.Source == "Report") || (this.Source == "dashboard")) {
            this._pivotService.GetDataByReportId(this.ReportId)
              .subscribe(
                data => {
                  this.pivotGridDataSource = (data);
                }
              );
          }
          else {
            this.getData();
        }
        this.ShowCreateBtn = false;
        this.ShowUpdateBtn = true;
        },
        (error: any) => {
          this.toasts[2].content = error.error.Message;
          this.toastObj.show(this.toasts[2]);
          this.ShowPopupcreate = true;
        }
      );
    }

 
  onTabSelect(args: SelectEventArgs) {
    
    let TabIndex = args.selectedIndex;
    let TabPreviousIndex = args.previousIndex;
    if (TabIndex != 0) {
      if (this.pivotid == undefined || this.pivotid == 0 || this.pivotid == null) {
        this.toasts[3].content = "Save the Pivot view first.";
        this.toastObj.show(this.toasts[3]);
        this.tab.selectedItem = TabPreviousIndex;
        return;
      }
    }

    if (TabIndex == 1 || TabIndex == 2 || TabIndex == 3) {
      this.ReportFieldData();
    }

    if (TabIndex == 1) {
      
      this.GetRowDataByPivotViewId(this.pivotid);
   
    }

    if (TabIndex == 2) {
      this.GetColumnDataByPivotViewId(this.pivotid);
    }

    if (TabIndex == 3) {
      this.GetValueDataByPivotViewId(this.pivotid);
    }
  }

  getData() {
    this._pivotService.GetData()
      .subscribe(
        data => {
          this.pivotGridDataSource = (data);

        }
      );
  }

  GetById(Id) {
    
    
    this.ShowCreateBtn = false;
    this.ShowUpdateBtn = true;
    //this.ShowCloseBtn = false;
    this._pivotService.GetById(Id)
      .subscribe(
        data => {
          this.Header = "Edit";
          this.pivotid = data.Id;
          this.ReportId = data.ReportId;
          //this.chosenReportId = data.ReportId;
          //this._reportsservice.GetReportsColumnWithDataTypeByReportId(this.chosenReportId)
          //  .subscribe(
          //    data => {
          //      this.ChartsDataColumnSource = data;
          //      this.ChartsDataRowSource = data;
          //    }
          //  );


          this.GetReportData();
          this.ShowPopupcreate = true;

          this.pivotForm.patchValue({
            Name: data.Name,
            Description: data.Description,
            ReportName: data.ReportId
            //Title: JSON.parse(data.PivotJson)['title'],
          });
        }
      );
  }

  Update() {
    
    this.pivotModelData.Id = this.pivotid;
    this.pivotModelData.ReportId = this.pivotForm.get('ReportName').value;
    this.pivotModelData.Name = this.pivotForm.get('Name').value;
    this.pivotModelData.Description = this.pivotForm.get('Description').value;
    this.pivotModelData.PivotJson = '{"values": [],"rows": [],"columns": []}';
    this.pivotModelData.CreatedById = this.LoggedInUserId;
    this.pivotModelData.CreatedByRoleId = this.LoggedInRoleId;
    this.pivotModelData.UpdatedById = this.LoggedInUserId;
    this.pivotModelData.UpdatedByRoleId = this.LoggedInRoleId;
    this.pivotModelData.CreatedDateTime = new Date();
    this.pivotModelData.UpdatedDateTime = new Date();
    this._pivotService.Update(this.pivotModelData).subscribe(
      (data: any) => {
        this.toasts[1].content = "Pivot updated successfully";
        this.toastObj.show(this.toasts[1]);
        this.ShowPopupcreate = false;
        if ((this.Source == "Report") || (this.Source == "dashboard")) {
          this._pivotService.GetDataByReportId(this.ReportId)
            .subscribe(
              data => {
                this.pivotGridDataSource = (data);
              }
            );
        }
        else {
          this.getData();
        }
      },
      (error: any) => {
        this.toasts[2].content = error.error.Message;
        this.toastObj.show(this.toasts[2]);
        this.ShowPopupcreate = true;
      }
    );
  }

  Iscontinuetodelete: Boolean;
  Delete(Id) {
    this.Iscontinuetodelete = false;
    this.FnDelete(Id);
  }

  FnDelete(Id) {
    this._pivotService.Delete(Id, this.LoggedInProjectId, this.Iscontinuetodelete, this.LoggedInUserId).subscribe(
      (message: string) => {
        let MsgPrefix: string = message.substring(0, 2);
        if (MsgPrefix == 'C:') {
          this.confirmcontent = message;
          this.confirmDialog.show();
        }
        if (MsgPrefix == 'W:') {
          this.toasts[0].content = message;
          this.toastObj.show(this.toasts[0]);
        }
        else {
          this.toasts[1].content = message;
          this.toastObj.show(this.toasts[1]);
          if ((this.Source == "Report") || (this.Source == "dashboard")) {
            this._pivotService.GetDataByReportId(this.ReportId)
              .subscribe(
                data => {
                  this.pivotGridDataSource = (data);
                }
              );
          }
          else {
            this.getData();
          }
        }

      },
      (error: any) => alert(error)
    );
  }
  //No button click method of the dialogue
  public confirmDlgBtnNoClick = (): void => {
    this.confirmDialog.hide();
  }
  //Yes button click method of the dialogue
  public confirmDlgBtnYesClick = (): void => {
    this.Iscontinuetodelete = true;
    this.FnDelete(this.pivotid);
    this.confirmDialog.hide();
  }
  public confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmDlgBtnYesClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];




  //-----------------------------------Row related Code---------------------------------------------
  Fields: object = { text: 'Label', value: 'DataFieldId' }
  ShowRowCreateBtn:Boolean = false;
  ShowRowUpdateBtn:Boolean = false;
  SelectedRowId: number;
  PivotRowModel: PivotRowModel = new PivotRowModel();

  RowtoolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'RowGrid_pdfexport') {
      this.RowGrid.pdfExport();
    }
    if (args.item.id === 'RowGrid_excelexport') {
      this.RowGrid.excelExport();
    }
    if (args.item.id === 'RowGrid_csvexport') {
      this.RowGrid.csvExport();
    }
    if (args.item.id === 'Add') {
      this.Header = "Create"
     
      this.ShowRowCreateBtn = true;
      this.ShowRowUpdateBtn = false;

      this.showRowsPopUp = true;//opening create form
      this.pivotRowForm.patchValue({
        RowDataField: null,
        Caption: null,
        Ordinal: null
      });
    }
    if (args.item.id === 'Edit') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      
      const selectedRecords = this.RowGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No item selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.SelectedRowId = selectedRecords[0]['Id'];
        this.ShowRowCreateBtn = false;
        this.ShowRowUpdateBtn = true;
        this.GetRowById(this.SelectedRowId);
  
      }
    }
    if (args.item.id === 'Delete') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      
      const selectedRecords = this.RowGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No item selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.SelectedRowId = selectedRecords[0]['Id'];//
        this.RowDelete(this.SelectedRowId);
        
      }
    }


  }

  showRowsPopUp: Boolean = false;
  GetRowById(RowId) {
    this._pivotService.GetRowById(RowId)
      .subscribe(
        data => {
         
          this.SelectedRowId = data.Id;
          this.showRowsPopUp = true;

          this.pivotRowForm.patchValue({
            RowDataField: data.DataFieldId,
            Caption: data.Caption,
            Ordinal: data.Ordinal
          });
          //this.GetRowDataByPivotViewId(this.pivotid);
        }
      );
  }

  RowGriddata: any;
  GetRowDataByPivotViewId(PivotViewId) {
    this._pivotService.GetRowDataByPivotViewId(PivotViewId)
      .subscribe(
        data => {
          console.log(data);
          this.RowGriddata = data;
        }
      );
  }

  RowDelete(RowId) {
    this._pivotService.RowDelete(RowId)
      .subscribe(
        data => {
          this.toasts[1].content = "Row deleted successfully";
          this.toastObj.show(this.toasts[1]);
          this.GetRowDataByPivotViewId(this.pivotid);
        }
      );
  }


  SaveRowdata() {
    
    this.PivotRowModel.PivotViewId = this.pivotid;
    this.PivotRowModel.DataFieldId = this.pivotRowForm.get('RowDataField').value;
    this.PivotRowModel.Caption = this.pivotRowForm.get('Caption').value;
    this.PivotRowModel.Ordinal = this.pivotRowForm.get('Ordinal').value;
   
    this._pivotService.SaveRowdata(this.PivotRowModel).subscribe(
      (data: any) => {
     
        this.toasts[1].content = "Row created successfully";
        this.toastObj.show(this.toasts[1]);
        this.GetRowDataByPivotViewId(this.pivotid); 
        this.showRowsPopUp = false;
      },
      (error: any) => {
        this.toasts[2].content = error.error.Message;
        this.toastObj.show(this.toasts[2]);
        this.ShowPopupcreate = true;
      }
    );
  }

  UpdateRowdata() {
    
    this.PivotRowModel.PivotViewId = this.pivotid;
    this.PivotRowModel.Id = this.SelectedRowId;
    this.PivotRowModel.DataFieldId = this.pivotRowForm.get('RowDataField').value;
    this.PivotRowModel.Caption = this.pivotRowForm.get('Caption').value;
    this.PivotRowModel.Ordinal = this.pivotRowForm.get('Ordinal').value;

    this._pivotService.UpdateRowdata(this.PivotRowModel).subscribe(
      (data: any) => {
        this.toasts[1].content = "Row updated successfully";
        this.toastObj.show(this.toasts[1]);
        this.showRowsPopUp = false;
        this.GetRowDataByPivotViewId(this.pivotid);
       
      },
      (error: any) => {
        this.toasts[2].content = error.error.Message;
        this.toastObj.show(this.toasts[2]);
        this.ShowPopupcreate = true;
      }
    );
  }

  FieldSource: any;
  ReportFieldData() {
    this._reportsservice.GetReportsColumnWithDataTypeByReportId(this.ReportId)
      .subscribe(
        data => {
          this.FieldSource = data;
        });
  }

  


  //-----------------------------------Column related Code---------------------------------------------
  
  ShowColumnCreateBtn: Boolean = false;
  ShowColumnUpdateBtn: Boolean = false;
  SelectedColumnId: number;
  PivotColumnModel: PivotColumnModel = new PivotColumnModel();

  ColumntoolbarClick(args: ClickEventArgs): void {
    
    if (args.item.id === 'ColumnGrid_pdfexport') {
      this.ColumnGrid.pdfExport();
    }
    if (args.item.id === 'ColumnGrid_excelexport') {
      this.ColumnGrid.excelExport();
    }
    if (args.item.id === 'ColumnGrid_csvexport') {
      this.ColumnGrid.csvExport();
    }
    if (args.item.id === 'Add') {
      this.Header = "Create"

      this.ShowColumnCreateBtn = true;
      this.ShowColumnUpdateBtn = false;

      this.showColumnsPopUp = true;//opening create form
      this.pivotColumnForm.patchValue({
        ColumnDataField: null,
        Caption: null,
        Ordinal: null
      });
    }
    if (args.item.id === 'Edit') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      const selectedRecords = this.ColumnGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No item selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.SelectedColumnId = selectedRecords[0]['Id'];
        this.ShowColumnCreateBtn = false;
        this.ShowColumnUpdateBtn = true;
        this.GetColumnById(this.SelectedColumnId);

      }
    }
    if (args.item.id === 'Delete') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      const selectedRecords = this.ColumnGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No item selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.SelectedColumnId = selectedRecords[0]['Id'];//
        this.ColumnDelete(this.SelectedColumnId);

      }
    }


  }

  showColumnsPopUp: Boolean = false;
  GetColumnById(ColumnId) {
    this._pivotService.GetColumnById(ColumnId)
      .subscribe(
        data => {

          this.SelectedColumnId = data.Id;
          this.showColumnsPopUp = true;

          this.pivotColumnForm.patchValue({
            ColumnDataField: data.DataFieldId,
            Caption: data.Caption,
            Ordinal: data.Ordinal
          });
          //this.GetColumnDataByPivotViewId(this.pivotid);
        }
      );
  }

  ColumnGriddata: any;
  GetColumnDataByPivotViewId(PivotViewId) {
    this._pivotService.GetColumnDataByPivotViewId(PivotViewId)
      .subscribe(
        data => {
          this.ColumnGriddata = data;
        }
      );
  }

  ColumnDelete(ColumnId) {
    this._pivotService.ColumnDelete(ColumnId)
      .subscribe(
        data => {
          this.toasts[1].content = "Column deleted successfully";
          this.toastObj.show(this.toasts[1]);
          this.GetColumnDataByPivotViewId(this.pivotid);
        }
      );
  }


  SaveColumndata() {
    
    this.PivotColumnModel.PivotViewId = this.pivotid;
    this.PivotColumnModel.DataFieldId = this.pivotColumnForm.get('ColumnDataField').value;
    this.PivotColumnModel.Caption = this.pivotColumnForm.get('Caption').value;
    this.PivotColumnModel.Ordinal = this.pivotColumnForm.get('Ordinal').value;

    this._pivotService.SaveColumndata(this.PivotColumnModel).subscribe(
      (data: any) => {

        this.toasts[1].content = "Column created successfully";
        this.toastObj.show(this.toasts[1]);
        this.GetColumnDataByPivotViewId(this.pivotid);
        this.showColumnsPopUp = false;
      },
      (error: any) => {
        this.toasts[2].content = error.error.Message;
        this.toastObj.show(this.toasts[2]);
        this.ShowPopupcreate = true;
      }
    );
  }

  UpdateColumndata() {
    
    this.PivotColumnModel.PivotViewId = this.pivotid;
    this.PivotColumnModel.Id = this.SelectedColumnId;
    this.PivotColumnModel.DataFieldId = this.pivotColumnForm.get('ColumnDataField').value;
    this.PivotColumnModel.Caption = this.pivotColumnForm.get('Caption').value;
    this.PivotColumnModel.Ordinal = this.pivotColumnForm.get('Ordinal').value;

    this._pivotService.UpdateColumndata(this.PivotColumnModel).subscribe(
      (data: any) => {
        this.toasts[1].content = "Column updated successfully";
        this.toastObj.show(this.toasts[1]);
        this.showColumnsPopUp = false;
        this.GetColumnDataByPivotViewId(this.pivotid);
       
      },
      (error: any) => {
        this.toasts[2].content = error.error.Message;
        this.toastObj.show(this.toasts[2]);
        this.ShowPopupcreate = true;
      }
    );
  }



  //---------------------------------------------------Values related Code-----------------------------------------------
  ValueGriddata: any;
  PivotValueModel: PivotValueModel = new PivotValueModel();

  formatTypeSource: Object[] =
    [
      { text: 'Number', value: 'N' },
      { text: 'Currency', value: 'C' },
      { text: 'Percentage', value: 'P' }
    ]
  formatTypeFields: Object = { text: 'text', value: 'value' };


  GetValueDataByPivotViewId(pivotid) {
    
    this._pivotService.GetValueDataByPivotViewId(pivotid)
      .subscribe(
        data => {
          this.ValueGriddata = (data);
        }
      );
  }

  showCreateValuePopUp: Boolean = false;
  FormulaPlaceHolder: string;
  ShowValueCreateBtn: Boolean = false;
  ShowValueUpdateBtn: Boolean = false;
  ValueId: number;
  toolbarClickValGrid(args: ClickEventArgs): void {
    if (args.item.id === 'ValueGrid_pdfexport') {
      this.ValueGrid.pdfExport();
    }
    if (args.item.id === 'ValueGrid_excelexport') {
      this.ValueGrid.excelExport();
    }
    if (args.item.id === 'ValueGrid_csvexport') {
      this.ValueGrid.csvExport();
    }
    if (args.item.id === 'Add') {
      
      this.showCreateValuePopUp = true;//opening create form
      this.ShowValueCreateBtn = true;
      this.ShowValueUpdateBtn = false;
      this.FormulaPlaceHolder = "formula: '\"Sum(In_Stock)" + "Sum(Sold)\"'";
    }
    if (args.item.id === 'Edit') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      
      const selectedRecords = this.ValueGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No item selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.ValueId = selectedRecords[0]['Id'];//
        this.ShowValueCreateBtn = false;
        this.ShowValueUpdateBtn = true;
        this.GetValueById(this.ValueId);
  }
    }
    if (args.item.id === 'Delete') {
      const selectedRecords = this.ValueGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No item selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.ValueId = selectedRecords[0]['Id'];
        this.ValueDelete(this.ValueId);
      }
    }
  }

  formatName: string;
  formatTypeChange(args: any): void {
    this.formatName = args.itemData.value;
  }

  selectedField: string;
  AggFuncSource: any;
  FieldChange(args: any): void {
    this.selectedField = args.itemData.Label;
    this._reportsservice.GetDataTypeOfSelectedField(args.itemData.Label, this.ReportId)
      .subscribe(
        dataType => {

          if (dataType.contains("nvarchar")) {
            this.AggFuncSource = [{ text: 'Sum', value: 'Sum' },
            { text: 'Count', value: 'Count' },
            { text: 'Distinct Count', value: 'Distinct Count' },
            { text: ' Product', value: 'Product' },
            { text: 'Min', value: 'Min' },
            { text: 'Max', value: 'Max' },
            { text: 'Avg', value: 'Avg' },
            { text: 'Median', value: 'Median' },
            { text: 'Population Var', value: 'Population Var' },
            { text: 'Sample Var', value: 'Sample Var' },
            { text: 'Population StDev', value: 'Population StDev' },
            { text: 'Sample StDev', value: 'Sample StDev' }
            ];
          }

          if (dataType == "int") {
            this.AggFuncSource = [{ text: 'Sum', value: 'Sum' },
            { text: 'Count', value: 'Count' },
            { text: 'Distinct Count', value: 'Distinct Count' },
            { text: ' Product', value: 'Product' },
            { text: 'Min', value: 'Min' },
            { text: 'Max', value: 'Max' },
            { text: 'Avg', value: 'Avg' },
            { text: 'Median', value: 'Median' },
            { text: 'Population Var', value: 'Population Var' },
            { text: 'Sample Var', value: 'Sample Var' },
            { text: 'Population StDev', value: 'Population StDev' },
            { text: 'Sample StDev', value: 'Sample StDev' }
            ];
          }
          if (dataType == "numeric") {
            this.AggFuncSource = [{ text: 'Sum', value: 'Sum' },
            { text: 'Count', value: 'Count' },
            { text: 'Distinct Count', value: 'Distinct Count' },
            { text: ' Product', value: 'Product' },
            { text: 'Min', value: 'Min' },
            { text: 'Max', value: 'Max' },
            { text: 'Avg', value: 'Avg' },
            { text: 'Median', value: 'Median' },
            { text: 'Population Var', value: 'Population Var' },
            { text: 'Sample Var', value: 'Sample Var' },
            { text: 'Population StDev', value: 'Population StDev' },
            { text: 'Sample StDev', value: 'Sample StDev' }
            ];
          }
          if (dataType == "bit") {
            this.AggFuncSource = [{ text: 'Sum', value: 'Sum' },
            { text: 'Count', value: 'Count' },
            { text: 'Distinct Count', value: 'Distinct Count' },
            { text: ' Product', value: 'Product' },
            { text: 'Min', value: 'Min' },
            { text: 'Max', value: 'Max' },
            { text: 'Avg', value: 'Avg' },
            { text: 'Median', value: 'Median' },
            { text: 'Population Var', value: 'Population Var' },
            { text: 'Sample Var', value: 'Sample Var' },
            { text: 'Population StDev', value: 'Population StDev' },
            { text: 'Sample StDev', value: 'Sample StDev' }
            ];
          }
        }
      );
  }

  enableTextbox: Boolean = false;
  YesChecked: Boolean = false;
  Nochecked: Boolean = true;
  public changeHandler(): void {
    if (this.radiobutton.getSelectedValue() === "Yes") { //this means special handling is required

      this.enableTextbox = true;
      this.YesChecked = true;
      this.Nochecked = false;
    }
    if (this.radiobutton.getSelectedValue() === "No") {


      this.YesChecked = false;
      this.Nochecked = true;
      this.enableTextbox = false;
    }
  }

  xx: string;
  selectedFunct: string;
  AddFieldsToFormula() {
    if (this.xx == undefined || this.xx == "" || this.xx == "undefined") {
      this.xx = "";
    }
    this.xx = this.xx + "\"" + this.selectedFunct + "(" + this.selectedField + ")\"";
  }
  AggFuncChange(args: any): void {
    this.selectedFunct = args.itemData.value;

    // +'"Sum(In_Stock)"+"Sum(Sold)"'
  }

  
  SaveValuedata() {
    
    this.PivotValueModel.PivotViewId = this.pivotid;
    this.PivotValueModel.DataFieldId = this.pivotValForm.get('ValueField').value;
    this.PivotValueModel.Caption = this.pivotValForm.get('Caption').value;
    this.PivotValueModel.Ordinal = this.pivotValForm.get('Ordinal').value;
    this.PivotValueModel.Format = this.pivotValForm.get('formatType').value;
    this.PivotValueModel.Formula = this.pivotValForm.get('Formula').value;
    this.PivotValueModel.AggregateFunc = this.pivotValForm.get('AggFunc').value;

    this._pivotService.SaveValuedata(this.PivotValueModel).subscribe(
      (data: any) => {

        this.toasts[1].content = "Value Field created successfully";
        this.toastObj.show(this.toasts[1]);
        this.GetValueDataByPivotViewId(this.pivotid);
        this.showCreateValuePopUp = false;
      },
      (error: any) => {
        this.toasts[2].content = error.error.Message;
        this.toastObj.show(this.toasts[2]);
        //this.ShowPopupcreate = true;
      }
    );
  }

  UpdateValuedata() {
    
    this.PivotValueModel.Id = this.ValueId;
    this.PivotValueModel.PivotViewId = this.pivotid;
    this.PivotValueModel.DataFieldId = this.pivotValForm.get('ValueField').value;
    this.PivotValueModel.Caption = this.pivotValForm.get('Caption').value;
    this.PivotValueModel.Ordinal = this.pivotValForm.get('Ordinal').value;
    this.PivotValueModel.Format = this.pivotValForm.get('formatType').value;
    this.PivotValueModel.Formula = this.pivotValForm.get('Formula').value;
    this.PivotValueModel.AggregateFunc = this.pivotValForm.get('AggFunc').value;

    this._pivotService.SaveValuedata(this.PivotValueModel).subscribe(
      (data: any) => {

        this.toasts[1].content = "Value Field created successfully";
        this.toastObj.show(this.toasts[1]);
        this.GetValueDataByPivotViewId(this.pivotid);
        this.showCreateValuePopUp = false;
      },
      (error: any) => {
        this.toasts[2].content = error.error.Message;
        this.toastObj.show(this.toasts[2]);
        //this.ShowPopupcreate = true;
      }
    );
  }

  GetValueById(ValueId) {
    
    this._pivotService.GetValueById(ValueId)
      .subscribe(
        data => {

          this.ValueId = data.Id;
          this.showCreateValuePopUp = true;

          this.pivotValForm.patchValue({
            ValueField: data.DataFieldId,
            Caption: data.Caption,
            Ordinal: data.Ordinal,
            formatType: data.Format,
            Formula: data.Formula,
            AggFunc:data.AggregateFunc
          });
          
        }
      );
  }

  

  ValueDelete(ValueId) {
    this._pivotService.ValueDelete(ValueId)
      .subscribe(
        data => {
          this.toasts[1].content = "Value field deleted successfully";
          this.toastObj.show(this.toasts[1]);
          this.GetValueDataByPivotViewId(this.pivotid);
        }
      );
  }





















  //------------------------------------Rows----------------------------------------
 // { "values": [{ "name": "Emp", "caption": "Employee Score" }, { "name": "Mgr", "caption": "Manager Score" }], "rows": [{ "name": "KPI", "caption": "KPI" }, { "name": "Weightage", "caption": "Weightage" }], "columns": [{ "name": "Periods", "caption": "Periods" }] }

}

//pivotForm: FormGroup = null;
  //pivotRowForm: FormGroup = null;
  //pivotValForm: FormGroup = null;
  //pivotColumnForm: FormGroup = null;
  //pivotFiltersForm: FormGroup = null;
  //constructor(private formBuilder: FormBuilder, private _reportsservice: ReportService, private _userService: UserService, private _pivotService: ReportPivotViewsService) {
  //  this.pivotForm = this.formBuilder.group({
  //    Name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
  //    Description: new FormControl(''),
  //    ReportsName: new FormControl('', [Validators.required])      
  //  });
  //  this.pivotValForm = this.formBuilder.group({     
  //    ValueCaption: new FormControl('', [Validators.required]),
  //    formatType: new FormControl(''),
  //    ValueField: new FormControl('', [Validators.required]),
  //    AggFunc: new FormControl('', [Validators.required]),
  //    Formula: new FormControl('')      
  //  });
  //  this.pivotRowForm = this.formBuilder.group({
  //    XAxisData: new FormControl('', [Validators.required]),
  //    RowCaption: new FormControl('')
  //  });
  //  this.pivotColumnForm = this.formBuilder.group({
  //    YAxisData: new FormControl('', [Validators.required]),
  //    ColumnCaption: new FormControl('')
  //  });
  //  this.pivotFiltersForm = this.formBuilder.group({
  //    FilterData: new FormControl('', [Validators.required]),
  //    ColumnCaption: new FormControl('')
  //  });
  //} //const ends
  //@Input() ReportId;
  //@Input() Source;
  //confirmHeader: string = '';
  //pivotModelData: PivotModel = new PivotModel();
  //validationForm: FormGroup = null;
  //hidden: boolean = false;
  //ShowCreateBtn: boolean = true;
  //ShowUpdateBtn: boolean = false;
  //confirmcontent: string;
  //ReportsDataSource: any
  //LoggedInUserId: number;
  //LoggedInRoleId: number; ChartsDataColumnSource: any; ChartsDataFilterSource: any;

  ////pivotGridDataSource:  validationsmodel[];
  //Header: string; RowHeader: string;
  //chooseReportsfields: object = { text: 'Name', value: 'ReportId' }
  //toasts: { [key: string]: Object }[] = [
  //  { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
  //  { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
  //  { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
  //  { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  //];
  //formatTypeSource: Object[] =
  //  [
  //    { text: 'Number', value: 'N' },
  //    { text: 'Currency', value: 'C' },
  //    { text: 'Percentage', value: 'P' }
  //  ]
  //formatTypeFields: Object = { text: 'text', value: 'value' };
  //@ViewChild('pivotGrid', { static: false }) public pivotGrid: GridComponent;
  //@ViewChild('RowGrid', { static: false }) public RowGrid: GridComponent;
  //@ViewChild('ColumnGrid', { static: false }) public ColumnGrid: GridComponent;
  //@ViewChild('FilterGrid', { static: false }) public FilterGrid: GridComponent;
  //@ViewChild('toasttype', { static: false }) private toastObj: ToastComponent;
  //@ViewChild('confirmDialog', { static: false }) public confirmDialog: DialogComponent;
  //@ViewChild('createEditDialog', { static: false }) public createEditDialog: DialogComponent;
  //@ViewChild('tab', { static: false }) public tab: TabComponent;
  //@ViewChild('radiobutton', { static: false }) public radiobutton: RadioButtonComponent;
  //@ViewChild('Formula', { static: false }) public Formula: TextBoxComponent;
  //@ViewChild('ValueGrid', { static: false }) public ValueGrid: GridComponent;

  ////#Formula
  //ChartsDataColumnfields: object = { text: 'Label', value: 'Label' }
  //Fields: object = { text: 'Label', value: 'Label' }
  //position: ToastPositionModel = { X: 'Center' };
  //lines: GridLine; WFSource: string[]; editSettings: Object; editSettingsConfig: Object;
  //WFfields: Object = { text: 'UILabel', value: 'Id' }
  //ShowPopupcreate: boolean = false;
  //toolbar: ToolbarItems[] | object;
  //toolbarConfig: ToolbarItems[] | object; Valtoolbar: ToolbarItems[] | object;
  ///* validationmodelData: validationsmodel = new validationsmodel();//declaring and initializing the variable to use further  */
  //CurrentRoleName: string = sessionStorage.getItem("CurrentRoleName");
  //LoginEmail: string = sessionStorage.getItem("LoginEmail");
  //SessionValues: any = sessionStorage;
  //chosenReportId: number; showCreateValuePopUp = false;
  //ChartsDataRowSource: any; pivotid: number; FieldSource: any;
  //FormulaPlaceHolder: string;
  ////-----------------------------method call on the toolbars of grid------------------------------

  //sessionprojectid: string; projectId: number;
  ////--------inorder to remoive first unwanted row we have to define this filtersetting line
  //filterSettings: FilterSettingsModel;
  //pivotGridDataSource: any[]; RowGriddata: any[]; ColumnGriddata: any[]; ValueGriddata: any; FilterGriddata: any[];
  //Listtoolbar = { items: ['moveUp', 'moveDown', 'moveTo', 'moveFrom', 'moveAllTo', 'moveAllFrom'] }
  //public datafieldidrules: Object;

  //public editparams: Object;
  //public pageSettings: Object;
  //public formatoptions: Object;
  //public DatafieldParams: IEditCell;
  //public RowGridcolumns: object[];
  //public ColumnGridcolumns: object[];
  //public FilterGridcolumns: object[];
  //YesChecked = false;
  //Nochecked = true;


  //AggFuncSource: Object = []; Rowtoolbar: object; Columntoolbar: object;
  ////--------------------------Init event -------------------------------------------------
  //ngOnInit() {
  //  this.editSettingsConfig = { allowEditing: true, allowAdding: true, allowDeleting: true, newRowPosition: 'Top' };
  //  this.sessionprojectid = sessionStorage.getItem("ProjectId");
  //  this.projectId = +this.sessionprojectid; // conversion from string to int  
  //  this.lines = 'Both'; //to et both lines in grid
  //  this.filterSettings = { type: 'CheckBox' };
  //  //to show custom tool bar in grid with custom icons and method calls
  //  this.toolbar = [
  //    { text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' },
  //    { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' },
  //    { text: 'Review', tooltipText: 'Review', prefixIcon: 'e-custom-icons e-action-Icon-review2', id: 'Review' },
  //    { text: 'Clone', tooltipText: 'Clone', prefixIcon: 'e-custom-icons e-action-Icon-clone', id: 'Clone' },
  //    { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' },
  //    'ExcelExport',
  //    'PdfExport',
  //    'CsvExport',
  //    'Search'
  //  ];
  //  this.toolbarConfig = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
  //  this.Valtoolbar = [
  //    { text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'AddVal' },
  //    { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'EditVal' },
  //    { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'DeleteVal' },
  //    'ExcelExport',
  //    'PdfExport',
  //    'CsvExport',
  //    'Search'
  //  ];
  //  this.Rowtoolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' },
  //  { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' },
  //  { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' },
  //    'ExcelExport', 'PdfExport', 'CsvExport', 'Search'];

  //  this.Columntoolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' },
  //  { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' },
  //  { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' },
  //    'ExcelExport', 'PdfExport', 'CsvExport', 'Search'];


  //  this.AggFuncSource = [{ text: 'Sum', value: 'Sum' }, { text: 'Count', value: 'Count' },
  //  { text: 'Distinct Count', value: 'Distinct Count' }, { text: ' Product', value: 'Product' }, { text: 'Min', value: 'Min' }, { text: 'Max', value: 'Max' },
  //  { text: 'Avg', value: 'Avg' }, { text: 'Median', value: 'Median' }, { text: 'Population Var', value: 'Population Var' },
  //  { text: 'Sample Var', value: 'Sample Var' }, { text: 'Population StDev', value: 'Population StDev' }, { text: 'Sample StDev', value: 'Sample StDev' }
  //  ];
  //  //this.orderidrules = { required: true, number: true };
  //  //this.customeridrules = { required: true };
  //  this.datafieldidrules = { required: true };
  //  /*this.editparams = { params: { popupHeight: '300px' } };*/

  //  this.pageSettings = { pageCount: 5 };
  //  this.formatoptions = { type: 'dateTime', format: 'M/d/y hh:mm a' }
  //  //initializing events of grid record
  //  this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };

  //  //getting required parametrs value from session
  //  this.LoggedInRoleId = +sessionStorage.getItem("LoggedInRoleId");

  //  this.LoggedInUserId = +sessionStorage.getItem("LoggedInUserId");
  //  if ((this.Source == "Report") || (this.Source == "dashboard")) {
  //    this._pivotService.GetDataByReportId(this.ReportId)
  //      .subscribe(
  //        data => {
  //          this.pivotGridDataSource = (data);
  //        }
  //      );
  //  }
  //  else {
  //    this.getData();
  //  }
  //  this.GetReportData();
  //  this._userService.GetCurrencyCodeByUserId(this.LoggedInUserId)
  //    .subscribe(currencycode => {
  //      this.usercurrency = currencycode;
  //    }
  //    );

  //}

  //RowLabel: string;
  //ChartRowNameChange(args: any): void {
  //  this.RowLabel = args.itemData.Label;
  //}
  //ReportsNamesChange(args: any): void {
  //  this.chosenReportId = args.itemData.ReportId;
  //  this._reportsservice.GetReportsColumnWithDataTypeByReportId(this.chosenReportId)
  //    .subscribe(
  //      data => {
  //        this.ChartsDataFilterSource = data;
  //        this.ChartsDataColumnSource = data;
  //        this.ChartsDataRowSource = data;
  //        this.FieldSource = data;
  //        this.RowGridcolumns = [
  //          {
  //            field: "DataField", headerText: "X Axis data", editType: "dropdownedit", edit: {
  //              params: {
  //                query: new Query(),
  //                dataSource: this.ChartsDataRowSource,
  //                fields: { text: 'Label', value: 'DataFieldId' }
  //              }
  //            }
  //          },
  //          {
  //            field: "Caption", headerText: "Caption"
  //          }]
  //        this.ColumnGridcolumns = [
  //          {
  //            field: "DataField", headerText: "Y Axis data", editType: "dropdownedit", edit: {
  //              params: {
  //                query: new Query(),
  //                dataSource: this.ChartsDataColumnSource,
  //                fields: { text: 'Label', value: 'DataFieldId' }
  //              }
  //            }
  //          },
  //          {
  //            field: "Caption", headerText: "Caption"
  //          }]

  //        this.FilterGridcolumns = [
  //          {
  //            field: "DataField", headerText: "Filter data", editType: "dropdownedit", edit: {
  //              params: {
  //                query: new Query(),
  //                dataSource: this.ChartsDataFilterSource,
  //                fields: { text: 'Label', value: 'Label' }
  //              }
  //            }
  //          },
  //          {
  //            field: "Caption", headerText: "Caption"
  //          }]

  //      }
  //    );
  //}
  //formatName: string;
  //formatTypeChange(args: any): void {
  //  this.formatName = args.itemData.value;
  //}
  //xx: string;
  //AddFieldsToFormula() {
  //  if (this.xx == undefined || this.xx == "" || this.xx == "undefined") {
  //    this.xx = "";
  //  }
  //  this.xx = this.xx + "\"" + this.selectedFunct + "(" + this.selectedField + ")\"";
  //}
  //AggFuncChange(args: any): void {
  //  this.selectedFunct = args.itemData.value;

  //  // +'"Sum(In_Stock)"+"Sum(Sold)"'
  //}
  //selectedField: string;
  //selectedFunct: string;


  //ColumnLabel: string;
  //ChartColumnNameChange(args: any): void {
  //  
  //  this.ColumnLabel = args.itemData.Label;
  //  //this._reportsservice.GetReportsColumnWithDataTypeByReportId(this.chosenReportId)
  //  //  .subscribe(
  //  //    data => {
  //  //      this.ChartsDataRowSource = data;
  //  //    }
  //  //  );

  //}
  //GetReportData() {
  //  this._reportsservice.GetReports(this.LoggedInRoleId, this.LoggedInUserId, this.projectId)
  //    .subscribe(
  //      data => {

  //        this.ReportsDataSource = JSON.parse(data);
  //      }
  //    );
  //}

  //toolbarClick(args: ClickEventArgs): void {
  //  if (args.item.id === 'pivotGrid_pdfexport') {
  //    this.pivotGrid.pdfExport();
  //  }
  //  if (args.item.id === 'pivotGrid_excelexport') {
  //    this.pivotGrid.excelExport();
  //  }
  //  if (args.item.id === 'pivotGrid_csvexport') {
  //    this.pivotGrid.csvExport();
  //  }
  //  if (args.item.id === 'Add') {
  //    this.Header = "Create"
  //    this.ShowCreateBtn = true;
  //    this.ShowUpdateBtn = false;
  //    this.ShowCloseBtn = false;
  //    this.ShowPopupcreate = true;//opening create form
  //    this.pivotForm.patchValue({
  //      Name: null,
  //      Description: null,
  //      ReportsName: null,
  //      //ColumnCaption: null,
  //      //YAxisData: null,
  //      //formatType: null,
  //      //XAxisData: null,
  //      //RowCaption: null
  //    });
  //    //const arr = <FormArray>this.pivotForm.controls.arr;
  //    //arr.controls = [];

  //    this.getRowData();
  //    this.getColumnData();
  //    this.getValueData();
  //    this.getFilterData();
  //  }
  //  if (args.item.id === 'Edit') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
  //    const selectedRecords = this.pivotGrid.getSelectedRecords();
  //    if (selectedRecords.length == 0) {
  //      this.toasts[3].content = "No item selected for this operation";
  //      this.toastObj.show(this.toasts[3]);
  //    }
  //    else {
  //      this.pivotid = selectedRecords[0]['Id'];//

  //      this._pivotService.getPivotManufacturerId(this.pivotid)
  //        .subscribe(
  //          manufacturerId => {

  //            if (this.LoggedInUserId != manufacturerId) {
  //              this.toasts[0].content = "This Pivot is not created by you, so you cannot edit it";
  //              this.toastObj.show(this.toasts[0]);
  //            }
  //            else {
  //              this.GetById(this.pivotid);
  //            }

  //          }
  //        );



  //    }
  //  }
  //  if (args.item.id === 'Delete') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
  //    const selectedRecords = this.pivotGrid.getSelectedRecords();
  //    if (selectedRecords.length == 0) {
  //      this.toasts[3].content = "No item selected for this operation";
  //      this.toastObj.show(this.toasts[3]);
  //    }
  //    else {
  //      this.pivotidtobedelete = selectedRecords[0]['Id'];//
  //      this._pivotService.getPivotManufacturerId(this.pivotid)
  //        .subscribe(
  //          manufacturerId => {

  //            if (this.LoggedInUserId != manufacturerId) {
  //              this.toasts[0].content = "This Pivot is not created by you, so you cannot delete it";
  //              this.toastObj.show(this.toasts[0]);
  //            }
  //            else {
  //              this.Delete(this.pivotidtobedelete);
  //            }

  //          }
  //        );


  //    }
  //  }

  //  if (args.item.id === 'Review') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
  //    const selectedRecords = this.pivotGrid.getSelectedRecords();
  //    if (selectedRecords.length == 0) {
  //      this.toasts[3].content = "No item selected for this operation";
  //      this.toastObj.show(this.toasts[3]);
  //    }
  //    else {
  //      this.pivotid = selectedRecords[0]['Id'];// 
  //      this.GetByIdForReview(this.pivotid);


  //    }
  //  }
  //  if (args.item.id === 'Clone') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
  //    const selectedRecords = this.pivotGrid.getSelectedRecords();
  //    if (selectedRecords.length == 0) {
  //      this.toasts[3].content = "No item selected for this operation";
  //      this.toastObj.show(this.toasts[3]);
  //    }
  //    else {
  //      this.pivotid = selectedRecords[0]['Id'];// 
  //      this.GetByIdForClone(this.pivotid);


  //    }
  //  }
  //}
  //toolbarClickValGrid(args: ClickEventArgs): void {
  //  if (args.item.id === 'ValueGrid_pdfexport') {
  //    this.ValueGrid.pdfExport();
  //  }
  //  if (args.item.id === 'ValueGrid_excelexport') {
  //    this.ValueGrid.excelExport();
  //  }
  //  if (args.item.id === 'ValueGrid_csvexport') {
  //    this.ValueGrid.csvExport();
  //  }
  //  if (args.item.id === 'AddVal') {
  //    /*this.Header = "Create Value"*/

  //    this.showCreateValuePopUp = true;//opening create form
  //    this.FormulaPlaceHolder = "formula: '\"Sum(In_Stock)" + "Sum(Sold)\"'";
  //  }
  //  if (args.item.id === 'EditVal') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
  //    
  //    const selectedRecords = this.ValueGrid.getSelectedRecords();
  //    if (selectedRecords.length == 0) {
  //      this.toasts[3].content = "No item selected for this operation";
  //      this.toastObj.show(this.toasts[3]);
  //    }
  //    else {
  //      this.pivotid = selectedRecords[0]['Id'];//

  //      this._pivotService.getPivotManufacturerId(this.pivotid)
  //        .subscribe(
  //          manufacturerId => {

  //            if (this.LoggedInUserId != manufacturerId) {
  //              this.toasts[0].content = "This Pivot is not created by you, so you cannot edit it";
  //              this.toastObj.show(this.toasts[0]);
  //            }
  //            else {
  //              this.GetById(this.pivotid);
  //            }

  //          }
  //        );



  //    }
  //  }
  //  if (args.item.id === 'DeleteVal') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
  //    const selectedRecords = this.pivotGrid.getSelectedRecords();
  //    if (selectedRecords.length == 0) {
  //      this.toasts[3].content = "No item selected for this operation";
  //      this.toastObj.show(this.toasts[3]);
  //    }
  //    else {
  //      this.pivotidtobedelete = selectedRecords[0]['Id'];//
  //      this._pivotService.getPivotManufacturerId(this.pivotid)
  //        .subscribe(
  //          manufacturerId => {

  //            if (this.LoggedInUserId != manufacturerId) {
  //              this.toasts[0].content = "This Pivot is not created by you, so you cannot delete it";
  //              this.toastObj.show(this.toasts[0]);
  //            }
  //            else {
  //              this.Delete(this.pivotidtobedelete);
  //            }

  //          }
  //        );


  //    }
  //  }



  //}


  //getData() {
  //  this._pivotService.GetData()
  //    .subscribe(
  //      data => {
  //        this.pivotGridDataSource = (data);

  //      }
  //    );
  //}
  //getValueData() {
  //  this._pivotService.GetValueData()
  //    .subscribe(
  //      data => {
  //        this.ValueGriddata = (data);

  //      }
  //    );
  //}
  //getRowData() {
  //  this._pivotService.GetRowData()
  //    .subscribe(
  //      data => {
  //        this.RowGriddata = (data);

  //      }
  //    );
  //}

  //getColumnData() {
  //  this._pivotService.GetColumnData()
  //    .subscribe(
  //      data => {
  //        this.ColumnGriddata = (data);

  //      }
  //    );
  //}

  //getFilterData() {
  //  this._pivotService.GetFilterData()
  //    .subscribe(
  //      data => {
  //        this.FilterGriddata = (data);

  //      }
  //    );
  //}
  ////ColumnGriddata

  //public recordDoubleClick(args): void {
  //  this.GetById(args.rowData['Id']);
  //  this.Header = "Edit";
  //  this.ShowCreateBtn = false;
  //  this.ShowUpdateBtn = true;
  //}


  //  get f() { return this.pivotForm.controls; }
  //get PRFControls() { return this.pivotRowForm.controls; }

  //showRows: Boolean = false;

  //showColumns = false;
  //showValues = false;

  //usercurrency: string; Content: any;

  //public actionComplete(args) {
  //  alert(args.requestType);
  //  if ((args.requestType === 'beginEdit')) {
  //    const dialog = args.dialog;
  //    // change the header of the dialog
  //    dialog.header = 'Question Details';
  //  }
  //}
  //n: number = 1
  //SaveValue() {
  //  let flagcount; 

  //  this.n = this.n + 1;
  //  console.log(this.ValueGriddata)
  //  flagcount = Math.floor(Math.random() * this.n);
  //  this.ValueGriddata.push({
  //    Id: flagcount,
  //    Caption: this.pivotValForm.get('Caption').value,
  //    Formula: this.pivotValForm.get('Formula').value      
  //  });
  //  this.ValueGrid.refresh();


  //}

  //Save() {
  //  
  //  if (this.pivotForm.invalid) {
  //    return;
  //  }
  //  else {

  //    if (this.RowGrid.getRows().length == 0) {
  //      this.toasts[0].content = "You din't provide \"Row Data\" for this pivot view, the pivot view will not function unless it is provided";
  //      this.toastObj.show(this.toasts[0]);
  //    }
  //    if (this.ColumnGrid.getRows().length == 0) {
  //      this.toasts[0].content = "You din't provide \"Column Data\" for this pivot view, the pivot view will not function unless it is provided";
  //      this.toastObj.show(this.toasts[0]);
  //    }
  //    if (this.ValueGrid.getRows().length == 0) {
  //      this.toasts[0].content = "You din't provide \"Value Data\" for this pivot view, the pivot view will not function unless it is provided";
  //      this.toastObj.show(this.toasts[0]);
  //    }


  //    let formatsetting; let CalculatedFields
  //    if (this.formatName == "C") {
  //      formatsetting = [{ name: this.ColumnLabel, format: this.formatName, currency: this.usercurrency }]
  //    }
  //    else {
  //      formatsetting = [{ name: this.ColumnLabel, format: this.formatName }]
  //    }

  //    if (this.YesChecked == true) {
  //      CalculatedFields = this.ValueGrid.dataSource;
  //    }
  //    let ContentValues = this.ValueGrid.dataSource;
  //    let ContentRows = this.RowGrid.dataSource;
  //    let ContentColumns = this.ColumnGrid.dataSource;
  //    this.Content = {
  //      "title": this.pivotForm.get('Name').value,
  //      "values": ContentValues,
  //      "rows": ContentRows,
  //      "columns": ContentColumns,
  //      "formatsetting": formatsetting,
  //      "calculatedFieldSettings": CalculatedFields
  //    };


  //    let rowDFidlist = '', rowcaptionlist = '';
  //    for (let i = 0; i < this.RowGriddata.length; i++) {
  //      rowDFidlist = rowDFidlist + ',' + (this.RowGriddata[i]['DataFieldId'])
  //      rowcaptionlist = rowcaptionlist + ',' + (this.RowGriddata[i]['Label'])
  //    }
  //    rowDFidlist = rowDFidlist.substring(0, rowDFidlist.length - 1);
  //    rowcaptionlist = rowcaptionlist.substring(0, rowcaptionlist.length - 1);


  //    this.pivotModelData.rowdatafieldlist = rowDFidlist;
  //    this.pivotModelData.rowcaptionlist = rowcaptionlist;
  //    let columnDFidlist = '', columncaptionlist = '';
  //    for (let i = 0; i < this.ColumnGriddata.length; i++) {
  //      columnDFidlist = columnDFidlist + ',' + (this.ColumnGriddata[i]['DataFieldId'])
  //      columncaptionlist = columncaptionlist + ',' + (this.ColumnGriddata[i]['Label'])
  //    }
  //    columncaptionlist = columncaptionlist.substring(0, columncaptionlist.length - 1);
  //    columnDFidlist = columnDFidlist.substring(0, columnDFidlist.length - 1);     
  //    this.pivotModelData.columndatafieldlist = columnDFidlist;
  //    this.pivotModelData.columncaptionlist = columncaptionlist;

  //    let valueDFidlist = '', valuecaptionlist = '', formulalist = '';
  //    for (let i = 0; i < this.ValueGriddata.length; i++) {
  //      valueDFidlist = valueDFidlist + ',' + (this.ValueGriddata[i]['DataFieldId'])
  //      valuecaptionlist = valuecaptionlist + ',' + (this.ValueGriddata[i]['Caption'])
  //      formulalist = formulalist + ',' + (this.ValueGriddata[i]['Formula'])
  //    }
  //    valueDFidlist = valueDFidlist.substring(0, valueDFidlist.length - 1);
  //    valuecaptionlist = valuecaptionlist.substring(0, valuecaptionlist.length - 1);
  //    formulalist = formulalist.substring(0, formulalist.length - 1);

  //    this.pivotModelData.valuedatafieldlist = valueDFidlist;
  //    this.pivotModelData.valuecaptionlist = valuecaptionlist;
  //    this.pivotModelData.formulalist = formulalist;
  //    this.pivotModelData.ReportId = this.chosenReportId;
  //    this.pivotModelData.Name = this.pivotForm.get('Name').value;
  //    this.pivotModelData.Description = this.pivotForm.get('Description').value;
  //    this.pivotModelData.PivotJson = JSON.stringify(this.Content);
  //    this.pivotModelData.CreatedById = this.LoggedInUserId;
  //    this.pivotModelData.CreatedByRoleId = this.LoggedInRoleId;
  //    this.pivotModelData.UpdatedById = this.LoggedInUserId;
  //    this.pivotModelData.UpdatedByRoleId = this.LoggedInRoleId;
  //    this.pivotModelData.CreatedDateTime = new Date();
  //    this.pivotModelData.UpdatedDateTime = new Date();
  //    this.pivotModelData.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + "No Workflow" + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|" + "ProjectId=" + this.projectId;

  //    this._pivotService.Save(this.pivotModelData).subscribe(
  //      (data: any) => {
  //        this.toasts[1].content = "Pivot created successfully";
  //        this.toastObj.show(this.toasts[1]);
  //        this.ShowPopupcreate = false;
  //        if ((this.Source == "Report") || (this.Source == "dashboard")) {
  //          this._pivotService.GetDataByReportId(this.ReportId)
  //            .subscribe(
  //              data => {
  //                this.pivotGridDataSource = (data);
  //              }
  //            );
  //        }
  //        else {
  //          this.getData();
  //        }
  //      },
  //      (error: any) => {
  //        this.toasts[2].content = error.error.Message;
  //        this.toastObj.show(this.toasts[2]);
  //        this.ShowPopupcreate = true;
  //      }
  //    );
  //  }
  //}
  //Iscontinuetodelete = true; pivotidtobedelete: number;
  //Delete(Id) {
  //  this.Iscontinuetodelete = false;
  //  this.FnDelete(Id);
  //}

  //FnDelete(Id) {
  //  this._pivotService.Delete(Id, this.projectId, this.Iscontinuetodelete, this.LoggedInUserId).subscribe(
  //    (message: string) => {
  //      let MsgPrefix: string = message.substring(0, 2);
  //      if (MsgPrefix == 'C:') {
  //        this.confirmcontent = message;
  //        this.confirmDialog.show();
  //      }
  //      if (MsgPrefix == 'W:') {
  //        this.toasts[0].content = message;
  //        this.toastObj.show(this.toasts[0]);
  //      }
  //      else {
  //        this.toasts[1].content = message;
  //        this.toastObj.show(this.toasts[1]);
  //        if ((this.Source == "Report") || (this.Source == "dashboard")) {
  //          this._pivotService.GetDataByReportId(this.ReportId)
  //            .subscribe(
  //              data => {
  //                this.pivotGridDataSource = (data);
  //              }
  //            );
  //        }
  //        else {
  //          this.getData();
  //        }
  //      }

  //    },
  //    (error: any) => alert(error)
  //  );
  //}
  ////No button click method of the dialogue
  //public confirmDlgBtnNoClick = (): void => {
  //  this.confirmDialog.hide();
  //}
  ////Yes button click method of the dialogue
  //public confirmDlgBtnYesClick = (): void => {
  //  this.Iscontinuetodelete = true;
  //  this.FnDelete(this.pivotidtobedelete);
  //  this.confirmDialog.hide();
  //}
  //public confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmDlgBtnYesClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];

  ////method to get details of the selected data for edit
  //GetById(Id) {
  //  this.enable = true;
  //  this.showAddLink = true;
  //  this.ShowCreateBtn = false;
  //  this.ShowUpdateBtn = true;
  //  this.ShowCloseBtn = false;
  //  this._pivotService.GetById(Id)
  //    .subscribe(
  //      data => {
  //        this.Header = "Edit";
  //        this.pivotid = data.Id;
  //        this.chosenReportId = data.ReportId;
  //        this._reportsservice.GetReportsColumnWithDataTypeByReportId(this.chosenReportId)
  //          .subscribe(
  //            data => {
  //              this.ChartsDataColumnSource = data;
  //              this.ChartsDataRowSource = data;
  //            }
  //          );


  //        this.GetReportData();
  //        this.ShowPopupcreate = true;

  //        this.pivotForm.patchValue({

  //          Name: data.Name,
  //          Description: data.Description,
  //          ReportsName: data.ReportId,

  //          Title: JSON.parse(data.PivotJson)['title'],


  //        });

  //      }
  //    );
  //}
  ////GetByIdForClone
  //GetByIdForClone(Id) {
  //  
  //  this.enable = true;
  //  this.showAddLink = true;
  //  this.ShowCreateBtn = true;
  //  this.ShowUpdateBtn = false;
  //  this.ShowCloseBtn = false;
  //  this._pivotService.GetById(Id)
  //    .subscribe(
  //      data => {
  //        this.Header = "Clone";
  //        this.pivotid = data.Id;
  //        this.chosenReportId = data.ReportId;
  //        this._reportsservice.GetReportsColumnWithDataTypeByReportId(this.chosenReportId)
  //          .subscribe(
  //            chartData => {
  //              this.ChartsDataColumnSource = chartData;
  //              this.ChartsDataRowSource = chartData;
  //            }
  //          );

  //        this.GetReportData();
  //        this.ShowPopupcreate = true;

  //        this.pivotForm.patchValue({

  //          Name: data.Name,
  //          Description: data.Description,
  //          ReportsName: data.ReportId,
  //          ColumnCaption: JSON.parse(data.PivotJson)['values'][0].caption,
  //          YAxisData: JSON.parse(data.PivotJson)['values'][0].name,
  //          formatType: JSON.parse(data.PivotJson)['formatName'],
  //          XAxisData: JSON.parse(data.PivotJson)['rows'][0].name,
  //          RowCaption: JSON.parse(data.PivotJson)['rows'][0].caption,

  //        });

  //      }
  //    );
  //}
  //ShowCloseBtn = false; enable = true;
  //GetByIdForReview(Id) {
  //  this.enable = false;
  //  this.showAddLink = false;
  //  this.ShowCloseBtn = true;
  //  this.ShowCreateBtn = false;
  //  this.ShowUpdateBtn = false;
  //  this._pivotService.GetById(Id)
  //    .subscribe(
  //      data => {
  //        this.Header = "Review";
  //        this.pivotid = data.Id;
  //        this.chosenReportId = data.ReportId;
  //        this._reportsservice.GetReportsColumnWithDataTypeByReportId(this.chosenReportId)
  //          .subscribe(
  //            data => {
  //              this.ChartsDataColumnSource = data;
  //              this.ChartsDataRowSource = data;
  //            }
  //          );


  //        this.GetReportData();
  //        this.ShowPopupcreate = true;

  //        this.pivotForm.patchValue({

  //          Name: data.Name,
  //          Description: data.Description,
  //          ReportsName: data.ReportId,

  //          Title: JSON.parse(data.PivotJson)['title'],

  //        });

  //      }
  //    );
  //}
  ////method for updating records
  //Update() {
  //  if (this.pivotForm.invalid) {
  //    return;
  //  }
  //  else {
  //    this.pivotModelData.Id = this.pivotid;
  //    var arrayControl = this.pivotForm.get('Row') as FormArray;
  //    this._userService.GetCurrencyCodeByUserId(this.LoggedInUserId)
  //      .subscribe(currencycode => {
  //        this.usercurrency = currencycode;
  //      }
  //      );
  //    this.Content = {
  //      "title": this.pivotForm.get('Name').value,
  //      "values": [{ "name": this.ColumnLabel, "caption": this.pivotForm.get('ColumnCaption').value }],
  //      "rows": [{ "name": this.pivotForm.get('XAxisData').value, "caption": this.pivotForm.get('RowCaption').value }],
  //      //"rowsSubdivision": arrayControl.value,
  //      "formatName": this.formatName,
  //      "currency": this.usercurrency
  //    };
  //    this.Content['rows'].concat(arrayControl.value);
  //    this.pivotModelData.ReportId = this.chosenReportId;
  //    this.pivotModelData.Name = this.pivotForm.get('Name').value;
  //    this.pivotModelData.Description = this.pivotForm.get('Description').value;
  //    this.pivotModelData.PivotJson = JSON.stringify(this.Content);
  //    this.pivotModelData.CreatedById = this.LoggedInUserId;
  //    this.pivotModelData.CreatedByRoleId = this.LoggedInRoleId;
  //    this.pivotModelData.UpdatedById = this.LoggedInUserId;
  //    this.pivotModelData.UpdatedByRoleId = this.LoggedInRoleId;
  //    this.pivotModelData.CreatedDateTime = new Date();
  //    this.pivotModelData.UpdatedDateTime = new Date();
  //    this.pivotModelData.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + "No Workflow" + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|" + "ProjectId=" + this.projectId;

  //    this._pivotService.Update(this.pivotModelData).subscribe(
  //      (data: string) => {
  //        this.toasts[1].content = "Pivot updated successfully";
  //        this.toastObj.show(this.toasts[1]);
  //        this.ShowPopupcreate = false;
  //        if ((this.Source == "Report") || (this.Source == "dashboard")) {
  //          this._pivotService.GetDataByReportId(this.ReportId)
  //            .subscribe(
  //              data => {
  //                this.pivotGridDataSource = (data);
  //              }
  //            );
  //        }
  //        else {
  //          this.getData();
  //        }
  //      }),
  //      (error: any) => {
  //        console.log(error)
  //        this.toasts[2].content = error.error.Message;
  //        this.toastObj.show(this.toasts[2]);
  //        this.ShowPopupcreate = true;
  //      }
  //  }
  //}
  //showAddLink = true; ShowPopupcreateRow = false;
  //ShowPopupcreatedialogClose() {
  //  this.ShowPopupcreate = false;
  //}
  //ShowPopupcreateRowdialogClose() {
  //  this.ShowPopupcreateRow = false;
  //}
  //Close() {
  //  this.createEditDialog.hide();
  //}
  //Next() {
  //  this.tab.select(1);
  //}
  //Next1() {
  //  

  //  if (this.RowGrid.getRows().length == 0) {
  //    this.toasts[3].content = "No row added to the grid, please add row and click update to add";
  //    this.toastObj.show(this.toasts[3]);
  //  }
  //   else {
  //    this.tab.select(2);
  //  }

  //}
  //Next2() {
  //  if (this.ColumnGrid.getRows().length == 0) {
  //    this.toasts[3].content = "No row added to the grid, please add row and click update to add";
  //    this.toastObj.show(this.toasts[3]);
  //  }
  //  else {
  //    this.tab.select(3);
  //  }
  //}

  //public rowgridlength: number;
  //public Columngridlength: number;

  //Next3() {
  //  this.tab.select(4);
  //}

  //enableTextbox = false;
  //public changeHandler(): void {
  //  if (this.radiobutton.getSelectedValue() === "Yes") { //this means special handling is required

  //    this.enableTextbox = true;
  //    this.YesChecked = true;
  //    this.Nochecked = false;
  //  }
  //  if (this.radiobutton.getSelectedValue() === "No") {


  //    this.YesChecked = false;
  //    this.Nochecked = true;
  //    this.enableTextbox = false;
  //  }
  //}

  //SavePivot() {
  //  let formatsetting;

  //  
  //  if (this.pivotForm.invalid) {
  //    return;
  //  }
  //  else {
  //    if (this.formatName) {
  //      if (this.formatName == "C") {
  //        formatsetting = [{ name: this.selectedField, format: this.formatName, currency: this.usercurrency }]
  //      }
  //      else {
  //        formatsetting = [{ name: this.selectedField, format: this.formatName }]
  //      }
  //    }
  //    let type; let fieldvalue;
  //    if (this.YesChecked == true) {
  //      type = "CalculatedField";
  //      fieldvalue = [{ name: this.pivotForm.get('ValueField').value, caption: this.pivotForm.get('Caption').value, type: 'CalculatedField' }]
  //    }
  //    else if (this.Nochecked == true) {
  //      fieldvalue = [{ name: this.pivotForm.get('ValueField').value, caption: this.pivotForm.get('Caption').value }]
  //    }

  //    this.Content = {
  //      "title": this.pivotForm.get('Name').value, //title of the graph/PT
  //      "formatSettings": formatsetting,
  //      "columns": this.ColumnGrid.getDataRows,
  //      "rows": this.RowGrid.getDataRows

  //    };


  //    let ContentValues = [{ name: this.ColumnLabel, caption: this.pivotForm.get('ColumnCaption').value }]
  //    let ContentRows = [{ name: this.pivotForm.get('XAxisData').value, caption: this.pivotForm.get('RowCaption').value }]

  //    this.pivotModelData.ReportId = this.chosenReportId;
  //    this.pivotModelData.Name = this.pivotForm.get('Name').value;
  //    this.pivotModelData.Description = this.pivotForm.get('Description').value;
  //    this.pivotModelData.PivotJson = JSON.stringify(this.Content);
  //    this.pivotModelData.CreatedById = this.LoggedInUserId;
  //    this.pivotModelData.CreatedByRoleId = this.LoggedInRoleId;
  //    this.pivotModelData.UpdatedById = this.LoggedInUserId;
  //    this.pivotModelData.UpdatedByRoleId = this.LoggedInRoleId;
  //    this.pivotModelData.CreatedDateTime = new Date();
  //    this.pivotModelData.UpdatedDateTime = new Date();
  //    this.pivotModelData.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + "No Workflow" + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|" + "ProjectId=" + this.projectId;

  //    console.log(this.pivotModelData);

  //  }
  //}
