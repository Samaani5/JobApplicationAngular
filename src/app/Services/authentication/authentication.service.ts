import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Login } from '../../models/Login/login';
import { UserSession } from '../../Models/UserSession/user-session';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public isAuthenticated = false;
  private isSidebarCollapsed = new BehaviorSubject<boolean>(true);
  usession = new UserSession;
  constructor(private http: GlobalService) {
    this.usession = JSON.parse((sessionStorage.getItem('session') || '{}'));
  }

  getLoginUser(loginInfo: Login): Observable<any> {
    let url: string = environment.apiUrl + 'Dashboard/Login';
    this.isAuthenticated = true;
    sessionStorage.setItem('isAuthenticated', 'true');
    return this.http.post(url, loginInfo);
  }

  logout(): Observable<any> {
    let url: string = environment.apiUrl + 'Account/Logout';
    this.isAuthenticated = false;
    sessionStorage.removeItem('isAuthenticated');
    return this.http.post(url, {});
  }

  public get loggedIn(): boolean {
    return (sessionStorage.getItem('session') !== null);
  }

  isAuthenticatedUser() {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  }
  getSidebarState() {
    return this.isSidebarCollapsed.asObservable();
  }
  toggleSidebar() {
    this.isSidebarCollapsed.next(!this.isSidebarCollapsed.value);
  }
  get userRole(): number {
    this.usession = JSON.parse((sessionStorage.getItem('session') || '{}'));
    return this.usession?.roleId || 0;
  }

  hasAccess(allowedRoles: number[]): boolean {
    return allowedRoles.includes(this.userRole);
  }
}
