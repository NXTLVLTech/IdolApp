import { Component } from "@angular/core";
import { NavController, NavParams, Platform, Events } from "ionic-angular";
import { ProfilePage } from "../profile/profile";
import { ContactListPage } from "../contact-list/contact-list";
import { SettingsPage } from "../settings/settings";
import { IdolApiProvider } from "../../providers/apiProvider";
import { FcmProvider } from "../../providers/fcm";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  ProfilePage = ProfilePage;
  EditingProfilePage = SettingsPage;
  //PlacePage
  ContactListPage = ContactListPage;

  mainParams = { appuserid: "", appusername: "" };
  onlineTime: any;
  isupdateTime = "NO";
  tabBarElement: any;
  defaulSelectedIndex: any;
  newContactGarbage = 0;

  pushToken: any;

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public apiProvider: IdolApiProvider,
    public events: Events,
    public fcmProvider: FcmProvider,
    public platform: Platform
  ) {
    this.listenEvents();

    this.mainParams.appuserid = params.get("appuserid");

    if (this.mainParams.appuserid == null) {
      this.mainParams.appuserid = localStorage.getItem("appuserid");
    }

    this.apiProvider.get_contact_list(this.mainParams.appuserid).subscribe(
      res => {
        if (res.success == true) {
          console.log(res.data);
          let temp = res.data;
          temp.forEach(contact => {
            if (parseInt(contact.totalcontact) >= 1) {
            } else {
              this.newContactGarbage++;
            }
          });
        }
      },
      err => {}
    );
    // this.mainParams.appusername = params.get('appusername');
    this.defaulSelectedIndex = 1;
    console.log("monika first change");
    this.platform.ready().then(() => {
      this.fcmProvider.userid = this.mainParams.appuserid;
      this.fcmProvider.getToken();
      // Listen to incoming messages
      this.fcmProvider
        .listenToNotifications()
        .map(msg => {
          console.log(msg);
        })
        .subscribe();

      this.platform.pause.subscribe(() => {
        localStorage.setItem("startTime", this.onlineTime);
        localStorage.setItem("endTime", this.getDateTime());
        localStorage.setItem("status", "NO");
        console.log("offline time Saved");
      });
      this.platform.resume.subscribe(() => {
        let startTime = localStorage.getItem("startTime");
        let endTime = localStorage.getItem("endTime");
        this.apiProvider
          .add_offlinetime(this.mainParams.appuserid, startTime, endTime)
          .subscribe(
            res => {
              if (res.success == 1) {
                console.log("added offline time");
              }
            },
            err => {}
          );

        this.apiProvider
          .add_onlinetime(this.mainParams.appuserid, this.getDateTime())
          .subscribe(
            res => {
              console.log("onlinetime sucess", res);
              if (res.success == 1) {
                this.onlineTime = res.startTime;
                console.log("onlinetime sucess", this.onlineTime);
              }
            },
            err => {}
          );
      });
    });
    this.isupdateTime = localStorage.getItem("status");
    if (this.isupdateTime == "NO") {
      let startTime = localStorage.getItem("startTime");
      let endTime = localStorage.getItem("endTime");
      this.apiProvider
        .add_offlinetime(this.mainParams.appuserid, startTime, endTime)
        .subscribe(
          res => {
            if (res.success == 1) {
              console.log("added offline time");
            }
          },
          err => {}
        );

      this.apiProvider
        .add_onlinetime(this.mainParams.appuserid, this.getDateTime())
        .subscribe(
          res => {
            console.log("onlinetime sucess", res);
            if (res.success == 1) {
              this.onlineTime = res.startTime;
              console.log("onlinetime sucess", this.onlineTime);
            }
          },
          err => {}
        );

      localStorage.setItem("status", "YES");
    }
  }

  getDateTime() {
    let d = new Date();
    let date = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    let hour = d.getHours();
    let minute = d.getMinutes();
    let seconds = d.getSeconds();
    let str_month, str_date, str_hour, str_minute, str_sec;
    if (month < 10) {
      month.toString();
      str_month = "0" + month;
    } else {
      str_month = month;
    }
    if (date < 10) {
      date.toString();
      str_date = "0" + date;
    } else {
      str_date = date;
    }
    if (hour < 10) {
      hour.toString();
      str_hour = "0" + hour;
    } else {
      str_hour = hour;
    }
    if (minute < 10) {
      minute.toString();
      str_minute = "0" + minute;
    } else {
      str_minute = minute;
    }
    if (seconds < 10) {
      seconds.toString();
      str_sec = "0" + seconds;
    } else {
      str_sec = seconds;
    }
    let current =
      year +
      "-" +
      str_month +
      "-" +
      str_date +
      " " +
      str_hour +
      ":" +
      str_minute +
      ":" +
      str_sec;
    return current;
  }

  ionViewDidEnter() {
    console.log("Ppppppppp");
    //    this.newContactGarbage = 0 ;
    //    this.apiProvider.get_contact_list(this.mainParams.appuserid).subscribe(res=>{

    //     if (res.success == true)
    //     {
    //       console.log(res.data);
    //       let temp = res.data;
    //       temp.forEach(contact=>{
    //         if(parseInt(contact.totalcontact) > 1)
    //         {
    //         }else {
    //           this.newContactGarbage++;
    //         }

    //       });
    //     }

    //  }, err=>{});
  }

  listenEvents() {
    this.events.subscribe("reloadGarbage", () => {
      console.log("Ppppppppp");

      this.apiProvider.get_contact_list(this.mainParams.appuserid).subscribe(
        res => {
          this.newContactGarbage = 0;
          if (res.success == true) {
            console.log(res.data);
            let temp = res.data;
            temp.forEach(contact => {
              if (parseInt(contact.totalcontact) >= 1) {
              } else {
                this.newContactGarbage++;
              }
            });
          }
        },
        err => {}
      );
    });
  }
}
