import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { IdolApiProvider } from "../../providers/apiProvider";
import { AlertProvider } from "../../providers/alert";

@Component({
  selector: "page-forgot-password",
  templateUrl: "forgot-password.html"
})
export class ForgotPasswordPage {
  userEmail: any;
  clearStatus: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiProvider: IdolApiProvider,
    public alertProvider: AlertProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad ForgotPasswordPage");
  }

  sendEmail() {
    this.apiProvider.e_forgotpassword(this.userEmail).subscribe(
      res => {
        if (res.success == 1) {
          let title = "Success";
          let message = "Please check your email.";
          this.alertProvider.showAlert(title, message);
        } else if (res.success == 2) {
          let title = "Warning";
          let message = "User email doesn't exited.";
          this.alertProvider.showAlert(title, message);
        } else if (res.success == 3) {
          let title = "Warning";
          let message = "We send you email already , Please check it";
          this.alertProvider.showAlert(title, message);
        }
      },
      err => {}
    );
  }

  clearEmail() {
    this.userEmail = "";
    this.clearStatus = false;
  }

  checkEmail($event) {
    this.clearStatus = this.userEmail.length > 0 ? true : false;
  }
}
