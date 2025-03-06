import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AddStepMaster } from '../../../Models/Masters/add-group-division';
import { UserSession } from '../../../Models/UserSession/user-session';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
declare var Swal: any;
@Component({
  selector: 'app-add-step-master',
  standalone: true,
  imports: [NgClass, NgIf, FormsModule, ReactiveFormsModule, NgFor],
  templateUrl: './add-step-master.component.html',
  styleUrl: './add-step-master.component.css'
})
export class AddStepMasterComponent {
  StepForm: FormGroup;
  isEditMode: boolean = false;
  submitted: boolean = false;
  GroupDivisionList: any;
  addStep = new AddStepMaster;
  usession = new UserSession;
  allStepsList: any[] = [];
  stepSuggestions: any[] = [];
  filteredLocations: any[] = [];
  selectedDivisions: number[] = [];
  searchTerms = new Subject<string>();
  constructor(private fb: FormBuilder, private jobapplyservice: JobApplyService, private route: ActivatedRoute, private router: Router) {
    this.usession = JSON.parse((sessionStorage.getItem('session') || '{}'));
    if (this.route.snapshot.params['id'] != null && this.route.snapshot.params['id'] != '' && this.route.snapshot.params['id'] != 'undefined') {
      this.GetStepById(Number(this.route.snapshot.params['id']));
      this.isEditMode = true;
    }
    this.StepForm = this.fb.group({
      stepId: [0],
      name: ['', Validators.required],
      orderNo: [, Validators.required],
      emailAddress: [''],
      active: [1],
    });
  }
  ngOnInit(): void {
    this.GetAllSteps();
    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map((term) => this.filterLocations(term))
      )
      .subscribe((filtered) => {
        this.filteredLocations = filtered;
      });
    const existingData = this.getEditData();
    if (existingData) {
      this.isEditMode = true;
      this.StepForm.patchValue(existingData);
    }
  }

  GetAllSteps() {
    this.jobapplyservice.GetAllSteps().subscribe(
      (result: any) => {
        if (result.status === 200) {
          this.allStepsList = result.body;
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: 'error',
        });
      }
    );
  }

  onSearch(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.stepSuggestions = this.filterLocations(inputValue);
  }

  filterLocations(term: string): any[] {
    if (!term) {
      return [];
    }
    return this.allStepsList.filter((step) =>
      step.name.toLowerCase().includes(term.toLowerCase())
    );
  }
  selectLocation(step: any) {
    this.StepForm.patchValue({ name: step.name });
    this.stepSuggestions = [];
  }
  getEditData() {
    return null;
  }
  GetStepById(designationId: number) {
    this.addStep = {
      stepId: designationId,
      name: '',
      emailAddress: '',
      orderNo: 0,
      active: 1
    }
    this.jobapplyservice.GetStepById(this.addStep).subscribe(
      (result: any) => {
        if (result.status == 200) {
          const existingData = result.body;
          this.addStep.stepId = existingData.stepId;
          this.addStep.name = existingData.name;
          this.addStep.orderNo = existingData.orderNo;
          this.addStep.active = existingData.active;
          this.isEditMode = true;
          this.StepForm.patchValue({
            stepId: this.addStep.stepId,
            name: this.addStep.name,
            orderNo: this.addStep.orderNo,
            emailAddress: this.addStep.emailAddress,
            active: this.addStep.active
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
    if (this.StepForm.invalid) {
      this.StepForm.markAllAsTouched();
      return;
    }
    this.StepForm.patchValue({ emailAddress: this.usession.emailAddress });
    const formData = this.StepForm.value;
    this.jobapplyservice.AddStepMaster(formData).subscribe(
      (result: any) => {
        if (result.status === 200) {
          Swal.fire({
            text: 'Step saved successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result: { isConfirmed: any; }) => {
            if (result.isConfirmed) {
              if (this.isEditMode == true)
                this.router.navigate(['/admin/step-master-list']);
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

