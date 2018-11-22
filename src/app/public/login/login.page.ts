import { Component, OnInit } from '@angular/core';
import { Input } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { LoginUserModel, LoginResponse } from 'src/app/model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public username: string;
  public password: string;

  public isUsernameValid: boolean;
  public isPasswordValid: boolean;

  constructor(
    public alertCtrl: AlertController, 
    private loginService: UserService, 
    private authService: AuthenticationService
    ) { }

  ngOnInit() {
  }

  login(){
    if(this.username === undefined || this.password === undefined) {
      this.presentAlert('Error', 'Please enter a username / password', 'OK');
    } else {
      let data = new LoginUserModel;
      data.username = this.username;
      data.password = this.password;
      this.loginService.login(data).subscribe((res: LoginResponse) => {
        console.log(res);
        if(res.status){
          this.authService.login(res.details);
        }
      });
    }
  }

  async presentAlert(titleText: string, subTitleText: string, buttonText: string) {
    const alert = await this.alertCtrl.create({
      header: titleText,
      message: subTitleText,
      buttons: [buttonText]
    });

    await alert.present();
  }

}
