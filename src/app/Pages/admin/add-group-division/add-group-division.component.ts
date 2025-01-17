import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AddGroupDivision } from '../../../Models/Masters/add-group-division';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';
declare var Swal: any;
@Component({
  selector: 'app-add-group-division',
  standalone: true,
  imports: [NgClass, NgIf, FormsModule, ReactiveFormsModule, NgFor],
  templateUrl: './add-group-division.component.html',
  styleUrl: './add-group-division.component.css'
})
export class AddGroupDivisionComponent {
  groupDivisionForm: FormGroup;
  isEditMode: boolean = false;
  submitted: boolean = false;
  addGroupDivision = new AddGroupDivision;
  groupDivisionId = 0;
  allGroupDivisionList: any[] = []; 
  groupDivisionSuggestions: any[] = [];
  filteredGroupDivision: any[] = [];
  searchTerms = new Subject<string>(); 
  constructor(private fb: FormBuilder, private jobapplyservice: JobApplyService, private route: ActivatedRoute, private router: Router) {
    if (this.route.snapshot.params['id'] != null && this.route.snapshot.params['id'] != '' && this.route.snapshot.params['id'] != 'undefined') {
      this.GetGroupdivisionById(Number(this.route.snapshot.params['id']));
      this.isEditMode = true;
    }
    this.groupDivisionForm = this.fb.group({
      groupDivisionId: [0],
      name: ['', Validators.required],
      active: [1],
    });
  }
  ngOnInit(): void {
    this.GetAllGroupdivisions();

    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map((term) => this.filteredGroupDivisions(term))
      )
      .subscribe((filtered) => {
        this.filteredGroupDivision = filtered;
      });
    
  }
  GetAllGroupdivisions() {
    this.jobapplyservice.GetAllGroupdivisions().subscribe(
      (result: any) => {
        if (result.status == 200) {
          this.allGroupDivisionList = result.body;
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  onSearch(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;

    this.groupDivisionSuggestions = this.filteredGroupDivisions(inputValue);
  }
  filteredGroupDivisions(term: string): any[] {
    if (!term) {
      return [];
    }
    return this.allGroupDivisionList.filter((groupDivision) =>
      groupDivision.name.toLowerCase().includes(term.toLowerCase())
    );
  }

  //selectGroupDivision(groupDivision: any) {
  //  this.groupDivisionForm.patchValue({ name: groupDivision.name });
  //  this.groupDivisionSuggestions = [];
  //}
  GetGroupdivisionById(groupDivisionId: number) {
    this.addGroupDivision = {
      groupDivisionId: groupDivisionId,
      name: '',
      active: 1
    }
    this.jobapplyservice.GetGroupdivisionById(this.addGroupDivision).subscribe(
      (result: any) => {
        if (result.status == 200) {
          const existingData = result.body;
          this.addGroupDivision.groupDivisionId = existingData.divisionId;
          this.addGroupDivision.name = existingData.name; 
          this.addGroupDivision.active = existingData.active;
          this.isEditMode = true;
          this.groupDivisionForm.patchValue(this.addGroupDivision);
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  onSubmit(): void {
    this.submitted = true;
    if (this.groupDivisionForm.invalid) {
      return;
    }
    const formData = this.groupDivisionForm.value;
    this.jobapplyservice.AddGroupDivision(formData).subscribe(
      (result: any) => {
        if (result.status === 200) {
          Swal.fire({
            text: 'Group division saved successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result: { isConfirmed: any; }) => {
            if (result.isConfirmed) {
              if (this.isEditMode == true)
                this.router.navigate(['/admin/group-division-list']);
              else
                window.location.reload();
            }
          });
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
}
