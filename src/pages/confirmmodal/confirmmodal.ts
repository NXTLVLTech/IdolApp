import { Component } from "@angular/core";
import {
  IonicPage,
  NavParams,
  ViewController,
  AlertController,
  ToastController
} from "ionic-angular";
import { IdolApiProvider } from "../../providers/apiProvider";

@IonicPage()
@Component({
  selector: "confirmmodal-page",
  templateUrl: "confirmmodal.html"
})
export class confirmModal {
  enteredCode: any;
  verifyCode: any;
  userid: any;
  phonenumber: any;

  constructor(
    private navParams: NavParams,
    private view: ViewController,
    private apiProvider: IdolApiProvider,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ionViewWillLoad() {
    let data = this.navParams.get("data");
    console.log(data);
    this.verifyCode = data.match;
    this.phonenumber = data.phonenumber;
    this.userid = data.id;
  }

  closeModal() {
    const data = {
      isVerifed: "no"
    };
    this.view.dismiss(data);
  }
  resendCode() {
    console.log(this.userid);
    console.log(this.phonenumber);
    this.apiProvider.sendSMS(this.userid, this.phonenumber).subscribe(
      res => {
        console.log(res);
        if (res.success == 1) {
          this.verifyCode = res.verifyCode;
          this.resendingAlert();
        }
      },
      err => {
        console.log("Error: send email");
      }
    );
  }

  matching() {
    if (this.verifyCode == this.enteredCode) {
      this.apiProvider.confirmVerify(this.userid).subscribe(
        res => {
          if (res.success == 1) {
            const data = {
              isVerified: "yes"
            };
            this.view.dismiss(data);
          }
        },
        err => {
          console.log("Error: confirm Verify");
        }
      );
    } else {
      let toast = this.toastCtrl.create({
        message: "You have entered the wrong code. Please try again",
        duration: 3000,
        position: "bottom"
      });

      toast.onDidDismiss(() => {
        console.log("Dismissed toast");
      });

      toast.present();
    }
  }

  resendingAlert() {
    let toast = this.toastCtrl.create({
      message: "We just sent verification code, Please enter code again",
      duration: 3000,
      position: "bottom"
    });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }
}
