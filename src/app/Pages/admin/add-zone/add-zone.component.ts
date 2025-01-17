import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AddZone } from '../../../Models/Masters/add-group-division';
import { UserSession } from '../../../Models/UserSession/user-session';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';
declare var Swal: any;

@Component({
  selector: 'app-add-zone',
  standalone: true,
  imports: [NgClass, NgIf, FormsModule, ReactiveFormsModule, NgFor],
  templateUrl: './add-zone.component.html',
  styleUrl: './add-zone.component.css'
})
export class AddZoneComponent {
  ZoneForm: FormGroup;
  isEditMode: boolean = false;
  submitted: boolean = false;
  GroupDivisionList: any;
  addLocation = new AddZone;
  usession = new UserSession;
  allLocationList: any[] = [];  
  locationSuggestions: any[] = [];
  filteredLocations: any[] = [];
  selectedDivisions: number[] = [];
  searchTerms = new Subject<string>(); 
  constructor(private fb: FormBuilder, private jobapplyservice: JobApplyService, private route: ActivatedRoute, private router: Router) {
    this.usession = JSON.parse((sessionStorage.getItem('session') || '{}'));
    if (this.route.snapshot.params['id'] != null && this.route.snapshot.params['id'] != '' && this.route.snapshot.params['id'] != 'undefined') {
      this.GetLocationById(Number(this.route.snapshot.params['id']));
      this.isEditMode = true;
    }
    this.ZoneForm = this.fb.group({
      zoneId: [0],
      name: ['', Validators.required],
      emailAddress: [''],
      groupDivisionId: [[]],
      active: [1],
    });
    this.GetGroupdivisions();
  }
  ngOnInit(): void {
    this.GetAllLocations();

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
      this.ZoneForm.patchValue(existingData);
    }
   
  }

  GetAllLocations() {
    this.jobapplyservice.GetAllLocations().subscribe(
      (result: any) => {
        if (result.status === 200) {
          this.allLocationList = result.body;
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

    this.locationSuggestions = this.filterLocations(inputValue);
  }

  filterLocations(term: string): any[] {
    if (!term) {
      return []; 
    }
    return this.allLocationList.filter((location) =>
      location.location.toLowerCase().includes(term.toLowerCase()) 
    );
  }

  selectLocation(location: any) {
    this.ZoneForm.patchValue({ name: location.location });
    this.locationSuggestions = []; 
  }

 getEditData() {
    return null;
  }
  GetLocationById(designationId: number) {
    this.addLocation = {
      zoneId: designationId,
      groupDivisionId: [],
      name: '',
      emailAddress: '',
      active: 1
    }
    this.jobapplyservice.GetLocationById(this.addLocation).subscribe(
      (result: any) => {
        if (result.status == 200) {
          const existingData = result.body[0];
          this.addLocation.zoneId = existingData.locationId;
          this.addLocation.name = existingData.location;
          this.addLocation.active = existingData.active; this.addLocation.groupDivisionId = existingData.groupDivisionIds
            .split(',')
            .map((id: string) => parseInt(id.trim(), 10));
          this.isEditMode = true;
          this.selectedDivisions = this.addLocation.groupDivisionId;
          this.ZoneForm.patchValue({
            zoneId: this.addLocation.zoneId,
            groupDivisionId: this.addLocation.groupDivisionId,
            name: this.addLocation.name,
            emailAddress: this.addLocation.emailAddress,
            active: this.addLocation.active
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
  onSubmit(): void {
    this.submitted = true;
    if (this.ZoneForm.invalid) {
      return;
    }
    this.ZoneForm.patchValue({ emailAddress: this.usession.emailAddress });
    const formData = this.ZoneForm.value;
    this.jobapplyservice.AddZone(formData).subscribe(
      (result: any) => {
        if (result.status === 200) {
          Swal.fire({
            text: 'Location saved successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result: { isConfirmed: any; }) => {
            if (result.isConfirmed) {
              if (this.isEditMode == true)
                this.router.navigate(['/admin/zone-list']);
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
    this.ZoneForm.get('groupDivisionId')?.setValue(this.selectedDivisions);
  }
}
