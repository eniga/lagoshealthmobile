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
    //  this.GetServiceTypes();
    //  this.isGotten = true;
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
      console.log(this.value);
      this.httpService.GetAllRecords('/ServiceKinds/' + this.appointment.serviceTypeId).subscribe((data) => {
        this.serviceKinds = data;
        console.log(this.serviceKinds);
      });
    }

    CreateAppointment() {
     this.appointment.insertDate = this.datePipe.transform(this.today, 'yyyy-MM-dd');
     this.appointment.patientId = this.details.patientId;
     this.appointment.insertUserId = this.userDetails.insertUserId;
     console.log(this.appointment);
     this.basicService.loader();
     this.httpService.AddRecord('Appointments', this.appointment).subscribe((data) => {
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

}
