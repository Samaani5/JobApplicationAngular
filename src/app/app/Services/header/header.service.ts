import { HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  usession: any;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.usession = {
      Id: '',
      Token: '',
      TokenExpireTime: '',
      LoginTime: '',
    };
  }

  getAPIHeadersWithAuth() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    this.usession = JSON.parse((sessionStorage.getItem('session') || '{}'));
    if (this.usession != null) {
      headers = headers.set('Authorization', 'Bearer ' + this.usession.Token);
    }
    return headers;
  }

  getAPIHeadersWithAuthForMedia() {
    let headers = new HttpHeaders();
    return new HttpHeaders();
  }

  getAPIHeadersWithoutAuth() {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return headers;
  }
  
}
