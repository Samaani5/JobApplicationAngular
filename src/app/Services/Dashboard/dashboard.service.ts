import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: GlobalService) { }

  GetDashBoardData(userId: number): Observable<any> {
    let url: string = environment.apiUrl + 'Dashboard/GetDashBoardData';
    const body = { userId };
    return this.http.post(url, body);
  }
  GetDashBoardDataMonth(userId: number): Observable<any> {
    let url: string = environment.apiUrl + 'Dashboard/GetDashBoardDataMonth';
    const body = { userId };
    return this.http.post(url, body);
  }
}
