import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './../../services/authentication.service';
import { Storage } from '@ionic/storage';
import {UsersModel, ServiceType } from 'src/app/model';
import {HttpService } from 'src/app/services/http-service.service';
import {BasicService } from 'src/app/services/basic.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  pendingAppointments: ServiceType[];
  username: string;
  defaulters: any;
  count: number;

  constructor(private storage: Storage, private authService: AuthenticationService,
    private httpService: HttpService,
    private basicService: BasicService) { }

  ngOnInit() {
    this.storage.get('user').then((val: UsersModel) => {
      console.log(val);
      this.username = val.username;
      this.GetPendingAppointments(val.phcId).then(() => {
         this.count = this.pendingAppointments.length;
      });
    });
  }

  logout() {
    this.authService.logout();
  }

  GetPendingAppointments(phcId) {
    return new Promise((resolve, reject) => {
      this.httpService.GetAllRecords('Appointments/Pending/' + phcId).subscribe((data) => {
        this.pendingAppointments = data;
        console.log(this.pendingAppointments);
        resolve(true);
      });
    });
  }
}
