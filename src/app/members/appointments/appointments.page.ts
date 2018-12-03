import { Component, OnInit } from '@angular/core';
import { ServiceType } from 'src/app/model';
import {BasicService } from 'src/app/services/basic.service';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.page.html',
  styleUrls: ['./appointments.page.scss'],
})
export class AppointmentsPage implements OnInit {
appointments: ServiceType;
defaulter = false;
page: string;

  constructor(private basicService: BasicService, private callNumber: CallNumber) {
    this.appointments = basicService.getter();
    this.page = this.basicService.Page;
    console.log(this.page);
    if (this.page === 'defaulters') {
      this.defaulter = true;
    }
   }

  ngOnInit() {

  }

  CallNumber(number) {
    this.callNumber.callNumber(number, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }
}
