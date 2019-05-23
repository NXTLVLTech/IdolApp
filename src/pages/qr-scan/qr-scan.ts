import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  Platform,
  ActionSheetController,
  Events,
  AlertController,
  ToastController
} from "ionic-angular";
import {
  AngularFireDatabase,
  FirebaseObjectObservable
} from "angularfire2/database";
import { FullscreenPage } from "../fullscreen/fullscreen";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
// import { ContactListPage} from '../contact-list/contact-list';
import * as firebase from "firebase/app";
import { InAppBrowser } from "@ionic-native/in-app-browser";
// import { CallNumber } from '@ionic-native/call-number';
import { SMS } from "@ionic-native/sms";
import { EmailComposer } from "@ionic-native/email-composer";
import { AppAvailability } from "@ionic-native/app-availability";
import { Device } from "@ionic-native/device";
import { AppRate } from "@ionic-native/app-rate";
import { IdolApiProvider } from "../../providers/apiProvider";
import {
  Contacts,
  Contact,
  ContactField,
  ContactName
} from "@ionic-native/contacts";
import { ChatPage } from "../chat/chat";

/**
 * Generated class for the QrScan page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: "page-qr-scan",
  templateUrl: "qr-scan.html"
})
export class QrScanPage {
  // usercontacts$: any;
  contactsCount: number;
  mode: string;
  contactid: any;
  appuserid: any;

  photourl: string;
  myDB: SQLiteObject;
  profile: string = " ";
  name: string = " ";
  email: string;
  location: string = " ";
  website: string = " ";
  birthday: string = " ";
  phone: string = " ";

  shareBirthday: boolean = true;
  sharePhone: boolean = true;
  shareEmail: boolean = true;
  shareLocation: boolean = true;
  shareWebsite: boolean = true;
  shareTwitter: boolean = true;
  shareInstagram: boolean = true;
  shareSnapchat: boolean = true;
  shareLinkedin: boolean = true;

  shareFacebook: boolean = true;
  shareYoutube: boolean = true;
  sharePinterest: boolean = true;
  shareMusical: boolean = true;

  public isBirthdayHidden: boolean = true;
  public isEmailHidden: boolean = true;
  public isLocationHidden: boolean = true;
  public isWebsiteHidden: boolean = true;
  public isPhoneHidden: boolean = true;

  twitterLink: string;
  instagramLink: string;
  snapchatLink: string;
  linkedinLink: string;
  fbLink: string;

  youtubeLink: string;
  pinterestLink: string;
  musicalLink: string;

  totalOnlineNum = 0;

  constructor(
    public navCtrl: NavController,
    private afDB: AngularFireDatabase,
    public navParams: NavParams,
    public platform: Platform,
    public sqlite: SQLite,
    private iab: InAppBrowser,
    // private callNumber: CallNumber,
    private toastCtrl: ToastController,
    private sms: SMS,
    public actionSheetCtrl: ActionSheetController,
    private appAvailability: AppAvailability,
    private device: Device,
    private emailComposer: EmailComposer,
    public apiProvider: IdolApiProvider,
    public event: Events,
    public alertCtrl: AlertController,
    private phoneContacts: Contacts,
    private appRate: AppRate
  ) {
    console.log("Inside Qr Scan Page");
    this.appuserid = navParams.get("appuserid");
    this.contactid = navParams.get("contactid");
    this.mode = navParams.get("mode");

    if (this.appuserid == null) {
      this.appuserid = localStorage.getItem("appuserid");
    }
    this.contactsCount = navParams.get("contactsCount");

    this.getContactDetailsFromServer(this.contactid);

    let scanCounter = JSON.parse(localStorage.getItem("scanCounter"));
    if (scanCounter == null) {
      scanCounter = 0;
      localStorage.setItem("scanCounter", JSON.stringify(scanCounter));
    } else {
      if (scanCounter > 4) {
        scanCounter = 0;
        localStorage.setItem("scanCounter", JSON.stringify(scanCounter));
        this.appRate.preferences = {
          displayAppName: "IdolApp",
          usesUntilPrompt: 2,
          promptAgainForEachNewVersion: false,
          storeAppURL: {
            ios: "1239115397",
            android: "market://details?id=com.devdactic.crossingnumbers"
          },
          customLocale: {
            title: "Did you enjoy IdolApp?",
            message:
              "If you enjoy using %@, would you mind taking a moment to rate it? Thanks so much!",
            cancelButtonLabel: "No, Thanks",
            laterButtonLabel: "Remind Me Later",
            rateButtonLabel: "Rate It Now"
          },
          callbacks: {
            onRateDialogShow: function(callback) {
              console.log("rate dialog shown!");
            },
            onButtonClicked: function(buttonIndex) {
              console.log("Selected index: -> " + buttonIndex);
            }
          }
        };
        this.appRate.promptForRating(true);
      }
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad Settings");
  }

  ionViewWillLeave() {
    this.event.publish("reloadGarbage");
  }

  getContactDetailsFromServer(contactid) {
    console.log("Reading details of contactid from Server Database", contactid);

    this.apiProvider.get_appuser_profile(this.contactid).subscribe(
      res => {
        console.log("Success email: ", res);
        if (res.success == 1) {
          let dataArray = res.data;
          let data = dataArray[0];
          console.log(data);
          if (data.userid == null) {
            console.log("No User information exists");
            return;
          }
          this.photourl = data.photourl;
          this.name = data.username;
          this.profile = data.profile;

          this.email = data.email;
          if (
            data.shareemail == "false" ||
            data.email == null ||
            data.email == ""
          ) {
            this.email = "Private";
            this.isEmailHidden = false;
          }

          this.location = data.hometown;
          if (
            data.sharehometown == "false" ||
            data.hometown == null ||
            data.hometown == ""
          ) {
            this.location = "Private";
            this.isLocationHidden = false;
          }
          this.website = data.website;
          if (
            data.sharewebsite == "false" ||
            data.website == null ||
            data.website == ""
          ) {
            this.website = "Private";
            this.isWebsiteHidden = false;
          }

          this.birthday = data.birthday;
          let birthdaytime = new Date(this.birthday);
          birthdaytime.setDate(birthdaytime.getDate() + 1);
          console.log(birthdaytime);
          let birthdaymonth = birthdaytime.getMonth();
          const MONTH_NAMES = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
          ];
          let birthdayString;

          if (birthdaytime.getDate() < 10) {
            birthdayString = "0" + birthdaytime.getDate();
          } else {
            birthdayString = birthdaytime.getDate();
          }

          this.birthday =
            MONTH_NAMES[birthdaymonth] +
            " " +
            birthdayString +
            " " +
            birthdaytime.getFullYear();

          if (
            data.sharebirthday == "false" ||
            data.birthday == null ||
            data.birthday == ""
          ) {
            this.birthday = "Private";
            this.isBirthdayHidden = false;
          }
          this.phone = data.phone;
          if (
            data.sharephone == "false" ||
            data.phone == null ||
            data.phone == ""
          ) {
            this.phone = "Private";
            this.isPhoneHidden = false;
          }
          // this.shareBirthday =  data.sharebirthday;
          // this.sharePhone = data.sharephone;
          // this.shareEmail = data.shareemail;
          // this.shareLocation = data.sharehometown;
          // this.shareWebsite = data.shareWwbsite;
          // this.shareTwitter = data.sharetwitter;
          // this.shareInstagram = data.shareinstagram;
          // this.shareSnapchat = data.shareinapchat;
          // this.shareLinkedin = data.sharelinkedin;

          this.twitterLink = data.twitterurl;
          console.log("twitter" + this.twitterLink);
          if (
            data.sharetwitter == "false" ||
            data.twitterurl == null ||
            data.twitterurl == "" ||
            data.twitterurl == "undefined"
          ) {
            this.twitterLink = "";
            this.shareTwitter = false;
          }
          this.instagramLink = data.instagramurl;
          console.log("Instagram" + this.shareInstagram);
          if (
            data.shareinstagram == "false" ||
            data.instagramurl == null ||
            data.instagramurl == "" ||
            data.instagramurl == "undefined"
          ) {
            this.instagramLink = "";
            this.shareInstagram = false;
          }

          this.snapchatLink = data.snapchaturl;
          if (
            data.sharesnapchat == "false" ||
            data.snapchaturl == null ||
            data.snapchaturl == "" ||
            data.snapchaturl == "undefined"
          ) {
            this.snapchatLink = "";
            this.shareSnapchat = false;
          }
          this.linkedinLink = data.linkedinurl;
          if (
            data.sharelinkedin == "false" ||
            data.linkedinurl == null ||
            data.linkedinurl == "" ||
            data.linkedinurl == "undefined"
          ) {
            this.linkedinLink = "";
            this.shareLinkedin = false;
          }

          this.fbLink =
            data.fb_link == null || data.fb_link == "undefined"
              ? ""
              : data.fb_link;
          if (
            data.sharefb == "false" ||
            data.fb_link == null ||
            data.fb_link == "" ||
            data.fb_link == "undefined"
          ) {
            this.fbLink = "";
            this.shareFacebook = false;
          }

          this.youtubeLink =
            data.youtubeurl == null || data.youtubeurl == "undefined"
              ? ""
              : data.youtubeurl;
          if (
            data.shareyoutube == "false" ||
            data.youtubeurl == null ||
            data.youtubeurl == "" ||
            data.youtubeurl == "undefined"
          ) {
            this.youtubeLink = "";
            this.shareYoutube = false;
          }

          this.pinterestLink =
            data.pinteresturl == null || data.pinteresturl == "undefined"
              ? ""
              : data.pinteresturl;
          if (
            data.sharepinterest == "false" ||
            data.pinteresturl == null ||
            data.pinteresturl == "" ||
            data.pinteresturl == "undefined"
          ) {
            this.pinterestLink = "";
            this.sharePinterest = false;
          }

          this.musicalLink =
            data.soundcloudurl == null || data.soundcloudurl == "undefined"
              ? ""
              : data.soundcloudurl;
          if (
            data.sharesoundcloud == "false" ||
            data.soundcloudurl == null ||
            data.soundcloudurl == "" ||
            data.soundcloudurl == "undefined"
          ) {
            this.musicalLink = "";
            this.shareMusical = false;
          }

          //    If user came here from new scan screen then save contact id in contact book
          if (this.mode == "scanMode") {
            this.saveContact();
          }
        }
      },
      err => {}
    );
  }

  saveContactAction() {
    let alert = this.alertCtrl.create({
      title: "<img src='../assets/icon/contact-icon.svg'>",
      subTitle: "Add new Contact",
      message: "Would you like to add this user to your phone contacts?",
      cssClass: "iconAlert",
      buttons: [
        {
          text: "No",
          handler: () => {}
        },
        {
          text: "Yes",
          handler: () => {
            this.addNewContact();
          }
        }
      ]
    });
    alert.present();
  }

  addNewContact() {
    let phonecontact: Contact = this.phoneContacts.create();
    if (this.name != null && this.phone != null && this.isPhoneHidden == true) {
      phonecontact.name = new ContactName(null, null, this.name);
      phonecontact.phoneNumbers = [new ContactField("mobile", this.phone)];
      if (this.email != null && this.isEmailHidden == true) {
        phonecontact.emails = [new ContactField("email", this.email)];
      }
      phonecontact.save().then(
        () => {
          console.log("contact saved!", phonecontact);
          let alert = this.alertCtrl.create({
            title: "Success!",
            message: "This Contact is added to addressbook!",
            buttons: ["Ok"]
          });
          alert.present();
        },
        (error: any) => console.error("Error saving contact.", error)
      );
    } else {
      let alert = this.alertCtrl.create({
        title: "Warning!",
        message:
          "This Contact can not add to address book, because no exist name and phone number!",
        buttons: ["Ok"]
      });
      alert.present();
    }
  }

  saveContact() {
    this.apiProvider.qrcode_contact(this.appuserid, this.contactid).subscribe(
      res => {
        console.log("qrcode _ Success!", res.data);
        if (res.success == true) {
          console.log("connect Success!");
          if (this.mode == "scanMode") {
            console.log("TTT connect Success!");
            this.apiProvider
              .connectnum_update(this.appuserid, this.contactid)
              .subscribe(
                res => {
                  if (res.success == true) {
                    // this.navCtrl.pop();
                    console.log("TTT connect Success!");
                  }
                },
                err => {}
              );
          } else {
            this.navCtrl.pop();
          }
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  fullPic(pic) {
    this.navCtrl.push(FullscreenPage, { pic: pic, currentuid: this.appuserid });
  }

  socialLink(site, username) {
    console.log("social link clicked", site, username);
    if (username == undefined) {
      return;
    }

    switch (site) {
      case "twitter":
        this.launchExternalApp(
          "twitter://",
          "com.twitter.android",
          "twitter://user?screen_name=",
          "https://twitter.com/",
          username
        );
        break;
      case "instagram":
        this.launchExternalApp(
          "instagram://",
          "com.instagram.android",
          "instagram://user?username=",
          "https://www.instagram.com/",
          username
        );
        break;
      case "linkedin":
        this.launchExternalApp(
          "linkedin://",
          "com.linkedin.android",
          "linkedin://profile/",
          "https://linkedin.com/in/",
          username
        );
        break;
      case "facebook":
        // this.launchExternalApp('fb://', 'com.facebook.katana', 'fb://profile/id=', 'https://www.facebook.com/', 'username');
        // this.launchExternalApp('fb://', 'com.facebook.katana', 'fb://profile/', 'https://www.facebook.com/', username);
        this.iab.create(username, "_blank", "location=yes");
        break;
      case "youtube":
        // this.launchExternalApp('fb://', 'com.facebook.katana', 'fb://profile/id=', 'https://www.facebook.com/', 'username');
        // this.launchExternalApp('fb://', 'com.facebook.katana', 'fb://profile/', 'https://www.facebook.com/', username);
        this.iab.create(
          "https://www.youtube.com/" + username,
          "_system",
          "location=yes"
        );
        break;
      case "pinterest":
        // this.launchExternalApp('fb://', 'com.facebook.katana', 'fb://profile/id=', 'https://www.facebook.com/', 'username');
        // this.launchExternalApp('fb://', 'com.facebook.katana', 'fb://profile/', 'https://www.facebook.com/', username);
        this.iab.create(
          "https://www.pinterest.com/" + username,
          "_system",
          "location=yes"
        );
        break;
      case "musical":
        // this.launchExternalApp('fb://', 'com.facebook.katana', 'fb://profile/id=', 'https://www.facebook.com/', 'username');
        // this.launchExternalApp('fb://', 'com.facebook.katana', 'fb://profile/', 'https://www.facebook.com/', username);
        this.iab.create(
          "https://www.soundcloud.com/" + username,
          "_system",
          "location=yes"
        );
        break;
      case "snapchat":
        this.launchExternalApp(
          "snapchat://",
          "com.snapchat.android",
          "snapchat://",
          "https://snapchat.com/add/",
          username
        );
        break;
      case "web":
        let url = "http://" + username;
        this.iab.create(url, "_blank", "location=yes");
        break;
      default:
        break;
    }
  }

  launchExternalApp(
    iosSchemaName: string,
    androidPackageName: string,
    appUrl: string,
    httpUrl: string,
    username: string
  ) {
    let app: string;
    if (this.device.platform === "iOS") {
      app = iosSchemaName;
    } else if (this.device.platform === "Android") {
      app = androidPackageName;
    } else {
      this.iab.create(httpUrl + username, "_system", "location=yes");
      return;
    }

    this.appAvailability
      .check(app)
      .then(() => {
        // success callback
        console.log("Opening App", app);
        this.iab.create(appUrl + username, "_system", "location=yes");
        // browser.close
      })
      .catch(() => {
        // App not found so open browser
        console.log("No app found so open browser", httpUrl);
        this.iab.create(httpUrl + username, "_system", "location=yes");
      });
  }
  // callPhone(passedNumber) {
  //     let actionSheet = this.actionSheetCtrl.create({
  //     title: 'IDOL APP',
  //     buttons: [
  //       {
  //         text: 'Call ' + passedNumber,
  //         // role: 'destructive',
  //         handler: () => {
  //           console.log('Phone calling selected');
  //           console.log("call phone triggered -> ", passedNumber);
  //           this.callNumber.callNumber(passedNumber, true)
  //             .then(() => console.log('Launched dialer!'))
  //             .catch(() => console.log('Error launching dialer'));
  //         }
  //       },{
  //         text: 'SMS ' + passedNumber,
  //         handler: () => {
  //           console.log('SMS calling selected');
  //           console.log("call phone triggered -> ", passedNumber);
  //           this.sms.send(passedNumber, '');
  //         }
  //       },{
  //         text: 'Cancel',
  //         role: 'cancel',
  //         handler: () => {
  //           console.log('Cancel clicked');
  //         }
  //       }
  //     ]
  //   });
  //   actionSheet.present();

  // }

  sendEmail(emailAddress) {
    console.log("send email triggered");

    this.emailComposer.isAvailable().then((available: boolean) => {
      if (available) {
        //Now we know we can send
      }
    });

    let email = {
      to: emailAddress,
      subject: "",
      body: "",
      isHtml: true
    };

    // Send a text message using default options
    this.emailComposer.open(email);
  }

  deleteinfo() {
    this.apiProvider.contact_del(this.appuserid, this.contactid).subscribe(
      res => {
        console.log(res);
        if (res.success == 1) {
          this.navCtrl.pop();
        }
      },
      err => {}
    );
  }

  gotonewChat() {
    this.apiProvider.get_appuser_profile(this.appuserid).subscribe(
      res => {
        if (res.success == 1) {
          let dataArray = res.data;
          let data = dataArray[0];
          this.navCtrl.push(ChatPage, {
            appuserid: this.appuserid,
            appusername: data.username,
            userAvatar: data.photourl,
            contactid: this.contactid,
            touser_name: this.name,
            touser_Avatar: this.photourl,
            mode: "Chat"
          });
        }
      },
      err => {
        this.showToast();
      }
    );
  }

  showToast() {
    let toast = this.toastCtrl.create({
      message: "Network connect error",
      duration: 3000,
      position: "bottom"
    });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }
}
