import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";

@Injectable()
export class IdolApiProvider {
  public baseURL = "https://www.idolapp.co/admin";
  public notifications: any;
  constructor(public http: Http) {
    console.log("Hello RatingProvider Provider");
  }
  getFormData(item) {
    var form_data = new FormData();
    for (var key in item) {
      console.log("key....." + key);
      console.log("item......" + item[key]);
      form_data.append(key, item[key]);
    }
    return form_data;
  }
  public fb_Login(item) {
    let data = this.getFormData(item);
    let url = this.baseURL + "/api/fbuser_login.php";
    console.log(data);
    console.log(url);

    return this.http.post(url, data).map(response => response.json());
  }

  public google_Login(item) {
    let data = this.getFormData(item);
    let url = this.baseURL + "/api/googleuser_login.php";
    console.log(data);
    console.log(url);

    return this.http.post(url, data).map(response => response.json());
  }

  public e_login(item) {
    let data = this.getFormData(item);
    let url = this.baseURL + "/api/appuser_login.php";
    console.log(data);
    console.log(url);

    return this.http.post(url, data).map(response => response.json());
  }

  public appuserSearch(appuserId, text, field) {
    var form_data = new FormData();

    form_data.append("userid", appuserId);
    form_data.append("text", text);
    form_data.append("field", field);
    let url = this.baseURL + "/api/appusers_list.php";
    return this.http.post(url, form_data).map(response => response.json());
  }

  public checkPhoneNumber(appuserId, phone) {
    var form_data = new FormData();

    form_data.append("userid", appuserId);
    form_data.append("phone", phone);
    let url = this.baseURL + "/api/check_phone.php";
    return this.http.post(url, form_data).map(response => response.json());
  }

  public sendSMSPhone(msg, phone) {
    var form_data = new FormData();

    form_data.append("msg", msg);
    form_data.append("phone", phone);
    let url = this.baseURL + "/api/phoneVerify/sendSms.php";
    return this.http.post(url, form_data).map(response => response.json());
  }

  public e_forgotpassword(useremail) {
    var form_data = new FormData();

    form_data.append("email", useremail);
    let url = this.baseURL + "/api/appuser_fpass.php";
    return this.http.post(url, form_data).map(response => response.json());
  }

  public e_signup(item) {
    let data = this.getFormData(item);
    let url = this.baseURL + "/api/appuser_signup.php";

    return this.http.post(url, data).map(response => response.json());
  }

  public get_appuser_profile(userid) {
    var form_data = new FormData();
    form_data.append("userid", userid);
    let url = this.baseURL + "/api/appuser_get.php";
    console.log(userid);
    console.log(url);

    return this.http.post(url, form_data).map(response => response.json());
  }

  public update_appuser_profile(item) {
    let data = this.getFormData(item);
    let url = this.baseURL + "/api/appuser_update.php";
    return this.http.post(url, data).map(response => response.json());
  }

  public qrcode_contact(userid, contactid, done = "1") {
    var form_data = new FormData();
    form_data.append("id", userid);
    form_data.append("contactid", contactid);
    form_data.append("done", done);
    let url = this.baseURL + "/api/qrcode_contact.php";

    return this.http.post(url, form_data).map(response => response.json());
  }

  public connectnum_update(userid, contactid) {
    var form_data = new FormData();
    form_data.append("id", userid);
    form_data.append("contactid", contactid);
    let url = this.baseURL + "/api/connectnum_update.php";

    return this.http.post(url, form_data).map(response => response.json());
  }

  public totalcontact_update(userid) {
    var form_data = new FormData();
    form_data.append("id", userid);
    let url = this.baseURL + "/api/totalconnectnum_update.php";
    return this.http.post(url, form_data).map(response => response.json());
  }

  public contact_del(userid, contactid) {
    var form_data = new FormData();
    form_data.append("userid", userid);
    form_data.append("contactid", contactid);
    let url = this.baseURL + "/api/contact_del.php";
    return this.http.post(url, form_data).map(response => response.json());
  }

  public checkNotifications(userid, fulldata = false) {
    var form_data = new FormData();
    form_data.append("userid", userid);
    if (fulldata) {
      form_data.append("fulldata", "1");
    }
    let url = this.baseURL + "/api/check_notifications.php";
    return this.http.post(url, form_data).map(response => response.json());
  }

  public get_contact_list(userid, isRequest = "0") {
    var form_data = new FormData();
    form_data.append("userid", userid);
    form_data.append("isRequest", isRequest);
    let url = this.baseURL + "/api/contact_list.php";
    return this.http.post(url, form_data).map(response => response.json());
  }

  public add_onlinetime(userid, start_time) {
    var form_data = new FormData();
    form_data.append("userid", userid);
    form_data.append("starttime", start_time);
    let url = this.baseURL + "/api/add_onlinetime.php";
    return this.http.post(url, form_data).map(response => response.json());
  }

  public add_offlinetime(userid, start_time, end_time) {
    var form_data = new FormData();
    form_data.append("userid", userid);
    form_data.append("starttime", start_time);
    form_data.append("endtime", end_time);
    console.log("adfasdfas/////////", userid);
    console.log("adfasdfas/////////", start_time);
    console.log("adfasdfas/////////", end_time);
    let url = this.baseURL + "/api/add_offlinetime.php";
    console.log(url);
    return this.http.post(url, form_data).map(response => response.json());
  }

  public uploadProfilePhoto(base64Image) {
    let url = this.baseURL + "/api/mobileappuser_profile_upload.php";
    var form_data = new FormData();
    form_data.append("photo", base64Image);
    console.log(url);
    return this.http.post(url, form_data).map(response => response.json());
  }

  public sendSMS(userid, phonenumber) {
    let url = this.baseURL + "/api/phoneVerify/twilioVerify.php";
    var form_data = new FormData();
    form_data.append("phonenumber", phonenumber);
    form_data.append("userid", userid);
    return this.http.post(url, form_data).map(response => response.json());
  }

  public confirmVerify(userid) {
    let url = this.baseURL + "/api/phoneVerify/confirmVerify.php";
    var form_data = new FormData();
    form_data.append("userid", userid);
    return this.http.post(url, form_data).map(response => response.json());
  }

  public last_messages(userid) {
    var form_data = new FormData();
    let url = this.baseURL + "/api/chat/last_messages.php";
    form_data.append("userid", userid);
    return this.http.post(url, form_data).map(response => response.json());
  }

  public register_token(userid, token, devicetype) {
    var form_data = new FormData();
    let url = this.baseURL + "/api/chat/register_token.php";
    form_data.append("userid", userid);
    form_data.append("token", token);
    form_data.append("devicetype", devicetype);
    return this.http.post(url, form_data).map(response => response.json());
  }

  public loadCountryCodes() {
    let url = "./assets/countryCodes.json";
    return this.http.get(url).map(response => response.json());
  }
}
