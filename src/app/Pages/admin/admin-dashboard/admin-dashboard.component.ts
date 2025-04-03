import { CommonModule, KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AdminfooterComponent } from '../../../include/adminfooter/adminfooter.component';
import { DashboardResponse } from '../../../Models/Dashboard/dashboard-response';
import { UserSession } from '../../../Models/UserSession/user-session';
import { AuthenticationService } from '../../../Services/authentication/authentication.service';
import { DashboardService } from '../../../Services/Dashboard/dashboard.service';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';
declare var Swal: any;
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [AdminfooterComponent, NgFor, CommonModule, NgIf, RouterModule, KeyValuePipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  GroupDivisionList: any;
  currentMonthYear: string = '';
  currentYear: string = '';
  dashboardData: DashboardResponse[] = [];
  dashboardDataMonth: DashboardResponse[] = [];
  groupedData!: { [key: string]: DashboardResponse[]; };
  groupedDataMonth!: { [key: string]: DashboardResponse[]; };
  usession = new UserSession;

  constructor(private router: Router, private jobapplyservice: JobApplyService, private dashboardservice: DashboardService) {
    this.usession = JSON.parse((sessionStorage.getItem('session') || '{}'));
    this.GetDashBoardData();
    this.GetDashBoardDataMonth();
  }
  ngOnInit(): void {
    const today = new Date();
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    this.currentMonthYear = `${monthNames[today.getMonth()]}-${today.getFullYear()}`;
    this.currentYear = today.getFullYear().toString();
  }
  tileColors = ['tile-red', 'tile-green', 'tile-aqua', 'tile-blue'];
   badgeColors = ['badge-primary', 'badge-info', 'badge-danger', ' badge-success', 'badge-warning'];

  getTileColor(index: number): string {
    return this.tileColors[index % this.tileColors.length];
  }
  getbadgeColor(index: number): string {
    return this.badgeColors[index % this.badgeColors.length];
  }
 
  activeTabs: { [key: number]: string } = {};
  ShowTabs(tabName: string, index: number, groupname: unknown): void {
    this.activeTabs[index] = tabName;
  }

  isActiveTab(index: number, tabName: string): boolean {
    return this.activeTabs[index] === tabName;
  }
  navigateToApplicantList(groupname: unknown, groupid: number, status: number, type: string): void {
    const sessionData = {
      groupname: groupname,
      groupid: +groupid, 
      status: status,
      type: type,
    };
    sessionStorage.setItem('groupParams', JSON.stringify(sessionData));
    this.router.navigate(['/admin/applicant-list']);
  }
  GetDashBoardData() {
    debugger;
    this.dashboardservice.GetDashBoardData(this.usession.userId).subscribe(
      (result: any) => {
        if (result.status == 200) {
          this.dashboardData = result.body;
          this.groupDataByType();
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  GetDashBoardDataMonth() {
    debugger;
    this.dashboardservice.GetDashBoardDataMonth(this.usession.userId).subscribe(
      (result: any) => {
        if (result.status == 200) {
          this.dashboardDataMonth = result.body;
          this.groupDataByTypeMonth();
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  groupDataByType(): void {
    this.groupedData = {};
    this.dashboardData.forEach(item => {
      if (!this.groupedData[item.groupDivisionName]) {
        this.groupedData[item.groupDivisionName] = [];
      }
      this.groupedData[item.groupDivisionName].push(item);
    });
    Object.keys(this.groupedData).forEach((key, index) => {
      this.activeTabs[index] = 'month';
    });
  }
  groupDataByTypeMonth(): void {
    this.groupedDataMonth = {};
    this.dashboardDataMonth.forEach(item => {
      if (!this.groupedDataMonth[item.groupDivisionName]) {
        this.groupedDataMonth[item.groupDivisionName] = [];
      }
      this.groupedDataMonth[item.groupDivisionName].push(item);
    });
    Object.keys(this.groupedDataMonth).forEach((key, index) => {
      this.activeTabs[index] = 'month';
    });
  }
}
