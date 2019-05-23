import { Component, ElementRef, ViewChild } from "@angular/core";
import { IonicPage, NavController, ViewController } from "ionic-angular";
import { Geolocation } from "@ionic-native/geolocation";
import { Observable } from "rxjs/Observable";

declare var google;

@IonicPage()
@Component({
  selector: "page-add-hometown",
  templateUrl: "add-hometown.html"
})
export class AddHometownPage {
  @ViewChild("searchbar", { read: ElementRef }) searchbar: ElementRef;
  addressElement: HTMLInputElement = null;

  hometownIcon = "assets/icon/hometown-list-icon.png";
  townList = [];
  autocomplete: any;
  searchHometown: any;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad AddHometownPage");
    this.autocomplete = new google.maps.places.AutocompleteService();
  }

  searchPlace() {
    if (this.searchHometown) {
      let config = {
        types: ["geocode"],
        input: this.searchHometown
      };
      this.autocomplete.getPlacePredictions(config, (predictions, status) => {
        if (
          status == google.maps.places.PlacesServiceStatus.OK &&
          predictions
        ) {
          this.townList = [];
          predictions.forEach(town => {
            this.townList.push(town);
          });
          console.log("aaa ", this.townList);
        }
      });
    } else {
      this.townList = [];
    }
  }

  selectHometown(selectedTown) {
    this.viewCtrl.dismiss(selectedTown);
  }
}
