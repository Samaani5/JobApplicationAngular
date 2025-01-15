import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { SafeUrlPipe } from '../../../safe-url.pipe';
import { HomeComponent } from '../home.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { JobApplicationService } from '../../../Services/JobApplication/job-application.service';
import { HealthDetail, JobApplicationFormRequestIO } from '../../../Models/JobApplication/job-application-form-request';
import { District, State } from '../../../Models/JobApplication/language-labels';
declare var Swal: any;

@Component({
  selector: 'app-final-job-application-details',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, CommonModule, NgIf, RouterModule, RouterLink, HomeComponent,FormsModule, SafeUrlPipe, DatePipe],
  templateUrl: './final-job-application-details.component.html',
  styleUrls: ['./final-job-application-details.component.css'],
})
export class FinalJobApplicationDetailsComponent {
  Applicantmodel: HealthDetail = new HealthDetail();
  employeeData: JobApplicationFormRequestIO = new JobApplicationFormRequestIO();
  jobApplicationForm: FormGroup = new FormGroup({});
  addressForm: FormGroup = new FormGroup({});
  passportDetailsForm: FormGroup = new FormGroup({});
  healthDetailsForm: FormGroup = new FormGroup({});
  languageForm: FormGroup = new FormGroup({});
  QualificationForm: FormGroup = new FormGroup({});
  experienceDetailForm: FormGroup = new FormGroup({});
  itSkillForm: FormGroup = new FormGroup({});
  socialForm: FormGroup = new FormGroup({});
  districtsForState: District[] = [];
  districtsForCorrespondenceState: District[] = [];
  MobileNo = '';
  states: State[] = [];
  
  constructor(private sanitizer: DomSanitizer, private jobappservice: JobApplicationService, private fb: FormBuilder, private router: Router) {}
  
  
  ngOnInit(): void {
    this.MobileNo = JSON.parse(sessionStorage.getItem('MobileNo') || '');
    const mobileNo = sessionStorage.getItem('MobileNo');
    this.MobileNo = mobileNo ? JSON.parse(mobileNo) : '';
    this.fetchApplicationData(this.MobileNo);
    this.GetCity(3, 'permanent');
    this.GetCity(3, 'correspondence');
    this.GetState();
  }
  navigateToHome(): void {
    this.router.navigate(['']);
  }

  getSafeResumeUrl(filePath: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(filePath);
  }
  
  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  fetchApplicationData(mobileno: string): void {
    this.Applicantmodel = {
      mobileNo: mobileno,
    };
    this.jobappservice.getApplicantDetails(this.Applicantmodel).subscribe((data) => {
         if (data.status == 200) {
         this.employeeData = data.body;
         console.log("this.employeeData",this.employeeData)
         if (this.employeeData.stateId)
          this.GetCity(Number(this.employeeData.stateId), 'permanent');
        if (this.employeeData.cStateId)
          this.GetCity(Number(this.employeeData.stateId), 'correspondence');
         }
    });
  }

  GetState() {
    this.jobappservice.GetState(1).subscribe(
      (result: any) => {
        if (result != null) {
          this.states = result.body;
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  GetCity(stateId: number, type: string) {
    this.jobappservice.GetCity(stateId).subscribe(
      (result: any) => {
        if (result != null) {
          if (type === 'permanent') {
            this.districtsForState = result.body;
          } else if (type === 'correspondence') {
            this.districtsForCorrespondenceState = result.body;
          }
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      }
    );
  }
  
}
