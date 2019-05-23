import { Injectable } from "@angular/core";
import { AlertController } from "ionic-angular/components/alert/alert-controller";

@Injectable()
export class AlertProvider {
  constructor(public alertCtrl: AlertController) {
    console.log("Hello AlertProvider Provider");
  }

  showAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: "No",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    alert.present();
  }
}
