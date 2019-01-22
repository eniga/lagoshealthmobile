import { Component, OnInit } from '@angular/core';
import {QrService} from 'src/app/services/qr.service';
import {BasicService } from 'src/app/services/basic.service';
import {HttpService } from 'src/app/services/http-service.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-update-patient-detail',
  templateUrl: './update-patient-detail.page.html',
  styleUrls: ['./update-patient-detail.page.scss'],
})
export class UpdatePatientDetailPage implements OnInit {
  phone: string;
  patients: any = [];
  qrCode: string;

  constructor(private qrService: QrService, private httpService: HttpService,
    private basicService: BasicService, private storage: Storage) { }

  ngOnInit() {
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  scanQR(patient) {
    console.log(patient);
    this.qrService.scanQR().then(() => {
      this.qrCode = this.qrService.text;
      this.UpdateQrCode(patient);
    });
    }

    UpdateQrCode(patient) {
      this.basicService.loader();
      this.httpService.PutRecord('Patients/QRCode/' + this.qrCode + '/' + patient.patientId, '').subscribe((data) => {
        console.log(this.patients);
        this.basicService.loading.dismiss();
        console.log(data);
        if (data.status === true) {
          this.basicService.presentAlert('Success', data.statusMessage, 'OK');
        } else {
          this.basicService.presentAlert('Error', data.statusMessage, 'OK');
        }
      });
    }
    Search() {
      this.basicService.loader();
        this.httpService.GetAllRecords('Patients/Phone/' + this.phone).subscribe((data) => {
          this.patients = data;
          this.basicService.loading.dismiss();
          console.log(this.patients);
        });
    }

    CancelScan() {
      this.qrService.closeScanner();
     // this.navCtrl.navigateForward('/members/dashboard');
    }
}
