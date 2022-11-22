import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RolesService } from '../../../services/roles.service';
import { UserRoleViewModel } from '../../../models/loginModel';
import { ToastPositionModel, ToastComponent } from '@syncfusion/ej2-angular-notifications';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';

@Component({
  selector: 'app-default-role',
  templateUrl: './default-role.component.html',
})
export class DefaultRoleComponent implements OnInit {
  Id: string;
  Email: string;
  rolesList: UserRoleViewModel[];
  SelectedRole: any;
  UserId: string;
  RoleId;


  @ViewChild('role1', { static: false })
  public role1: DropDownListComponent;

  @ViewChild('toasttype', { static: false })
  private toastObj: ToastComponent;
  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: '', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: '', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: '', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: '', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };

  public rolesDropdownFields: Object = { text: 'RoleName', value: 'RoleId' };
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private roleService: RolesService
  ) {
    this.UserId = sessionStorage.getItem("LoggedInUserId");
    this.RoleId = sessionStorage.getItem("LoggedInRoleId");
  }

  ngOnInit() {
    
    this.roleService.GetUserRoleByUserId(this.UserId)
      .subscribe(rolesResult => {
        this.rolesList = rolesResult;
        for (var role of this.rolesList) {
          if (role.IsDefault) {
            this.SelectedRole = role.RoleId;
            break;
          }
        }
        if (this.SelectedRole == '' || this.SelectedRole == undefined) {
          this.SelectedRole = this.rolesList[0].RoleId;
        }

      });
  }

  updateDefaultRole(selectedRole) {
    this.RoleId = selectedRole;
    this.roleService.UpdateDefaultUserRole(this.UserId, this.RoleId)
      .subscribe(result => {
        sessionStorage.setItem('LoggedInRoleId', this.RoleId);
        sessionStorage.setItem('LoggedInRoleName', this.role1.text);
        this.toastObj.timeOut = 3000;
        this.toasts[1].content = "Default Role updated successfully";
        this.toastObj.show(this.toasts[1]);
        setTimeout(() => { window.location.reload() }, 3000);
    });
  }
  
}  
