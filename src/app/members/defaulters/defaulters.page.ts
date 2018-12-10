import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UsersModel, ServiceType } from 'src/app/model';
import {HttpService } from 'src/app/services/http-service.service';
import {BasicService } from 'src/app/services/basic.service';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-defaulters',
  templateUrl: './defaulters.page.html',
  styleUrls: ['./defaulters.page.scss'],
})
export class DefaultersPage implements OnInit {

defaulters: ServiceType[];
appointments: ServiceType;
count: number;

  constructor(private storage: Storage, private httpService: HttpService,
     private basicService: BasicService,
     private navCtrl: NavController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.storage.get('user').then((val: UsersModel) => {
      this.GetDefaulters(val.phcId).then(() => {
         this.count = this.defaulters.length;
      });
    });
  }

  GetDefaulters(phcId) {
    return new Promise((resolve, reject) => {
      this.basicService.loader();
      this.httpService.GetAllRecords('Appointments/Defaulters/' + phcId).subscribe((data) => {
        this.defaulters = data;
        this.basicService.loading.dismiss();
        console.log(this.defaulters);
        if (this.defaulters === undefined) {
          this.basicService.presentAlert('', 'No defaulters to show.', 'OK' );
        }
      });
    });
}

GetDetails(serviceTypeId) {
  if (serviceTypeId) {
    this.appointments = this.defaulters.filter(x => x.serviceTypeId === serviceTypeId)[0];
    if (this.appointments.appointments.length > 0) {
      console.log(this.appointments);
      this.basicService.setter(this.appointments);
      this.basicService.Page = 'defaulters';
      this.navCtrl.navigateForward('/members/appointments');
      return;
    }
      this.basicService.presentAlert('', 'No defaulters for this service type.', 'OK' );
  }
}
}
