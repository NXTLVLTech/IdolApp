import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  AlertController,
  ModalOptions,
  Modal,
  ModalController,
  ToastController
} from "ionic-angular";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import {
  AngularFireDatabase,
  FirebaseListObservable
} from "angularfire2/database";
import * as firebase from "firebase/app";
import { Platform } from "ionic-angular/platform/platform";
import {
  Contacts,
  Contact,
  ContactField,
  ContactName
} from "@ionic-native/contacts";
import { IdolApiProvider } from "../../providers/apiProvider";
import { ChatPage } from "../chat/chat";
/**
 * Generated class for the ContactList page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: "page-chat-list",
  templateUrl: "chat-list.html"
})
export class ChatListPage {
  myContacts = [];
  initContacts = [];

  appuserid: any;
  appusername: any;
  appuser_photo: any;
  touser_photo: any;

  searchTerm;
  totalOnlineNum = 0;
  myDB: SQLiteObject;

  constructor(
    public navCtrl: NavController,
    private afDB: AngularFireDatabase,
    public sqlite: SQLite,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private platform: Platform,
    public apiProvider: IdolApiProvider,
    private modal: ModalController,
    private toastCtrl: ToastController,
    private phoneContacts: Contacts
  ) {
    this.appuserid = navParams.get("appuserid");

    if (this.appuserid == null) {
      this.appuserid = localStorage.getItem("appuserid");
    }

    apiProvider.get_appuser_profile(this.appuserid).subscribe(
      res => {
        if (res.success == 1) {
          let dataArray = res.data;
          let data = dataArray[0];
          this.appusername = data.username;
          this.appuser_photo = data.photourl;
        }
      },
      err => {
        this.showToast();
      }
    );
  }

  getlastMessages(userid) {
    console.log("Get a list of contacts from Server Database");
    console.log(userid);
    this.apiProvider.last_messages(userid).subscribe(
      res => {
        if (res.success == 1) {
          console.log(res);
          let myContacts = res.data;

          myContacts.sort(function(a, b) {
            var nameA;
            var nameB;
            if (userid == a.UserId) {
              var nameAarray = a.toUserName.toUpperCase().split(" ");

              if (nameAarray.length >= 2) {
                nameA = nameAarray[1];
              } else {
                nameA = nameAarray[0];
              }
            } else {
              var nameAarray = a.UserId.toUpperCase().split(" ");

              if (nameAarray.length >= 2) {
                nameA = nameAarray[1];
              } else {
                nameA = nameAarray[0];
              }
            }

            if (userid == b.UserId) {
              var nameBarray = b.toUserName.toUpperCase().split(" ");
              if (nameBarray.length >= 2) {
                nameB = nameBarray[1];
              } else {
                nameB = nameBarray[0];
              }
            } else {
              var nameBarray = b.UserId.toUpperCase().split(" ");
              if (nameBarray.length >= 2) {
                nameB = nameBarray[1];
              } else {
                nameB = nameBarray[0];
              }
            }
            if (nameA < nameB) return -1;
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
          this.myContacts = myContacts.filter((obj, pos, arr) => {
            return (
              arr
                .map(contact => contact["toUserId"])
                .indexOf(obj["toUserId"]) === pos
            );
          });
          this.initContacts = this.myContacts;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  swipeRight() {
    console.log("Swipe Left triggered");
    //this.navCtrl.pop({direction:'forward'});
    this.navCtrl.parent.select(1);
  }

  ionViewWillEnter() {
    this.myContacts = [];
    // // Get contact details from server and add to contact array
    this.getlastMessages(this.appuserid);
  }

  deleteContact(contactid, i) {
    // Delete contact details if userid was passed
    // console.log('delete contact triggered', contactid);
    this.apiProvider.contact_del(this.appuserid, contactid).subscribe(
      res => {
        console.log(res);
        if (res.success == 1) {
          this.myContacts.splice(i);
        }
      },
      err => {}
    );
  }
  addPhone(contactid, i) {
    // Delete contact details if userid was passed
    console.log("add contact triggered", contactid);
    firebase
      .database()
      .ref("users/" + contactid)
      .once("value", snapshot => {
        console.log(snapshot.val());
        let contactInfo = snapshot.val();
        let phonecontact: Contact = this.phoneContacts.create();
        if (
          contactInfo.name != null &&
          contactInfo.phone != null &&
          contactInfo.sharePhone == true
        ) {
          phonecontact.name = new ContactName(null, null, contactInfo.name);
          phonecontact.phoneNumbers = [
            new ContactField("mobile", contactInfo.phone)
          ];
          if (contactInfo.email != null && contactInfo.shareEmail == true) {
            phonecontact.emails = [
              new ContactField("email", contactInfo.email)
            ];
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
      });
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad ContactList");
  }

  gotoChat(contact) {
    console.log("aaaaa", this.appusername);

    console.log("bbbbb", this.appuser_photo);
    console.log("cccc", contact.contactphotourl);
    console.log(this.appuserid, contact);

    if (this.appuserid == contact.toUserId) {
      this.navCtrl.push(ChatPage, {
        appuserid: this.appuserid,
        appusername: this.appusername,
        userAvatar: this.appuser_photo,
        contactid: contact.UserId,
        touser_name: contact.UserName,
        touser_Avatar: contact.UserAvatar,
        mode: "Chat"
      });
    } else {
      this.navCtrl.push(ChatPage, {
        appuserid: this.appuserid,
        appusername: this.appusername,
        userAvatar: this.appuser_photo,
        contactid: contact.toUserId,
        touser_name: contact.toUserName,
        touser_Avatar: contact.toUserAvatar,
        mode: "Chat"
      });
    }
  }

  filter(ev: any) {
    console.log("filer called", this.searchTerm);
    // Reset items back to all of the items
    this.myContacts = this.initContacts;
    // set val to the value of the searchbar
    let val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != "") {
      this.myContacts = this.myContacts.filter(contact => {
        if (contact.toUserName) {
          return (
            contact.toUserName.toLowerCase().indexOf(val.toLowerCase()) > -1
          );
        } else if (contact.UserName) {
          return contact.UserName.toLowerCase().indexOf(val.toLowerCase()) > -1;
        }
      });
    }
  }

  back() {
    this.navCtrl.pop();
  }

  newChat() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false,
      cssClass: "inset-modal"
    };

    const myModalData = {
      id: this.appuserid
    };

    const myModal: Modal = this.modal.create(
      "AddNewchatModalPage",
      { data: myModalData },
      myModalOptions
    );

    myModal.present();

    myModal.onDidDismiss(data => {
      console.log("I have dismissed.");
      console.log(data);

      if (data.isSelected == "yes") {
        let newContact = data.contact;
        console.log(newContact);
        this.navCtrl.push(ChatPage, {
          appuserid: this.appuserid,
          appusername: this.appusername,
          userAvatar: this.appuser_photo,
          contactid: newContact.contactid,
          touser_name: newContact.contactname,
          touser_Avatar: newContact.contactphotourl,
          mode: "Chat"
        });
      }
    });

    myModal.onWillDismiss(data => {
      console.log("I'm about to dismiss");
      console.log(data);
    });
  }

  showToast() {
    let toast = this.toastCtrl.create({
      message: "Network connect error",
      duration: 3000,
      position: "bottom"
    });
  }
}
