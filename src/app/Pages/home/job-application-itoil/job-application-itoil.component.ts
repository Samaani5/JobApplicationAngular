import { CommonModule, DatePipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterLink } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { District, LanguageLabels, State, SubDivision } from '../../../Models/JobApplication/language-labels';
import { AddressDetail, BasicDetail, Experience, ExperienceDetail, HealthDetail, JobApplicationFormRequest, JobApplicationFormRequestIO, Language, LanguageDetail, PassportDetail, Qualification, RemoveQualDetail, Resume, Skill, SkillDetail, SocialDetail } from '../../../Models/JobApplication/job-application-form-request';
import { JobApplicationService } from '../../../Services/JobApplication/job-application.service';
import { switchMap } from 'rxjs';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

declare var Swal: any;
declare var $: any;


@Component({
  selector: 'app-job-application-itoil',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf, FormsModule, NgFor, TitleCasePipe, DatePipe, CommonModule, MatDatepickerModule, MatInputModule, MatNativeDateModule],
  templateUrl: './job-application-itoil.component.html',
  styleUrl: './job-application-itoil.component.css',
  providers: [DatePipe, MatDatepickerModule]
})
export class JobApplicationITOilComponent {
  jobApplicationForm: FormGroup = new FormGroup({});
  addressForm: FormGroup = new FormGroup({});
  passportDetailsForm: FormGroup = new FormGroup({});
  healthDetailsForm: FormGroup = new FormGroup({});
  languageForm: FormGroup = new FormGroup({});
  QualificationForm: FormGroup = new FormGroup({});
  experienceDetailForm: FormGroup = new FormGroup({});
  itSkillForm: FormGroup = new FormGroup({});
  socialForm: FormGroup = new FormGroup({});
  position: string = '';
  labels = new LanguageLabels();
  states: State[] = [];
  districtsForState: District[] = [];
  districtsForCorrespondenceState: District[] = [];
  language = "";
  MobileNo = '';
  employeeData: JobApplicationFormRequestIO = new JobApplicationFormRequestIO();
  applicationData: BasicDetail = new BasicDetail();
  skillDetail: SkillDetail = new SkillDetail();
  addressDetail: AddressDetail = new AddressDetail();
  healthDetail: HealthDetail = new HealthDetail();
  passportDetail: PassportDetail = new PassportDetail();
  languageDetail: LanguageDetail = new LanguageDetail();
  experienceDetail: ExperienceDetail = new ExperienceDetail();
  qualificationDetail: Qualification = new Qualification();
  socialDetail: SocialDetail = new SocialDetail();
  skill: Skill = new Skill();
  lg: Language = new Language();
  experience: Experience = new Experience();
  resumeModel = new Resume;
  currentStep: number = 1;
  Applicantmodel: HealthDetail = new HealthDetail();
  subDivisions: SubDivision[] = [];
  ZoneId = 0;

  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2020, 0, 1);
  isFormValid = false;
  savedTabs: boolean[] = [];
  safeResumeUrl!: SafeResourceUrl;

  constructor(private fb: FormBuilder, private router: Router, private jobappservice: JobApplicationService, private datePipe: DatePipe, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.MobileNo = JSON.parse(sessionStorage.getItem('MobileNo') || '')
    this.ZoneId = Number(JSON.parse(sessionStorage.getItem('zoneId') || '0'));
    this.position = JSON.parse(sessionStorage.getItem('groupName') || '')
    const mobileNo = sessionStorage.getItem('MobileNo');
    this.MobileNo = mobileNo ? JSON.parse(mobileNo) : '';
    this.jobApplicationForm = this.fb.group({
      revenueId: [0, Validators.required],
      fName: ['', Validators.required],
      mName: [''],
      lName: ['', Validators.required],
      nationality: ['', Validators.required],
      fatherName: ['', Validators.required],
      fatherMobileNo: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      vehicleType: ['No', Validators.required],
      drivingLicenseNo: [''],
      dateOfBirth: ['', Validators.required],
      gender: ['Male', Validators.required],
      maritalStatus: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      mobileNo: [{ value: this.MobileNo, disabled: true }, Validators.required],
      Photofile: ['', Validators.required],
    });
    this.addressForm = this.fb.group({
      permanentAddress: ['', Validators.required],
      stateId: ['', Validators.required],
      districtId: [{ value: '' }, Validators.required],
      pinCode: ['', Validators.required],
      correspondenceAddress: ['', Validators.required],
      cStateId: ['', Validators.required],
      cDistrictId: [{ value: '' }, Validators.required],
      cPinCode: ['', Validators.required],
      copyAddress: [false],
    });
    this.itSkillForm = this.fb.group({
      skills: this.fb.array([this.createSkillsTab()]),
    });
    this.passportDetailsForm = this.fb.group({
      passportNo: [''],
      dateOfIssue: [''],
      validUpto: [''],
      issuedBy: [''],
      passAddress: [''],
      pCityName: [''],
      emigrationChecReq: [''],
    });
    this.healthDetailsForm = this.fb.group({
      empHealth_Id: [0],
      vision: ['No', Validators.required],
      diabetes: ['No', Validators.required],
      bloodPressure: ['No', Validators.required],
      heartAilments: ['No', Validators.required],
      anyOtherIllnes: ['', Validators.required],
      lastMajorIllness: ['', Validators.required],
      majoreIllnessDate: ['', Validators.required],
      bloodGroop: ['', Validators.required],
    });
    this.languageForm = this.fb.group({
      languages: this.fb.array([this.createLanguageTab()])
    });
    this.QualificationForm = this.fb.group({
      qualifications: this.fb.array([this.createQualificationTab()]),
    });
    this.savedTabs.push(false);
    this.experienceDetailForm = this.fb.group({
      experiences: this.fb.array([this.createExperienceTab()])
    });
    this.socialForm = this.fb.group({
      FacebookId: [''],
      LinkdinId: [''],
      InstagramId: [''],
      TwiterId: [''],
      Resumefile: ['', Validators.required]
    });
    this.socialForm.valueChanges.subscribe(() => {
      this.checkSocialFormValidity();
    });
    this.loadUserData(this.MobileNo);
    this.GetSubDivision(this.ZoneId);
    this.GetState();
    this.jobApplicationForm.get('stateId')?.setValue(3);
    this.GetCity(3, 'permanent');
    this.GetCity(3, 'correspondence');
    this.jobApplicationForm.get('districtId')?.setValue(0);
    this.jobApplicationForm.get('cDistrictId')?.setValue(0);
    this.changeLabels('en');
  }
  checkSocialFormValidity() {
    const facebookId = this.socialForm.get('FacebookId')?.value?.trim();
    const linkdinId = this.socialForm.get('LinkdinId')?.value?.trim();
    const instagramId = this.socialForm.get('InstagramId')?.value?.trim();
    const twiterId = this.socialForm.get('TwiterId')?.value?.trim();
    const resumeFile = this.socialForm.get('Resumefile')?.value || this.employeeData.resumeFilePath;
    const isFileSelected = resumeFile === '' ? false : true;
    this.isFormValid = (facebookId || linkdinId || instagramId || twiterId) && isFileSelected;
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
    this.Applicantmodel = {
      mobileNo: mobileno,
    };
    this.jobappservice.getApplicantDetails(this.Applicantmodel).subscribe((data: any) => {
      this.employeeData = data.body;
      // console.log("this.employeeData", this.employeeData)
      const formattedDateOfBirth = this.formatDate(this.employeeData.dateOfBirth);
      this.jobApplicationForm.patchValue({
        revenueId: this.employeeData.revenueId,
        fName: this.employeeData.name,
        mName: this.employeeData.mName,
        lName: this.employeeData.lName,
        fatherName: this.employeeData.fatherName,
        nationality: this.employeeData.nationality,
        dateOfBirth: formattedDateOfBirth,
        gender: this.employeeData.gender || 'male',
        maritalStatus: this.employeeData.maritalStatus || '',
        emailAddress: this.employeeData.emailAddress,
        fatherMobileNo: this.employeeData.fatherMobileNo,
        vehicleType: this.employeeData.vehicleType,
        drivingLicenseNo: this.employeeData.drivingLicenseNo,
        PhotofileUrl: this.employeeData.passportPhotoFilePath
      });
      if (this.employeeData.passportPhotoFilePath) {
        this.jobApplicationForm.get('Photofile')?.clearValidators();
        this.jobApplicationForm.get('Photofile')?.updateValueAndValidity();
      }
      this.addressForm.patchValue({
        permanentAddress: this.employeeData.permanentAddress,
        stateId: this.employeeData.stateId || '',
        districtId: this.employeeData.districtId,
        pinCode: this.employeeData.pinCode,
        correspondenceAddress: this.employeeData.correspondenceAddress,
        cStateId: this.employeeData.cStateId || '0',
        cDistrictId: this.employeeData.cDistrictId,
        cPinCode: this.employeeData.cPinCode,
      })
      if (this.employeeData.stateId)
        this.GetCity(Number(this.employeeData.stateId), 'permanent');
      if (this.employeeData.cStateId)
        this.GetCity(Number(this.employeeData.stateId), 'correspondence');
      const formattedDateOfIssue = this.formatDate(this.employeeData.dateOfIssue);
      const formattedValidUpto = this.formatDate(this.employeeData.validUpto);
      this.passportDetailsForm.patchValue({
        passportNo: this.employeeData.passportNo,
        dateOfIssue: formattedDateOfIssue,
        validUpto: formattedValidUpto,
        issuedBy: this.employeeData.issuedBy,
        passAddress: this.employeeData.passAddress,
        pCityName: this.employeeData.pCityName,
        emigrationChecReq: this.employeeData.emigrationChecReq,
      });
      this.socialForm.patchValue({
        FacebookId: this.employeeData.facebookId,
        LinkdinId: this.employeeData.linkdinId,
        InstagramId: this.employeeData.instagramId,
        TwiterId: this.employeeData.twiterId,
        ResumefileUrl: this.employeeData.resumeFilePath
      })
      if (this.employeeData.resumeFilePath) {
        this.jobApplicationForm.get('Resumefile')?.clearValidators();
        this.jobApplicationForm.get('Resumefile')?.updateValueAndValidity();
        this.safeResumeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.employeeData.resumeFilePath
        );
      }
      if (this.employeeData.healthDetails) {
        this.healthDetailsForm.patchValue({
          empHealth_Id: this.employeeData.healthDetails.empHealth_Id,
          vision: this.employeeData.healthDetails.vision,
          bloodPressure: this.employeeData.healthDetails.bloodPressure,
          diabetes: this.employeeData.healthDetails.diabetes,
          heartAilments: this.employeeData.healthDetails.heartAilments,
          anyOtherIllnes: this.employeeData.healthDetails.anyOtherIllnes,
          lastMajorIllness: this.employeeData.healthDetails.lastMajorIllness,
          majoreIllnessDate: this.formatDate(this.employeeData.healthDetails.majoreIllnessDate || ''),
          bloodGroop: this.employeeData.healthDetails.bloodGroop
        })
      }
      if (this.employeeData.skillDetails.length > 0) {
        this.skills.clear();
        this.employeeData.skillDetails.forEach(skill => {
          const skillFormGroup = this.createSkillsTab();
          skillFormGroup.patchValue(skill);
          this.skills.push(skillFormGroup);
        });
      }
      if (this.employeeData.languageDetails.length > 0) {
        this.languages.clear();
        this.employeeData.languageDetails.forEach(language => {
          const languageFormGroup = this.createLanguageTab();
          languageFormGroup.patchValue(language);
          this.languages.push(languageFormGroup)
        });
      }
      if (this.employeeData.qualificationDetails.length > 0) {
        this.qualifications.clear();
        this.employeeData.qualificationDetails.forEach((qual, index) => {
          const qualificationFormGroup = this.createQualificationTab();
          if (qual.imageFile) {
            qualificationFormGroup.get('imageFile')?.clearValidators();
            qualificationFormGroup.get('imageFile')?.updateValueAndValidity();
            const safeImageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(qual.imageFile);
            qualificationFormGroup.patchValue({
              safeImageFileUrl: safeImageUrl,
            });
          }
          qualificationFormGroup.patchValue({
            qulDtl_Id: qual.qulDtl_Id,
            OrderNo: qual.orderNo,
            DegreeName: qual.degreeName,
            Specialization: qual.specialization,
            PassingYear: qual.passingYear.trim(),
            imageFileUrl: qual.imageFile,
          });
          this.qualifications.push(qualificationFormGroup);
        });
      }
      if (this.employeeData.experienceDetails.length > 0) {
        this.experiences.clear();
        this.employeeData.experienceDetails.forEach((exp, index) => {
          const experienceFormGroup = this.createExperienceTab();
          const formattedStartDate = this.formatDate(exp.startDate);
          const formattedEndDate = this.formatDate(exp.endDate);
          experienceFormGroup.patchValue({
            ...exp,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            currentlyWorking: exp.endDate === null ? true : false
          });
          this.experiences.push(experienceFormGroup)
          if (exp.endDate === null) {
            this.toggleEndDate(index);
          }
        })
      }
    });
  }
  preventDot(event: KeyboardEvent): void {
    if (event.key === '.') {
      event.preventDefault(); 
    }
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
          correspondenceDistrict: ''
        });
        this.GetCity(selectedStateId, 'correspondence');
        this.jobApplicationForm.get('cDistrictId')?.enable();
      }
    } else {
      if (type === 'permanent') {
        this.districtsForState = [];
      } else if (type === 'correspondence') {
        this.districtsForCorrespondenceState = [];
      }
    }
  }
  get f() {
    return this.jobApplicationForm.controls;
  }
  onSubmitCurrentForm(): void {
    if (this.currentStep === 1 && this.jobApplicationForm.valid) {
      this.submitJobApplicationForm();
    } else if (this.currentStep === 2 && this.itSkillForm.valid) {
      this.submititSkillForm();
    } else if (this.currentStep === 3 && this.addressForm.valid) {
      this.submitaddressForm();
    } else if (this.currentStep === 4 && this.healthDetailsForm.valid) {
      this.submitHealthForm();
    } else if (this.currentStep === 5 && this.passportDetailsForm.valid) {
      this.submitpassportDetailsForm();
    } else if (this.currentStep === 6 && this.languageForm.valid) {
      this.submitlanguageForm();
    } else if (this.currentStep === 8 && this.experienceDetailForm.valid) {
      this.submitexperienceDetailForm();
    } else if (this.currentStep === 9 && this.isFormValid) {
      this.submitsocialForm();
      //} else {
      //  Object.keys(this.BankDetailsForm.controls).forEach(key => {
      //    const control = this.BankDetailsForm.get(key);
      //    if (control && !control.valid) {
      //      console.error(`Field ${key} is invalid.`, control.errors);
      //    }
      //  });
      //Swal.fire('Error', 'Please fill out all required fields.', 'error');
    }
  }
  submitJobApplicationForm(): void {
    this.jobApplicationForm.get('mobileNo')?.enable();
    this.applicationData.fName = this.jobApplicationForm.controls['fName'].value;
    this.applicationData.mName = this.jobApplicationForm.controls['mName'].value;
    this.applicationData.lName = this.jobApplicationForm.controls['lName'].value;
    this.applicationData.fatherName = this.jobApplicationForm.controls['fatherName'].value;
    this.applicationData.fatherMobileNo = this.jobApplicationForm.controls['fatherMobileNo'].value;
    this.applicationData.nationality = this.jobApplicationForm.controls['nationality'].value;
    this.applicationData.drivingLicenseNo = this.jobApplicationForm.controls['drivingLicenseNo'].value;
    this.applicationData.vehicleType = this.jobApplicationForm.controls['vehicleType'].value;
    this.applicationData.dateOfBirth = this.jobApplicationForm.controls['dateOfBirth'].value;
    this.applicationData.gender = this.jobApplicationForm.controls['gender'].value;
    this.applicationData.maritalStatus = this.jobApplicationForm.controls['maritalStatus'].value;
    this.applicationData.emailAddress = this.jobApplicationForm.controls['emailAddress'].value;
    this.applicationData.mobileNo = this.jobApplicationForm.controls['mobileNo'].value;
    this.applicationData.revenueId = this.jobApplicationForm.controls['revenueId'].value;
    this.jobappservice.AddEmployeeFirst(this.applicationData).subscribe(
      (result: any) => {
        if (result.status == 200) {
          Swal.fire('Success!', 'Basic Details submitted successfully.', 'success').then(() => {
            if (this.currentStep < 9) {
              this.currentStep++;
            }
          });
        }
      },
      (error: any) => {
        Swal.fire('Error', error.error.title, 'error');
      }
    );
  }
  submititSkillForm(): void {
    this.skillDetail.mobileNo = this.MobileNo;
    this.skillDetail.skillDtl = this.skills.value.map((skill: any) => ({
      id: skill.id,
      skillName: skill.skillName,
      softwareVerson: skill.softwareVerson,
      lastUsed: skill.lastUsed,
      experienceYear: skill.experienceYear,
      experienceMonth: skill.experienceMonth,
    }));
    this.jobappservice.AddSecondScreen(this.skillDetail).subscribe(
      (result: any) => {
        if (result.status == 200) {
          Swal.fire('Success!', 'Skills submitted successfully.', 'success').then(() => {
            if (this.currentStep < 9) {
              this.currentStep++;
            }
          });
        }
      },
      (error: any) => {
        Swal.fire('Error', error.error.title, 'error');
      }
    );
  }
  submitaddressForm(): void {
    Object.assign(this.addressDetail, this.addressForm.value);
    this.addressDetail.mobileNo = this.MobileNo;
    this.jobappservice.AddThirdScreen(this.addressDetail).subscribe(
      (result: any) => {
        if (result.status == 200) {
          Swal.fire('Success!', 'Address details submitted successfully.', 'success').then(() => {
            if (this.currentStep < 9) {
              this.currentStep++;
            }
          });
        }
      },
      (error: any) => {
        Swal.fire('Error', error.error.title, 'error');
      }
    );
  }
  submitHealthForm(): void {
    Object.assign(this.healthDetail, this.healthDetailsForm.value);
    this.healthDetail.mobileNo = this.MobileNo;
    this.jobappservice.AddFourthScreen(this.healthDetail).subscribe(
      (result: any) => {
        if (result.status == 200) {
          Swal.fire('Success!', 'Health details submitted successfully.', 'success').then(() => {
            if (this.currentStep < 9) {
              this.currentStep++;
            }
          });
        }
      },
      (error: any) => {
        Swal.fire('Error', error.error.title, 'error');
      }
    );
  }
  submitpassportDetailsForm(): void {
    const isFormFilled = Object.values(this.passportDetailsForm.value).some(
      value => value && String(value).trim() !== ''
    );
    if (isFormFilled) {
      Object.assign(this.passportDetail, this.passportDetailsForm.value);
      this.passportDetail.mobileNo = this.MobileNo;
      this.jobappservice.AddFifthScreen(this.passportDetail).subscribe(
        (result: any) => {
          if (result.status == 200) {
            Swal.fire('Success!', 'Passport details submitted successfully.', 'success').then(() => {
              if (this.currentStep < 9) {
                this.currentStep++;
              }
            });
          }
        },
        (error: any) => {
          Swal.fire('Error', error.error.title, 'error');
        }
      );
    } else {
      Swal.fire('Info', 'No passport details were entered, skipping submission.', 'info').then(() => {
        if (this.currentStep < 9) {
          this.currentStep++;
        }
      });
    }
  }
  submitlanguageForm(): void {
    this.languageDetail.mobileNo = this.MobileNo;
    this.languageDetail.lanDtl = this.languages.value.map((lang: any) => ({
      empLanguage_Id: lang.empLanguage_Id,
      languageName: lang.languageName,
      speek: lang.speek == true ? 1 : 0,
      understand: lang.understand == true ? 1 : 0,
      read: lang.read == true ? 1 : 0,
      write: lang.write == true ? 1 : 0,
    }));
    this.jobappservice.AddSixScreen(this.languageDetail).subscribe(
      (result: any) => {
        if (result.status == 200) {
          Swal.fire('Success!', 'Languages submitted successfully.', 'success').then(() => {
            if (this.currentStep < 9) {
              this.currentStep++;
            }
          });
        }
      },
      (error: any) => {
        Swal.fire('Error', error.error.title, 'error');
      }
    );
  }
  submitexperienceDetailForm(): void {
    this.experienceDetail.mobileNo = this.MobileNo;
    this.experienceDetail.expDtl = this.experiences.value.map((exp: any) => ({
      empExperienceId: exp.empExperienceId,
      companyName: exp.companyName,
      position: exp.position,
      startDate: exp.startDate,
      endDate: exp.endDate,
      hodName: exp.hodName,
      hodEmail: exp.hodEmail,
      hodMobileNo: exp.hodMobileNo,
    }));
    this.jobappservice.AddEightScreen(this.experienceDetail).subscribe(
      (result: any) => {
        if (result.status == 200) {
          Swal.fire('Success!', 'Experience submitted successfully.', 'success').then(() => {
            if (this.currentStep < 9) {
              this.currentStep++;
            }
          });
        }
      },
      (error: any) => {
        Swal.fire('Error', error.error.title, 'error');
      }
    );
  }
  submitsocialForm(): void {
    this.socialDetail.FacebookId = this.socialForm.controls['FacebookId'].value;
    this.socialDetail.TwiterId = this.socialForm.controls['TwiterId'].value;
    this.socialDetail.InstagramId = this.socialForm.controls['InstagramId'].value;
    this.socialDetail.LinkdinId = this.socialForm.controls['LinkdinId'].value;
    this.socialDetail.mobileNo = this.MobileNo;
    if (!this.socialDetail.Resumefile && this.employeeData.resumeFilePath) {
      this.handlePdfUpload(this.employeeData.resumeFilePath)
        .then((file) => {
          this.socialDetail.Resumefile = file;
          this.sendSocialData(); 
        })
        .catch((error) => {
          console.error('Error handling PDF upload:', error.message);
        });
    } else {
      this.sendSocialData(); 
    }
  }
  sendSocialData() {
    this.jobappservice.AddNineScreen(this.socialDetail).subscribe(
      (result: any) => {
        if (result.status == 200) {
          Swal.fire('Success!', 'Your Application submitted successfully.', 'success').then(() => {
            if (this.currentStep < 9) {
              this.currentStep++;
            }
            this.router.navigate(['/final-job-application-details']);
          });
        }
      },
      (error: any) => {
        Swal.fire('Error', error.error.title, 'error');
      }
    );
  }
  handlePdfUpload(url: string): Promise<File> {
    return this.downloadFile(url)
      .then((blob) => {
        const fileName = url.split('/').pop() || 'uploaded-file.pdf';
        return this.convertBlobToFile(blob, fileName);
      })
      .catch((error) => {
        throw new Error(`Error handling PDF upload: ${error.message}`);
      });
  }

  downloadFile(url: string): Promise<Blob> {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to download file from URL: ${url}`);
        }
        return response.blob();
      });
  }

  convertBlobToFile(blob: Blob, fileName: string): File {
    return new File([blob], fileName, { type: blob.type });
  }



  goToNext(): void {
    if (this.currentStep < 8) {
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
      const filename = file.name;
      const extension = filename.split('.').pop()?.toLowerCase();
      let allowedTypes: string[] = [];
      switch (fieldName) {
        case 'Resumefile':
          allowedTypes = ['pdf'];
          break;
        case 'Photofile':
          allowedTypes = ['jpg', 'jpeg', 'png'];
          break;
        case 'imageFile':
          allowedTypes = ['pdf'];
          break;
        default:
          console.error('Unknown field name:', fieldName);
          return;
      }
      if (extension && !allowedTypes.includes(extension)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid file type!',
          text: `Please upload a ${allowedTypes.join(', ').toUpperCase()} file.`,
          confirmButtonText: 'OK',
        });
        input.value = '';
        return;
      }
      switch (fieldName) {
        case 'Resumefile':
          this.socialDetail.Resumefile = file;
          break;
        case 'Photofile':
          this.applicationData.Photofile = file;
          break;
        case 'imageFile':
          this.qualificationDetail.imageFile = file;
          break;
        default:
          console.error('Unknown field name:', fieldName);
      }
    }
  }

  onLanguageChange(): void {
    this.changeLabels(this.language ? 'hn' : 'en');
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
        labelAdhar: "Aadhar Card",
        labelMRID: "MRID",
        labelHodName: "HOD Name",
        labelHodEmail: "HOD Email Address",
        labelHodMobileNo: "HOD Mobile No",
        labelFromDate: "Starting Date",
        labelToDate: "Leaving Date",
        labelCompany: "Company Name",
        labelPosition: "Position",
        labelExperienceDetails: "Experience Details",
        labelKeySkills: "Skill / software name",
        labelPersonal: "Employee Personal Details",
        labelPassport: "Passport Details",
        labelPassportNo: "Passport Number",
        labelIssuedDate: "Issued Date",
        labelValidUpto: "Valid Upto",
        labelEmigration: "Emigration Check",
        labelHealth: "Health Details",
        labelVision: "Vision",
        labelDiabetes: "Diabetes",
        labelBloodPressure: "Blood Press.(High/Low)",
        labelHeartAliments: "Heart Aliments",
        labelOtherIllness: "Other Illness",
        labelLastMajorIllness: "Last Major Illness",
        labelLastMajorIllnessDate: "Last Major Illness Date",
        labelBloodGroup: "Blood Group",
        labelLanguageDetails: "Language Details",
        labelLanguage: "Language",
        labelUnderstand: "Understand",
        labelWrite: "Write",
        labelSpeak: "Speak",
        labelRead: "Read",
        labelActions: "Actions",
        labelAddress: "Address Details",
        labelQualificatonDetails: "Qualification Details",
        labelSubject: "Specialization",
        labelPassingYear: "Passing Year",
        labelUploadImage: "Upload Image",
        labelPrevious: "Previous",
        labelSubmit: "Submit",
        labelNext: "Next",
        labelDegree: "Degree",
        labelITSkill: "Skills",
        labelIssuedBy: "Issued By",
        labelCity: "City",
        labelNationality: "Nationality",
        labelVehicalType: "Vehical Type",
        labelDrivingLicenceNo: "Driving Licence No",
        labelPassportAddress: "Passport Address",
        labelSoftwareVersion: "Software version",
        labelLastUsed: "Last used",
        labelExperience: "Experience",
        labelFacebookId: "Facebook ID",
        labelLinkdinId: "LinkedIn ID",
        labelInstagramId: "Instagram ID",
        labelTwiterId: "Twitter ID",
        labelResumefile: "Resume File",
        labelSocial: "Social Details",
        labelCurrentlyWorking: "Currently Working Here?",

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
        labelAdhar: "आधार कार्ड",
        labelMRID: "MRID",
        labelHodName: "HOD नाम",
        labelHodEmail: "HOD ईमेल पता",
        labelHodMobileNo: "HOD मोबाइल नंबर",
        labelFromDate: "आरंभ तिथि",
        labelToDate: "छोड़ने की तारीख",
        labelCompany: "कंपनी नाम",
        labelPosition: "पद",
        labelExperienceDetails: "अनुभव विवरण",
        labelKeySkills: "प्रमुख कौशल",
        labelPersonal: "कर्मचारी व्यक्तिगत विवरण",
        labelPassport: "पासपोर्ट विवरण",
        labelPassportNo: "पासपोर्ट नंबर",
        labelIssuedDate: "जारी तिथि",
        labelValidUpto: "वैधता तिथि",
        labelEmigration: "प्रवासन जांच",
        labelHealth: "स्वास्थ्य विवरण",
        labelVision: "दृष्टि",
        labelDiabetes: "मधुमेह",
        labelBloodPressure: "रक्तचाप (उच्च/निम्न)",
        labelHeartAliments: "हृदय रोग",
        labelOtherIllness: "अन्य बीमारियां",
        labelLastMajorIllness: "पिछली बड़ी बीमारी",
        labelLastMajorIllnessDate: "पिछली बड़ी बीमारी की तिथि",
        labelBloodGroup: "रक्त समूह",
        labelLanguageDetails: "भाषा विवरण",
        labelLanguage: "भाषा",
        labelUnderstand: "समझना",
        labelWrite: "लिखना",
        labelSpeak: "बोलना",
        labelRead: "पढ़ना",
        labelActions: "क्रियाएं",
        labelAddress: "पता विवरण",
        labelQualificatonDetails: "योग्यता विवरण",
        labelSubject: "विशेषज्ञता",
        labelPassingYear: "उत्तीर्ण वर्ष",
        labelUploadImage: "छवि अपलोड करें",
        labelPrevious: "पिछला",
        labelSubmit: "जमा करें",
        labelNext: "अगला",
        labelDegree: "डिग्री",
        labelITSkill: "कौशल",
        labelIssuedBy: "जारी करने वाला",
        labelCity: "शहर",
        labelNationality: "राष्ट्रीयता",
        labelVehicalType: "वाहन प्रकार",
        labelDrivingLicenceNo: "ड्राइविंग लाइसेंस नंबर",
        labelPassportAddress: "पता",
        labelSoftwareVersion: "सॉफ़्टवेयर संस्करण",
        labelLastUsed: "अंतिम उपयोग",
        labelExperience: "अनुभव",
        labelFacebookId: "फेसबुक आईडी",
        labelLinkdinId: "लिंक्डइन आईडी",
        labelInstagramId: "इंस्टाग्राम आईडी",
        labelTwiterId: "ट्विटर आईडी",
        labelResumefile: "रिज़्यूमे फ़ाइल",
        labelSocial: "सामाजिक विवरण",
        labelCurrentlyWorking: "वर्तमान में यहाँ कार्यरत हैं?",
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

  get skills(): FormArray {
    return this.itSkillForm.get('skills') as FormArray;
  }
  createSkillsTab(): FormGroup {
    return this.fb.group({
      id: [0],
      skillName: ['', Validators.required],
      softwareVerson: ['', Validators.required],
      lastUsed: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      experienceYear: ['', [Validators.required, Validators.min(0)]],
      experienceMonth: ['', [Validators.required, Validators.min(0), Validators.max(11)]],
    });
  }
  addSkillsTab(index: number): void {
    this.skills.push(this.createSkillsTab());
  }
  removeSkillsTab(index: number): void {
    if (this.skills.length > 1) {
      this.skills.removeAt(index);
    }
  }

  get qualifications(): FormArray {
    return this.QualificationForm.get('qualifications') as FormArray;
  }
  createQualificationTab(): FormGroup {
    return this.fb.group({
      qulDtl_Id: [0],
      OrderNo: ['', Validators.required],
      DegreeName: ['', Validators.required],
      Specialization: ['', Validators.required],
      PassingYear: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{4}$/)]],
      imageFile: ['', Validators.required],
      imageFileUrl: [''],
      safeImageFileUrl: [''],
    });
  }
  addQualicationTab(index: number): void {
    this.qualifications.push(this.createQualificationTab());
    this.savedTabs.push(false);
  }
  deleteQualicationTab(index: number): void {
    if (this.qualifications.length > 1) {
      this.qualifications.removeAt(index);
      // this.savedTabs.splice(index, 1);
    }
  }
  removeQualicationTab(index: number): void {
    // if (this.qualifications.length > 1) {
    const tabData = this.qualifications.at(index)?.value;
    const orderNo = parseInt(tabData?.OrderNo, 10);

    const removeDetail: RemoveQualDetail = {
      mobileNo: this.MobileNo,
      orderNo: isNaN(orderNo) ? 0 : orderNo
    };
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this qualification?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.jobappservice.DeleteSevenScreen(removeDetail).subscribe(
          (response: any) => {
            if (response.status === 200) {
              Swal.fire('Deleted!', 'Qualification deleted successfully.', 'success');
              this.qualifications.removeAt(index);
              this.savedTabs.splice(index, 1);
              this.addQualicationTab(index + 1);
            } else {
              Swal.fire('Error', 'Failed to delete qualification.', 'error');
            }
          },
          (error: any) => {
            Swal.fire('Error', error.error.title || 'Failed to delete qualification.', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your qualification is safe!', 'info');
      }
    });
  }
  saveQualification(index: number): void {
    if (this.QualificationForm.valid) {
      this.savedTabs[index] = true;
      if (index < 0 || index >= this.qualifications.length) {
        console.error('Invalid index:', index);
        Swal.fire('Error', 'Invalid tab index.', 'error');
        return;
      }

      const tabData = this.qualifications.at(index)?.value;
      console.log('Tab Data:', tabData);

      if (!tabData) {
        Swal.fire('Error', 'Tab data is missing.', 'error');
        return;
      }
      const orderNo = parseInt(tabData.OrderNo, 10);
      this.qualificationDetail.MobileNo = this.MobileNo;
      this.qualificationDetail.orderNo = isNaN(orderNo) ? 0 : orderNo;
      this.qualificationDetail.degreeName = tabData.DegreeName || this.QualificationForm.controls['DegreeName'].value;
      this.qualificationDetail.specialization = tabData.Specialization || this.QualificationForm.controls['Specialization'].value;
      this.qualificationDetail.passingYear = tabData.PassingYear || this.QualificationForm.controls['PassingYear'].value;
      this.qualificationDetail.qulDtl_Id = tabData.qulDtl_Id || this.QualificationForm.controls['qulDtl_Id'].value;
      if (!this.qualificationDetail.imageFile && this.employeeData.qualificationDetails[index].imageFile) {
        this.handlePdfUpload(this.employeeData.qualificationDetails[index].imageFile)
          .then((file) => {
            this.qualificationDetail.imageFile = file;
            this.sendQualificationData();
          })
          .catch((error) => {
            console.error('Error handling PDF upload:', error.message);
          });
      } else {
        this.sendQualificationData();
      }
    }
  }
  sendQualificationData() {
    this.jobappservice.AddSevenScreen(this.qualificationDetail).subscribe(
      (result: any) => {
        if (result.status === 200) {
          Swal.fire('Success!', 'Qualification submitted successfully.', 'success')
        }
      },
      (error: any) => {
        Swal.fire('Error', error.error.title, 'error');
      }
    );
  }
  submitQualificationTab(): void {
    if (this.currentStep === 7) {
      const isAnyTabSaved = this.savedTabs.some((isSaved) => isSaved);
      if (!isAnyTabSaved && this.employeeData.qualificationDetails.length == 0) {
        Swal.fire('Error', 'Please fill and save at least one qualification tab before proceeding.', 'error');
        return;
      }
      const areAllTabsSaved = this.savedTabs.every((isSaved) => isSaved);
      if (areAllTabsSaved) {
        Swal.fire('Success', 'All qualifications have been saved and submitted.', 'success');
      }
    }
    if (this.currentStep < 8) {
      this.currentStep++;
    }
  }

  get languages(): FormArray {
    return this.languageForm.get('languages') as FormArray;
  }
  createLanguageTab(): FormGroup {
    return this.fb.group({
      empLanguage_Id: [0],
      languageName: ['', Validators.required],
      understand: [false],
      read: [false],
      write: [false],
      speek: [false]
    });
  }
  addlanguageTab(index: number): void {
    this.languages.push(this.createLanguageTab());
  }
  removelanguageTab(index: number): void {
    if (this.languages.length > 1) {
      this.languages.removeAt(index);
    }
  }

  get experiences(): FormArray {
    return this.experienceDetailForm.get('experiences') as FormArray;
  }

  createExperienceTab(): FormGroup {
    return this.fb.group({
      empExperienceId: [0],
      companyName: ['', Validators.required],
      position: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      currentlyWorking: [false],
      hodName: [''],
      hodMobileNo: [''],
      hodEmail: ['']
    });
  }
  addTab(index: number): void {
    this.experiences.push(this.createExperienceTab());
  }
  removeTab(index: number): void {
    if (this.experiences.length > 1) {
      this.experiences.removeAt(index);
    }
  }
  saveExperience(index: number) {
    const experience = this.experiences.at(index).value;
    console.log('Saved experience:', experience);
  }

  ngAfterViewInit(): void { }
  ngAfterViewChecked(): void {
    this.initializeDatepicker('#dateOfBirth', this.jobApplicationForm, 'dateOfBirth');
    this.initializeDatepicker('#majoreIllnessDate', this.healthDetailsForm, 'majoreIllnessDate');
    this.initializeDatepicker('#dateOfIssue', this.passportDetailsForm, 'dateOfIssue');
    this.initializeDatepicker('#validUpto', this.passportDetailsForm, 'validUpto');
    this.initializeDatepicker('#lastUsed', this.jobApplicationForm, 'lastUsed');
    this.experiences.controls.forEach((control: any, index: number) => {
      this.initializeDatepicker(`#startDate${index}`, control, 'startDate');
      this.initializeDatepicker(`#endDate${index}`, control, 'endDate');
    });
  }

  private initializeDatepicker(elementId: string, formGroup: any, controlName: string): void {
    const element = $(elementId);
    if (element.length > 0 && !element.data('datepicker')) {
      console.log(`${controlName} initialized`);
      element.datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
        todayHighlight: true,
      }).on('changeDate', (e: any) => {
        const selectedDate = e.format('dd/mm/yyyy');
        formGroup.patchValue({ [controlName]: selectedDate });
      });
    }
  }

  onCopyAddressChange(event: any): void {
    if (event.target.checked) {
      this.addressForm.patchValue({
        correspondenceAddress: this.addressForm.get('permanentAddress')?.value,
        cPinCode: this.addressForm.get('pinCode')?.value,
        cStateId: this.addressForm.get('stateId')?.value,
        cDistrictId: this.addressForm.get('districtId')?.value,
      });
      const permanentStateId = this.addressForm.get('stateId')?.value;
      if (permanentStateId) {
        this.GetCity(permanentStateId, 'correspondence');
      }
    } else {
      this.addressForm.patchValue({
        correspondenceAddress: '',
        cPinCode: '',
        cStateId: '',
        cDistrictId: '',
      });
      this.districtsForCorrespondenceState = [];
    }
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
  toggleEndDate(index: number): void {
    const experience = this.experiences.at(index);
    const currentlyWorking = experience.get('currentlyWorking')?.value;

    if (currentlyWorking) {
      experience.get('endDate')?.setValue('');
      experience.get('endDate')?.disable();
    } else {
      experience.get('endDate')?.enable();
    }
  }
}
