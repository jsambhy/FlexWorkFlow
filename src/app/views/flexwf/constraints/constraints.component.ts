import { Component, Input, ViewChild } from '@angular/core';
import { ConstraintsService } from '../../../services/constraints.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { FilterSettingsModel, ToolbarItems, GridComponent } from '@syncfusion/ej2-angular-grids';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { MultiSelectComponent } from '@syncfusion/ej2-angular-dropdowns';
import { DataFieldService } from '../../../services/data-fields.service';
import { ConstraintModel } from '../../../models/constraint.model';
import { environment } from '../../../../environments/environment';
import { Ajax } from '@syncfusion/ej2-base';
import { StepColumnsService } from '../../../services/step-columns.service';
@Component({
  selector: 'app-constraints',
  templateUrl: './constraints.component.html',
  providers: [ConstraintsService]
})
export class ConstraintsComponent {

  @Input()  EntityId: number;
  @Input()  EntityType: string;
  @Input()  ProjectId: number;
  //grid component
  @ViewChild('ConstraintsGrid', { static: false }) public ColumnsGrid: GridComponent;
  //define grid properties
  public toolbar: ToolbarItems[] | object;
  public editSettings: Object;
  ConstraintsGridData: any;
  public filterSettings: FilterSettingsModel;

  ConstrainstForm: FormGroup;
  ShowForm = false;
  PopupHeader: string;
  submitted = false;
  ShowCreateBtn = false;
  ShowUpdateBtn = false;
  model : ConstraintModel;

  @ViewChild('ColumnsList', { static: false })
  public ColumnsList: MultiSelectComponent;
  // maps the appropriate column to fields property
/*public fields: Object = { text: 'FieldName', value: 'DataFieldId' };*/
  public fields: Object = { text: 'FieldName', value: 'FieldName' };
  public ColumnsDataSource: any[];
  public ColumnsValueList: number[] = new Array();
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
 
  constructor(private formBuilder: FormBuilder,
    private _service: ConstraintsService,
    private _dataFieldService: DataFieldService,
    private _colservice: StepColumnsService,
    private router: Router,
    private route: ActivatedRoute) {   
    this.toolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add', align: 'Left' },
      { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit', align: 'Left' },
     
    ];
    //this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    this.filterSettings = { type: 'Excel' };

       
  }
  ngOnInit() {
    
    this.GetConstraintsGrid();
    
    this._colservice.GetAllFlattenedDFsForEntity(this.EntityType, this.EntityId)
      .subscribe(Columns => {
        this.ColumnsDataSource = Columns;
    })
    //creating form fields and declaring validation that needs to be implemented
    this.ConstrainstForm = this.formBuilder.group({
      Description: new FormControl(''),
      ErrorMessage: new FormControl('', [Validators.maxLength(255)]),
      Columns: new FormControl('', [Validators.required]),
      IsPrimaryKey: new FormControl(false),
      IsActive: new FormControl(true),
    });
  }

  GetConstraintsGrid() {
    this._service.GetConstraints(this.EntityType, this.EntityId, this.ProjectId)
      .subscribe(
        constraints => {
          this.ConstraintsGridData = constraints;
        });
  }

  get f() { return this.ConstrainstForm.controls; }
  public recordDoubleClick(args): void {
    this.GetConstraintById(args.rowData['Id']);
    this.PopupHeader = "Edit Constraint";
    this.ShowUpdateBtn = true;
    this.ShowCreateBtn = false;
    this.ShowForm = true;
  }
  public toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'Add') {
      this.PopupHeader = "Create Constraint";
      this.ConstrainstForm.patchValue({
        Description: null,
        ErrorMessage: null,
        Columns: null,
        IsPrimaryKey: false,
        IsActive:true
      });
      this.model = new ConstraintModel();
      this.ShowUpdateBtn = false;
      this.ShowCreateBtn = true;
      this.ShowForm = true;
    }
    else if (args.item.id === 'Edit') {
      const selectedRecords = this.ColumnsGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toastObj.timeOut = 3000;
        this.toasts[3].content = "No record selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.GetConstraintById(selectedRecords[0]['Id']);
        this.PopupHeader = "Edit Constraint";
        this.ShowUpdateBtn = true;
        this.ShowCreateBtn = false;
        this.ShowForm = true;
      }
    }
    else if (args.item.id === 'Delete') {
      const selectedRecords = this.ColumnsGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toastObj.timeOut = 3000;
        this.toasts[3].content = "No record selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
      }
    }
  }
  readonly baseUrl = environment.baseUrl;
  GetConstraintById(ConstraintId) {
    
    let ColumnIds: any[] = new Array();
    this._service.GetConstraintById(ConstraintId)
      .subscribe(modeldata => {
        this.model = modeldata;
        //let columns = JSON.parse(data);
        const callback: Ajax = new Ajax(
          this.baseUrl + "/Constraints/GetConstraintsMapping?Id=" + ConstraintId, 'GET', false, 'application/json; charset=utf-8'
        );
        callback.onSuccess = (data: any): void => {
          let Roles = JSON.parse(data);
          for (let j = 0; j < Roles.length; j++) {
            ColumnIds.push(Roles[j]);
          }
          this.ColumnsValueList = ColumnIds;
        };
        callback.send().then();

        
        this.ConstrainstForm.patchValue({          
          Description: modeldata.Description,
          ErrorMessage: modeldata.ErrorMessage,
          Columns: ColumnIds,
          IsPrimaryKey: modeldata.IsPrimaryKey,
          IsActive: modeldata.IsActive
        });
    })
  }

  AddConstraint() {
    this.PopulateModel('Add');
    if (this.model.IsPrimaryKey) {//if PrimaryKey checkbox is checked, then check if IsPrimarykey is alraedy there for the entity or not
      this._service.CheckIfPrimaryKeyExists(this.EntityType, this.EntityId, this.ProjectId , -1)
        .subscribe(exists => {
          if (!exists) {
            this.SaveData();
          }
          else {
            this.toastObj.timeOut = 3000;
            this.toasts[2].content = "Primary Key already exists. Please uncheck IsPrimary checkbox.";
            this.toastObj.show(this.toasts[2]);
          }
        })
    }
    else {
      this.SaveData();
    }
  }

  SaveData() {
    this.submitted = true;
    if (this.ConstrainstForm.invalid) {
      return;
    }
    this._service.Add(this.model).subscribe(data => {
      this.toastObj.timeOut = 3000;
      this.toasts[1].content = "Data saved successfully.";
      this.toastObj.show(this.toasts[1]);
      this.ShowForm = false;
      this.GetConstraintsGrid();
    },
      (error: any) => {
        this.toastObj.timeOut = 3000;
        this.toasts[2].content = error.error["Message"];
        this.toastObj.show(this.toasts[2]);
      }
    );
  }
  UpdateConstraint() {
    this.submitted = true;
    if (this.ConstrainstForm.invalid) {
      return;
    }
    this.PopulateModel('Edit');
    if (this.model.IsPrimaryKey) {//if PrimaryKey checkbox is checked, then check if IsPrimarykey is alraedy there for the entity or not
      let ConstraintId = this.model.Id;
      this._service.CheckIfPrimaryKeyExists(this.EntityType, this.EntityId, this.ProjectId, ConstraintId)
        .subscribe(exists => {
          if (!exists) {
            this.UpdateData();
          }
          else {
            this.toastObj.timeOut = 3000;
            this.toasts[2].content = "Primary Key already exists. Please uncheck IsPrimary checkbox.";
            this.toastObj.show(this.toasts[2]);
          }
        })
    } else {
      this.UpdateData();
    }
  }
  UpdateData() {

    this._service.Update(this.model.Id, this.model).subscribe(data => {
      this.toastObj.timeOut = 3000;
      this.toasts[1].content = "Data updated successfully.";
      this.toastObj.show(this.toasts[1]);
      setTimeout(() => {
        this.GetConstraintsGrid();
        this.ShowForm = false;
      });
    },
      (error: any) => {
        this.toastObj.timeOut = 3000;
        this.toasts[2].content = error.error["Message"];
        this.toastObj.show(this.toasts[2]);
      }
    );
  }
  DeleteConstraint(Id) {
    this._service.Delete(Id).subscribe(data => {
      this.toastObj.timeOut = 3000;
      this.toasts[1].content = "Constraint deleted successfully.";
      this.toastObj.show(this.toasts[1]);
    },
      (error: any) => {
        this.toastObj.timeOut = 3000;
        this.toasts[2].content = error.error["Message"];
        this.toastObj.show(this.toasts[2]);
      }
    );
  }

  PopulateModel(FormMode) {
    
    if (FormMode == 'Add') {
      this.model.EntityId = this.EntityId;
      this.model.EntityType = this.EntityType;
      this.model.ProjectId = this.ProjectId;
      this.model.CreatedByRoleId = +sessionStorage.getItem('LoggedInRoleId');
      this.model.CreatedById = +sessionStorage.getItem('LoggedInUserId');
      this.model.CreatedDateTime = new Date();
      this.model.ConstraintType = 'Unique';
    } 
    this.model.IsActive = this.ConstrainstForm.get('IsActive').value;
    this.model.IsPrimaryKey = this.ConstrainstForm.get('IsPrimaryKey').value;
    this.model.Description = this.ConstrainstForm.get('Description').value;
    this.model.ErrorMessage = this.ConstrainstForm.get('ErrorMessage').value;
    this.model.Columns = this.ConstrainstForm.get('Columns').value;
    // converting [Period] Periods,[Achievements] Created By to {[Period].Periods},{[Achievements].Created By}
    let columnsString: string = '';
    let SplittedColumns= this.ColumnsList.text.split(',');
    for (let i = 0; i < SplittedColumns.length; i++) {
      columnsString += '{' + SplittedColumns[i] + '},';
    }
    columnsString = columnsString.substring(0, columnsString.length - 1);
    columnsString = columnsString.replace('] ', '].'); 
    this.model.FormGridColumn = 'Where ' + columnsString;
    this.model.UpdatedByRoleId = +sessionStorage.getItem('LoggedInRoleId');
    this.model.UpdatedById = +sessionStorage.getItem('LoggedInUserId');
    this.model.UpdatedDateTime = new Date();
  }

  CheckIfPrimaryKeyAlreadyExists() {
    
  }

}
