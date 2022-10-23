import { Component, Inject, ViewChild} from '@angular/core';

import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { GridLine, GridComponent, ToolbarItems, ToolbarService, EditService, PageService, RowDDService } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { FormDesignerService } from '../../../services/form-designer.service';
import { FlexFormsViewModel } from '../../../models/FormDesignerModel';
import { DataFieldService } from '../../../services/data-fields.service';
@Component({
  selector: 'app-entityforms',
  templateUrl: './entityforms.component.html', 
  providers: [ToolbarService, EditService, PageService, RowDDService, DataFieldService]
})
/** formdesigner component*/
export class EntityFormsComponent {
  
  //toast
  @ViewChild('toasttype', { static: false })
  private toastObj: ToastComponent;
  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };
    
  EntityType: string; EntityId: string;
  FlexForm: FormGroup;
  ProjectId: number;
  FormId: number;
  LoggedInScopeEntityType: string;
  LoggedInScopeEntityId: number;
  //grid component
  @ViewChild('entityFormGrid', { static: false }) public entityFormGrid: GridComponent;
  //define grid properties
  gridDataSource: any;
  lines: any; 
  public toolbar: ToolbarItems[] | object;
  editSettings: any;
  filterSettings: any;
  SelectedEntity = '';
  Previous = '';
  ShowGrid = false;
  showDropdowns = true;
   
  //Workflow Dropdown
  @ViewChild('entitytypelistObj', { static: false }) public entitytypelistObj: DropDownListComponent;

  public entitytypelistDataSource: Object[] = [
  /*{ text: "Workflow", value: "FlexTables" }, { text: "Master Data", value: "LReferences" }*/
    { text: "Workflow", value: "FlexTables" },
    { text: "Master Data", value: "MasterData" },
    //{ text: "Users", value: "Users" },
    //{ text: "Form Grid", value: "FormGrid" }
  ];
  public entitytypelistFields: Object = { text: 'text', value: 'value' };
  //EntityList Dropdown
  public EntityIdList: Object[];
  public EntityIdFields: Object = { text: 'DisplayTableName', value: 'Value' };
  @ViewChild('EntityIdlistObj', { static: false }) public EntityIdlistObj: DropDownListComponent;


  constructor(private route: ActivatedRoute, private router: Router, private _service: FormDesignerService
    , private _dataFieldService: DataFieldService) {
    this.route.params.subscribe((params: Params) => {
      this.EntityType = params['EntityType'];
      this.EntityId = params['EntityId'];
      
    });
    this.ProjectId = + sessionStorage.getItem("ProjectId");
    this.LoggedInScopeEntityType = sessionStorage.getItem("LoggedInScopeEntityType");
    this.LoggedInScopeEntityId = +sessionStorage.getItem("LoggedInScopeEntityId");
    //when navigation is from Datafields page, then EntityType,EntityId is populated.
    if (this.EntityType != '' && this.EntityType != undefined && this.EntityType != null && this.EntityType != 'null'
      && this.EntityId != '' && this.EntityId != undefined && this.EntityId != null && this.EntityId != 'null') {
      this.showDropdowns = false;//dont show dropdown for choosing Entity
      this.ShowGrid = true;
      if (this.EntityType != 'LUsers') {
        this._dataFieldService.GetEntityNameById(this.EntityId, this.EntityType, this.LoggedInScopeEntityType, this.LoggedInScopeEntityId).subscribe(result => {
          this.SelectedEntity = "for '" + result['Name'] + "'"; 
        })
      }
      else {
        this.SelectedEntity = "for Users";
      }
      this.GetGridData();
    }
    //get previous url
    if (this.router.getCurrentNavigation().previousNavigation != null) {
      this.Previous = this.router.getCurrentNavigation().previousNavigation.finalUrl.toString();
      sessionStorage.setItem('previousUrl', this.Previous);
    }
    this.lines = 'Both';
    this.toolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add', align: 'Left' },
    { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit', align: 'Left' },
    ];
    //this.editSettings = { allowEditing: true, allowAdding: true, /*allowDeleting: true,*/ mode: 'Dialog' };
    this.filterSettings = { type: 'Excel' };
    
   }
   

  public onChangeEntityType(args: any): void {
    this.EntityType = args.value;
    //populate Entity
    this._dataFieldService.GetTableNamesByProjectIdWithType(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId, this.EntityType)
      .subscribe(result => {
        this.EntityIdList = result;
      });
  }

  public onChangeEntity(args: any): void {
    this.EntityId = args.value; 
    this.GetGridData();
  }


  GetGridData() {
    this.ShowGrid = true;
    this._service.GetFormsByEntityIdType(this.EntityType, this.EntityId, this.ProjectId)
      .subscribe(griddata => {
        this.gridDataSource = griddata;
      });
  } 
  public goToPrevious(): void {
    this.router.navigateByUrl(sessionStorage.getItem('previousUrl'));
  }
  recordDoubleClick(args) {
    this.FormId = args.rowData['Id'];
    this.router.navigate(['/flexwf/form-designer', this.EntityType, this.EntityId, this.FormId]);
  }

  public toolbarClick(args: ClickEventArgs): void { 
    if (args.item.id === 'Add') { 
      this.router.navigate(['/flexwf/form-designer', this.EntityType, this.EntityId, -1]);
    }
    else if (args.item.id === 'Edit') {
      const selectedRecords = this.entityFormGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toastObj.timeOut = 3000;
        this.toasts[3].content = "No record selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.FormId = selectedRecords[0]['Id'];
        this.router.navigate(['/flexwf/form-designer', this.EntityType, this.EntityId, this.FormId]);
      }
    }
  }
}
