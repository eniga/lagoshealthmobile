import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { NewPatientModel, UsersModel } from 'src/app/model';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  GetAllRecords(path) {
    return this.http.get<any>(environment.api_url + path);
  }

  AddRecord(path, data) {
    return this.http.post<any>(environment.api_url + path, data);
  }

  PutRecord(path, data) {
    return this.http.put<any>(environment.api_url + path, data);
  }
}
