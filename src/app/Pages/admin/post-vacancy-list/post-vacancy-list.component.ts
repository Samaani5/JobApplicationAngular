import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { PaginationComponent } from '../../../include/pagination/pagination.component';
import { JobPostingDetailResponse, PostedJobListReq, PostedJobs } from '../../../Models/JobPosting/job-posting';
import { UserSession } from '../../../Models/UserSession/user-session';
import { ApplicantListService } from '../../../Services/ApplicantList/applicant-list.service';
import { AuthenticationService } from '../../../Services/authentication/authentication.service';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';
import { AdminComponent } from '../admin.component';
declare var Swal: any;
declare var $: any;
@Component({
  selector: 'app-post-vacancy-list',
  standalone: true,
  imports: [NgFor, CommonModule, NgIf, RouterModule, RouterLink, AdminComponent, FormsModule, DatePipe, PaginationComponent],
  templateUrl: './post-vacancy-list.component.html',
  styleUrl: './post-vacancy-list.component.css'
})
export class PostVacancyListComponent {
  groupname: string = '';
  GroupDivisionList: any;
  postedJobList: PostedJobs[] = [];
  paginatedApplicantList: PostedJobs[] = [];
  jobreq = new PostedJobListReq;
  jobPostings = new JobPostingDetailResponse;
  jobdetail = new PostedJobs;
  locationList: string = '';
  formData = {
    status: '',
    groupDivision: '',
    searchQuery: ''
  };
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  usession = new UserSession;
  @ViewChild('detailmodal') detailmodal: ElementRef | undefined;

  constructor(private fb: FormBuilder, private jobapplyservice: JobApplyService, private applicantListservice: ApplicantListService,
    private router: Router, private _auth: AuthenticationService) {
    this.usession = JSON.parse((sessionStorage.getItem('session') || '{}'));
    this.GetGroupdivisions();
    this.jobreq = {
      groupDivisionId: 0,
      designationName: '',
      status: '',
      vacancyId:0
    }
    this.JobList(this.jobreq);
  }

  selectedVacancy: any;

  openModal(vacancyId: number) {
    this.jobreq = {
      groupDivisionId: 0,
      designationName: '',
      status: '',
      vacancyId: vacancyId
    }
    this.applicantListservice.JobDetailViaVacancyId(this.jobreq).subscribe(
      (result: any) => {
        this.jobPostings = result.body;
        this.jobdetail = this.jobPostings.vacancies[0];
        this.locationList = this.jobPostings.vacancyLocations.map(loc => loc.location).join(', ');
        $(this.detailmodal?.nativeElement).modal('show');
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  GetGroupdivisions() {
    this.jobapplyservice.GetGroupdivisions().subscribe(
      (result: any) => {
        if (result.status == 200) {
          let allGroupDivisions = result.body;
          const userGroupDivisions: number[] = this.usession.userGroupDivisions || [];
          if (this.usession.roleId !== 1) {
            this.GroupDivisionList = allGroupDivisions.filter((group: any) =>
              userGroupDivisions.includes(group.divisionId)
            );
          } else {
            this.GroupDivisionList = allGroupDivisions;
          }
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  JobList(model: PostedJobListReq) {
    this.applicantListservice.JobList(model).subscribe(
      (result: any) => {
        if (result.status == 200) {
          this.postedJobList = result.body;
          this.totalItems = this.postedJobList.length;
          this.calculateTotalPages();
          this.updatePagination();
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }

  onSubmit() {
    //this.GetSearchDataPhotoSmart();
  }
  calculateTotalPages() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * Number(this.itemsPerPage);
    const endIndex = startIndex + Number(this.itemsPerPage);
    this.paginatedApplicantList = this.postedJobList.slice(startIndex, endIndex);
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.updatePagination();
  }

  onPagesizeChange(newPageSize: number) {
    this.itemsPerPage = newPageSize;
    this.currentPage = 1;
    this.calculateTotalPages();
    this.updatePagination();
  }
  hasAccess(allowedRoles: number[]): boolean {
    return this._auth.hasAccess(allowedRoles);
  }
}
