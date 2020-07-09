import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendAppSettings } from 'src/app/backend.settings';
import { IJwtResponse } from 'src/app/model/response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  authenticate(username: string, password: string) {
    const url = BackendAppSettings.endpoint.authenticate.getUrl();
    return this.http.post(url, {userName: username, password: password})
    .subscribe((res: IJwtResponse) => {
      const token = 'Bearer ' + res.jwt;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("username", username);
      return true;
    });
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem('username')
    return !(user === null)
  }

  logOut() {
    sessionStorage.removeItem('username')
  }
}
