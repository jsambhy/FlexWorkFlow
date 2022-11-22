import { Component, ViewEncapsulation, ViewChild, ElementRef, Inject, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import {
  DiagramComponent, ICollectionChangeEventArgs, PortVisibility, PortConstraints, IDropEventArgs,
  IDragEnterEventArgs,  IDraggingEventArgs, LayoutModel,  DataBinding,  HierarchicalTree,
  LayoutAnimation,  MindMap,  ComplexHierarchicalTree,  SymmetricLayout,  Rect
} from '@syncfusion/ej2-angular-diagrams';
import {
  Diagram, NodeModel, UndoRedo, ConnectorModel, PointPortModel, Connector, FlowShapeModel,
  SymbolInfo, MarginModel, Node, PaletteModel, ITextEditEventArgs, ContextMenuSettingsModel, IClickEventArgs, ISelectionChangeEventArgs, DiagramBeforeMenuOpenEventArgs, IMouseEventArgs, IDragLeaveEventArgs, IConnectionChangeEventArgs, IConnector
} from '@syncfusion/ej2-diagrams';

import { MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { ExpandMode, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { Browser, Ajax } from '@syncfusion/ej2-base';
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
import { ActivatedRoute, Params } from '@angular/router';
import { RadioButtonComponent, CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import {
  GridComponent, ToolbarService, EditService, PageService, ExcelExportService,PdfExportService, FreezeService, ContextMenuService, ToolbarItems, ReorderService, GridLine, FilterSettingsModel
} from '@syncfusion/ej2-angular-grids';
import { TextBox, SliderTooltipEventArgs, SliderTickEventArgs, SliderTickRenderedEventArgs } from '@syncfusion/ej2-angular-inputs';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { environment } from '../../../../environments/environment';
import { WorkflowdesignerService } from '../../../services/workflowdesigner.service';
import { StepActionsService } from '../../../services/step-actions.service';
import { BranchService } from '../../../services/branch.service';
import { StepActionLabelmodel, NextStepmodel, workflownodemodel, workflowconnectormodel, ActionIconsmodel } from '../../../models/workflow-diagram-model';
import { StepColumnsComponent } from '../step-columns/step-columns.component';
import { flexworkflowmodel } from '../../../models/flex-workflows-model';
import { paletteIconClick } from '../../../scripts/diagram-common';
Diagram.Inject(UndoRedo, DataBinding, HierarchicalTree, LayoutAnimation, MindMap, ComplexHierarchicalTree, SymmetricLayout);
@Component({
  //selector: 'control-content',
  templateUrl: './workflow-diagram.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [WorkflowdesignerService, StepActionsService, BranchService, ReorderService, ToolbarService, EditService, PageService, ExcelExportService, PdfExportService, FreezeService, ContextMenuService],
  styleUrls: ['./workflow-diagram.component.css']
})

/** workflow-diagram component*/
export class WorkflowDiagramComponent {  
  existingactiondata: StepActionLabelmodel[];
  public selectednodeid: string;
  returnUrlForDataFields: string;
  public manageactiononParticipant: boolean;
  public showBranchCondition: boolean;
  public ShowStepActionPartcipant: boolean;
  public saveData: string = "";
  public eventonlink: string;
  public connectorupdateid: string;
  public ActionForEdit: string;
  public cnfmContent: string;
  public ShowActionCreateBtn: boolean;
  public ShowActionUpdateBtn: boolean;
  submitted: boolean = false;
  LoggedInScopeEntityType: string;
  LoggedInScopeEntityId: number;
  @ViewChild('diagram', { static: false }) public diagram: DiagramComponent;
  @ViewChild('diagToolbar', { static: false }) public diagToolbar: ToolbarItems;
  @ViewChild('confirmationDialog', { static: false }) public confirmationDialog: DialogComponent;
  @ViewChild('promptDialog', { static: true }) public promptDialog: DialogComponent; 
  @ViewChild('steptxt', { static: false }) public steptxt: ElementRef;
  @ViewChild('passwordlnk', { static: false }) public passwordlnk: ElementRef;
  @ViewChild('stepColumns', { static: true }) public stepColumns: StepColumnsComponent
  @ViewChild('radiobutton', { static: false }) public radioButton: RadioButtonComponent;
  @ViewChild('Statusradiobutton', { static: false }) public Statusradiobutton: RadioButtonComponent;
  @ViewChild('confirmDialog', { static: false }) public confirmDialog: DialogComponent;
  @ViewChild('existactiongrid', { static: false })  public existactiongrid: GridComponent;
  @ViewChild('promptDialogActions', { static: true }) public promptDialogActions: DialogComponent;
  @ViewChild('toasttype', { static: false }) private toastObj: ToastComponent;
  @ViewChild('Status', { static: false }) public Status: DropDownListComponent;
  @ViewChild('IsStepReady', { static: false }) public IsStepReady: CheckBoxComponent;
  @ViewChild('IsMandatory', { static: false }) public IsMandatory: CheckBoxComponent;
  
  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public layout: LayoutModel;
  public position: ToastPositionModel = { X: 'Center' };
  public nodeid: string;
  public contentnode: string;
  public contentnodename: string;
  public connectorId: string;
  public connectorname: string;
  public action: string;
  public arrangeFlag: string;
  public configuringWFId: number;
  public configuringStepActionId: number;
  public configuringFlexTableId: number;
  public configuringWFLabel: string;
  public Project_Name: string;
  public configuringWFStatus: string;
  public configuringNvarcharStepId: string;
  public configuringNextStepNvarcharId: string;
  public actionNameforBranching: string;
  public nodeshape: string;
  public sourcenodetext: string;
  public destinationnodetext: string;
  public sourcenodeintid: number;
  public destinationnodeintid: number;
  public selectednodeoffsetX: number;
  public selectednodeoffsetY: number;
  public selectedconnectorid: string;
  public IsNodeOrConnectorDelete: string
  public showCloseIcon: Boolean = false;
  public visible: Boolean = true;
  public hidden: Boolean = false;
  public confirmCloseIcon: Boolean = true;
  public target: string = '.sb-mobile-diagram';
  public promptWidth: string = '600px';
  public animationSettings: Object = { effect: 'None' };
  public hide: any;
  public IconsData: { [key: string]: Object }[];
  public iconFields: Object = { iconCss: 'Class', text: 'IconText', value: 'Id' };
  public iconPlaceHolder: string = 'Select Icon';
  public cssClass = "e-multi-column";
  public lines: GridLine;
  public toolbar: ToolbarItems[] | object;
  public editSettings: Object;
  public value: string;
  public showIconImage: boolean = false;
  public checkval: boolean;
  public checkvalLive: boolean;
  public Step_count: number;
  public DataField_count: number;
  public LandingPage_count: number;
  public Action_count: number;
  public Notification_count: number;
  public SubProcess_count: number;
  public Validation_count: number
  public Branch_count: number;
  public nodes_data: string;
  public nodes: NodeModel[];
  public configuringstepid: number;
  public configuringstepname: string;
  public connectors: ConnectorModel[];
  public level: string;  
  public ShowBranchPopUp: boolean = false;
  public showpopup: boolean = false;
  public showstepcol: boolean = false;
  public showBranch: boolean = false;
  public showmanageactions: boolean = false;
  public showmanageparticipants: boolean = false;
  public showValidationPage: boolean = false;
  public showconfirmpopup: boolean = false;
  public sessionprojectid: string;
  public projectId: number;
  public ShowPopupcreateaction: boolean = false;
  public ShowPopupexistaction: boolean = true;
  public showWFActions: boolean = false;
  public isChanged: boolean = true;
  createactionform: FormGroup = null;
  get f() { return this.createactionform.controls; }
  NextStepmodel = new NextStepmodel();
  readonly baseUrl = environment.baseUrl;
  
  public selectedStatus: string;
  public statusvalue: number;
  public tooltipData02: Object = { placement: 'Before', isVisible: true, showOn: 'Always' };
  public ticksData02: Object = { placement: 'After', largeStep: 1 };
  public showstatusdropdown: boolean = false;
  public showWFStatusChangePopUp: boolean = false;
  public ShowValidatedWFErrorList: boolean = false;
  public nodedata: workflownodemodel = new workflownodemodel();//declaring and initializing the variable to use further
  public wfmodel: flexworkflowmodel = new flexworkflowmodel();
  public connectordata: workflowconnectormodel = new workflowconnectormodel();//declaring and initializing the variable to use further
  public actiondetail: ActionIconsmodel = new ActionIconsmodel();
  public targetElement: HTMLElement;
  public Dialog: DialogComponent;
  public DialogConfirm: DialogComponent;
  public header: string = 'Pop Up';
  public width: string = '50%';
  filterSettings: FilterSettingsModel;
  //function calls on the chnaging of the radio button selection
  public changeHandler(): void {
    if (this.radioButton.getSelectedValue() === "rdbnew") {
      this.ShowPopupcreateaction = true;
      this.ShowPopupexistaction = false;
    }
    else {
      this.ShowPopupcreateaction = false;
      this.ShowPopupexistaction = true;
    }
  }




  //-----------------------------------------------------------------
  //public value1: number = 20;
  //public min: number = 0;
  //public max: number = 40;
  //public step: number = 3;

  //public slider_ticks: Object = { placement: 'Both', largeStep: 20, smallStep: 0 };
  //public ticksData02: Object = { placement: 'After', largeStep: 1, smallStep: 0};
  //renderedTicks(args: SliderTickRenderedEventArgs) {
  //  let li: any = args.ticksWrapper.getElementsByClassName('e-large');
  //  let remarks: any = ['Off', 'Beta', 'Live'];
  //  for (let i: number = 0; i < li.length; ++i) {
  //    (li[i].querySelectorAll('.e-tick-both')[1] as HTMLElement).innerText = remarks[i];
  //  }
  //}
  //public tooltipData: Object = { placement: "Before", isVisible: true };

  //change(args) {
  //  //alert(args.value);
  //  //Check the value and show the alert.
  //  //if (args.value == 40) {
  //  //  alert("40");
  //  //}
  //  if (args.value == 20) {
  //    alert("20");
  //  }
  //}

  //---------------------------------------------------------------

  //Event when slider tick gets change
  tooltipChangeHandler(args: SliderTooltipEventArgs): void {
    let daysArr: string[] = ['off', 'Beta', 'Live'];
    // Customizing each ticks text into weeksdays
    args.text = daysArr[parseFloat(args.text)];

   
  }

 //Event for showing the text under the slider
  renderingTicksHandler(args: SliderTickEventArgs): void {
    let daysArr: string[] = ['off', 'Beta', 'Live'];
    args.text = daysArr[parseFloat(args.text)];
  }

  //getValidateState: boolean;
  flag: boolean;
  onChange(e: any) {
    
    if (e.value == 0) {
          this.data.UpdateWFStatus(this.configuringWFId, "Offline").subscribe(
            (data: string) => {
              
            this.toasts[1].content = "Your Workflow is in Offline mode";
            this.toastObj.show(this.toasts[1]);

          })
    }

    if (e.value == 1) {
      this.ValidateWFonStatusChange("Beta");

    }

    if (e.value == 2) {
      this.ValidateWFonStatusChange("Live");
    }
  }

  //event call on the step name pop up
  public onFocus = (): void => {
    this.steptxt.nativeElement.parentElement.classList.add('e-input-focus');
  }

  //event call on the step name pop up
  public onBlur = (): void => {
    this.steptxt.nativeElement.parentElement.classList.remove('e-input-focus');
  }

  //Dialogue button functionality for the step name pop up
  public promptDlgButtons: ButtonPropsModel[] = [
    { click: this.nodePropertiesChange.bind(this), buttonModel: { content: 'Submit', isPrimary: true} },
    { click: this.closeDialogButton.bind(this), buttonModel: { content: 'Cancel' } }];

  // While clicking prompt button, open the prompt Dialog
  public promptBtnClick = (): void => {
    this.promptDialog.show();
    this.dialogOpen();
  }

  //toolbar click event called for the existing action grid
  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'grid_pdfexport') {
      this.existactiongrid.pdfExport();
    }
    if (args.item.id === 'grid_excelexport') {
      this.existactiongrid.excelExport();
    }
    if (args.item.id === 'grid_csvexport') {
      this.existactiongrid.csvExport();
    }
  }

  // method called while clicking on arranging diagram icon
  public fnArrangeDiagram() {
    this.diagram.layout = {
      type: 'HierarchicalTree',
      bounds: new Rect(0, 0, 500, 500),
      horizontalSpacing: 50,
      verticalSpacing: 100,
      horizontalAlignment: 'Left',
      verticalAlignment: 'Top'
    }
    this.diagram.doLayout();
    this.arrangeFlag = "arrange";
    this.cnfmContent = "Are you sure you want to save the diagram structure to hierarchical?"
    this.confirmDialog.show()

  }


  public ValidateWFonStatusChange = (Statustype): void => {
    

    this.wfmodel.Name = this.configuringWFLabel;
    this.wfmodel.Id = this.configuringWFId;
    this.wfmodel.ScopeEntityType = this.LoggedInScopeEntityType;
    this.wfmodel.ScopeEntityId = this.LoggedInScopeEntityId;
    this.data.DownloadValidateWorkFlowData(this.wfmodel).subscribe(
      (data: any) => {
        var messagearray = data.split('^');
        var messagepart = messagearray[1];
        var filename = messagearray[0];
        if (messagepart == "Workflow validated successfully") {
          if (Statustype == "Beta") {
            this.data.UpdateWFStatus(this.configuringWFId, "Beta").subscribe(
              (data: string) => {
                this.toasts[1].content = "Your Workflow is in Beta mode";
                this.toastObj.show(this.toasts[1]);
                this.statusvalue = 1;
              })
          }
          if (Statustype == "Live") {
            this.data.UpdateWFStatus(this.configuringWFId, "Live").subscribe(
              (data: string) => {
                this.toasts[1].content = "Your Workflow is in Live mode";
                this.toastObj.show(this.toasts[1]);
                this.statusvalue = 2;

              })
          }



        }
        //downloading of the file will happens next
        else {
          if (filename) {
            if (Statustype == "Beta") {
              this.toastObj.timeOut = 3000;
              this.toasts[3].content = "Your Workflow has errors, cannot update status to Beta mode";
              this.toastObj.show(this.toasts[3]);
              setTimeout(() => {
                this.data.UpdateWFStatus(this.configuringWFId, "Offline").subscribe(
                  (data: string) => {
                    this.ShowValidatedWFErrorList = true;
                    this.statusvalue = 0;
                  })
              }, 3000);
            }
            if (Statustype == "Live") {
              this.toastObj.timeOut = 3000;
              this.toasts[3].content = "Your Workflow has errors, cannot update status to Live mode";
              this.toastObj.show(this.toasts[3]);
              setTimeout(() => {
                this.data.UpdateWFStatus(this.configuringWFId, "Offline").subscribe(
                  (data: string) => {
                    this.ShowValidatedWFErrorList = true;
                    this.statusvalue = 0;
                  })
              }, 3000);


            }

          }
        }
      })

    //this.data.getProjectName().subscribe(
    //  (data: any) => {
    //    this.wfmodel.Name = this.configuringWFLabel;
    //    this.wfmodel.Id = this.configuringWFId;
    //    this.wfmodel.ProjectName = data.ProjectName;
    //    this.wfmodel.ScopeEntityType = this.LoggedInScopeEntityType;
    //    this.wfmodel.ScopeEntityId = this.LoggedInScopeEntityId;
    //  this.Project_Name = data.ProjectName;
        
    //    this.data.DownloadValidateWorkFlowData(this.wfmodel).subscribe(
    //      (data: any) => {
    //        var messagearray = data.split('^');
    //        var messagepart = messagearray[1];
    //        var filename = messagearray[0];
    //        if (messagepart == "Workflow validated successfully") {
    //          if (Statustype == "Beta") {
    //            this.data.UpdateWFStatus(this.configuringWFId, "Beta").subscribe(
    //              (data: string) => {
    //                this.toasts[1].content = "Your Workflow is in Beta mode";
    //                this.toastObj.show(this.toasts[1]);
    //                this.statusvalue = 1;
    //              })
    //          }
    //          if (Statustype == "Live") {
    //            this.data.UpdateWFStatus(this.configuringWFId, "Live").subscribe(
    //              (data: string) => {
    //                this.toasts[1].content = "Your Workflow is in Live mode";
    //                this.toastObj.show(this.toasts[1]);
    //                this.statusvalue = 2;

    //              })
    //          }
              
              
              
    //        }
    //        //downloading of the file will happens next
    //        else {
    //          if (filename) {
    //            if (Statustype == "Beta") {
    //              this.toastObj.timeOut = 3000;
    //              this.toasts[3].content = "Your Workflow has errors, cannot update status to Beta mode";
    //              this.toastObj.show(this.toasts[3]);
    //              setTimeout(() => {
    //                this.data.UpdateWFStatus(this.configuringWFId, "Offline").subscribe(
    //                  (data: string) => {
    //                    this.ShowValidatedWFErrorList = true;
    //                    this.statusvalue = 0;
    //                  })
    //              }, 3000);
    //            }
    //            if (Statustype == "Live") {
    //              this.toastObj.timeOut = 3000;
    //              this.toasts[3].content = "Your Workflow has errors, cannot update status to Live mode";
    //              this.toastObj.show(this.toasts[3]);
    //              setTimeout(() => {
    //                this.data.UpdateWFStatus(this.configuringWFId, "Offline").subscribe(
    //                  (data: string) => {
    //                    this.ShowValidatedWFErrorList = true;
    //                    this.statusvalue = 0;
    //                  }) }, 3000);


    //            }
               
    //          }
    //        }
    //      })
    //  })
  }



  //Method for validation Workflow
  fnValidateWorkFlow() {

    this.wfmodel.Name = this.configuringWFLabel;
    this.wfmodel.Id = this.configuringWFId;

    this.data.DownloadValidateWorkFlowData(this.wfmodel).subscribe(
      (data: any) => {
        var messagearray = data.split('^');
        var messagepart = messagearray[1];
        var filename = messagearray[0];
        if (messagepart == "Workflow validated successfully") {
          this.toasts[1].content = messagepart;
          this.toastObj.show(this.toasts[1]);
          this.flag = false;
        }
        //downloading of the file will happens next
        else {
          if (filename) {
            this.flag = true;
            this.ShowValidatedWFErrorList = true;
          }
        }
      })

    //this.data.getProjectName().subscribe(
    //  (data: any) => {
    //    this.wfmodel.Name = this.configuringWFLabel;
    //    this.wfmodel.Id = this.configuringWFId;
    //    this.wfmodel.ProjectName = data.ProjectName;
    //    this.Project_Name = data.ProjectName;
    //    this.data.DownloadValidateWorkFlowData(this.wfmodel).subscribe(
    //      (data: any) => {
    //        var messagearray = data.split('^');
    //        var messagepart = messagearray[1];
    //        var filename = messagearray[0];
    //        if (messagepart == "Workflow validated successfully") {
    //          this.toasts[1].content = messagepart;
    //          this.toastObj.show(this.toasts[1]);
    //          this.flag = false;
    //        }
    //        //downloading of the file will happens next
    //        else {              
    //          if (filename) {
    //            this.flag = true;
    //            this.ShowValidatedWFErrorList = true;
    //          }
    //        }
    //       })
    //  })
  }

  public dialogOpen = (): void => {
    document.getElementById('ejsDiaglog').style.display = 'none';
  }

  //method called while closing the dialogue fo the actions
  public dialogCloseLink = (): void => {
    document.getElementById('ejsDiaglog').style.display = '';
  }
  //method called while opening the dialogue fo the actions
  public dialogOpenLink = (): void => {
    document.getElementById('ejsDiaglog').style.display = 'none';
  }
  public ConfirmdlgButtons: ButtonPropsModel[] = [
    { click: this.closeConfirmDialog.bind(this), buttonModel: { content: 'No' } },
    { click: this.onNodeDelete.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }    
  ];

  public confirmDlgYesBtnClick = (): void => { 
    if (this.arrangeFlag == "arrange") {
      this.diagram.layout = {
        type: 'HierarchicalTree',
        bounds: new Rect(0, 0, 500, 500),
        horizontalSpacing: 50,
        verticalSpacing: 100,
        horizontalAlignment: 'Left',
        verticalAlignment: 'Top'
        
      }
      for (let i: number = 0; i < this.diagram.nodes.length; i++) {
        //
        //console.log("Node" + (i + 1) + ":" + "ID->" + this.diagram.nodes[i].id);
        //console.log("Node" + (i + 1) + ":" + "OffsetX->" + this.diagram.nodes[i].offsetX);
        //console.log("Node" + (i + 1) + ":" + "offsetY->" + this.diagram.nodes[i].offsetY);
        this.nodedata.offsetX = this.diagram.nodes[i].offsetX;
        this.nodedata.offsetY = this.diagram.nodes[i].offsetY;
        this.nodedata.NVarcharId = this.diagram.nodes[i].id;
        this.nodedata.WFLabel = this.configuringWFLabel;
        this.nodedata.WorkflowId = this.configuringWFId;
        this.data.UpdatePosition(this.nodedata).subscribe(
          (data: workflownodemodel) => {
            console.log(data);
            
          },
          (error: any) => console.log(error)
        );


      }
      this.diagram.doLayout();

    }
    else {
      this.Navigate();
    }
    this.confirmDialog.hide();
  }
  public confirmDlgBtnNoClick = (): void => {
    if (this.arrangeFlag == "arrange") {
      this.diagram.clear();
      this.GetNodes();
     // this.SaveDiagramJson(this.diagram.saveDiagram());
    }
    this.confirmDialog.hide();
    
    return;
  }

  //Confirmation dialogue button shown while deleting stpe
  public confirmDlgButtons2: ButtonPropsModel[] = [{ click: this.confirmDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmDlgYesBtnClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];
  //method call on the confirmation ok click to delete the node
  onNodeDelete() {
    
    if (this.IsNodeOrConnectorDelete == "nodedelete") {
      if (this.nodeid != undefined) {
        this.nodedata.NVarcharId = this.nodeid;
        this.nodedata.WorkflowId = this.configuringWFId;
        this.nodedata.ScopeEntityType = this.LoggedInScopeEntityType;
        this.nodedata.ScopeEntityId = this.LoggedInScopeEntityId;
        this.data.DeleteNodeData(this.nodedata).subscribe(
          (data: string) => {
            this.toasts[1].content = "Step deleted successfully";
            this.toastObj.show(this.toasts[1]);
            this.confirmationDialog.hide();
            window.location.reload();
            //this.diagram.dataBind();
          },
          (error: any) => console.log(error)
        );
      }
    }
    if (this.IsNodeOrConnectorDelete == "connectordelete") {
      this.data.DeleteLinkdata(this.connectorId).subscribe(
        (data: string) => {
          //this.toasts[1].content = data;
          //this.toastObj.show(this.toasts[1]);
          //window.location.reload();
          this.confirmationDialog.hide();
          //this.diagram.dataBind();
          window.location.reload();
        },
        (error: any) => console.log(error)
      );
    }

    this.confirmationDialog.hide();
  }

  //Navigation on Data form builder
  Navigate() {
    sessionStorage.setItem("IsAuth", "true");//This is to stop url tempering
    this.router.navigate([this.returnUrlForDataFields, 'Workflows', this.configuringFlexTableId]);
  }
  public confirmdialogClose = (): void => {
    document.getElementById('confirmDialog').style.display = 'none'
  }
  public expandMode: ExpandMode = 'Multiple';
  public palettes: PaletteModel[] = [
    {
      id: 'flow', expanded: true, title: 'Flow Shapes', symbols: [
        //{
        //  id: 'Terminator', addInfo: { tooltip: 'Terminator' }, width: 50, height: 60, shape: { type: 'Flow', shape: 'Terminator' }, style: { strokeWidth: 1 }, ports: [
        //    { offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
        //    { offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
        //    { offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
        //    { offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw }
        //  ]
        //},
        {
          id: 'Process', addInfo: { tooltip: 'Process' }, width: 50, height: 60, shape: { type: 'Flow', shape: 'Process' }, style: { strokeWidth: 1 }
          , ports: [
            { offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
            { offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
            { offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
            { offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw }
          ]
        },
        {
          id: 'Link21', type: 'Straight', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 60, y: 60 },
          targetDecorator: { shape: 'Arrow' }, style: { strokeWidth: 1 }
        },
        //{
        //  id: 'Decision', addInfo: { tooltip: 'Decision' }, width: 50, height: 50, shape: { type: 'Flow', shape: 'Decision' }, style: { strokeWidth: 1 }, ports: [
        //    { offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
        //    { offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
        //    { offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
        //    { offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw }
        //  ]
        //},
        //{
        //  id: 'Document', addInfo: { tooltip: 'Document' }, width: 50, height: 50, shape: { type: 'Flow', shape: 'Document' }, style: { strokeWidth: 1 }, ports: [
        //    { offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
        //    { offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
        //    { offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
        //    { offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw }
        //  ]
        //},
        //{
        //  id: 'Predefinedprocess', addInfo: { tooltip: 'Predefined process' }, width: 50, height: 50, shape: { type: 'Flow', shape: 'PreDefinedProcess' }, ports: [
        //    { offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
        //    { offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
        //    { offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
        //    { offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw }
        //  ], style: { strokeWidth: 1 }
        //},
        //{
        //  id: 'Data', addInfo: { tooltip: 'Data' }, width: 50, height: 50, shape: { type: 'Flow', shape: 'Data' }, ports: [
        //    { offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
        //    { offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
        //    { offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw },
        //    { offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Connect | PortVisibility.Hover, constraints: PortConstraints.Draw }
        //  ], style: { strokeWidth: 1 }
        //},
      ]
    },
    //{
    //  id: 'connectors', expanded: true, symbols: [
    //    {
    //      id: 'Link1', type: 'Orthogonal', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
    //      targetDecorator: { shape: 'Arrow' }, style: { strokeWidth: 1 }
    //    },
    //    //{
    //    //  id: 'Link2', type: 'Orthogonal', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 },
    //    //  targetDecorator: { shape: 'Arrow' }, style: { strokeWidth: 1, strokeDashArray: '4 4' }
    //    //},
    //    {
    //      id: 'Link21', type: 'Straight', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 60, y: 60 },
    //      targetDecorator: { shape: 'Arrow' }, style: { strokeWidth: 1 }
    //    },
    //    //{
    //    //  id: 'Link22', type: 'Straight', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 60, y: 60 },
    //    //  targetDecorator: { shape: 'Arrow' }, style: { strokeWidth: 1, strokeDashArray: '4 4' }
    //    //}
    //  ], title: 'Connectors'
    //}
  ];

  public nodeFromPalette: string;
  public linkFromPalette: string;
  public created(): void {
    if (Browser.isDevice) {
      this.diagram.fitToPage();
    }
  };

  public getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
    if (connector.id.indexOf("Link21") !== -1) {
      connector.type = 'Straight';
    } else if (connector.id.indexOf("Link22") !== -1) {
      connector.type = 'Straight';
    } else {
      connector.type = 'Orthogonal';
    }
    connector.style.strokeColor = '#717171';
    connector.sourceDecorator.style.strokeColor = '#717171';
    connector.targetDecorator.style.strokeColor = '#717171';
    connector.sourceDecorator.style.fill = '#717171';
    connector.targetDecorator.style.fill = '#717171';
    return connector;
  }

  public getSymbolInfo(symbol: NodeModel): SymbolInfo {
    return { tooltip: symbol.addInfo ? symbol.addInfo['tooltip'] : symbol.id };
  }

  public getNodeDefaults(node: NodeModel) {
    let obj: NodeModel = {};
    if (obj.width === undefined) {
      obj.width = 145;
    } else {
      let ratio: number = 100 / obj.width;
      obj.width = 100;
      obj.height *= ratio;
    }
    obj.style = { fill: '#357BD2', strokeColor: '#717171' };
    obj.annotations = [{ style: { color: 'white', fill: 'transparent' } }];
    obj.ports = getPorts(node);
    return obj;    
  }

  //Method called when dragging node or connector from pallete to diagram space
  public dragEnter(args: IDragEnterEventArgs): void {
    let obj: NodeModel = args.element as NodeModel;
    if (obj instanceof Node) {
      let oWidth: number = obj.width;
      let oHeight: number = obj.height;
      let ratio: number = 100 / obj.width;
      obj.width = 100;
      obj.height *= ratio;
      //obj.width = 145;
      //obj.height = 33.6;
      obj.offsetX += (obj.width - oWidth) / 2;
      obj.offsetY += (obj.height - oHeight) / 2;
      obj.style = { fill: '#357BD2', strokeColor: '#717171' };
      obj.annotations = [{ style: { color: 'white', fill: 'transparent' } }];
      obj.ports = getPorts(obj);
    }
  }

  //Method called while Dropping the symbol into diagram space
  public drop(args: IDropEventArgs): void {
    let obj = args.element;
    if (obj instanceof Node) {
      this.nodeFromPalette = obj.id;
      this.promptDialog.show();
      this.dialogOpen();
    } else if ((obj instanceof Connector)) {
      this.linkFromPalette = obj.id;
    }
  }
  
  public nodePropertiesChange() {
    
    if (this.nodeFromPalette !== '') {
      let obj: NodeModel = this.diagram.getObject(this.nodeFromPalette);
      let content = (document.getElementById('stepNameContent') as HTMLInputElement).value;
     
      this.contentnodename = content;
      if (content == '') {
        this.toastObj.timeOut = 0;
        this.toasts[2].content = "Step Name is mandatory.";
        this.toastObj.show(this.toasts[2]);
        return;
       // this.diagram.remove(obj);
      }
      else {
        obj.annotations[0].content = content;
        this.nodedata.Label = this.contentnodename.trim();//removing space from begining and end
        this.nodedata.NVarcharId = this.nodeid;
        this.nodedata.shapeName = this.nodeshape;
        this.nodedata.offsetX = obj.offsetX;
        this.nodedata.offsetY = obj.offsetY;
        this.nodedata.WorkflowId = this.configuringWFId;
        this.nodedata.IsReady = this.IsStepReady.checked;
        this.nodedata.IsMandatory = this.IsMandatory.checked;
        this.nodedata.ScopeEntityType = this.LoggedInScopeEntityType;
        this.nodedata.ScopeEntityId = this.LoggedInScopeEntityId;
        this.diagram.dataBind();

        setTimeout(() => {
          this.data.SaveNodedata(this.nodedata).subscribe(
            (data: number) => {
              //SG commnedted this code seems irrelevant as window is reloaded.
              //this.getComponentsCounts();
              //if (obj instanceof Connector) {
              //  obj.annotations[0].margin.bottom = 20;
              //  this.diagram.dataBind();
              //  (document.getElementById('stepNameContent') as HTMLInputElement).value = "";
              //}
              window.location.reload();
            },
            (error: any) => console.log(error)
          );
        }, 3000);

      }

      
    }
    this.promptDialog.hide();
    
  }


  

  public closeConfirmDialog() {
    this.confirmationDialog.hide();
    window.location.reload();
  }

  public closeDialogButton() {
    if (this.nodeFromPalette !== '') {
      let obj = this.diagram.getObject(this.nodeFromPalette);
      this.diagram.remove(obj);
    }
    this.promptDialog.hide();
    this.confirmationDialog.hide();
  }

  public closeDialogButtonlnk() {
    if (this.linkFromPalette !== '') {
      let obj = this.diagram.getObject(this.linkFromPalette);
      this.diagram.remove(obj);
    }
    this.promptDialogActions.hide();
  }

  //Defines the properies of nodes symbols
  public getSymbolNodeDefaults(symbol: NodeModel): void {
    symbol.annotations = [{ style: { color: 'black', fill: 'transparent' } }];
  }
  //Defines the properies of connectors symbols
  public getSymbolConnectorDefaults(symbol: ConnectorModel): void {
    symbol.annotations = [{ style: { color: 'black', fill: 'transparent' } }];
  }
  public dlgButtons: ButtonPropsModel[] = [{ buttonModel: { content: 'Add', isPrimary: true } }];
  //below code is to show context menu
  
  
  public isFieldValid(field: string) {
    return !this.createactionform.get(field).valid && (this.createactionform.get(field).dirty || this.createactionform.get(field).touched);
  }

  constructor(private _Branchservice: BranchService, private data: WorkflowdesignerService,
    private _StepActionService: StepActionsService, private route: ActivatedRoute,  @Inject(FormBuilder) private builder: FormBuilder, private router: Router) {
    this.LoggedInScopeEntityType = sessionStorage.getItem("LoggedInScopeEntityType");
    this.LoggedInScopeEntityId = +sessionStorage.getItem("LoggedInScopeEntityId");
    this.createactionform = new FormGroup({
      ActionIcon: new FormControl('', [Validators.required]),
      ActionName: new FormControl('', [Validators.required,Validators.maxLength(255)])
    });    
  }

  ngOnInit() {
    this.filterSettings = { type: 'CheckBox' }; // inorder to remove extra filtering from the grid we set it to this type.
    //getting the id from the url
    this.route.params.subscribe((params: Params) => {
      let id = parseInt(params['Id']);
      let flexid = parseInt(params['FlexTableId']);
      let workflowlabel = (params['UILabel']);
      //this.configuringWFStatus = (params['WFStatus']);
      //this.configuringWFStatus = (params['WFStatus']);
      this.configuringWFId = id;
      this.configuringFlexTableId = flexid;
      this.configuringWFLabel = workflowlabel;
      this.data.getStatusByWFId(this.configuringWFId).subscribe(
        (data: any) => {
          this.configuringWFStatus = data;
          this.value = this.configuringWFStatus;
          if (this.value == "Beta") {
            this.statusvalue = 1;
          }
          if (this.value == "Live") {
            this.statusvalue = 2;
          }
          if (this.value == "Offline") {
            this.statusvalue = 0;
          }
        },
        (error: any) => console.log(error)
      );
    });
    this.manageactiononParticipant = false;
    this.returnUrlForDataFields = '/flexwf/form-labels';
    this.sessionprojectid = sessionStorage.getItem("ProjectId");
    this.projectId = +this.sessionprojectid; // conversion from string to int
    this.toolbar = ['ExcelExport', 'PdfExport', 'CsvExport', 'Search'];//toolbar options need to show in grid
    this.lines = 'Both';//indicated both the lines in grid(horizontal and vertical)
    this.ShowActionUpdateBtn = false;
    this.ShowActionCreateBtn = true;
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };//it openeds the dialogue while doing ADD, EDIT, DELETE
     // due to synchronization issue shifted in ngAfterViewInit
    //this.GetNodes();
    //this.LoadDiagram(); //this method



  }
  //method called on saving of the action
  onFormSubmit() {
    
    this.submitted = true;
    if (this.createactionform.invalid) {
      return;
    }
    else {
      this.NextStepmodel.ActionLabel = this.createactionform.get('ActionName').value;
      this.NextStepmodel.ActionIconId = this.createactionform.get('ActionIcon').value;
      this.NextStepmodel.StepName = this.sourcenodetext;
      this.NextStepmodel.NextStepName = this.destinationnodetext;
      this.NextStepmodel.ConnectorId = this.connectorId;
      this.NextStepmodel.NVarcharStepId = this.connectordata.sourceID;
      this.NextStepmodel.NVarcharNextStepId = this.connectordata.targetID;
      this.NextStepmodel.NextStepId = this.destinationnodeintid;
      this.NextStepmodel.StepId = this.sourcenodeintid;
      console.log(this.NextStepmodel);
      this.data.SaveLinkdata(this.NextStepmodel).subscribe(
        (data: NextStepmodel) => {
          if (this.createactionform.invalid) {
            return;
          }
          else {
            if (data.ParameterCarrier == "branch= ") {
              this.configuringNvarcharStepId = this.NextStepmodel.NVarcharStepId;
              this.configuringNextStepNvarcharId = this.NextStepmodel.NVarcharNextStepId;
              this.configuringStepActionId = data.StepActionId;
              this.showBranch = true;
              this.promptDialogActions.hide();
              document.getElementById('promptDialogActions').style.display = 'none'
            }
            else if (data.ParameterCarrier == "Successfully linked the given steps") {
              window.location.reload();
            }
            else if (data.ParameterCarrier == "Successfully linked with updated branch condition") {
              window.location.reload();
            }
            this.getComponentsCounts();
          }
        },
        (error: any) => console.log(error)
      );
    }
  }
 
  public getComponentsCounts() {
    
    this.data.getWFComponentsCounts(this.configuringWFId, this.configuringFlexTableId).subscribe(
      (data: any) => {
        document.getElementById('countSteps').innerHTML = data[0].StepCount;
        this.Step_count = data[0].StepCount;
        document.getElementById('countDataFields').innerHTML = '(' + data[0].DataFieldCount + ')';
        this.DataField_count = data[0].DataFieldCount;
        document.getElementById('countLandingPages').innerHTML = '(' + data[0].LandingPageCount + ')';
        this.LandingPage_count = data[0].LandingPageCount;
        document.getElementById('countActions').innerHTML = '(' + data[0].ActionCount + ')';
        this.Action_count = data[0].ActionCount;
        document.getElementById('countNotifications').innerHTML = '(' + data[0].NotificationCount + ')';
        this.Notification_count = data[0].NotificationCount;
        document.getElementById('countSubProcesses').innerHTML = '(' + data[0].SubProcessCount + ')';
        this.SubProcess_count = data[0].SubProcessCount;
        document.getElementById('countValidations').innerHTML = '(' + data[0].ValidationCount + ')';
        this.Validation_count = data[0].ValidationCount;
        this._Branchservice.fnGetBranchesData(this.configuringWFId, 0)
          .subscribe(
            data => {
              document.getElementById('Branches1').innerHTML = '(' + data.length + ')';
              this.Branch_count = data.length;
            }
        );
        
        
      },
      (error: any) => console.log(error)
    );
    
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getComponentsCounts();
      // due to synchronization issue shifted here from ngOnInit
      this.GetNodes();
    })
    
  }

  

  dialogClose() {
    document.getElementById('ejsDiaglog').style.display = '';
    this.showstepcol = false;
  }  

 
 
  GetNodes() {
    
    this.data.getactionicondata(this.configuringWFId).subscribe(
      (data: any) => {
        this.IconsData = data;
      },
      (error: any) => console.log(error)
    );
    const callback: Ajax = new Ajax(
      this.baseUrl + '/WorkflowDesigner/GetWFNodes?WorkflowId=' + this.configuringWFId, 'GET', false, 'application/json; charset=utf-8'
    );
    callback.onSuccess = (JsonString: any): void => {
      let diagramInstance = this;
      setTimeout(function () {
        //get a diagram node from database 
        let parsedData = JSON.parse(JsonString);
       

        if (parsedData.length > 0) {
          //iterate a  node data 
          for (let i = 0; i < parsedData.length; i++) {
            //create a node 
            let node: NodeModel = {
              id: parsedData[i].nodeId, offsetX: parsedData[i].offsetX, offsetY: parsedData[i].offsetY,
              annotations: [{ content: parsedData[i].annotation }],
              shape: { type: parsedData[i].shapeType, shape: parsedData[i].shapeName }
            }
            node.backgroundColor = "red";
            //add a node in the diagram dynamically using add method.
            diagramInstance.diagram.add(node);

          }
        }
      }, 100)
    };
    callback.send().then();
    
    this.GetConnectors();
  }

  GetConnectors() {
    const getconnectors: Ajax = new Ajax(
      this.baseUrl + '/WorkflowDesigner/GetWFConnectors?WorkflowId=' + this.configuringWFId + '&ProjectId=' + this.projectId, 'GET', false, 'application/json; charset=utf-8'
    );
    getconnectors.onSuccess = (JsonString: any): void => {
      let diagramInstance = this;
      setTimeout(function () {
        //get a diagram node from database 
        let parsedData = JSON.parse(JsonString);
        //console.log(JsonString);
        if (parsedData.length > 0) {
          //iterate a  node data 
          for (let i = 0; i < parsedData.length; i++) {
            //create a node 
            let conn: ConnectorModel = {
              id: parsedData[i].connectorId, sourceID: parsedData[i].sourceID, targetID: parsedData[i].targetID, annotations: [{ content: parsedData[i].annotation, style: { fill: "white" } }]

            }
            //console.log(node)
            //add a node in the diagram dynamically using add method. 
            diagramInstance.diagram.add(conn);

          }
        }
      }, 100)
    };
    getconnectors.send().then();
  }

  public IsReady: boolean;
  public MandatoryFlag: boolean;
  GetIdFromNVarchar(NvarcharStepId) {
    const callback: Ajax = new Ajax(
      this.baseUrl + '/WorkflowDesigner/GetStepDetailfromNVarcharId?WorkflowId=' + this.configuringWFId + '&Nvarcharid=' + NvarcharStepId, 'GET', false, 'application/json; charset=utf-8'
    );
    callback.onSuccess = (data: any): void => {
      let stepdata = JSON.parse(data);
      this.configuringstepid = stepdata.Id;
      this.configuringstepname = stepdata.Label;
      this.IsReady = stepdata.IsReady;
      this.MandatoryFlag = stepdata.IsMandatory;
    };
    callback.send().then();
  }

  PostStepColumnEvent() {
    this.showstepcol = false;
  }
  

  PostValidationEvent() {
    this.ShowValidatedWFErrorList = false;
  }

  PostMatrixEvent() {
    this.ShowStepActionPartcipant = false;
  }

  PostBranchEvent() {
    this.showBranch = false;
  }

  public contextMenu: ContextMenuSettingsModel = {
    show: true, items: [
      {
        text: 'Manage Landing Page', id: 'MLP',
      },
      {
        text: 'Manage Actions/Participants', id: 'MAP',
      },
      {
        text: 'Manage Branch Conditions', id: 'MBC'
      },
      {
        text: 'Manage Sub Processes', id: 'MSP'
      },
      {
        text: 'Mark as Ready', id: 'MR',
      },
      {
        text: 'UnMark as Ready', id: 'UR'
      },
      {
        text: 'Mark as Mandatory', id: 'MM'
      },
      {
        text: 'Mark as Optional', id: 'MO'
      }
    ],
    showCustomMenuOnly: true,
  }


  //function it will open the context menu only at the node level
  public contextMenuOpen(args: DiagramBeforeMenuOpenEventArgs): void {
    
    //to get a node 
    let selectedNode: NodeModel = this.diagram.selectedItems.nodes[0];
    //to get a connector 
    //let selectedConnector: ConnectorModel = this.diagram.selectedItems.connectors[0];
    if (selectedNode && selectedNode.annotations && selectedNode.annotations.length > 0) {
      //get a node annotation object
      let label = selectedNode.annotations[0];
    }
    if (!(selectedNode)) {
      //cancel a event if it is a diagram. 
      args.cancel = true;
    }
    this.GetIdFromNVarchar(selectedNode.id);

    //If Step is not ready then show context menu 'Marked as Ready' else show 'UnMarked as Ready'
    if (!this.IsReady) {
      for (let item of args.items) {
        if (item.text === 'Mark as Ready') {
          document.getElementById(item.id).style.display = "block";
        }

        if (item.text === 'UnMark as Ready') {
          document.getElementById(item.id).style.display = "none";
        }
      }
    }
    else {
      for (let item of args.items) {
        if (item.text === 'Mark as Ready') {
          document.getElementById(item.id).style.display = "none";
        }
        if (item.text === 'UnMark as Ready') {
          document.getElementById(item.id).style.display = "block";
        }
      }
    }
    
    //If Step is Mandatory then show "Mark Step optional" else make step "mark step Mandatory"
    if (!this.MandatoryFlag) {
      for (let item of args.items) {
        if (item.text === 'Mark as Mandatory') {
          document.getElementById(item.id).style.display = "block";
        }

        if (item.text === 'Mark as Optional') {
          document.getElementById(item.id).style.display = "none";
        }
      }
    }
    else {
      for (let item of args.items) {
        if (item.text === 'Mark as Mandatory') {
          document.getElementById(item.id).style.display = "none";
        }
        if (item.text === 'Mark as Optional') {
          document.getElementById(item.id).style.display = "block";
        }
      }
    }




    this.data.getBranchCount(this.configuringstepid, this.configuringWFId).subscribe(
      (data: any) => {
        if (data.length == 0) {
          for (let item of args.items) {
            if (item.text === 'Manage Branch Conditions') {
              if (data.length == 0) {
                //args.hiddenItems.push(item.id);
                document.getElementById(item.id).style.display = "none";
              }
            }
          }
        }
        else {
          for (let item of args.items) {
            if (item.text === 'Manage Branch Conditions') {
              if (data.length != 0) {
                //args.hiddenItems.push(item.id);
                document.getElementById(item.id).style.display = "block"
              }
            }
          }
        }
      },
      (error: any) => console.log(error)
    );
  }


  public contextMenuClick(args: MenuEventArgs): void {
    let selectedNode: NodeModel = this.diagram.selectedItems.nodes[0];
    //to get a connector 
    //let selectedConnector: ConnectorModel = this.diagram.selectedItems.connectors[0];
    //this.parentMessage = selectedNode.id;
    this.GetIdFromNVarchar(selectedNode.id);
    let setReadyFlag; 
    if (args.element.id == "MLP") {
      this.level = "steplevel";
      this.data.GetDataFieldsCount('FlexTables',this.configuringFlexTableId).subscribe(
        (data: number) => {
          if (data > 0) {
              this.showstepcol = true;
          }
          else {
            this.cnfmContent = "Landing page would require data fields to be configured first. Do you want to configure now?"
            this.confirmDialog.show()
            return;
          }
        },        
        (error: any) => console.log(error)
      );      
    }

    
    if (args.element.id == "MAP") {
      this.level = "steplevel";
      this.ShowStepActionPartcipant = true;
    }

    if (args.element.id == "MBC") {
      this.level = "steplevel";
      this.showBranchCondition = true;
    }

    if (args.element.id == "MR") {
      this.level = "steplevel";
      setReadyFlag = true;
      this.UpdateReadyForStep(setReadyFlag);
    }

    if (args.element.id == "UR") {
      this.level = "steplevel";
      setReadyFlag = false;
      this.UpdateReadyForStep(setReadyFlag);
    }
    if (args.element.id == "MSP") {
      this.level = "steplevel";
      this.showSubProcessPopUp = true;
    }
    if (args.element.id == "MM") {
      this.level = "steplevel";
      this.UpdateMandatoryFlagForStep(true);
    }
    if (args.element.id == "MO") {
      this.level = "steplevel";
      this.UpdateMandatoryFlagForStep(false);
    }
  }

  public UpdateMandatoryFlagForStep(MandatoryFlag) {
    this.data.UpdateMandatoryFlagForStep(this.configuringstepid, MandatoryFlag).subscribe(
      (data: any) => {
        this.toastObj.timeOut = 4000;
        if (data == null) {
          if (MandatoryFlag) {
            this.toasts[1].content = "This step is now marked as 'Mandatory'.This step can not be skipped.";
          }
          else {
            this.toasts[1].content = "Step is not mandatory anymore. So this step can be skipped while approving the transaction.";
          }

          this.toastObj.show(this.toasts[1]);
          setTimeout(() => { window.location.reload(); }, 4000);
        }
      },
      (error: any) => console.log(error)
    );
  }

  public UpdateReadyForStep(ReadyFlag) {
    this.data.UpdateReadyForStep(this.configuringstepid, ReadyFlag).subscribe(
      (data: any) => {
        this.toastObj.timeOut = 4000;
        if (data == null) {
          if (ReadyFlag) {
            this.toasts[1].content = "This step is now marked as 'Ready'.All transactions that are on this step will be available in dropdowns and exported to other systems.";
          }
          else {
            this.toasts[1].content = "Step is not ready anymore. So transactions that are on this step will not be available in dropdowns and exported to other systems.";
          }
        
          this.toastObj.show(this.toasts[1]);
          setTimeout(() => { window.location.reload(); }, 4000);
        }
      },
      (error: any) => console.log(error)
    );
  }


  //public animationSettings: Object = { effect: 'Zoom', duration: 400, delay: 0 };
  public connDefaults(obj: Connector): void {
    if (obj.id.indexOf('connector') !== -1) {
      obj.type = 'Orthogonal';
      obj.targetDecorator = { shape: 'Arrow', width: 10, height: 10 };
    }
  }
  
  public doubleClick(args: Object) {
    if (true) {
      if (args['source'].propName == "nodes") {
        this.selectednodeid = args['source'].id;
        this.selectednodeoffsetX = args['source'].offsetX;
        this.selectednodeoffsetY = args['source'].offsetY;        
      }
      if (args['source'].propName == "connectors") {
        this.NextStepmodel.NVarcharStepId = args['source'].sourceID;
        this.NextStepmodel.NVarcharNextStepId = args['source'].targetID;
        this.NextStepmodel.ConnectorId = args['source'].id;
        this.eventonlink = "update";
        this.ShowActionUpdateBtn = true;
        this.ShowActionCreateBtn = false;
        this.GetSourceDestinationFromNVarchar(this.NextStepmodel.NVarcharStepId, "source");
        this.GetSourceDestinationFromNVarchar(this.NextStepmodel.NVarcharNextStepId, "destination");
     
      }
    }
  }

  public LoadDiagram() {
    this.data.GetDiagramState(this.configuringWFId).subscribe(
      (data: flexworkflowmodel) => {
        this.diagram.loadDiagram(data.DiagramJson);
      },
      (error: any) => console.log(error)
    );

  }

  public diagramStateData: string;
  public SaveDiagramJson(data: string) {
    this.wfmodel.DiagramJson = data;
    this.wfmodel.Id = this.configuringWFId;
    this.wfmodel.ScopeEntityType = this.LoggedInScopeEntityType;
    this.wfmodel.ScopeEntityId = this.LoggedInScopeEntityId;
    localStorage.setItem('fileName', data);
    this.data.SaveDiagramState(this.wfmodel).subscribe(
      (data: any) => {
      },
      (error: any) => console.log(error)
    );
  }
 
  click(args: IClickEventArgs) {
    let objclick = args.element;
    if (objclick instanceof Node) {
      //this.selectednodeid = args.id;
    }
    else if (objclick instanceof Connector) {
      //this.selectedconnectorid = objclick.id;

    }
  }
  rowSelected(e) { 
    this.NextStepmodel.ActionIconId = e.data.IconId;
    if (this.eventonlink == "update") {
      this.data.GetConnectorById(this.connectorupdateid)
        .subscribe(
          (data: StepActionLabelmodel) => {
            this.NextStepmodel.ActionLabel = data[0].Label; //old label            
            this.NextStepmodel.ConnectorId = this.connectorupdateid;            
            let newtext = e.data.Label;//new label           
            this.data.UpdateLinkdata(this.NextStepmodel, newtext, this.NextStepmodel.ActionIconId).subscribe(
              (data: NextStepmodel) => {
                if (data.ParameterCarrier == "branch= ") {
                  this.configuringNvarcharStepId = this.NextStepmodel.NVarcharStepId;
                  this.configuringNextStepNvarcharId = this.NextStepmodel.NVarcharNextStepId;
                  this.configuringStepActionId = data.StepActionId;
                  this.showBranch = true;
                  this.promptDialogActions.hide();
                  document.getElementById('promptDialogActions').style.display = 'none'
                  //window.location.reload();
                }
                else if (data.ParameterCarrier == "Successfully linked the given steps") {
                  window.location.reload();
                }
                else if (data.ParameterCarrier == "Successfully linked with updated branch condition") {
                  window.location.reload();
                }

              })
          });
    }

    else {
      this.NextStepmodel.ActionLabel = e.data.Label;
      this.NextStepmodel.ActionIconId = e.data.IconId;
      this.NextStepmodel.StepName = this.sourcenodetext;
      this.NextStepmodel.NextStepName = this.destinationnodetext;
      this.NextStepmodel.ConnectorId = this.connectorId;
      this.NextStepmodel.NVarcharStepId = this.connectordata.sourceID;
      this.NextStepmodel.NVarcharNextStepId = this.connectordata.targetID;
      this.NextStepmodel.NextStepId = this.destinationnodeintid;
      this.NextStepmodel.StepId = this.sourcenodeintid;
      this.data.SaveLinkdata(this.NextStepmodel).subscribe(
        (data: NextStepmodel) => {
          if (data.ParameterCarrier) {
            this.actionNameforBranching = this.NextStepmodel.ActionLabel;
            if (data.ParameterCarrier == "branch= ") {
              this.configuringNvarcharStepId = this.NextStepmodel.NVarcharStepId;
              this.configuringNextStepNvarcharId = this.NextStepmodel.NVarcharNextStepId;
              this.configuringStepActionId = data.StepActionId;
              this.showBranch = true;
              this.promptDialogActions.hide();
              document.getElementById('promptDialogActions').style.display = 'none'
            }
            else if (data.ParameterCarrier == "Successfully linked the given steps") {
              window.location.reload();
            }
            else if (data.ParameterCarrier == "Successfully linked with updated branch condition") {
              window.location.reload();
            }
          }
        },
        (error: any) => console.log(error)

      );
    }


  }
  public positionChange(args: IDraggingEventArgs): void {
    if (args.state === 'Completed') {
      if (args.source['propName'] == "nodes") {
        this.nodedata.offsetX = +args.newValue.offsetX;
        this.nodedata.offsetY = +args.newValue.offsetY;
        this.nodedata.NVarcharId = args.source['properties'].id;
        this.nodedata.WFLabel = this.configuringWFLabel;
        this.nodedata.WorkflowId = this.configuringWFId;
        this.nodedata.ScopeEntityType = this.LoggedInScopeEntityType;
        this.nodedata.ScopeEntityId = this.LoggedInScopeEntityId;
        this.data.UpdatePosition(this.nodedata).subscribe(
          (data: workflownodemodel) => {
            console.log(data);
          },
          (error: any) => console.log(error)
        );
      }
    }
  }
 
  GetSourceDestinationFromNVarchar(NvarcharStepId, type) {
    const callback: Ajax = new Ajax(
      this.baseUrl + '/WorkflowDesigner/GetStepDetailfromNVarcharId?WorkflowId=' + this.configuringWFId + '&Nvarcharid=' + NvarcharStepId, 'GET', false, 'application/json; charset=utf-8'
    );
    callback.onSuccess = (data: any): void => {
      let stepdata = JSON.parse(data);
      if (type == "source") {
        this.sourcenodetext = stepdata.Label;
        this.sourcenodeintid = stepdata.Id;
      }
      else {
        this.destinationnodetext = stepdata.Label;
        this.destinationnodeintid = stepdata.Id;
      }
      this.data.getexistingaction(this.sourcenodeintid)
        .subscribe(
          data => {
            this.existingactiondata = (data);
          }
      );

      if (this.eventonlink =="update") {
        this.connectorupdateid = this.NextStepmodel.ConnectorId;
        //this.data.GetByConnectorId(this.NextStepmodel.ConnectorId)
        //  .subscribe(
        //    (data: StepActionLabelmodel) => {
        //      this.ActionForEdit = data[0].Label;
        //      this.NextStepmodel.ActionLabel = data[0].Label;
        //      this.NextStepmodel.ActionIconId = data[0].ActionIconId;

        //      this.createactionform.patchValue({
        //        ActionName: data[0].Label,
        //        ActionIcon: data[0].Icon
        //      });
        //    });

        this.promptDialogActions.show();
        this.dialogOpen();
        this.NextStepmodel.ActionLabel = this.createactionform.get('ActionName').value;
        this.NextStepmodel.StepName = this.sourcenodetext;
        this.NextStepmodel.NextStepName = this.destinationnodetext;
        this.NextStepmodel.NextStepId = this.destinationnodeintid;
        this.NextStepmodel.StepId = this.sourcenodeintid
        var newtext = this.createactionform.get('ActionName').value;
       // alert(this.NextStepmodel.ActionIconId);
        
      }
      else {
        this.promptDialogActions.show();
        this.dialogOpen();
      }
      
    };
    callback.send().then();
  }

  UpdateAction() {    
    if (this.createactionform.invalid) {
      return;
    }
    else {
      this.NextStepmodel.ActionLabel = this.createactionform.get('ActionName').value;
      this.data.UpdateLinkdata(this.NextStepmodel, this.createactionform.get('ActionName').value, this.NextStepmodel.ActionIconId).subscribe(
        (data: NextStepmodel) => {
          this.toastObj.timeOut = 2000;
          this.toasts[1].content = "Action updated successfully";
          this.toastObj.show(this.toasts[1]);
          setTimeout(() => { window.location.reload(); }, 2000);
        })
    }    
  }

  public focusOut(args: TextBox): void {
    if (this.ActionForEdit != args.value) {
      this._StepActionService.GetStepActionLabelStatusInWorkFlow(this.configuringWFId, args.value).subscribe(
        (data: any) => {          
          if (data > 0) {
            this.toasts[0].content = "Cannot use '" + args.value + "' label as it is already used in this workflow or it is reserved label for an out of the box action";
            this.createactionform.patchValue({
              ActionName: ""              
            });
            this.toastObj.show(this.toasts[0]);
            return;
          }
          else {
            this.createactionform.patchValue({
              ActionName: args.value
            });
          }
        });
    }
  }

  public Iconchange(args: any): void {
    this.NextStepmodel.ActionIconId = args.itemData.Id;
    this.showIconImage = true;
    var htmlSTring = "";
    var path = "./assets/flex-images/"
    htmlSTring += '<div><img src="' + path + args.itemData.IconText + ".png" + '"/></div>';
    document.getElementById('icon-image').innerHTML = htmlSTring;
  }

    connectionChange(args: IConnectionChangeEventArgs) {
    if (args.state == "Changed") {
      if (args.connector.sourceID != "" && args.connector.targetID != "") {
        this.connectordata.sourceID = args.connector.sourceID;
        this.connectordata.targetID = args.connector.targetID;
        this.connectordata.connectorId = this.connectorId;
        this.GetSourceDestinationFromNVarchar(this.connectordata.sourceID, "source");
        this.GetSourceDestinationFromNVarchar(this.connectordata.targetID, "destination");
        //this.sourcenodetext = this.connectordata.sourceID;

      }
    }

  }

  //when ever new item gets added into the diagram panel then this event fires
  collectionChange(args: ICollectionChangeEventArgs) {
    if (args.state === 'Changed' && args.type === "Addition") {
      let changedobj = args.element;
      //if (changedobj instanceof Node) {
      if (changedobj.shape.type == 'Flow') {
        this.nodeid = args.element.id;
        this.nodeshape = ((args.element.shape as FlowShapeModel).shape);
      }
      else {
        this.connectorId = args.element.id;
        //alert(this.connectorId);

      }
    }
    else if (args.state === 'Changed' && args.type === "Removal") {
      let deletedobj = args.element;
      if (deletedobj instanceof Node) {
        this.IsNodeOrConnectorDelete = "nodedelete";
        this.selectednodeid = this.selectednodeid;
        this.showconfirmpopup = true;
      }
      else {
        this.IsNodeOrConnectorDelete = "connectordelete";
        this.connectordata.connectorId = this.selectedconnectorid;
        this.showconfirmpopup = true;
      }
    }
  }

  textEdit(args: ITextEditEventArgs) {
    if (this.selectednodeid != undefined) {
      this.nodedata.Label = args.newValue;
      this.nodedata.NVarcharId = this.selectednodeid;
      this.nodedata.WorkflowId = this.configuringWFId;
      this.nodedata.offsetX = this.selectednodeoffsetX;
      this.nodedata.offsetY = this.selectednodeoffsetY;
      this.nodedata.ScopeEntityType = this.LoggedInScopeEntityType;
      this.nodedata.ScopeEntityId = this.LoggedInScopeEntityId;
      //shape is not required in updation

      this.data.UpdateNodedata(this.nodedata).subscribe(
        (data: string) => {
          this.toasts[1].content = data;
          this.toastObj.show(this.toasts[1]);
        },
        (error: any) => console.log(error)
      );
    }

    
  }

  //SymbolPalette Properties
  public symbolMargin: MarginModel = { left: 15, right: 15, top: 15, bottom: 15 };
  
  
  
  public diagramCreate(args: Object): void {
    paletteIconClick();
  }

  //Functions called on the links at the Workflow level
  public fnOpenManageLandingPage() {
    this.level = "workflowlevel";    
    this.data.GetDataFieldsCount('FlexTables',this.configuringFlexTableId).subscribe(
      (data: number) => {
        if (data > 0) {         
         this.showstepcol = true;
        }
        else {
          this.cnfmContent = "Landing page would require data fields to be configured first. Do you want to configure now?"
          this.confirmDialog.show()
          return;
        }
      },
      (error: any) => console.log(error)
    );
  }

  
  public fnOpenValidationPage() {
    this.level = "workflowlevel";
    
    this.showValidationPage = true;
  }


  public fnOpenManageParticipantsPage() {
    this.level = "workflowlevel";
    this.manageactiononParticipant = false
    this.showmanageparticipants = true;
  }

  public fnOpenManageActionsParticipantsPage() {
    this.level = "workflowlevel";
    this.manageactiononParticipant = false
    this.ShowStepActionPartcipant = true;
  }

  public fnOpenManageWFActionsPage() {
    this.level = "workflowlevel";
    this.showWFActions = true;
  }

  public fnOpenBranchConditionsPage() {
    this.level = "workflowlevel";
    this.showBranchCondition = true;
  }
  showSubProcessPopUp: Boolean = false;
  public fnOpenSubProcesses() {
    this.level = "workflowlevel";
    this.showSubProcessPopUp = true;
  }

  
}

//from the following lines of code it shows the ports on the node while we use connectors to connect to nodes
function getPorts(obj: NodeModel): PointPortModel[] {
  let ports: PointPortModel[] = [
    { id: 'port1', shape: 'Circle', offset: { x: 0, y: 0.5 } },
    { id: 'port2', shape: 'Circle', offset: { x: 0.5, y: 1 } },
    { id: 'port3', shape: 'Circle', offset: { x: 1, y: 0.5 } },
    { id: 'port4', shape: 'Circle', offset: { x: 0.5, y: 0 } }
  ];
  return ports;
}


//********************************************************poc work******************************************************************************************
//public dragEnter(args: IDragEnterEventArgs): void {
  //  let obj: NodeModel = args.element as NodeModel;

  //  if (obj instanceof Node) {
  //    let oWidth: number = obj.width;
  //    let oHeight: number = obj.height;
  //    let ratio: number = 100 / obj.width;
  //    obj.width = 100;
  //    obj.height *= ratio;
  //    obj.offsetX += (obj.width - oWidth) / 2;
  //    obj.offsetY += (obj.height - oHeight) / 2;
  //    obj.style = { fill: '#357BD2', strokeColor: 'white' };

  //  }
  //}

//  Diagram1.Model.TextChange = "Textchanging";

  //  function Textchanging() {

  //}


  //public onClick(event: NodeClickEventArgs): void {

  //  alert("clicked");
  //  console.log(event);
  //  //if (event.elementType === "node") {
  //  //  //$("#basicDialog").ejDialog("open");
  //  //  alert(event.element.name);
  //  //  //document.getElementById("text").innerHTML = event.element.name;
  //  //}
  //}

  //click(args: NodeSelectEventArgs) {
  //  console.log(args.element.name)
  //  //console.log(args.element)
  //  //console.log(args.element.actualObject)
  //  //console.log(args.element.properties.id);

  //  //if (args.event.elementType === "node") {
  //  //  //$("#basicDialog").ejDialog("open");
  //  //  //document.getElementById("text").innerHTML = args.event.element.name;
  //  //} 
  //}

