import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http-service.service';
import { QrService } from 'src/app/services/qr.service';
import { BasicService } from 'src/app/services/basic.service';
import { DatePipe } from '@angular/common';
import { PatientDetails, UsersModel, ServiceType, Appointment } from 'src/app/model';
import { Storage } from '@ionic/storage';
import {NavController} from '@ionic/angular';


@Component({
  selector: 'app-new-appointment',
  templateUrl: './new-appointment.page.html',
  styleUrls: ['./new-appointment.page.scss'],
  providers: [DatePipe]
})
export class NewAppointmentPage implements OnInit {
  isGotten = false;
  details: PatientDetails;
  userDetails: UsersModel;
  serviceTypes: any;
  serviceKinds: any;
  today = new Date();
  AppointmentList: any;
  lastAppointment: any;
  nextDate = new Date();
  computeDate = false;
  option = 'Yes';
  value = '';
  appointment = {
    patientId: 0,
    serviceTypeId: 0,
    serviceKindId: 0,
    appointmentDate: '',
    insertUserId: 0,
    insertDate: '',
    optionType: ''
  };

  constructor(
    private httpService: HttpService,
    private qrService: QrService,
    private basicService: BasicService,
    private datePipe: DatePipe,
    private storage: Storage,
    private navCtrl: NavController
  ) {
    this.storage.get('user').then((val: UsersModel) => {
      console.log(val);
      this.userDetails = val;
    });
   }

  ngOnInit() {
  }

  ionViewWillEnter() {
    //  this.getPatientDetails('1541420972590286').then(() => {
    //   this.isGotten = true;
    //  });
    //  this.GetServiceTypes();
       this.scanQR().then(() => {
         this.isGotten = true;
         this.GetServiceTypes();
         console.log(this.isGotten);
        });
    }

    GetServiceTypes() {
      this.httpService.GetAllRecords('/ServiceTypes').subscribe((data) => {
        this.serviceTypes = data;
      });
    }

    GetServiceKinds() {
      this.value = this.appointment.serviceTypeId.toString();
      this.basicService.loader();
      this.httpService.GetAllRecords('/ServiceKinds/' + this.appointment.serviceTypeId).subscribe((data) => {
        this.serviceKinds = data;
        this.basicService.loading.dismiss();
      });
    }

    CreateAppointment() {
      if (this.appointment.serviceKindId === 0 || this.appointment.serviceTypeId === 0) {
          this.basicService.presentAlert('', 'Please fill required fields.', 'OK');
          return false;
      }
      if (this.option === 'Yes') {
         this.appointment.appointmentDate = this.datePipe.transform(this.nextDate, 'yyyy-MM-dd');
      }
     this.appointment.insertDate = this.datePipe.transform(this.today, 'yyyy-MM-dd');
     this.appointment.patientId = this.details.patientId;
     this.appointment.insertUserId = this.userDetails.insertUserId;
     console.log(this.appointment);
     this.basicService.loader();
     this.httpService.AddRecord('Appointments', this.appointment).subscribe((data) => {
      this.basicService.loading.dismiss();
      console.log(data);
      if (data.status === true) {
        this.clear();
        this.basicService.presentAlert('Success', 'Appointment created successfully.', 'OK');
      } else {
        this.basicService.presentAlert('Error', data.statusMessage, 'OK');
      }
   });
    }

    scanQR() {
      return new Promise((resolve, reject) => {
        this.qrService.scanQR().then(() => {
          this.basicService.loader();
          this.getPatientDetails(this.qrService.text).then(() => {
            this.GetLastAppointment(this.details.patientId);
            this.basicService.loading.dismiss();
             resolve(true);
          });
        });
      });
    }

      getPatientDetails(qrCode) {
        return new Promise((resolve, reject) => {
          this.httpService
          .GetAllRecords('Patients/QrCode/' + qrCode)
          .subscribe(data => {
            this.details = data;
            console.log(this.details);
            resolve(true);
            if (this.details === undefined) {
              this.basicService.presentAlert(
                'Error',
                'No patient attached to this QRCode',
                'OK'
              );
            }
          });
        });
      }

      CancelScan() {
        this.qrService.closeScanner();
        this.navCtrl.navigateForward('/members/dashboard');
      }
  clear() {
    this.appointment = {
      patientId: 0,
      serviceTypeId: 0,
      serviceKindId: 0,
      appointmentDate: '',
      insertUserId: 0,
      insertDate: '',
      optionType: ''
    };
    this.computeDate = false;
  }
  GetLastAppointment(patientId) {
    this.httpService
          .GetAllRecords('Appointments/Patient/' + patientId)
          .subscribe(data => {
            this.AppointmentList = data;
            this.lastAppointment = this.AppointmentList[0];
            console.log(this.lastAppointment);
          });
  }


  CalculateNextAppointmentDate() {
    const serviceKind = this.serviceKinds.filter(m => m.serviceKindId === +this.appointment.serviceKindId)[0];
    console.log(serviceKind);
    if (serviceKind.duration > 0) {
      this.computeDate = true;
      if (serviceKind.type.trim() === 'Days') {
        this.nextDate = new Date();
        this.nextDate.setDate(this.today.getDate() + serviceKind.duration);
        console.log(this.nextDate);
      }
      if (serviceKind.type.trim() === 'Weeks') {
        const noInDays = serviceKind.duration * 7; // convert week to days then add the days
        this.nextDate = new Date();
        this.nextDate.setDate(this.today.getDate() + noInDays);
        console.log(this.nextDate);
      }
      if (serviceKind.type.trim() === 'Months') {
        this.nextDate = new Date();
        this.nextDate.setMonth(this.today.getMonth() + serviceKind.duration);
        console.log(this.nextDate);
      }
    }

  }
}
