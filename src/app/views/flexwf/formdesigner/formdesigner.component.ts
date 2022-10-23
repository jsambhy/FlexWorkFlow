import { Component, Inject, ViewChild} from '@angular/core';
import { enableRipple, createElement } from '@syncfusion/ej2-base';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { GridLine, GridComponent, ToolbarItems, ToolbarService, EditService, PageService, RowDDService } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs, TabComponent } from '@syncfusion/ej2-angular-navigations';
import { FormDesignerService } from '../../../services/form-designer.service';
import { FlexFormsViewModel, FormTabViewModel, FormSectionViewModel, FormFieldViewModel } from '../../../models/FormDesignerModel';
import { Tooltip, DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
import { DataFieldService } from '../../../services/data-fields.service';

enableRipple(true);
@Component({
    selector: 'app-formdesigner',
    templateUrl: './formdesigner.component.html',
  styleUrls: ['./formdesigner.component.css'],
  providers: [ToolbarService, EditService, PageService, RowDDService, DataFieldService]
})
/** formdesigner component*/
export class FormdesignerComponent {
  hidden = false;
  public listObj: DropDownListComponent;
  public FormHeader: string = 'Form Designer';
  colorValue: string = '#000000';
  public tabcolorValue: string = '#FFFFFF';//default value for colorpicker
  public sectioncolorValue: string = '#D3D3D3';//default value for colorpicker
  ShowTabs: boolean = false;
  model: FlexFormsViewModel = new FlexFormsViewModel();
  @ViewChild('tabs', { static: false }) public tabs: TabComponent;
  @ViewChild('Sectiontabs', { static: false }) public Sectiontabs: TabComponent;
   
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
  public sizefields: Object = { text: 'text', value: 'value' };
  // set the placeholder to DropDownList input element
  public sizeData: Object[] = [
    { text: 8, value: 8 },
    { text: 9, value: 9 },
    { text: 10, value: 10 },
    { text: 12, value: 12 },
    { text: 14, value: 14 },
    { text: 18, value: 18 },
    { text: 20, value: 20 },
    { text: 24, value: 24 },
    { text: 28, value: 28 }
  ];

  LoggedInUserId = +sessionStorage.getItem('LoggedInUserId');
  LoggedInRoleId = +sessionStorage.getItem('LoggedInRoleId');
  ProjectId = +sessionStorage.getItem('ProjectId'); 
  public totalTabs: number;
  @ViewChild('tabs', { static: false }) tabInstance: TabComponent;

  ShowAddFieldsPopup = false;
  public TabsDetails: any;
  public SectionDetails: any;
  public fontfields: Object = { text: 'text', value: 'value' };
  // set the placeholder to DropDownList input element
  public fontData: Object[] = [
    { value: 'Arial', text: 'Arial' },
    { value: 'ArialNarrow', text: 'Arial Narrow' },
    { value: 'BrushScriptMT', text: 'Brush Script MT' },
    { value: 'Calibri', text: 'Calibri' },
    { value: 'Candara', text: 'Candara' },
    { value: 'Courier', text: 'Courier' },
    { value: 'CourierNew', text: 'Courier New' },
    { value: 'Didot', text: 'Didot' },
    { value: 'Geneva', text: 'Geneva' },
    { value: 'Helvetica', text: 'Helvetica' },
    { value: 'Times', text: 'Times' },
    { value: 'TimesNewRoman', text: 'Times New Roman' },
    { value: 'Verdana', text: 'Verdana' },
  ]; 
  
  
  filterSettings: any;
  // set the placeholder to DropDownList input element
  public layoutData: Object[] = [
    { text: 1, value: 1 },
    { text: 2, value: 2 },
    { text: 3, value: 3 },
    { text: 4, value: 4 }
  ];

  EntityType: string; EntityId: number;
  FlexForm: FormGroup;
  public headerText: Object = [{ 'iconCss': 'e-btn-icon e-custom-icons e-action-Icon-editpencil e-icons e-icon-left' },{ 'text': 'Manage Sections' }];
  FormId: number;
  Previous: string;

  constructor(private route: ActivatedRoute, private router: Router,
    private _service: FormDesignerService,
    private _dataFieldService: DataFieldService) {
    this.route.params.subscribe((params: Params) => {
      this.EntityType = params['EntityType'];
      this.EntityId = params['EntityId'];
      this.FormId = params['FormId'];
    });
        
    //get previous url
    if (this.router.getCurrentNavigation().previousNavigation != null) {
      this.Previous = this.router.getCurrentNavigation().previousNavigation.finalUrl.toString();
      sessionStorage.setItem('previousUrl', this.Previous);
    }  
    
    this.toolbar = [ 
      { text: 'Tabs', tooltipText: 'Manage Tabs', prefixIcon: 'e-custom-icons e-action-Icon-tabs',id: 'Tabs', align: 'Left' },
      { text: 'Sections', tooltipText: 'Manage Sections', prefixIcon: 'e-custom-icons e-action-Icon-sections', id: 'Sections', align: 'Left' },
      { text: 'Fields', tooltipText: 'Manage Fields', prefixIcon: 'e-custom-icons e-action-Icon-fields',id: 'Fields', align: 'Left' }, 
    //  { text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add', align: 'Left' },
    //{ text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit', align: 'Left' },
      // { text: 'Delete', tooltipText: 'Delete', prefixIcon: '', id: 'Delete', align: 'Left' },
    ];
    this.fieldstoolbar = [
      { text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add', align: 'Left' },
      { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit', align: 'Left' },
      { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete', align: 'Left' }
      ];
    //this.editSettings = { allowEditing: true, allowAdding: true, /*allowDeleting: true,*/ mode: 'Dialog' };
    this.filterSettings = { type: 'Excel' };
   
    this.tabsGridtoolbar = [
      { text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add', align: 'Left' },
      { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit', align: 'Left' },
      { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete', align: 'Left' },
    ];
    this.sectionsGridtoolbar = [
      { text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add', align: 'Left' },
      { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit', align: 'Left' },
      { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete', align: 'Left' },
    ];
    }
  AddFieldsForm: FormGroup;
  ngOnInit() {

    //initialize default FormGroup elements
    this.FlexForm = new FormGroup({
      Title: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      WebTitle: new FormControl('', [Validators.required]),
      ColumnsCount: new FormControl('', [Validators.required]),
      Description: new FormControl(''),
      DefaultSize: new FormControl(''),
      DefaultFont: new FormControl(''),
      TabBGColor: new FormControl(this.tabcolorValue),
      //TextColor: new FormControl(this.colorValue),
      SectionBGColor: new FormControl(this.sectioncolorValue),
      TextColor: new FormControl(this.colorValue),
      IsActive: new FormControl(false),
    });
    this.AddFieldsForm = new FormGroup({
      Type: new FormControl('',[Validators.required]),
      Description: new FormControl(),
      DefaultValue: new FormControl(),
      Width: new FormControl(''),
      TextSize: new FormControl(''),
      TextFont: new FormControl(''),
      TextColor: new FormControl(''),
      DataType: new FormControl('' ),
      DataField: new FormControl('' ),
    });
    if (this.FormId != undefined && this.FormId != null && this.FormId != -1) { //-1 is for Create
      this.GetFormDataById(this.FormId);
    } 
   
  }

  ngAfterViewInit() {
    this.model.EntityId = this.EntityId;
    this.model.EntityType = this.EntityType;
  }
  public goToPrevious(): void {
    this.router.navigate(['/flexwf/entityforms', this.EntityType, this.EntityId]);
    //this.router.navigateByUrl(sessionStorage.getItem('previousUrl'));
  }
  
  public tabCreated(): void {
     
    let tooltip: Tooltip = new Tooltip({
      content: 'Add Tab'
    });
    tooltip.appendTo('.e-ileft.e-icon');

    //document.getElementById('btn-add').onclick = (e: Event) => {
    //  let title: string = (document.getElementById('tab-title') as any).value;
    //  let content: string = "This is new tab to be added.";
    //  let item: Object = { header: { text: title }, content: createElement('pre', { innerHTML: content.replace(/\n/g, '<br>\n') }).outerHTML };

    //  this.totalTabs = document.querySelectorAll('#tabs .e-toolbar-item').length;
    //  this.tabInstance.addTab([item], this.totalTabs - 1);
    //};
  }

  public GetFormDataById(FormId) {
    this._service.GetFormDataById(FormId).subscribe(data1 => { 
      let data = data1[0];
      this.model = data;
      console.log(data);
      this.FlexForm.patchValue({
        Title: data.Title,
        WebTitle: data.WebTitle,
        ColumnsCount: data.ColumnsCount,
        Description: data.Description,
        DefaultSize: data.TextSize,
        DefaultFont: data.TextFont,
        TabBGColor: data.TabBGColor,
        SectionBGColor: data.SectionBGColor,
        TextColor: data.TextColor,
        IsActive: data.IsActive
      })
      this.CalculateWidthFromLayout(data.ColumnsCount);
      //this.GetTabSection(FormId,true);
      this.GetMainGridData();
    })
  }
  mainGridDataSource: Object[];

  GetMainGridData() {
    this._service.GetMainGridData(this.FormId).subscribe(data => {
      this.mainGridDataSource = data;
      this.ShowTabs = true;
    })
  }

  CalculateWidthFromLayout(Layout) {
    switch (Layout) {
      case 1:
        this.widthSource = [{ text: 1, value: 1 }];
        break;
      case 2:
        this.widthSource = [
          { text: 1, value: 1 },
          { text: 2, value: 2 }];
        break;
      case 3:
        this.widthSource = [
          { text: 1, value: 1 },
          { text: 2, value: 2 },
          { text: 3, value: 3 }];
        break;
      case 4:
        this.widthSource = [
          { text: 1, value: 1 },
          { text: 2, value: 2 },
          { text: 3, value: 3 },
          { text: 4, value: 4 }];
        break;
    }
  }

  PopulateFormModel() {
    this.model.Title = this.FlexForm.get('Title').value;
    this.model.WebTitle = this.FlexForm.get('WebTitle').value;
    this.model.Description = this.FlexForm.get('Description').value;
    this.model.ColumnsCount = this.FlexForm.get('ColumnsCount').value;
    this.model.TabBGColor = this.FlexForm.get('TabBGColor').value;
    this.model.SectionBGColor = this.FlexForm.get('SectionBGColor').value;
    this.model.TextColor = this.FlexForm.get('TextColor').value;
    this.model.TextFont = this.FlexForm.get('DefaultFont').value;
    this.model.TextSize = this.FlexForm.get('DefaultSize').value;
    this.model.IsActive = this.FlexForm.get('IsActive').value;
    this.model.UpdatedById = +sessionStorage.getItem('LoggedInUserId');
    this.model.UpdatedByRoleId = +sessionStorage.getItem('LoggedInRoleId');
    this.model.UpdatedDateTime = new Date(); 
  }
  ShowManageTabsPopup = false; ShowManageSectionsPopup = false; ShowManageFieldsPopup = false;
  ManageSectionsHeader: string; ManageFieldsHeader: string;
  FnManageTabs() {
    this.ShowManageTabsPopup = true;
    this.GetTabSection(this.FormId, false);//get Tab details
  }

  FnManageSections() {
    this.ShowManageSectionsPopup = true;
    this.GetSectionByTabId(this.selectedTabForModification);
  }

  FnManageFields() {
    this.ShowManageFieldsPopup = true;
    this.GetSectionGridData(this.selectedSectionForModification);
  }

  public mainGridToolbarClick(args: ClickEventArgs): void {
    this.fieldModel = new FormFieldViewModel();
    this.fieldModel.FormId = this.FormId;
    if (args.item.id === 'Tabs') {
      this.FnManageTabs();
    }
    else if (args.item.id === 'Sections') {
      const selectedRecords = this.mainGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toastObj.timeOut = 3000;
        this.toasts[3].content = "Please select record for managing section.";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.selectedTabForModification = selectedRecords[0]['TabId'];
        this.ManageSectionsHeader = "Manage section for '" + selectedRecords[0]['TabName'] + "'";
        this.FnManageSections();
      }
    }
    else if (args.item.id === 'Fields') {
      const selectedRecords = this.mainGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toastObj.timeOut = 3000;
        this.toasts[3].content = "Please select record for managing fields.";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.selectedTabForModification = selectedRecords[0]['TabId'];
        this.selectedSectionForModification = selectedRecords[0]['SectionId'];
        this.ManageFieldsHeader = "Manage fields for '" + selectedRecords[0]['SectionName'] + "'";
        this.FnManageFields();
      }
    }
  }
  //open manage fields popup
  mainGridDoubleClick(args) {
    this.selectedTabForModification = args.rowData['TabId'];
    this.selectedSectionForModification = args.rowData['SectionId'];
    this.ManageFieldsHeader = "Manage fields for '" + args.rowData['SectionName'] + "'";
    this.FnManageFields();
  }
  //save form data
  public FnSubmit() {
    this.submitted = true;
    if (this.FlexForm.invalid) {
      return;
    }
    this.PopulateFormModel();
    if (this.FormId != -1) { //Edit case
      //this.model.Id = this.FormId;
      this._service.UpdateFlexForm(this.FormId, this.model).subscribe(data => {
        this.toastObj.timeOut = 3000;
        this.toasts[1].content = "Updated successfully";
        this.toastObj.show(this.toasts[1]);
        window.location.reload();
      })
    }
    else {//create case
      this.model.CreatedById = +sessionStorage.getItem('LoggedInUserId');
      this.model.CreatedByRoleId = +sessionStorage.getItem('LoggedInRoleId');
      this.model.CreatedDateTime = new Date();
      this._service.SaveFlexForm(this.model).subscribe(FormId => {
        this.toastObj.timeOut = 3000;
        this.toasts[1].content = "Added successfully";
        this.toastObj.show(this.toasts[1]);
        //window.location.reload();
        //this.ShowTabs = true;
        //this.GetTabSection(FormId, false);
        setTimeout(function () {
          this.router.navigate(['flexwf/form-designer', 'FlexTables', this.EntityId, FormId])
        }, 3000);
      })
    }

  }
  

  public GetTabSection(FormId, getSection) {
    
    this._service.GetFormTabData(FormId).subscribe(tabData => {
      this.TabsDetails = tabData;
      
      this.selectedTabForModification = tabData[0]['Id'];
      if (getSection) {
        this.GetSectionByTabId(tabData[0]['Id']);
      }
    });
  }

  public gridDataSource: any;
  //grid component
  @ViewChild('FieldsGrid', { static: false }) public FieldsGrid: GridComponent;
  @ViewChild('mainGrid', { static: false }) public mainGrid: GridComponent;
  //define grid properties
  public lines: GridLine;
  public toolbar: ToolbarItems[] | object;
  public fieldstoolbar: ToolbarItems[] | object;
  public editSettings: Object;
  gridColumns: Object[] = [
    { Label: "Type", field: "Type" },
    { Label: "Value", field: "DefaultValue" },
    { Label: "DataField", field: "DataField" },
    { Label: "Width", field: "Width" },
    { Label: "Font", field: "TextFont" },
    { Label: "Size", field: "TextSize" },
  ]

  //grid component
  @ViewChild('FormTabsGrid', { static: false }) public FormTabsGrid: GridComponent;
  public tabsGridtoolbar: ToolbarItems[] | object;
  //grid component
  @ViewChild('FormSectionsGrid', { static: false }) public FormSectionsGrid: GridComponent;
  public sectionsGridtoolbar: ToolbarItems[] | object;

  GetSectionGridData(SectionId) {
    this._service.GetSectionGridData(SectionId)
      .subscribe(
        data => {
          this.ShowTabs = true;
         // this.gridDataSource = { result: data }; 
          this.gridDataSource = data; 
        }
      );
  }
  submitted = false;
  get fm() { return this.FlexForm.controls; }
  get f() { return this.AddFieldsForm.controls; }
  ShowAddBtn = true; ShowUpdateBtn = false;


  public fieldsToolbarClick(args: ClickEventArgs): void {
    this.fieldModel = new FormFieldViewModel();
    this.fieldModel.FormId = this.FormId;
    if (args.item.id === 'Add') {
      this.enableDataType = true;
      this.DataFieldlabelEnabled = true;
      this.FormFieldsHeader = "Create Form Field";
      this.ShowAddBtn = true;
      this.ShowUpdateBtn = false;
      this.ShowAddFieldsPopup = true;
      
      this.AddFieldsForm = new FormGroup({
        Type: new FormControl('', [Validators.required]),
        Description: new FormControl(),
        DefaultValue: new FormControl(),
        Width: new FormControl(''),
        TextSize: new FormControl(''),
        TextFont: new FormControl(''),
        TextColor: new FormControl(''),
        DataType: new FormControl(''),
        DataField: new FormControl(),
      });
      this.getDefaults();
    }
    else if (args.item.id === 'Edit') {
     
      const selectedRecords = this.FieldsGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toastObj.timeOut = 3000;
        this.toasts[3].content = "No record selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.FormFieldsHeader = "Edit Form Field";
        this.ShowAddBtn = false;
        this.ShowUpdateBtn = true;
        this.ShowAddFieldsPopup = true;
        //get form field info
        this.GetFieldInfo(selectedRecords[0]['Id']);
      }
    }
    if (args.item.id === 'Delete') {
      const selectedRecords = this.FieldsGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toastObj.timeOut = 3000;
        this.toasts[3].content = "No record selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      this.selectedFieldForModification = selectedRecords[0]['Id'];
      this.ConfirmDelete(selectedRecords[0]['Id'], 'Field');
    }
  } 
  
  recordDoubleClick(args) {
    this.FormFieldsHeader = "Edit Form Field";
    this.ShowAddBtn = false;
    this.ShowUpdateBtn = true;
    this.ShowAddFieldsPopup = true;
    //get form field info
    this.GetFieldInfo(args.rowData['Id']);
  }
  TabError = false;
  FnAddTab(tabtitle) {
    if (tabtitle == '' || tabtitle == null) {
      this.TabError = true;
      return;
    }
    this.TabError = false;
    let tabmodel: FormTabViewModel = new FormTabViewModel();
    tabmodel.Label = tabtitle;
    tabmodel.FlexFormId = this.FormId;
    tabmodel.IsVisible = true; 
    tabmodel.CreatedById = +sessionStorage.getItem('LoggedInUserId');
    tabmodel.UpdatedById = +sessionStorage.getItem('LoggedInUserId');
    tabmodel.CreatedByRoleId = +sessionStorage.getItem('LoggedInRoleId');
    tabmodel.UpdatedByRoleId = +sessionStorage.getItem('LoggedInRoleId');
    tabmodel.CreatedDateTime = new Date();
    tabmodel.UpdatedDateTime = new Date(); 
    this._service.SaveNewTab(tabmodel).subscribe(tabId => {
      this.toastObj.timeOut = 3000;
      this.toasts[1].content = "Added successfully";
      this.toastObj.show(this.toasts[1]);
      this.GetTabSection(this.FormId, false);
      this.showCreateTabPopup = false;
      //reload screen
      //window.location.reload();
    },
      (error: any) => {
        this.toastObj.timeOut = 3000;
        this.toasts[2].content = error.error["Message"];
        this.toastObj.show(this.toasts[2]);
      }) 

  }

  showCreateTabPopup = false;
  public recordDoubleClickTab(args): void { 
    this.selectedTabForModification = args.rowData['Id'];
    this.showEditTabPopup = true;
    this._service.GetTabById(this.selectedTabForModification)
      .subscribe(tabdata => {
        this.selectedTabModel = tabdata;
        this.edittitlevalue = this.selectedTabModel.Label;
      });
  }
  public recordDoubleClickSection(args): void {
    this.selectedSectionForModification = args.rowData['Id']; 
    this._service.GetSectionById(this.selectedSectionForModification)
      .subscribe(data => {
        this.showEditSectionPopup = true;
        this.selectedSectionModel = data;
        this.editSectionTitlevalue = this.selectedSectionModel.Label;
      });
  }
  
  FnEditTabs() { 
    this.showCreateTabPopup = true;
    this.TabError = false;
  }

  rowDropTab(args) { 
    let SoucreId = args.data[0]['Id']
    let fromIndex = args['fromIndex']; let dropIndex = args['dropIndex'];
    let sourcedata = this.TabsDetails[fromIndex];
    let targetdata = this.TabsDetails[dropIndex];
    let TargetId = targetdata['Id'];
    this._service.DragAndDropRowDynamic(SoucreId, TargetId,'FormTabs').subscribe(data => { 
      this.GetTabSection(this.FormId, false);
      //window.location.reload();
    })
  }
  edittitlevalue = '';
  tabstoolbarClick(args) { 
    if (args.item.id === 'Add') {
      this.showCreateTabPopup = true;
    }
    else {
      this.TabError = false;
      const selectedRecords = this.FormTabsGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toastObj.timeOut = 3000;
        this.toasts[3].content = "No record selected for this operation";
        this.toastObj.show(this.toasts[3]);
        return;
      }
      if (args.item.id === 'Edit') {
        this.selectedTabForModification = selectedRecords[0]['Id'];
        this.showEditTabPopup = true;
        this._service.GetTabById(this.selectedTabForModification)
          .subscribe(tabdata => { 
            this.selectedTabModel = tabdata;
            this.edittitlevalue = this.selectedTabModel.Label;
        });
      }
      if (args.item.id === 'Delete') {
        this.selectedTabForModification = selectedRecords[0]['Id'];
        this.showEditTabPopup = false;
        this.ConfirmDelete(selectedRecords[0]['Id'],'Tabs'); 
      }
    }
  }
  confirmHeader: string; confirmcontent: string;
  selectedTabForModification: number;
  selectedTabModel: FormTabViewModel = new FormTabViewModel();
  @ViewChild('confirmDialog', { static: false }) public confirmDialog: DialogComponent;
  //method called on the confirmation yes button click
  confirmDlgYesBtnClick = (): void => {
    if (this.deleteType == "DeleteTab") {
      let tabmodel = new FormTabViewModel();
      tabmodel.Id = this.selectedTabForModification;
      tabmodel.FlexFormId = this.FormId;
      this._service.DeleteTab(tabmodel).subscribe(
        (data) => {
          this.toasts[1].content = "Deleted Successfully";
          this.toastObj.show(this.toasts[1]);
          setTimeout(() => {
            this.GetTabSection(this.FormId, true);
          }, 3000);
        },
        (error: any) => {
          this.toastObj.timeOut = 3000;
          this.toasts[2].content = error.error["Message"];
          this.toastObj.show(this.toasts[2]);
        });
    }
    else if (this.deleteType == "DeleteSection") {
      let model = new FormSectionViewModel();
      model.Id = this.selectedSectionForModification;
      //model.FormTabId = this.selectedTabForModification;
      this._service.DeleteSection(model).subscribe(
        (data) => {
          this.toastObj.timeOut = 3000;
          this.toasts[1].content = "Deleted Successfully";
          this.toastObj.show(this.toasts[1]);
          setTimeout(() => {
            //window.location.reload();
            this.GetSectionByTabId(this.selectedTabForModification);
          }, 3000);
        },
        (error: any) => {
          this.toastObj.timeOut = 3000;
          this.toasts[2].content = error.error["Message"];
          this.toastObj.show(this.toasts[2]);
        });
    }
    else if (this.deleteType == "DeleteField") {
      let model = new FormSectionViewModel();
      model.Id = this.selectedFieldForModification;
      //model.FormTabId = this.selectedTabForModification;
      this._service.DeleteField(this.selectedFieldForModification).subscribe(
        (data) => {
          this.toastObj.timeOut = 3000;
          this.toasts[1].content = "Deleted Successfully";
          this.toastObj.show(this.toasts[1]);
          setTimeout(() => {
            //window.location.reload();
            this.GetSectionGridData(this.selectedSectionForModification);
            
          }, 3000);
        },
        (error: any) => {
          this.toastObj.timeOut = 3000;
          this.toasts[2].content = error.error["Message"];
          this.toastObj.show(this.toasts[2]);
        });
    }
    this.confirmDialog.hide();
    return;
  }
  //method called on the confirmation no button click
  confirmDlgBtnNoClick = (): void => {
    this.confirmDialog.hide();
    return;
  }
  confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmDlgYesBtnClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];

  deleteType:string = "DeleteTab";
  //show confirmation box before actually deleting
  ConfirmDelete(Id,type) {
    this.confirmHeader = "Please confirm"
    this.confirmcontent = 'Are you sure you want to delete?'
    this.confirmDialog.show();
    if (type == 'Tabs') {
      this.deleteType = "DeleteTab";
      this.selectedTabForModification = Id;
    }
    else if (type == 'Section') {
      this.deleteType = "DeleteSection";
      this.selectedSectionForModification = Id;
    }
    else if (type == 'Field') {
      this.deleteType = "DeleteField";
      this.selectedFieldForModification = Id;
    }
  }
  
  showEditTabPopup = false;
  FnUpdateTab(newTitle) {
    if (newTitle == '' || newTitle == null) {
      this.TabError = true;
      return;
    }
    this.TabError = false;
    this.selectedTabModel.Id = this.selectedTabForModification;
    this.selectedTabModel.Label = newTitle;
    this.selectedTabModel.UpdatedById = this.LoggedInUserId;
    this.selectedTabModel.UpdatedByRoleId = this.LoggedInRoleId;
    this.selectedTabModel.UpdatedDateTime = new Date();

    this._service.UpdateTab(this.selectedTabForModification, this.selectedTabModel)
      .subscribe(data => {
        this.showEditTabPopup = false;
        this.GetTabSection(this.FormId, false);
        this.showEditTabPopup = false;
        //window.location.reload();
      });
  }
  //method called on the dialogue box close button
  public dialogClose = (): void => { 
    this.GetTabSection(this.FormId, true);
     //window.location.reload();
  }

 

  /************************************
   * Sections Details
  */
  showSectionsGridPopup = false;
  editSectionTitlevalue = '';  
  GetSectionByTabId(tabId) {
    this._service.GetFormSectionData(tabId).subscribe(SectionData => {
      this.SectionDetails = SectionData;
      this.selectedSectionForModification = SectionData[0]['Id']; 
      this.GetSectionGridData(SectionData[0]['Id'])
    })
  }
  FnAddSection(sectionTitle) {
    if (sectionTitle == '' || sectionTitle == null) {
      this.SectionError = true;
      return;
    }
    this.SectionError = false;
    let model: FormSectionViewModel = new FormSectionViewModel();
    model.Label = sectionTitle;
    model.FormTabId = this.selectedTabForModification;
    model.IsVisible = true;
    model.CreatedById = +sessionStorage.getItem('LoggedInUserId');
    model.UpdatedById = +sessionStorage.getItem('LoggedInUserId');
    model.CreatedByRoleId = +sessionStorage.getItem('LoggedInRoleId');
    model.UpdatedByRoleId = +sessionStorage.getItem('LoggedInRoleId');
    model.CreatedDateTime = new Date();
    model.UpdatedDateTime = new Date();
    this._service.SaveNewSection(model).subscribe(sectionId => {
      this.toasts[1].content = "Added successfully";
      this.toastObj.show(this.toasts[1]);
      this.GetTabSection(this.FormId, false);
      this.showSectionsGridPopup = false;
      //window.location.reload();
    },
      (error: any) => {
        this.toastObj.timeOut = 3000;
        this.toasts[2].content = error.error["Message"];
        this.toastObj.show(this.toasts[2]);
      })

  }
  rowDropField(args) {
    let SoucreId = args.data[0]['Id']
    let fromIndex = args['fromIndex']; let dropIndex = args['dropIndex'];
    let sourcedata = this.gridDataSource[fromIndex];
    let targetdata = this.gridDataSource[dropIndex];
    let TargetId = targetdata['Id'];
    this._service.DragAndDropRowDynamic(SoucreId, TargetId, 'FlexFormFields').subscribe(data => {
      this.GetSectionGridData(this.selectedSectionForModification);
    })
  }
  rowDropSection(args) {
    let SoucreId = args.data[0]['Id']
    let fromIndex = args['fromIndex']; let dropIndex = args['dropIndex'];
    let sourcedata = this.TabsDetails[fromIndex];
    let targetdata = this.TabsDetails[dropIndex];
    let TargetId = targetdata['Id'];
    this._service.DragAndDropRowDynamic(SoucreId, TargetId, 'FormSections').subscribe(data => {
      this.GetSectionByTabId(this.selectedTabForModification);
      //window.location.reload();
    })
  }
  
  sectionstoolbarClick(args) {
    this.SectionError = false;
    if (args.item.id === 'Add') {
      this.showSectionsGridPopup = true;
    }
    else {
      const selectedRecords = this.FormSectionsGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toastObj.timeOut = 3000;
        this.toasts[3].content = "No record selected for this operation";
        this.toastObj.show(this.toasts[3]);
        return;
      }
      else { 
        if (args.item.id === 'Edit') {
          this.selectedSectionForModification = selectedRecords[0]['Id'];

          this._service.GetSectionById(this.selectedSectionForModification)
            .subscribe(data => {
              this.showEditSectionPopup = true;
              this.selectedSectionModel = data;
              this.editSectionTitlevalue = this.selectedSectionModel.Label;
            });
        }
        if (args.item.id === 'Delete') {
          this.selectedSectionForModification = selectedRecords[0]['Id'];
          this.showSectionsGridPopup = false;
          this.ConfirmDelete(selectedRecords[0]['Id'], 'Section');
        }
      }
    }
  }
  //confirmHeader: string; confirmcontent: string;
  selectedSectionForModification: number; selectedFieldForModification: number;
  selectedSectionModel: FormSectionViewModel = new FormSectionViewModel();
 // @ViewChild('confirmDialog', { static: false }) public confirmDialog: DialogComponent;
  //method called on the confirmation yes button click
  confirmSectionDlgYesBtnClick = (): void => {
    let model = new FormSectionViewModel();
    model.Id = this.selectedSectionForModification;
    this._service.DeleteTab(model).subscribe(
      (data) => {
        this.toasts[1].content = "Deleted Successfully";
        this.toastObj.show(this.toasts[1]);
        setTimeout(() => {
          this.GetTabSection(this.FormId, true);
        }, 3000);
      },
      (error: any) => {
        this.toastObj.timeOut = 3000;
        this.toasts[2].content = error.error["Message"];
        this.toastObj.show(this.toasts[2]);
      });

    this.confirmDialog.hide();
    return;
  }
  //method called on the confirmation no button click
  confirmSectionDlgBtnNoClick = (): void => {
    this.confirmDialog.hide();
    return;
  }
  confirmSectionDlgButtons: ButtonPropsModel[] = [{ click: this.confirmSectionDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmSectionDlgYesBtnClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];


   

  showEditSectionPopup = false; SectionError = false;
  FnUpdateSection(newTitle) {
    if (newTitle == '' || newTitle == null) {
      this.SectionError = true;
      return;
    }
    this.SectionError = false;
    this.selectedSectionModel.Id = this.selectedSectionForModification;
    this.selectedSectionModel.Label = newTitle;
    this.selectedSectionModel.UpdatedById = this.LoggedInUserId;
    this.selectedSectionModel.UpdatedByRoleId = this.LoggedInRoleId;
    this.selectedSectionModel.UpdatedDateTime = new Date();

    this._service.UpdateSection(this.selectedSectionForModification, this.selectedSectionModel)
      .subscribe(data => {
        this.showEditSectionPopup = false;
        this.GetSectionByTabId(this.selectedTabForModification);
      });
  }
  
  FnEditSections() {
    this.showSectionsGridPopup = true;
  }

  tabSelected(args) {
    if (args.previousItem.innerText == "") {
      window.location.reload();
    }
    if (args.selectedItem.innerText != "") {
      this.selectedTabForModification = this.TabsDetails[args.selectedIndex]['Id'];
      this.GetSectionByTabId(this.selectedTabForModification);
    }
  }
   
  sectionSelected(args) {
    if (args.selectedItem.innerText != "") {
      this.selectedSectionForModification = this.SectionDetails[args.selectedIndex]['Id'];
      this.fieldModel.SectionId = this.selectedSectionForModification;//first section data
      this.GetSectionGridData(this.selectedSectionForModification);
    }
  }
  /**** Form Fields section
   * 
   ****/
  //Type Dropdown
  public TypeSource: Object[]  = [{ text: 'Data Field', value: 'DataField' },
    { text: 'Text', value: 'Text' }];
  public TypeFields: Object = { text: 'text', value: 'value' };
  @ViewChild('TypeListObj', { static: false }) public TypeListObj: DropDownListComponent;
  IsDataField: boolean = false;

  public widthSource: Object[];
  public widthFields: Object = { text: 'text', value: 'value' };
  @ViewChild('widthListObj', { static: false }) public widthListObj: DropDownListComponent;

  public DataFieldSource: Object[] ;
  public DataFieldFields: Object = { text: 'Label', value: 'Id' };
  @ViewChild('DataFieldListObj', { static: false }) public DataFieldListObj: DropDownListComponent;

  FormFieldsHeader: string;
  fieldModel: FormFieldViewModel = new FormFieldViewModel();;
  getDefaults() {
    //get defaults
    this._service.GetDefaultValuesForFormField(this.EntityType, this.EntityId, this.ProjectId, this.FormId).subscribe(defaultdata => {
      this.AddFieldsForm.patchValue({
        TextSize: defaultdata[0].TextSize,
        TextFont: defaultdata[0].TextFont,
        TextColor: defaultdata[0].TextColor,
        //Width: defaultdata[0].Width
        Width: 1 
      })
    });
  }

  typeSelected(args) {
    if (args.value == 'DataField') {
      this.IsDataField = true;
      this.AddFieldsForm.controls['DataField'].setValidators([Validators.required]);
      this.AddFieldsForm.controls['DefaultValue'].clearValidators();
      //get unmapped datafields
      this._dataFieldService.GetDatafieldsForFormMapping(this.EntityType, this.EntityId, this.FormId).subscribe(data => {
        this.DataFieldSource = data;
      })
      
    }
    else//text
    {
      this.IsDataField = false;
      
      this.AddFieldsForm.controls['DataField'].clearValidators();
      this.AddFieldsForm.controls['DefaultValue'].setValidators([Validators.required]);
    }

  }


  changeDataField(args) {
    let DataFieldId = args.value;
    this.fieldModel.DataFieldId = DataFieldId;
    this._dataFieldService.GetById(DataFieldId).subscribe(data => {
      this.AddFieldsForm.patchValue({
        DataType: data.UserDataType
      });
    })
  }
  PopulateFieldModel(formtype) {
    if (formtype == 'Create') {
      this.fieldModel.CreatedById = this.LoggedInUserId;
      this.fieldModel.CreatedByRoleId = this.LoggedInRoleId;
      this.fieldModel.CreatedDateTime = new Date();
    }
    this.fieldModel.UpdatedById = this.LoggedInUserId;    
    this.fieldModel.UpdatedByRoleId = this.LoggedInRoleId;    
    this.fieldModel.UpdatedDateTime = new Date();
    this.fieldModel.TextColor = this.AddFieldsForm.get('TextColor').value;
    this.fieldModel.TextFont = this.AddFieldsForm.get('TextFont').value;
    this.fieldModel.TextSize = this.AddFieldsForm.get('TextSize').value;
    this.fieldModel.Width = this.AddFieldsForm.get('Width').value;
    this.fieldModel.DefaultValue = this.AddFieldsForm.get('DefaultValue').value;
    this.fieldModel.Description = this.AddFieldsForm.get('Description').value;
    this.fieldModel.SectionId = this.selectedSectionForModification;    
  }

  SaveFormField() {
    this.submitted = true;
    if (this.IsDataField && //when datafield, Label is required
      (this.AddFieldsForm.get('DataField').value == ''
        || this.AddFieldsForm.get('DataField').value == null)) {
      this.toastObj.timeOut = 3000;
      this.toasts[2].content = "Label is required";
      this.toastObj.show(this.toasts[2]);
      return;
    }
    if (!this.IsDataField &&//when text, Default Value is required
      (this.AddFieldsForm.get('DefaultValue').value == ''
        || this.AddFieldsForm.get('DefaultValue').value == null)) {
      this.toastObj.timeOut = 3000;
      this.toasts[2].content = "Default Value is required";
      this.toastObj.show(this.toasts[2]);
      return;
    }
    if (this.AddFieldsForm.invalid) {
      return;
    }
    this.PopulateFieldModel('Create');
    this._service.SaveNewField(this.fieldModel).subscribe(data => {
      this.toastObj.timeOut = 3000;
      this.toasts[1].content = "Added successfully";
      this.toastObj.show(this.toasts[1]);
      this.ShowAddFieldsPopup = false;
      this.GetSectionGridData(this.fieldModel.SectionId);
    },
      (error: any) => {
        this.toastObj.timeOut = 3000;
        this.toasts[2].content = error.error["Message"];
        this.toastObj.show(this.toasts[2]);
      })
  }
  UpdateFormField() {
    this.PopulateFieldModel('Update');
    this._service.UpdateField(this.fieldModel.Id,this.fieldModel).subscribe(data => {
      this.toastObj.timeOut = 3000;
      this.toasts[1].content = "Updated successfully";
      this.toastObj.show(this.toasts[1]);
      this.ShowAddFieldsPopup = false;
      this.GetSectionGridData(this.fieldModel.SectionId);
    },
      (error: any) => {
        this.toastObj.timeOut = 3000;
        this.toasts[2].content = error.error["Message"];
        this.toastObj.show(this.toasts[2]);
      })
  }
  enableDataType: boolean = true; DataFieldlabelEnabled = true;
  GetFieldInfo(Id) {
    this._service.GetFieldInfo(Id).subscribe(result => {
      let data = result[0];
      this.fieldModel = data;
      console.log(data)
      this.enableDataType = false;
      this.AddFieldsForm.patchValue({
        TextSize: data.TextSize,
        TextFont: data.TextFont,
        TextColor: data.TextColor,
        Width: data.Width,
        DefaultValue: data.DefaultValue,
        Type: data.Type,
        DataField: data.DataFieldId 
      })
       
      this.TypeListObj.value = data.Type;
      
      if (data.Type == 'DataField')
      {
        this.DataFieldlabelEnabled = false;
        this.enableDataType = false;
        this.IsDataField = true;
        this.DataFieldSource = [{ Id: data.DataFieldId, Label: data.DataField}];
      }
      else
      {
        this.IsDataField = false;
      }

      this._dataFieldService.GetById(data.DataFieldId).subscribe(data1 => {
        this.AddFieldsForm.patchValue({
          DataType: data1.UserDataType
        });
        this.DataFieldListObj.value = data1.Id; 
      })
    })
   
  }

  ManageTabsdialogClose(args) {
    this.GetMainGridData();
  }

}
