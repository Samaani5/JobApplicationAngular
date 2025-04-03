import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { LocationItem } from '../../../Models/JobApplication/language-labels';
import { User } from '../../../Models/user/user';
import { UserSession } from '../../../Models/UserSession/user-session';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';
import { UserService } from '../../../Services/user/user.service';
declare var Swal: any;
@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [NgFor, CommonModule, NgIf, RouterModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  adduser = new User();
  userForm: FormGroup;
  GroupDivisionList: any;
  LocationList: LocationItem[] = [];
  private debounceTimer: any;
  usession = new UserSession;
  isEditMode: boolean = false;
  RoleList: any;
  selectedZones: any = [];
  selectedImage: string | ArrayBuffer | null = '';

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private jobapplyservice: JobApplyService, private route: ActivatedRoute) {
    this.usession = JSON.parse((sessionStorage.getItem('session') || '{}'));
    if (this.route.snapshot.params['id'] != null && this.route.snapshot.params['id'] != '' && this.route.snapshot.params['id'] != 'undefined') {
      this.GetUserById(Number(this.route.snapshot.params['id']));
      this.isEditMode = true;
    }
    this.userForm = this.fb.group({
      id: [0],
      divisions: this.fb.array([]),
      zones: this.fb.array([]),
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      status: [1],
      userPhoto: [''],
    });
  }
  GetUserById(Id: number) {
    this.userService.getUserById(Id).subscribe(
      (result: any) => {
        if (result.status == 200) {
          const users = result.body.users[0];
          this.adduser.userId = users.userId;
          this.adduser.name = users.name;
          this.adduser.emailAddress = users.emailAddress;
          this.adduser.roleId = users.roleId;
          this.adduser.status = users.status == 'Active' ? 1 : 0;
          this.adduser.userPhoto = users.userPhoto;
          this.isEditMode = true;
          this.userForm.patchValue({
            id: this.adduser.userId,
            name: this.adduser.name,
            email: this.adduser.emailAddress,
            role: this.adduser.roleId,
            status: this.adduser.status,
            userPhoto: this.adduser.userPhoto
          });
          if (this.adduser.userPhoto) {
            this.selectedImage = this.adduser.userPhoto; 
          }
          const userGroupDivisions = result.body.userGroupDivisions.map((loc: any) => loc.groupDivisionId);
          const userZones = result.body.userZones.map((step: any) => step.zoneId);
          this.selectedZones = userZones;
          this.GetGroupdivisions(userGroupDivisions, userZones);
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  get divisionsFormArray(): FormArray {
    return this.userForm.get('divisions') as FormArray;
  }

  get zonesFormArray(): FormArray {
    return this.userForm.get('zones') as FormArray;
  }
  ngOnInit(): void {
    this.GetGroupdivisions();
    this.GetRoles();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const selectedGroupDivisions = this.divisionsFormArray.controls
        .filter((control: any) => control.value.isChecked)
        .map((control: any) => control.value.id);
      const selectedLocations = this.zonesFormArray.controls
        .filter((control: any) => control.value.isChecked)
        .map((control: any) => control.value.id);
      this.adduser = {
        userId: Number(this.userForm.value.id),
        name: this.userForm.value.name,
        emailAddress: this.userForm.value.email,
        groupDivisionIds: selectedGroupDivisions,
        zoneIds: selectedLocations,
        roleId: Number(this.userForm.value.role),
        createdBy: this.usession.emailAddress,
        userPhoto: this.userForm.value.userPhoto,
        status: this.userForm.value.status
      }
      if (this.userForm.value.id == 0) {
        this.userService.SaveUserInfo(this.adduser).subscribe(
          (result: any) => {
            if (result.status === 200) {
              Swal.fire({
                text: 'User Added successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
              }).then((result: { isConfirmed: any; }) => {
                if (result.isConfirmed) {
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
      else {
        this.userService.UpdateUserInfo(this.adduser).subscribe(
          (result: any) => {
            if (result.status === 200) {
              Swal.fire({
                text: 'User updated successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
              }).then((result: { isConfirmed: any; }) => {
                if (result.isConfirmed) {
                  this.router.navigate(['/admin/user-management-list']);
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
  }
  GetGroupdivisions(selectedStepIds: number[] = [], selectedZones: number[] = []) {
    this.jobapplyservice.GetGroupdivisions().subscribe(
      (result: any) => {
        if (result.status === 200) {
          this.GroupDivisionList = result.body;
          const GDArray = this.divisionsFormArray;
          GDArray.clear();

          this.GroupDivisionList.forEach((gd: { divisionId: any; }) => {
            const isChecked = selectedStepIds.includes(gd.divisionId);
            GDArray.push(
              this.fb.group({
                id: [gd.divisionId],
                isChecked: [isChecked],
              })
            );
            if (isChecked) {
              this.GetLocation(gd.divisionId, selectedZones);
            }
          });
          this.divisionsFormArray.controls.forEach((control, index) => {
            control.get('isChecked')?.valueChanges.subscribe(isChecked => {
              this.onDivisionCheckboxChange(this.GroupDivisionList[index].divisionId, isChecked);
            });
          });
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: 'error'
        });
      }
    );
  }
  onDivisionCheckboxChange(divisionId: number, isChecked: boolean): void {
    if (isChecked) {
      this.GetLocationWithDebounce(divisionId, this.selectedZones);
    } else {
      this.removeLocationByDivision(divisionId, this.selectedZones);
    }
  }
  removeLocationByDivision(divisionId: number, vacancyLocations: number[] = []) {
    this.LocationList.forEach(location => {
      const index = location.divisionIds.indexOf(divisionId);
      if (index !== -1) {
        location.divisionIds.splice(index, 1);
      }
    });
    this.LocationList = this.LocationList.filter(location => location.divisionIds.length > 0);
    const locationsArray = this.zonesFormArray;
    locationsArray.clear();
    this.LocationList.forEach(location => {
      locationsArray.push(
        this.fb.group({
          id: [location.locationId],
          isChecked: [vacancyLocations.includes(location.locationId)], 
        })
      );
    });
  }
  GetLocationWithDebounce(groupId: number, vacancyLocations: number[] = []) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.GetLocation(groupId, vacancyLocations);
    }, 100);
  }
  GetLocation(groupId: number, vacancyLocations: number[] = []) {
    this.jobapplyservice.GetLocation(groupId).subscribe(
      (result: any[]) => {
        result.forEach(location => {
          const existingLocation = this.LocationList.find(loc => loc.locationId === location.locationId);
          if (existingLocation) {
            if (!existingLocation.divisionIds.includes(groupId)) {
              existingLocation.divisionIds.push(groupId);
            }
          } else {
            this.LocationList.push({
              locationId: location.locationId,
              location: location.location,
              divisionIds: [groupId],
            });
          }
        });
        const locationsArray = this.zonesFormArray;
        locationsArray.clear();
        this.LocationList.forEach(location => {
          locationsArray.push(
            this.fb.group({
              id: [location.locationId],
              isChecked: [vacancyLocations.includes(location.locationId)],
            })
          );
        });
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: 'error',
        });
      }
    );
  }
  onZoneCheckboxChange(index: number, event: Event) {
    const inputElement = event.target as HTMLInputElement; 
    this.zonesFormArray.at(index).patchValue({ isChecked: inputElement.checked });
    console.log(`Zone ${index} checked:`, inputElement.checked);
  }
  GetRoles() {
    this.userService.GetRoles().subscribe(
      (result: any) => {
        if (result.status == 200) {
          this.RoleList = result.body;
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.selectedImage = reader.result; 
        this.userForm.patchValue({ userPhoto: reader.result }); 
      };
    }
  }
}

