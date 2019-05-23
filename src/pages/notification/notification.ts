import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { IdolApiProvider } from '../../providers/apiProvider';
import { QrScanPage} from '../qr-scan/qr-scan';
import { ChatPage } from '../chat/chat';

/**
 * Generated class for the NotificationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  phone = "";
  listRequests = [];
  listMessages = [];
  appuserid: any;
  loading: any;
  type: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public apiProvider: IdolApiProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter NotificationPage');
    this.appuserid = localStorage.getItem('appuserid');
    this.type = 'friend_requests';
    this.loadData();
  }

  loadData() {
    this.showLoading();
    this.apiProvider.checkNotifications(this.appuserid, true).subscribe(res=>{
      if (res.success == 1){
        this.listRequests = res.friendrequests;
        this.listMessages = res.newmessages;
      }
      this.hideLoading();  
    }, err=>{
      this.listRequests = [];
      this.listMessages = [];
      this.hideLoading();  
    });
  }

  gotoChat(contact) {
    this.navCtrl.push(ChatPage, {appuserid:this.appuserid, appusername: contact.toUserName, userAvatar: contact.toUserAvatar, contactid:contact.UserId, touser_name: contact.UserName,touser_Avatar:contact.UserAvatar, mode:'Chat'});
  }
  goProfile(item) {
    this.navCtrl.push(QrScanPage, {appuserid:this.appuserid, contactid:item.userid, mode:'view'});
  }

  confirm(item, i) { 
    this.showLoading();
    let contactid = item.userid;
    this.apiProvider.qrcode_contact(this.appuserid, contactid).subscribe(res=>{
      this.hideLoading();   
      if (eval(res.success) == 1) {     
        this.listRequests.splice(i, 1);
      } else {
        this.showAlert("Error", res.data);
      }
    }, err=> {
      this.hideLoading();
      console.log(err);
    });
  }

  delete(item, i) { 
    this.showLoading();
    let contactid = item.userid;
    this.apiProvider.contact_del(contactid, this.appuserid).subscribe(res=>{
      this.hideLoading();
      if (eval(res.success) == 1) {
        this.listRequests.splice(i, 1);
      } else {
        this.showAlert("Error", res.data);
      }
    }, err=> {
      this.hideLoading();
      console.log(err);
    });
  }

  showAlert(title, msg) {
    let alert = this.alertCtrl.create({
      title: title,
      message: msg,
      buttons:['Ok']
    });
    alert.present();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: ""
    })
    this.loading.present();
  }
  hideLoading() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }
}
