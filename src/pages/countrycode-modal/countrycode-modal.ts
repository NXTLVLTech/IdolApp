import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { IdolApiProvider } from "../../providers/apiProvider";
import { ViewController } from "ionic-angular/navigation/view-controller";

@IonicPage()
@Component({
  selector: "page-countrycode-modal",
  templateUrl: "countrycode-modal.html"
})
export class CountrycodeModalPage {
  countrylist = [];
  initCountrylist = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private view: ViewController,
    private apiProvider: IdolApiProvider
  ) {
    this.loadCountryList();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad CountrycodeModalPage");
  }

  loadCountryList() {
    this.apiProvider.loadCountryCodes().subscribe(
      res => {
        console.log(res);
        for (const key in res) {
          let country = res[key];
          let countryCode = "(" + country.dial_code + ") " + country.name;
          this.countrylist.push({
            flag: key.toLocaleLowerCase(),
            info: countryCode,
            name: country.name,
            code: country.dial_code
          });
          console.log(key);
        }

        this.countrylist.sort(function(a, b) {
          var nameA = a.name.toUpperCase();
          var nameB = b.name.toUpperCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        this.initCountrylist = this.countrylist;
      },
      err => {
        console.log(err);
      }
    );
  }

  filter(ev: any) {
    console.log("filer called");
    // Reset items back to all of the items

    this.countrylist = this.initCountrylist;
    // set val to the value of the searchbar
    let val = ev.target.value;
    console.log("Val ->", val);

    // if the value is an empty string don't filter the items
    if (val && val.trim() != "") {
      this.countrylist = this.countrylist.filter(contact => {
        return contact.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    }
  }

  cancel() {
    const data = {
      isSelected: "no"
    };
    this.view.dismiss(data);
  }
  selectCountry(country) {
    const data = {
      isSelected: "yes",
      code: country.code
    };
    this.view.dismiss(data);
  }
}
