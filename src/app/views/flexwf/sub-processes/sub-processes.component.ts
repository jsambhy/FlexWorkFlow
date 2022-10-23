import { Component, Input, ViewChild } from '@angular/core';
import { ToolbarService, ToolbarItems, GridComponent, ExcelExportService, PdfExportService } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ToastPositionModel, ToastComponent } from '@syncfusion/ej2-angular-notifications';
import { SubProcessService } from '../../../services/subprocess.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FlexWorkflowsService } from '../../../services/flex-workflows.service';
import { StepActionSubProcessModel } from '../../../models/step-action-sub-process-model';
import { CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';
import { StepColumnsService } from '../../../services/step-columns.service';
import { StepActionsService } from '../../../services/step-actions.service';
import { AppSidebarNavDropdownComponent } from '@coreui/angular/lib/sidebar/app-sidebar-nav/app-sidebar-nav-dropdown.component';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';

@Component({
    selector: 'app-sub-processes',
    templateUrl: './sub-processes.component.html',
  styleUrls: ['./sub-processes.component.css'],
  providers: [ToolbarService, ExcelExportService, PdfExportService]
})
/** SubProcesses component*/
export class SubProcessesComponent {

  @Input() StepActionId: number;
  @Input() WorkflowId: number;
  @Input() Level: string;
  @Input() StepId: number;
  SubProcessData: any;
  SubProcessForm: FormGroup = null;
  ShowCreatePopup: boolean = false;
  ShowCreateBtn: boolean = false;
  ShowUpdateBtn: boolean = false;
  WorkflowDropdownData: any;
  LandingStepData: any;
  StepsActionData: any;
  WorkflowDropdownFields: Object = { text: 'UILabel', value: 'Id' };
  LandingStepFields: Object = { text: 'Label', value: 'Id' };
  StepActionDropdownfields: Object = { text: 'Label', value: 'Id' };
  submitted: boolean = false;
  SubProcessModel = new StepActionSubProcessModel();
  LoggedInRoleId: number = +sessionStorage.getItem("LoggedInRoleId");
  LoggedInUserId: number = +sessionStorage.getItem("LoggedInUserId");
  ShowProcessGrid: Boolean;
  showStepdropdown: Boolean;
  showActiondropdown: Boolean;
  enableWorkflowDropdown: Boolean = true;
  hidden: Boolean = false;
  confirmcontent: string;

  public toolbar: ToolbarItems[] | object;

  @ViewChild('SubProcessGrid', { static: false })
  public SubProcessGrid: GridComponent;

  @ViewChild('toasttype', { static: false })
  private toastObj: ToastComponent;

  @ViewChild('IsReadyWait', { static: false })
  public IsReadyWait: CheckBoxComponent;

  @ViewChild('StepDropdown', { static: false })
  public StepDropdown: DropDownListComponent;

  @ViewChild('confirmDialog', { static: false })
  public confirmDialog: DialogComponent;


  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };


  constructor(private _service: SubProcessService,
    private formBuilder: FormBuilder,
    private _StepColumnService: StepColumnsService,
    private _StepActionsService: StepActionsService) {
    this.SubProcessForm = this.formBuilder.group({
      SubProcessName: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      LandingStepName: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      IsReadyWait: new FormControl('')
    }); 
    }

  ngOnInit() {
    
    this.toolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' },
      { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' },
      { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' },
      'ExcelExport', 'PdfExport', 'CsvExport', 'Search'];

    if (this.Level == "workflowlevel") {
      this.ShowProcessGrid = false;
      this.showStepdropdown = true;
      this.showActiondropdown = false;
      this.GetLandingStepByWF(this.WorkflowId);
    }
    else if (this.Level == "steplevel")
    {
      this.showStepdropdown = true;
      this.showActiondropdown = true;
      this.GetLandingStepByWF(this.WorkflowId);
    }
    else
    {
      this.ShowProcessGrid = true;
      this.showStepdropdown = false;
      this.showActiondropdown = false;
    }

    this._service.GetWorkflowsForSubProcess(this.WorkflowId)
      .subscribe(
        data => {
          this.WorkflowDropdownData = data;

        }
    );

    this.GetSubProcessesByStepAction(this.StepActionId);
  }

  GetSubProcessesByStepAction(StepActionId) {
    this._service.GetSubProcessesByStepAction(StepActionId)
      .subscribe(
        data => {
          this.SubProcessData = data;
        }
      );
  }

  GetLandingStepByWF(SelectedWFId) {
    this._StepColumnService.getAllSteps(SelectedWFId,"")
      .subscribe(
        StepData => {
          this.LandingStepData = StepData;

          if (this.Level == "steplevel") {
            this.StepDropdown.value = this.StepId;
            this.StepDropdown.enabled = false;
            this.GetStepActionByStepId(this.StepId);
          }
        }
      );
  }

  WFChangeEvent(args) {
    console.log(args);
    this.GetLandingStepByWF(args.itemData.Id);
  }

  stepchange(args)
  {
    
    this.showActiondropdown = true;
    this.GetStepActionByStepId(args.itemData.Id);
  }

  GetStepActionByStepId(StepId) {
    
    this._service.GetWiringActionByStepId(StepId)
      .subscribe(
        StepActiondata => {
          this.StepsActionData = StepActiondata;
        }
      );
  }

  stepActionchange(args)
  {
    
    this.ShowProcessGrid = true;
    this.StepActionId = args.itemData.Id;
    this.GetSubProcessesByStepAction(args.itemData.Id);
  }

  get f() { return this.SubProcessForm.controls; }

  SubProcessIdForDeletion: number;
  SubProcessWFIdForDeletion: number;
  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'SubProcessGrid_pdfexport') {
      this.SubProcessGrid.pdfExport();
    }
    if (args.item.id === 'SubProcessGrid_excelexport') {
      this.SubProcessGrid.excelExport();
    }
    if (args.item.id === 'SubProcessGrid_csvexport') {
      this.SubProcessGrid.csvExport();
    }
    if (args.item.id === 'Add') {
      this.ShowCreatePopup = true;
      this.ShowCreateBtn = true;
      this.ShowUpdateBtn = false;
  
    }

    if (args.item.id === 'Edit') {
      this.ShowCreatePopup = true;
      this.ShowCreateBtn = false;
      this.ShowUpdateBtn = true;
      const selectedRecords = this.SubProcessGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[2].content = "No record is selected for edit";
        this.toastObj.show(this.toasts[2]);
      }
      else {
        this.GetById(selectedRecords[0]['Id']);
      }
      
    }

    if (args.item.id === 'Delete') {
      
      const selectedRecords = this.SubProcessGrid.getSelectedRecords();
     
      if (selectedRecords.length == 0) {
        this.toasts[1].content = "No record is selected for delete";
        this.toastObj.show(this.toasts[1]);
      }
      else {
       // Check data fields Mapping
        this.SubProcessIdForDeletion = selectedRecords[0]['Id'];
        this.SubProcessWFIdForDeletion = selectedRecords[0]['SubProcessWFId'];
        this._service.GetSubProcessDFExistence(selectedRecords[0]['SubProcessWFId'])
          .subscribe(
            DFMappingdata => {
              if (DFMappingdata.length != 0) {
                this.confirmcontent = "Data Mapping exit between Process (" + DFMappingdata[0].ParentWorkflowName + ")" +
                " and subProcess(" + DFMappingdata[0].SubWorkflowName + ") which will also be deleted. Are you sure you want to delete? ";
                this.confirmDialog.show();
              }
              else {
                this.confirmcontent = "Are you sure you want to delete?";
                this.confirmDialog.show();
              }
             
            }
          );
      }
    }


  }

  confirmDlgBtnYesClick = (): void => {

    this.DeleteById(this.SubProcessIdForDeletion);
    this.confirmDialog.hide();
  }
  confirmDlgBtnNoClick = (): void => {
    this.confirmDialog.hide();
    return;
  }
  confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmDlgBtnYesClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];


  Save() {
   
    this.submitted = true;
    if (this.SubProcessForm.invalid) {
      return;
    }
    else {
      this.SubProcessModel.StepActionId = this.StepActionId;
      this.SubProcessModel.LandingStepId = this.SubProcessForm.get('LandingStepName').value;
      this.SubProcessModel.IsReadyWait = this.IsReadyWait.checked;
      this.SubProcessModel.CreatedById = this.LoggedInUserId;
      this.SubProcessModel.CreatedByRoleId = this.LoggedInRoleId;
      this.SubProcessModel.UpdatedById = this.LoggedInUserId;
      this.SubProcessModel.UpdatedByRoleId = this.LoggedInRoleId;
      this.SubProcessModel.CreatedDateTime = new Date();
      this.SubProcessModel.UpdatedDateTime = new Date();
      this.SubProcessModel.ParameterCarrier = null;
      this._service.PostSubProcesses(this.SubProcessModel).subscribe(
        (data) => {
          this.toasts[1].content = "SubProcess saved successfully";
          this.toastObj.show(this.toasts[1]);
          this.ShowCreatePopup = false;
          this.GetSubProcessesByStepAction(this.StepActionId);
          this.SubProcessGrid.refresh();
        },
        (error: any) => console.log(error)
      );
    }
  }

  Update() {
   
    this.submitted = true;
    if (this.SubProcessForm.invalid) {
      return;
    }
    else {
      this.SubProcessModel.StepActionId = this.StepActionId;
      this.SubProcessModel.LandingStepId = this.SubProcessForm.get('LandingStepName').value;
      this.SubProcessModel.IsReadyWait = this.IsReadyWait.checked;
      this.SubProcessModel.UpdatedById = this.LoggedInUserId;
      this.SubProcessModel.UpdatedByRoleId = this.LoggedInRoleId;
      this.SubProcessModel.UpdatedDateTime = new Date();
      this.SubProcessModel.ParameterCarrier = null;
      this._service.PutSubProcesses(this.SubProcessModel).subscribe(
        (data) => {
          this.toasts[1].content = "SubProcess updated successfully";
          this.toastObj.show(this.toasts[1]);
          this.ShowCreatePopup = false;
          this.GetSubProcessesByStepAction(this.StepActionId);
          this.SubProcessGrid.refresh();
        },
        (error: any) => console.log(error)
      );
    }
  }

  GetById(Id) {
   
    this._service.GetSubProcessById(Id)
      .subscribe(
        data => {
          this.SubProcessModel = data;
          this.GetLandingStepByWF(data.WorkflowId);
          this.SubProcessForm.patchValue({
            SubProcessName:data.WorkflowId,
            LandingStepName: data.LandingStepId,
            IsReadyWait: data.IsReadyWait
          });
        }
    );
    this.enableWorkflowDropdown = false;
    this.ShowCreatePopup = true;
  }

  DeleteById(Id) {

    this._service.DeleteSubProcessById(Id, this.SubProcessWFIdForDeletion)
      .subscribe(
        data => {
          this.toasts[1].content = "SubProcess deleted successfully";
          this.toastObj.show(this.toasts[1]);
          this.GetSubProcessesByStepAction(this.StepActionId);
          this.SubProcessGrid.refresh();
        }
      );
  }
}
