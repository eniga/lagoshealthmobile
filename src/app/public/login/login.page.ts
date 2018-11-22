import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Input } from '@ionic/angular';

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

  constructor(private authService: AuthenticationService) {
    
   }

  ngOnInit() {
  }

  login(){
    this.authService.login();
  }

}
