import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './../../services/authentication.service';
import { Storage } from '@ionic/storage';
import { UsersModel } from 'src/app/model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  username: string;

  constructor(private storage: Storage, private authService: AuthenticationService) { }

  ngOnInit() {
    this.storage.get('user').then((val: UsersModel) => {
      console.log(val);
      this.username = val.username;
    });
  }

  logout() {
    this.authService.logout();
  }

}
