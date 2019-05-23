import { Component, ViewChild, ElementRef } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  Content,
  Scroll,
  VirtualScroll
} from "ionic-angular";
import { IdolApiProvider } from "../../providers/apiProvider";
import { AlertController } from "ionic-angular";
declare var Hammer;
/**
 * Generated class for the AddNewchatModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: "page-add-newchat-modal",
  templateUrl: "add-newchat-modal.html"
})
export class AddNewchatModalPage {
  appuserid: any;
  myContacts = [];
  initContacts = [];
  searchTerm;

  @ViewChild(Content) content: Content;
  @ViewChild("virtualScroll") virtualScroll: VirtualScroll;

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
  headerLetter = "";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private view: ViewController,
    private apiProvider: IdolApiProvider,
    private element: ElementRef,
    private alertCtrl: AlertController
  ) {}

  ionViewWillLoad() {
    const data = this.navParams.get("data");
    console.log(data);
    this.appuserid = data.id;
    this.getContactListFromServer();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad AddNewchatModalPage");
  }

  getContactListFromServer() {
    console.log("Get a list of contacts from Server Database");
    this.myContacts = [];
    this.initContacts = [];
    this.apiProvider.get_contact_list(this.appuserid).subscribe(
      res => {
        if (res.success == true) {
          console.log(res.data);
          let temp = res.data;
          temp.forEach(contact => {
            if (parseInt(contact.totalcontact) >= 1) {
              this.initContacts.push({
                contactid: contact.contact_id,
                contactname: contact.contactname,
                contactnew: null,
                contactphotourl: contact.contactphoto
              });
            } else {
              this.initContacts.push({
                contactid: contact.contact_id,
                contactname: contact.contactname,
                contactnew: 1,
                contactphotourl: contact.contactphoto
              });
            }
          });
          this.initContacts.sort(function(a, b) {
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
          this.myContacts = this.initContacts;
          // setTimeout(() => {
          //   this.virtualScroll.resize(); }, 1000);

          this.groupContacts(this.initContacts);
        }
      },
      err => {}
    );
  }

  cancel() {
    const data = {
      isSelected: "no"
    };
    this.view.dismiss(data);
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

  gotoChat(contact) {
    const data = {
      isSelected: "yes",
      contact: contact
    };
    this.view.dismiss(data);
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
