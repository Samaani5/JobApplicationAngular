import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AddSubDivision } from '../../../Models/Masters/add-group-division';
import { UserSession } from '../../../Models/UserSession/user-session';
import { LocationList } from '../../../Models/JobPosting/job-posting';
declare var Swal : any;

@Component({
  selector: 'app-add-sub-division',
  standalone: true,
  imports: [NgClass, NgIf, FormsModule, ReactiveFormsModule, NgFor],
  templateUrl: './add-sub-division.component.html',
  styleUrl: './add-sub-division.component.css'
})
export class AddSubDivisionComponent {
   SubDivisionForm: FormGroup;
    isEditMode: boolean = false;
    submitted: boolean = false;
    addSubDivision = new AddSubDivision;
    SubDivisionList: any;
    GroupDivisionList: any;
  LocationList: LocationList[] = [];
  allSubDivisionList: any[] = [];
  subDivisionSuggestions: any[] = [];
  filteredSubDivision: any[] = [];
  searchTerms = new Subject<string>();
    usession = new UserSession;
   constructor(private fb: FormBuilder, private jobapplyservice: JobApplyService, private route: ActivatedRoute, private router: Router) {
     this.usession = JSON.parse((sessionStorage.getItem('session') || '{}'));
     const id = this.route.snapshot.paramMap.get('id');
     const groupDivisionId = this.route.snapshot.paramMap.get('groupDivisionId');
    if (id != null && id != '' && id != 'undefined') {
      this.GetSubDivisionById(Number(id), Number(groupDivisionId));
      this.isEditMode = true;
    }
    this.SubDivisionForm = this.fb.group({
      revenueId: [0],
      revenueTown: ['', Validators.required],
      emailAddress: [''],
      zoneId: [0, Validators.required],
      groupDivisionId: [0, Validators.required],
      mrCount: [0, Validators.required],
      svCount: [0, Validators.required],
      active: [1],
    }, { validators: this.validateCounts });
    this.GetGroupdivisions();
  }
  validateCounts(formGroup: AbstractControl): ValidationErrors | null {
    const mrCountControl = formGroup.get('mrCount');
    const svCountControl = formGroup.get('svCount');
    let hasError = false;
    if (mrCountControl?.value <= 0) {
      mrCountControl?.setErrors({ invalidCount: 'MR Count must be greater than 0' });
      hasError = true;
    } else {
      mrCountControl?.setErrors(null);
    }

    if (svCountControl?.value <= 0) {
      svCountControl?.setErrors({ invalidCount: 'SV Count must be greater than 0' });
      hasError = true;
    } else {
      svCountControl?.setErrors(null);
    }

    return hasError ? { invalidForm: true } : null;
  }

  ngOnInit(): void {
    this.GetAllSubDivision();
    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map((term) => this.filteredSubDivisions(term))
      )
      .subscribe((filtered) => {
        this.filteredSubDivision = filtered;
      });
    const existingData = this.getEditData();
    if (existingData) {
      this.isEditMode = true;
      this.SubDivisionForm.patchValue(existingData);
    }
  }

  GetAllSubDivision() {
    this.jobapplyservice.GetAllSubDivision().subscribe(
      (result: any) => {
        if (result.status == 200) {
          this.allSubDivisionList = result.body;
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

    this.subDivisionSuggestions = this.filteredSubDivisions(inputValue);
  }
  filteredSubDivisions(term: string): any[] {
    if (!term) {
      return [];
    }
    return this.allSubDivisionList.filter((subDivision) =>
      subDivision.revenueTown.toLowerCase().includes(term.toLowerCase())
    );
  }

  //selectSubDivision(subDivision: any) {
  //  this.SubDivisionForm.patchValue({ name: subDivision.revenueTown });
  //  this.subDivisionSuggestions = [];
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
  GetLocation(groupId: number) {
    this.jobapplyservice.GetLocation(groupId).subscribe(
      (result: any) => {
        this.LocationList = result;
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }

  GetSubDivisionById(revenueId: number, groupDivisionId: number) {
    this.addSubDivision = {
      id: revenueId,
      revenueId:0,
      zoneId: 0,
      revenueTown: '',
      emailAddress: '',
      townType: '',
      name:'',
      groupDivisionId: groupDivisionId,
      active: 1,
      mrCount: 0,
      svCount: 0
    }
    this.jobapplyservice.GetSubDivisionById(this.addSubDivision).subscribe(
      (result: any) => {
        if (result.status == 200) {
          const existingData = result.body;
          this.addSubDivision.revenueId = existingData.id;
          this.addSubDivision.zoneId = existingData.zoneId;
          this.addSubDivision.groupDivisionId = existingData.groupDivisionId;
          this.addSubDivision.revenueTown = existingData.revenueTown;
          this.addSubDivision.emailAddress = existingData.emailAddress;
          this.addSubDivision.active = existingData.active;
          this.addSubDivision.mrCount = existingData.mrCount;
          this.addSubDivision.svCount = existingData.svCount;
          this.isEditMode = true;
          this.GetLocation(this.addSubDivision.groupDivisionId);
          this.SubDivisionForm.patchValue(this.addSubDivision);
          
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
    if (this.SubDivisionForm.invalid) {
      return;
    }
    this.SubDivisionForm.patchValue({ emailAddress: this.usession.emailAddress });
    const formData = this.SubDivisionForm.value;
    this.jobapplyservice.AddSubDivision(formData).subscribe(
      (result: any) => {
        if (result.status === 200) {
          Swal.fire({
            text: 'Sub Division saved successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result: { isConfirmed: any; }) => {
            if (result.isConfirmed) {
              if (this.isEditMode == true)
                this.router.navigate(['/admin/sub-division-list']);
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
  showOptions(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.GetLocation(Number(selectedValue));
  }
}
