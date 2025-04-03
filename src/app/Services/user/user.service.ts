import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../Models/user/user';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: GlobalService) { }
  getUsers(): Observable<any> {
    const url = environment.apiUrl + 'User/GetUserList'; 
    return this.http.post(url, null);
  }

  getUserById(userId: number): Observable<any> {
    const url = environment.apiUrl + 'User/GetUserDetailByUserId';
    const body = { userId }
    return this.http.post(url, body);
  }

  SaveUserInfo(user: User): Observable<any> {
    const url = environment.apiUrl + 'User/SaveUserInfo'; 
    return this.http.post(url, user);
  }

  UpdateUserInfo(user: User): Observable<any> {
    const url = environment.apiUrl + 'User/UpdateUserInfo'; 
    return this.http.post(url, user);
  }

  updateUser(id: number, user: User): Observable<any> {
    const url = `${environment.apiUrl}UpdateUser/${id}`; 
    return this.http.post(url, user);
  }

  deleteUser(id: number): Observable<any> {
    const url = `${environment.apiUrl}DeleteUser/${id}`; 
    return this.http.post(url, { id: id });
  }

  getUsersByDivision(division: string): Observable<any> {
    const url = `${environment.apiUrl}GetUsersByDivision`;
    return this.http.post(url, { division: division }); 
  }

  getUsersByRole(role: string): Observable<any> {
    const url = `${environment.apiUrl}GetUsersByRole`;
    return this.http.post(url, { role: role });
  }

  getUsersByZoneDivision(zone: string, division: string): Observable<any> {
    const url = `${environment.apiUrl}GetUsersByZoneDivision`;
    return this.http.post(url, { zone: zone, division: division });
  }
  GetRoles(): Observable<any> {
    let url: string = environment.apiUrl + 'User/GetRoles';
    return this.http.post(url, null);
  }
}
