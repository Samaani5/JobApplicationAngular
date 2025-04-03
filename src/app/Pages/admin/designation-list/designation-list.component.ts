import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AdminComponent } from '../admin.component';
import { FormBuilder, FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../include/pagination/pagination.component';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';
import { DesignationList } from '../../../Models/JobPosting/job-posting';
import { AuthenticationService } from '../../../Services/authentication/authentication.service';

declare var Swal: any;

@Component({
  selector: 'app-designation-list',
  standalone: true,
  imports: [NgFor, CommonModule, NgIf, RouterModule, RouterLink, AdminComponent, FormsModule, PaginationComponent],
  templateUrl: './designation-list.component.html',
  styleUrl: './designation-list.component.css'
})
export class DesignationListComponent {
  groupname: string = 'Masters';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  allDesignationList: any;
  DesignationList: DesignationList[] = [];
  paginatedgroupDesignationList: DesignationList[] = [];

  constructor(private fb: FormBuilder, private jobapplyservice: JobApplyService, private router: Router, private _auth: AuthenticationService) {
    this.GetAllDesignations();
  }
  
  GetAllDesignations() {
    this.jobapplyservice.GetAllDesignations().subscribe(
      (result: any) => {
        if (result.status == 200) {
          this.allDesignationList = result.body;
          this.totalItems = this.allDesignationList.length;
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
    this.paginatedgroupDesignationList = this.allDesignationList.slice(startIndex, endIndex);
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
