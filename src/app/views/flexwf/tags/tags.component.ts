import { Component, ViewChild, Inject, Input, EventEmitter, Output } from '@angular/core';
import { ToolbarItems } from '@syncfusion/ej2-angular-pivotview';
import { FilterSettingsModel, GridLine, ContextMenuItem, GridComponent, ExcelExportService } from '@syncfusion/ej2-angular-grids';
import { ToastPositionModel, ToastComponent } from '@syncfusion/ej2-angular-notifications';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { tagsmodel } from '../../../models/tag.model';
import { CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';
import { TagsService } from '../../../services/tag.service';
import { PdfExportService } from '@syncfusion/ej2-angular-maps';
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css'],
  providers: [ExcelExportService, PdfExportService]
})
/** tags component*/
export class TagsComponent {
  @Input() TagCategoryId: number;
  @Input() CategoryName: string;
  @Output() PostshowPopupEvent = new EventEmitter();
  /** tags ctor */
  constructor(private formBuilder: FormBuilder, private _service: TagsService) {
    this.tagForm = new FormGroup({
      taglabel: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      tagdescription: new FormControl('', [Validators.maxLength(4000)]),
      tagActive: new FormControl(''),

    });
  }
  editSettings: Object;
  tagForm: FormGroup = null;
  projectId: number;
  hidden: boolean = false;
  ShowCreateBtn: boolean = true;
  ShowUpdateBtn: boolean = false;
  confirmcontent: string;
  public sessionprojectid: string;
  TagId: number;
  LoggedInUserId: number;
  LoggedInRoleId: number;
  GridDataSource: tagsmodel[];
  headerTag: string;
  toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  @ViewChild('checkBoxIsActive', { static: false }) public checkBoxIsActive: CheckBoxComponent;
  @ViewChild('tagsgrid', { static: false }) public tagsgrid: GridComponent;
  @ViewChild('toasttype', { static: false }) private toastObj: ToastComponent;
  @ViewChild('confirmDialog', { static: false }) public confirmDialog: DialogComponent;
  position: ToastPositionModel = { X: 'Center' };
  lines: GridLine;
  ShowPopupcreateTag: boolean = false;
  toolbar: ToolbarItems[] | object;
  filterSettings: FilterSettingsModel;
  tagsData: tagsmodel = new tagsmodel();//declaring and initializing the variable to use further
  //Context menu define called whle right clicking on the grid component
  contextMenuItems: ContextMenuItem[] = ['AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending',
    'Copy', 'Edit', 'Delete', 'Save', 'Cancel',
    'PdfExport', 'ExcelExport', 'CsvExport', 'FirstPage', 'PrevPage',
    'LastPage', 'NextPage', 'Group', 'Ungroup'];
  CurrentRoleName: string = sessionStorage.getItem("CurrentRoleName");
  LoginEmail: string = sessionStorage.getItem("LoginEmail");
  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'tagsgrid_pdfexport') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name

      this.tagsgrid.pdfExport();
    }
    if (args.item.id === 'tagsgrid_excelexport') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name

      this.tagsgrid.excelExport();
    }
    if (args.item.id === 'tagsgrid_csvexport') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name

      this.tagsgrid.csvExport();
    }
    if (args.item.id === 'Add') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.headerTag = "Create Tag"
      this.ShowPopupcreateTag = true;
      this.tagForm.patchValue({
        taglabel: null,
        tagdescription: null,
        tagActive: true
      });
    

    }

    if (args.item.id === 'Edit') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      
      const selectedRecords = this.tagsgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No Tag selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.TagId = selectedRecords[0]['Id'];// 
        this.GetById(this.TagId);
      }
    }

    if (args.item.id === 'Delete') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      const selectedRecords = this.tagsgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No Tag selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        //this.RoleNameToDelete = selectedRecords[0]['RoleName'];
        this.TagId = selectedRecords[0]['Id'];// 
        this.DeleteById(selectedRecords[0]['Id']);
      }

    }


  }

  recordDoubleClick(args): void {
    this.TagId = args.rowData['Id'];// 
    this.GetById(this.TagId);

  }
  ManagedialogClose() {
    this.PostshowPopupEvent.emit();
  }
  dialogClose() {
    this.ShowPopupcreateTag = false;
  
  }
  ngOnInit() {
    this.lines = 'Both';
    this.filterSettings = { type: 'CheckBox' };
    this.toolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' }, { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' }, { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' }, 'ExcelExport', 'PdfExport', 'CsvExport', 'Search'];
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    this.LoggedInRoleId = +sessionStorage.getItem("LoggedInRoleId");
    this.sessionprojectid = sessionStorage.getItem("ProjectId");
    this.projectId = +this.sessionprojectid; // conversion from string to int   
    this.LoggedInUserId = +sessionStorage.getItem("LoggedInUserId");
    this.GetTagData(this.TagCategoryId);
  }
  get f() { return this.tagForm.controls; }

  public isFieldValid(field: string) {
    return !this.tagForm.get(field).valid && (this.tagForm.get(field).dirty || this.tagForm.get(field).touched);
  }
  GetTagData(Id) {
    this._service.GetTagDataByCategoryId(Id)
      .subscribe(
        TagsData => {
          this.GridDataSource = (TagsData);
        }
      );
  }
  //------------save tags--------
  Save() {
    this.tagsData.Name = this.tagForm.get('taglabel').value;
    this.tagsData.Description = this.tagForm.get('tagdescription').value;
    this.tagsData.IsActive = this.checkBoxIsActive.checked;
    this.tagsData.TagCategoryId = this.TagCategoryId;
    if (this.tagForm.invalid) {
      return;
    }
    else {
      this.tagsData.ParameterCarrier = "|UserName=" + sessionStorage.getItem("LoginEmail") + "|RoleName=" + sessionStorage.getItem("LoggedInRoleName")
        + "|SessionValues=" + sessionStorage;
      this.tagsData.CreatedById = this.LoggedInUserId;
      this.tagsData.UpdatedById = this.LoggedInUserId;
      this.tagsData.CreatedByRoleId = this.LoggedInRoleId;
      this.tagsData.UpdatedByRoleId = this.LoggedInRoleId;
      this.tagsData.ProjectId = this.projectId;
      this._service.Save(this.tagsData).subscribe(
        (data) => {
          this.toasts[1].content = "Tag created successfully";
          this.toastObj.show(this.toasts[1]);
          this.ShowPopupcreateTag = false;
          this.GetTagData(this.TagCategoryId);
        },
        (error: any) => {
          this.toasts[2].content = error.error.Message;
          this.toastObj.show(this.toasts[2]);
          this.ShowPopupcreateTag = true;

        }
      );

    }

  }

  GetById(Id) {
    this.ShowCreateBtn = false;
    this.ShowUpdateBtn = true;
    this._service.GetById(Id)
      .subscribe(
        data => {
          
          console.log(data)
          this.tagForm.patchValue({
            taglabel: data[0].Name,
            tagdescription: data[0].Description,
            tagActive: data[0].IsActive
          });
          this.TagId = data[0].Id;
         // this.RoleId = data.Id;//Id is not the part of Form thats why we need to take it in variable so that at the time of update, we can use it
        }
    );
    this.headerTag = "Edit Tag"
    this.ShowPopupcreateTag = true;
  }

  Update() {
    this.tagsData.Name = this.tagForm.get('taglabel').value;
    this.tagsData.Description = this.tagForm.get('tagdescription').value;
    this.tagsData.IsActive = this.checkBoxIsActive.checked;
    this.tagsData.Id = this.TagId;
    if (this.tagForm.invalid) {
      return;
    }
    else {
      this.tagsData.ParameterCarrier = "|UserName=" + sessionStorage.getItem("LoginEmail") + "|RoleName=" + sessionStorage.getItem("LoggedInRoleName")
        + "|SessionValues=" + sessionStorage;
      this.tagsData.CreatedById = this.LoggedInUserId;
      this.tagsData.UpdatedById = this.LoggedInUserId;
      this.tagsData.CreatedByRoleId = this.LoggedInRoleId;
      this.tagsData.UpdatedByRoleId = this.LoggedInRoleId;
      this.tagsData.ProjectId = this.projectId;
      this.tagsData.TagCategoryId = this.TagCategoryId;
      this._service.Update(this.tagsData).subscribe(
        (data) => {
          this.toasts[1].content = "Tag updated successfully";
          this.toastObj.show(this.toasts[1]);

          this.ShowPopupcreateTag = false;
          this.GetTagData(this.TagCategoryId);
        }),
        (error: any) => {
          
          console.log(error)
          this.toasts[2].content = error.error.Message;
          this.toastObj.show(this.toasts[2]);
          this.ShowPopupcreateTag = true;

        }
    }
    //(error: any) => alert(error);
  }

  DeleteById(Id) {
    this.confirmcontent = 'Are you sure you want to delete?';
    this.confirmDialog.show();
  }
  public confirmDlgBtnNoClick = (): void => {
    this.confirmDialog.hide();
  }
  public confirmDlgBtnYesClick = (): void => {
    
    this.tagsData.Id = this.TagId;
    this.tagsData.ParameterCarrier = "UserName=" + this.LoginEmail + "|RoleName=" + this.CurrentRoleName;
    this.tagsData.ProjectId = this.projectId;
    this.tagsData.CreatedById = this.LoggedInUserId;
    this.tagsData.UpdatedById = this.LoggedInUserId;
    this.tagsData.CreatedByRoleId = this.LoggedInRoleId;
    this.tagsData.UpdatedByRoleId = this.LoggedInRoleId;
    this._service.Delete(this.tagsData).subscribe(
        (data: any) => {
        if (data == "success") {
          this.toasts[1].content = "Tag Category deleted successfully";
          this.toastObj.show(this.toasts[1]);
         
        }
        else {
          this.toasts[0].content = data;;
          this.toastObj.show(this.toasts[0]);
        }
        this.GetTagData(this.TagCategoryId);
        }
        //(error: any) => alert(error)
      );
    this.confirmDialog.hide();
  } 
  public confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmDlgBtnYesClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];

}
