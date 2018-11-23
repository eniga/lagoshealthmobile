import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NewPatientModel, UsersModel } from 'src/app/model';
import {HttpService } from 'src/app/services/http-service.service';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

@Component({
  selector: 'app-register-patient',
  templateUrl: './register-patient.page.html',
  styleUrls: ['./register-patient.page.scss'],
})
export class RegisterPatientPage implements OnInit {
userDetails: UsersModel;
lgas: any;
wards: any;
settlements: any;
selectedLga: number;
selectedWard: number;
patient: NewPatientModel = {
  firstName: '',
  middleName: '',
  lastName: '',
  phone: '',
  altPhone: '',
  email: '',
  dob: '',
  settlementId: 0,
  insertUserId: 0,
  insertDate: '2018-03-03',
  phcId: 0,
  qrCode: ''
};


  constructor(private storage: Storage, private httpService: HttpService,
     private alertCtrl: AlertController, private qrScanner: QRScanner) {
    this.storage.get('user').then((val: UsersModel) => {
      console.log(val);
      this.userDetails = val;
    });

   }

  ngOnInit() {

    this.AllLGA();
  }

  AllLGA() {
      this.httpService.GetAllRecords('/LGAs').subscribe((data) => {
        this.lgas = data;
        console.log(this.lgas);
      });
  }

  FilterWard(event) {
    console.log(event);
      this.httpService.GetAllRecords('/Wards').subscribe((data) => {
        console.log(data);
        this.wards = data.filter(i => i.lgaId === +event);
        console.log(this.wards);
      });
  }

  FilterSettlement(event) {
      this.httpService.GetAllRecords('/Settlements').subscribe((data) => {
        this.settlements = data.filter(i => i.wardId === +event);
      });
  }

  AddPatient() {
    this.patient.insertUserId = this.userDetails.insertUserId;
    this.patient.phcId = this.userDetails.phcId;
    console.log(this.patient);
     this.httpService.AddRecord('Patients', this.patient).subscribe((data) => {
        console.log(data);
        this.presentAlert(data.status, data.statusMessage, 'OK');
     });
  }

  scanQR() {
    this.qrScanner.prepare()
  .then((status: QRScannerStatus) => {
     if (status.authorized) {
       // camera permission was granted

       // start scanning
       const scanSub = this.qrScanner.scan().subscribe((text: string) => {
         console.log('Scanned something', text);
         this.patient.qrCode = text;

         this.qrScanner.hide(); // hide camera preview
         scanSub.unsubscribe(); // stop scanning
       });

     }
  })
  .catch((e: any) => console.log('Error is', e));
  }

  async presentAlert(titleText: string, subTitleText: string, buttonText: string) {
    const alert = await this.alertCtrl.create({
      header: titleText,
      message: subTitleText,
      buttons: [buttonText]
    });

    await alert.present();
  }
}
