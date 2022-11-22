import { Component, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToolbarItems } from '@syncfusion/ej2-angular-pivotview';
import { DropDownListComponent, ListBoxComponent, MultiSelectComponent } from '@syncfusion/ej2-angular-dropdowns';
import { GridComponent, GridLine, FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';

import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
import { announcementsmodel } from '../../../models/announcements.model';
import { AnnouncementsService } from '../../../services/announcements.service';
import { CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';
import { DateRangePicker } from '@syncfusion/ej2-angular-calendars';


@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css'],
  encapsulation: ViewEncapsulation.None
})
/** announcement component*/
export class AnnouncementComponent {
  /** announcement ctor */
  public today: Date = new Date(new Date().toDateString());
  public weekStart: Date = new Date(new Date(new Date().setDate(new Date().getDate() - (new Date().getDay() + 7) % 7)).toDateString());
  public weekEnd: Date = new Date(new Date(new Date().setDate(new Date(new Date().setDate((new Date().getDate()
    - (new Date().getDay() + 7) % 7))).getDate() + 6)).toDateString())
    ;
  public monthStart: Date = new Date(new Date(new Date().setDate(1)).toDateString());
  public monthEnd: Date = new Date(new Date(new Date(new Date().setMonth(new Date().getMonth() + 1)).setDate(0)).toDateString());
  public lastStart: Date = new Date(new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)).toDateString());
  public lastEnd: Date = new Date(new Date(new Date().setDate(0)).toDateString());
  public yearStart: Date = new Date(new Date(new Date().getFullYear() - 1, 0, 1).toDateString());
  public yearEnd: Date = new Date(new Date(new Date().getFullYear() - 1, 11, 31).toDateString());
  constructor(private formBuilder: FormBuilder,
    private _service: AnnouncementsService
  ) {
    this.announcementForm = this.formBuilder.group({
      Name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      Type: new FormControl(''),
      Body: new FormControl('', [Validators.required]),
      Subject: new FormControl('', [Validators.maxLength(100)]),
      MoveToTop: new FormControl(''),
      Range: new FormControl('', [Validators.required]),
      AnnouncementTypeValue: new FormControl('', [Validators.required])
    });
  } //const ends

  @ViewChild('date', { static: false })
  public dateObj: DateRangePicker;
  
  public onCreate(event) {
    
    console.log(event);
    this.dateObj.width = "100px";
   // (this.dateObj as any).isMobile = true;
  }
  @ViewChild('announcementTypeDD', { static: false })
  public announcementTypeDD: MultiSelectComponent;
  announcementForm: FormGroup = null;
  //announcementTypeSource: any[];
  projectId: number;
  hidden: boolean = false;
  ShowCreateBtn: boolean = true;
  ShowUpdateBtn: boolean = false;
  confirmcontent: string;
  sessionprojectid: string;
  public value;
  announcementTypeSource: Object[] = [{ text: 'Email', value: 'Email' }, { text: 'SMS', value: 'Sms' }, { text: 'Mobile App', value: 'Mobile App' }, { text: 'Portal', value: 'Portal' }];
  announcementTypeDataFields: Object = { text: 'text', value: 'value' };
  @ViewChild('TypeListObj', { static: false }) public TypeListObj: DropDownListComponent;
  announcementId: number;
  LoggedInUserId: number;
  LoggedInRoleId: number;
  GridDataSource: announcementsmodel[];
  Header: string;
  toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  @ViewChild('Announcementsgrid', { static: false }) public Announcementsgrid: GridComponent;
  @ViewChild('checkBoxmovetotop', { static: false }) public checkBoxmovetotop: CheckBoxComponent;
  //checkBoxmovetotop
  @ViewChild('toasttype', { static: false }) private toastObj: ToastComponent;
  @ViewChild('confirmDialog', { static: false }) public confirmDialog: DialogComponent;
  position: ToastPositionModel = { X: 'Center' };
  lines: GridLine; WFSource: string[]; editSettings: Object;

  ShowPopupcreate: boolean = false;
  toolbar: ToolbarItems[] | object;
  isChecked: boolean = false;
  AnnouncemnetsmodelData: announcementsmodel = new announcementsmodel();//declaring and initializing the variable to use further  
  CurrentRoleName: string = sessionStorage.getItem("CurrentRoleName");
  LoginEmail: string = sessionStorage.getItem("LoginEmail");

  selectedAnnouncementType: string;
  SessionValues: any = sessionStorage;
  EntityType: string;
  EntityId: number;

  //-----------------------------method call on the toolbars of grid------------------------------
  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'Announcementsgrid_pdfexport') {
      this.Announcementsgrid.pdfExport();
    }
    if (args.item.id === 'Announcementsgrid_excelexport') {
      this.Announcementsgrid.excelExport();
    }
    if (args.item.id === 'Announcementsgrid_csvexport') {
      this.Announcementsgrid.csvExport();
    }
    if (args.item.id === 'Add') {
      this.Header = "Create Announcement"
      this.ShowCreateBtn = true;
      this.ShowUpdateBtn = false;
      this.value = [null, null];
      this.ShowPopupcreate = true;//opening create form
     
      this.announcementForm.patchValue({
        Name: null,
        
        Subject: null,
        Body: null,
        
        Range: null,
        AnnouncementTypeValue: null
      });
    }
    if (args.item.id === 'Edit') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.Header = "Edit Announcement"
      const selectedRecords = this.Announcementsgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No Announcement selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.announcementId = selectedRecords[0]['Id'];// 
        this.GetById(this.announcementId);
      }
    }
    if (args.item.id === 'Delete') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      const selectedRecords = this.Announcementsgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No Announcement selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.announcementId = selectedRecords[0]['Id'];// 
        this.DeleteById(this.announcementId);
      }
    }
  }

  //--------inorder to remoive first unwanted row we have to define this filtersetting line
  filterSettings: FilterSettingsModel;

  //--------------------------Init event -------------------------------------------------
  ngOnInit() {

    this.lines = 'Both'; //to et both lines in grid
    this.filterSettings = { type: 'CheckBox' };
    //to show custom tool bar in grid with custom icons and method calls
    this.toolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' }, { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' }, { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' }, 'ExcelExport', 'PdfExport', 'CsvExport', 'Search'];

    //initializing events of grid record
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };

    //getting required parametrs value from session
    this.LoggedInRoleId = +sessionStorage.getItem("LoggedInRoleId");
    this.sessionprojectid = sessionStorage.getItem("ProjectId");
    this.projectId = +this.sessionprojectid; // conversion from string to int   
    this.LoggedInUserId = +sessionStorage.getItem("LoggedInUserId");
    this.EntityType = sessionStorage.getItem("LoggedInScopeEntityType");
    this.EntityId = +sessionStorage.getItem("LoggedInScopeEntityId");
    this.getGriddata();//binding wf drpodown
  }

  //to access all the controls of the defined form on html page created a comon method
  get f() { return this.announcementForm.controls; }
  public isFieldValid(field: string) {
    return !this.announcementForm.get(field).valid && (this.announcementForm.get(field).dirty || this.announcementForm.get(field).touched);
  }
  ShowSubject: boolean = true;
  getGriddata() {
    this._service.GetAnnouncements()
      .subscribe(
        data => {
          this.GridDataSource = (data);
        }
      );
  }
  OnChange(event) {
    if (event.value.find(x => x === "Email") == "Email") {
      this.ShowSubject = true;
    }
    else {
      this.ShowSubject = false;
    }
    
  }
  Save() {
    if (this.announcementForm.invalid) {
      return;
    }
    else {
      this.AnnouncemnetsmodelData.Name = this.announcementForm.get('Name').value;
      this.AnnouncemnetsmodelData.Type = "Information";
      if (this.announcementForm.get('Subject').value == null) {
        this.AnnouncemnetsmodelData.Subject = null;
      }
      else {
        this.AnnouncemnetsmodelData.Subject = this.announcementForm.get('Subject').value;
      }
    
      this.AnnouncemnetsmodelData.Body = this.announcementForm.get('Body').value;
      let range = this.announcementForm.get('Range').value;
      this.AnnouncemnetsmodelData.EffectiveStartDate = range[0];
      this.AnnouncemnetsmodelData.EffectiveEndDate = range[1];
      this.AnnouncemnetsmodelData.MovetoTop = this.checkBoxmovetotop.checked;
      this.AnnouncemnetsmodelData.ParameterCarrier = "|UserName=" + sessionStorage.getItem("LoginEmail") + "|RoleName=" + sessionStorage.getItem("LoggedInRoleName") + "|SessionValues=" + sessionStorage + "|EntityType=" + sessionStorage.getItem("LoggedInScopeEntityType") + "|EntityId=" + sessionStorage.getItem("LoggedInScopeEntityId") + "|TypeValues=" + this.announcementForm.get('AnnouncementTypeValue').value + "|ProjectId=" + this.projectId;
      this.AnnouncemnetsmodelData.CreatedById = this.LoggedInUserId;
      this.AnnouncemnetsmodelData.UpdatedById = this.LoggedInUserId;
      this.AnnouncemnetsmodelData.CreatedByRoleId = this.LoggedInRoleId;
      this.AnnouncemnetsmodelData.UpdatedByRoleId = this.LoggedInRoleId;
      //this.AnnouncemnetsmodelData.ProjectId = this.projectId;
      this._service.Save(this.AnnouncemnetsmodelData).subscribe(
        (data) => {
          this.toasts[1].content = "Announcement created successfully";
          this.toastObj.show(this.toasts[1]);
          this.ShowPopupcreate = false;
          this.getGriddata();
        },
        (error: any) => {
          this.toasts[2].content = error.error.Message;
          this.toastObj.show(this.toasts[2]);
          this.ShowPopupcreate = true;
        }
      );

    }

  }
  selectedValues = [];
  GetById(Id) {
    this._service.GetById(Id)
      .subscribe(data => {
        let selectedList = data.TypeValuesList.split(',');
        let selectionTypesList = [];
        for (let j = 0; j < selectedList.length; j++) {
          selectionTypesList.push(selectedList[j]);
        }
        this.selectedValues = selectionTypesList;

        if (this.selectedValues.find(x => x === "Email") == "Email") {
          this.ShowSubject = true;
        }
        else {
          this.ShowSubject = false;
        }

        this.ShowPopupcreate = true;
        this.value = [data.EffectiveStartDate, data.EffectiveEndDate];
        this.announcementForm.patchValue({
          Name: data.Name,
          Type: data.Type,
          Subject: data.Subject,
          Body: data.Body,
          MoveToTop: data.MoveToTop,
          Range: this.value,
          AnnouncementTypeValue: this.selectedValues
        });
        this.announcementId = data.Id;
        
        this.ShowUpdateBtn = true;
        this.ShowCreateBtn = false;

      }
      );


  }
  Update() {
    this.AnnouncemnetsmodelData.Name = this.announcementForm.get('Name').value;
    this.AnnouncemnetsmodelData.Type = this.announcementForm.get('Type').value;
    this.AnnouncemnetsmodelData.Subject = this.announcementForm.get('Subject').value;
    this.AnnouncemnetsmodelData.Body = this.announcementForm.get('Body').value;
    let range = this.announcementForm.get('Range').value;
    this.AnnouncemnetsmodelData.EffectiveStartDate = range[0];
    this.AnnouncemnetsmodelData.EffectiveEndDate = range[1];
    this.AnnouncemnetsmodelData.MovetoTop = this.checkBoxmovetotop.checked;
    this.AnnouncemnetsmodelData.ParameterCarrier = "|UserName=" + sessionStorage.getItem("LoginEmail") + "|RoleName=" + sessionStorage.getItem("LoggedInRoleName") + "|SessionValues=" + sessionStorage + "|EntityType=" + sessionStorage.getItem("LoggedInScopeEntityType") + "|EntityId=" + sessionStorage.getItem("LoggedInScopeEntityId") + "|TypeValues=" + this.announcementForm.get('AnnouncementTypeValue').value + "|ProjectId=" + this.projectId;
    this.AnnouncemnetsmodelData.CreatedById = this.LoggedInUserId;
    this.AnnouncemnetsmodelData.UpdatedById = this.LoggedInUserId;
    this.AnnouncemnetsmodelData.CreatedByRoleId = this.LoggedInRoleId;
    this.AnnouncemnetsmodelData.UpdatedByRoleId = this.LoggedInRoleId;
    this.AnnouncemnetsmodelData.Id = this.announcementId;
    if (this.announcementForm.invalid) {
      return;
    }
    else {
      
      this.AnnouncemnetsmodelData.CreatedById = this.LoggedInUserId;
      this.AnnouncemnetsmodelData.UpdatedById = this.LoggedInUserId;
      this.AnnouncemnetsmodelData.CreatedByRoleId = this.LoggedInRoleId;
      this.AnnouncemnetsmodelData.UpdatedByRoleId = this.LoggedInRoleId;
      this._service.Update(this.AnnouncemnetsmodelData).subscribe(
        (data) => {
          this.toasts[1].content = "Announcement updated successfully";
          this.toastObj.show(this.toasts[1]);

          this.ShowPopupcreate = false;
          this.getGriddata();
        }),
        (error: any) => {
          this.toasts[2].content = error.error.Message;
          this.toastObj.show(this.toasts[2]);
          this.ShowPopupcreate = true;

        }
    }
  }
  public recordDoubleClick(args): void {
    this.GetById(args.rowData['Id']);
    this.Header = "Edit Announcement";
    this.ShowCreateBtn = false;
    this.ShowUpdateBtn = true;
  }
  DeleteById(Id) {
    this.confirmcontent = 'Are you sure you want to delete?';
    this.confirmDialog.show();
  }
  public confirmDlgBtnNoClick = (): void => {
    this.confirmDialog.hide();
  }
  public confirmDlgBtnYesClick = (): void => {

    this.AnnouncemnetsmodelData.Id = this.announcementId;
    this.AnnouncemnetsmodelData.ParameterCarrier = "UserName=" + this.LoginEmail + "|RoleName=" + this.CurrentRoleName + "|ProjectId=" + this.projectId;   
    this.AnnouncemnetsmodelData.CreatedById = this.LoggedInUserId;
    this.AnnouncemnetsmodelData.UpdatedById = this.LoggedInUserId;
    this.AnnouncemnetsmodelData.CreatedByRoleId = this.LoggedInRoleId;
    this.AnnouncemnetsmodelData.UpdatedByRoleId = this.LoggedInRoleId;
    this._service.Delete(this.AnnouncemnetsmodelData).subscribe(
      (data: any) => {
        if (data == "success") {
          this.toasts[1].content = "Announcement deleted successfully";
          this.toastObj.show(this.toasts[1]);

        }
        else {
          this.toasts[0].content = data;;
          this.toastObj.show(this.toasts[0]);
        }
        this.getGriddata();
      }
      //(error: any) => alert(error)
    );
    this.confirmDialog.hide();
  }
  public confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmDlgBtnYesClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];
}  
