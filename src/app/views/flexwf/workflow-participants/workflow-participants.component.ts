import { Component, Input, ViewChild } from '@angular/core';
import { GridLine, ToolbarItems, FilterSettingsModel, GridComponent } from '@syncfusion/ej2-angular-grids';
import { ToastPositionModel, ToastComponent } from '@syncfusion/ej2-angular-notifications';
import { CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { FlexWorkflowsService } from '../../../services/flex-workflows.service';
import { WorkflowExternalParticipantmodel } from '../../../models/workflow-external-participant-model';
import { ButtonPropsModel, DialogComponent } from '@syncfusion/ej2-angular-popups';

@Component({
    selector: 'app-workflow-participants',
    templateUrl: './workflow-participants.component.html',
    styleUrls: ['./workflow-participants.component.css']
})
/** Workflow Participants component*/
export class WorkflowParticipantsComponent {

  @Input() WorkflowId: number;
  hidden: boolean = false;
  lines: GridLine;
  toolbar: ToolbarItems[] | object;
  editSettings: Object;
  filterSettings: FilterSettingsModel;
  RestrictParticipantForm: FormGroup = null;
  ParticipantsData: any;
  ParticipantsDropdownFields: Object = { text: 'RoleName', value: 'Id' };
  ShowCreatePopup: boolean = false;
  ShowCreateBtn: boolean=false;
  ShowUpdateBtn: boolean = false;
  RestrictParticipantModel = new WorkflowExternalParticipantmodel();
  submitted: boolean = false;
  LoggedInRoleId: number = +sessionStorage.getItem("LoggedInRoleId");
  LoggedInUserId: number = +sessionStorage.getItem("LoggedInUserId");
  dataSource: any;
  confirmcontent: string;

  @ViewChild('RestrictParticipantgrid', { static: false }) public RestrictParticipantGrid: GridComponent;
  @ViewChild('toasttype', { static: false }) private toastObj: ToastComponent;
  @ViewChild('EnableHeirarchy', { static: false }) public EnableHeirarchy: CheckBoxComponent;
  @ViewChild('confirmDialog', { static: false }) public confirmDialog: DialogComponent;

  //toast definition
  position: ToastPositionModel = { X: 'Center' };
  toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];

  constructor(private formBuilder: FormBuilder, private _service: FlexWorkflowsService) {
    this.RestrictParticipantForm = this.formBuilder.group({
      RestrictParticipant: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      EnableHeirarchy: new FormControl('')
      }); 
    }

  ngOnInit() {
    this.filterSettings = { type: 'CheckBox' }; // inorder to remove extra filtering from the grid we set it to this type.
    this.lines = 'Both';//indicated both the lines in grid(horizontal and vertical)
    this.toolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' }, { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' }, { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' }, 'ExcelExport', 'PdfExport', 'CsvExport', 'Search'];
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };//it openeds the dialogue while doing ADD, EDIT, DELETE
    this.GetRestrictedParticipants();
    this.GetNonRestrictedParticipants();
  }

  GetRestrictedParticipants() {
   
    this._service.GetWFExternalParticipants(this.WorkflowId)
      .subscribe(
        ExternalParticipants => {
          this.dataSource = (ExternalParticipants);
        }
      );
  }

  GetNonRestrictedParticipants() {
    
    this._service.GetNonRestrictedParticipantsList(this.WorkflowId)
      .subscribe(
        ParticipantsList => {
          this.ParticipantsData = (ParticipantsList);
        }
      );
  }

  toolbarClick(args: ClickEventArgs): void {
   
    if (args.item.id === 'Add') {
      this.ShowCreatePopup = true;
      this.ShowCreateBtn = true;
      this.ShowUpdateBtn = false;
      this.RestrictParticipantForm.patchValue({
        RestrictParticipant: null,
        EnableHeirarchy: true
      });
     
    }
    if (args.item.id === 'Edit') {
      
      this.ShowCreatePopup = true;
      this.ShowCreateBtn = false;
      this.ShowUpdateBtn = true;
    
      const selectedRecords = this.RestrictParticipantGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No Participant selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.GetById(selectedRecords[0]['Id']);
      }
      
    }
    if (args.item.id === 'Delete') {
      const selectedRecords = this.RestrictParticipantGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No Participant selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.ConfirmToDelete(selectedRecords[0]['Id']);
      }
    }

  }

  public recordDoubleClick(args): void {
    this.ShowCreatePopup = true;
    this.ShowCreateBtn = false;
    this.ShowUpdateBtn = true;
    this.GetById(args.rowData['Id']);
  }

  GetById(Id) {
    
    this._service.GetExternalParticipantById(Id)
      .subscribe(
        data => {
          this.RestrictParticipantModel = data;
          this.RestrictParticipantForm.patchValue({
            RestrictParticipant: data.ParticipantId

          });

          if (data.EnableHeirarchy == true)
          {
            this.RestrictParticipantForm.patchValue({
              EnableHeirarchy: true
            });
          }
          else
          {
            this.RestrictParticipantForm.patchValue({
              EnableHeirarchy: false
            });
          }
          
        }
      );
    this.ShowCreatePopup = true;
  }

  IdToBeDeleted: number;

  ConfirmToDelete(Id) {
    this.IdToBeDeleted = Id;
    this.confirmcontent = 'Are you sure you want to delete?';
    this.confirmDialog.show();
  }

  Save() {
    this.submitted = true;
    if (this.RestrictParticipantForm.invalid) {
      return;
    }
    else {
      this.RestrictParticipantModel.WorkflowId = this.WorkflowId;
      this.RestrictParticipantModel.ParticipantId = this.RestrictParticipantForm.get('RestrictParticipant').value;
      this.RestrictParticipantModel.EnableHeirarchy = this.EnableHeirarchy.checked;
      this.RestrictParticipantModel.CreatedById = this.LoggedInUserId;
      this.RestrictParticipantModel.CreatedByRoleId = this.LoggedInRoleId;
      this.RestrictParticipantModel.UpdatedById = this.LoggedInUserId;
      this.RestrictParticipantModel.UpdatedByRoleId = this.LoggedInRoleId;
      this.RestrictParticipantModel.CreatedDateTime = new Date();
      this.RestrictParticipantModel.UpdatedDateTime = new Date();
      this._service.PostWorkflowExternalParticipant(this.RestrictParticipantModel).subscribe(
        (data) => {
          this.toasts[1].content = "External Participants saved successfully";
          this.toastObj.show(this.toasts[1]);
          this.ShowCreatePopup = false;
          this.GetRestrictedParticipants();
          this.RestrictParticipantGrid.refresh();
        },
        (error: any) => console.log(error)
      );
    }
  }

  Update() {
    this.submitted = true;
    if (this.RestrictParticipantForm.invalid) {
      return;
    }
    else {
      this.RestrictParticipantModel.ParticipantId = this.RestrictParticipantForm.get('RestrictParticipant').value;
      this.RestrictParticipantModel.EnableHeirarchy = this.EnableHeirarchy.checked;
      this.RestrictParticipantModel.UpdatedById = this.LoggedInUserId;
      this.RestrictParticipantModel.UpdatedByRoleId = this.LoggedInRoleId;

      this._service.PutWorkflowExternalParticipant(this.RestrictParticipantModel).subscribe(
        (data) => {
          this.toasts[1].content = "External Participants updated successfully";
          this.toastObj.show(this.toasts[1]);
          this.ShowCreatePopup = false;
          this.GetRestrictedParticipants();
          this.RestrictParticipantGrid.refresh();
        },
        (error: any) => console.log(error)
      );
    }
  }

  get f() { return this.RestrictParticipantForm.controls; }

  confirmDlgBtnYesClick = (): void => {
   
    this.DeleteById(this.IdToBeDeleted);
    this.confirmDialog.hide();
  }
  confirmDlgBtnNoClick = (): void => {
    this.confirmDialog.hide();
    return;
  }
  confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmDlgBtnYesClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];

  DeleteById(Id) {
    this._service.DeleteExternalParticipantById(Id)
      .subscribe(
        data => {
          this.toasts[1].content = "External Participants Deleted successfully";
          this.toastObj.show(this.toasts[1]);
          this.GetRestrictedParticipants();
          this.RestrictParticipantGrid.refresh();
        }
      );
  }

}
