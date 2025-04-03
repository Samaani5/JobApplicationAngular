import { isPlatformBrowser, NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, Inject, NgModule, PLATFORM_ID, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Login } from '../../models/Login/login';
import { UserSession } from '../../Models/UserSession/user-session';
import { AuthenticationService } from '../../Services/authentication/authentication.service';
import { UserService } from '../../Services/user/user.service';
declare var Swal: any;
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, ReactiveFormsModule, NgClass, NgStyle],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoginPage = false;
  isContentLoaded = false;
  loginInfo = new Login;
  usession: UserSession;
  message = "";

  constructor(private renderer: Renderer2, private route: ActivatedRoute, private router: Router, @Inject(PLATFORM_ID) private platformId: Object,
    private _auth: AuthenticationService, private userService: UserService) {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.clear();
      window.sessionStorage.clear();
    }
    this.loginInfo = {
      webLoginCode: ''
    };
    this.usession = {
      emailAddress: '',
      Token: '',
      TokenExpireTime: '',
      status: '',
      userId: 0,
      roleId: 0,
      name: '',
      userPhoto: '',
      userGroupDivisions: [],
      userZones:[],
    };
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoginPage = this.route.snapshot.routeConfig?.path === 'login';
      if (this.isLoginPage) {
        this.loadExternalResources();
        setTimeout(() => {
          this.isContentLoaded = true;
        }, 500);
      }
    }
  }

  loginForm = new FormGroup({
    webLoginCode: new FormControl('', [Validators.required])
  })
  get webLoginCode() {
    return this.loginForm.get('webLoginCode');
  }
  onSubmit(): void {
    if (!this.loginForm.valid) {
      return;
    }
    this._auth.getLoginUser(this.loginInfo).subscribe(
      (result: any) => {
        debugger;
        if (result != null) {
          if (result.status != 200) {
            this.message = result.statusText;
            return;
          }
          if (result.body[0].message == "Authorization failed.") {
            Swal.fire({
              text: result.body[0].message,
              icon: 'error'
            });
            this.loginInfo.webLoginCode = '';
            return;
          }
          this.usession = result.body[0];
          localStorage.removeItem('login');
          //sessionStorage.setItem('session', JSON.stringify(this.usession));
          this.GetUserById(this.usession.userId);
        }
      },
      (error: any) => {
        this.message = "something went wrong";
      });
  }

  loadExternalResources() {
    this.addStylesheet('assets/css/bootstrap.css');
    this.addStylesheet('assets/css/core.css');
    this.addStylesheet('assets/css/font-icons.css');
    this.addStylesheet('/assets/css/form.css');
    this.addScript('assets/js/plugin.min.js');
    this.addScript('assets/js/plugin-join-able.js');
    this.addScript('assets/js/re-sizeable.js');
    this.addScript('assets/js/sidebar-api.js');
    this.addScript('assets/js/custom.js');
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

  GetUserById(Id: number) {
    this.userService.getUserById(Id).subscribe(
      (result: any) => {
        if (result.status == 200) {
          const users = result.body.users[0];
          this.usession.name = users.name;
          this.usession.roleId = users.roleId;
          this.usession.userPhoto = users.userPhoto;
          this.usession.userGroupDivisions = result.body.userGroupDivisions.map((loc: any) => loc.groupDivisionId);
          this.usession.userZones = result.body.userZones.map((step: any) => step.zoneId);
          sessionStorage.setItem('session', JSON.stringify(this.usession));
          setTimeout(() => {
            this.router.navigate(['/admin']);
          }, 100);
        }
      },
      (error: any) => {
        Swal.fire({
          text: error.message,
          icon: "error"
        });
      });
  }
}
