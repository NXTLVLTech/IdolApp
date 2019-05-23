import { Injectable } from "@angular/core";
import { Firebase } from "@ionic-native/firebase";
import { Platform } from "ionic-angular";
import { IdolApiProvider } from "./apiProvider";

@Injectable()
export class FcmProvider {
  devicetype: any;
  userid: any;
  constructor(
    public firebaseNative: Firebase,
    private platform: Platform,
    private apiProvider: IdolApiProvider,
  ) {}

  // Get permission from the user
  async getToken() {
    let token;
    if (this.platform.is("android")) {
      token = await this.firebaseNative.getToken();
      this.devicetype = "android";
    } else if (this.platform.is("ios")) {
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
      this.devicetype = "ios";
    }
    console.log("token:" + token);
    this.apiProvider
      .register_token(this.userid, token, this.devicetype)
      .subscribe(
        res => {
          console.log("token registeration: " + res);
        },
        err => {
          console.log("token status failed");
        }
      );
  }

  async registerFCM() {
    let token;
    if (this.platform.is("android")) {
      token = await this.firebaseNative.getToken();
      this.devicetype = "android";
    } else if (this.platform.is("ios")) {
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
      this.devicetype = "ios";
    }
  }

  // Listen to incoming FCM messages
  listenToNotifications() {
    return this.firebaseNative.onNotificationOpen();
  }

  subscribeToTopic(topic: string) {
    this.firebaseNative.subscribe(topic);
  }
}
