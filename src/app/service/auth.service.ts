import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authUrl = environment.authUrl;
  loggedInStatus = false;

  constructor(private _http: HttpClient) { }

  get loginStatus() {
    return this.loggedInStatus;
  }

  login(obj) {
    return this._http.post(this.authUrl+'login', obj);
  }

  token() {
    return this._http.get(this.authUrl+'token');
  }

}
