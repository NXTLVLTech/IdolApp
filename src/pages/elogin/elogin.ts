import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  Platform,
  ToastController
} from "ionic-angular";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { ProfilePage } from "../profile/profile";
import { AppIntroPage } from "../appIntro/appIntro";
import { AlertController } from "ionic-angular/components/alert/alert-controller";
import { editingProfilePage } from "../editingProfile/editingProfile";
import { HomePage } from "../home/home";
import { IdolApiProvider } from "../../providers/apiProvider";
import { Http, RequestOptions } from "@angular/http";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/toPromise";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl
} from "@angular/forms";
import { eSignupPage } from "../esignup/esignup";
import { VerifyPage } from "../verify/verify";
import { AlertProvider } from "../../providers/alert";

@Component({
  selector: "page-elogin",
  templateUrl: "elogin.html"
})
export class eLoginPage {
  public UserData: any;
  signinForm: FormGroup;
  type = "password";
  showPass = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private iab: InAppBrowser,
    public alertCtrl: AlertController,
    public apiProvider: IdolApiProvider,
    public toastctrl: ToastController,
    public http: Http,
    public formBuilder: FormBuilder,
    private platform: Platform,
    private alertProvider: AlertProvider
  ) {
    this.signinForm = formBuilder.group({
      useremail: [
        "",
        Validators.compose([Validators.required, Validators.email])
      ],
      userpassword: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)])
      ]
    });

    // this.useremail = this.signinForm.controls['useremail'];
    // this.userpassword = this.signinForm.controls['userpassword'];
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad Login");
  }

  clickSignup() {
    this.navCtrl.push(eSignupPage, {}, { animate: true, direction: "forward" });
  }

  onSubmit(value: any): void {
    if (this.signinForm.valid) {
      let useremail = value.useremail;
      let password = value.userpassword;
      console.log(useremail);
      this.UserData = { emailaddress: useremail, password: password };

      this.apiProvider.e_login(this.UserData).subscribe(
        res => {
          console.log(res.success);
          if (res.success == 1) {
            localStorage.setItem("appuserid", res.userid);
            localStorage.setItem("viewTutorial", "possible");
            if (res.isVerified == "no") {
              this.navCtrl.push(
                VerifyPage,
                { appuserid: res.userid },
                { animate: true, direction: "forward" }
              );
            } else {
              this.navCtrl.push(
                AppIntroPage,
                { appuserid: res.userid },
                { animate: true, direction: "forward" }
              );
            }
          }
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  forgotpassword() {
    let prompt = this.alertCtrl.create({
      title: "Forgot Password",
      message: "Please input your email and confirm your email",
      inputs: [
        {
          name: "user",
          placeholder: "Useremail"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          handler: data => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Ok",
          handler: data => {
            console.log("user response", data.user);
            this.apiProvider.e_forgotpassword(data.user).subscribe(
              res => {
                if (res.success == 1) {
                  let alert = this.alertCtrl.create({
                    title: "Success",
                    message: "Please check  your email.",
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
                } else if (res.success == 2) {
                  let alert = this.alertCtrl.create({
                    title: "Warning",
                    message: "User email doesn't exited.",
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
                } else if (res.success == 3) {
                  let alert = this.alertCtrl.create({
                    title: "Warning",
                    message: "We send you email already , Please check it",
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
              },
              err => {}
            );
          }
        }
      ]
    });

    prompt
      .present()
      .then(userid => {
        console.log("Alert showed");
      })
      .catch(err => {
        console.log(JSON.stringify(err));
        return null;
      });
  }

  changePasswordStatus() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = "text";
    } else {
      this.type = "password";
    }
  }

  createAccount() {
    this.navCtrl.push(eSignupPage, {}, { animate: true, direction: "forward" });
  }
}
