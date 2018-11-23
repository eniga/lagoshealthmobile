import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginUserModel, LoginResponse } from '../model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  login(loginUser: LoginUserModel) {
    return this.http.post<LoginResponse>(environment.api_url + 'users/login', loginUser);
  }
}
