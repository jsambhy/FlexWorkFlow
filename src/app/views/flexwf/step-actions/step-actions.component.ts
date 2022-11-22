import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ToolbarService, EditService, PageService, ExcelExportService, PdfExportService, FreezeService, ContextMenuService, GridComponent, GridLine, ToolbarItems, ContextMenuItem, FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
import { TextBox, TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { ToastPositionModel, ToastComponent } from '@syncfusion/ej2-angular-notifications';
import { stepactionsmodel, ActionIconsmodel, StepActionCalcViewModel } from '../../../models/step-actions-model';
import { StepActionsService } from '../../../services/step-actions.service';
import { WSteps } from '../../../models/wsteps-model';
import { WorkflowdesignerService } from '../../../services/workflowdesigner.service';

@Component({
  selector: 'app-step-actions',
  templateUrl: './step-actions.component.html',
  styleUrls: ['./step-actions.component.css'],
  providers: [StepActionsService, ToolbarService, EditService, PageService, ExcelExportService, PdfExportService, FreezeService, ContextMenuService]
})
/** step-actions component*/
export class StepActionsComponent {
  // getting parent from component message
  @Input() popupflag: boolean;
  @Input() configuringstepname: string;
  @Input() configuringstepid: number;
  @Input() configuringWFId: number;
  @Input() configuringFlexTableId: number;
  @Input() configuringWFLabel: string;
  @Input() manageactiononParticipant: boolean;
  @Input() selectedStepId: number;
  @Input() selectedStepLabel: string;
  @Input() level: string;
  filterSettings: FilterSettingsModel;
  public visible: Boolean = true;
  //Initializing the View childs of the required components to use them further
  @ViewChild('confirmDialog', { static: false }) public confirmDialog: DialogComponent;
  @ViewChild('confirmDialogForDelete', { static: false }) public confirmDialogForDelete: DialogComponent;
  @ViewChild('toasttype', { static: false }) private toastObj: ToastComponent;
  @ViewChild('CreateactionDialog', { static: false }) public CreateactionDialog: DialogComponent;
  @ViewChild('clonesteps', { static: false }) public clonesteps: DialogComponent;
  @ViewChild('StepActionsDialogue', { static: false }) public StepActionsDialogue: DialogComponent;
  @ViewChild('stepactionsgrid', { static: false }) public stepactionsgrid: GridComponent;
  @ViewChild('stepselectiongridCloneAction', { static: false }) public stepselectiongridCloneAction: GridComponent;
  @ViewChild('label', { static: false }) public label: TextBoxComponent;


 //-----------------------------------Variable Initialization------------------------------------------------
  ConfiguringEntityType: string='FlexTables';//For testing
  public Step_count: number;
  public DataField_count: number;
  public LandingPage_count: number;
  public Action_count: number;
  public Notification_count: number;
  public ConfirmDialogueWidth: string = "400px";
  public selectedActionDefaultLabel: string;
  public headerStepAction: string = "";
  public lines: GridLine;
  public toolbar: ToolbarItems[] | object;
  public toolbarCalc: ToolbarItems[] | object;
  public editSettings: Object;
  public stepActionsmodeldata: stepactionsmodel[];
  public Iscontinuetoproceed: string;
  public readonly: boolean = false;
  public ShowPopupcreatestepaction: boolean = false;
  public ShowIconDropdown: boolean = false;
  public ShowIconImage: boolean = true;
  public cssClass = "e-multi-column";
  public ActionsSourceData: stepactionsmodel[];
  public localFields: Object = { value: 'Id', text: 'Label' };
  public ActionPlaceHolder: string = 'Action*';
  public ActionIconData: ActionIconsmodel[];
  public selectedactioniconid: number;
  public stepcollectionforclonning: WSteps[];
  public stepactioncalcmodeldata: StepActionCalcViewModel[];
  public iconFields: Object = { text: 'IconText', iconCss: 'Class', value: 'Id' };
  public actionIdforClonning: number;
  stepactioncreate: FormGroup = null;
  public Showclonepopup: boolean = false;
  public clonningActionName: string;
  public selectedstepactionId: number;
  public selectedstepactionlabel: string;
  public showCalcPopUp: boolean = false;
  public showManageStepActionPopUp: boolean = false;
  public headerManageAction: string;
  popupHeader: string;
  calcSource: string;


  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };
  public actiondetail: ActionIconsmodel = new ActionIconsmodel();
  public contextMenuItems: ContextMenuItem[] = ['AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending',
    'Copy', 'Edit', 'Delete', 'Save', 'Cancel',
    'PdfExport', 'ExcelExport', 'CsvExport', 'FirstPage', 'PrevPage',
    'LastPage', 'NextPage', 'Group', 'Ungroup'];
  public showWFActionsScreen: boolean = false;
  public stepactiondata: stepactionsmodel = new stepactionsmodel();
  public isRefresh: boolean;
  public showIconImage2: boolean = false;
  public confirmcontent: string;
  public confirmcontentForDelete: string;
  public stepactionidtobedeleted: number;
  public selectedStepIdsForClonning: string = "";
  public hidden: boolean = false;
  showValidationPage: boolean = false;
  //----------------------------------------Methods block--------------------------------------------------
  constructor(private data: WorkflowdesignerService, private _service: StepActionsService) {
    this.stepactioncreate = new FormGroup({
      actionlabel: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      actiondrop: new FormControl('', [Validators.required]),
      Icondrop: new FormControl(''),
    });
    //this.popupHeader = "Calculation for Action ' " + this.selectedstepactionlabel + "' on Step '" + this.configuringstepname + "'";
    this.calcSource = "StepAction";
  }
  //method to get the form controls for validation purpose
  get f() { return this.stepactioncreate.controls; }
  public isFieldValid(field: string) {
    return !this.stepactioncreate.get(field).valid && (this.stepactioncreate.get(field).dirty || this.stepactioncreate.get(field).touched);
  }
  @Output() PostStepActionEvent = new EventEmitter();
  dialogClose() {
    this.PostStepActionEvent.emit();
  }

  //No button click method of the dialogue
  public confirmDlgBtnNoClick = (): void => {
    this.confirmDialog.hide();
  }
  //Yes button click method of the dialogue
  public confirmDlgBtnYesClick = (): void => {
    //if (this.Iscontinuetoproceed == "False") {
    //  this._service.DeleteById(this.stepactionidtobedeleted, this.Iscontinuetoproceed).subscribe(
    //    (data: string) => {
    //      if (data == "Action deleted successfully") {
    //        if (this.level == "steplevel") {
    //          //this.stepactiondata.StepId = this.configuringstepid;
    //          this.getAllActionsDetailsByStepId(this.configuringstepid);
    //          this.getComponentsCounts();
    //        }
    //        if (this.level == "workflowlevel") {
    //          //this.stepactiondata.StepId = this.selectedStepId;
    //          this.getAllActionsDetailsByStepId(this.selectedStepId);
    //          this.getComponentsCounts();
    //        }
    //        this.toasts[1].content = data;
    //        this.toastObj.show(this.toasts[1]);
    //      }
    //      else {
    //        this.confirmcontentForDelete = data;
    //        this.confirmDialogForDelete.show();
    //      }
    //    },
    //    (error: any) => alert(error)
    //  );

    //}

    this.Iscontinuetoproceed = "True";
    this.FnDelete(this.stepactionidtobedeleted);
    this.confirmDialog.hide();
  }

  //method to get the counts(used on the base cmponents for train info)
  public getComponentsCounts() {
    this.data.getWFComponentsCounts(this.configuringWFId, this.configuringFlexTableId).subscribe(
      (data: any) => {
        document.getElementById('countSteps').innerHTML = data[0].StepCount;
        this.Step_count = data[0].StepCount;
        document.getElementById('countDataFields').innerHTML = data[0].DataFieldCount;
        this.DataField_count = data[0].DataFieldCount;
        document.getElementById('countLandingPages').innerHTML = data[0].LandingPageCount;
        this.LandingPage_count = data[0].LandingPageCount;
        document.getElementById('countActions').innerHTML = data[0].ActionCount;
        this.Action_count = data[0].ActionCount;
        document.getElementById('countNotifications').innerHTML = data[0].NotificationCount;
        this.Notification_count = data[0].NotificationCount;
      },
      (error: any) => console.log(error)
    );
  }

  //No button click of the delete confirmation box
  //public BtnNoClick = (): void => {
  //  this.confirmDialogForDelete.hide();
  //}

  ////Yes button click of the delete confirmation box
  //public BtnYesClick = (): void => {
  //  this.FnDeleteStepActionAfterConfirmation(this.stepactionidtobedeleted);
  //  this.confirmDialogForDelete.hide();
  //}

  //Declaring button clicks of the confirmations dialogues
  public confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmDlgBtnYesClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];
 // public confirmDlgButtonsForDelete: ButtonPropsModel[] = [{ click: this.BtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.BtnYesClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];

  //Pop up cross button click method
  public Close = (): void => {
    this.popupflag = false;
    this.CreateactionDialog.hide();
    this.StepActionsDialogue.show();
    this.stepactionsgrid.refreshDataSource;
  }

  //method for getting the action details
  public getActionsDetails(Id) {
    this._service.GetNonLinkingActionsByStepId(Id)
      .subscribe(
        data => {
          this.ActionsSourceData = data;
        }
      );
  }
  //angular cycle Init event
  ngOnInit() {
    this.lines = 'Both';
    this.filterSettings = { type: 'CheckBox' }; // inorder to remove extra filtering from the grid we set it to this type.
    this.toolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' }, { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' }, { text: 'Clone', tooltipText: 'Clone', prefixIcon: 'e-custom-icons e-action-Icon-clone', id: 'Clone' }, { text: 'Calculation', tooltipText: 'Calculation for Action', prefixIcon: 'e-custom-icons e-action-Icon-calculations', id: 'Calc' }, { text: 'Manage Sub Processes', tooltipText: 'Manage Sub Processes', prefixIcon: 'e-custom-icons e-action-Icon-SubProcessManage', id: 'SubProcesses' }, { text: 'Manage Validations', tooltipText: 'Manage Validations', prefixIcon: 'e-custom-icons e-action-Icon-validation', id: 'validations' }, 'ExcelExport', 'PdfExport', 'CsvExport', 'Search'];
    this.editSettings = {  mode: 'Dialog' };  
    if ((this.level == "steplevel") && (this.manageactiononParticipant == false)) {
      this.headerManageAction = "Manage Actions for the Step '" + this.configuringstepname + "'";
      this.headerStepAction = "Add Action to the Step '" + this.configuringstepname + "'";     
      this.getAllActionsDetailsByStepId(this.configuringstepid);      
      this.getActionsDetails(this.configuringstepid);
      this.CreateactionDialog.show();
      this.StepActionsDialogue.hide();
    }
    if (this.level == "workflowlevel" && this.manageactiononParticipant == false) {
      this.configuringstepname = this.selectedStepLabel;
      this.headerStepAction = "Add Action to the Step '" + this.selectedStepLabel + "'";
      this.headerManageAction = "Manage Actions for the Step '" + this.selectedStepLabel + "'";
      this.getAllActionsDetailsByStepId(this.selectedStepId);
      this.getActionsDetails(this.selectedStepId);
      this.CreateactionDialog.hide();
      this.StepActionsDialogue.show();
    }
    if (this.manageactiononParticipant == true && this.level == "steplevel") {
      this.headerStepAction = "Add Action to the Step '" + this.configuringstepname  + "'";
      this.headerManageAction = "Manage Actions for the Step '" + this.configuringstepname + "'";
      this.getAllActionsDetailsByStepId(this.configuringstepid);      
      this.getActionsDetails(this.configuringstepid);
      this.CreateactionDialog.show();
      this.StepActionsDialogue.hide();
    }
  }

  //method to get the actions for the grid data
  public getAllActionsDetailsByStepId(StepId) {
    this._service.getAllActionsDetailsByStepId(StepId)
      .subscribe(
        data => {
          this.stepActionsmodeldata = (data);
        }
      );
  }

  //focus out event called on the action label of the form and required task done
  public focusOut(args: TextBox): void {
    if (this.stepactioncreate.invalid) {
      return;
    }
    else {
      this._service.GetStepActionLabelStatusInWorkFlow(this.configuringWFId, args.value).subscribe(
        (data: any) => {
          if (data > 0) {
            this.toasts[0].content = "Cannot use '" + args.value + "' label as it is already used in this workflow or it is reserved label for an out of the box action";

            this.label.value = this.selectedActionDefaultLabel;

            this.toastObj.show(this.toasts[0]);
          }

        },
        (error: any) => console.log(error)
      );
    }
  }

  showSubProcessPopUp: Boolean = false;
  //toolbar click event
  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'stepactionsgrid_pdfexport') {
      this.stepactionsgrid.pdfExport();
    }
    if (args.item.id === 'stepactionsgrid_excelexport') {
      this.stepactionsgrid.excelExport();
    }
    if (args.item.id === 'stepactionsgrid_csvexport') {
      this.stepactionsgrid.csvExport();
    }
    if (args.item.id === 'Add') {
      if ((this.level == "steplevel") && (this.manageactiononParticipant == false)) {
        this.headerManageAction = "Manage Actions for the Step '" + this.configuringstepname + "'";
        this.headerStepAction = "Add Action to the Step '" + this.configuringstepname + "'";
        this.getAllActionsDetailsByStepId(this.configuringstepid);
        this.getActionsDetails(this.configuringstepid);
        
      }
      if (this.level == "workflowlevel" && this.manageactiononParticipant == false) {
        this.configuringstepname = this.selectedStepLabel;
        this.headerStepAction = "Add Action to the Step '" + this.selectedStepLabel + "'";
        this.headerManageAction = "Manage Actions for the Step '" + this.selectedStepLabel + "'";
        this.getAllActionsDetailsByStepId(this.selectedStepId);
        this.getActionsDetails(this.selectedStepId);
        
      }
      if (this.manageactiononParticipant == true && this.level == "steplevel") {
        this.headerStepAction = "Add Action to the Step '" + this.configuringstepname + "'";
        this.headerManageAction = "Manage Actions for the Step '" + this.configuringstepname + "'";
        this.getAllActionsDetailsByStepId(this.configuringstepid);
        this.getActionsDetails(this.configuringstepid);
      }
      this.ShowPopupcreatestepaction = true;
      this.ShowIconDropdown = false;
      //this.ShowIconImage = false;
      this.stepactioncreate.patchValue({
        actionlabel: null,
        actiondrop: null,
        Icondrop: null
      });
     
    }
    if (args.item.id === 'Delete') {
      debugger;
      const selectedRecords = this.stepactionsgrid.getSelectedRecords();
      console.log(selectedRecords);
      //ActionId: 5
      //Icon: "Review_1"
      //Id: 9045
      //Label: "Review"
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No action is selected for deletion";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.DeleteById(selectedRecords[0]['Id']);
      }
    }

    if (args.item.id === 'Clone') {
      
      const selectedRecords = this.stepactionsgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        //alert box need to open in which it will inform that  no row is selected for clonning
        this.toasts[3].content = "No action is selected for clonning";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.clonningActionName = selectedRecords[0]['Label'];
        this.openclonepopup(selectedRecords[0]['ActionId']);
      }
    }
    if (args.item.id === 'Calc') {
      const selectedRecords = this.stepactionsgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No action is selected for calculation";
        this.toastObj.show(this.toasts[3]);
        //alert box need to open in which it will inform that  no row is selected for clonning
      }
      else {

        this.selectedstepactionId = selectedRecords[0]['Id'];
        this.selectedstepactionlabel = selectedRecords[0]['Label'];
        this.popupHeader = "Calculation for Action ' " + this.selectedstepactionlabel + "' on Step '" + this.configuringstepname + "'";
       // this.StepActionsDialogue.hide();
        this.showCalcPopUp = true;
        
      }
    }

    //Sub Process Action
    if (args.item.id === 'SubProcesses') {
      const selectedRecords = this.stepactionsgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[0].content = "No Action is selected for getting Sub Processes";
        this.toastObj.show(this.toasts[0]);
      }
      else {

        this.selectedstepactionId = selectedRecords[0]['Id'];
        this.selectedstepactionlabel = selectedRecords[0]['Label'];
        //Get data of subProcesses
        this.showSubProcessPopUp = true;

      }
    }


    //
    if (args.item.id === 'validations') {
      const selectedRecords = this.stepactionsgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[2].content = "No Action is selected for getting Validations";
        this.toastObj.show(this.toasts[2]);
      
      }
      else {
        this.level = 'stepactionlevel';
        let isexists: boolean = false;
        this.selectedstepactionId = selectedRecords[0]['Id'];
        this.selectedstepactionlabel = selectedRecords[0]['Label'];
        this._service.GetStepActionIdListForNextActionByStepId(this.selectedStepId).subscribe(
          (stepActionIdList: any) => {
            if (stepActionIdList.length != 0) {
              for (var i = 0; i < stepActionIdList.length; i++) {
                if (this.selectedstepactionId == stepActionIdList[i]) {
                  isexists = true;                  
                }                
              }
              if (isexists == false) {
                this.toasts[2].content = "Cannot create validation foir this Action";
                this.toastObj.show(this.toasts[2]);
              }
              else {
                this.showValidationPage = true;
              }
            }
          },
          (error: any) => console.log(error)
        );
      
      }
    }


  }

  //Event called on the dropdown selection of the Action
  public change(args: any): void {
    this.selectedstepactionId = args.itemData.Id;
    this.selectedstepactionlabel = args.itemData.Label;
    this.fnGetDefaultLabel(this.selectedstepactionlabel);
    this._service.GetIconsDetailsByActionIdForAngular(this.selectedstepactionId).subscribe(
      (data: any) => {
        this.selectedactioniconid = data[0].Id;
        this.ActionIconData = data;
      },
      (error: any) => console.log(error)
    );

  }

  //Event called on the dropdown selection of the Icons
  public Iconchange(args: any): void {
    this.selectedactioniconid = args.itemData.Id;
    this.showIconImage2 = true;
    var htmlSTring = "";
    var path = "./assets/flex-images/"
    htmlSTring += '<div><img src="' + path + args.itemData.IconText + ".png" + '"/></div>';
    document.getElementById('icon-image2').innerHTML = htmlSTring;
  }

  //Method to save the data
  onFormSubmit() {
    if (this.level == "steplevel") {
      this.stepactiondata.StepId = this.configuringstepid;
      this.isRefresh = true;
    }
    if (this.level == "workflowlevel") {
      this.stepactiondata.StepId = this.selectedStepId//this.stepcolumncreate.get('visible').value;
    }
    this.stepactiondata.ActionId = this.selectedstepactionId;
    this.stepactiondata.Label = this.stepactioncreate.get('actionlabel').value.replace(/ /g, "");//removing front and end spaces;
    this.stepactiondata.ActionIconId = this.selectedactioniconid;
    this.stepactiondata.WFId = this.configuringWFId;
    this.stepactiondata.wfname = this.configuringWFLabel;
    if (this.stepactioncreate.invalid) {
      return;
    }
    else {
      this._service.Save(this.stepactiondata).subscribe(
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
          this.popupflag = false;
          this.CreateactionDialog.hide();
          this.StepActionsDialogue.show();

          if (this.level == "steplevel") {
            this.getAllActionsDetailsByStepId(this.configuringstepid);
          }
          if (this.level == "workflowlevel") {
            this.getAllActionsDetailsByStepId(this.selectedStepId);
          }
          this.getComponentsCounts();
        },
        (error: any) => console.log(error)
      );
    }
  }

  //method to get the defalut label of action 
  fnGetDefaultLabel(selectedactionlabel) {
    this._service.GetStepActionUsedDefaultLabelInWF(this.configuringWFId, selectedactionlabel).subscribe(
      (data: any) => {
        if (data.length != 0) {
          this.selectedActionDefaultLabel = data[0].Label;
          this.stepactioncreate.patchValue({
            actionlabel: data[0].Label
          });
          this.readonly = true;
          this.ShowIconImage = true;
          this.ShowIconDropdown = false;
          var htmlSTring = "";
          var path = "./assets/flex-images/"
          htmlSTring += '<div><img src="' + path + data[0].Icon + ".png" + '"/></div>';
          document.getElementById('icon-image').innerHTML = htmlSTring;
        }
        else {
          this.selectedActionDefaultLabel = this.selectedstepactionlabel;
          this.stepactioncreate.patchValue({
            actionlabel: this.selectedstepactionlabel
          });
          this.readonly = false;
          this.ShowIconDropdown = true;
          this.ShowIconImage = false;
        }
      },
      (error: any) => console.log(error)
    );


  }

  //method to delete the data
  DeleteById(Id) {
    this.Iscontinuetoproceed = "False";
    this.stepactionidtobedeleted = Id;
    this.FnDelete(this.stepactionidtobedeleted);
  }

  FnDelete(Id) {
    
    this._service.DeleteById(Id, this.Iscontinuetoproceed, this.configuringWFLabel, this.configuringWFId, this.selectedStepId).subscribe(
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
        else if (MsgPrefix == 'C:') {//Confirmation message
          this.confirmcontent = Showmsg;
          this.confirmDialog.show();
        }
        else {//Error Message
          this.toasts[2].content = Showmsg;
          this.toastObj.show(this.toasts[2]);
        }
        this.getComponentsCounts();
        if (this.level == "steplevel") {
          this.getAllActionsDetailsByStepId(this.configuringstepid);
        }
        if (this.level == "workflowlevel") {
          this.getAllActionsDetailsByStepId(this.selectedStepId);
        }
      },
      (error: any) => { console.log(error)}
    );
  }

  openclonepopup(cloneactionid) {
    this.actionIdforClonning = cloneactionid;
    if (this.level == "steplevel") {
      this.stepactiondata.StepId = this.configuringstepid;
      this._service.GetAllStepsForClonningAction(this.configuringstepid, cloneactionid, this.configuringWFId)
        .subscribe(
          data => {
            if (data.length == 0) {
              this.toasts[3].content = "This action is already added to all the steps of this workflow";
              this.toastObj.show(this.toasts[3]);              
            }
            else {              
              this.stepcollectionforclonning = (data);
              this.Showclonepopup = true;
            }

          }
        );
    }
    if (this.level == "workflowlevel") {
      this.stepactiondata.StepId = this.selectedStepId//this.stepcolumncreate.get('visible').value;
      this._service.GetAllStepsForClonningAction(this.selectedStepId, cloneactionid, this.configuringWFId)
        .subscribe(
          data => {
            if (data.length == 0) {
              this.toasts[3].content = "This action is already added to all the steps of this workflow";
              this.toastObj.show(this.toasts[3]);    
            }
            else {
              this.Showclonepopup = true;
              this.stepcollectionforclonning = (data);
            }

          }
        );
    }
  }

  //method for opening calculation pop up
  opencalcpopup(stepactionidforcalc) {
    this._service.GetDataForCalc(stepactionidforcalc)
      .subscribe(
        data => {
          this.showCalcPopUp = true;
          console.log(data);
        }
      );

  }

  //method to clone action to other step
  FnCloneActionstoSteps() {
    
    const selectedrecords: object[] = this.stepselectiongridCloneAction.getSelectedRecords();  // Get the selected records.
    if (selectedrecords.length == 0) {
      this.toasts[3].content = "No selection made";
      this.toastObj.show(this.toasts[3]);
    }
    else {
      for (var i = 0; i < selectedrecords.length; i++) {
        let StepId = selectedrecords[i]['Id'];
        this.selectedStepIdsForClonning += StepId + "^";
      }
      this.selectedStepIdsForClonning = this.selectedStepIdsForClonning.substring(0, (this.selectedStepIdsForClonning.length) - 1);


      if (this.level == "steplevel") {
        this.stepactiondata.StepId = this.configuringstepid;
      }
      if (this.level == "workflowlevel") {
        this.stepactiondata.StepId = this.selectedStepId;
      }

      this.stepactiondata.ChoosenSteps = this.selectedStepIdsForClonning;
      this.stepactiondata.WFId = this.configuringWFId;
      this.stepactiondata.ActionId = this.actionIdforClonning;
      this.stepactiondata.wfname = this.configuringWFLabel;
      this._service.CloneActionsToChoosenSteps(this.stepactiondata)
        .subscribe(
          data => {
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
            this.clonesteps.hide();
            this.getComponentsCounts();
          }
        );
    }

  }

  //method to open the manage WFAction, when click in note of the pop up given in footer
  public fnOpenManageWFActionsPage() {
    this.level = "workflowlevel";
    this.showWFActionsScreen = true;
  }
}

