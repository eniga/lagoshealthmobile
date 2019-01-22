import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NewPatientModel, UsersModel } from 'src/app/model';
import {HttpService } from 'src/app/services/http-service.service';
import {QrService} from 'src/app/services/qr.service';
import { DatePipe } from '@angular/common';
import {BasicService } from 'src/app/services/basic.service';


@Component({
  selector: 'app-register-patient',
  templateUrl: './register-patient.page.html',
  styleUrls: ['./register-patient.page.scss'],
  providers: [DatePipe]
})
export class RegisterPatientPage implements OnInit {
userDetails: UsersModel;
lgas: any;
wards: any;
settlements: any;
selectedLga: number;
selectedWard: number;
today = new Date();
result: string;
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
  insertDate: '',
  phcId: 0,
  qrCode: '',
  houseNumber: ''
};


  constructor(private storage: Storage, private httpService: HttpService, private qrService: QrService,
     private basicService: BasicService, private datePipe: DatePipe) {
    this.storage.get('user').then((val: UsersModel) => {
      console.log(val);
      this.userDetails = val;
    });

   }

  ngOnInit() {
    this.AllLGA();
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  AllLGA() {
    this.basicService.loader();
      this.httpService.GetAllRecords('/LGAs').subscribe((data) => {
        this.lgas = data;
        this.basicService.loading.dismiss();
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
    // console.log(this.patient.phone);
    if (this.patient.phone.toString().length !== 11 ) {
      this.basicService.presentAlert('Error', 'Phone no is not 11 digits', 'OK');
      return;
    }
    //  if (!this.patient.qrCode) {
    //    this.basicService.presentAlert('Error', 'Please attach a QR Code.', 'OK');
    //    return;
    //  }
    this.patient.insertDate = this.datePipe.transform(this.today, 'yyyy-MM-dd');
    this.patient.insertUserId = this.userDetails.insertUserId;
    this.patient.phcId = this.userDetails.phcId;
    this.basicService.loader();
    console.log(this.patient);
     this.httpService.AddRecord('Patients', this.patient).subscribe((data) => {
        console.log(data);
        this.basicService.loading.dismiss();
        if (data.status === true) {
          this.Clear();
          this.basicService.presentAlert('Success', data.statusMessage, 'OK');
        } else {
          this.basicService.presentAlert('Error', data.statusMessage, 'OK');
        }
     });
  }

  Clear() {
    this.patient = {
      firstName: '',
      middleName: '',
      lastName: '',
      phone: '',
      altPhone: '',
      email: '',
      dob: '',
      settlementId: 0,
      insertUserId: 0,
      insertDate: '',
      phcId: 0,
      qrCode: '',
      houseNumber: ''
    };
    this.selectedLga = 0;
    this.selectedWard = 0;
  }

 scanQR() {
  this.qrService.scanQR().then(() => {
    this.patient.qrCode = this.qrService.text;
  });
  }

  CancelScan() {
    this.qrService.closeScanner();
   // this.navCtrl.navigateForward('/members/dashboard');
  }
}
