import { Component } from "@angular/core";
import { Platform, App } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Keyboard } from "@ionic-native/keyboard";
import { ScreenOrientation } from "@ionic-native/screen-orientation";

import { LoginPage } from "../pages/login/login";
import { VerifyPage } from "../pages/verify/verify";
import { IdolApiProvider } from "../providers/apiProvider";
import { HomePage } from "../pages/home/home";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  rootPage: any = LoginPage;

  constructor(
    app: App,
    platform: Platform,
    keyboard: Keyboard,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    apiProvider: IdolApiProvider,
    private screenOrientation: ScreenOrientation
  ) {
    platform.ready().then(() => {
      localStorage.setItem("appuserid", "fb_257047298158876");
      // localStorage.setItem('appuserid', 'ps_1542815441');
      // localStorage.setItem('appuserid', 'fb_10209158896198818');

      // localStorage.setItem('appuserid', 'fb_280562055812096');
      // localStorage.removeItem('appuserid');
      let appuserid = localStorage.getItem("appuserid");

      if (!appuserid) {
        apiProvider.get_appuser_profile(appuserid).subscribe(
          res => {
            if (res.success == 1) {
              let dataArray = res.data;
              let data = dataArray[0];
              if (data.isVerified == "yes") {
                this.rootPage = HomePage;
              } else {
                this.rootPage = VerifyPage;
              }
            }
          },
          err => {}
        );
      }
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.hide(); // styleDefault();
      splashScreen.hide();
      keyboard.hideFormAccessoryBar(false);
      if (platform.is("cordova")) {
        screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      }
    });
  }
}
