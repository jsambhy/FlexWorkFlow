
import { ViewChild, Component, Input, Output, EventEmitter } from '@angular/core';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { GridLine, FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
import {
  GridComponent, ToolbarService, EditService, PageService, ExcelExportService,
  PdfExportService, FreezeService,  ContextMenuService,  ToolbarItems
} from '@syncfusion/ej2-angular-grids';
import { WFValidationmodel } from '../../../models/workflow-validation-model';
import { WFValidationService } from '../../../services/workflow-validation.service';
import { flexworkflowmodel } from '../../../models/flex-workflows-model';

@Component({
    selector: 'app-workflow-validation',
    templateUrl: './workflow-validation.component.html',
  styleUrls: ['./workflow-validation.component.css'],
  providers: [WFValidationService,ToolbarService, EditService, PageService, ExcelExportService, PdfExportService, FreezeService, ContextMenuService]
})
/** workflow-validation component*/
export class WorkflowValidationComponent {
// getting parent from component message
  @Input() configuringWFId: number; 
  @Input() Project_Name: string;
  @Input() configuringWFLabel: string;

  //initializing the variables
  public lines: GridLine;
  public skillset: string[];
  public toolbar: ToolbarItems[] | object;
  public editSettings: Object;
  public ValidatedWFdata: WFValidationmodel[];
  public wfmodel: flexworkflowmodel = new flexworkflowmodel();
  filterSettings: FilterSettingsModel;
  @ViewChild('validationDetailgrid', { static: false }) public validationDetailgrid: GridComponent;
  @ViewChild('WFValidationDialogue', { static: false }) public WFValidationDialogue: DialogComponent;

  constructor(private _ValidationService: WFValidationService) {}
  ngOnInit() {
    this.lines = 'Both';
    this.filterSettings = { type: 'CheckBox' }; // inorder to remove extra filtering from the grid we set it to this type.
    this.toolbar = ['ExcelExport', 'PdfExport', 'CsvExport', 'Search'];
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    this.wfmodel.Name = this.configuringWFLabel;
    this.wfmodel.Id = this.configuringWFId;
    this.wfmodel.ProjectName = this.Project_Name;
    //method to get the list of error in workflow after validation
    this._ValidationService.getErrorListAfterValidation(this.wfmodel).subscribe(
      (data: any) => {
        this.ValidatedWFdata = data;
      })
  }

  closePopUp() {
    this.WFValidationDialogue.hide();
    window.location.reload();
  }
  closeDialog() {
    window.location.reload();
  }
  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'validationDetailgrid_pdfexport') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
     
      this.validationDetailgrid.pdfExport();
    }
    if (args.item.id === 'validationDetailgrid_excelexport') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      
      this.validationDetailgrid.excelExport();
    }
    if (args.item.id === 'validationDetailgrid_csvexport') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
     
      this.validationDetailgrid.csvExport();
    }
  }
  dialogClose() {
    this.PostValidationEvent.emit();
  }
  @Output() PostValidationEvent = new EventEmitter();
}



