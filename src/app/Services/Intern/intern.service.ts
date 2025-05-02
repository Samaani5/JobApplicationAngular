import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { InternDetail, InternQuestionAnswer } from '../../Models/Intern/intern-detail';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class InternService {

  constructor(private http: GlobalService) { }
  SaveUserInfo(model: InternDetail): Observable<any> {
    const url = environment.apiUrl + 'Intern/SaveInternInfo';
    return this.http.post(url, model);
  }
  SaveQA(model: InternQuestionAnswer): Observable<any> {
    const url = environment.apiUrl + 'Intern/SaveQA';
    return this.http.post(url, model);
  }
  getInternDetail(mobileNo: string): Observable<any> {
    const url = environment.apiUrl + 'Intern/InternDetail';
    const body = { mobileNo }
    return this.http.post(url, body);
  }
  generate(prompt: string): Observable<any> {
    const url = environment.apiUrl + 'Intern/Generate';
    const body = { prompt }
    return this.http.post(url, body);
  }
}
