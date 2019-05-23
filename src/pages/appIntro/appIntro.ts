import { Component } from "@angular/core";
import { NavController, NavParams, Platform } from "ionic-angular";
import {
  AngularFireDatabase,
  FirebaseObjectObservable,
  FirebaseListObservable
} from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase/app";
import { Facebook } from "@ionic-native/facebook";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { ProfilePage } from "../profile/profile";
import { ViewChild } from "@angular/core/";
import { Slides } from "ionic-angular/components/slides/slides";
import { editingProfilePage } from "../editingProfile/editingProfile";
import { IdolApiProvider } from "../../providers/apiProvider";

@Component({
  selector: "page-appIntro",
  templateUrl: "appIntro.html"
})
export class AppIntroPage {
  @ViewChild(Slides) slides: Slides;
  appuserid: any;
  totalOnlineNum = 0;
  // private authState: Observable<firebase.User>;
  // private currentUser: firebase.User;
  tabBarElement: any;
  currentIndex: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private afDB: AngularFireDatabase,
    private fb: Facebook,
    private iab: InAppBrowser,
    public apiProvider: IdolApiProvider,
    private platform: Platform
  ) {
    this.appuserid = navParams.get("appuserid");
    console.log(this.appuserid);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad Login");
  }

  clickLogin() {
    this.currentIndex = this.slides.getActiveIndex();
    if (this.currentIndex == 0) {
      this.slides.slideTo(1, 500);
    } else {
      if (localStorage.getItem("viewTutorial")) {
        this.navCtrl.push(editingProfilePage, { appuserid: this.appuserid });
      } else {
        this.navCtrl.popToRoot();
      }
    }
  }

  slideChanged() {
    this.currentIndex = this.slides.getActiveIndex();
    console.log("Current index is", this.currentIndex);
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

  ionViewWillEnter() {
    let tabs = document.querySelectorAll(".show-tabbar");
    if (tabs !== null) {
      Object.keys(tabs).map(key => {
        tabs[key].style.display = "none";
      });
    }
  }

  ionViewWillLeave() {
    let tabs = document.querySelectorAll(".show-tabbar");
    if (tabs !== null) {
      Object.keys(tabs).map(key => {
        tabs[key].style.display = "flex";
      });
    }
  }
}
