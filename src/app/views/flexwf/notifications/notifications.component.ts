import { FlexWorkflowsService } from '../../../services/flex-workflows.service';
import { StepActionsService } from '../../../services/step-actions.service';
import { Component, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { StepColumnsService } from '../../../services/step-columns.service';
import { RolesService } from '../../../services/roles.service';
import { ToolbarService, EditService, PageService, ExcelExportService, PdfExportService, ContextMenuService, GridComponent, ToolbarItems, FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
import { FlexNotificationsService } from '../../../services/flex-notifications.service';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
import { Notificationmodel } from '../../../models/flex-notifications.model';
import { EmailTemplateService } from '../../../services/email-template.service';
@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css'],
    providers: [FlexWorkflowsService, StepColumnsService, StepActionsService,FlexNotificationsService, StepColumnsService, RolesService, ToolbarService, EditService, PageService, ExcelExportService, PdfExportService, ContextMenuService]
})
/** Notifications component*/
export class NotificationsComponent {

  submitted: boolean = false;

  @ViewChild('Notificationgrid', { static: false }) public grid: GridComponent;
  @ViewChild('toasttype', { static: false }) private toastObj: ToastComponent;
  @ViewChild('confirmDialog', { static: false }) public confirmDialog: DialogComponent;
  @Input() configuringWFId: number;  @Input() configuringWFLabel: string;  @Input() configuringstepname: string; @Input() configuringstepid: number;
  @Input() manageactiononParticipant: boolean;@Input() selectedStepId: number; @Input() selectedStepLabel: string; @Input() level: string;
  @Input() SelectedActionName: string; @Input() SelectedStepActionId: number;  @Input() FlagIsApplicationLevel: boolean;  @Input() isDialog: boolean;
  ShowGrid: boolean; filterSettings: FilterSettingsModel; visible: Boolean = true; position: ToastPositionModel = { X: 'Center' }; hidden = false; showTemplateData: boolean = false;
  StepsSource: string[];  Stepsfields: Object = { text: 'Label', value: 'Id' };WFfields: Object = { text: 'UILabel', value: 'Id' };WFSource: string[];
  LoggedInScopeEntityId: number;
  LoggedInScopeEntityType: string;
/** Notifications ctor */
  constructor(private _service: FlexWorkflowsService, private _StepColservice: StepColumnsService, private _StepActionService: StepActionsService, private _NotificationService: FlexNotificationsService, private _ETservice: EmailTemplateService, private formBuilder: FormBuilder) {
    this.LoggedInScopeEntityId = +sessionStorage.getItem('LoggedInScopeEntityId');
    this.LoggedInScopeEntityType = sessionStorage.getItem('LoggedInScopeEntityType');
    this.NotificationForm = this.formBuilder.group({
      stepdrop: new FormControl(''),
      Description: new FormControl('', [Validators.maxLength(4000)]),
      Name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      TemplateDD: new FormControl('', [Validators.required])
      //Type: new FormControl('', [Validators.required])
    });
  }    
  toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];  
  toolbar: ToolbarItems[] | object; //for showing toolbar in grid
  notificationdata: Notificationmodel[]; //datasource model 
  ShowPopupFlag: boolean;   fields: Object = { text: 'Label', value: 'Id' };//declaring fields for steps dropdown
  Templatefields: Object = { text: 'Label', value: 'Id' };//declaring fields for templates dropdown  
  SourceTypes: Object = [{ text: 'Transition Email', value: 'Transition Email' }, { text: 'Remainder', value: 'Remainder' }];//{ text: 'Transition Email', value:'Transition Email'}
  SourceTemplate: any[]; NotificationHeader: string; stepvalue: string;
  ShowCreateBtn: boolean = true;ShowUpdateBtn: boolean = false; ShowRecipientPopUpFlag: boolean; notificationIdforRecipient: number;
  notificationmodeldata: Notificationmodel = new Notificationmodel();//declaring and initializing the variable to use further
  showDialogForm: boolean; SelectedTemplateId: number; EmailSubject: string; EmailBody: string; TypeValue: string; confirmHeader: string;confirmcontent: string;selectedNotificationForEdit: number;
  confirmDialogueWidth: string = "400px"; NotificationForm: FormGroup = null; disable: boolean = true; ActionsSource: string[];Actionsfields: Object = { text: 'Label', value: 'Id' };
  @Output() PostNotificationEvent = new EventEmitter(); showDialogFormat: boolean; showFormFormat: boolean; selectedNotificationName: string; ShowRecBtn: boolean;
  UserName: string = sessionStorage.getItem("LoginEmail");
  CurrentRoleName: string = sessionStorage.getItem("CurrentRoleName");
  LoginEmail: string = sessionStorage.getItem("LoginEmail");
  LoggedInRoleId: number = +sessionStorage.getItem("LoggedInRoleId");
  LoggedInUserId: number = +sessionStorage.getItem("LoggedInUserId");
  SessionValues: any = sessionStorage;
  projectId: number = +sessionStorage.getItem("ProjectId"); // conversion from string to int
  ngOnInit() {
    if (this.isDialog == true) { // that means we have called it from the workflow level
      this.getData();;
      this.showFormFormat = false;
      this.showDialogFormat = true
    }
    else if (this.isDialog == undefined) { //that means we hae called it from the menu level
      this.getWFdata();//method to bind the wf dropdown
      this.showDialogFormat = false;
      this.showFormFormat = true;
    }   
    this.filterSettings = { type: 'CheckBox' }; // inorder to remove extra filtering from the grid we set it to this type.    
    this.toolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' }, { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' }, { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' }, { text: 'Manage Recipients', tooltipText: 'Manage Recipients', prefixIcon: 'e-custom-icons e-action-Icon-recipients', id: 'Recipients' }, 'PdfExport', 'CsvExport', 'Search'];
    
  }
  //method to get the notification data and show in grid
  getData() {
    
    this._NotificationService.GetLNotificationsByWFId(this.configuringWFId, this.SelectedStepActionId)
      .subscribe(
        data => {
          this.notificationdata = (data);
        }
      );
  }
  dialogClose() {
    this.PostNotificationEvent.emit();
  }
  //method to get the templates for Template dropdown
  getTemplates() {
    
    this._NotificationService.GetTemplates(this.configuringWFId, this.SelectedStepActionId, this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)    
      .subscribe(
        data => {
          this.SourceTemplate = data;
        }
      );
  }
  //method called on the change of templates dropdown
  TemplateChange(data) {
    this.showTemplateData = true;
    this.SelectedTemplateId = data.itemData.Id;
    this.getTemplateDetailById(data.itemData.Id);
  }
  //method to get the data from template id
  getTemplateDetailById(Id) {
    this._ETservice.GetLEmailTemplateById(Id)
      .subscribe(
        data => {
       
          this.EmailSubject = data.EmailSubject;
          this.EmailBody = data.EmailBody;
        }
      );
  }  
  //toolbarclick event
  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'Notificationgrid_pdfexport') {
      this.grid.pdfExport();
    }
    if (args.item.id === 'Notificationgrid_excelexport') {
      this.grid.excelExport();
    }
    if (args.item.id === 'Notificationgrid_csvexport') {
      this.grid.csvExport();
    }
    if (args.item.id === 'Add') {
      this.getTemplates();
      this.NotificationHeader = "Create Notification";
      this.stepvalue = this.selectedStepLabel;
      //making fields blank before open
      this.NotificationForm.patchValue({
        Name: null,
        Description: null,
        TemplateDD: null
      });
      this.showTemplateData = false;
      this.ShowPopupFlag = true;
      this.ShowRecBtn = true;
    }
    if (args.item.id === 'Edit') {
      this.getTemplates();
      this.ShowRecBtn = false;//while editing ecipients will not get modified to hiding its button
      const selectedRecords = this.grid.getSelectedRecords();     
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No notification selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.GetById(selectedRecords[0]['Id']);
      }
    }
    if (args.item.id === 'Delete') {
      const selectedRecords = this.grid.getSelectedRecords();
      
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No notification selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.selectedNotificationName = selectedRecords[0]['Name'];
        this.ConfirmDelete(selectedRecords[0]['Id']);
      }
    }
    if (args.item.id === 'Recipients') {
      const selectedRecords = this.grid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No notification selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.notificationIdforRecipient = selectedRecords[0]['Id'];
        this.ShowRecipientPopUpFlag = true;
      }
    }
  }

  public recordDoubleClick(args): void {
    this.getTemplates();
    this.ShowRecBtn = false;//while editing ecipients will not get modified to hiding its button
    this.GetById(args.rowData['Id']);
  }

  //event emitter method for recipient module
  PostRecipientEvent() {
    this.ShowRecipientPopUpFlag = false;
  }
  //show confirmation box before actually deleting
  ConfirmDelete(Id) {
    this.confirmHeader = "Please confirm"
    this.confirmcontent = 'Are you sure you want to delete?'
    this.confirmDialog.show();
    this.selectedNotificationForEdit = Id;
  }
  //method to get the notification detail by id
  GetById(Id) {    
    this.ShowCreateBtn = false;
    this.ShowUpdateBtn = true;
    this.ShowRecBtn = false;
    this.NotificationHeader = "Update Notification";
    this._NotificationService.GetById(Id).subscribe(
      (data: any) => {
        this.SourceTemplate.push({ Id: data.TemplateId, Label: data.TemplateName });//pushing the existing item into dropdown
        this.SelectedTemplateId = data.TemplateId;//dropdown selected template
        this.NotificationForm.patchValue({
          Name: data.Name,
          Description: data.Description,
          TemplateDD: data.TemplateId
        });
        this.showTemplateData = true;
        this.getTemplateDetailById(data.TemplateId);
        this.ShowPopupFlag = true;        
      }
    );
    this.selectedNotificationForEdit = Id;//id of the notification selected for edit
  } 
  //validation regarding function--------->
  get f() { return this.NotificationForm.controls; }
  //method to show recipient pop up on button click
  showRecipientPopUp() {
    this.ShowRecipientPopUpFlag = true;
  }
  //method to save notification 
  Save() {
    
    this.submitted = true;
    //if (this.NotificationForm.invalid) {
    //  return;
    //}
    //else
    {
      this.notificationmodeldata.Name = this.NotificationForm.get('Name').value.trim();//removing lead and back space from the string
      this.notificationmodeldata.Description = this.NotificationForm.get('Description').value;
      this.notificationmodeldata.NotificationType = "Notify";//we are pssing it as hardcoded
      this.notificationmodeldata.TemplateId = this.SelectedTemplateId;
      this.notificationmodeldata.StepActionId = this.SelectedStepActionId;
      this.notificationmodeldata.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + "No Workflow" + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|" + "ProjectId=" + this.projectId;
      this.notificationmodeldata.ScopeEntityType = this.LoggedInScopeEntityType;
      this.notificationmodeldata.ScopeEntityId = this.LoggedInScopeEntityId;
      this.notificationmodeldata.CreatedById = this.LoggedInUserId;
      this.notificationmodeldata.UpdatedById = this.LoggedInUserId;
      this.notificationmodeldata.CreatedByRoleId = this.LoggedInRoleId;
      this.notificationmodeldata.UpdatedByRoleId = this.LoggedInRoleId;
      this._NotificationService.Post(this.notificationmodeldata).subscribe(
        (data: any) => {          
          if (data) {
            this.notificationIdforRecipient = data;
            this.toasts[1].content = "Notification created successfully";
            this.toastObj.show(this.toasts[1]);
            this.disable = false;
          }
          this.getData();//method to refresh the grid with the updated data
        },
        (error: any) => console.log(error)
      );
    }
  }
  //method for updating notification
  Update() {
    //if (this.NotificationForm.invalid) {
    //  return;
    //}
    //else
    {
      this.notificationmodeldata.Id = this.selectedNotificationForEdit;
      this.notificationmodeldata.Name = this.NotificationForm.get('Name').value.replace(/ /g, "");//this.WFcreateForm.get('WFName').value;
      this.notificationmodeldata.Description = this.NotificationForm.get('Description').value;
      this.notificationmodeldata.NotificationType = "Notify";
      this.notificationmodeldata.TemplateId = this.SelectedTemplateId;
      this.notificationmodeldata.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + "No Workflow" + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|" + "ProjectId=" + this.projectId;
      this.notificationmodeldata.ScopeEntityType = this.LoggedInScopeEntityType;
      this.notificationmodeldata.ScopeEntityId = this.LoggedInScopeEntityId;
      this.notificationmodeldata.UpdatedById = this.LoggedInUserId;
      this.notificationmodeldata.CreatedByRoleId = this.LoggedInRoleId;
      this.notificationmodeldata.UpdatedByRoleId = this.LoggedInRoleId;
      this.notificationmodeldata.CreatedById = this.LoggedInUserId;
      this._NotificationService.Update(this.notificationmodeldata).subscribe(
        (data: string) => {
          let MsgPrefix: string = data.substring(0, 2);
          let Showmsg: string = data.substring(2, data.length);
          if (MsgPrefix == 'S:') {//Means success
            this.toasts[1].content = Showmsg;
            this.toastObj.show(this.toasts[1]);
          }
          else if (MsgPrefix == 'I:') {//Information message
            this.toasts[3].content = Showmsg;
            this.toastObj.show(this.toasts[3]);
          }
          else if (MsgPrefix == 'W:') {//Warning Message
            this.toasts[0].content = Showmsg;
            this.toastObj.show(this.toasts[0]);
          }
          else {//Error Message
            this.toasts[2].content = Showmsg;
            this.toastObj.show(this.toasts[2]);
          }
          this.ShowPopupFlag = false;
          this.getData();
        },
        (error: any) => console.log(error)
      );
    }
  }
  //method called on the confirmation yes button click
  confirmDlgYesBtnClick = (): void => {
    this.notificationmodeldata.Name = this.selectedNotificationName;
    this.notificationmodeldata.Id = this.selectedNotificationForEdit;
    this.notificationmodeldata.CreatedById = this.LoggedInUserId;
    this.notificationmodeldata.UpdatedById = this.LoggedInUserId;
    this.notificationmodeldata.ScopeEntityType = this.LoggedInScopeEntityType;
    this.notificationmodeldata.ScopeEntityId = this.LoggedInScopeEntityId;
    this.notificationmodeldata.CreatedByRoleId = this.LoggedInRoleId;
    this.notificationmodeldata.UpdatedByRoleId = this.LoggedInRoleId;
    this.notificationmodeldata.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + "No Workflow" + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|" + "ProjectId=" + this.projectId;
    this._NotificationService.Delete(this.notificationmodeldata).subscribe(
      (data: string) => {
        let MsgPrefix: string = data.substring(0, 2);
        let Showmsg: string = data.substring(2, data.length);
        if (MsgPrefix == 'S:') {//Means success
          this.toasts[1].content = Showmsg;
          this.toastObj.show(this.toasts[1]);
        }
        else if (MsgPrefix == 'I:') {//Information message
          this.toasts[3].content = Showmsg;
          this.toastObj.show(this.toasts[3]);
        }
        else if (MsgPrefix == 'W:') {//Warning Message
          this.toasts[0].content = Showmsg;
          this.toastObj.show(this.toasts[0]);
        }
        else {//Error Message
          this.toasts[2].content = Showmsg;
          this.toastObj.show(this.toasts[2]);
        }

        this.getData();
      });

    this.confirmDialog.hide();
    return;
  }
  //method called on the confirmation no button click
  confirmDlgBtnNoClick = (): void => {
    this.confirmDialog.hide();
    return;
  }
  confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmDlgYesBtnClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];
  //method to get the workflow data and fill in workflow dropdown
  getWFdata() {
    this._service.GetWorkFlowsByScopeEntity(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
      .subscribe(
        data => {
          this.WFSource = (data);
        }
      );
  }
  //wf dropdown change event method
  WFNameChange(args: any): void {
    this.ShowGrid = false;
    this.configuringWFId = args.itemData.Id;
    this.configuringWFLabel = args.itemData.UILabel;
    this.getStepsdata();
  }
  //steps dropdown change event method
  StepsChange(args: any): void {
    this.ShowGrid = false;
    this.selectedStepId = args.itemData.Id;
    this.selectedStepLabel = args.itemData.Label;
    this.getActionsdata();
  }
  //method to get steps data and fill in steps dropdown
  getStepsdata() {
    this._StepColservice.getAllSteps(this.configuringWFId, this.configuringWFLabel)
      .subscribe(
        data => {
          this.StepsSource = (data);
        }
      );
  }
  //method to get actions data and fill in actions dropdown
  getActionsdata() {
    this._StepActionService.getAllActionsDetailsByStepId(this.selectedStepId)
      .subscribe(
        data => {
          this.ActionsSource = (data);
        }
      );
  }
  //Actions dropdown change event method
  ActionChange(args: any): void {
    
    this.SelectedStepActionId = args.value;
    this.SelectedActionName = args.itemData.Label;
    this.ShowGrid = true;
    //on changing of actions dropdown we are showing grid and binding data into it.
    this.getData(); //method to get the notification and show in grid
  }
}


