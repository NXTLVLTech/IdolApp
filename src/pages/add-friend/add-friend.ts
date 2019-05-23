import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController
} from "ionic-angular";
import { IdolApiProvider } from "../../providers/apiProvider";
import { QrScanPage } from "../qr-scan/qr-scan";
import {
  Contacts,
  Contact,
  ContactField,
  ContactName
} from "@ionic-native/contacts";

@IonicPage()
@Component({
  selector: "page-add-friend",
  templateUrl: "add-friend.html"
})
export class AddFriendPage {
  phone = "";
  name = "";
  listPhone = [];
  listName = [];
  appuserid: any;
  loading: any;
  stype: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiProvider: IdolApiProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public contacts: Contacts
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad AddFriendPage");
    this.appuserid = localStorage.getItem("appuserid");
    this.stype = "byphone";
  }

  searchFriends(ev: any) {
    this.listPhone = [];
    let val = ev.target.value;
    if (!val) return;
    val = val.trim();

    this.apiProvider.appuserSearch(this.appuserid, val, "username").subscribe(
      res => {
        this.hideLoading();
        if (res.success == 1) {
          this.listPhone = res.data;
        }
        this.searchPhone(val);
      },
      err => {
        this.hideLoading();
      }
    );
  }

  searchPhone(val) {
    this.showLoading();
    this.apiProvider.appuserSearch(this.appuserid, val, "phone").subscribe(
      res => {
        this.hideLoading();
        if (res.success == 1) {
          this.listPhone = res.data;
          Array.prototype.push.apply(this.listPhone, res.data);
        }
      },
      err => {
        this.hideLoading();
      }
    );
  }

  goProfile(item) {
    this.navCtrl.push(QrScanPage, {
      appuserid: this.appuserid,
      contactid: item.userid,
      mode: "view"
    });
  }

  addFriend(item) {
    let alert = this.alertCtrl.create({
      title: "Friend Request",
      message:
        "Are your sure to send friend request to <b>" +
        item.username +
        "</b> ?",
      buttons: [
        {
          text: "Cancel"
        },
        {
          text: "Send",
          handler: data => {
            this.sendFriendRequest(item);
          }
        }
      ]
    });
    alert.present();
  }

  sendFriendRequest(item) {
    this.showLoading();
    let contactid = item.userid;
    this.apiProvider.qrcode_contact(this.appuserid, contactid, "0").subscribe(
      res => {
        this.hideLoading();
        if (eval(res.success) == 1) {
          item.done = "1";
          this.showAlert("Sent friend request.", "");
        } else {
          this.showAlert("Error", res.data);
        }
      },
      err => {
        this.hideLoading();
        console.log(err);
      }
    );
  }

  openContacts() {
    let alert = this.alertCtrl.create({
      title: "<img src='assets/icon/add-contacts-icon.png'>",
      subTitle: '"Idol" would like to Access your Contacts',
      message:
        "The app would like to access Contacts to add friends on friend list.",
      cssClass: "contactsAlert",
      buttons: [
        {
          text: "Don't Allow"
        },
        {
          text: "OK",
          handler: data => {
            this.addContacts();
          }
        }
      ]
    });
    alert.present();
  }

  addContacts() {
    this.contacts.pickContact().then((response: Contact) => {
      let phones = response.phoneNumbers;
      console.log(phones);
      this.showLoading();
      this.listPhone = [];
      this.stype = "phone";
      for (let i = 0; i < phones.length; i++) {
        let phone = phones[i];
        this.apiProvider.checkPhoneNumber(this.appuserid, phone).subscribe(
          res => {
            this.hideLoading();
            if (eval(res.success) == 1) {
              for (let j = 0; j < res.data.length; j++) {
                this.listPhone.push(res.data[j]);
              }
            } else {
              // send sms
              let msg =
                "https://www.idolapp.co/socialprofile.php?id=" + this.appuserid;
              this.apiProvider.sendSMSPhone(msg, phone).subscribe(res => {});
            }
          },
          err => {
            this.hideLoading();
          }
        );
      }
    });
  }

  showAlert(title, msg) {
    let alert = this.alertCtrl.create({
      title: title,
      message: msg,
      buttons: ["Ok"]
    });
    alert.present();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: ""
    });
    this.loading.present();
  }

  hideLoading() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }
}
