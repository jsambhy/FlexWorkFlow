import { Component, ViewChild, Input } from '@angular/core';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToolbarItems } from '@syncfusion/ej2-angular-pivotview';
import { DropDownListComponent, ListBoxComponent } from '@syncfusion/ej2-angular-dropdowns';
import { GridComponent, GridLine, FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ValidationsService } from '../../../services/validations.service';
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
import { validationsmodel } from '../../../models/validations.model';
import { FlexWorkflowsService } from '../../../services/flex-workflows.service';
import { StepColumnsService } from '../../../services/step-columns.service';
import { StepActionsService } from '../../../services/step-actions.service';
import { CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';

@Component({
  selector: 'app-validations',
  templateUrl: './validations.component.html',
  styleUrls: ['./validations.component.css']
})
/** validations component*/
export class ValidationsComponent {
  constructor(private formBuilder: FormBuilder,
    private _service: ValidationsService,
    private _flexWFService: FlexWorkflowsService,
    private _StepColservice: StepColumnsService,
    private _StepActionService: StepActionsService) {
    this.validationForm = this.formBuilder.group({
      Name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      Description: new FormControl('', [Validators.maxLength(4000)]),
      ErrorTypeDD: new FormControl('', [Validators.required]),
      IsActive: new FormControl('')
    });
  } //const ends
  @Input() Level: string;
  @Input() PreSelected_WFId: number;
  @Input() PreSelected_WFName: string;
  @Input() PreSelected_StepId: number;
  @Input() PreSelected_StepActionId: number;
  @ViewChild('unSelectValidationRuleslistbox', { static: false })
  public unSelectValidationRuleslistbox: ListBoxComponent;

  @ViewChild('SelectValidationRuleslistbox', { static: false })
  public SelectValidationRuleslistbox: ListBoxComponent;
  confirmHeader: string = '';
  SelectedValidationRulesListDataSource: any = [];
  validationForm: FormGroup = null;
  projectId: number;
  hidden: boolean = false;
  ShowCreateBtn: boolean = true;
  ShowUpdateBtn: boolean = false;
  confirmcontent: string;
  sessionprojectid: string;
  errorTypes: Object[] = [{ text: 'Error', value: 'E' }, { text: 'Warning', value: 'W' }];
  ErrorTypeFields: Object = { text: 'text', value: 'value' };
  @ViewChild('TypeListObj', { static: false }) public TypeListObj: DropDownListComponent;
  validationId: number;
  LoggedInUserId: number;
  LoggedInRoleId: number;
  GridDataSource: validationsmodel[];
  Header: string;
  ShowGrid: boolean = false;
  ActionsSource: string[];
  Actionsfields: Object = { text: 'Label', value: 'Id' };
  LoggedInScopeEntityId: number;
  LoggedInScopeEntityType: string;

  toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  @ViewChild('Validationsgrid', { static: false }) public Validationsgrid: GridComponent;
  @ViewChild('toasttype', { static: false }) private toastObj: ToastComponent;
  @ViewChild('confirmDialog', { static: false }) public confirmDialog: DialogComponent;
  @ViewChild('WFdropdown', { static: false }) public WFdropdown: DropDownListComponent;
  @ViewChild('Stepsdropdown', { static: false }) public Stepsdropdown: DropDownListComponent;
  @ViewChild('Actionsdropdown', { static: false }) public Actionsdropdown: DropDownListComponent;
  @ViewChild('IsActive', { static: false }) public IsActive: CheckBoxComponent;
  position: ToastPositionModel = { X: 'Center' };
  lines: GridLine; WFSource: string[]; editSettings: Object;
  WFfields: Object = { text: 'UILabel', value: 'Id' }
  ShowPopupcreateval: boolean = false;
  toolbar: ToolbarItems[] | object;
  validationGridData: validationsmodel[];
  validationmodelData: validationsmodel = new validationsmodel();//declaring and initializing the variable to use further  
  CurrentRoleName: string = sessionStorage.getItem("CurrentRoleName");
  LoginEmail: string = sessionStorage.getItem("LoginEmail");
  configuringWFId: number;
  SelectedStepActionId: number;
  selectedStepId: number;
  SelectedActionName: string;
  selectedErrorType: string;
  SessionValues: any = sessionStorage;
  configuringWFLabel: string;
  selectedStepLabel: string;
  StepsSource: string[];
  stepvalue: string;
  value: string;
  validationRulesDataSource: any = [];
  Stepsfields: Object = { text: 'Label', value: 'Id' }
  enableWFDD: boolean = true;
  SelectedValidationRulesList: string;
  validationRulesfields: Object = { text: 'Name', value: 'Id' };
  //-----------------------------method call on the toolbars of grid------------------------------
  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'Validationsgrid_pdfexport') {
      this.Validationsgrid.pdfExport();
    }
    if (args.item.id === 'Validationsgrid_excelexport') { 
      this.Validationsgrid.excelExport();
    }
    if (args.item.id === 'Validationsgrid_csvexport') {
      this.Validationsgrid.csvExport();
    }
    if (args.item.id === 'Add') {
      this.Header = "Create validation"
      this.ShowCreateBtn = true;
      this.ShowUpdateBtn = false;
      this.stepvalue = this.selectedStepLabel;
      this.getValidationRulesByWFId(this.configuringWFId);//to get the unselected validation rules data
      this.ShowPopupcreateval = true;//opening create form
      this.validationForm.patchValue({
        Name: null,
        Description: null,
        ErrorTypeDD: null
      });
    }
    if (args.item.id === 'Edit') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      const selectedRecords = this.Validationsgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No validation selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.validationId = selectedRecords[0]['Id'];// 
        this.GetById(this.validationId);
        
        
      }
    }
    if (args.item.id === 'Delete') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      const selectedRecords = this.Validationsgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No validation selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.validationId = selectedRecords[0]['Id'];// 
        this.Delete();
      }
    }
  }

  //--------inorder to remoive first unwanted row we have to define this filtersetting line
  filterSettings: FilterSettingsModel;
  enableActionDD: boolean = true;
  enableStepDD: boolean = true;
  showValidationRulePage: boolean = false;
  Listtoolbar = { items: ['moveUp', 'moveDown', 'moveTo', 'moveFrom', 'moveAllTo', 'moveAllFrom'] }
  //--------------------------Init event -------------------------------------------------
  ngOnInit() {
    this.LoggedInScopeEntityId = +sessionStorage.getItem('LoggedInScopeEntityId');
    this.LoggedInScopeEntityType = sessionStorage.getItem('LoggedInScopeEntityType');
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
    this.getWFdata();//binding wf drpodown
 
    if (this.Level == "workflowlevel") {
      this.enableWFDD = false;
      this._StepColservice.getAllSteps(this.PreSelected_WFId, this.PreSelected_WFName)
        .subscribe(
          data => {
            this.StepsSource = (data);
          }
        );
      
    }

    if (this.Level == "stepactionlevel") {
      
      this.getStepsdata();
      this._StepActionService.getWiringActionsByStepId(this.selectedStepId)
      .subscribe(
        data => {
          

          if (this.Level == "stepactionlevel") {
            this.ActionsSource = (data);
            this.Actionsdropdown.value = this.PreSelected_StepActionId;
          }
          else {
            this.ActionsSource = (data);
          }
        }
      );
    }

    else {
      this.enableWFDD = true;
      this.enableActionDD = true;
      this.enableStepDD = true;
    }
  }

  //to access all the controls of the defined form on html page created a comon method
  get f() { return this.validationForm.controls; }
  public isFieldValid(field: string) {
    return !this.validationForm.get(field).valid && (this.validationForm.get(field).dirty || this.validationForm.get(field).touched);
  }

  openVRScreen() {
    this.showValidationRulePage = true;
  }
  //method to get the workflow data and fill in workflow dropdown
  getWFdata() {
    
    this._flexWFService.GetWorkFlowsByScopeEntity(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
      .subscribe(
        data => {
          
          if (this.Level == "workflowlevel") {
            this.WFSource = (data);
            this.WFdropdown.value = this.PreSelected_WFId;
            this._StepColservice.getAllSteps(this.PreSelected_WFId, this.PreSelected_WFName)
              .subscribe(
                data => {
                
                    this.StepsSource = (data);
                }
              );
          }
          if (this.Level == "stepactionlevel") {
            this.WFSource = (data);
            this.WFdropdown.value = this.PreSelected_WFId;
            this.enableWFDD = false;
            this._StepColservice.getAllSteps(this.PreSelected_WFId, this.PreSelected_WFName)
              .subscribe(
                data => {
                  
                    this.StepsSource = (data);
                    this.Stepsdropdown.value = this.PreSelected_StepId;
                    this.enableStepDD = false;
                  this._StepActionService.getWiringActionsByStepId(this.PreSelected_StepId)
                    .subscribe(
                      data => {
                        this.enableActionDD = false;
                          this.ActionsSource = (data);
                       
                        
                      }
                    );

                }
              );
          }
          else {
            this.WFSource = (data);
          }
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
  getValidationRulesByWFId(Id) {
    this._service.GetAllValidationRulesByWFId(Id)
      .subscribe(
        data => {
          this.validationRulesDataSource = data;
        }
      );
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

  //steps dropdown change event method
  StepsChange(args: any): void {
    this.ShowGrid = false;
    this.selectedStepId = args.itemData.Id;
    this.selectedStepLabel = args.itemData.Label;
    this.getActionsdata();
  }

  //method to get actions data and fill in actions dropdown
  getActionsdata() {
    this._StepActionService.getWiringActionsByStepId(this.selectedStepId)
      .subscribe(
        data => {
          

          if (this.Level == "stepactionlevel") {
            this.ActionsSource = (data);
            this.Actionsdropdown.value = this.PreSelected_StepActionId;
          }
          else {
            this.ActionsSource = (data);
          }
        }
      );
  }

  //method to get details of the selected data for edit
  GetById(Id) {
   
    this.ShowCreateBtn = false;
    this.ShowUpdateBtn = true;
    this._service.GetValidationDataById(Id)
      .subscribe(
        data => {
          this.Header = "Edit Validation"
          this.ShowPopupcreateval = true;
          this.validationForm.patchValue({
            Name: data[0].Name,
            Description: data[0].Description,
            ErrorTypeDD: data[0].Type
          });
          this._service.GetVRForValidationDataById(this.configuringWFId, Id)
            .subscribe(
              res => {
                  this.validationRulesDataSource = res;//to refresh the list of unselected validation rules.
              }
            );
          this.SelectedValidationRulesListDataSource = JSON.parse(data[0].SelectedValidationRules);// filling selected validation rules
          this.validationId = data[0].Id; //to use if for further use stored in the variable
        }
      );
  }

  //method to delete record, it will first ask for the confirmation message
  Delete() {
    this.confirmcontent = 'Are you sure you want to delete?';
    this.confirmDialog.show();
  }
  confirmDlgBtnNoClick = (): void => {
    this.confirmDialog.hide();
  }
  confirmDlgBtnYesClick = (): void => {
    this._service.Delete(this.validationId).subscribe(
      (data: string) => {
        this.toasts[1].content = "Validation deleted successfully";
        this.toastObj.show(this.toasts[1]);
        this.getData();
      },
      (error: any) => {
        this.toasts[2].content = error.error.message;
        this.toastObj.show(this.toasts[2]);
        this.getData();
      }
    );
    this.confirmDialog.hide();
  }
  public confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmDlgBtnYesClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];



  //method for updating records
  Update() {
    
    var selectData;
    if (this.SelectValidationRuleslistbox != undefined) {
      selectData = this.SelectValidationRuleslistbox.getDataList();
    }
    else {
      selectData = this.SelectedValidationRulesListDataSource;
    }
    if (this.validationForm.invalid) {
      return;
    }
    else {
      this.validationmodelData.Id = this.validationId;
      this.validationmodelData.StepActionId = this.SelectedStepActionId;
      this.validationmodelData.Name = this.validationForm.get('Name').value;
      this.validationmodelData.Description = this.validationForm.get('Description').value;
      this.validationmodelData.Type = this.validationForm.get('ErrorTypeDD').value;
      this.validationmodelData.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + "No Workflow" + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|" + "ProjectId=" + this.projectId;
      this.validationmodelData.UpdatedById = this.LoggedInUserId;
      this.validationmodelData.CreatedByRoleId = this.LoggedInRoleId;
      this.validationmodelData.UpdatedByRoleId = this.LoggedInRoleId;
      this.validationmodelData.CreatedById = this.LoggedInUserId;
      this.validationmodelData.IsActive = this.IsActive.checked;
      this.validationmodelData.ProjectId = this.projectId;
      let idlist = '';
      for (let i = 0; i < selectData.length; i++) {
        idlist = idlist + ',' + (selectData[i]['Id'])
      }
     
      this.validationmodelData.SelectedValidationRules = idlist;      
      this._service.Update(this.validationmodelData).subscribe(
        (data: string) => {
          this.toasts[1].content = "Validation updated successfully";
          this.toastObj.show(this.toasts[1]);
          this.ShowPopupcreateval = false;
          //********************to refresh unselected validation rules data***********************************************
          this._service.GetVRForValidationDataById(this.configuringWFId, this.validationId)
            .subscribe(
              res => {
                this.validationRulesDataSource = res;
              }
          );
           //********************to refresh selected validation rules data***********************************************
          this._service.GetValidationDataById(this.validationId).subscribe(
            data => {
              this.SelectedValidationRulesListDataSource = JSON.parse(data[0].SelectedValidationRules);             
            }
          );
         //*************************to referesh grid data***************************************
          this.getData();
        }),
        (error: any) => {
          console.log(error)
          this.toasts[2].content = error.error.Message;
          this.toastObj.show(this.toasts[2]);
          this.ShowPopupcreateval = true;
        }
    }
  }
  //Actions dropdown change event method
  ActionChange(args: any): void {
    this.SelectedStepActionId = args.value;
    this.SelectedActionName = args.itemData.Label;
    this.ShowGrid = true;
    //on changing of actions dropdown we are showing grid and binding data into it.
    this.getData(); //method to get the validations and show in grid
  }

  //method to get the records in grid
  getData() {
    this._service.GetValidationsByStepActionId(this.SelectedStepActionId)
      .subscribe(
        data => {
          this.validationGridData = (data);
        }
      );
  }

  //dropdown record change event
  ErrortypeChange(eventchangedata) {
    this.selectedErrorType = eventchangedata.itemData.value;
  }

  //on clicking on grid record twice it will open the form in edit mode
  public recordDoubleClick(args): void {
    this.validationId = args.rowData['Id'];// 
    this.GetById(this.validationId);
  }

  //method to save the record
  Save() {
    
    if (this.validationForm.invalid) {
      return;
    }
    
   
    else {
     
      var selectData;
      if (this.SelectValidationRuleslistbox != undefined) {
        selectData = this.SelectValidationRuleslistbox.getDataList();
      }
      else {
        selectData = this.SelectedValidationRulesListDataSource;
      }

      this.validationmodelData.Name = this.validationForm.get('Name').value.trim();//removing lead and back space from the string
      this.validationmodelData.Description = this.validationForm.get('Description').value;
      this.validationmodelData.Type = this.selectedErrorType;
      //this.validationmodelData.SelectedValidationRules = selectData;
      let idlist = '';
      for (let i = 0; i < selectData.length; i++) {
        idlist = idlist + ',' + (selectData[i]['Id'])
      }
      idlist = idlist.substring(0, idlist.length - 1);
      this.validationmodelData.SelectedValidationRules = idlist;
      this.validationmodelData.StepActionId = this.SelectedStepActionId;
      this.validationmodelData.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + "No Workflow" + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|" + "ProjectId=" + this.projectId;
      this.validationmodelData.CreatedById = this.LoggedInUserId;
      this.validationmodelData.UpdatedById = this.LoggedInUserId;
      this.validationmodelData.CreatedByRoleId = this.LoggedInRoleId;
      this.validationmodelData.UpdatedByRoleId = this.LoggedInRoleId;
      this.validationmodelData.IsActive = this.IsActive.checked;
      this.validationmodelData.ProjectId = this.projectId;
      console.log(this.validationmodelData)
      this._service.Save(this.validationmodelData).subscribe(
        (data: any) => {
          this.toasts[1].content = "Validation created successfully";
          this.toastObj.show(this.toasts[1]);
          this.ShowPopupcreateval = false;
          this.getData();
        },
        (error: any) => {
          this.toasts[2].content = error.error.Message;
          this.toastObj.show(this.toasts[2]);
          this.ShowPopupcreateval = true;
        }
      );
    }
  }
  ShowPopupcreatevaldialogClose() {
    this.ShowPopupcreateval = false;
  }
}
