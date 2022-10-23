import { Component, ViewChild } from '@angular/core';

import { Ajax } from '@syncfusion/ej2-base';
import { PageService, EditService, GridComponent } from '@syncfusion/ej2-angular-grids';
import { ToastPositionModel, ToastComponent } from '@syncfusion/ej2-angular-notifications';
import { environment } from '../../../../environments/environment';
import { MenuRoleService } from '../../../services/menu-role.service';

@Component({
    selector: 'app-menu-role-mapping',
    templateUrl: './menu-role-mapping.component.html',
  styleUrls: ['./menu-role-mapping.component.css'],
  providers: [PageService, EditService]
})
/** menu-role-mapping component*/
export class MenuRoleMappingComponent {
  public ProjectId: Number;
  public gridColumns: any;
  public gridDataSource: any;
  public initialPage: Object;
  public editSettings;
  public updatedMenuId: number;
  public selectedMatrixdata: Object[] = [];
  LoggedInScopeEntityId: number;
  LoggedInScopeEntityType: string;

  @ViewChild('menuRoleGrid', { static: false }) public menuRoleGrid: GridComponent;

  @ViewChild('toasttype', { static: false })
  private toastObj: ToastComponent;
  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };

  readonly baseUrl = environment.baseUrl;
  constructor(private _service: MenuRoleService) {
    this.LoggedInScopeEntityId = +sessionStorage.getItem("LoggedInScopeEntityId");
    this.LoggedInScopeEntityType = sessionStorage.getItem("LoggedInScopeEntityType");
  }
  

  //ngOnInit(): void {
  //  this.initialPage = { pageSizes: true, pageCount: 4 };
  //  this.editSettings = { allowEditing: true};
    
  //  this.ProjectId = +sessionStorage.getItem("ProjectId"); // conversion from string to int   
    
  //  const callback: Ajax = new Ajax(
  //    this.baseUrl + '/MMenuRoles/GetColumnForMenuRoles?ProjectId=' + this.ProjectId, 'GET', false, 'application/json; charset=utf-8'
  //  );
  //  callback.onSuccess = (data: any): void => {
  //    this.gridColumns = JSON.parse(data);
  //  };
  //  callback.send().then();

  //  this._service.GetDataForMenuRoleMapping()
  //    .subscribe(
  //      data => {
  //        this.gridDataSource = data;
  //      }
  //    );
  //}


  //ItemcheckedEvent(RoleName, e): void {//this event will be called when checkbox in matrix will get checked/unchecked
  //  const selectedRecords = this.menuRoleGrid.getSelectedRecords();
  //  if (selectedRecords.length != 0) {
  //    this.updatedMenuId = selectedRecords[0]['MenuId'];
  //  }
    
  //  this.selectedMatrixdata.push({ MenuId: this.updatedMenuId, ColumnName: RoleName, NewResponse: e.checked, ProjectId: this.ProjectId });
  //}

  //fnSaveMappingdata() {
  //  
  //  console.log(this.selectedMatrixdata);
  //  this._service.SaveMappingData(this.selectedMatrixdata)
  //    .subscribe(
  //      data => {
  //        this.toasts[1].content = "Menu Role Mapping saved successfully";
  //        this.toastObj.timeOut = 3000;
  //        this.toastObj.show(this.toasts[1]);
  //        setTimeout(() => { window.location.reload(); }, 3000);
  //        //alert('Menu Role Mapping saved successfully');
  //      }
  //    );
  //}

}
