import { Component } from '@angular/core';
import { AuthenticationService } from '../../Services/authentication/authentication.service';

@Component({
  selector: 'app-adminheader',
  standalone: true,
  imports: [],
  templateUrl: './adminheader.component.html',
  styleUrl: './adminheader.component.css'
})
export class AdminheaderComponent {
  constructor(private _auth: AuthenticationService) { }

  toggleSidebar() {
    this._auth.toggleSidebar();
  }
}
