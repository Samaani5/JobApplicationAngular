import { Routes } from '@angular/router';
import { AddVacanciesComponent } from './Pages/admin/add-vacancies/add-vacancies.component';
import { AdminDashboardComponent } from './Pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminComponent } from './Pages/admin/admin.component';
import { ApplicantListComponent } from './Pages/admin/applicant-list/applicant-list.component';
import { DashboardComponent } from './Pages/home/dashboard/dashboard.component';
import { HomeComponent } from './Pages/home/home.component';
import { JobApplicationComponent } from './Pages/home/job-application/job-application.component';
import { JobApplyComponent } from './Pages/home/job-apply/job-apply.component';
import { SendOTPComponent } from './Pages/home/send-otp/send-otp.component';
import { TermsComponent } from './Pages/home/terms/terms.component';
import { VerifyOTPComponent } from './Pages/home/verify-otp/verify-otp.component';
import { LoginComponent } from './Pages/login/login.component';
import { AuthGuardService } from './Services/auth-guard/auth-guard.service';
import { VerifyEmployeeComponent } from './Pages/admin/verify-employee/verify-employee.component';
import { JobApplicationITOilComponent } from './Pages/home/job-application-itoil/job-application-itoil.component';
import { PostVacancyListComponent } from './Pages/admin/post-vacancy-list/post-vacancy-list.component';
import { AddGroupDivisionComponent } from './Pages/admin/add-group-division/add-group-division.component';
import { AddProjectComponent } from './Pages/admin/add-project/add-project.component';
import { AddDesignationComponent } from './Pages/admin/add-designation/add-designation.component';
import { AddZoneComponent } from './Pages/admin/add-zone/add-zone.component';
import { GroupDivisionListComponent } from './Pages/admin/group-division-list/group-division-list.component';
import { ProjectListComponent } from './Pages/admin/project-list/project-list.component';
import { DesignationListComponent } from './Pages/admin/designation-list/designation-list.component';
import { ZoneListComponent } from './Pages/admin/zone-list/zone-list.component';
import { FinalJobApplicationDetailsComponent } from './Pages/home/final-job-application-details/final-job-application-details.component';
import { ItApplicationDetailsComponent } from './Pages/admin/it-application-details/it-application-details.component';
import { SubDivisionListComponent } from './Pages/admin/sub-division-list/sub-division-list.component';
import { AddSubDivisionComponent } from './Pages/admin/add-sub-division/add-sub-division.component';
import { StepMasterListComponent } from './Pages/admin/step-master-list/step-master-list.component';
import { AddStepMasterComponent } from './Pages/admin/add-step-master/add-step-master.component';
import { UserManagementComponent } from './Pages/admin/user-management/user-management.component';
import { UserManagementListComponent } from './Pages/admin/user-management-list/user-management-list.component';
import { InternshipApplicationComponent } from './Pages/home/internship-application/internship-application.component';

export const routes: Routes = [
  {
    path: '', component: HomeComponent, children: [
      { path: '', component: DashboardComponent },
      { path: 'JobApply', component: JobApplyComponent },
      { path: 'SendOTP', component: SendOTPComponent },
      { path: 'verifyotp', component: VerifyOTPComponent },
      { path: 'T&C', component: TermsComponent },
      { path: 'JobApplication', component: JobApplicationComponent },
      { path: 'JobApplicationIO', component: JobApplicationITOilComponent },
      { path: 'final-job-application-details', component: FinalJobApplicationDetailsComponent },
      { path: 'internship-application', component: InternshipApplicationComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin', component: AdminComponent, children: [
      { path: '', component: AdminDashboardComponent, canActivate: [AuthGuardService] },
      { path: 'applicant-list', component: ApplicantListComponent, canActivate: [AuthGuardService] },
      { path: 'post-vacancy-list', component: PostVacancyListComponent, canActivate: [AuthGuardService] },
      { path: 'add-vacancy', component: AddVacanciesComponent, canActivate: [AuthGuardService] },
      { path: 'add-vacancy/:id', component: AddVacanciesComponent, canActivate: [AuthGuardService] },
      { path: 'verify-employee', component: VerifyEmployeeComponent, canActivate: [AuthGuardService] },
      { path: 'add-group-division', component: AddGroupDivisionComponent, canActivate: [AuthGuardService] },
      { path: 'add-group-division/:id', component: AddGroupDivisionComponent, canActivate: [AuthGuardService] },
      { path: 'group-division-list', component: GroupDivisionListComponent, canActivate: [AuthGuardService] },
      { path: 'add-project', component: AddProjectComponent, canActivate: [AuthGuardService] },
      { path: 'add-project/:id', component: AddProjectComponent, canActivate: [AuthGuardService] },
      { path: 'project-list', component: ProjectListComponent, canActivate: [AuthGuardService] },
      { path: 'add-designation', component: AddDesignationComponent, canActivate: [AuthGuardService] },
      { path: 'add-designation/:id', component: AddDesignationComponent, canActivate: [AuthGuardService] },
      { path: 'designation-list', component: DesignationListComponent, canActivate: [AuthGuardService] },
      { path: 'add-zone', component: AddZoneComponent, canActivate: [AuthGuardService] },
      { path: 'add-zone/:id', component: AddZoneComponent, canActivate: [AuthGuardService] },
      { path: 'zone-list', component: ZoneListComponent, canActivate: [AuthGuardService] },
      { path: 'sub-division-list', component: SubDivisionListComponent, canActivate: [AuthGuardService] },
      { path: 'add-sub-division', component: AddSubDivisionComponent, canActivate: [AuthGuardService] },
      { path: 'add-sub-division/:id/:groupDivisionId', component: AddSubDivisionComponent, canActivate: [AuthGuardService] },
      { path: 'it-application-details', component: ItApplicationDetailsComponent, canActivate: [AuthGuardService] },
      { path: 'step-master-list', component: StepMasterListComponent, canActivate: [AuthGuardService] },
      { path: 'add-step-master', component: AddStepMasterComponent, canActivate: [AuthGuardService] },
      { path: 'add-step-master/:id', component: AddStepMasterComponent, canActivate: [AuthGuardService] },
      { path: 'user-management', component: UserManagementComponent, canActivate: [AuthGuardService] },
      { path: 'user-management/:id', component: UserManagementComponent, canActivate: [AuthGuardService] },
      { path: 'user-management-list', component: UserManagementListComponent, canActivate: [AuthGuardService] },
    ]
  }
];


