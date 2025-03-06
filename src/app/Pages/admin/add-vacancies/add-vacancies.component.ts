import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router, RouterLink, RouterModule } from '@angular/router';
// import { BsDatepickerModule, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DashboardService } from '../../../Services/Dashboard/dashboard.service';
import { AddVacancy } from '../../../Models/AddVacancy/add-vacancy';
import { ApplicantListService } from '../../../Services/ApplicantList/applicant-list.service';
import { DesignationItem, LocationItem, ProjectItem } from '../../../Models/JobApplication/language-labels';
import { JobApplyComponent } from '../../home/job-apply/job-apply.component';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';
import { UserSession } from '../../../Models/UserSession/user-session';
import { PostedJobListReq } from '../../../Models/JobPosting/job-posting';
declare var $: any;
declare var Swal: any;
declare var CKEDITOR: any;
@Component({
  selector: 'app-add-vacancies',
  standalone: true,
  imports: [NgFor, CommonModule, NgIf, RouterModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './add-vacancies.component.html',
  styleUrl: './add-vacancies.component.css'
})
export class AddVacanciesComponent {
  DesignationList: DesignationItem[] = [];
  ProjectList: ProjectItem[] = [];
  GroupDivisionList: any;
  LocationList: LocationItem[] = [];
  vacancyForm!: FormGroup;
  addvacancymodel = new AddVacancy;
  usession = new UserSession;
  selectedStateId = 0;
  jobreq = new PostedJobListReq;
  private debounceTimer: any;

  constructor(private fb: FormBuilder, private jobapplyservice: JobApplyService, private applicantservice: ApplicantListService, private route: ActivatedRoute, private router: Router) {
    this.usession = JSON.parse((sessionStorage.getItem('session') || '{}'));
    if (this.route.snapshot.params['id'] != null && this.route.snapshot.params['id'] != '' && this.route.snapshot.params['id'] != 'undefined') {
      this.getVacancy(this.route.snapshot.params['id']);
    }
    this.vacancyForm = this.fb.group({
      vacancyId: [0],
      groupDivisionId: ['', Validators.required],
      designationId: ['', Validators.required],
      projectId: ['', Validators.required],
      projectName: [''],
      locations: this.fb.array([]),
      experienceFrom: ['', [Validators.required, Validators.min(0)]],
      experienceTo: ['', [Validators.required, Validators.min(0)]],
      qualification: ['', Validators.required],
      jobDescription: ['', Validators.required],
      keySkills: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      statusId: [],
    });
    this.GetGroupdivisions();
  }
  formatDate(date: string): string {
    if (!date) {
      return '';
    }
    const d = new Date(date);
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
  getVacancy(vacancyId: number) {
    this.jobreq = {
      groupDivisionId: 0,
      designationName: '',
      status: '',
      vacancyId: vacancyId
    }
    this.applicantservice.JobDetailViaVacancyId(this.jobreq).subscribe(
      (result: any) => {
        const vacancyData = result.body.vacancies[0];
        this.vacancyForm.patchValue({
          vacancyId: vacancyData.vacancyId,
          groupDivisionId: vacancyData.groupDivisionId,
          designationId: vacancyData.positionId,
          projectName: vacancyData.projectName,
          experienceFrom: vacancyData.experienceFrom,
          experienceTo: vacancyData.experienceTo,
          qualification: vacancyData.qualification,
          jobDescription: vacancyData.jobDescription,
          keySkills: vacancyData.keySkills,
          fromDate: this.formatDate(vacancyData.fromDate),
          toDate: this.formatDate(vacancyData.todate),
          statusId: vacancyData.status == "Active" ? 1 : 0,
          projectId: vacancyData.projectId,
        });
        const eventMock = { target: { value: vacancyData.groupDivisionId } };
        this.onDivisionChange(eventMock);
        const vacancyLocations = result.body.vacancyLocations.map((loc: any) => loc.locationId);
        this.GetLocationWithDebounce(vacancyData.groupDivisionId, vacancyLocations);
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error",
        });
      }
    );
  }
  get locationsFormArray() {
    return this.vacancyForm.get('locations') as FormArray;
  }
  ngAfterViewInit(): void {
    $('#datepicker').datepicker({
      format: 'dd/mm/yyyy',
      autoclose: true,
      todayHighlight: true,
    })
      .on('changeDate', (e: any) => {
        const selectedDate = e.format('dd/mm/yyyy');
        this.vacancyForm.patchValue({ fromDate: selectedDate });
      });

    $('#datepicker1').datepicker({
      format: 'dd/mm/yyyy',
      autoclose: true,
      todayHighlight: true,
    })
      .on('changeDate', (e: any) => {
        const selectedDate = e.format('dd/mm/yyyy');
        this.addvacancymodel.toDate = selectedDate;
        this.vacancyForm.patchValue({ toDate: selectedDate });
      });
    const editor = (window as any).CKEDITOR.replace('editor');
    editor.on('instanceReady', () => {
      setTimeout(() => {
        const checkNotificationInterval = setInterval(() => {
          const notificationContainer = document.querySelector('#cke_notifications_area_editor');
          if (notificationContainer) {
            (notificationContainer as HTMLElement).style.display = 'none';
            clearInterval(checkNotificationInterval); 
          }
        }, 50); 
      }, 10);
      if (this.vacancyForm.get('jobDescription')?.value) {
        editor.setData(this.vacancyForm.get('jobDescription')?.value);
      }
    });
    editor.on('change', () => {
      debugger;
      const editorValue = editor.getData();
      this.vacancyForm.patchValue({ jobDescription: editorValue });
    });
  }
  onSubmit() {
    if (this.vacancyForm.valid) {
      const selectedLocations = this.locationsFormArray.controls
        .filter((control: any) => control.value.isChecked)
        .map((control: any) => control.value.id);
      const selectedProject = this.ProjectList.find(x => x.projectId === Number(this.vacancyForm.value.projectId));
      this.addvacancymodel = {
        groupDivisionId: Number(this.vacancyForm.value.groupDivisionId),
        designationId: Number(this.vacancyForm.value.designationId),
        projectName: selectedProject?.projectName || '',
        location: "",
        locationIds: selectedLocations,
        experienceFrom: this.vacancyForm.value.experienceFrom,
        experienceTo: this.vacancyForm.value.experienceTo,
        qualification: this.vacancyForm.value.qualification,
        jobDescription: this.vacancyForm.value.jobDescription,
        keySkills: this.vacancyForm.value.keySkills,
        fromDate: this.vacancyForm.value.fromDate,
        toDate: this.vacancyForm.value.toDate,
        emailAddress: this.usession.emailAddress,
        statusId: this.vacancyForm.value.statusId,
        vacancyId: this.vacancyForm.value.vacancyId,
        projectId: Number(this.vacancyForm.value.projectId)
      };
      if (this.vacancyForm.value.vacancyId == 0) {
        this.applicantservice.PostVacancy(this.addvacancymodel).subscribe(
          (result: any) => {
            if (result.status === 200) {
              Swal.fire({
                text: 'Vacancy posted successfully!',
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
        this.applicantservice.UpdateVacancyViaId(this.addvacancymodel).subscribe(
          (result: any) => {
            if (result.status === 200) {
              Swal.fire({
                text: 'Vacancy updated successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
              }).then((result: { isConfirmed: any; }) => {
                if (result.isConfirmed) {
                  this.router.navigate(['/admin/post-vacancy-list']);
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
  GetDesignation(groupId: number) {
    this.jobapplyservice.GetDesignation(groupId).subscribe(
      (result: any) => {
        this.DesignationList = result;
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  GetProject(groupId: number) {
    this.jobapplyservice.GetProject(groupId).subscribe(
      (result: any) => {
        this.ProjectList = result;
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
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
      (result: any) => {
        this.LocationList = result;

        const locationsArray = this.locationsFormArray;
        locationsArray.clear();

        this.LocationList.forEach(location => {
          locationsArray.push(
            this.fb.group({
              id: [location.locationId],
              isChecked: [vacancyLocations.includes(location.locationId)], 
            })
          ); 
        });
        console.log(this.locationsFormArray.value)
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error",
        });
      }
    );
  }
  resetLocationControls() {
    const locationsArray = this.locationsFormArray;
    locationsArray.clear();
    this.LocationList.forEach(location => {
      locationsArray.push(this.fb.group({
        id: [location.locationId],
        isChecked: [false]
      }));
    });
  }
  onDivisionChange(event: any): void {
    this.selectedStateId = +event.target.value;
    this.GetDesignation(this.selectedStateId);
    this.GetLocationWithDebounce(this.selectedStateId);
    this.GetProject(this.selectedStateId);
  }
}
