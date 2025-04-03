import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AdminComponent } from '../admin.component';
import { FormBuilder, FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../include/pagination/pagination.component';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';
import { LocationList } from '../../../Models/JobPosting/job-posting';
import { AuthenticationService } from '../../../Services/authentication/authentication.service';
declare var Swal: any;

@Component({
  selector: 'app-zone-list',
  standalone: true,
  imports: [NgFor, CommonModule, NgIf, RouterModule, RouterLink, AdminComponent, FormsModule, PaginationComponent],
  templateUrl: './zone-list.component.html',
  styleUrl: './zone-list.component.css'
})
export class ZoneListComponent {
  groupname: string = 'Masters';
  allLocationList: any;
  locationList: LocationList[] = [];
  paginatedlocationList: LocationList[] = []
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(private fb: FormBuilder, private jobapplyservice: JobApplyService, private router: Router, private _auth: AuthenticationService) {
    this.GetAllLocations();
  }

  GetAllLocations(){
    this.jobapplyservice.GetAllLocations().subscribe(
      (result: any) => {
        if (result.status == 200) {
          this.allLocationList = result.body;
          this.totalItems = this.allLocationList.length;
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
    this.paginatedlocationList = this.allLocationList.slice(startIndex, endIndex);
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
