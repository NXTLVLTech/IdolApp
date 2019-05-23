import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  AlertController,
  ModalOptions,
  Modal,
  ModalController
} from "ionic-angular";
import * as firebase from "firebase/app";
import {
  AngularFireDatabase,
  FirebaseObjectObservable
} from "angularfire2/database";
import { FullscreenPage } from "../fullscreen/fullscreen";
import { ProfilePage } from "../profile/profile";
import { Button } from "ionic-angular/components/button/button";
import { Platform } from "ionic-angular/platform/platform";
import { HomePage } from "../home/home";
import { IdolApiProvider } from "../../providers/apiProvider";
import { AddHometownPage } from "../add-hometown/add-hometown";
import { AddBioModalPage } from "../add-bio-modal/add-bio-modal";
import { AddSocialModalPage } from "../add-social-modal/add-social-modal";
import { FcmProvider } from "../../providers/fcm";

@Component({
  selector: "page-editingProfile",
  templateUrl: "editingProfile.html"
})
export class editingProfilePage {
  fbUser: any;
  profilepic: string;
  pageChanged: boolean = false;
  profile: string = "";
  name: string = "";
  email: string;
  location: string = "";
  website: string = "";
  birthday: string = "";
  phone: string = "";

  shareBirthday: boolean = true;
  sharePhone: boolean = true;
  shareEmail: boolean = true;
  shareLocation: boolean = true;
  shareWebsite: boolean = true;

  shareTwitter: boolean = true;
  shareInstagram: boolean = true;
  shareSnapchat: boolean = true;
  shareLinkedin: boolean = true;

  twitterLink: string;
  instagramLink: string;
  snapchatLink: string;
  linkedinLink: string;
  tabBarElement: any;

  fbLink: string;
  shareFacebook: boolean = true;

  youtubeLink: string;
  shareYoutube: boolean = true;

  pinterestLink: string;
  sharePinterest: boolean = true;

  soundcloudLink: string;
  shareSoundcloud: boolean = true;

  totalOnlineNum = 0;
  appuserid: any;
  toggle_switch_on = "assets/icon/toggle-switch-on.png";
  toggle_switch_off = "assets/icon/toggle-switch-off.png";
  modalOptions: ModalOptions = {
    enableBackdropDismiss: false,
    cssClass: "code-modal"
  };

  constructor(
    public navCtrl: NavController,
    private afDB: AngularFireDatabase,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public apiProvider: IdolApiProvider,
    private platform: Platform,
    private modal: ModalController,
    public fcmProvider: FcmProvider
  ) {
    console.log("/////////////" + this.tabBarElement);
    this.appuserid = navParams.get("appuserid");

    this.appuserid = localStorage.getItem("appuserid");
    console.log("aaaaa" + this.appuserid);
    this.apiProvider.get_appuser_profile(this.appuserid).subscribe(
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
          console.log("User record found");
          this.profilepic = data.photourl;
          this.name = data.username;

          this.email = data.email;

          this.profile = data.profile == null ? "" : data.profile;
          this.location = data.hometown == null ? "" : data.hometown;
          this.website = data.website == null ? "" : data.website;

          this.birthday = data.birthday == null ? "" : data.birthday;

          this.phone = data.phone == null ? "" : data.phone;

          this.twitterLink = data.twitterurl == null ? "" : data.twitterurl;
          this.instagramLink =
            data.instagramurl == null ? "" : data.instagramurl;
          this.snapchatLink = data.snapchaturl == null ? "" : data.snapchaturl;
          this.linkedinLink = data.linkedinurl == null ? "" : data.linkedinurl;

          this.fbLink =
            data.fb_link == null || data.fb_link == "undefined"
              ? ""
              : data.fb_link;

          this.youtubeLink =
            data.youtubeurl == null || data.youtubeurl == "undefined"
              ? ""
              : data.youtubeurl;
          this.pinterestLink =
            data.pinteresturl == null || data.pinteresturl == "undefined"
              ? ""
              : data.pinteresturl;
          this.soundcloudLink =
            data.soundcloudurl == null || data.soundcloudurl == "undefined"
              ? ""
              : data.soundcloudurl;

          if (this.birthday == "") {
            this.shareBirthday = false;
            console.log("adfasdf");
          } else {
            this.shareBirthday = data.sharebirthday == "true" ? true : false;
          }

          if (this.phone == "") {
            this.sharePhone = false;
            console.log("adfasdf");
          } else {
            this.sharePhone = data.sharephone == "true" ? true : false;
          }

          if (data.email == "") {
            this.shareEmail = false;
            console.log("adfasdf");
          } else {
            this.shareEmail = data.shareemail == "true" ? true : false;
          }

          if (this.location == "") {
            this.shareLocation = false;
            console.log("adfasdf");
          } else {
            this.shareLocation = data.sharehometown == "true" ? true : false;
          }

          if (this.website == "") {
            this.shareWebsite = false;
            console.log("adfasdf");
          } else {
            this.shareWebsite = data.sharewebsite == "true" ? true : false;
          }

          if (this.twitterLink == "") {
            this.shareTwitter = false;
            console.log("adfasdf");
          } else {
            this.shareTwitter = data.sharetwitter == "true" ? true : false;
          }

          if (this.instagramLink == "") {
            this.shareInstagram = false;
            console.log("adfasdf");
          } else {
            this.shareInstagram = data.shareinstagram == "true" ? true : false;
          }

          if (this.snapchatLink == "") {
            this.shareSnapchat = false;
            console.log("adfasdf");
          } else {
            this.shareSnapchat = data.sharesnapchat == "true" ? true : false;
          }

          if (this.linkedinLink == "") {
            this.shareLinkedin = false;
            console.log("adfasdf");
          } else {
            this.shareLinkedin = data.shareLinkedin == "true" ? true : false;
          }

          if (this.fbLink == "") {
            this.shareFacebook = false;
            console.log("adfasdf");
          } else {
            this.shareFacebook = data.sharefb == "true" ? true : false;
          }

          if (this.youtubeLink == "") {
            this.shareYoutube = false;
            console.log("adfasdf");
          } else {
            this.shareYoutube = data.shareyoutube == "true" ? true : false;
          }

          if (this.pinterestLink == "") {
            this.sharePinterest = false;
            console.log("adfasdf");
          } else {
            this.sharePinterest = data.sharepinterest == "true" ? true : false;
          }

          if (this.soundcloudLink == "") {
            this.shareSoundcloud = false;
            console.log("SoundCloud");
          } else {
            this.shareSoundcloud =
              data.sharesoundcloud == "true" ? true : false;
          }
        }
      },
      err => {
        console.log("Error: send email");
      }
    );
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad Settings");
    if (localStorage.getItem("subscribeToTopic") != "1") {
      this.onSubscribeToTopic();
    }
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
    this.back();
  }

  changed() {
    console.log("change triggered");
    this.pageChanged = true;
  }

  back() {
    if (this.pageChanged) {
      let alert = this.alertCtrl.create({
        title: "Save Changes?",
        message: "You have changed your profile.",
        buttons: [
          {
            text: "No",
            role: "cancel",
            handler: () => {
              console.log("Cancel clicked");
              this.navCtrl.pop();
            }
          },
          {
            text: "Yes",
            handler: () => {
              console.log("Save clicked");
              this.save();
            }
          }
        ]
      });
      alert.present();
    }
  }

  save() {
    console.log("Save triggered");
    // call firebase to save information
    console.log("Twitter user", this.twitterLink);
    let updateData = {
      userid: this.appuserid,
      username: this.name,
      email: this.email,
      profile: this.profile,
      photourl: this.profilepic,
      shareemail: this.shareEmail,
      birthday: this.birthday,
      sharebirthday: this.shareBirthday,
      phone: this.phone,
      sharephone: this.sharePhone,
      hometown: this.location,
      sharehometown: this.shareLocation,
      website: this.website,
      sharewebsite: this.shareWebsite,
      twitterurl: this.twitterLink,
      sharetwitter: this.shareTwitter,
      instagramurl: this.instagramLink,
      shareinstagram: this.shareInstagram,
      linkedinurl: this.linkedinLink,
      sharelinkedin: this.shareLinkedin,
      snapchaturl: this.snapchatLink,
      sharesnapchat: this.shareSnapchat,
      fb_link: this.fbLink,
      sharefb: this.shareFacebook,
      youtubeurl: this.youtubeLink,
      shareyoutube: this.shareYoutube,
      pinteresturl: this.pinterestLink,
      sharepinterest: this.sharePinterest,
      soundcloudurl: this.soundcloudLink,
      sharesoundcloud: this.shareSoundcloud
    };

    var this_callback = this;
    this.apiProvider.update_appuser_profile(updateData).subscribe(
      res => {
        if (res.success == 1) {
          console.log("Sucess: send email");
          console.log(this.appuserid);
          this.pageChanged = false;
          this.navCtrl.setRoot(HomePage, {
            appuserid: this.appuserid,
            appusername: this.name
          });
        }
      },
      err => {
        console.log("Error: send email");
      }
    );
  }

  fullPic(pic) {
    this.navCtrl.push(FullscreenPage, { pic: pic, currentuid: this.appuserid });
  }

  clickskip() {
    this.navCtrl.setRoot(HomePage, {
      appuserid: this.appuserid,
      appusername: this.name
    });
    //  this.navCtrl.popToRoot();
  }

  openSocialModal(shareCase, override = 0) {
    console.log(shareCase);
    let show_modal = false;
    let modalData = {};
    switch (shareCase) {
      case "Facebook":
        if (this.shareFacebook == true) {
          show_modal = true;
          modalData = {
            icon: "socialFacebook.png",
            title: "Facebook Account",
            description:
              "Please provide your Facebook user id to save in your profile<br><br>www.facebook.com/<a>name123</a>",
            placeholder: "Facebook User",
            link: this.fbLink
          };
        }
        break;
      case "Youtube":
        if (this.shareYoutube == true) {
          show_modal = true;
          modalData = {
            icon: "youtube-icon.png",
            title: "Youtube Account",
            description:
              "Please provide your Youtube user id to save in your profile<br><br>https://www.youtube.com/appID",
            placeholder: "Youtube User",
            link: this.youtubeLink
          };
        }
        break;
      case "Twitter":
        if (this.shareTwitter == true) {
          show_modal = true;
          modalData = {
            icon: "socialTwitter.svg",
            title: "Twitter Account",
            description:
              "Please provide your Twitter user id to save in your profile<br><br><b>Ex.@IdolApp</b>",
            placeholder: "Twitter User",
            link: this.twitterLink
          };
        }
        break;
      case "Instagram":
        if (this.shareInstagram == true) {
          show_modal = true;
          modalData = {
            icon: "instagram-icon.png",
            title: "Instagram Account",
            description:
              "Please provide your Instagram user id to save in your profile<br><br>Ex.IdolApp (Use Login Name)",
            placeholder: "Instagram User",
            link: this.instagramLink
          };
        }
        break;
      case "Linkedin":
        if (this.shareLinkedin == true) {
          show_modal = true;
          modalData = {
            icon: "linkedin-icon.png",
            title: "Linkedin Account",
            description:
              "Please provide your Linkedin user id to save in your profile<br><br>www.linkedin.com/in/<a>name123</a>",
            placeholder: "Linkedin User",
            link: this.linkedinLink
          };
        }
        break;
      case "Pinterest":
        if (this.sharePinterest == true) {
          show_modal = true;
          modalData = {
            icon: "pinterest-icon.png",
            title: "Pinterest Account",
            description:
              "Please provide your Pinterest user id to save in your profile<br><br>https://www.pinterest.com/appID",
            placeholder: "Pinterest User",
            link: this.pinterestLink
          };
        }
        break;
      case "Snapchat":
        if (this.shareSnapchat == true) {
          show_modal = true;
          modalData = {
            icon: "snapchat-icon.png",
            title: "Snapchat Account",
            description:
              "Please provide your Snapchat user id to save in your profile<br><br>Ex.IdolApp (Use Login Name)",
            placeholder: "Snapchat User",
            link: this.snapchatLink
          };
        }
        break;
      case "Soundcloud":
        if (this.shareSoundcloud == true) {
          show_modal = true;
          modalData = {
            icon: "soundcloud-icon.png",
            title: "SoundCloud Account",
            description:
              "Please provide your SoundCloud user id to save in your profile<br><br>https://www.soundcloud.com/appID",
            placeholder: "SoundCloud User",
            link: this.soundcloudLink
          };
        }
        break;
    }
    if (show_modal) {
      const socialModal: Modal = this.modal.create(
        AddSocialModalPage,
        { data: modalData },
        this.modalOptions
      );
      socialModal.present();
      socialModal.onDidDismiss(socialLink => {
        if (socialLink || (!socialLink && override)) {
          switch (shareCase) {
            case "Facebook":
              this.fbLink = socialLink;
              break;
            case "Youtube":
              this.youtubeLink = socialLink;
              break;
            case "Twitter":
              this.twitterLink = socialLink;
              break;
            case "Instagram":
              this.instagramLink = socialLink;
              break;
            case "Linkedin":
              this.linkedinLink = socialLink;
              break;
            case "Pinterest":
              this.pinterestLink = socialLink;
              break;
            case "Snapchat":
              this.snapchatLink = socialLink;
              break;
            case "Soundcloud":
              this.soundcloudLink = socialLink;
              break;
          }
          this.save();
        }
      });
    }
  }

  openHometown() {
    const hometownModal: Modal = this.modal.create(
      AddHometownPage,
      this.modalOptions
    );
    hometownModal.present();
    hometownModal.onDidDismiss(data => {
      if (data && data.description) this.location = data.description;
    });
  }

  openWebsite() {
    const websiteData = {
      icon: "website-icon.png",
      title: "Add Website",
      description:
        "Please provide your website link to save in your profile<br><br>https://www.yourwebsite.com",
      placeholder: "Website Link",
      link: this.website
    };
    const websiteModal: Modal = this.modal.create(
      AddSocialModalPage,
      { data: websiteData },
      this.modalOptions
    );
    websiteModal.present();
    websiteModal.onDidDismiss(website => {
      if (website) this.website = website;
    });
  }

  openBio() {
    const bioModal: Modal = this.modal.create(
      AddBioModalPage,
      this.modalOptions
    );
    bioModal.present();
    bioModal.onDidDismiss(profile => {
      if (profile) this.profile = profile;
    });
  }

  onSubscribeToTopic() {
    let alert = this.alertCtrl.create({
      title: "<img src='assets/icon/subscribe-icon.png'>",
      subTitle: "Subscribe to our Newsletter",
      message:
        "Sign up for the latest news, updates and other offers directly to your email.",
      cssClass: "subscribe-alert",
      buttons: [
        {
          text: "Cancel",
          handler: data => {
            localStorage.setItem("subscribeToTopic", "1");
          }
        },
        {
          text: "Subscribe",
          handler: data => {
            localStorage.setItem("subscribeToTopic", "1");
            this.fcmProvider.subscribeToTopic("idol-message");
          }
        }
      ]
    });
    alert.present();
  }
}
