import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class BasicService {
  value: any;
  Page: string;
  loading: any;

  constructor(private alertCtrl: AlertController, private loadingCtrl: LoadingController) {

  }

  async presentAlert(titleText: string, subTitleText: string, buttonText: string) {
    const alert = await this.alertCtrl.create({
      header: titleText,
      message: subTitleText,
      buttons: [buttonText]
    });

    await alert.present();
  }

  async loader() {
     this.loading = await this.loadingCtrl.create({
      message: 'Loading...',
      spinner: 'crescent'
    });
    await this.loading.present();

    // setTimeout(() => {
    //   loading.dismiss();
    // }, 2000);
  }


  // getter and setter
setter(val) {
this.value = val;
}
  getter() {
    return this.value;
  }

}
