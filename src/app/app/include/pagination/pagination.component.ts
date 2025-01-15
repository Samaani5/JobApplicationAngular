import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [NgxPaginationModule, NgFor, FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() itemsPerPage: number = 10;
  @Input() totalItems: number = 0;
  @Input() totalPages: number = 0;
  @Output() pageChanged: EventEmitter<number> = new EventEmitter();
  @Output() pagesizeChanged: EventEmitter<number> = new EventEmitter();
  pageSizes = [10, 25, 50, 100];
  visiblePages: number[] = [];

  constructor() { }

  changePage(page: number): void {
    debugger;
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChanged.emit(page);
    }
  }
  goToPage(page: any): void {

    const pageNumber = parseInt(page.target.value, 10);
    if (pageNumber && pageNumber >= 1 && pageNumber <= this.totalPages && pageNumber !== this.currentPage) {
      this.currentPage = pageNumber;
      this.pageChanged.emit(pageNumber);
    }
  }
  handlePageSizeChange(event: any): void {
    this.itemsPerPage = event.target.value;
    this.pagesizeChanged.emit(this.itemsPerPage);
  }
  generateVisiblePages(): void {
    debugger;
    const visiblePageCount = 5;
    const halfVisiblePages = Math.floor(visiblePageCount / 2);
    let startPage = Math.max(1, this.currentPage - halfVisiblePages);
    let endPage = Math.min(this.totalPages, startPage + visiblePageCount - 1);

    if (endPage - startPage + 1 < visiblePageCount) {
      startPage = Math.max(1, endPage - visiblePageCount + 1);
    }

    this.visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  }

  ngOnChanges(): void {
    this.generateVisiblePages();
  }
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }
  get showingItems(): number {
    return Math.min(this.itemsPerPage, this.totalItems);
  }
}
