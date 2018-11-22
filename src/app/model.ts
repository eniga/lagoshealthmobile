import { Injectable } from "@angular/core";


@Injectable()

export class appsettings {
    public static api_url = "https://lagoshealthreminderapi.azurewebsites.net/api/";
}

export class UsersModel{
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