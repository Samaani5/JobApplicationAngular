import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../environments/environment';
import { AddressDetail, BasicDetail, ExperienceDetail, HealthDetail, JobApplicationFormRequest, JobApplicationFormRequestIO, LanguageDetail, PassportDetail, Qualification, RemoveQualDetail, Resume, SkillDetail, SocialDetail } from '../../Models/JobApplication/job-application-form-request';
import { SendOTPRequest } from '../../Models/SendOTP/send-otprequest';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {

  constructor(private http: GlobalService) { }

  GetState(countryId: Number): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetState';
    const body = { countryId };
    return this.http.post(url, body);
  }
  GetCity(stateId: Number): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetCity';
    const body = { stateId };
    return this.http.post(url, body);
  }
  GetBankName(): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetBankName';
    return this.http.post(url, null);
  }
  GetCompany(): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetCompany';
    return this.http.post(url, null);
  }
  GetStatusMaster(): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetStatusMaster';
    return this.http.post(url, null);
  }
  GetSubDivision(zoneId: number): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetSubDivision';
    const body = { zoneId };
    return this.http.post(url, body);
  }
  getUserDetails(model: SendOTPRequest): Observable<any> {
    let url: string = environment.apiUrl + 'Master/ApplicantDetail';
    return this.http.post(url, model);
  }
  getApplicantDetails(model: HealthDetail): Observable<any> {
    let url: string = environment.apiUrl + 'Employee/ApplicantDetail';
    return this.http.post(url, model);
  }
  submitApplication(applicationData: JobApplicationFormRequest): Observable<any> {
    let url: string = environment.apiUrl + 'Master/SubmitApplication';
    const formData = new FormData();
    formData.append('MRID', applicationData.mrid || '');
    formData.append('FacebookId', applicationData.FacebookId || '');
    formData.append('Gender', applicationData.gender || '');
    formData.append('PinCode', applicationData.pinCode || '');
    formData.append('UANNo', applicationData.uanNo || '');
    formData.append('MobileNo', applicationData.mobileNo || '');
    formData.append('MaritalStatus', applicationData.maritalStatus || '');
    formData.append('PermanentAddress', applicationData.permanentAddress || '');
    formData.append('FatherName', applicationData.fatherName || '');
    formData.append('DistrictId', applicationData.districtId || '');
    formData.append('CStateId', applicationData.cStateId || '');
    formData.append('LinkdinId', applicationData.LinkdinId || '');
    formData.append('Name', applicationData.name || '');
    formData.append('StateId', applicationData.stateId || '');
    formData.append('CDistrictId', applicationData.cDistrictId || '');
    formData.append('CPinCode', applicationData.cPinCode || '');
    formData.append('InstagramId', applicationData.InstagramId || '');
    formData.append('BankAccountNo', applicationData.bankAccountNo || '');
    formData.append('AdharNo', applicationData.adharNo || '');
    formData.append('EmailAddress', applicationData.emailAddress || '');
    formData.append('RevenueId', applicationData.revenueId || '');
    formData.append('DateOfBirth', applicationData.dateOfBirth || '');
    formData.append('CorrespondenceAddress', applicationData.cAddress || '');
    formData.append('IFSCCode', applicationData.ifscCode || '');
    formData.append('PANNo', applicationData.panNo || '');
    formData.append('FatherMobileNo', applicationData.fatherMobileNo || '');
    formData.append('TwiterId', applicationData.TwiterId || '');
    formData.append('BankId', String(Number(applicationData.bankId) == 0 ? 1 : Number(applicationData.bankId)));
    if (applicationData.panFile) formData.append('pancardfile', applicationData.panFile);
    if (applicationData.resumeFile) formData.append('Resumefile', applicationData.resumeFile);
    if (applicationData.qualificationFile) formData.append('Qualificationfile', applicationData.qualificationFile);
    if (applicationData.adharFile) formData.append('adharfile', applicationData.adharFile, applicationData.adharFile.name);
    if (applicationData.bankStatementFile) formData.append('Bankfile', applicationData.bankStatementFile);
    if (applicationData.passportPhoto) formData.append('PassportPhotofile', applicationData.passportPhoto);
    return this.http.postWithFiles(url, formData);
  }

  submitApplicationIO(applicationData: JobApplicationFormRequestIO): Observable<any> {
    let url: string = environment.apiUrl + 'JobPosting/ApplyJob';
    return this.http.post(url, applicationData);
  }
  SubmitResume(model: Resume): Observable<any> {
    let url: string = environment.apiUrl + 'JobPosting/SubmitResume';
    const formData = new FormData();
    formData.append('MobileNo', model.mobileNo || '');
    if (model.resumeFile) formData.append('Resumefile', model.resumeFile);
    return this.http.postWithFiles(url, formData);
  }
  AddEmployeeFirst(model: BasicDetail): Observable<any> {
    let url: string = environment.apiUrl + 'Employee/AddEmployeeFirst';
    const formData = new FormData();
    formData.append('FName', model.fName || '');
    formData.append('MName', model.mName || '');
    formData.append('LName', model.lName || '');
    formData.append('FatherName', model.fatherName || '');
    formData.append('FatherMobileNo', model.fatherMobileNo || '');
    formData.append('Nationality', model.nationality || '');
    formData.append('VehicleType', model.vehicleType || '');
    formData.append('DrivingLicenseNo', model.drivingLicenseNo || '');
    formData.append('DateOfBirth', model.dateOfBirth || '');
    formData.append('Gender', model.gender || '');
    formData.append('MaritalStatus', model.maritalStatus || '');
    formData.append('EmailAddress', model.emailAddress || '');
    formData.append('MobileNo', model.mobileNo || '');
    if (model.Photofile) formData.append('Photofile', model.Photofile);
    return this.http.postWithFiles(url, formData);
  }
  AddSecondScreen(model: SkillDetail): Observable<any> {
    let url: string = environment.apiUrl + 'Employee/AddSecondScreen';
    return this.http.post(url, model);
  }
  AddThirdScreen(model: AddressDetail): Observable<any> {
    let url: string = environment.apiUrl + 'Employee/AddThirdScreen';
    return this.http.post(url, model);
  }
  AddFourthScreen(model: HealthDetail): Observable<any> {
    let url: string = environment.apiUrl + 'Employee/AddFourthScreen';
    return this.http.post(url, model);
  }
  AddFifthScreen(model: PassportDetail): Observable<any> {
    let url: string = environment.apiUrl + 'Employee/AddFifthScreen';
    return this.http.post(url, model);
  }
  AddSixScreen(model: LanguageDetail): Observable<any> {
    let url: string = environment.apiUrl + 'Employee/AddSixScreen';
    return this.http.post(url, model);
  }
  AddSevenScreen(model: Qualification): Observable<any> {
    let url: string = environment.apiUrl + 'Employee/AddSevenScreen';
    const formData = new FormData();
    formData.append('MobileNo', model.MobileNo || '');
    formData.append('OrderNo', model.orderNo.toString() || '');
    formData.append('DegreeName', model.degreeName || '');
    formData.append('Specialization', model.specialization || '');
    formData.append('PassingYear', model.passingYear || '');
    formData.append('QulDtl_Id', model.qulDtl_Id.toString());
    if (model.imageFile) formData.append('imageFile', model.imageFile);
    return this.http.postWithFiles(url, formData);
  }
  DeleteSevenScreen(model: RemoveQualDetail): Observable<any> {
    const url: string = environment.apiUrl + 'Employee/DeleteSevenScreen';
    return this.http.post(url, model);
  }
  AddEightScreen(model: ExperienceDetail): Observable<any> {
    let url: string = environment.apiUrl + 'Employee/AddEightScreen';
    return this.http.post(url, model);
  }
  AddNineScreen(model: SocialDetail): Observable<any> {
    let url: string = environment.apiUrl + 'Employee/AddNineScreen';
    const formData = new FormData();
    formData.append('MobileNo', model.mobileNo || '');
    formData.append('FacebookId', model.FacebookId || '');
    formData.append('LinkdinId', model.LinkdinId || '');
    formData.append('InstagramId', model.InstagramId || '');
    formData.append('TwiterId', model.TwiterId || '');
    if (model.Resumefile) formData.append('Resumefile', model.Resumefile);
    return this.http.postWithFiles(url, formData);
  }
}
