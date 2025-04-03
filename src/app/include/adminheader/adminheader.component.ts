import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { UserSession } from '../../Models/UserSession/user-session';
import { AuthenticationService } from '../../Services/authentication/authentication.service';

@Component({
  selector: 'app-adminheader',
  standalone: true,
  imports: [NgIf],
  templateUrl: './adminheader.component.html',
  styleUrl: './adminheader.component.css'
})
export class AdminheaderComponent {
  usession = new UserSession;
  constructor(private _auth: AuthenticationService){}
  toggleSidebar() {
    this._auth.toggleSidebar();
  }
  hasAccess(allowedRoles: number[]): boolean {
    return this._auth.hasAccess(allowedRoles);
  }
}
