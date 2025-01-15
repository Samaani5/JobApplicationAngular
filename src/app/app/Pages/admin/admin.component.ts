import { NgClass, NgIf } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { AdminfooterComponent } from '../../include/adminfooter/adminfooter.component';
import { AdminheaderComponent } from '../../include/adminheader/adminheader.component';
import { AuthenticationService } from '../../Services/authentication/authentication.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [AdminheaderComponent, RouterModule, RouterOutlet, RouterLink, RouterLinkActive, NgIf, AdminfooterComponent, NgClass],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  isadminPage = false;
  isContentLoaded = false;
  isSidebarCollapsed = false;
  constructor(private renderer: Renderer2, private route: ActivatedRoute, private router: Router, private _auth: AuthenticationService) { }
  ngOnInit(): void {
    this.isadminPage = this.route.snapshot.routeConfig?.path === 'admin';

    if (this.isadminPage) {
      this.loadExternalResources();
      setTimeout(() => {
        this.isContentLoaded = true;
      }, 500);
    }
    this._auth.getSidebarState().subscribe(state => {
      this.isSidebarCollapsed = state;
    });
  }

  loadExternalResources() {
    this.addStylesheet('/assets/css/bootstrap.css');
    this.addStylesheet('/assets/css/core.css');
    this.addStylesheet('/assets/css/font-icons.css');
    this.addStylesheet('/assets/css/form.css');

    this.addScript('/assets/js/plugin.min.js');
    this.addScript('/assets/js/plugin-join-able.js');
    this.addScript('/assets/js/re-sizeable.js');
    this.addScript('/assets/js/sidebar-api.js');
    this.addScript('/assets/js/custom.js');
  }
  addStylesheet(href: string) {
    const link = this.renderer.createElement('link');
    this.renderer.setAttribute(link, 'rel', 'stylesheet');
    this.renderer.setAttribute(link, 'href', href);
    this.renderer.appendChild(document.head, link);
  }
  addScript(src: string) {
    const script = this.renderer.createElement('script');
    this.renderer.setAttribute(script, 'src', src);
    this.renderer.appendChild(document.head, script);
  }
  logout() {
    window.localStorage.clear();
    window.sessionStorage.clear();
    this.router.navigate(['login']);
  }
}
