import { Injectable } from '@angular/core';


@Injectable()

export class UsersModel {
    userId: number;
    username: string;
    password: string;
    displayName: string;
    email: string;
    insertUserId: number;
    insertUser: string;
    insertDate: Date;
    updateUserId: number;
    updateUser: string;
    updateDate: Date;
    userRoleId: number;
    roleId: number;
    roleName: string;
    isActive: number;
    phcId: number;
    phc: string;
    wardId: number;
    ward: string;
    lgaId: number;
    lga: string;
    stateId: number;
    state: string;
}

export class LoginUserModel {
    username: string;
    password: string;
}

export class LoginResponse {
    status: boolean;
    statusMessage: string;
    details: UsersModel;
}

export class NewPatientModel {
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  altPhone: string;
  email: string;
  dob: string;
  settlementId: number;
  insertUserId: number;
  insertDate: string;
  phcId: number;
  qrCode: string;
  houseNumber: string;
}

export class PatientDetails {
  patientId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  altPhone: string;
  email: string;
  dob: string;
  settlement: string;
  ward: number;
  lga: string;
  insertDate: string;
  state: number;
  qrCode: string;
}

export class ServiceType {
    serviceTypeId: number;
    serviceTypeName: string;
    appointments: Appointment[];
  }

export class Appointment {
      appointmentId: number;
      patientAppointmentId: number;
      patientId: number;
      patientName: string;
      phone: string;
      appointmentDate: string;
      settlement: string;
      contactedBy: number;
}

