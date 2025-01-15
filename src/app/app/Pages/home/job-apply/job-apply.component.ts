import { JsonPipe, KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DesignationItem, LocationItem } from '../../../Models/JobApplication/language-labels';
import { JobPosting, JobPostingResponse, Vacancy, VacancyLocations } from '../../../Models/JobPosting/job-posting';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';
declare var Swal: any;


@Component({
  selector: 'app-job-apply',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, KeyValuePipe, JsonPipe, FormsModule],
  templateUrl: './job-apply.component.html',
  styleUrl: './job-apply.component.css'
})
export class JobApplyComponent {
  groupId = 0;
  designationShow = false;
  ITOilShow = false;
  GroupDivisionList: any;
  DesignationList: DesignationItem[] = [];
  LocationList: LocationItem[] = [];
  jobPostings: JobPostingResponse[] = [];
  vacancy: JobPosting[] = [];
  constructor(private fb: FormBuilder, private jobapplyservice: JobApplyService, private router: Router, private cdr: ChangeDetectorRef) {
    sessionStorage.clear();
    this.GetGroupdivisions();
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

  showOptions(groupId: number, groupname: string) {
    this.groupId = groupId;
    this.OpenVacancies(this.groupId);
    this.ITOilShow = true;
  }
  OpenVacancies(groupId: number) {
    this.jobapplyservice.OpenVacancies(groupId).subscribe(
      (result: any) => {
        this.jobPostings = result;
        this.vacancy = result.vacancies.map((vacancy: any) => {
          const associatedLocations = result.vacancyLocations.filter(
            (location: any) => location.vacancyId === vacancy.vacancyId
          );
          return {
            vacancyId: vacancy.vacancyId,
            positionId: vacancy.positionId,
            jobName: vacancy.jobName,
            projectName: vacancy.projectName,
            projectId: vacancy.projectId,
            qualification: vacancy.qualification,
            jobDescription: vacancy.jobDescription,
            keySkills: vacancy.keySkills,
            experienceFrom: vacancy.experienceFrom,
            experienceTo: vacancy.experienceTo,
            vacancyLocations: associatedLocations.map((location: any) => ({
              id: location.id,
              vacancyId: location.vacancyId,
              locationId: location.locationId,
              positionId: location.positionId,
              location: location.location
            })),
            selectedLocation: associatedLocations.length > 0 ? associatedLocations[0].locationId : null
          } as JobPosting;
        });
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  redirectToSendOTP(designationId: number, groupName: string, selectedLocationId: number, projectName: string, projectId: number,i:number) {
    debugger;
    if (!selectedLocationId || selectedLocationId === 0) {
      return;
    }
    const selected = this.vacancy[i].vacancyLocations.find(
      (location: any) => location.locationId === selectedLocationId
    );
    const locationName = selected ? selected.location : '';
    sessionStorage.setItem('groupId', JSON.stringify(this.groupId));
    sessionStorage.setItem('designationId', JSON.stringify(designationId));
    sessionStorage.setItem('groupName', JSON.stringify(groupName));
    sessionStorage.setItem('projectName', JSON.stringify(projectName));
    sessionStorage.setItem('locationName', JSON.stringify(locationName));
    sessionStorage.setItem('zoneId', JSON.stringify(selectedLocationId));
    sessionStorage.setItem('projectId', JSON.stringify(projectId));
    this.router.navigate(['/SendOTP']);
  }
}
