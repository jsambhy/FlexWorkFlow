import { Component, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { RolesService } from '../../../services/roles.service';
import { ToolbarService, EditService, PageService, ExcelExportService, PdfExportService, ContextMenuService, GridComponent, GridLine, ToolbarItems, FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
import { FlexNotificationsService } from '../../../services/flex-notifications.service';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { RecipientsService } from '../../../services/recipients.service';
import { RecipientsModel } from '../../../models/recipients.model';
import { MultiSelectComponent } from '@syncfusion/ej2-angular-dropdowns';
@Component({
  selector: 'app-recipients',
  templateUrl: './recipients.component.html',
  styleUrls: ['./recipients.component.css'],
  providers: [RecipientsService,ToolbarService, EditService, PageService, ExcelExportService, PdfExportService, ContextMenuService]
})
/** recipients component*/
export class RecipientsComponent {
  projectId: number = +sessionStorage.getItem("ProjectId"); // conversion from string to int  
  CurrentRoleName: string = sessionStorage.getItem("CurrentRoleName");
  LoginEmail: string = sessionStorage.getItem("LoginEmail");
  LoggedInRoleId: number = +sessionStorage.getItem("LoggedInRoleId");
  LoggedInUserId: number = +sessionStorage.getItem("LoggedInUserId");
  LoggedInScopeEntityId: number;
  LoggedInScopeEntityType: string;
  SessionValues: any = sessionStorage;
  @Input() configuringWFId: number; @Input() configuringWFLabel: string;
  @Input() notificationIdforRecipient: number; @Input() selectedStepId: number;  filterSettings: FilterSettingsModel;  public position: ToastPositionModel = { X: 'Center' };
  recipientsdata: RecipientsModel[]; RecipientForm: FormGroup = null;
  @ViewChild('Recipientgrid', { static: false }) public Recipientgrid: GridComponent;
  @ViewChild('toasttype', { static: false }) private toastObj: ToastComponent;
  @ViewChild('confirmDialog', { static: false }) public confirmDialog: DialogComponent;
  @ViewChild('ms', { static: false }) public multiselect: MultiSelectComponent;

  /** notifications ctor */
  constructor(private _service: FlexNotificationsService, private _Recipientservice: RecipientsService, private _roleService: RolesService, private formBuilder: FormBuilder) {
    this.LoggedInScopeEntityId = +sessionStorage.getItem('LoggedInScopeEntityId');
    this.LoggedInScopeEntityType = sessionStorage.getItem('LoggedInScopeEntityType');
    this.RecipientForm = this.formBuilder.group({
      MSControl : new FormControl(''),
      RecipientTypeDD: new FormControl('', [Validators.required])
    });
  } 
  toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  lines: GridLine; //for grid lines
  toolbar: ToolbarItems[] | object; //for showing toolbar in grid
  SourceRecipient: Object = []; showMS: boolean = false; RecipientType: string; SourceList: any[];
  RecipientModel: RecipientsModel = new RecipientsModel();
  fields: Object = { text:'RecipientName',value:'Id'}
  RecipientHeader: string = "Manage Recipients";
  CreateRecipientHeader: string;  ShowCreateRecipientPopUpFlag: boolean = false;  btndisable: boolean = true;
  //---------------------------------methods block------------------------------------------------------------
  ngOnInit() {
    this.filterSettings = { type: 'CheckBox' }; // inorder to remove extra filtering from the grid we set it to this type.
    this.lines = 'Both';//indicated both the lines in grid(horizontal and vertical)
    this.toolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' }, { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete', align: 'Left' }, 'PdfExport', 'CsvExport', 'Search'];
    this.GetRecipientsByNotificationId(this.notificationIdforRecipient);
  }
  //Validation related method
  get f1() { return this.RecipientForm.controls; }  

  //method called on the changing of the dropdown
  RecipientChange(ddvalue) {
    
    
    if (ddvalue.itemData.value == "USER") {
      this.showMS = true;
      this.RecipientType = "User";
      this.GetUsers();
      this.btndisable = false;
    }

    if (ddvalue.itemData.value == "ROLE") {
      this.showMS = true;
      this.RecipientType = "Role";
      this.GetRoles();
      this.btndisable = false;
    }

    if (ddvalue.itemData.value == "P") {//participant for step
      this.showMS = true;
      this.RecipientType = "ParticipantsForStep";
      this.GetPFS();
      this.btndisable = false;
    }

    if (ddvalue.itemData.value == "R") {//Requestor
      this.showMS = false;
      this.RecipientType = "Requestor";
      this.btndisable = false;
    }
    this.multiselect.value = null;
  }

  

  //method to bind the users in multiselect dropdown
  GetUsers() {
    this.GetRecipientsList("User", this.configuringWFId, this.notificationIdforRecipient);
  }
  //method to bind participant associated with steps in multiselect dropdown
  GetPFS() {
    this.GetRecipientsList("ParticipantsForStep", this.configuringWFId, this.notificationIdforRecipient);
  }

  //method to bind the roles in multiselect dropdown
  GetRoles() {
    this.GetRecipientsList("Role", this.configuringWFId, this.notificationIdforRecipient);
  }

  GetRecipientsList(Type, WFId, NotificationId) {
    this._Recipientservice.GetRecipientsListForDropdown(Type, this.LoggedInScopeEntityType, this.LoggedInScopeEntityId, WFId, NotificationId)
      .subscribe(
        data => {
          this.SourceList = data;
        }
      );
  }
  //method to get recipients data and show in grid across the notification selected
  GetRecipientsByNotificationId(NotificationId) {
    
    this._service.GetRecipientsByNotificationId(NotificationId, this.configuringWFId)
      .subscribe(
        data => {
          this.recipientsdata = data;
        }
      );
  }
 
  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'Recipientgrid_pdfexport') {
      this.Recipientgrid.pdfExport();
    }
    if (args.item.id === 'Recipientgrid_excelexport') {
      this.Recipientgrid.excelExport();
    }
    if (args.item.id === 'Recipientgrid_csvexport') {
      this.Recipientgrid.csvExport();
    }
    if (args.item.id === 'Add') {
      this.CreateRecipientHeader = "Create Recipients";
      //this.ProjectForm.get('Admin').value
      //to make the fields blank while opening the create pop up again
        this.RecipientForm.patchValue({
          RecipientTypeDD: null,
          MSControl: null
        });
      this.showMS = false;
      
      //this.showRolesMS = false;
      //this.showParticipantForStepMS = false;
      this.ShowCreateRecipientPopUpFlag = true;
      //if one requestor is assigned to a notification then it will not be shown in dropdown again
      this._Recipientservice.GetRequestorCountByNotificationId(this.notificationIdforRecipient, "Requestor")
        .subscribe(
          data => {
            if (data == 0) {
              this.SourceRecipient = [{ text: 'Requestor', value: 'R' }, { text: 'User', value: 'USER' }, { text: 'Role', value: 'ROLE' }, { text: 'Participants For Step', value: 'P' }];
            }
            else if (data > 0 ) {
              this.SourceRecipient = [{ text: 'User', value: 'USER' }, { text: 'Role', value: 'ROLE' }, { text: 'Participants For Step', value: 'P' }];
            }
          }
        );

    }  
    if (args.item.id === 'Delete') {
      
      const selectedRecords = this.Recipientgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No recipient selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.RecipientModel.Id = this.notificationIdforRecipient;
        this.RecipientModel.WFLabel = this.configuringWFLabel;
        this.RecipientModel.WFId = this.configuringWFId;
        this.RecipientModel.EntityType = selectedRecords[0]['ToEntityType'];
        this.RecipientModel.EntityId = selectedRecords[0]['Id'];
        this.RecipientModel.StepId = this.selectedStepId;
        this.RecipientModel.CreatedById = this.LoggedInUserId;
        this.RecipientModel.UpdatedById = this.LoggedInUserId;
        this.RecipientModel.ProjectId = this.projectId;
        this.RecipientModel.CreatedByRoleId = this.LoggedInRoleId;
        this.RecipientModel.NotificationId = this.notificationIdforRecipient;
        this._Recipientservice.Delete(this.RecipientModel) //this.notificationIdforRecipient, selectedRecords[0]['EntityType'], selectedRecords[0]['Id']
          .subscribe(
            data => {
              this.toasts[1].content =data;
              this.toastObj.show(this.toasts[1]);
              this.GetRecipientsByNotificationId(this.notificationIdforRecipient);//calling grid binding method inorder to refresh with the updated data              
            }
          );
      }
    }
  }
  
  //method for saving the participant
  SaveRecipients() {
    
    this.RecipientModel.recipients = [];
   
    if (this.RecipientType == "Requestor") {//for Requestor
      this.RecipientModel.recipients = [];      
    }
    else {
      this.multiselect.value = [];
      this.RecipientModel.recipients = this.RecipientForm.get('MSControl').value;   
    }
    this.RecipientModel.EntityType = this.RecipientType;
    this.RecipientModel.NotificationId = this.notificationIdforRecipient;
    this.RecipientModel.WFLabel = this.configuringWFLabel;
    this.RecipientModel.WFId = this.configuringWFId;
    this.RecipientModel.StepId = this.selectedStepId
    this.RecipientModel.CreatedById = this.LoggedInUserId;
    this.RecipientModel.UpdatedById = this.LoggedInUserId;
    this.RecipientModel.ProjectId = this.projectId;
    this.RecipientModel.CreatedByRoleId = this.LoggedInRoleId;
    this._Recipientservice.SaveRecipients(this.RecipientModel)    
      .subscribe(
        data => {
          this.toasts[1].content = "Recipient(s) added succesfully";
          this.toastObj.show(this.toasts[1]);          
          this.ShowCreateRecipientPopUpFlag = false;
          this.GetRecipientsByNotificationId(this.notificationIdforRecipient);//refreshing the grid
        }
      );
  }

  //to reopen the dialog from the other(parent) component 
  dialogClose() {
    this.PostRecipientEvent.emit();
  }
  @Output() PostRecipientEvent = new EventEmitter();
}
