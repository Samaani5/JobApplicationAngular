import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';
import { AddDesignation } from '../../../Models/Masters/add-group-division';
import { ActivatedRoute, Router } from '@angular/router';
import { atLeastOneCheckboxChecked } from '../../../Validators/customvalidator';
declare var Swal: any;

@Component({
  selector: 'app-add-designation',
  standalone: true,
  imports: [NgClass, NgIf, FormsModule, ReactiveFormsModule, NgFor],
  templateUrl: './add-designation.component.html',
  styleUrl: './add-designation.component.css'
})
export class AddDesignationComponent {
  DesignationForm: FormGroup;
  isEditMode: boolean = false;
  submitted: boolean = false;
  addDesignation = new AddDesignation;
  GroupDivisionList: any;
  allDesignationList: any[] = [];
  designationSuggestions: any[] = [];
  filteredDesignation: any[] = [];
  selectedDivisions: number[] = [];
  searchTerms = new Subject<string>(); 
  constructor(private fb: FormBuilder, private jobapplyservice: JobApplyService, private route: ActivatedRoute, private router: Router) {
    if (this.route.snapshot.params['id'] != null && this.route.snapshot.params['id'] != '' && this.route.snapshot.params['id'] != 'undefined') {
      this.GetDesignationById(Number(this.route.snapshot.params['id']));
      this.isEditMode = true;
    }
    this.DesignationForm = this.fb.group({
      designationId: [0],
      designationName: ['', Validators.required],
      designationCode: ['', Validators.required],
      groupDivisionId: [[], atLeastOneCheckboxChecked()],
      active: [1],
    });
    this.GetGroupdivisions();
  }
  ngOnInit(): void {
    this.GetAllDesignations();
    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map((term) => this.filteredDesignations(term))
      )
      .subscribe((filtered) => {
        this.filteredDesignation = filtered;
      });
    const existingData = this.getEditData();
    if (existingData) {
      this.isEditMode = true;
      this.DesignationForm.patchValue(existingData);
    }
  }
  GetAllDesignations() {
    this.jobapplyservice.GetAllDesignations().subscribe(
      (result: any) => {
        if (result.status == 200) {
          this.allDesignationList = result.body;
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

    this.designationSuggestions = this.filteredDesignations(inputValue);
  }
  filteredDesignations(term: string): any[] {
    if (!term) {
      return [];
    }
    return this.allDesignationList.filter((designation) =>
      designation.designationName.toLowerCase().includes(term.toLowerCase())
    );
  }

  //selectDesignation(designation: any) {
  //  this.DesignationForm.patchValue({ name: designation.designationName });
  //  this.designationSuggestions = [];
  //}
  getEditData() {
    return null;
  }
  GetGroupdivisions() {
    this.jobapplyservice.GetGroupdivisions().subscribe(
      (result: any) => {
        if (result.status == 200) {
          this.GroupDivisionList = result.body;
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }

  GetDesignationById(designationId: number) {
    this.addDesignation = {
      designationId: designationId,
      groupDivisionId: [],
      designationName: '',
      designationCode: '',
      active: 1
    }
    this.jobapplyservice.GetDesignationById(this.addDesignation).subscribe(
      (result: any) => {
        if (result.status == 200) {
          const existingData = result.body;
          this.addDesignation.designationId = existingData.designationId;
          this.addDesignation.designationName = existingData.designationName;
          this.addDesignation.designationCode = existingData.designationCode;
          this.addDesignation.active = existingData.active;
          this.addDesignation.active = existingData.active; this.addDesignation.groupDivisionId = existingData.groupDivisionIds
            .split(',')
            .map((id: string) => parseInt(id.trim(), 10));
          this.isEditMode = true;
          this.selectedDivisions = this.addDesignation.groupDivisionId;
          this.DesignationForm.patchValue({
            designationId: this.addDesignation.designationId,
            groupDivisionId: this.addDesignation.groupDivisionId,
            designationName: this.addDesignation.designationName,
            designationCode: this.addDesignation.designationCode,
            active: this.addDesignation.active
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

  onSubmit(): void {
    this.submitted = true;
    if (this.DesignationForm.invalid) {
      return;
    }
    const formData = this.DesignationForm.value;
    this.jobapplyservice.AddDesignation(formData).subscribe(
      (result: any) => {
        if (result.status === 200) {
          Swal.fire({
            text: 'Designation saved successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result: { isConfirmed: any; }) => {
            if (result.isConfirmed) {
              if (this.isEditMode == true)
                this.router.navigate(['/admin/designation-list']);
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
  onDivisionChange(divisionId: number, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedDivisions.push(divisionId);
    } else {
      const index = this.selectedDivisions.indexOf(divisionId);
      if (index > -1) {
        this.selectedDivisions.splice(index, 1);
      }
    }
    this.DesignationForm.get('groupDivisionId')?.setValue(this.selectedDivisions);
  }
}
