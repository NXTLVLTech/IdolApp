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
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { VerifyPage } from "../verify/verify";
import { eLoginPage } from "../elogin/elogin";

// import {regexValidators} from '@pages/validators/validator';
/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: "page-esignup",
  templateUrl: "esignup.html"
})
export class eSignupPage {
  signupForm: FormGroup;
  UserData: any;
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
    private platform: Platform
  ) {
    this.signupForm = formBuilder.group({
      username: ["", Validators.compose([Validators.required])],
      useremail: [
        "",
        Validators.compose([Validators.required, Validators.email])
      ],
      userpassword: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)])
      ]
    });
  }

  isMatching(passwordKey: string, confirmPasswordKey: string) {
    console.log(this.signupForm);

    return (group: FormGroup): { [key: string]: any } => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];
      console.log(password);
      if (password.value !== confirmPassword.value) {
        return {
          isMatching: true
        };
      } else {
        return null;
      }
    };
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad Login");
  }

  changePasswordStatus() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = "text";
    } else {
      this.type = "password";
    }
  }

  signIn() {
    this.navCtrl.push(eLoginPage, {}, { animate: true, direction: "forward" });
  }

  onSubmit(value: any): void {
    if (this.signupForm.valid) {
      console.log("success exited!");
      let username = value.username;
      let useremail = value.useremail;
      let password = value.userpassword;
      console.log(useremail);
      this.UserData = { name: username, email: useremail, password: password };

      this.apiProvider.e_signup(this.UserData).subscribe(
        res => {
          console.log(res.success);
          if (res.success == 1) {
            localStorage.setItem("appuserid", res.userid);
            localStorage.setItem("viewTutorial", "possible");
            this.navCtrl.push(
              VerifyPage,
              { appuserid: res.userid },
              { animate: true, direction: "forward" }
            );
          } else if (res.success == 2) {
            let alert = this.alertCtrl.create({
              title: "Warning",
              message:
                "This usermail exited already, Please input another email!",
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
          } else {
            let alert = this.alertCtrl.create({
              title: "Warning",
              message:
                "You can't create new account now. Please try again later.",
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
        },
        err => {
          console.log(err);
        }
      );
    }
  }
}
