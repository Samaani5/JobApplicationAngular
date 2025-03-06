import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../environments/environment';
import { AddressDetail, BasicDetail, EmpBank, EmpBasic, EmpFiles, ExperienceDetail, HealthDetail, JobApplicationFormRequest, JobApplicationFormRequestIO, LanguageDetail, PassportDetail, Qualification, RemoveQualDetail, Resume, SkillDetail, SocialDetail } from '../../Models/JobApplication/job-application-form-request';
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
  SubmitApplication(model: EmpFiles): Observable<any> {
    let url: string = environment.apiUrl + 'Master/SubmitApplication';
    const formData = new FormData();
    formData.append('MobileNo', model.mobileNo || '');
    if (model.panFile) formData.append('pancardfile', model.panFile);
    if (model.resumeFile) formData.append('Resumefile', model.resumeFile);
    if (model.qualificationFile) formData.append('Qualificationfile', model.qualificationFile);
    if (model.adharFile) formData.append('adharfile', model.adharFile, model.adharFile.name);
    if (model.bankStatementFile) formData.append('Bankfile', model.bankStatementFile);
    if (model.passportPhoto) formData.append('PassportPhotofile', model.passportPhoto);
    return this.http.postWithFiles(url, formData);
  }
  BasicDetail(model: EmpBasic): Observable<any> {
    let url: string = environment.apiUrl + 'Master/BasicDetail';
    return this.http.post(url, model);
  }
  BankDetail(model: EmpBank): Observable<any> {
    let url: string = environment.apiUrl + 'Master/BankDetail';
    return this.http.post(url, model);
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
