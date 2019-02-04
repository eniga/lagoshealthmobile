import { Component, OnInit } from '@angular/core';
import {QrService} from 'src/app/services/qr.service';
import {BasicService } from 'src/app/services/basic.service';
import {HttpService } from 'src/app/services/http-service.service';
import { Storage } from '@ionic/storage';
import { NewPatientModel, UsersModel } from 'src/app/model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-update-patient-detail',
  templateUrl: './update-patient-detail.page.html',
  styleUrls: ['./update-patient-detail.page.scss'],
  providers: [DatePipe]
})
export class UpdatePatientDetailPage implements OnInit {
  phone: string;
  patients: any = [];
  qrCode: string;
  lgas: any;
wards: any;
settlements: any;
selectedLga: number;
selectedWard: number;
today = new Date();
userDetails: UsersModel;
isEdit = false;
  patient = {
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    altPhone: '',
    email: '',
    dob: '',
    settlementId: 0,
    updateUserId: 0,
    updateDate: '',
    phcId: 0,
    qrCode: '',
    houseNumber: ''
  };

  constructor(private qrService: QrService, private httpService: HttpService,
    private basicService: BasicService, private storage: Storage, private datePipe: DatePipe) {
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

  scanQR() {
    this.qrService.scanQR().then(() => {
      this.patient.qrCode = this.qrService.text;
    });
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


  GetPatientDetails(patient) {
  this.isEdit = true;
  this.patient.firstName = patient.firstName;
  this.patient.lastName = patient.lastName;
  this.patient.middleName = patient.middleName;
  this.patient.phone = patient.phone;
  this.patient.altPhone = patient.altPhone;
  this.patient.phcId = patient.phcId;
  this.patient.qrCode = patient.qrCode;
  this.patient.email = patient.email;
  this.patient.dob = patient.phcId;
  this.patient.settlementId = patient.settlementId;
  this.selectedLga = patient.lgaId;
  this.selectedWard = patient.wardId;
  this.patient.houseNumber = patient.houseNumber;
  this.FilterWard(this.selectedLga);
  this.FilterSettlement(this.selectedWard);
  }

  AddPatient() {
    // console.log(this.patient.phone);
    if (this.patient.phone.toString().length !== 11 ) {
      this.basicService.presentAlert('Error', 'Phone no is not 11 digits', 'OK');
      return;
    }
     if (!this.patient.qrCode) {
       this.basicService.presentAlert('Error', 'Please attach a QR Code.', 'OK');
       return;
     }
     if (!this.patient.dob) {
      this.basicService.presentAlert('Error', 'Please select date of birth.', 'OK');
      return;
    }
    this.patient.updateDate = this.datePipe.transform(this.today, 'yyyy-MM-dd');
    this.patient.updateUserId = this.userDetails.insertUserId;
    this.patient.phcId = this.userDetails.phcId;
    this.basicService.loader();
    console.log(this.patient);
     this.httpService.PutRecord('Patients', this.patient).subscribe((data) => {
        console.log(data);
        this.basicService.loading.dismiss();
        if (data.status === true) {
          this.basicService.presentAlert('Success', data.statusMessage, 'OK');
          this.isEdit = false;
        } else {
          this.basicService.presentAlert('Error', data.statusMessage, 'OK');
        }
     }, (error) => {
      this.basicService.loading.dismiss();
      this.basicService.presentAlert('Error', 'An error occurred. Please try again.', 'OK');
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
