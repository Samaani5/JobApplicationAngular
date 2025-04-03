import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { PaginationComponent } from '../../../include/pagination/pagination.component';
import { SubDivisionList } from '../../../Models/JobPosting/job-posting';
import { AuthenticationService } from '../../../Services/authentication/authentication.service';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';
import { AdminComponent } from '../admin.component';
declare var Swal: any;
@Component({
  selector: 'app-sub-division-list',
  standalone: true,
  imports: [NgFor, CommonModule, NgIf, RouterModule, RouterLink, AdminComponent, FormsModule, PaginationComponent],
  templateUrl: './sub-division-list.component.html',
  styleUrl: './sub-division-list.component.css'
})
export class SubDivisionListComponent {
  groupname: string = 'Masters';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  allSubDivisionList: any;
  SubDivisionList: SubDivisionList[] = [];
  paginatedSubDivisionList: SubDivisionList[] = [];

  constructor(private fb: FormBuilder, private jobapplyservice: JobApplyService, private router: Router, private _auth: AuthenticationService) {
    this.GetAllSubDivision();
  }

  GetAllSubDivision() {
    this.jobapplyservice.GetAllSubDivision().subscribe(
      (result: any) => {
        if (result.status == 200) {
          this.allSubDivisionList = result.body;
          this.totalItems = this.allSubDivisionList.length;
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

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * Number(this.itemsPerPage);
    const endIndex = startIndex + Number(this.itemsPerPage);
    this.paginatedSubDivisionList = this.allSubDivisionList.slice(startIndex, endIndex);
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
