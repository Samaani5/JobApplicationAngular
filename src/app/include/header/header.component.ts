import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common'; 


declare var $: any;
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private router: Router) {
  }
  isToggled: boolean = false;
  
  toggleMenu() {
    this.isToggled = !this.isToggled;
    const divwidth = $('#pagecontent').width()
    if (divwidth > 767) {
      if (this.isToggled)
        $('#pagecontent').css("width", '100%');
      else
        $('#pagecontent').css("width", 'calc(100% - 250px)');
    }
    else {
      if (this.isToggled)
        $('#pagecontent').css("width", 'calc(100% - 250px)');
      else
      $('#pagecontent').css("width", '100%');
    }
  }

  logout() {
   
  }

}
