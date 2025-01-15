import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.css'
})
export class TermsComponent implements OnInit {
  fullName: string | null = '';
  fatherName: string | null = '';

  ngOnInit(): void {
    this.fullName = sessionStorage.getItem('name');
    this.fatherName = sessionStorage.getItem('fatherName');
  }
}
