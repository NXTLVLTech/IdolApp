import { Component } from "@angular/core";
import {
  App,
  NavController,
  NavParams,
  AlertController,
  ActionSheetController,
  ViewController,
  ModalOptions,
  Modal,
  ModalController
} from "ionic-angular";
import { unescapeIdentifier } from "@angular/compiler";
import * as firebase from "firebase/app";
import {
  AngularFireDatabase,
  FirebaseObjectObservable
} from "angularfire2/database";
import { Button } from "ionic-angular/components/button/button";
import { Platform } from "ionic-angular/platform/platform";

import { Facebook } from "@ionic-native/facebook";
import { SocialSharing } from "@ionic-native/social-sharing";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";
import { InAppBrowser } from "@ionic-native/in-app-browser";

import { FullscreenPage } from "../fullscreen/fullscreen";
import { ProfilePage } from "../profile/profile";
import { ContactListPage } from "../contact-list/contact-list";
import { IdolApiProvider } from "../../providers/apiProvider";
import { AppIntroPage } from "../appIntro/appIntro";
import { LoginPage } from "../login/login";
import { AddHometownPage } from "../add-hometown/add-hometown";
import { AddBioModalPage } from "../add-bio-modal/add-bio-modal";
import { AddSocialModalPage } from "../add-social-modal/add-social-modal";
import { NotificationPage } from "../notification/notification";

import { LoadingProvider } from "../../providers/loading";

declare var photoeditor_tool: any;

@Component({
  selector: "page-settings",
  templateUrl: "settings.html"
})
export class SettingsPage {
  modalOptions: ModalOptions = {
    enableBackdropDismiss: false,
    cssClass: "code-modal"
  };
  profilepic: string;
  pageChanged: boolean = false;
  profile: string = "";
  name: string = "";
  email: string;
  location: string = "";
  website: string = "";
  birthday: string = "";
  phone: string = "";
  fbname: string = "";

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
  totalOnlineNum = 0;

  fbLink: string;
  shareFacebook: boolean = true;

  youtubeLink: string;
  shareYoutube: boolean = true;

  pinterestLink: string;
  sharePinterest: boolean = true;

  soundcloudLink: string;
  shareSoundcloud: boolean = true;
  appuserid: any;
  appusername: any;
  openMenu = false;
  base64Image: string;

  constructor(
    public navCtrl: NavController,
    private app: App,
    private afDB: AngularFireDatabase,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public apiProvider: IdolApiProvider,
    private iab: InAppBrowser,
    private fb: Facebook,
    private socialSharing: SocialSharing,
    private actionSheetCtrl: ActionSheetController,
    private transfer: FileTransfer,
    private file: File,
    private modal: ModalController,
    private platform: Platform,
    public loadingProvider: LoadingProvider
  ) {
    this.tabBarElement = document.querySelector(".tabbar.show-tabbar");
    this.appuserid = navParams.get("appuserid");
    if (this.appuserid == "" || this.appuserid != null) {
      this.appuserid = localStorage.getItem("appuserid");
    }
    // if(this.fbname == null || this.fbname == '')
    // {
    //     this.fbname = localStorage.getItem('username');
    // }
    // this.settingProfileRefresh();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad Settings");
    this.settingProfileRefresh();
  }

  ionViewWillEnter() {
    // this.tabBarElement.style.display = 'flex';
    // this.tabBarElement.select(1);
    console.log("ionViewDidLoad Settings");
  }

  ionViewWillLeave() {
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
              this.settingProfileRefresh();
              this.navCtrl.pop();
            }
          },
          {
            text: "Yes",
            handler: () => {
              console.log("Save clicked");
              this.save();
              this.settingProfileRefresh();
            }
          }
        ]
      });
      alert.present();
    }
  }

  saveFunction() {
    let alert = this.alertCtrl.create({
      title: "Save Changes?",
      message: "You have changed your profile.",
      buttons: [
        {
          text: "No",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
            this.settingProfileRefresh();
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
  save() {
    console.log("Save triggered");
    // call firebase to save information
    console.log("Twitter user", this.twitterLink);

    // firebase.database().ref().child('users').child(this.fbUser.uid).set({
    let updateData = {
      userid: this.appuserid,
      username: this.fbname,
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
    console.log("?????????", updateData);

    this.apiProvider.update_appuser_profile(updateData).subscribe(
      res => {
        if (res.success == 1) {
          console.log("Sucess: send email");
          console.log(this.appuserid);
          this.pageChanged = false;
          this.settingProfileRefresh();
        }
      },
      err => {
        console.log("Error: send email");
      }
    );
    //this.navCtrl.pop();
    // this.navCtrl.setRoot(ProfilePage,{fbUser:this.fbUser});
  }

  fullPic(pic) {
    this.navCtrl.push(FullscreenPage, { pic: pic, currentuid: this.appuserid });
  }
  photoOption() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Option",
      buttons: [
        {
          text: "View Photo",
          handler: () => {
            this.fullPic(this.profilepic);
          }
        },
        {
          text: "Change Photo",
          handler: () => {
            console.log("bbb");
            this.changePhoto();
          }
        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {}
        }
      ]
    });
    actionSheet.present();
  }

  changePhoto() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "SELECT",
      buttons: [
        {
          text: "Take Capture",
          handler: () => {
            photoeditor_tool.takeCamera(
              "Take Capture",
              data => {
                if (data == null || data == "") {
                } else {
                  console.log(data);
                  this.profilepic = data;
                  //  this.getBase64ImageFromURL(data).subscribe(base64data => {
                  //    console.log(base64data);
                  //    this.base64Image = 'data:image/jpg;base64,'+base64data;
                  //    this.fileupload();
                  //  });
                  this.fileupload(data);
                }
              },
              err => {
                // An error occurred
                alert(JSON.stringify(err));
              }
            );
          }
        },
        {
          text: "Add From Library",
          handler: () => {
            photoeditor_tool.takeLibrary(
              "Take Library",
              data => {
                if (data == null || data == "") {
                } else {
                  console.log(data);
                  this.profilepic = data;
                  // this.getBase64ImageFromURL(data).subscribe(base64data => {
                  //   // console.log(base64data);
                  //   this.base64Image = 'data:image/jpg;base64,'+base64data;
                  //   this.fileupload();
                  // });
                  this.fileupload(data);
                }
              },
              err => {
                // An error occurred
                alert(JSON.stringify(err));
              }
            );
          }
        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {}
        }
      ]
    });
    actionSheet.present();
  }

  fileupload(url: string) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    let uploadURL =
      "https://www.idolapp.co/admin/api/mobileappuser_profile_upload.php";

    let options: FileUploadOptions = {
      fileKey: "file",
      fileName: url,
      mimeType: "image/jpg"
    };

    fileTransfer.upload(url, uploadURL, options).then(
      data => {
        console.log("SUCCESS: " + JSON.stringify(data.response));
        let res = JSON.parse(JSON.stringify(data.response));
        if (res.success == 1) {
          console.log("File upload Success");
          this.profilepic = res.photourl;
        } else {
          console.log("Failed ");
        }
      },
      err => {
        // error
        console.log("Faile: " + JSON.stringify(err.response));
      }
    );
  }
  ////////////////---------Base64Image File upload--------------////////////////
  // getBase64ImageFromURL(url: string) {
  //   return Observable.create((observer: Observer<string>) => {
  //     let img = new Image();
  //     img.crossOrigin = 'Anonymous';
  //     img.src = url;
  //     if (!img.complete) {
  //       img.onload = () => {
  //         observer.next(this.getBase64Image(img));
  //         observer.complete();
  //       };
  //       img.onerror = (err) => {
  //         observer.error(err);
  //       };
  //     } else {
  //       observer.next(this.getBase64Image(img));
  //       observer.complete();
  //     }
  //   });
  // }

  // getBase64Image(img: HTMLImageElement) {
  //   var canvas = document.createElement("canvas");
  //   canvas.width = img.width;
  //   canvas.height = img.height;
  //   var ctx = canvas.getContext("2d");
  //   ctx.drawImage(img, 0, 0);
  //   var dataURL = canvas.toDataURL("image/png");
  //   return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  // }

  // fileupload()
  // {
  //   this.apiProvider.uploadProfilePhoto(this.base64Image).subscribe(res => {

  //     if (res.success == 1)
  //     {
  //       console.log("Success File Upload");
  //       console.log(res.photourl);
  //       this.profilepic = res.photourl;

  //     }
  //   }, err=> {
  //     console.log("Error: send email");
  //   });
  // }
  ////////////////---------Base64Image File upload--------------////////////////

  swipeLeft() {
    //   this.navCtrl.push(ContactListPage, {fbUser: this.fbUser},{animate: true, direction: 'forward'});
    this.navCtrl.parent.select(1);
  }

  swipeRight() {
    //  this.navCtrl.push(ProfilePage, {fbUser: this.fbUser},{animate: true, direction: 'backward'});
    //  this.navCtrl.parent.select(0);
  }

  settingProfileRefresh() {
    this.loadingProvider.show();
    var that = this;
    this.apiProvider.get_appuser_profile(this.appuserid).subscribe(
      res => {
        setTimeout(function() {
          that.loadingProvider.hide();
        }, 350);
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
          this.fbname = data.username;
          this.email = data.email;

          this.profile = data.profile == null ? "" : data.profile;
          this.location = data.hometown == null ? "" : data.hometown;
          this.website = data.website == null ? "" : data.website;

          this.birthday = data.birthday == null ? "" : data.birthday;

          this.phone = data.phone == null ? "" : data.phone;

          this.twitterLink =
            data.twitterurl == null || data.twitterurl == "undefined"
              ? ""
              : data.twitterurl;
          this.instagramLink =
            data.instagramurl == null || data.instagramurl == "undefined"
              ? ""
              : data.instagramurl;
          this.snapchatLink =
            data.snapchaturl == null || data.snapchaturl == "undefined"
              ? ""
              : data.snapchaturl;
          this.linkedinLink =
            data.linkedinurl == null || data.linkedinurl == "undefined"
              ? ""
              : data.linkedinurl;

          this.fbLink =
            data.fb_link == null || data.fb_link == "undefined"
              ? ""
              : data.fb_link;

          console.log("Victor Tan " + this.fbLink);

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
          } else {
            this.shareBirthday = data.sharebirthday == "true" ? true : false;
          }

          if (this.phone == "") {
            this.sharePhone = false;
          } else {
            this.sharePhone = data.sharephone == "true" ? true : false;
          }

          if (data.email == "") {
            this.shareEmail = false;
          } else {
            this.shareEmail = data.shareemail == "true" ? true : false;
          }

          if (this.location == "") {
            this.shareLocation = false;
          } else {
            this.shareLocation = data.sharehometown == "true" ? true : false;
          }

          if (this.website == "") {
            this.shareWebsite = false;
          } else {
            this.shareWebsite = data.sharewebsite == "true" ? true : false;
          }

          if (this.twitterLink == "") {
            this.shareTwitter = false;
          } else {
            this.shareTwitter = data.sharetwitter == "true" ? true : false;
          }

          if (this.instagramLink == "") {
            this.shareInstagram = false;
          } else {
            this.shareInstagram = data.shareinstagram == "true" ? true : false;
          }

          if (this.snapchatLink == "") {
            this.shareSnapchat = false;
          } else {
            this.shareSnapchat = data.sharesnapchat == "true" ? true : false;
          }

          if (this.linkedinLink == "") {
            this.shareLinkedin = false;
          } else {
            this.shareLinkedin = data.sharelinkedin == "true" ? true : false;
          }

          if (this.fbLink == "") {
            this.shareFacebook = false;
          } else {
            this.shareFacebook = data.sharefb == "true" ? true : false;
          }

          if (this.youtubeLink == "") {
            this.shareYoutube = false;
          } else {
            this.shareYoutube = data.shareyoutube == "true" ? true : false;
          }

          if (this.pinterestLink == "") {
            this.sharePinterest = false;
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

          // this.sharePhone = (data.sharephone == 'true') ? true : false;
          // this.shareEmail = (data.shareemail == 'true') ? true : false;
          // this.shareLocation = (data.sharehometown == 'true') ? true : false;
          // this.shareWebsite = (data.sharewebsite == 'true') ? true : false;
          // this.shareTwitter = (data.sharetwitter == 'true') ? true : false;
          // this.shareInstagram = (data.shareinstagram == 'true') ? true :false;
          // this.shareSnapchat = (data.sharesnapchat == 'true') ? true : false;
          // this.shareLinkedin = (data.sharelinkedin == 'true') ? true : false;

          // if (this.name == '')
          // {
          //   let alert = this.alertCtrl.create({
          //     title: 'Warnning',
          //     subTitle: "Oops, this account name isn't correct. Please input name.",
          //     buttons: ['Ok']
          //   });
          //   alert.present();
          // }

          // if (this.email == '')
          // {
          //   let alert = this.alertCtrl.create({
          //     title: 'Warnning',
          //     subTitle: "Oops, this account email isn't correct. Please input email.",
          //     buttons: ['Ok']
          //   });
          //   alert.present();
          // }

          // if (this.twitterLink == '')
          // {
          //   let alert = this.alertCtrl.create({
          //     title: 'Twitter',
          //     subTitle: "<b><P>Warning</p></b>Oops, twitter account isn't correct.",
          //     buttons: ['Ok']
          //   });
          //   alert.present();
          // }

          // if (this.linkedinLink == '')
          // {
          //   let alert = this.alertCtrl.create({
          //         title: 'Linkedin',
          //         subTitle: "<b><P>Warning</p></b>Oops, linkedin account isn't correct.",
          //         buttons: ['Ok']
          //       });
          //       alert.present();
          // }

          // if (this.instagramLink == '')
          // {
          //   let alert = this.alertCtrl.create({
          //         title: 'Instagram',
          //         subTitle: "<b><P>Warning</p></b>Oops, instagram account isn't correct.",
          //         buttons: ['Ok']
          //       });
          //       alert.present();
          // }

          // if (this.snapchatLink == '')
          // {
          //   let alert = this.alertCtrl.create({
          //         title: 'Snapchat',
          //         subTitle: "<b><P>Warning</p></b>Oops, snapchat account isn't correct.",
          //         buttons: ['Ok']
          //       });
          //       alert.present();
          // }
        } else {
        }
      },
      err => {
        this.loadingProvider.hide();
        console.log("Error: send email");
      }
    );
  }

  togglePopupMenu() {
    return (this.openMenu = !this.openMenu);
  }

  goToLogout() {
    this.fb
      .getLoginStatus()
      .then(res => {
        console.log("my login information");
        console.log(res);
        if (res.status === "connected") {
          this.fb.logout();
        }
      })
      .catch(e => console.log(e));

    localStorage.removeItem("appuserid");
    localStorage.removeItem("photourl");
    localStorage.removeItem("username");
    this.app.getRootNav().setRoot(LoginPage);

    this.togglePopupMenu();
  }

  goToWebsite() {
    this.platform.ready().then(() => {
      this.iab.create("http://idolapp.co/", "_system", "location=true");
    });
    this.togglePopupMenu();
  }

  goToTerms() {
    this.platform.ready().then(() => {
      this.iab.create("http://idolapp.co/", "_system", "location=true");
    });
    this.togglePopupMenu();
  }

  goToPolicy() {
    this.platform.ready().then(() => {
      this.iab.create("http://idolapp.co/", "_system", "location=true");
    });
    this.togglePopupMenu();
  }

  goToTutorial() {
    localStorage.removeItem("viewTutorial");
    this.navCtrl.push(
      AppIntroPage,
      { appuserid: this.appuserid },
      { animate: true, direction: "forward" }
    );
    this.togglePopupMenu();
  }

  goToShare() {
    var options = {
      message:
        "I love Idol App. Please download it here https://itunes.apple.com/us/app/idolapp/id1239115397?ls=1&mt=8", // not supported on some apps (Facebook, Instagram)
      subject: "Idol App", // fi. for email
      files: ["", ""], // an array of filenames either locally or remotely
      url: "https://idolapp.co/",
      chooserTitle: "Idol" // Android only, you can override the default share sheet title
    };

    var onSuccess = function(result) {
      console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
      console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
    };

    var onError = function(msg) {
      console.log("Sharing failed with message: " + msg);
    };

    this.socialSharing
      .shareWithOptions(options)
      .then(() => {
        console.log("Share completed? "); // On Android apps mostly return false even while it's true
        console.log("Shared to app: "); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
      })
      .catch(() => {
        console.log("Sharing failed with message: ");
      });

    this.togglePopupMenu();
  }

  share() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "IDOL APP",
      buttons: [
        {
          text: "Share via FaceBook",
          handler: () => {
            console.log("Facebook Sharing selected");
            this.socialSharing
              .shareViaFacebook(
                "I love Idol App. Please download it here https://itunes.apple.com/us/app/idolapp/id1239115397?ls=1&mt=8",
                " ",
                " "
              )
              .then(() => {
                // Success!
                console.log("Facebook Share");
              })
              .catch(() => {
                // Error!
                console.log("Facebook Share Error");
              });
          }
        },
        {
          text: "Share via Twitter",
          handler: () => {
            console.log("Twitter Sharing selected");
            this.socialSharing
              .shareViaTwitter(
                "I love Idol App. Please download it here https://itunes.apple.com/us/app/idolapp/id1239115397?ls=1&mt=8",
                " ",
                " "
              )
              .then(() => {
                // Success!
                console.log("Twitter Share");
              })
              .catch(() => {
                // Error!
                console.log("Twitter Sharing selected");
              });
          }
        },
        {
          text: "Share via Email",
          // role: 'destructive',
          handler: () => {
            console.log("Email Sharing selected");
            // Check if sharing via email is supported
            this.socialSharing
              .canShareViaEmail()
              .then(() => {
                // Sharing via email is possible
                this.socialSharing
                  .shareViaEmail(
                    "I love Idol App. Please download it here https://itunes.apple.com/us/app/idolapp/id1239115397?ls=1&mt=8",
                    "Idol App",
                    [""]
                  )
                  .then(() => {
                    // Success!
                  })
                  .catch(() => {
                    // Error!
                  });
              })
              .catch(() => {
                // Sharing via email is not possible
                alert("Email client is not setup on your phone");
              });
          }
        },
        {
          text: "Share via SMS",
          handler: () => {
            console.log("SMS Sharing selected");
            this.socialSharing
              .shareViaSMS(
                "I love Idol App. Please download it here https://itunes.apple.com/us/app/idolapp/id1239115397?ls=1&mt=8",
                " "
              )
              .then(() => {
                // Success!
              })
              .catch(() => {
                // Error!
              });
          }
        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    actionSheet.present();
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
      {},
      this.modalOptions
    );
    bioModal.present();
    bioModal.onDidDismiss(profile => {
      if (profile) this.profile = profile;
    });
  }

  goNotification() {
    this.navCtrl.push(NotificationPage);
  }
}
