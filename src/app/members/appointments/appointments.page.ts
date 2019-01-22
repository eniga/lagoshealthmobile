import { HttpService } from 'src/app/services/http-service.service';
import { Component, OnInit } from '@angular/core';
import { ServiceType } from 'src/app/model';
import {BasicService } from 'src/app/services/basic.service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Storage } from '@ionic/storage';
import {UsersModel } from 'src/app/model';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.page.html',
  styleUrls: ['./appointments.page.scss'],
})
export class AppointmentsPage implements OnInit {
appointments: ServiceType;
defaulter = false;
page: string;
userId: number;

  constructor(private basicService: BasicService, private callNumber: CallNumber,
    private httpService: HttpService, private storage: Storage) {
    this.appointments = basicService.getter();
    this.page = this.basicService.Page;
    console.log(this.page);
    if (this.page === 'defaulters') {
      this.defaulter = true;
    }

    this.storage.get('user').then((val: UsersModel) => {
      console.log(val);
      this.userId = val.userId;
    });
   }

  ngOnInit() {

  }

  CallNumber(number) {
    this.callNumber.callNumber(number, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  ConfirmCall(value) {
    const data = {
      'appointmentId' : value.appointmentId,
      'insertUserId' : this.userId
    };
    console.log(data);
    const c = confirm('Are you sure you want to confirm this call?');
    console.log(c);

    if (c) {
      this.httpService.AddRecord('Appointments/Defaulters/Confirm', data).subscribe((res) => {
        console.log(res);
        if (res.status === true) {
          this.basicService.presentAlert('Success', res.statusMessage, 'OK');
          this.appointments.appointments.find(m => m.appointmentId === value.appointmentId).contactedBy = this.userId;
        } else {
          this.basicService.presentAlert('Error', res.statusMessage, 'OK');
        }
       });
    }
  }
}
