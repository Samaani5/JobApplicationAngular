import { CommonModule, DatePipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterLink } from '@angular/router';
import { Bank, District, LanguageLabels, State, SubDivision } from '../../../Models/JobApplication/language-labels';
import { JobApplicationService } from '../../../Services/JobApplication/job-application.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { EmpBank, EmpBasic, EmpFiles, JobApplicationFormRequest } from '../../../Models/JobApplication/job-application-form-request';
import { SendOTPRequest } from '../../../Models/SendOTP/send-otprequest';
declare var Swal: any;
declare var $: any;


@Component({
  selector: 'app-job-application',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf, FormsModule, NgFor, TitleCasePipe, DatePipe, CommonModule, MatDatepickerModule, MatInputModule, MatNativeDateModule],
  templateUrl: './job-application.component.html',
  styleUrl: './job-application.component.css',
  providers: [DatePipe, MatDatepickerModule]
})
export class JobApplicationComponent {
  jobApplicationForm: FormGroup = new FormGroup({});
  BankDetailsForm: FormGroup = new FormGroup({});
  UploadFilesForm: FormGroup = new FormGroup({});
  position: string = '';
  projectName: string = '';
  locationName: string = '';
  labels = new LanguageLabels();
  SendOtpmodel = new SendOTPRequest();
  states: State[] = [];
  districtsForState: District[] = [];
  districtsForCorrespondenceState: District[] = [];
  language = "";
  ZoneId = 0;
  MobileNo = '';
  banks: Bank[] = [];
  subDivisions: SubDivision[] = [];
  applicationData: JobApplicationFormRequest = new JobApplicationFormRequest();
  empfiles = new EmpFiles();
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2020, 0, 1);
  currentStep: number = 1;

  constructor(private fb: FormBuilder, private router: Router, private jobappservice: JobApplicationService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.MobileNo = JSON.parse(sessionStorage.getItem('MobileNo') || '')
    this.ZoneId = Number(JSON.parse(sessionStorage.getItem('zoneId') || '0'));
    this.position = JSON.parse(sessionStorage.getItem('groupName') || '')
    this.projectName = JSON.parse(sessionStorage.getItem('projectName') || 'PhotoBilling')
    if (this.projectName == null)
      this.projectName = 'PhotoBilling';
    this.locationName = JSON.parse(sessionStorage.getItem('locationName') || '')
    this.jobApplicationForm = this.fb.group({
      revenueId: ['', Validators.required],
      name: ['', Validators.required],
      fatherName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['Male', Validators.required],
      maritalStatus: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      mobileNo: [{ value: this.MobileNo, disabled: true }, Validators.required],
      permanentAddress: ['', Validators.required],
      stateId: ['', Validators.required],
      districtId: [{ value: '' }, Validators.required],
      pinCode: ['', Validators.required],
      cAddress: ['', Validators.required],
      cStateId: ['', Validators.required],
      cDistrictId: [{ value: '' }, Validators.required],
      cPinCode: ['', Validators.required],
      copyAddress: [false],
      fatherMobileNo: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });
    this.BankDetailsForm = this.fb.group({
      uanNo: ['', [Validators.pattern('[0-9]{12}')]],
      esiNo: [''],
      panNo: ['', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
      bankId: ['', [Validators.required]],
      bankAccountNo: ['', [Validators.required, Validators.pattern(/^\d{9,18}$/)]],
      ifscCode: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]{11}$')]],
      adharNo: ['', [Validators.required, Validators.pattern('[0-9]{12}')]],
      mrid: [''],
    });
    this.UploadFilesForm = this.fb.group({
      adharFile: ['', Validators.required],
      panFile: ['', Validators.required],
      qualificationFile: ['', Validators.required],
      bankStatementFile: ['', Validators.required],
      resumeFile: [''],
      passportPhoto: ['', Validators.required],
      termsCheck: [false, Validators.requiredTrue]
    });
    this.loadUserData(this.MobileNo);
    this.GetSubDivision(this.ZoneId);
    this.GetBankName();
    this.GetState();
    this.jobApplicationForm.get('stateId')?.setValue(3);
    this.jobApplicationForm.get('cStateId')?.setValue(3);
    this.GetCity(3, 'permanent');
    this.GetCity(3, 'correspondence');
    this.jobApplicationForm.get('districtId')?.setValue('');
    this.jobApplicationForm.get('cDistrictId')?.setValue('');
    this.changeLabels('hn');
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
  loadUserData(mobileno: string): void {
    this.SendOtpmodel = {
      mobileNo: mobileno,
      zonId: this.ZoneId,
      designationId: 0,
      groupDivisionId: 0,
      projectId: 0,
      otp: ''
    };
    this.jobappservice.getUserDetails(this.SendOtpmodel).subscribe((data: any) => {
      if (data?.body && data.body.length > 0) {
        this.applicationData = data.body[0];
        const formattedDateOfBirth = this.formatDate(this.applicationData.dateOfBirth);
        if (this.applicationData.stateId)
          this.GetCity(Number(this.applicationData.stateId), 'permanent');
        if (this.applicationData.cStateId)
          this.GetCity(Number(this.applicationData.stateId), 'correspondence');
        this.jobApplicationForm.patchValue({
          revenueId: this.subDivisions.some(subDivision => subDivision.id === Number(this.applicationData.revenueId))
            ? this.applicationData.revenueId
            : '',
          name: this.applicationData.name,
          fatherName: this.applicationData.fatherName,
          dateOfBirth: formattedDateOfBirth,
          gender: this.applicationData.gender || 'Male',
          maritalStatus: this.applicationData.maritalStatus || '',
          emailAddress: this.applicationData.emailAddress,
          mobileNo: this.applicationData.mobileNo,
          permanentAddress: this.applicationData.permanentAddress,
          stateId: Number(this.applicationData.stateId) == 0 ? '' :this.applicationData.stateId,
          districtId: Number(this.applicationData.districtId) == 0 ? '' : this.applicationData.districtId,
          pinCode: this.applicationData.pinCode,
          cAddress: this.applicationData.cAddress,
          cStateId: Number(this.applicationData.cStateId) == 0 ? '' : this.applicationData.cStateId,
          cDistrictId: Number(this.applicationData.cDistrictId) == 0 ? '' : this.applicationData.cDistrictId,
          cPinCode: this.applicationData.cPinCode,
          fatherMobileNo: this.applicationData.fatherMobileNo,
        });
        this.BankDetailsForm.patchValue({
          uanNo: this.applicationData.uanNo,
          esiNo: this.applicationData.esiNo,
          panNo: this.applicationData.panNo,
          bankId: Number(this.applicationData.bankId) == 0 ? '' : this.applicationData.bankId,
          bankAccountNo: this.applicationData.bankAccountNo,
          ifscCode: this.applicationData.ifscCode,
          adharNo: this.applicationData.adharNo,
          mrid: this.applicationData.mrid,
        });

        this.UploadFilesForm.patchValue({
          panFile: this.applicationData.panFile,
          adharFile: this.applicationData.adharFile,
          qualificationFile: this.applicationData.qualificationFile,
          bankStatementFile: this.applicationData.bankStatementFile,
          resumeFile: this.applicationData.resumeFile,
          passportPhoto: this.applicationData.passportPhoto,
        });
      }
    });
  }
  onStateChange(event: any, type: string): void {
    const selectedStateId = +event.target.value;

    if (selectedStateId) {
      if (type === 'permanent') {
        this.jobApplicationForm.patchValue({
          permanentDistrict: ''
        });
        this.GetCity(selectedStateId, 'permanent');
        this.jobApplicationForm.get('districtId')?.enable();
      } else if (type === 'correspondence') {
        this.jobApplicationForm.patchValue({
          cDistrictId: ''
        });
        this.GetCity(selectedStateId, 'correspondence');
        this.jobApplicationForm.get('cDistrictId')?.enable();
      }
    } else {
      if (type === 'permanent') {
        //this.jobApplicationForm.get('districtId')?.disable();
        this.districtsForState = [];
      } else if (type === 'correspondence') {
        //this.jobApplicationForm.get('correspondenceDistrict')?.disable();
        this.districtsForCorrespondenceState = [];
      }
    }
  }
  get f() {
    return this.jobApplicationForm.controls;
  }
  get g() {
    return this.BankDetailsForm.controls;
  }
  get h() {
    return this.UploadFilesForm.controls;
  }

  
  onSubmitCurrentForm(): void {
    if (this.currentStep === 1 && this.jobApplicationForm.valid) {
      this.submitJobApplicationForm();
    } else if (this.currentStep === 2 && this.BankDetailsForm.valid) {
      this.submitBankDetailsForm();
    } else if (this.currentStep === 3 && this.UploadFilesForm.valid) {
      this.submitUploadFilesForm();
    } else {
      Object.keys(this.BankDetailsForm.controls).forEach(key => {
        const control = this.BankDetailsForm.get(key);
        if (control && !control.valid) {
          console.error(`Field ${key} is invalid.`, control.errors);
        }
      });
      Swal.fire('Error', 'Please fill out all required fields.', 'error');
    }
  }

  submitJobApplicationForm(): void {
    const basic = new EmpBasic();
    this.jobApplicationForm.get('mobileNo')?.enable();
    Object.assign(basic, this.jobApplicationForm.value);
    basic.correspondenceAddress = this.jobApplicationForm.controls['cAddress'].value
    this.jobappservice.BasicDetail(basic).subscribe(
      (result: any) => {
        if (result.status == 200) {
          Swal.fire('Success!', 'Basic Details submitted successfully.', 'success').then(() => {
            this.currentStep++;
          });
        }
      },
      (error: any) => {
        Swal.fire('Error', error.error.title, 'error');
      }
    );
  }

  submitBankDetailsForm(): void {
    const bank = new EmpBank();
    Object.assign(bank, this.BankDetailsForm.value);
    bank.mobileNo = this.MobileNo;
    this.jobappservice.BankDetail(bank).subscribe(
      (result: any) => {
        if (result.status == 200) {
          Swal.fire('Success!', 'Bank details submitted successfully.', 'success').then(() => {
            this.currentStep++;
          });
        }
      },
      (error: any) => {
        Swal.fire('Error', error.error.title, 'error');
      }
    );
  }

  submitUploadFilesForm(): void {
    this.empfiles.mobileNo = this.MobileNo;
    this.jobappservice.SubmitApplication(this.empfiles).subscribe(
      (result: any) => {
        if (result.status == 200) {
          Swal.fire({
              title: 'Success!',
              text: 'Your application has been submitted successfully.',
              icon: 'success',
             confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['']);
            });
        }
      },
      (error: any) => {
        Swal.fire('Error', error.error.title, 'error');
      }
    );
  }


  onCopyAddressChange(event: any): void {
    if (event.target.checked) {
      this.jobApplicationForm.patchValue({
        cAddress: this.jobApplicationForm.get('permanentAddress')?.value,
        cPinCode: this.jobApplicationForm.get('pinCode')?.value,
        cStateId: this.jobApplicationForm.get('stateId')?.value,
        cDistrictId: this.jobApplicationForm.get('districtId')?.value,
      });
      const permanentStateId = this.jobApplicationForm.get('stateId')?.value;
      if (permanentStateId) {
        this.GetCity(permanentStateId, 'correspondence');
      }
    } else {
      this.jobApplicationForm.patchValue({
        cAddress: '',
        cPinCode: '',
        cStateId: '',
        cDistrictId: '',
      });
      this.districtsForCorrespondenceState = [];
    }
  }
  submitTermsForm() {
    if (this.jobApplicationForm.get('termsCheck')?.value == true && this.jobApplicationForm.get('name')?.value && this.jobApplicationForm.get('fatherName')?.value)
      sessionStorage.setItem('name', this.jobApplicationForm.get('name')?.value);
    sessionStorage.setItem('fatherName', this.jobApplicationForm.get('fatherName')?.value);
    window.open('/T&C', '_blank');
  }
  goToNext(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  goToPrevious(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onFileChange(event: Event, fieldName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = ['pdf', 'jpg', 'jpeg', 'png'];
      const filename = file.name;
      const extension = filename.split('.').pop()?.toLowerCase();
      if (extension && !allowedTypes.includes(extension)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid file type!',
          text: 'Please upload a PDF, JPG, JPEG, or PNG file.',
          confirmButtonText: 'OK'
        });
        input.value = '';
      }
      else {
        switch (fieldName) {
          case 'adharFile':
            this.empfiles.adharFile = file;
            break;
          case 'panFile':
            this.empfiles.panFile = file;
            break;
          case 'qualificationFile':
            this.empfiles.qualificationFile = file;
            break;
          case 'bankStatementFile':
            this.empfiles.bankStatementFile = file;
            break;
          case 'resumeFile':
            this.empfiles.resumeFile = file;
            break;
          case 'passportPhoto':
            this.empfiles.passportPhoto = file;
            break;
          default:
            console.error('Unknown field name:', fieldName);
        }
      }
    }
  }
  onLanguageChange(): void {
    this.changeLabels(this.language ? 'en' : 'hn');
  }
  changeLabels(language: string): void {
    if (language == 'en') {
      this.labels = {
        labelDivision: "Location",
        labelName: "Full Name",
        labelFatherName: "Father's Name",
        labelDOB: "Date of Birth",
        labelGender: "Gender",
        labelMaritalStatus: "Marital Status",
        labelEmail: "Email Address",
        labelMobileNo: "Mobile No",
        labelPermanentAddress: "Permanent Address",
        labelPincode: "Pincode",
        labelState: "State",
        labelDistrict: "District",
        labelCorrespondenceAddress: "Correspondence Address",
        labelCPinCode: "Pincode",
        labelCStateId: "State",
        labelCDistrict: "District",
        labelcopyAddress: "Copy Permanent Address to Correspondence Address",
        labelFatherMobileNo: "Father's Mobile No",
        labelUANNo: "UAN Number",
        labelESINo: "ESI Number",
        labelPanNo: "PAN Number",
        labelBankName: "Bank Name",
        labelBankAccountNo: "Bank Account No",
        labelIFSCCode: "IFSC Code",
        labelAdharNo: "Aadhaar No",
        labelFacePhoto: "Upload Face Photo",
        labelResume: "Resume",
        labelBankStatement: "Upload Bank Statement / Passbook",
        labelQualification: "Qualification",
        labelPan: "Pan Card",
        labelAdhar: "Aadhar Card (upload front and back side)",
        labelMRID: "MRID",
        labelPrevious: "Previous",
        labelSubmit: "Submit",
        labelNext: "Next",
        labelPersonal: "Employee Personal Details",
        labelBank: "Bank Details",
        labelUploadFiles: "Upload Files"
      };
    } else if (language == 'hn') {
      this.labels = {
        labelDivision: "जगह",
        labelName: "नाम",
        labelFatherName: "पिता का नाम",
        labelDOB: "जन्म तिथि",
        labelGender: "लिंग",
        labelMaritalStatus: "वैवाहिक स्थिति",
        labelEmail: "ईमेल पता",
        labelMobileNo: "मोबाइल नंबर",
        labelPermanentAddress: "स्थायी पता",
        labelPincode: "पिनकोड",
        labelState: "राज्य",
        labelDistrict: "जिला",
        labelCorrespondenceAddress: "पत्राचार का पता",
        labelCPinCode: "पिनकोड",
        labelCStateId: "राज्य",
        labelCDistrict: "जिला",
        labelcopyAddress: "स्थायी पते को पत्राचार पते पर कॉपी करें",
        labelFatherMobileNo: "पिता का मोबाइल नंबर",
        labelUANNo: "UAN नंबर",
        labelESINo: "ESI नंबर",
        labelPanNo: "पैन नंबर",
        labelBankName: "बैंक का नाम",
        labelBankAccountNo: "बैंक खाता नंबर",
        labelIFSCCode: "IFSC कोड",
        labelAdharNo: "आधार नंबर",
        labelFacePhoto: "चेहरे का फोटो अपलोड करें",
        labelResume: "संक्षिप्त विवरण",
        labelBankStatement: "बैंक स्टेटमेंट/पासबुक अपलोड करें",
        labelQualification: "योग्यता",
        labelPan: "पैन कार्ड",
        labelAdhar: "आधार कार्ड (सामने और पीछे का हिस्सा अपलोड करें)",
        labelMRID: "MRID",
        labelPrevious: "पिछला",
        labelSubmit: "जमा करें",
        labelNext: "अगला",
        labelPersonal: "कर्मचारी व्यक्तिगत विवरण",
        labelBank: "बैंक विवरण",
        labelUploadFiles: "फाइलें अपलोड करें",

      };
    }
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
  GetSubDivision(zoneId: number) {
    this.jobappservice.GetSubDivision(zoneId).subscribe(
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
  ngAfterViewInit(): void {
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    $('#datepicker').datepicker({
      format: 'dd/mm/yyyy',
      autoclose: true,
      todayHighlight: true,
      endDate: eighteenYearsAgo,
    })
      .on('changeDate', (e: any) => {
        const selectedDate = e.format('dd/mm/yyyy');
        this.jobApplicationForm.patchValue({ dateOfBirth: selectedDate });
      });
  }
}
