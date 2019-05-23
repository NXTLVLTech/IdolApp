import { Component } from "@angular/core";
import {
  App,
  NavController,
  NavParams,
  Platform,
  ActionSheetController,
  ToastController
} from "ionic-angular";
import {
  AngularFireDatabase,
  FirebaseObjectObservable
} from "angularfire2/database";
import { DomSanitizer } from "@angular/platform-browser";
import { SocialSharing } from "@ionic-native/social-sharing";
import { Facebook } from "@ionic-native/facebook";
import { InAppBrowser } from "@ionic-native/in-app-browser";

import { QrScanPage } from "../qr-scan/qr-scan";
import { SettingsPage } from "../settings/settings";
import { ContactListPage } from "../contact-list/contact-list";
import { NotificationPage } from "../notification/notification";
import { AddFriendPage } from "../add-friend/add-friend";
import { AppIntroPage } from "../appIntro/appIntro";

import { IdolApiProvider } from "../../providers/apiProvider";

declare var qrcode_tool: any;

@Component({
  selector: "page-profile",
  templateUrl: "profile.html"
})
export class ProfilePage {
  appusername: any;
  appuserid: any;

  qrcode: any;
  scanInProgress: boolean = false;

  results: {};
  contacts$: FirebaseObjectObservable<any>; //  FirebaseListObservable<any[]>;
  contactsCount: number = 0;
  totalOnlineNum = 0;
  notification_interval: any;
  notification_badge = 0;
  openMenu = false;

  constructor(
    public navCtrl: NavController,
    private afDB: AngularFireDatabase,
    public navParams: NavParams,
    public platform: Platform,
    private socialSharing: SocialSharing,
    public actionSheetCtrl: ActionSheetController,
    public apiProvider: IdolApiProvider,
    public toastCtrl: ToastController,
    private app: App,
    private fb: Facebook,
    private iab: InAppBrowser,
    public sanitizer: DomSanitizer
  ) {
    this.appuserid = navParams.get("appuserid");

    console.log(this.appuserid);

    if (this.appuserid == null) {
      this.appuserid = localStorage.getItem("appuserid");
    }

    apiProvider.get_appuser_profile(this.appuserid).subscribe(
      res => {
        if (res.success == 1) {
          let dataArray = res.data;
          let data = dataArray[0];
          this.appusername = data.username;
        }
      },
      err => {
        this.showToast();
      }
    );

    console.log("In profile page FB User ", this.appuserid);

    if (this.platform.is("cordova")) {
      this.encodeData();
    }
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

  ionViewWillLoad() {
    // Retrieve new contacts count from server
    // this.contacts$ = this.afDB.object('users/' + this.fbUser.uid + '/newcontacts');
    // this.contacts$.subscribe();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad Profile123");
    // this.navCtrl.parent.select(1);
  }

  ionViewWillEnter() {
    this.checkNotifications();
  }

  ionViewWillLeave() {
    clearInterval(this.notification_interval);
  }

  checkNotifications() {
    this.notification_interval = setInterval(() => {
      this.apiProvider
        .checkNotifications(this.appuserid, true)
        .subscribe(res => {
          this.notification_badge = eval(res.notifications);
          this.apiProvider.notifications = res;
        });
    }, 3000);
  }

  settings() {
    this.navCtrl.push(
      SettingsPage,
      { appuserid: this.appuserid },
      { animate: true, direction: "forward" }
    );
  }

  contactList() {
    this.navCtrl.push(
      ContactListPage,
      { appuserid: this.appuserid },
      { animate: true, direction: "back" }
    );
  }

  async encodeData() {
    // Generate QR code
    // const result = await this.barcode.encode(this.barcode.Encode.TEXT_TYPE,this.fbUser.uid)
    // this.qrcode =  result.file;
    // console.log('QrCode ->', this.qrcode);
    let appuser_QrCode =
      "https://www.idolapp.co/socialprofile.php?id=" + this.appuserid;
    qrcode_tool.getQRCode(
      appuser_QrCode,
      data => {
        if (data) {
          this.qrcode = this.sanitizer.bypassSecurityTrustUrl(data);
        }
      },
      err => {
        // An error occurred
        this.scanInProgress = false;
        alert(JSON.stringify(err));
      }
    );
  }

  async scanBarcode() {
    if (this.scanInProgress) {
      return;
    } else {
      this.scanInProgress = true;
    }
    // this.options = {
    //   prompt: 'Scan code for info',
    //   preferFrontCamera: false,
    //   showTorchButton: true,
    //   disableSuccessBeep: true,
    //   disableAnimations: false
    // }
    console.log("Native Plugin");
    qrcode_tool.getScanCode(
      "Camera",
      data => {
        console.log(data);
        this.scanInProgress = false;
        console.log("barcodeData.text - ", data);
        if (data == null || data == "") {
        } else {
          console.log("Call QrScan Page");
          let scanCounter = JSON.parse(localStorage.getItem("scanCounter"));
          if (scanCounter == null) {
            scanCounter = 1;
            localStorage.setItem("scanCounter", JSON.stringify(scanCounter));
          } else {
            scanCounter = scanCounter + 1;
            localStorage.setItem("scanCounter", JSON.stringify(scanCounter));
          }
          //      this.navCtrl.push(QrScanPage,{userid:this.fbUser.uid, username:this.name, userphotourl:this.photoUrl, contactid:data, mode:'new'});
          console.log("adfasdfasdfasd", data);
          let getcontactarray: string;
          if (
            data.includes("https://www.idolapp.co/socialprofile.php?id=", 0) !=
            -1
          ) {
            getcontactarray = data.split(
              "http://www.idolapp.co/socialprofile.php?id="
            );
            console.log("getcontactID", getcontactarray);
          }
          let contactID = getcontactarray[1];
          this.apiProvider.get_appuser_profile(contactID).subscribe(
            res => {
              console.log("///////" + res.success);
              if (res.success == 1) {
                console.log(res);
                this.apiProvider.totalcontact_update(this.appuserid).subscribe(
                  res => {
                    console.log(res);
                    if (res.success == 1) {
                      this.navCtrl.push(QrScanPage, {
                        appuserid: this.appuserid,
                        contactid: contactID,
                        mode: "scanMode"
                      });
                    }
                  },
                  err => {
                    console.log("failed error");
                  }
                );
              }
            },
            err => {
              console.log(err);
            }
          );
        }
      },
      err => {
        // An error occurred
        this.scanInProgress = false;
        // alert(JSON.stringify(err));
      }
    );
  }

  goNotification() {
    this.navCtrl.push(NotificationPage);
  }

  goAddFriend() {
    this.navCtrl.push(AddFriendPage);
  }

  swipeLeft() {
    //   this.navCtrl.push(ContactListPage, {fbUser: this.fbUser},{animate: true, direction: 'forward'});
    this.navCtrl.parent.select(2);
  }

  swipeRight() {
    //  this.navCtrl.push(ProfilePage, {fbUser: this.fbUser},{animate: true, direction: 'backward'});
    this.navCtrl.parent.select(0);
  }

  moveTutorial() {
    this.navCtrl.push(AppIntroPage, { appuserid: this.appuserid });
  }
}
