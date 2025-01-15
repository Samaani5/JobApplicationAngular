import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { AdminComponent } from '../admin.component';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { Bank, Company, District, LanguageLabels, State, SubDivision } from '../../../Models/JobApplication/language-labels';
import { JobApplicationService } from '../../../Services/JobApplication/job-application.service';
import { Applicationlist, ApplicationlistRequest } from '../../../Models/ApplicationList/applicationlist-request';
import { ApplicantListService } from '../../../Services/ApplicantList/applicant-list.service';
import { SafeUrlPipe } from '../../../safe-url.pipe';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { UserSession } from '../../../Models/UserSession/user-session';

declare var Swal: any;

@Component({
  selector: 'app-verify-employee',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, CommonModule, NgIf, RouterModule, RouterLink, AdminComponent, FormsModule, SafeUrlPipe, DatePipe],
  templateUrl: './verify-employee.component.html',
  styleUrl: './verify-employee.component.css'
})
export class VerifyEmployeeComponent {
  applicantData: ApplicationlistRequest = new ApplicationlistRequest();
  banks: Bank[] = [];
  Company: Company[] = [];
  labels = new LanguageLabels();
  applicantReq = new Applicationlist;
  verifyEmployeeForm: FormGroup;
  selectedBankName: string = '';
  safeResumeUrl!: SafeResourceUrl;
  safeQualificationUrl!: SafeResourceUrl;
  safepassportPhotopathUrl!: SafeResourceUrl;
  safebankDocumentpathUrl!: SafeResourceUrl;
  safepancardpathUrl!: SafeResourceUrl;
  safeadharpathUrl!: SafeResourceUrl;
  isVerificationTriggered: boolean = false;
  usession = new UserSession;

  constructor(private sanitizer: DomSanitizer, private jobappservice: JobApplicationService, private applicantservice: ApplicantListService, private fb: FormBuilder, private router: Router) {
    this.verifyEmployeeForm = this.fb.group({
      bankId: [0, Validators.required],
      companyId: [0, Validators.required],
      bankAccountNo: [""],
      panNo: [""],
      adharNo: [""],
      ifscCode: [""],
      remark: ["", Validators.required],
      loginEmail: [""],
    });
    this.usession = JSON.parse((sessionStorage.getItem('session') || '{}'));
  }

  ngOnInit(): void {
    this.fetchApplicationData(this.applicantReq);
    this.GetBankName();
    this.GetCompanyName();
  }

  fetchApplicationData(model: Applicationlist): void {
    this.applicantservice.GetDataForVerify(model).subscribe(
      (data) => {
        if (data.status == 200) {
          if (data.body.length > 0) {
            this.applicantData = data.body[0];
            this.verifyEmployeeForm.patchValue({
              adharNo: this.applicantData.adharNo,
              panNo: this.applicantData.panNo,
              bankAccountNo: this.applicantData.bankAccountNo,
              ifscCode: this.applicantData.ifscCode,
              bankId: this.applicantData.bankId,
              companyId: model.companyId,
              remark:''
            });
            
            if (this.applicantData.qualificationpath) {
              this.safeQualificationUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                this.applicantData.qualificationpath
              )
            }
            if (this.applicantData.adharpath) {
              this.safeadharpathUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                this.applicantData.adharpath
              )
            }
            if (this.applicantData.pancardpath) {
              this.safepancardpathUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                this.applicantData.pancardpath
              )
            }
            if (this.applicantData.bankDocumentpath) {
              this.safebankDocumentpathUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                this.applicantData.bankDocumentpath
              )
            }
            if (this.applicantData.passportPhotopath) {
              this.safepassportPhotopathUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                this.applicantData.passportPhotopath
              )
            }
            if (this.applicantData.resumeFilepath) {
              this.safeResumeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                this.applicantData.resumeFilepath
              );
            }
            if (this.isVerificationTriggered) {
              Swal.fire({
                text: 'Employee verified successfully!',
                icon: 'success'
              });
            }
          }
          else {
            this.applicantData = new ApplicationlistRequest;
            Swal.fire({
              text: 'All Employees verified successfully!',
              icon: 'success'
            });
            this.router.navigate(['/admin']);
          }
          this.isVerificationTriggered = false;
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
    this.isVerificationTriggered = false;
  }
  isImage(filePath: string | undefined | null): boolean {
    if (!filePath) {
      return false; 
    }
    const ext = filePath.split('.').pop()?.toLowerCase();
    return ext === 'jpg' || ext === 'jpeg' || ext === 'png';
  }

  onSubmit() {
  }

  GetBankName() {
    this.jobappservice.GetBankName().subscribe(
      (result: any) => {
        if (result != null) {
          this.banks = result.body;
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  GetCompanyName() {
    this.jobappservice.GetCompany().subscribe(
      (result: any) => {
        if (result != null) {
          this.Company = result.body;
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }


  onRejectNext() {
    this.applicantReq.adharNo = this.verifyEmployeeForm.get('adharNo')?.value;
    this.applicantReq.panNo = this.verifyEmployeeForm.get('panNo')?.value;
    this.applicantReq.bankAccountNo = this.verifyEmployeeForm.get('bankAccountNo')?.value;
    this.applicantReq.bankId = this.verifyEmployeeForm.get('bankId')?.value;
    this.applicantReq.ifscCode = this.verifyEmployeeForm.get('ifscCode')?.value;
    this.applicantReq.companyId = Number(this.verifyEmployeeForm.get('companyId')?.value);
    this.applicantReq.remark = this.verifyEmployeeForm.get('remark')?.value;
    this.applicantReq.applicantId = this.applicantData.applicantId;
    this.applicantReq.loginEmail = this.usession.emailAddress;
    this.applicantReq.status = 'Rejected';
    this.fetchApplicationData(this.applicantReq);
    Swal.fire({
      text: 'Employee rejected successfully!',
      icon: 'success'
    });
  }
  getFormattedAge(): string {
    const age = this.applicantData?.age || "0:0";
    const [years, months] = age.split(':').map(Number);
    return `${years} years and ${months} months`;
  }
  onVerify() {
    this.applicantReq.adharNo = this.verifyEmployeeForm.get('adharNo')?.value;
    this.applicantReq.panNo = this.verifyEmployeeForm.get('panNo')?.value;
    this.applicantReq.bankAccountNo = this.verifyEmployeeForm.get('bankAccountNo')?.value;
    this.applicantReq.bankId = this.verifyEmployeeForm.get('bankId')?.value;
    this.applicantReq.ifscCode = this.verifyEmployeeForm.get('ifscCode')?.value;
    this.applicantReq.companyId = Number(this.verifyEmployeeForm.get('companyId')?.value);
    this.applicantReq.remark = this.verifyEmployeeForm.get('remark')?.value;
    this.applicantReq.applicantId = this.applicantData.applicantId;
    this.applicantReq.loginEmail = this.usession.emailAddress;
    this.applicantReq.status = 'Verified';
    this.fetchApplicationData(this.applicantReq);
    Swal.fire({
      text: 'Employee verified successfully!',
      icon: 'success'
    });
  }

}
