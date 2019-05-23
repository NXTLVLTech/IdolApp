import { Component, ViewChild, ElementRef } from "@angular/core";
import {
  NavController,
  NavParams,
  AlertController,
  Content,
  Scroll,
  ToastController,
  List
} from "ionic-angular";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { QrScanPage } from "../qr-scan/qr-scan";
import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from "firebase/app";
import { Platform } from "ionic-angular/platform/platform";
import {
  Contacts,
  Contact,
  ContactField,
  ContactName
} from "@ionic-native/contacts";
import { IdolApiProvider } from "../../providers/apiProvider";
import { ChatListPage } from "../chat-list/chat-list";
declare var Hammer;

/**
 * Generated class for the ContactList page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: "page-contact-list",
  templateUrl: "contact-list.html"
})
export class ContactListPage {
  @ViewChild(Content) content: Content;

  myContacts = [];
  initContacts = [];

  groupedContacts = [];
  alphabet: any = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "#"
  ];

  appuserid: any;
  appusername: any;
  appuser_photo: any;

  searchTerm;
  totalOnlineNum = 0;

  headerLetter = "";

  constructor(
    public navCtrl: NavController,
    private afDB: AngularFireDatabase,
    public sqlite: SQLite,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private platform: Platform,
    public apiProvider: IdolApiProvider,
    private element: ElementRef,
    private toastCtrl: ToastController,
    private phoneContacts: Contacts
  ) {
    this.appuserid = navParams.get("appuserid");
    if (this.appuserid == "") {
      this.appuserid = localStorage.getItem("appuserid");
    }
  }

  getContactListFromServer(userid) {
    console.log("Get a list of contacts from Server Database");
    this.myContacts = [];
    this.groupedContacts = [];
    this.apiProvider.get_appuser_profile(this.appuserid).subscribe(
      res => {
        if (res.success == 1) {
          let dataArray = res.data;
          let data = dataArray[0];
          this.appusername = data.username;
          this.myContacts.push({
            contactid: this.appuserid,
            contactname: data.username,
            contactnew: null,
            contactphotourl: data.photourl
          });
          this.apiProvider.get_contact_list(this.appuserid).subscribe(
            res => {
              if (res.success == true) {
                console.log(res.data);
                let temp = res.data;
                temp.forEach(contact => {
                  if (parseInt(contact.totalcontact) >= 1) {
                    this.myContacts.push({
                      contactid: contact.contact_id,
                      contactname: contact.contactname,
                      contactnew: null,
                      contactphotourl: contact.contactphoto
                    });
                  } else {
                    this.myContacts.push({
                      contactid: contact.contact_id,
                      contactname: contact.contactname,
                      contactnew: 1,
                      contactphotourl: contact.contactphoto
                    });
                  }
                });

                console.log(this.myContacts);

                let currenMybackup = JSON.parse(localStorage.getItem("data"));
                console.log("Current Data", currenMybackup);
                if (this.myContacts != null) {
                  if (
                    currenMybackup == null ||
                    currenMybackup.length < this.myContacts.length
                  ) {
                    console.log("Auto Backuped");
                    localStorage.removeItem("data");

                    localStorage.setItem(
                      "data",
                      JSON.stringify(this.myContacts)
                    );
                  }
                }
                this.myContacts.sort(function(a, b) {
                  var nameAarray = a.contactname.toUpperCase().split(" ");
                  var nameA;
                  if (nameAarray.length >= 2) {
                    nameA = nameAarray[1];
                  } else {
                    nameA = nameAarray[0];
                  }
                  var nameBArray = b.contactname.toUpperCase().split(" ");
                  var nameB;
                  if (nameBArray.length >= 2) {
                    nameB = nameBArray[1];
                  } else {
                    nameB = nameBArray[0];
                  }
                  if (nameA < nameB) return -1;
                  if (nameA > nameB) {
                    return 1;
                  }
                  return 0;
                });
                this.initContacts = this.myContacts;

                this.groupContacts(this.initContacts);
              }
            },
            err => {}
          );
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

  swipeRight() {
    console.log("Swipe Left triggered");

    //this.navCtrl.pop({direction:'forward'});
    this.navCtrl.parent.select(1);
  }

  ionViewWillEnter() {
    console.log(this.myContacts);
    // this.getContactListFromServer(this.appuserid);
  }

  groupContacts(contacts) {
    console.log(contacts);
    let sortedContacts = contacts;
    let currentLetter = false;
    let currentContacts = [];
    this.groupedContacts = [];

    for (var i = 0; i < sortedContacts.length; i++) {
      var sortLetterArray = sortedContacts[i].contactname
        .toUpperCase()
        .split(" ");
      var sortLetter;
      if (sortLetterArray.length >= 2) {
        sortLetter = sortLetterArray[1].charAt(0);
      } else {
        sortLetter = sortLetterArray[0].charAt(0);
      }
      if (sortLetter != currentLetter) {
        currentLetter = sortLetter;

        let newGroup = {
          letter: currentLetter,
          contacts: []
        };

        currentContacts = newGroup.contacts;
        this.groupedContacts.push(newGroup);
      }
      currentContacts.push(sortedContacts[i]);
    }
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

  details(contact) {
    console.log("call details page");
    console.log(contact);
    console.log(this.appuserid);
    if (contact.contactnew == 1) {
      this.apiProvider
        .connectnum_update(this.appuserid, contact.contactid)
        .subscribe(
          res => {
            if (res.success == true) {
              // this.navCtrl.pop();
              console.log("TTT connect Success!");
              this.navCtrl.push(QrScanPage, {
                appuserid: this.appuserid,
                contactid: contact.contactid,
                mode: "list"
              });
            }
          },
          err => {}
        );
    } else {
      this.navCtrl.push(QrScanPage, {
        appuserid: this.appuserid,
        contactid: contact.contactid,
        mode: "list"
      });
    }
  }

  filter(ev: any) {
    console.log("filer called", this.searchTerm);
    // Reset items back to all of the items
    this.myContacts = this.initContacts;

    // set val to the value of the searchbar
    let val = ev.target.value;
    console.log("Val ->", val);

    // if the value is an empty string don't filter the items
    if (val && val.trim() != "") {
      this.myContacts = this.myContacts.filter(contact => {
        return (
          contact.contactname.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
      this.groupContacts(this.myContacts);
    }
  }

  backupDialog() {
    let alert = this.alertCtrl.create({
      title: "Use Contact Backup!",
      subTitle: "Do you want to restore lost contacts!",
      buttons: [
        {
          text: "Cancel",
          handler: () => {}
        },
        {
          text: "Restore",
          handler: () => {
            console.log("Restore Clicked");
            let tempMyContacts = JSON.parse(localStorage.getItem("data"));
            console.log(tempMyContacts);
            if (tempMyContacts != null) {
              this.myContacts = [];
              this.initContacts = [];
              this.myContacts = tempMyContacts;
              console.log(this.myContacts);
              this.initContacts = this.myContacts;
              this.myContacts.sort();

              for (var i = 0; i < tempMyContacts.length; i++) {
                if (this.appuserid != tempMyContacts[i].contactid) {
                  console.log("sucess");
                  this.apiProvider
                    .qrcode_contact(this.appuserid, tempMyContacts[i].contactid)
                    .subscribe(
                      res => {
                        if (res.success == 1) {
                          console.log("//////sucess");
                        }
                        console.log(res.success);
                      },
                      err => {}
                    );
                }
              }
            } else {
              let alert = this.alertCtrl.create({
                title: "WARNING",
                subTitle:
                  "there is no data to restore, please form connections by scanning another users' QR",
                buttons: ["Ok"]
              });
              alert.present();
            }
          }
        }
      ]
    });
    alert.present();
  }

  chatlist() {
    this.navCtrl.push(ChatListPage, {
      appuserid: this.appuserid,
      username: this.appusername,
      photourl: this.appuser_photo
    });
  }

  calculateDimensionsForSidebar() {
    return {
      top: this.content.contentTop + 50 + "px",
      height: this.content.getContentDimensions().contentHeight - 100 + "px"
    };
  }

  alphaScrollGoToList(letter) {
    var height = 40;
    var isLoop = false;
    for (var i = 0; i < this.groupedContacts.length; i++) {
      var groupedLetter = this.groupedContacts[i].letter;
      var contactsCounter = this.groupedContacts[i].contacts.length;

      if (letter == groupedLetter) {
        isLoop = true;
      } else {
        if (isLoop == false) {
          height = height + 30 + 80 * contactsCounter;
        }
      }
    }
    if (isLoop == true) {
      this.content.scrollTo(0, height, 300);
    }
  }

  setupHammerHandlers() {
    let sidebarEle = this.element.nativeElement.querySelector(
      ".ion-alpha-sidebar"
    );

    if (!sidebarEle) return;

    let mcHammer = new Hammer(sidebarEle, {
      recognizers: [
        // RecognizerClass, [options], [recognizeWith, ...], [requireFailure, ...]
        [Hammer.Pan, { direction: Hammer.DIRECTION_VERTICAL }]
      ]
    });

    mcHammer.on("panup pandown", ev => {
      const closestEle: any = document.elementFromPoint(
        ev.center.x,
        ev.center.y
      );
      if (closestEle && ["LI", "A"].indexOf(closestEle.tagName) > -1) {
        const letter = closestEle.innerText;
        if (letter) {
          this.alphaScrollGoToList(letter);
        }
      }
    });
  }

  ngOnInit() {
    console.log("bbb");
    this.getContactListFromServer(this.appuserid);
    this.setupHammerHandlers();
  }

  getHeader(record, recordIndex, records) {
    // return record.division;
    var nameAarray = record.contactname.toUpperCase().split(" ");
    var nameA;
    if (nameAarray.length >= 2) {
      nameA = nameAarray[1].toUpperCase().charAt(0);
    } else {
      nameA = nameAarray[0].toUpperCase().charAt(0);
    }

    if (recordIndex === 0) {
      this.headerLetter = nameA;
      return this.headerLetter;
    } else {
      if (nameA != this.headerLetter) {
        this.headerLetter = nameA;
        return this.headerLetter;
      }
    }
    return null;
  }
}
