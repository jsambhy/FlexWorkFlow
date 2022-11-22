import { Component } from '@angular/core';
import { ViewChild, Inject } from '@angular/core';
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
import { TextBox } from '@syncfusion/ej2-angular-inputs';

@Component({
    selector: 'app-tag-category',
    templateUrl: './tag-category.component.html',
  styleUrls: ['./tag-category.component.css'],
  providers: [ExcelExportService, PdfExportService]
})
/** tag-category component*/
export class TagCategoryComponent {
    /** tag-category ctor */
  constructor(private formBuilder: FormBuilder, private _service: TagsService) {
    this.tagCatForm = new FormGroup({
      tagcatlabel: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      tagcatdescription: new FormControl('', [Validators.maxLength(4000)]),
      tagcatactive: new FormControl('')
    });
    this.LoggedInScopeEntityId = +sessionStorage.getItem("LoggedInScopeEntityId");
    this.LoggedInScopeEntityType = sessionStorage.getItem("LoggedInScopeEntityType");
  }
  hidden: Boolean = false;
  editSettings: Object;
  LoggedInScopeEntityId: number;
  LoggedInScopeEntityType: string;
  tagCatForm: FormGroup = null;
  projectId: number;
  ShowCreateBtn: boolean = true;
  ShowUpdateBtn: boolean = false;
  confirmcontent: string;
  sessionprojectid: string;
  TagCategoryId: number;
  LoggedInUserId: number;
  LoggedInRoleId: number;
  CatGridDataSource: tagsmodel[];
  headerTag: string;
  CategoryName: string;
  isChange: boolean = false;
  toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  @ViewChild('checkBoxIsActive', { static: false }) public checkBoxIsActive: CheckBoxComponent;
  @ViewChild('tagcategoriesgrid', { static: false }) public tagcategoriesgrid: GridComponent;
  @ViewChild('toasttype', { static: false }) private toastObj: ToastComponent;
  @ViewChild('confirmDialog', { static: false }) public confirmDialog: DialogComponent;
  position: ToastPositionModel = { X: 'Center' };
  lines: GridLine;
  showManageTag: boolean = false;
  ShowPopupcreateTagCat: boolean = false;
  toolbar: ToolbarItems[] | object;
  filterSettings: FilterSettingsModel;
  tagsData: tagsmodel = new tagsmodel();//declaring and initializing the variable to use further
  //Context menu define called whle right clicking on the grid component
  contextMenuItems: ContextMenuItem[] = ['AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending',
    'Copy', 'Edit', 'Delete', 'Save', 'Cancel',
    'PdfExport', 'ExcelExport', 'CsvExport', 'FirstPage', 'PrevPage',
    'LastPage', 'NextPage', 'Group', 'Ungroup'];
  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'tagcategoriesgrid_pdfexport') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name

      this.tagcategoriesgrid.pdfExport();
    }
    if (args.item.id === 'tagcategoriesgrid_excelexport') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name

      this.tagcategoriesgrid.excelExport();
    }
    if (args.item.id === 'tagcategoriesgrid_csvexport') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name

      this.tagcategoriesgrid.csvExport();
    }
    if (args.item.id === 'Add') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.headerTag = "Create Tag Category"
      this.ShowPopupcreateTagCat = true;
      this.tagCatForm.patchValue({
        tagcatlabel: null,
        tagcatdescription: null,
        tagcatactive: true
      });
    }

    if (args.item.id === 'Edit') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      const selectedRecords = this.tagcategoriesgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No Tag Category selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.TagCategoryId = selectedRecords[0]['Id'];// 
       this.GetById(this.TagCategoryId);
       
      
      }
    }

    if (args.item.id === 'Delete') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      const selectedRecords = this.tagcategoriesgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No Tag Category selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.TagCategoryId = selectedRecords[0]['Id'];// 
        this.DeleteById(selectedRecords[0]['Id']);
      }

    }

    if (args.item.id === 'tag') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      const selectedRecords = this.tagcategoriesgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No Tag Category selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.CategoryName = selectedRecords[0]['Name'];
        this.TagCategoryId = selectedRecords[0]['Id'];// 
        this.showManageTag = true;
      }
    }
  }

  PostshowPopupEvent() {
    this.showManageTag = false;
  }

  dialogClose() {
    this.ShowPopupcreateTagCat = false;
  }
  ngOnInit() {
    this.lines = 'Both';
    this.filterSettings = { type: 'CheckBox' };
    this.toolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' }, { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' }, { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' },
     { text: 'Manage Tags', tooltipText: 'Manage Tags', prefixIcon: 'e-custom-icons e-action-Icon-tags', id: 'tag' }, 'ExcelExport', 'PdfExport', 'CsvExport', 'Search'];
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    this.LoggedInRoleId = +sessionStorage.getItem("LoggedInRoleId");
    this.sessionprojectid = sessionStorage.getItem("ProjectId");
    this.projectId = +this.sessionprojectid; // conversion from string to int   
    this.LoggedInUserId = +sessionStorage.getItem("LoggedInUserId");
    this.GetData();
  }
  get f() { return this.tagCatForm.controls; }
  isFieldValid(field: string) {
    return !this.tagCatForm.get(field).valid && (this.tagCatForm.get(field).dirty || this.tagCatForm.get(field).touched);
  }
  GetData() {
    this._service.GetData(this.LoggedInScopeEntityId)
      .subscribe(
        TagsCatData => {
          this.CatGridDataSource = (TagsCatData);
        }
      );
  }
  public recordDoubleClick(args): void {
    this.TagCategoryId = args.rowData['Id'];// 
    this.GetById(this.TagCategoryId);
    
  }
  //------------save tags--------
  Save() {
    this.tagsData.Name = this.tagCatForm.get('tagcatlabel').value;
    this.tagsData.Description = this.tagCatForm.get('tagcatdescription').value;
    this.tagsData.IsActive = this.checkBoxIsActive.checked;

    if (this.tagCatForm.invalid) {
      return;
    }
    else {
      this.tagsData.ParameterCarrier = "|UserName=" + sessionStorage.getItem("LoginEmail") + "|RoleName=" + sessionStorage.getItem("LoggedInRoleName")
        + "|SessionValues=" + sessionStorage;
      this.tagsData.CreatedById = this.LoggedInUserId;
      this.tagsData.UpdatedById = this.LoggedInUserId;
      this.tagsData.CreatedByRoleId = this.LoggedInRoleId;
      this.tagsData.UpdatedByRoleId = this.LoggedInRoleId;
      this.tagsData.LoggedInScopeEntityId = this.LoggedInScopeEntityId;
      this.tagsData.LoggedInScopeEntityType = this.LoggedInScopeEntityType;
      this._service.SaveCategory(this.tagsData).subscribe(
        (data) => {
          this.toasts[1].content = "Tag Category created successfully";
          this.toastObj.show(this.toasts[1]);
          this.ShowPopupcreateTagCat = false;
          this.GetData();
        },
        (error: any) => {
          
          console.log(error)
          this.toasts[2].content = error.error.Message;
          this.toastObj.show(this.toasts[2]);
          this.ShowPopupcreateTagCat = true;
          
        }
      );

    }

  }

  beforeEditName: string;
  isEdit: boolean = false;
  GetById(Id) {
    this.ShowCreateBtn = false;
    this.ShowUpdateBtn = true;
    this._service.GetCategoryById(Id)
      .subscribe(
        data => {
          this.beforeEditName = data.Name;
          this.isEdit = true;
          this.tagCatForm.patchValue({
            tagcatlabel: data.Name,
            tagcatdescription: data.Description,
            tagcatactive: data.IsActive
          });
          this.TagCategoryId = data.Id;//Id is not the part of Form thats why we need to take it in variable so that at the time of update, we can use it
        }
      );
    this.headerTag = "Edit Tag Category"
    this.ShowPopupcreateTagCat = true;
  }

  Update() {
    this.tagsData.Name = this.tagCatForm.get('tagcatlabel').value;
    this.tagsData.Description = this.tagCatForm.get('tagcatdescription').value;
    this.tagsData.IsActive = this.checkBoxIsActive.checked;
    if (this.tagCatForm.invalid) {
      return;
    }
    else {
    
    this.tagsData.Id = this.TagCategoryId;
    this.tagsData.ParameterCarrier = "|UserName=" + sessionStorage.getItem("LoginEmail") + "|RoleName=" + sessionStorage.getItem("LoggedInRoleName")
      + "|SessionValues=" + sessionStorage;
    this.tagsData.CreatedById = this.LoggedInUserId;
    this.tagsData.UpdatedById = this.LoggedInUserId;
    this.tagsData.CreatedByRoleId = this.LoggedInRoleId;
    this.tagsData.UpdatedByRoleId = this.LoggedInRoleId;
    this._service.UpdateTagCategory(this.tagsData).subscribe(
      (data: string) => {
        this.toasts[1].content = "Tag Category updated successfully";
        this.toastObj.show(this.toasts[1]);

        this.ShowPopupcreateTagCat = false;
        this.GetData();
      }),
      (error: any) => {
        
        console.log(error)
        this.toasts[2].content = error.error.Message;
        this.toastObj.show(this.toasts[2]);
        this.ShowPopupcreateTagCat = true;

      }
    //(error: any) => alert(error);
    }
  }
  openTagMangScreen() {
    this.showManageTag = true;
  }
  focusOut(args: TextBox): void {
    if (this.tagCatForm.invalid) {
      return;
    }
    else {
      if (this.isEdit == true) {
        if (this.beforeEditName == args.value) {
          return;
        }
        else {
          this.tagsData.LoggedInScopeEntityType = this.LoggedInScopeEntityType;
          this.tagsData.LoggedInScopeEntityId = this.LoggedInScopeEntityId;
          this.tagsData.Name = args.value;
          this._service.checkIfExists(this.tagsData).subscribe(
            (data: any) => {
              if (data == true) {
                //getRepeatedCatName
                this._service.getRepeatedCatName(this.tagsData)
                  .subscribe(
                    data => {

                      this.toasts[2].content = "'" + data + "' Tag Category already exist for this project. Either reuse or create a different one. ";
                      this.toastObj.show(this.toasts[2]);
                      this.tagCatForm.patchValue({
                        tagcatlabel: null

                      });
                    }
                  );

              }

            },
            (error: any) => console.log(error)
          );
        }
      }
      else {
        this.tagsData.LoggedInScopeEntityType = this.LoggedInScopeEntityType;
        this.tagsData.LoggedInScopeEntityId = this.LoggedInScopeEntityId;
        this.tagsData.Name = args.value;
        this._service.checkIfExists(this.tagsData).subscribe(
          (data: any) => {
            if (data == true) {
              //getRepeatedCatName
              this._service.getRepeatedCatName(this.tagsData)
                .subscribe(
                  data => {

                    this.toasts[2].content = "'" + data + "' Tag Category already exist for this project. Either reuse or create a different one. ";
                    this.toastObj.show(this.toasts[2]);
                    this.tagCatForm.patchValue({
                      tagcatlabel: null

                    });
                  }
                );

            }

          },
          (error: any) => console.log(error)
        );
      }



      
    }
  }
  DeleteById(Id) {
    this.confirmcontent = 'Are you sure you want to delete?';
    this.confirmDialog.show();
  }
  confirmDlgBtnNoClick = (): void => {
    this.confirmDialog.hide();
  }
  confirmDlgBtnYesClick = (): void => {
    this._service.DeleteCategory(this.TagCategoryId).subscribe(
      (data: string) => {


        if (data == "success") {
          this.toasts[1].content = "Tag Category deleted successfully";
          this.toastObj.show(this.toasts[1]);
          this.GetData();
        }
        else {
          this.toasts[0].content = data;;
          this.toastObj.show(this.toasts[0]);
        }
       
      }
      //(error: any) => alert(error)
    );
    this.confirmDialog.hide();
  }
  public confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmDlgBtnYesClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];
}
