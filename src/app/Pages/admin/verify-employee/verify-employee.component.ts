import { Component, model } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { AdminComponent } from '../admin.component';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { Bank, Company, DesignationItem, District, LanguageLabels, LocationItem, State, SubDivision } from '../../../Models/JobApplication/language-labels';
import { JobApplicationService } from '../../../Services/JobApplication/job-application.service';
import { Applicationlist, ApplicationlistRequest, EmployeeDetail } from '../../../Models/ApplicationList/applicationlist-request';
import { ApplicantListService } from '../../../Services/ApplicantList/applicant-list.service';
import { SafeUrlPipe } from '../../../safe-url.pipe';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { UserSession } from '../../../Models/UserSession/user-session';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';
import { PayrollDataRequest } from '../../../Models/Masters/add-group-division';

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
  DesignationList: DesignationItem[] = [];
  LocationList: LocationItem[] = [];
  subDivisions: SubDivision[] = [];
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
  companyId = 0;
  bgName = "";
  BranchGroupList: any;
  BranchList: any;
  DepartmentList: any;
  PRDesignationList: any;
  PRSubDivisionList: any;

  constructor(private sanitizer: DomSanitizer, private jobappservice: JobApplicationService, private applicantservice: ApplicantListService,
    private fb: FormBuilder, private router: Router, private jobapplyservice: JobApplyService, private route: ActivatedRoute) {
    this.verifyEmployeeForm = this.fb.group({
      bankId: [0, Validators.required],
      companyId: [0, Validators.required],
      designationId: [0, Validators.required],
      subdivisionId: [0, Validators.required],
      zoneId: [0, Validators.required],
      bankAccountNo: [""],
      panNo: [""],
      adharNo: [""],
      ifscCode: [""],
      remark: ["", Validators.required],
      loginEmail: [""],
      branchGroupId: [0, Validators.required],
      branchId: [0, Validators.required],
      departmentId: [0, Validators.required],
      prsubdivisionId: [0],
      prdesignationId: [0, Validators.required],
      employmenttype: ["", Validators.required],
    });
    this.usession = JSON.parse((sessionStorage.getItem('session') || '{}'));
  }

  ngOnInit(): void {
    this.fetchApplicationData(this.applicantReq);
    this.GetBankName();
    this.GetCompanyName();
  }
  OnZoneChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.GetSubDivision(selectElement.value);
  }
  fetchApplicationData(model: Applicationlist): void {
    this.applicantservice.GetDataForVerify(model).subscribe(
      (data) => {
        if (data.status == 200) {
          if (data.body.length > 0) {
            this.applicantData = data.body[0];
            this.GetDesignation(this.applicantData.groupDivisionId);
            this.GetLocation(this.applicantData.groupDivisionId);
            this.GetSubDivision(this.applicantData.zoneId.toString());
            this.verifyEmployeeForm.patchValue({
              adharNo: this.applicantData.adharNo,
              panNo: this.applicantData.panNo,
              bankAccountNo: this.applicantData.bankAccountNo,
              ifscCode: this.applicantData.ifscCode,
              bankId: this.applicantData.bankId,
              companyId: model.companyId,
              designationId: this.applicantData.designationId,
              zoneId: this.applicantData.zoneId,
              subdivisionId: this.applicantData.revenueId,
              remark: ''
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
      icon: 'success',
      customClass: {
        popup: 'custom-centered-alert'
      },
    });
  }
  getFormattedAge(): string {
    const age = this.applicantData?.age || "0:0";
    const [years, months] = age.split(':').map(Number);
    return `${years} years and ${months} months`;
  }
  onVerify() {
    const formattedDateOfBirth = this.formatDate(this.applicantData.dateOfBirth.toString());
    this.applicantReq.adharNo = this.verifyEmployeeForm.get('adharNo')?.value;
    this.applicantReq.panNo = this.verifyEmployeeForm.get('panNo')?.value;
    this.applicantReq.bankAccountNo = this.verifyEmployeeForm.get('bankAccountNo')?.value;
    this.applicantReq.bankId = this.verifyEmployeeForm.get('bankId')?.value;
    this.applicantReq.ifscCode = this.verifyEmployeeForm.get('ifscCode')?.value;
    this.applicantReq.companyId = Number(this.verifyEmployeeForm.get('companyId')?.value);
    this.applicantReq.remark = this.verifyEmployeeForm.get('remark')?.value;
    this.applicantReq.designationId = this.verifyEmployeeForm.get('designationId')?.value;
    this.applicantReq.zoneId = this.verifyEmployeeForm.get('zoneId')?.value;
    this.applicantReq.subdivisionId = this.verifyEmployeeForm.get('subdivisionId')?.value;
    this.applicantReq.groupName = this.verifyEmployeeForm.get('branchGroupId')?.value;
    this.applicantReq.branchId = Number(this.verifyEmployeeForm.get('branchId')?.value);
    this.applicantReq.departMentId = Number(this.verifyEmployeeForm.get('departmentId')?.value);
    this.applicantReq.revenueId = Number(this.verifyEmployeeForm.get('prsubdivisionId')?.value);
    this.applicantReq.payRollDestId = Number(this.verifyEmployeeForm.get('prdesignationId')?.value);
    this.applicantReq.employmentType = this.verifyEmployeeForm.get('employmenttype')?.value;
    this.applicantReq.applicantId = this.applicantData.applicantId;
    this.applicantReq.loginEmail = this.usession.emailAddress;
    this.applicantReq.dateofbirth = formattedDateOfBirth;
    this.applicantReq.status = 'Verified';
    this.fetchApplicationData(this.applicantReq);
    Swal.fire({
      text: 'Employee verified successfully!',
      icon: 'success',
      customClass: {
        popup: 'custom-centered-alert'
      },
    });
  }
  onSkip() {
    this.fetchApplicationDataById(this.applicantData.applicantId);
  }
  fetchApplicationDataById(applicantId: number) {
    const model = new EmployeeDetail();
    model.applicantId = applicantId;
    this.applicantservice.Skipapplication(model).subscribe(
      (data) => {
        if (data.status == 200 && data.body.length > 0) {
          this.applicantData = data.body[0];
          this.GetDesignation(this.applicantData.groupDivisionId);
          this.GetLocation(this.applicantData.groupDivisionId);
          this.GetSubDivision(this.applicantData.zoneId.toString());
          this.verifyEmployeeForm.patchValue({
            adharNo: this.applicantData.adharNo,
            panNo: this.applicantData.panNo,
            bankAccountNo: this.applicantData.bankAccountNo,
            ifscCode: this.applicantData.ifscCode,
            bankId: this.applicantData.bankId,
            designationId: this.applicantData.designationId,
            zoneId: this.applicantData.zoneId,
            subdivisionId: this.applicantData.revenueId,
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
  GetSubDivision(zoneId: string) {
    this.jobappservice.GetSubDivision(Number(zoneId)).subscribe(
      (result: any) => {
        if (result != null) {
          this.subDivisions = result.body;
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  GetGroupDivisionListByCompanyId(companyId: number) {
    this.companyId = companyId;
    const model = new PayrollDataRequest;
    model.companyId = companyId;
    this.jobapplyservice.GetGroupDivisionListByCompanyId(model).subscribe(
      (result: any) => {
        if (result != null) {
          this.BranchGroupList = result.body;
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  GetBranchListByGroupDivision(bgName: string, companyId: number) {
    this.bgName = bgName;
    const model = new PayrollDataRequest;
    model.companyId = companyId;
    model.groupDiviion = bgName;
    this.jobapplyservice.GetBranchListByGroupDivision(model).subscribe(
      (result: any) => {
        if (result != null) {
          this.BranchList = result.body;
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  GetDepartmentListByBranchId(branchId: number, companyId: number) {
    const model = new PayrollDataRequest;
    model.companyId = companyId;
    model.branchId = branchId;
    this.jobapplyservice.GetDepartmentListByBranchId(model).subscribe(
      (result: any) => {
        if (result != null) {
          this.DepartmentList = result.body;
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  GetDesignationListByDepartmentId(dptId: string, companyId: number) {
    const model = new PayrollDataRequest;
    model.companyId = companyId;
    model.departmentId = dptId;
    this.jobapplyservice.GetDesignationListByDepartmentId(model).subscribe(
      (result: any) => {
        if (result != null) {
          this.PRDesignationList = result.body;
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  GetSubDivisionListByDepartmentId(dptId: number, bgName: string) {
    const model = new PayrollDataRequest;
    model.groupDiviion = bgName;
    model.dptId = dptId;
    this.jobapplyservice.GetSubDivisionListByDepartmentId(model).subscribe(
      (result: any) => {
        if (result != null) {
          this.PRSubDivisionList = result.body;
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  OnCompanyChange(event: Event) {
    this.BranchGroupList = [];
    this.BranchList = [];
    this.DepartmentList = [];
    this.PRDesignationList = [];
    this.PRSubDivisionList = [];
    this.verifyEmployeeForm.patchValue({
      branchGroupId: 0,
      branchId: 0,
      departmentId: 0,
      prsubdivisionId: 0,
      prdesignationId: 0
    });
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.GetGroupDivisionListByCompanyId(Number(selectedValue));
  }
  OnBGChange(event: Event) {
    this.BranchList = [];
    this.DepartmentList = [];
    this.PRDesignationList = [];
    this.PRSubDivisionList = [];
    this.verifyEmployeeForm.patchValue({
      branchId: 0,
      departmentId: 0,
      prsubdivisionId: 0,
      prdesignationId: 0
    });
    const bgName = (event.target as HTMLSelectElement).value;
    this.GetBranchListByGroupDivision(bgName, this.companyId);
  }
  OnBranchChange(event: Event) {
    this.DepartmentList = [];
    this.PRDesignationList = [];
    this.PRSubDivisionList = [];
    this.verifyEmployeeForm.patchValue({
      departmentId: 0,
      prsubdivisionId: 0,
      prdesignationId: 0
    });
    const branchId = (event.target as HTMLSelectElement).value;
    this.GetDepartmentListByBranchId(Number(branchId), this.companyId);
  }
  OnDepartmentChange(event: Event) {
    this.PRDesignationList = [];
    this.PRSubDivisionList = [];
    this.verifyEmployeeForm.patchValue({
      prsubdivisionId: 0,
      prdesignationId: 0
    });
    const dptId = (event.target as HTMLSelectElement).value;
    this.GetDesignationListByDepartmentId(dptId, this.companyId);
    this.GetSubDivisionListByDepartmentId(Number(dptId), this.bgName);
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
}
