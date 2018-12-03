import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class BasicService {
  value: any;
  Page: string;

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
    const loading = await this.loadingCtrl.create({
      message: 'Processing request...',
      spinner: 'crescent',
      duration: 2000
    });

    await loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 2000);
  }


  // getter and setter
setter(val) {
this.value = val;
}
  getter() {
    return this.value;
  }

}
