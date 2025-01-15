import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: GlobalService) { }

  GetDashBoardData(): Observable<any> {
    let url: string = environment.apiUrl + 'Dashboard/GetDashBoardData';
    return this.http.post(url, null);
  }
  GetDashBoardDataMonth(): Observable<any> {
    let url: string = environment.apiUrl + 'Dashboard/GetDashBoardDataMonth';
    return this.http.post(url, null);
  }
}
