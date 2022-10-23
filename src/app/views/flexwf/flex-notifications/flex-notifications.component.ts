//import { Component, ViewChild, Input, EventEmitter, Output } from '@angular/core';
//import { StepColumnsService } from '../../../services/step-columns.service';
//import { RolesService } from '../../../services/roles.service';
//import { ToolbarService, EditService, PageService, ExcelExportService, PdfExportService, ContextMenuService, GridComponent, GridLine, ToolbarItems, FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
//import { FlexNotificationsService } from '../../../services/flex-notifications.service';
//import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
//import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
//import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
//import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
//import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
//import { Notificationmodel } from '../../../models/flex-notifications.model';
//@Component({
//    selector: 'app-flex-notifications',
//    templateUrl: './flex-notifications.component.html',
//    styleUrls: ['./flex-notifications.component.css'],
//    providers: [FlexNotificationsService, StepColumnsService, RolesService, ToolbarService, EditService, PageService, ExcelExportService, PdfExportService, ContextMenuService]
//})
///** flex-notifications component*/
//export class FlexNotificationsComponent {
//    /** flex-notifications ctor */
//  @Input() configuringWFId: number;
//  @Input() configuringFlexTableId: number;//
//  @Input() configuringWFLabel: string;
//  @Input() configuringstepname: string;//
//  @Input() configuringstepid: number;//
//  @Input() manageactiononParticipant: boolean;//
//  @Input() selectedStepId: number;//
//  @Input() selectedStepLabel: string;
//  @Input() level: string;
//  @Input() SelectedActionName: string;
//  @Input() SelectedStepActionId: number;
//  @Input() FlagIsApplicationLevel: boolean;
//  @Input() ShowGrid: boolean;
//  filterSettings: FilterSettingsModel;
//  visible: Boolean = true;
//  position: ToastPositionModel = { X: 'Center' };
//  hidden = false;

//  /** notifications ctor */
//  constructor(private _service: FlexNotificationsService, private _StepColservice: StepColumnsService, private _Roleservice: RolesService, private _roleService: RolesService, private formBuilder: FormBuilder) {
//    this.NotificationForm = this.formBuilder.group({
//      stepdrop: new FormControl(''),
//      Description: new FormControl('', [Validators.maxLength(4000)]),
//      Name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
//      TemplateDD: new FormControl('', [Validators.required])
//      //Type: new FormControl('', [Validators.required])
//    });
//  }
//  @ViewChild('Notificationgrid', { static: false }) public grid: GridComponent;
//  @ViewChild('Typedd', { static: false }) public Typedd: DropDownListComponent;
//  @ViewChild('toasttype', { static: false }) private toastObj: ToastComponent;
//  @ViewChild('tempdropdown', { static: false }) private tempdropdown: DropDownListComponent;
//  @ViewChild('confirmDialog', { static: false }) public confirmDialog: DialogComponent;
//  showTemplateData: boolean = false;
//  toasts: { [key: string]: Object }[] = [
//    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
//    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
//    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
//    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
//  ];
//  lines: GridLine; //for grid lines
//  toolbar: ToolbarItems[] | object; //for showing toolbar in grid
//  editSettings: Object;
//  notificationdata: Notificationmodel[]; //datasource model  
//  NotificationsHeader: string;
//  ShowPopupFlag: boolean;
//  ShowStepdropdown: boolean;
//  fields: Object = { text: 'Label', value: 'Id' };//declaring fields for steps dropdown
//  Templatefields: Object = { text: 'Label', value: 'Id' };//declaring fields for templates dropdown  
//  SourceTypes: Object = [{ text: 'Transition Email', value: 'Transition Email' }, { text: 'Remainder', value: 'Remainder' }];//{ text: 'Transition Email', value:'Transition Email'}
//  SourceStepColumns: string[]; SourceTemplate: string[]; NotificationHeader: string; stepvalue: string;
//  ShowCreateBtn: boolean = true; ShowManageRecipient: boolean = true; ShowUpdateBtn: boolean = false; ShowRecipientPopUpFlag: boolean; notificationIdforRecipient: number;
  
//  public notificationmodeldata: Notificationmodel = new Notificationmodel();//declaring and initializing the variable to use further
//  showDialogForm: boolean;
  
//  ngOnInit() {
//    this.filterSettings = { type: 'CheckBox' }; // inorder to remove extra filtering from the grid we set it to this type.
//    this.lines = 'Both';//indicated both the lines in grid(horizontal and vertical)
//    this.toolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' }, { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' }, { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' }, { text: 'Manage Recipients', tooltipText: 'Manage Recipients', prefixIcon: 'e-custom-icons e-action-Icon-recipients', id: 'Recipients' }, 'PdfExport', 'CsvExport', 'Search'];
//    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };//it openeds the dialogue while doing ADD, EDIT, DELETE
    
//    this.getData(); //method to get the notification and show in grid
    
//    this._StepColservice.getAllSteps(this.configuringWFId, this.configuringWFLabel)
//      .subscribe(
//        data => {
//          this.SourceStepColumns = (data);
//        }
//      );
//    if (this.level == "steplevel") {
//      this.ShowStepdropdown = true;
//    }
//    this.stepvalue = this.selectedStepLabel;
//    this.NotificationsHeader = "Manage Notification for Action '" + this.SelectedActionName + "' on Step '" + this.selectedStepLabel + "'"
//  }

//  getData() {
//    this._service.GetLNotificationsByWFId(this.configuringWFId, this.SelectedStepActionId)
//      .subscribe(
//        data => {
//          this.notificationdata = (data);
//        }
//    );
    
//  }

//  dialogClose() {
//    this.PostNotificationEvent.emit();
//  }
//  @Output() PostNotificationEvent = new EventEmitter();
//  //@Output() PostStepActionId = new EventEmitter();
//  //method to get the templates for Template dropdown
//  getTemplates() {
//    this._service.GetTemplates(this.configuringWFId, this.SelectedStepActionId)
//      .subscribe(
//        data => {
//          this.SourceTemplate = data;
//        }
//      );
//  }

//  SelectedTemplateId: number;
//  TemplateChange(data) {
//    this.showTemplateData = true;   
//    this.SelectedTemplateId = data.itemData.Id;
//    this.getTemplateDetailById(data.itemData.Id);
//    //GetLEmailTemplateById
    
//  }
//  EmailSubject: string;
//  EmailBody: string;
//  getTemplateDetailById(Id) {
//    this._service.GetLEmailTemplateById(Id)
//      .subscribe(
//        data => {
//          this.EmailSubject = data.EmailSubject;
//          this.EmailBody = data.EmailBody;
//        }
//      );
//  }
//  TypeValue: string;
//  //toolbarclick event
//  toolbarClick(args: ClickEventArgs): void {
//    if (args.item.id === 'grid_pdfexport') {
//      this.grid.pdfExport();
//    }
//    if (args.item.id === 'grid_excelexport') {
//      this.grid.excelExport();
//    }
//    if (args.item.id === 'grid_csvexport') {
//      this.grid.csvExport();
//    }
//    if (args.item.id === 'Add') {
//      this.getTemplates();
//      this.NotificationHeader = "Create Notification";
//      //making fields blank before open
//      this.NotificationForm.patchValue({
//        Name: null,
//        Description: null,
//        TemplateDD: null
//      });
//      this.showTemplateData = false;    
//      this.ShowPopupFlag = true;
//    }

//    if (args.item.id === 'Edit') {
//      this.getTemplates();
//      const selectedRecords = this.grid.getSelectedRecords();
//      if (selectedRecords.length == 0) {
//        this.toasts[3].content = "No notification selected for this operation";
//        this.toastObj.show(this.toasts[3]);
//      }
//      else {
       
//        this.GetById(selectedRecords[0]['Id']);
//      }
//    }

//    if (args.item.id === 'Delete') {
//      const selectedRecords = this.grid.getSelectedRecords();
//      if (selectedRecords.length == 0) {
//        this.toasts[3].content = "No notification selected for this operation";
//        this.toastObj.show(this.toasts[3]);
//      }
//      else {
//        this.Delete(selectedRecords[0]['Id']);
//      }
//    }

//    if (args.item.id === 'Recipients') {
//      const selectedRecords = this.grid.getSelectedRecords();
//      if (selectedRecords.length == 0) {
//        this.toasts[3].content = "No notification selected for this operation";
//        this.toastObj.show(this.toasts[3]);
//      }
//      else {
//        this.notificationIdforRecipient = selectedRecords[0]['Id'];
       
//        this.ShowRecipientPopUpFlag = true;
//      }
//    }
//    //Recipients

//  }
//  confirmHeader: string;
//  confirmcontent: string;
//  selectedNotificationForEdit: number;
//  confirmDialogueWidth: string = "400px";
//  Delete(Id) {    
//    this.confirmHeader = "Please confirm"
//    this.confirmcontent = 'Are you sure you want to delete?'
//    this.confirmDialog.show();
//    this.selectedNotificationForEdit = Id;
//  }
//  GetById(Id) {
//    this.ShowCreateBtn = false;
//    this.ShowUpdateBtn = true;    
//    this.NotificationHeader = "Update Notification";
//    this.ShowPopupFlag = true;
//    this._service.GetById(Id).subscribe(        
//        (data: Notificationmodel) => {
//          this.NotificationForm.patchValue({
//            Name: data.Name,
//            Description: data.Description,
//            TemplateDD: data.TemplateId
//          });
//          //this.EmailSubject = data.EmailSubject;
//          //this.EmailBody = data.EmailBody;
//        }
//    );
   
//    this.selectedNotificationForEdit = Id;
//   // this.getTemplateDetailById(Id);
//    //this.NotificationHeader = "Update Notification";
//    //this.ShowPopupFlag = true;
//  }
//  NotificationForm: FormGroup = null;  
//  //validation regarding functions
//  get f() { return this.NotificationForm.controls; }
//  isFieldValid(field: string) {
//    return !this.NotificationForm.get(field).valid && (this.NotificationForm.get(field).dirty || this.NotificationForm.get(field).touched);
//  }
//  showRecipientPopUp() {
//    this.ShowRecipientPopUpFlag = true;
//  }

//  disable: boolean = true;
//  Save() {
//    if (this.NotificationForm.invalid) {
//      return;
//    }
//    else {
//      this.notificationmodeldata.Name = this.NotificationForm.get('Name').value.replace(/ /g, "");//this.WFcreateForm.get('WFName').value;
//      this.notificationmodeldata.Description = this.NotificationForm.get('Description').value;
//      this.notificationmodeldata.NotificationType = "Notify";
//      this.notificationmodeldata.TemplateId = this.SelectedTemplateId;
//      this.notificationmodeldata.StepActionId = this.SelectedStepActionId;
//      this._service.Post(this.notificationmodeldata).subscribe(
//        (data: any) => {
//          //let MsgPrefix: string = data.substring(0, 2);
//          //let Showmsg: string = data.substring(2, data.length);
//          //if (MsgPrefix == 'S:') {//Means success
//          //  this.toasts[1].content = Showmsg;
//          //  this.toastObj.show(this.toasts[1]);
//          //}
//          //else if (MsgPrefix == 'I:') {//Information message
//          //  this.toasts[3].content = Showmsg;
//          //  this.toastObj.show(this.toasts[3]);
//          //}
//          //else if (MsgPrefix == 'W:') {//Warning Message
//          //  this.toasts[0].content = Showmsg;
//          //  this.toastObj.show(this.toasts[0]);
//          //}
//          //else {//Error Message
//          //  this.toasts[2].content = Showmsg;
//          //  this.toastObj.show(this.toasts[2]);
//          //}
//          if (data) {
//           // alert(data);
//            this.notificationIdforRecipient = data;
//            this.toasts[1].content = "Notification created successfully";
//            this.toastObj.show(this.toasts[1]);
//            this.disable = false;
//            //this.showRecipientPopUp();
//          }
//          //this.ShowPopupFlag = false;
//          //this.getData();//method to refresh the grid with the updated data
//        },
//        (error: any) => console.log(error)
//      );
//    }
//  }
//  //method for updating workflow
//  Update() {
//    if (this.NotificationForm.invalid) {
//      return;
//    }
//    else {
//      this.notificationmodeldata.Id = this.selectedNotificationForEdit;
//      this.notificationmodeldata.Name = this.NotificationForm.get('Name').value.replace(/ /g, "");//this.WFcreateForm.get('WFName').value;
//      this.notificationmodeldata.Description = this.NotificationForm.get('Description').value;
//      this.notificationmodeldata.NotificationType = "Notify";
//      this.notificationmodeldata.TemplateId = this.SelectedTemplateId;
//      //this.notificationmodeldata.StepActionId = this.SelectedStepActionId; not needed while updation
//      this._service.Update(this.notificationmodeldata).subscribe(
//        (data: string) => {
//          let MsgPrefix: string = data.substring(0, 2);
//          let Showmsg: string = data.substring(2, data.length);
//          if (MsgPrefix == 'S:') {//Means success
//            this.toasts[1].content = Showmsg;
//            this.toastObj.show(this.toasts[1]);
//          }
//          else if (MsgPrefix == 'I:') {//Information message
//            this.toasts[3].content = Showmsg;
//            this.toastObj.show(this.toasts[3]);
//          }
//          else if (MsgPrefix == 'W:') {//Warning Message
//            this.toasts[0].content = Showmsg;
//            this.toastObj.show(this.toasts[0]);
//          }
//          else {//Error Message
//            this.toasts[2].content = Showmsg;
//            this.toastObj.show(this.toasts[2]);
//          }
//          this.ShowPopupFlag = false;
//          this.getData();
//        },
//        (error: any) => console.log(error)
//      );
//    }
//  }
 
//  public confirmDlgYesBtnClick = (): void => {
//    this._service.Delete(this.selectedNotificationForEdit).subscribe(
//        (data: string) => {
//          let MsgPrefix: string = data.substring(0, 2);
//          let Showmsg: string = data.substring(2, data.length);
//          if (MsgPrefix == 'S:') {//Means success
//            this.toasts[1].content = Showmsg;
//            this.toastObj.show(this.toasts[1]);
//          }
//          else if (MsgPrefix == 'I:') {//Information message
//            this.toasts[3].content = Showmsg;
//            this.toastObj.show(this.toasts[3]);
//          }
//          else if (MsgPrefix == 'W:') {//Warning Message
//            this.toasts[0].content = Showmsg;
//            this.toastObj.show(this.toasts[0]);
//          }
//          else {//Error Message
//            this.toasts[2].content = Showmsg;
//            this.toastObj.show(this.toasts[2]);
//          }

//        this.getData();
//        });
   
//    this.confirmDialog.hide();
//    return;
//  }
//  public confirmDlgBtnNoClick = (): void => {
//    this.confirmDialog.hide();
//    return;
//  }
//  public confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmDlgYesBtnClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];
//}
