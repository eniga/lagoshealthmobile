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
private scanSub: any ;
result: string;
serviceTypes: any;
serviceTypeId: number;
appointment = {
  patientId: 0,
  serviceTypeId: 0,
  appointmentDate: '',
  insertUserId: 0,
  insertDate: ''
};
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
  qrCode: ''
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
    this.GetServiceTypes();
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

  GetServiceTypes() {
    this.httpService.GetAllRecords('/ServiceTypes').subscribe((data) => {
      this.serviceTypes = data;
    });
  }

  CreateAppointment() {
   this.httpService.AddRecord('Appointments', this.appointment).subscribe((data) => {
    console.log(data);
    if (data.status === true) {
      this.basicService.presentAlert('Success', 'Patient and appointment created successfully.', 'OK');
    } else {
      this.basicService.presentAlert('Error', data.statusMessage, 'OK');
    }
 });
  }

  AddPatient() {
     if (!this.patient.qrCode) {
       this.basicService.presentAlert('Error', 'Please attach a QR Code.', 'OK');
       return;
     }
    this.patient.insertDate = this.datePipe.transform(this.today, 'yyyy-MM-dd');
    this.patient.insertUserId = this.userDetails.insertUserId;
    this.patient.phcId = this.userDetails.phcId;
    this.basicService.loader();
    console.log(this.patient);
     this.httpService.AddRecord('Patients', this.patient).subscribe((data) => {
        console.log(data);
        if (data.status === true) {
          // create appointment
          this.appointment.insertDate = this.datePipe.transform(this.today, 'yyyy-MM-dd');
          this.appointment.insertUserId = this.userDetails.insertUserId;
          this.appointment.patientId = data.patientId;
          console.log(this.appointment);
          this.CreateAppointment();
        } else {
          this.basicService.presentAlert('Error', data.statusMessage, 'OK');
        }
     });
  }

 scanQR() {
     this.result = this.qrService.scanQR();
     this.patient.qrCode = this.result;
  }
}
