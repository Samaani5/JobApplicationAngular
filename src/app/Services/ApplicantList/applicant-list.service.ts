import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AddVacancy } from '../../Models/AddVacancy/add-vacancy';
import { Applicationlist, EmployeeDetail } from '../../Models/ApplicationList/applicationlist-request';
import { PostedJobListReq } from '../../Models/JobPosting/job-posting';
import { SendOTPRequest } from '../../Models/SendOTP/send-otprequest';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicantListService {

  constructor(private http: GlobalService) { }

  GetDataDashboardLinked(model: Applicationlist): Observable<any> {
    let url: string = environment.apiUrl + 'Report/GetDataDashboardLinked';
    return this.http.post(url, model);
  }
  GetSearchDataPhotoSmart(model: Applicationlist): Observable<any> {
    let url: string = environment.apiUrl + 'Report/GetSearchDataPhotoSmart';
    return this.http.post(url, model);
  }
  PostVacancy(model: AddVacancy): Observable<any> {
    let url: string = environment.apiUrl + 'JobPosting/PostVacancy';
    return this.http.post(url, model);
  }
  UpdateVacancyViaId(model: AddVacancy): Observable<any> {
    let url: string = environment.apiUrl + 'JobPosting/UpdateVacancyViaId';
    return this.http.post(url, model);
  }
  GetDesignationforOnline(): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetDesignationforOnline';
    return this.http.postWithoutResponse(url, null);
  }
  GetDataForVerify(model: Applicationlist): Observable<any> {
    let url: string = environment.apiUrl + 'Report/GetDataForVerify';
    return this.http.post(url, model);
  }
  GetDataForVerifyByApplicantId(model: Applicationlist): Observable<any> {
    let url: string = environment.apiUrl + 'Report/GetDataForVerifyByApplicantId';
    return this.http.post(url, model);
  }
  UpdateApplicantDetail(model: Applicationlist): Observable<any> {
    let url: string = environment.apiUrl + 'Report/UpdateApplicantDetail';
    return this.http.post(url, model);
  }
  GetDataApplicantOther(model: EmployeeDetail): Observable<any> {
    let url: string = environment.apiUrl + 'Report/GetDataApplicantOther';
    return this.http.post(url, model);
  }
  JobList(model: PostedJobListReq): Observable<any> {
    let url: string = environment.apiUrl + 'JobPosting/JobList';
    return this.http.post(url, model);
  }
  JobDetailViaVacancyId(model: PostedJobListReq): Observable<any> {
    let url: string = environment.apiUrl + 'JobPosting/JobDetailViaVacancyId';
    return this.http.post(url, model);
  }
  Skipapplication(model: EmployeeDetail): Observable<any> {
    let url: string = environment.apiUrl + 'Report/Skipapplication';
    return this.http.post(url, model);
  }
  SearchByName(model: EmployeeDetail): Observable<any> {
    let url: string = environment.apiUrl + 'Report/SearchByName';
    return this.http.post(url, model);
  }
  generateApplicantPdf(model: EmployeeDetail): Observable<Blob> {
    let url: string = environment.apiUrl + 'Employee/EmployeePDF';
    return this.http.postForBlob(url, model);
  }
}
