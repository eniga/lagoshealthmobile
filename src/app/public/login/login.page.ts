import { Component, OnInit } from '@angular/core';
import { Input } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { LoginUserModel, LoginResponse } from 'src/app/model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BasicService } from 'src/app/services/basic.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public username: string;
  public password: string;
  mydate = new Date();

  public isUsernameValid: boolean;
  public isPasswordValid: boolean;

  constructor(
    public basicService: BasicService,
    private loginService: UserService,
    private authService: AuthenticationService
    ) { }

  ngOnInit() {
  }

  login() {
    if (this.username === undefined || this.password === undefined) {
      this.basicService.presentAlert('Error', 'Please enter a username / password', 'OK');
    } else {
      const data = new LoginUserModel;
      data.username = this.username;
      data.password = this.password;
      this.basicService.loader();
      this.loginService.login(data).subscribe((res: LoginResponse) => {
        this.basicService.loading.dismiss();
        console.log(res);
        if (res.status) {
          this.authService.login(res.details);
        }
      });
    }
  }
}
