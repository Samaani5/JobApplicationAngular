import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';
import { AddDesignation } from '../../../Models/Masters/add-group-division';
import { ActivatedRoute, Router } from '@angular/router';
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
  constructor(private fb: FormBuilder, private jobapplyservice: JobApplyService, private route: ActivatedRoute, private router: Router) {
    if (this.route.snapshot.params['id'] != null && this.route.snapshot.params['id'] != '' && this.route.snapshot.params['id'] != 'undefined') {
      this.GetDesignationById(Number(this.route.snapshot.params['id']));
      this.isEditMode = true;
    }
    this.DesignationForm = this.fb.group({
      designationId: [0],
      designationName: ['', Validators.required],
      designationCode: ['', Validators.required],
      groupDivisionId: [0, Validators.required],
      active: [1],
    });
    this.GetGroupdivisions();
  }
  ngOnInit(): void {
    const existingData = this.getEditData();
    if (existingData) {
      this.isEditMode = true;
      this.DesignationForm.patchValue(existingData);
    }
  }
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
      groupDivisionId: 0,
      designationName: '',
      designationCode: '',
      active: 1
    }
    this.jobapplyservice.GetDesignationById(this.addDesignation).subscribe(
      (result: any) => {
        if (result.status == 200) {
          const existingData = result.body;
          this.addDesignation.designationId = existingData.designationId;
          this.addDesignation.groupDivisionId = existingData.groupDivisionId;
          this.addDesignation.designationName = existingData.designationName;
          this.addDesignation.designationCode = existingData.designationCode;
          this.addDesignation.active = existingData.active;
          this.isEditMode = true;
          this.DesignationForm.patchValue(this.addDesignation);
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
}
