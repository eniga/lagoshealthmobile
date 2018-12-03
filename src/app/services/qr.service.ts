import { Injectable } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

@Injectable({
  providedIn: 'root'
})
export class QrService {
  text: string;
  private scanSub: any;

  constructor(private qrScanner: QRScanner) {}

  startScanner() {
    // Show scanner
    const rootElement = <HTMLElement>document.getElementsByTagName('html')[0];
    rootElement.classList.add('qr-scanner-open');
  }

  closeScanner() {
    // Hide and unsubscribe from scanner
    this.qrScanner.hide();
    const rootElement = <HTMLElement>document.getElementsByTagName('html')[0];
    rootElement.classList.remove('qr-scanner-open');
  }

  scanQR() {
    return new Promise((resolve, reject) => {
    this.startScanner();
    this.qrScanner
      .prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          console.log('permission granted');
          // start scanning
          this.qrScanner.show();
          const scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);
            this.text = text;

            if (text) {
              this.qrScanner.hide(); // hide camera preview
              scanSub.unsubscribe(); // stop scanning
              this.closeScanner();
              resolve(true);
            }
          });
        } else if (status.denied) {
          console.log('status denied');
        } else {
          console.log('error');
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));
    });
  }
}
