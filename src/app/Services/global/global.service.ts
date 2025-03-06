import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HeaderService } from '../header/header.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(private http: HttpClient, private headerService: HeaderService) { }

  get(url: string): Observable<any> {
    return this.http.get(url, { headers: this.headerService.getAPIHeadersWithAuth() });
  }

  post(url: string, obj: any): Observable<HttpResponse<any>> {
    return this.http.post(url, obj, { headers: this.headerService.getAPIHeadersWithoutAuth(), observe: 'response' });
  }

  postWithFiles(url: string, obj: any): Observable<any> {
    return this.http.post(url, obj, {
      headers: this.headerService.getAPIHeadersWithAuthForMedia(), reportProgress: true,
      observe: 'events', });
  }
  getWithoutAuth(url: string): Observable<any> {
    return this.http.get(url, { headers: this.headerService.getAPIHeadersWithoutAuth() });
  }
  postWithoutResponse(url: string, obj: any): Observable<any> {
    return this.http.post(url, obj, { headers: this.headerService.getAPIHeadersWithoutAuth() });
  }
  postForBlob(url: string, obj: any): Observable<Blob> {
    return this.http.post(url, obj, {
      headers: this.headerService.getAPIHeadersWithAuth(),
      responseType: 'blob',
    });
  }
}
