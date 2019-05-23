import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular/platform/platform';
import * as firebase from 'firebase/app';
import { IdolApiProvider } from '../../providers/apiProvider';

/**
 * Generated class for the Fullscreen page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-fullscreen',
  templateUrl: 'fullscreen.html',
})

export class FullscreenPage {
  pic: any;
  currentuid:any;
  totalOnlineNum = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, private platform: Platform, public apiProvider:IdolApiProvider) {
     this.pic = navParams.get('pic');
    this.currentuid = navParams.get('currentuid');  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Fullscreen');
  }
  close(){
    this.navCtrl.pop();
  }

}
