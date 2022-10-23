import { Component, Input, ViewChild } from '@angular/core';
import { ToolbarService, EditService, PageService, ExcelExportService, PdfExportService, FreezeService, ContextMenuService, GridComponent, GridLine, ToolbarItems, ContextMenuItem, FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
import { ComboBoxComponent } from '@syncfusion/ej2-angular-dropdowns';
import { TextBox, TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { WorkflowActionsService } from '../../../services/workflow-actions.service';
import { StepActionsService } from '../../../services/step-actions.service';
import { stepactionsmodel, ActionIconsmodel } from '../../../models/step-actions-model';

@Component({
  selector: 'app-workflow-actions',
  templateUrl: './workflow-actions.component.html',
  styleUrls: ['./workflow-actions.component.css'],
  providers: [WorkflowActionsService, StepActionsService, ToolbarService, EditService, PageService, ExcelExportService, PdfExportService, FreezeService, ContextMenuService]
})

export class WorkflowActionsComponent {
  @Input() configuringstepname: string;
  @Input() configuringstepid: number;
  @Input() configuringWFId: number;
  @Input() configuringFlexTableId: number;
  @Input() configuringWFLabel: string;
  public visible: Boolean = true;
  public hidden: Boolean = false;
  @ViewChild('WFActionsgrid', { static: false }) public WFActionsgrid: GridComponent;
  @ViewChild('label', { static: false }) public label: TextBoxComponent;
  @ViewChild('WFActionEditDialog', { static: false }) public WFActionEditDialog: DialogComponent;
  @ViewChild('confirmDialog', { static: false }) public confirmDialog: DialogComponent;
  @ViewChild('com', { static: false }) public com: ComboBoxComponent;
  @ViewChild('toasttype', { static: false }) private toastObj: ToastComponent;

  public lines: GridLine;
  public toolbar: ToolbarItems[] | object;
  public editSettings: Object;
  public WFActionsdata: stepactionsmodel[];
  public iconFields: Object = { text: 'IconText', iconCss: 'Class', value: 'Id' };
  public ActionIconData: ActionIconsmodel[];
  public selectedActionLabelForEdit: string;
  public selectedActionNewLabelForEdit: string;
  public confirmDialgwidth: string = "400px";
  WFActionEditForm: FormGroup = null;
  public selectedActionIconId: number;
  public Acvisible: boolean = true;
  public actiondata: stepactionsmodel = new stepactionsmodel();
  public confirmcontent: string;
  public Iscontinuetoproceed: string;  
  public ActionIdForDelete: number;
  public ActionLabelForDelete: string;
  public showIconImage: boolean = false;
  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };
  filterSettings: FilterSettingsModel;
  //------------------------------------------Methods block-------------------------------------------------------  
  constructor(private _WFActionservice: WorkflowActionsService, private _StepActionService: StepActionsService) {
    this.WFActionEditForm = new FormGroup({
      ActionName: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      ActionIcon: new FormControl('')
    });

  }
  ngOnInit() {
    this.filterSettings = { type: 'CheckBox' }; // inorder to remove extra filtering from the grid we set it to this type.
    this.lines = 'Both';
    this.fnGetAllDetails();
    this.toolbar = [{ text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit', align: 'Left' }, { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete', align: 'Left' }, 'ExcelExport', 'PdfExport', 'CsvExport', 'Search'];
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };    
  }

  //methods for form controls getting for validation purpose
  get f() { return this.WFActionEditForm.controls; }
  public isFieldValid(field: string) {
    return !this.WFActionEditForm.get(field).valid && (this.WFActionEditForm.get(field).dirty || this.WFActionEditForm.get(field).touched);
  }

  //event called on toolbar click
  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'stepactionsgrid_pdfexport') {
      this.WFActionsgrid.pdfExport();
    }
    if (args.item.id === 'stepactionsgrid_excelexport') {
      this.WFActionsgrid.excelExport();
    }
    if (args.item.id === 'stepactionsgrid_csvexport') {
      this.WFActionsgrid.csvExport();
    }
    if (args.item.id === 'Edit') {
      const selectedRecords = this.WFActionsgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {

      }
      else {
        this.com.value = selectedRecords[0]['Icon'];
        this.selectedActionLabelForEdit = selectedRecords[0]['Label'];
        this.WFActionEditForm.patchValue({          
          ActionName: selectedRecords[0]['Label']
        });
        this._StepActionService.GetIconsDetailsByActionIdForAngular(selectedRecords[0]['ActionId']).subscribe(
          (data: any) => {
            this.ActionIconData = data;
          },
          (error: any) => console.log(error)
        );        
        this.WFActionEditDialog.show();
      }
    }
    if (args.item.id === 'Delete') {
      const selectedRecords = this.WFActionsgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {

      }
      else {
        this.Delete(selectedRecords[0]['ActionId'], selectedRecords[0]['Label']);
      }
    }   
  }

  public recordDoubleClick(args): void {
    this.com.value = args.rowData['Icon'];
    this.selectedActionLabelForEdit = args.rowData['Label'];
      this.WFActionEditForm.patchValue({
        ActionName: args.rowData['Label']
      });
    this._StepActionService.GetIconsDetailsByActionIdForAngular(args.rowData['ActionId']).subscribe(
        (data: any) => {
          this.ActionIconData = data;
        },
        (error: any) => console.log(error)
      );
      this.WFActionEditDialog.show();
  }

  //method called on the dialogue box close button
  public dialogClose = (): void => {
    this.Acvisible = false;
  }

  //focus out event from the action label 
  public focusOut(args: TextBox): void {
    if (this.WFActionEditForm.invalid) {
      return;
    }
    else {
      if (this.selectedActionLabelForEdit != args.value) {
        this.selectedActionNewLabelForEdit = args.value;
        this._StepActionService.GetStepActionLabelStatusInWorkFlow(this.configuringWFId, args.value).subscribe(
          (data: any) => {
            if (data > 0) {
              this.toasts[0].content = "Cannot use '" + args.value + "' label as it is already used in this workflow or it is reserved label for an out of the box action";
              this._StepActionService.GetStepActionUsedDefaultLabelInWF(this.configuringWFId, args.value).subscribe(
                (data: any) => {
                  if (data.length != 0) {
                    this.label.value = this.selectedActionLabelForEdit
                    this.toastObj.show(this.toasts[0]);
                  }
                });
            }
          });
      }

    }
  }

  //method to get all the data for grid
  fnGetAllDetails() {
    this._WFActionservice.getAllActionsDetailsByWFId(this.configuringWFId)
      .subscribe(
        data => {
          this.WFActionsdata = (data);
        }
      );
  }

  //method for updating action
  Update() {
    if (this.WFActionEditForm.invalid) {
      return;
    }
    else {
      this.actiondata.Label = this.selectedActionLabelForEdit.replace(/ /g, "");//removing front and end spaces;//old
      this.actiondata.WFId = this.configuringWFId;
      this.actiondata.ActionIconId = this.selectedActionIconId;
      this._WFActionservice.Update(this.actiondata, this.label.value).subscribe(
        (data: string) => {
          this.toasts[1].content = "Updated successfully";
          this.toastObj.show(this.toasts[1]);
          this.WFActionEditDialog.hide();
          this.fnGetAllDetails();
        },
        (error: any) => console.log(error)
      );
    }
  }

  //methods defined on the yes and no button of the confirmation box
  public confirmDlgYesBtnClick = (): void => {
    this.actiondata.ActionId = this.ActionIdForDelete;
    this.actiondata.Label = this.ActionLabelForDelete;
    this.actiondata.WFId = this.configuringWFId;
    if (this.Iscontinuetoproceed == "False") {
      this._WFActionservice.Delete(this.actiondata, this.Iscontinuetoproceed)
        .subscribe(
          (data: string) => {
            
            if (this.Iscontinuetoproceed == "False") {              
              if (data == "Action deleted successfully =0") {
                this.toasts[1].content = "Action deleted successfully";
                this.toastObj.show(this.toasts[1]);
                this.confirmDialog.hide();
                this.fnGetAllDetails();
              }
              else {
                this.confirmcontent = data;
                this.Iscontinuetoproceed = "True"
                this.confirmDialog.show();
              }
            }
          },
          (error: any) => console.log(error)
        );
     
    }
    if (this.Iscontinuetoproceed == "True") {
      this._WFActionservice.Delete(this.actiondata, this.Iscontinuetoproceed)
        .subscribe(
          (data: string) => {
            //var splitted = data.split("=");            
            this.toasts[1].content = "Action deleted successfully";
            this.toastObj.show(this.toasts[1]);
            this.confirmDialog.hide();
            this.fnGetAllDetails();
          },
          (error: any) => console.log(error)
        );
      this.confirmDialog.hide();
      return;
    }
  }
  public confirmDlgBtnNoClick = (): void => {
    this.confirmDialog.hide();
    return;
  }

  //confirmation box button defination
  public confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmDlgYesBtnClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];

  //method called while deleting any action
  Delete(ActionId, Label) {
    this.ActionIdForDelete = ActionId;
    this.ActionLabelForDelete = Label;
    this.confirmcontent = 'Deleting this action will remove it from all steps and subsequent allocation to all participants with this workflow. Do you want to delete?"'
    this.confirmDialog.show();
    this.Iscontinuetoproceed ="False"
  }

  //method called on icons drop down selection
  public change(args: any): void {
    this.selectedActionIconId = args.itemData.Id;
    this.showIconImage = true;
    var htmlSTring = "";
    var path = "./assets/flex-images/"
    htmlSTring += '<div><img src="' + path + args.itemData.IconText + ".png" + '"/></div>';
    document.getElementById('icon-image3').innerHTML = htmlSTring;
  }
}
