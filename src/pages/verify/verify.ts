import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  Platform,
  Modal,
  ModalController,
  ModalOptions
} from "ionic-angular";

import { InAppBrowser } from "@ionic-native/in-app-browser";
import { AlertController } from "ionic-angular/components/alert/alert-controller";
import { IdolApiProvider } from "../../providers/apiProvider";
import { Http, RequestOptions } from "@angular/http";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/toPromise";
import { AppIntroPage } from "../appIntro/appIntro";
import { Facebook } from "@ionic-native/facebook";
import { LoginPage } from "../login/login";
import { CountrycodeModalPage } from "../countrycode-modal/countrycode-modal";
import { confirmModal } from "../confirmmodal/confirmmodal";

@Component({
  selector: "page-verify",
  templateUrl: "verify.html"
})
export class VerifyPage {
  phonenumber: string = "";
  prefix: string = "+";
  appuserid: any;
  countryCode: string = "";
  clearStatus: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private iab: InAppBrowser,
    public alertCtrl: AlertController,
    public apiProvider: IdolApiProvider,
    public http: Http,
    private modal: ModalController,
    private fb: Facebook,
    private platform: Platform
  ) {
    this.appuserid = navParams.get("appuserid");

    if (this.appuserid == null) {
      this.appuserid = localStorage.getItem("appuserid");
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad Login");
  }

  verifyphone() {
    if (this.countryCode == "") {
      this.warningAlert("Please select country code!");
    } else {
      let realphone = this.countryCode + this.phonenumber;
      console.log(realphone);
      this.apiProvider.sendSMS(this.appuserid, realphone).subscribe(
        res => {
          if (res.success == 1) {
            var matchCode = res.verifyCode;
            this.confirmModal(this.appuserid, this.phonenumber, matchCode);
          } else if (res.success == 2) {
            this.warningAlert(
              "This phone number is used by another user already!"
            );
          }
        },
        err => {
          console.log("Error: send email");
        }
      );
    }
  }

  confirmModal(userid, phonenumber, matchCode) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false,
      cssClass: "inset-modal"
    };

    const myModalData = {
      id: userid,
      phonenumber: phonenumber,
      match: matchCode
    };

    const myModal: Modal = this.modal.create(
      confirmModal,
      { data: myModalData },
      myModalOptions
    );

    myModal.present();

    myModal.onDidDismiss(data => {
      console.log("I have dismissed.");
      console.log(data);

      if (data.isVerified == "yes") {
        this.navCtrl.push(
          AppIntroPage,
          { appuserid: this.appuserid },
          { animate: true, direction: "forward" }
        );
      }
    });

    myModal.onWillDismiss(data => {
      console.log("I'm about to dismiss");
      console.log(data);
    });
  }

  warningAlert(content) {
    let alert = this.alertCtrl.create({
      title: "Warning",
      message: content,
      buttons: [
        {
          text: "Ok",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    alert.present();
  }

  setCountryCode() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false,
      cssClass: "code-modal"
    };

    const myModal: Modal = this.modal.create(
      CountrycodeModalPage,
      myModalOptions
    );

    myModal.present();

    myModal.onDidDismiss(data => {
      console.log("I have dismissed.");
      console.log(data);

      if (data.isSelected == "yes") {
        // this.navCtrl.push(AppIntroPage,{appuserid: this.appuserid},{animate: true, direction: 'forward'});
        this.countryCode = data.code;
        this.prefix = this.countryCode;
      }
    });

    myModal.onWillDismiss(data => {
      console.log("I'm about to dismiss");
      console.log(data);
    });
  }

  gotoback() {
    this.fb
      .getLoginStatus()
      .then(res => {
        console.log("my login information");
        console.log(res);
        if (res.status === "connected") {
          this.fb.logout();
        }
      })
      .catch(e => console.log(e));

    localStorage.removeItem("appuserid");
    localStorage.removeItem("photourl");
    localStorage.removeItem("username");
    this.navCtrl.setRoot(LoginPage);
  }

  clearNumber() {
    this.phonenumber = "";
    this.clearStatus = false;
  }

  checkNumber() {
    this.clearStatus = this.phonenumber.length > 0 ? true : false;
  }
}
