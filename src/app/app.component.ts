import { Component } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { QrService } from './services/qr.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  alertShown = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authenticationService: AuthenticationService,
    private router: Router,
    private alertCtrl: AlertController,
    private qrService: QrService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.platform.backButton.subscribe((data) => {
        const currentPage = window.location.pathname;
        console.log('page is ', currentPage);
          if (currentPage === '/members/dashboard') {
            // this.showAlert();
            const c = confirm('Do you want to exit the application?');
            console.log(c);
               if (c) {
                 console.log('inside', c);
                 // log user out
                 this.authenticationService.logout();
               } else {
                 this.router.navigate(['members', 'dashboard']);
                 return false;
               }
           }  else {
            this.qrService.closeScanner();
            // this.navCtrl.goBack();
            // this.router.navigate(['members', 'dashboard'])
          }
      }, 1);

      this.authenticationService.authenticationState.subscribe(state => {
        if (state) {
          console.log('state ', state);
          this.router.navigate(['members', 'dashboard']);
        } else {
          this.router.navigate(['login']);
        }
      });
    });
  }

  async showAlert() {
      const alertPopup = await this.alertCtrl.create({
          header: 'Exit',
          message: 'Are you sure you want to exit?',
          buttons: [{
                  text: 'Exit',
                  handler: () => {
                      alertPopup.dismiss().then(() => {
                          this.authenticationService.logout();
                      });
                  }
              },
              {
                  text: 'Stay',
                  handler: () => {
                      // need to do something if the user stays?
                  }
              }]
      });
      // Show the alert
      alertPopup.present();
  }

}
