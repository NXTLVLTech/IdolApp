import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  Platform,
  ToastController
} from "ionic-angular";
import { Http, RequestOptions } from "@angular/http";
import { AlertController } from "ionic-angular/components/alert/alert-controller";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Facebook } from "@ionic-native/facebook";
import { GooglePlus } from "@ionic-native/google-plus";
import { AppIntroPage } from "../appIntro/appIntro";
import { IdolApiProvider } from "../../providers/apiProvider";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/toPromise";
import { eLoginPage } from "../elogin/elogin";
import { eSignupPage } from "../esignup/esignup";
import { VerifyPage } from "../verify/verify";
import { ForgotPasswordPage } from "../forgot-password/forgot-password";

@Component({
  selector: "page-login",
  templateUrl: "login.html",
  providers: [GooglePlus]
})
export class LoginPage {
  // private authState: Observable<firebase.User>;
  // private currentUser: firebase.User;
  totalOnlineNum = 0;
  isSkipstatus = false;
  fbUserId: any;
  onlineTime: any;
  public UserData: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: Facebook,
    private iab: InAppBrowser,
    public alertCtrl: AlertController,
    public apiProvider: IdolApiProvider,
    public toastctrl: ToastController,
    public http: Http,
    public googlePlus: GooglePlus,
    private platform: Platform
  ) {
    // this.fb.getLoginStatus().then(res =>{
    //   console.log("my login information");
    //   console.log(res);
    //   if(res.status === "connected"){
    //     setTimeout(()=>{
    //       this.fbUserId = "fb_" + res.authResponse.userID ;
    //       this.navCtrl.setRoot(HomePage,{appuserid:this.fbUserId},{animate: true, direction: 'forward'});
    //     },3000);
    //     console.log("Success Logined");
    //   }
    // }).catch(e => console.log(e));
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad Login");
  }

  clickfbLogin() {
    if (this.platform.is("cordova")) {
      //   this.fbUserData = {"id":"257047298158876","name":"DuoDuo Qian","email":"","photourl":"https://graph.facebook.com/257047298158876/picture?type=large"};
      //  console.log(this.fbUserData);
      //   this.apiProvider.fb_Login(this.fbUserData)
      //   .subscribe(data => {
      //     console.log("Success email: ", data);
      //     if (data.success == 1)
      //     {
      //       this.navCtrl.push(AppIntroPage,{appuserid: "fb_"+this.fbUserData['id']},{animate: true, direction: 'forward'});
      //     }
      //   }, err=> {
      //     console.log("Error: send email");
      //   });
      let permissions = new Array<string>();
      permissions = ["email", "public_profile", "user_link"];
      this.fb
        .login(permissions)
        .then(res => {
          if (res.status === "connected") {
            this.getUserData(res.authResponse.userID);
          }
        })
        .catch(error => {
          console.log("Login error - ", JSON.stringify(error));
        });
    } else {
      // this.fbUserData = {"id":"257047298158876","name":"DuoDuo Qian","email":"","photourl":"https://graph.facebook.com/257047298158876/picture?type=large"};
      // console.log(this.fbUserData);
      //  this.apiProvider.fb_Login(this.fbUserData)
      //  .subscribe(data => {
      //    console.log("Success email: ", data);
      //    if (data.success == 1)
      //    {
      //      this.navCtrl.push(AppIntroPage,{appuserid: "fb_"+this.fbUserData['id']},{animate: true, direction: 'forward'});
      //    }
      //  }, err=> {
      //    console.log("Error: send email");
      //  });
    }
  }

  clickgoogleLogin() {
    this.googlePlus
      .login({})
      .then(res => {
        console.log(res);

        let id = res.userId;
        let name = res.displayName;
        let email = res.email;
        let photourl = res.imageUrl;

        this.UserData = {
          id: id,
          name: name,
          email: email,
          photourl: photourl
        };

        console.log(this.UserData);

        this.apiProvider.google_Login(this.UserData).subscribe(
          data => {
            console.log("Success email: ", data);
            if (data.success == 1) {
              let appuserid = "gu_" + id;
              localStorage.setItem("appuserid", appuserid);
              localStorage.setItem("photourl", photourl);
              localStorage.setItem("username", name);
              localStorage.setItem("viewTutorial", "possible");

              if (data.isVerified == "yes") {
                this.navCtrl.push(
                  AppIntroPage,
                  { appuserid: "gu_" + id },
                  { animate: true, direction: "forward" }
                );
              } else {
                this.navCtrl.push(
                  VerifyPage,
                  { appuserid: "gu_" + id },
                  { animate: true, direction: "forward" }
                );
              }
            } else if (data.success == 2) {
              let appuserid = "gu_" + id;
              localStorage.setItem("appuserid", appuserid);
              localStorage.setItem("photourl", photourl);
              localStorage.setItem("username", name);
              localStorage.setItem("viewTutorial", "possible");
              this.navCtrl.push(
                VerifyPage,
                { appuserid: "gu_" + id },
                { animate: true, direction: "forward" }
              );
            }
          },
          err => {
            console.log("Error: send email");
          }
        );
      })
      .catch(err => console.error(err));
  }

  clickemailLogin() {
    this.navCtrl.push(eLoginPage, {}, { animate: true, direction: "forward" });
  }

  clickTOC() {
    this.platform.ready().then(() => {
      this.iab.create(
        "http://idolapp.co/terms-of-service",
        "_system",
        "location=true"
      );

      // open(url, "_system", "location=true");
    });
  }

  createAccount() {
    this.navCtrl.push(eSignupPage, {}, { animate: true, direction: "forward" });
  }

  getUserData(userid) {
    let params = new Array<String>();
    let photourl =
      "https://graph.facebook.com/" + userid + "/picture?type=large";
    if (photourl == null) {
      photourl = "";
    }

    var this_callback = this;

    // this.fb.api("/"+userid+"/?fields=link,",['user_link'])
    this.fb.api("me?fields=id,email,name,link", []).then(
      function(user) {
        console.log("My Infomation", user);

        console.log("user link", user["link"]);

        let id = user["id"];
        if (user["id"] == null) {
          id = "";
        }
        let name = user["name"];
        if (user["name"] == null) {
          name = "";
        }
        let email = user["email"];
        if (user["email"] == null) {
          email = "";
        }

        let fb_link = user["link"];
        if (user["link"] == null) {
          fb_link = "";
        }

        this_callback.UserData = {
          id: id,
          name: name,
          email: email,
          photourl: photourl,
          fb_link: fb_link
        };

        console.log(this_callback.UserData);

        this_callback.apiProvider.fb_Login(this_callback.UserData).subscribe(
          data => {
            console.log("Success email: ", data.success);
            if (data.success == 1) {
              let appuserid = "fb_" + id;
              localStorage.setItem("appuserid", appuserid);
              localStorage.setItem("photourl", photourl);
              localStorage.setItem("username", name);
              localStorage.setItem("viewTutorial", "possible");
              if (data.isVerified == "yes") {
                this_callback.navCtrl.push(
                  AppIntroPage,
                  { appuserid: "fb_" + id },
                  { animate: true, direction: "forward" }
                );
              } else {
                this_callback.navCtrl.push(
                  VerifyPage,
                  { appuserid: "fb_" + id },
                  { animate: true, direction: "forward" }
                );
              }
            } else if (data.success == 2) {
              let appuserid = "fb_" + id;
              localStorage.setItem("appuserid", appuserid);
              localStorage.setItem("photourl", photourl);
              localStorage.setItem("username", name);
              localStorage.setItem("viewTutorial", "possible");
              this_callback.navCtrl.push(
                VerifyPage,
                { appuserid: "fb_" + id },
                { animate: true, direction: "forward" }
              );
            }
          },
          err => {
            console.log("Error: send email");
          }
        );
      },
      function(error) {
        console.log("get Information error", error);
      }
    );
  }

  forgotPassword() {
    this.navCtrl.push(
      ForgotPasswordPage,
      {},
      { animate: true, direction: "forward" }
    );
  }
}
