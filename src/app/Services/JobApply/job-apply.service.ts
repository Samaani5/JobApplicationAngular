import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AddDesignation, AddGroupDivision, AddProject, AddStepMaster, AddSubDivision, AddZone, PayrollDataRequest } from '../../Models/Masters/add-group-division';
import { SendOTPRequest } from '../../Models/SendOTP/send-otprequest';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class JobApplyService {

  constructor(private http: GlobalService) { }

  GetGroupdivisions(): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetGroupdivisions';
    return this.http.post(url, null);
  }
  GetDesignation(groupDivisionId: Number): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetDesignation';
    const body = { groupDivisionId };
    return this.http.postWithoutResponse(url, body);
  }
  GetLocation(groupDivisionId: Number): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetLocation';
    const body = { groupDivisionId };
    return this.http.postWithoutResponse(url, body);
  }
  GetProject(groupDivisionId: Number): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetProject';
    const body = { groupDivisionId };
    return this.http.postWithoutResponse(url, body);
  }
  SendWhatsappOTP(model: SendOTPRequest): Observable<any> {
    let url: string = environment.apiUrl + 'Master/SendWhatsappOTP';
    return this.http.post(url, model);
  }
  ReSendWhatsappOTP(model: SendOTPRequest): Observable<any> {
    let url: string = environment.apiUrl + 'Master/ReSendWhatsappOTP';
    return this.http.post(url, model);
  }
  VerifyOTP(model: SendOTPRequest): Observable<any> {
    let url: string = environment.apiUrl + 'Master/VerifyOTP';
    return this.http.postWithoutResponse(url, model);
  }
  OpenVacancies(groupDivisionId: Number): Observable<any> {
    let url: string = environment.apiUrl + 'JobPosting/OpenVacancies';
    const body = { groupDivisionId };
    return this.http.postWithoutResponse(url, body);
  }
  GetAllGroupdivisions(): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetAllGroupdivisions';
    return this.http.post(url, null);
  }
  GetAllLocations(): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetAllLocation';
    return this.http.post(url, null);
  }
  GetAllDesignations(): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetAllDesignation';
    return this.http.post(url, null);
  }
  GetAllProjects(): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetAllProject';
    return this.http.post(url, null);
  }
  GetProjectById(model: AddProject): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetProjectById';
    return this.http.post(url, model);
  }
  GetGroupdivisionById(model: AddGroupDivision): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetGroupdivisionById';
    return this.http.post(url, model);
  }
  AddGroupDivision(model: AddGroupDivision): Observable<any> {
    let url: string = environment.apiUrl + 'Master/AddGroupDivision';
    return this.http.post(url, model);
  }
  AddProject(model: AddProject): Observable<any> {
    let url: string = environment.apiUrl + 'Master/AddProject';
    return this.http.post(url, model);
  }
  AddDesignation(model: AddDesignation): Observable<any>{
    let url: string = environment.apiUrl + 'Master/AddDesignation';
    return this.http.post(url, model);
  }
  GetDesignationById(model: AddDesignation): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetDesignationById';
    return this.http.post(url, model);
  }
  AddZone(model: AddZone): Observable<any> {
    let url: string = environment.apiUrl + 'Master/AddZone';
    return this.http.post(url, model);
  }
  GetLocationById(model: AddZone): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetLocationById';
    return this.http.post(url, model);
  }
  GetAllSubDivision(): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetAllSubDivision';
    return this.http.post(url, null);
  }
  GetSubDivisionById(model: AddSubDivision): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetSubDivisionById';
    return this.http.post(url, model);
  }
  AddSubDivision(model: AddSubDivision): Observable<any> {
    let url: string = environment.apiUrl + 'Master/AddSubDivision';
    return this.http.post(url, model);
  }
  GetGroupDivisionListByCompanyId(model: PayrollDataRequest): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetGroupDivisionListByCompanyId';
    return this.http.post(url, model);
  }
  GetBranchListByGroupDivision(model: PayrollDataRequest): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetBranchListByGroupDivision';
    return this.http.post(url, model);
  }
  GetDepartmentListByBranchId(model: PayrollDataRequest): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetDepartmentListByBranchId';
    return this.http.post(url, model);
  }
  GetDesignationListByDepartmentId(model: PayrollDataRequest): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetDesignationListByDepartmentId';
    return this.http.post(url, model);
  }
  GetSubDivisionListByDepartmentId(model: PayrollDataRequest): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetSubDivisionListByDepartmentId';
    return this.http.post(url, model);
  }
  AddStepMaster(model: AddStepMaster): Observable<any> {
    let url: string = environment.apiUrl + 'Master/AddStepMaster';
    return this.http.post(url, model);
  }
  GetStepById(model: AddStepMaster): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetStepById';
    return this.http.post(url, model);
  }
  GetAllSteps(): Observable<any> {
    let url: string = environment.apiUrl + 'Master/GetAllSteps';
    return this.http.post(url, null);
  }
}
