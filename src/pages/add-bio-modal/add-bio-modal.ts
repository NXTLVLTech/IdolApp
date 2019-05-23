import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-add-bio-modal",
  templateUrl: "add-bio-modal.html"
})
export class AddBioModalPage {
  socialData: any;
  social_link: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.social_link = "";
    this.socialData = navParams.get("data");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad AddSocialModalPage");
  }

  save() {
    this.viewCtrl.dismiss(this.social_link);
  }

  cancel() {
    this.viewCtrl.dismiss("");
  }
}
