import { OnInit, Component, ViewChild } from '@angular/core';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { Router } from '@angular/router';
import { INavData } from '@coreui/angular';
import { MenusService } from '../../services/menus.service';
import { UserRoleViewModel } from '../../models/loginModel';
import { AccountService } from '../../services/auth';
import { SupportingDocumentService } from '../../services/supporting-document.service';
import { RworkFlowsService } from '../../services/rworkflows.service';
import { MasterDataService } from '../../services/master-data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Blob } from 'aws-sdk/lib/dynamodb/document_client';
import { UserService } from '../../services/user.service';
import { GKeyValueService } from '../../services/gkeyvalue.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.css'],
  providers: [MenusService, SupportingDocumentService, RworkFlowsService, MasterDataService, UserService]
})
export class DefaultLayoutComponent implements OnInit {
  public sidebarMinimized = false;
  public navItems: INavData[] = [];
  //public ProjectName: string;
  public LoggedInRoleId: number;
  public UserRoleId: number;
  public LoggedInRoleName: string;
  public EntityType: string;
  public EntityId: number;
  public EntityName: string;
  public ProjectId: number;
  public LogoPath: string;
  public LoginEmail: string;
  public UserImagePath: string;
  public thumbnail: any;
  public Logothumbnail: any;
  UserId: string;
  UserName: string;
  rolesList: UserRoleViewModel[];
  public IsSystemUser: boolean;

  // To display the current date 
  public currentDate: number = Date.now();

  public rolesDropdownFields: Object = { text: 'RoleName', value: 'Id' };
  public SelectedRole: number;
  @ViewChild('roleDropdown', { static: false })
  public roleDropdown: DropDownListComponent;
  Previous: string;
  constructor(private router: Router, private _menusService: MenusService, private _SupportingDocService: SupportingDocumentService
    , private _AccountService: AccountService, private _serviceRWorkflows: RworkFlowsService,
    private _serviceMasterData: MasterDataService, private sanitizer: DomSanitizer, private _UserService: UserService
  ) {
    this.UserId = sessionStorage.getItem("LoggedInUserId");
    this.LoggedInRoleId = +sessionStorage.getItem("LoggedInRoleId");
    this.UserRoleId = +sessionStorage.getItem("UserRoleId");
    this.ProjectId = +sessionStorage.getItem("ProjectId");
    this.LoggedInRoleName = sessionStorage.getItem("LoggedInRoleName");
    this.UserName = sessionStorage.getItem("UserName");
    this.rolesList = JSON.parse(sessionStorage.getItem('UserRoles'));
    this.LoginEmail = sessionStorage.getItem("LoginEmail");
    this.IsSystemUser = sessionStorage.getItem("IsSystemUser") == 'true' ? true : false;
    //this.ProjectName = "FlexWF Application"; //sessionStorage.getItem("CompanyName");
  }
  ReleaseNumber: string;
  ngOnInit() {
    
    this.ReleaseNumber = sessionStorage.getItem('ReleaseNumber');
    this.SetDefaultRoleAndEntity();
    this.getNavItems(this.UserId, this.LoggedInRoleId, this.ProjectId);
    //get User Image 
    this.UserImagePath = sessionStorage.getItem('UserImagePath');
    if (this.UserImagePath != null && this.UserImagePath != "null" && this.UserImagePath != undefined && this.UserImagePath != "") {
      this._UserService.GetImageFromS3(this.UserImagePath)
        .subscribe(
          data => {
            let objectURL = 'data:image/jpeg;base64,' + data;
            this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          }
        );
    }
    else {
      this.thumbnail = "assets/img/avatars/User Pic.jpg";
    }
  }

  GoTodashboard() {
    sessionStorage.setItem("IsReload", 'Yes');
    this.router.navigate(['/dashboard/dash', this.UserRoleId]);
  }
  GoToConfigureDashboard() {
    this.router.navigate(['/dashboard/configure-dashboard']);
  }
  SetDefaultRoleAndEntity() {
    for (let i = 0; i < this.rolesList.length; i++) {
      if (this.rolesList[i].Id == this.UserRoleId) {
        this.SelectedRole = this.rolesList[i].Id;
        this.EntityType = this.rolesList[i].EntityType;
        this.EntityId = this.rolesList[i].EntityId;
        let index = this.rolesList[i].RoleName.indexOf("(");
        this.EntityName = this.rolesList[i].RoleName.substring(index + 1, this.rolesList[i].RoleName.length - 1)
        break;
      }
    }
    this.LogoPath = sessionStorage.getItem("LogoPath");
    this.SetLogo(this.LogoPath);
  }

  LogoSrc: string;
  SetLogo(LogoPath) {
    if (LogoPath != "null" && LogoPath != null && LogoPath != undefined) {

      this._UserService.GetImageFromS3(LogoPath)
        .subscribe(
          data => {
            let objectURL = 'data:image/jpeg;base64,' + data;
            this.Logothumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            this.LogoSrc = "{src:'/assets/img/avatars/mega-cube.png', width: 150, height: 32, alt: 'CoreUI Logo'}";
          }
        );
    }
    else {
      this.Logothumbnail = "./assets/img/avatars/mega-cube.png"
      this.LogoSrc = "{src:'/assets/img/avatars/mega-cube.png', width: 150, height: 32, alt: 'CoreUI Logo'}";
    }

    /*this.LogoSrc = '{src:' + this.Logothumbnail + ', width: 150, height: 32, alt: "CoreUI Logo"}'*/


  }

  onRoleChange(args: any): void {
    
    sessionStorage.setItem('LoggedInRoleId', args.itemData.RoleId);
    sessionStorage.setItem('UserRoleId', args.value);
    sessionStorage.setItem('LoggedInRoleName', this.roleDropdown.text);
    sessionStorage.setItem('LoggedInScopeEntityId', args.itemData.EntityId.toString());
    sessionStorage.setItem('LoggedInScopeEntityType', args.itemData.EntityType.toString());

    let index = this.roleDropdown.text.indexOf("(");
    let DefaultEntityName = this.roleDropdown.text.substring(index + 1, this.roleDropdown.text.length - 1)
    sessionStorage.setItem('DefaultEntityName', DefaultEntityName.toString());
    //Project details, Header and footer updated here  

    for (let i = 0; i < this.rolesList.length; i++) {
      if (this.rolesList[i].Id == args.value) {
        this.EntityType = this.rolesList[i]["EntityType"];
        this.EntityId = this.rolesList[i]["EntityId"];
        if (this.EntityType == "GProjects") {
          sessionStorage.setItem('ProjectId', this.EntityId.toString());
          this.ProjectId = this.EntityId;
        }
        else {
          sessionStorage.setItem('ProjectId', '');
        }
        break;
      }
    }

    this._AccountService.GetExistingInfoByEntityType(this.EntityType, this.EntityId)
      .subscribe(
        data => {
          sessionStorage.setItem('Logo', data[0]["Logo"]);
          this.SetLogo(data[0]["Logo"]);
          sessionStorage.setItem('PunchLine', data[0]["PunchLine"]);
          this.getNavItems(this.UserId, args.itemData.RoleId, this.ProjectId)
          sessionStorage.setItem('LogoPath', data[0]["LogoPath"]);
        }
      );

    //We need to redirect to dashboard but with dafault layout reloading because navigate only load the dashboard component.
    //So we are seeting this "IsReload" and checking and removing this session item in Dashboard component
    sessionStorage.setItem("IsReload", 'Yes');

    this.router.navigate(['/dashboard/dash', this.UserRoleId]);
    //window.location.reload();

  }

  getNavItems(UserId, LoggedInRoleId, ProjectId) {
    this._menusService.getMenusByUserRole(UserId, LoggedInRoleId, this.EntityType, this.EntityId).subscribe
      (
        data => {
          //this.data = data;
          if (data != null && data != undefined && data != "") {
            this.navItems = JSON.parse(data);
          }
          //this.navItems = [{"name": "Administration", "url": "\/base", "icon": "icon-puzzle", "children": [{ "name": "Taxes", "url": "\/winepro\/Taxes", "icon": "icon-people", "children": [{ "name": "Tax_Child", "url": "\/winepro\/Taxes", "icon": "icon-people"}]},{"name":"Roles","url":"\/winepro\/Roles","icon":"icon-people"},{"name":"Companies","url":"\/winepro\/Companies","icon":"icon-people"},{"name":"Distilleries","url":"\/winepro\/Distilleries","icon":"icon-people"},{"name":"Genres","url":"\/winepro\/Genres","icon":"icon-people"},{"name":"WineTypes","url":"\/winepro\/WineTypes","icon":"icon-people"},{"name":"Wines","url":"\/winepro\/Wines","icon":"icon-people"},{"name":"LicenseTypes","url":"\/winepro\/LicenseTypes","icon":"icon-people"},{"name":"Units","url":"\/winepro\/Units","icon":"icon-people"},{"name":"States","url":"\/winepro\/States","icon":"icon-people"}]}];
          sessionStorage.setItem('RoleMenuList', JSON.stringify(this.navItems));

        }
      )
  }

  OnLogOut() {
    //sessionStorage.clear();
    //this.router.navigate(['/login']);
    this._AccountService.logout();
  }


  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  downloadHelp() {
    let currentUrl = this.router.url;
    let CurentUrlArray = currentUrl.split('/');
    let MenuString = "/" + CurentUrlArray[1] + "/" + CurentUrlArray[2];
    //Check whether current Menu is staic or dynamic

    this._menusService.CheckExistenceByUrl(MenuString).subscribe
      (
        IsExist => {
          if (IsExist)//means static menu and we will get HelpFileurl from database
          {
            this._menusService.GetMenuByUrl(currentUrl).subscribe
              (
                HelpFilePath => {
                  if (HelpFilePath != null || HelpFilePath != undefined || HelpFilePath != "") {
                    let CompleteFilePath = HelpFilePath[0]['HelpFilePath'];
                    this._SupportingDocService.DownloadFromS3(CompleteFilePath);
                  }
                }
              )
          }
          else//Dynamic Menu, not exist in GMenus table
          {
            let IsWorkflow = MenuString.includes("generic-grid");//checking whether url contains "generic-grid" or not, if yes then it is related to workflow otherwise not
            if (IsWorkflow)//means it is related to workflow
            {
              //GetFileName from Database from Help table
              let WorkflowId = +sessionStorage.getItem("WorkflowId");
              //Getting workflow details
              this._serviceRWorkflows.GetWorkflowById(WorkflowId)
                .subscribe(
                  WorkflowsDetails => {
                    if (WorkflowsDetails.HelpFilePath == null || WorkflowsDetails.HelpFilePath == undefined || WorkflowsDetails.HelpFilePath == '') {
                      this._SupportingDocService.DownloadFromS3("/help/GenericGrid_help.pdf");
                    }
                    else {
                      this._SupportingDocService.DownloadFromS3(WorkflowsDetails.HelpFilePath);
                    }
                  }
                );
            } //if (IsWorkflow)//means it is related to workflow

            let IsMasterdata = MenuString.includes("RefData");//checking whether url contains "Refdata" or not, if yes then it is related to Master data otherwise not
            if (IsMasterdata)//means it is related to MasterData
            {
              this._serviceMasterData.GetById(CurentUrlArray[3])
                .subscribe(
                  MasterdataDetails => {
                    this._SupportingDocService.DownloadFromS3(MasterdataDetails.HelpFilePath);
                  }
                );
            } //if (IsMasterdata)//means it is related to MasterData

            let Isdiagramconfiguration = MenuString.includes("diagramconfiguration");
            if (Isdiagramconfiguration) {
              let helpPath = "/help/WorkflowConfiguration.pdf";
              this._SupportingDocService.DownloadFromS3(helpPath);
            }

            let FormRenderer = MenuString.includes("form-renderer");
            if (FormRenderer) {
              let helpPath = "/help/form-renderer_help.pdf";
              this._SupportingDocService.DownloadFromS3(helpPath);
            }

            let DashBoard = MenuString.includes("dashboard");
            if (DashBoard) {
              let helpPath = "/help/UserGuide_help.pdf";
              this._SupportingDocService.DownloadFromS3(helpPath);
            }
          }//else//Dynamic Menu, not exist in GMenus table
        }
      )




  }

  Scheduler() {
    this.router.navigate(['/flexwf/scheduler', 0]);
  }

}
