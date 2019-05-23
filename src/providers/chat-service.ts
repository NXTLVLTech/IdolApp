import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http'
import { Events } from 'ionic-angular';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { Observable } from "rxjs/Observable";

export class ChatMessage {
  id: string;
  messageId: string;
  UserId: string;
  UserName: string;
  UserAvatar: string;
  toUserId: string;
  toUserName: string;
  toUserAvatar: string;
  SendTime: any;
  message: string;
  status: string;
}

export class UserInfo {
  id: string;
  name?: string;
  avatar?: string;
}


@Injectable()
export class ChatService {

  public chatBaseURL = "https://www.idolapp.co/admin/api/chat/chat_api.php";
  
  constructor(private http: Http, private events: Events) {

    console.log("chat Service Api");
  }

  getMsgList(msgId, userid) {
    var form_data = new FormData();
    form_data.append('msgId',msgId);
    form_data.append('userid',userid);
    form_data.append('type', 'list');

    return this.http.post(this.chatBaseURL, form_data).map(response=>
      response.json());
  }

  sendMsg(msg: ChatMessage) {
    // return new Promise(resolve => setTimeout(() => resolve(msg), Math.random() * 1000))
    // .then(() => this.mockNewMsg(msg));
    var form_data = new FormData();
    form_data.append('msgId', msg.messageId);
    form_data.append('message', msg.message);
    form_data.append('toUserId', msg.toUserId);
    form_data.append('toUserName', msg.toUserName);
    form_data.append('toUserAvatar', msg.toUserAvatar);
    form_data.append('UserId', msg.UserId);
    form_data.append('UserName', msg.UserName);
    form_data.append('UserAvatar', msg.UserAvatar);
    form_data.append('SendTime', msg.SendTime);
    form_data.append('type', 'send');
    
    console.log(msg);
    return this.http.post(this.chatBaseURL, form_data).map(response=>
      response.json());

  }

  receivedMsg(msgId, SendTime, userid){
    var form_data = new FormData();
    form_data.append('msgId', msgId);
    form_data.append('userid',userid);
    form_data.append('SendTime', SendTime);
    form_data.append('type', 'received');

    return this.http.post(this.chatBaseURL, form_data).map(response=>
      response.json());
  }

  // getUserInfo(): Promise<UserInfo> {
  //   const userInfo: UserInfo = {
  //     id: '140000198202211138',
  //     name: 'Luff',
  //     avatar: './assets/user.jpg'
  //   };
  //   return new Promise(resolve => resolve(userInfo));
  // }

}