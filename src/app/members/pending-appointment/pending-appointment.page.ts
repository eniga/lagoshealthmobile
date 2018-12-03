import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UsersModel, ServiceType } from 'src/app/model';
import {HttpService } from 'src/app/services/http-service.service';
import {BasicService } from 'src/app/services/basic.service';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-pending-appointment',
  templateUrl: './pending-appointment.page.html',
  styleUrls: ['./pending-appointment.page.scss'],
})
export class PendingAppointmentPage implements OnInit {

  phcId: number;
  pendingAppointments: ServiceType[];
  appointments: ServiceType;
  count: number;

  constructor(private storage: Storage, private httpService: HttpService,
    private basicService: BasicService, private navCtrl: NavController) {

  }
ngOnInit() {}

  ionViewWillEnter() {
    this.storage.get('user').then((val: UsersModel) => {
      this.phcId = val.phcId;
      this.GetPendingAppointments(val.phcId).then(() => {
        this.count = this.pendingAppointments.length;
      });
    });
  }

GetPendingAppointments(phcId) {
  return new Promise((resolve, reject) => {
  this.basicService.loader();
    this.httpService.GetAllRecords('Appointments/Pending/' + phcId).subscribe((data) => {
      this.pendingAppointments = data;
      console.log(this.pendingAppointments);
      resolve(true);
      if (this.pendingAppointments === undefined) {
        this.basicService.presentAlert('Success', 'No pending appointments', 'OK' );
      }
    });
  });
}

// GetDetails(serviceTypeId) {
//     if (serviceTypeId) {
//       this.appointments = this.pendingAppointments.filter(x => x.serviceTypeId === serviceTypeId)[0];
//       if (this.appointments.appointments.length > 0) {
//         console.log(this.appointments);
//         this.basicService.setter(this.appointments);
//         this.navCtrl.navigateForward('/members/appointments');
//         return;
//       }
//         console.log('im here');
//         this.basicService.presentAlert('', 'No pending appointments for this service type.', 'OK' );
//     }
//  }

}
