import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { PaginationComponent } from '../../../include/pagination/pagination.component';
import { UserList } from '../../../Models/user/user';
import { AuthenticationService } from '../../../Services/authentication/authentication.service';
import { UserService } from '../../../Services/user/user.service';
import { AdminComponent } from '../admin.component';
declare var Swal: any;
@Component({
  selector: 'app-user-management-list',
  standalone: true,
  imports: [NgFor, CommonModule, NgIf, RouterModule, RouterLink, AdminComponent, FormsModule, PaginationComponent, DatePipe],
  templateUrl: './user-management-list.component.html',
  styleUrl: './user-management-list.component.css'
})
export class UserManagementListComponent {
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  allUsersList: any;
  paginatedgroupUserList: UserList[] = [];

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private _auth: AuthenticationService) {
    this.GetAllUsers();
  }

  GetAllUsers() {
    this.userService.getUsers().subscribe(
      (result: any) => {
        if (result.status == 200) {
          this.allUsersList = result.body;
          this.totalItems = this.allUsersList.length;
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
    this.paginatedgroupUserList = this.allUsersList.slice(startIndex, endIndex);
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
