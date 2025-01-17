import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { PaginationComponent } from '../../../include/pagination/pagination.component';
import { Applicationlist, ApplicationlistRequest, EmployeeDetail } from '../../../Models/ApplicationList/applicationlist-request';
import { HealthDetail, JobApplicationFormRequestIO } from '../../../Models/JobApplication/job-application-form-request';
import { Bank, DesignationItem, District, LocationItem, ProjectItem, State, SubDivision } from '../../../Models/JobApplication/language-labels';
import { UserSession } from '../../../Models/UserSession/user-session';
import { ApplicantListService } from '../../../Services/ApplicantList/applicant-list.service';
import { JobApplicationService } from '../../../Services/JobApplication/job-application.service';
import { JobApplyService } from '../../../Services/JobApply/job-apply.service';
import { AdminComponent } from '../admin.component';
declare var Swal: any;
declare var $: any;
@Component({
  selector: 'app-applicant-list',
  standalone: true,
  imports: [NgFor, CommonModule, NgIf, RouterModule, RouterLink, AdminComponent, FormsModule, DatePipe, PaginationComponent, ReactiveFormsModule],
  templateUrl: './applicant-list.component.html',
  styleUrl: './applicant-list.component.css'
})
export class ApplicantListComponent {
  groupname: string = '';
  groupid: number = 0;
  statusid: number = 0;
  type: string = '';
  GroupDivisionList: any;
  DesignationList: DesignationItem[] = [];
  LocationList: LocationItem[] = [];
  subDivisions: SubDivision[] = [];
  ProjectList: ProjectItem[] = [];
  formData = {
    groupDivision: 0,
    applicantId: 0,
    zone: '',
    designation: '',
    fromDate: '',
    subDivision: '',
    status: '',
    toDate: '',
    experienceFrom: '',
    experienceTo: '',
    keyskill: '',
    project: '',
    searchQuery: ''
  };
  StatusList: Bank[] = [];
  applicantList: ApplicationlistRequest[] = [];
  applicantReq = new Applicationlist;
  designations: { id: number, name: string }[] = [];
  locations: { [key: string]: { id: number, name: string }[] } = {};
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  paginatedApplicantList: ApplicationlistRequest[] = [];
  @ViewChild('detailmodal') detailmodal: ElementRef | undefined;
  @ViewChild('otherdetailmodal') otherdetailmodal: ElementRef | undefined;
  @ViewChild('editothermodal') editothermodal: ElementRef | undefined;
  IsModelShow = false;
  Applicantmodel: HealthDetail = new HealthDetail();
  employeeData: JobApplicationFormRequestIO = new JobApplicationFormRequestIO();
  districtsForState: District[] = [];
  districtsForCorrespondenceState: District[] = [];
  MobileNo = '';
  states: State[] = [];
  jobApplicationForm: FormGroup = new FormGroup({});
  safeResumeUrl: SafeResourceUrl | null = null;
  safeUrls: SafeResourceUrl[] = [];
  applicantData: ApplicationlistRequest = new ApplicationlistRequest();
  safeQualificationUrl: SafeResourceUrl | null = null;
  safepassportPhotopathUrl: SafeResourceUrl | null = null;
  safebankDocumentpathUrl: SafeResourceUrl | null = null;
  safepancardpathUrl: SafeResourceUrl | null = null;
  safeadharpathUrl: SafeResourceUrl | null = null;
  banks: Bank[] = [];
  verifyEmployeeForm: FormGroup;
  usession = new UserSession;
  namesList: ApplicationlistRequest[] = [];

  constructor(private router: Router, private jobapplyservice: JobApplyService, private route: ActivatedRoute, private jobappservice: JobApplicationService,
    private applicantservice: ApplicantListService, private sanitizer: DomSanitizer, private fb: FormBuilder) {
    this.verifyEmployeeForm = this.fb.group({
      bankId: [0, Validators.required],
      designationId: [0, Validators.required],
      subdivisionId: [0, Validators.required],
      zoneId: [0, Validators.required],
      bankAccountNo: [""],
      panNo: [""],
      adharNo: [""],
      ifscCode: [""],
      loginEmail: [""],
    });
    this.usession = JSON.parse((sessionStorage.getItem('session') || '{}'));
  }
  ngOnInit(): void {
    const sessionData = sessionStorage.getItem('groupParams');
    if (sessionData) {
      const parsedData = JSON.parse(sessionData);
      this.groupname = parsedData.groupname;
      this.formData.groupDivision = parsedData.groupid;
      this.groupid = parsedData.groupid;
      this.statusid = parsedData.status;
      this.type = parsedData.type;
      this.GetDataDashboardLinked();
    }
    this.GetGroupdivisions();
    this.showOptions(this.formData.groupDivision);
    this.GetBankName();
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
  showOptions(groupId: number) {
    this.groupid = groupId;
    this.GetDesignation(this.groupid);
    this.GetLocation(this.groupid);
    this.GetProject(this.groupid);
    this.GetStatusMaster();
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
  GetStatusMaster() {
    this.jobappservice.GetStatusMaster().subscribe(
      (result: any) => {
        if (result.status == 200) {
          this.StatusList = result.body;
        }
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

  GetDataDashboardLinked() {
    this.applicantReq.groupDivisionId = this.formData.groupDivision;
    this.applicantReq.statusId = this.statusid;
    this.applicantReq.type = this.type;
    this.applicantservice.GetDataDashboardLinked(this.applicantReq).subscribe(
      (result: any) => {
        if (result.status == 200) {
          this.applicantList = result.body;
          this.totalItems = this.applicantList.length;
          this.calculateTotalPages();
          this.updatePagination();
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  GetSearchDataPhotoSmart() {
    this.applicantReq.groupDivisionId = Number(this.formData.groupDivision);
    this.applicantReq.applicantId = this.formData.applicantId;
    this.applicantReq.statusId = this.statusid;
    this.applicantReq.type = this.type;
    this.applicantReq.zoneId = Number(this.formData.zone);
    this.applicantReq.designationId = Number(this.formData.designation);
    this.applicantReq.fromDate = this.formData.fromDate;
    this.applicantReq.toDate = this.formData.toDate;
    this.applicantReq.subdivisionId = Number(this.formData.subDivision);
    this.applicantReq.statusId = Number(this.formData.status);
    this.applicantReq.projectId = Number(this.formData.project);
    this.applicantReq.expFrom = Number(this.formData.experienceFrom);
    this.applicantReq.expTo = Number(this.formData.experienceTo);
    this.applicantReq.keySkills = this.formData.keyskill;
    this.applicantservice.GetSearchDataPhotoSmart(this.applicantReq).subscribe(
      (result: any) => {
        if (result.status == 200) {
          this.applicantList = result.body;
          this.totalItems = this.applicantList.length;
          this.calculateTotalPages();
          this.updatePagination();
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
  onSubmit() {
    this.GetSearchDataPhotoSmart();
    this.groupid = Number(this.formData.groupDivision)
  }
  calculateTotalPages() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * Number(this.itemsPerPage);
    const endIndex = startIndex + Number(this.itemsPerPage);
    this.paginatedApplicantList = this.applicantList.slice(startIndex, endIndex);
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.updatePagination();
  }

  onPagesizeChange(newPageSize: number) {
    this.itemsPerPage = newPageSize;
    this.currentPage = 1;
    this.calculateTotalPages();
    this.updatePagination();
  }
  ngAfterViewInit(): void {
    $('#datepicker').datepicker({
      format: 'dd/mm/yyyy',
      autoclose: true,
      todayHighlight: true,
    })
      .on('changeDate', (e: any) => {
        const selectedDate = e.format('dd/mm/yyyy');
        this.formData.fromDate = selectedDate;
      });

    $('#datepicker1').datepicker({
      format: 'dd/mm/yyyy',
      autoclose: true,
      todayHighlight: true,
    })
      .on('changeDate', (e: any) => {
        const selectedDate = e.format('dd/mm/yyyy');
        this.formData.toDate = selectedDate;
      });
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
  showDetail(mobileNo: string) {
    this.GetState();
    this.Applicantmodel = {
      mobileNo: mobileNo,
    };
    this.jobappservice.getApplicantDetails(this.Applicantmodel).subscribe((data) => {
      if (data.status == 200) {
        this.employeeData = data.body;
        this.MobileNo = mobileNo;
        if (this.employeeData.stateId)
          this.GetCity(Number(this.employeeData.stateId), 'permanent');
        if (this.employeeData.cStateId)
          this.GetCity(Number(this.employeeData.stateId), 'correspondence');
        this.safeResumeUrl = this.getSafeResumeUrl(this.employeeData.resumeFilePath);
        this.safeUrls = this.employeeData.qualificationDetails.map(qualification => {
          return this.getSafeUrl(qualification.imageFile); 
        });
        $(this.detailmodal?.nativeElement).modal('show');
      }
    },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });

  }
  showDetailOther(applicantId: number) {
    const model = new EmployeeDetail();
    model.applicantId = applicantId;
    this.GetState();
    this.applicantservice.GetDataApplicantOther(model).subscribe(
      (data) => {
        if (data.status == 200 && data.body.length > 0) {
          this.applicantData = data.body[0];
          const bank = this.banks.find(b => b.id === this.applicantData.bankId);
          this.applicantData.bankName = bank ? bank.name : "";
          this.safeQualificationUrl = this.getSafeUrl(this.applicantData.qualificationpath);
          this.safeadharpathUrl = this.getSafeUrl(this.applicantData.adharpath);
          this.safepancardpathUrl = this.getSafeUrl(this.applicantData.pancardpath);
          this.safebankDocumentpathUrl = this.getSafeUrl(this.applicantData.bankDocumentpath);
          this.safepassportPhotopathUrl = this.getSafeUrl(this.applicantData.passportPhotopath);
          this.safeResumeUrl = this.getSafeUrl(this.applicantData.resumeFilepath);
          $(this.otherdetailmodal?.nativeElement).modal('show');
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
  getFormattedAge(): string {
    const age = this.applicantData?.age || "0:0";
    const [years, months] = age.split(':').map(Number);
    return `${years} years and ${months} months`;
  }
  isImage(filePath: string | undefined | null): boolean {
    if (!filePath) {
      return false;
    }
    const ext = filePath.split('.').pop()?.toLowerCase();
    return ext === 'jpg' || ext === 'jpeg' || ext === 'png';
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
  showEditModel(applicantId: number) {
    this.fetchApplicationDataById(applicantId);
    $(this.editothermodal?.nativeElement).modal('show');
  }
  fetchApplicationDataById(applicantId: number) {
    const model = new EmployeeDetail();
    model.applicantId = applicantId;
    this.applicantservice.GetDataApplicantOther(model).subscribe(
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
  onEditApplicant() {
    this.applicantReq.adharNo = this.verifyEmployeeForm.get('adharNo')?.value;
    this.applicantReq.panNo = this.verifyEmployeeForm.get('panNo')?.value;
    this.applicantReq.bankAccountNo = this.verifyEmployeeForm.get('bankAccountNo')?.value;
    this.applicantReq.bankId = this.verifyEmployeeForm.get('bankId')?.value;
    this.applicantReq.ifscCode = this.verifyEmployeeForm.get('ifscCode')?.value;
    this.applicantReq.designationId = this.verifyEmployeeForm.get('designationId')?.value;
    this.applicantReq.zoneId = this.verifyEmployeeForm.get('zoneId')?.value;
    this.applicantReq.subdivisionId = this.verifyEmployeeForm.get('subdivisionId')?.value;
    this.applicantReq.applicantId = this.applicantData.applicantId;
    this.applicantReq.loginEmail = this.usession.emailAddress;
    this.applicantservice.UpdateApplicantDetail(this.applicantReq).subscribe(
      (data) => {
        if (data.status == 200) {
          //this.GetSearchDataPhotoSmart();
          $(this.editothermodal?.nativeElement).modal('hide');
          Swal.fire({
            text: 'Employee data saved successfully!',
            icon: 'success',
            position: 'top',
            customClass: {
              popup: 'custom-centered-alert'
            },
          });
        }
      });
  }
  OnZoneChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.GetSubDivision(selectElement.value);
  }
  SearchByName(name: string) {
    if (name == '') {
      this.namesList = [];
      this.formData.applicantId = 0;
    }
    else {
      const model = new EmployeeDetail();
      model.groupDivisionId = Number(this.formData.groupDivision);
      model.name = name;
      this.applicantservice.SearchByName(model).subscribe(
        (result: any) => {
          if (result.status == 200) {
            this.namesList = result.body;
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
  onSelectName(model: ApplicationlistRequest) {
    this.formData.applicantId = model.applicantId;
    this.formData.searchQuery = model.name + ' - ' + model.designationName;
    this.namesList = [];
    this.GetSearchDataPhotoSmart();
    this.groupid = Number(this.formData.groupDivision)
  }
}
