import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AddGroupDivision } from '../../../Models/Masters/add-group-division';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';
declare var Swal: any;
@Component({
  selector: 'app-add-group-division',
  standalone: true,
  imports: [NgClass, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './add-group-division.component.html',
  styleUrl: './add-group-division.component.css'
})
export class AddGroupDivisionComponent {
  groupDivisionForm: FormGroup;
  isEditMode: boolean = false;
  submitted: boolean = false;
  addGroupDivision = new AddGroupDivision;
  groupDivisionId = 0;
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
  }
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
