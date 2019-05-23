import { Component, ElementRef, ViewChild } from "@angular/core";
import {
  NavController,
  NavParams,
  AlertController,
  Content,
  Events,
  Avatar
} from "ionic-angular";
import {
  ChatService,
  ChatMessage,
  UserInfo
} from "../../providers/chat-service";
import { Platform } from "ionic-angular/platform/platform";
import { IdolApiProvider } from "../../providers/apiProvider";
import { QrScanPage } from "../qr-scan/qr-scan";

@Component({
  selector: "page-chat",
  templateUrl: "chat.html"
})
export class ChatPage {
  @ViewChild(Content) content: Content;
  @ViewChild("chat_input") messageInput: ElementRef;

  msgList: ChatMessage[] = [];
  user: UserInfo;
  toUser: UserInfo;
  editorMsg = "";
  showEmojiPicker = false;

  messageId: any;
  receivedInterval: any;

  constructor(
    public navParams: NavParams,
    private chatService: ChatService,
    public platform: Platform,
    public apiProvider: IdolApiProvider,
    private events: Events,
    public navCtrl: NavController
  ) {
    // Get the navParams toUserId parameter
    this.toUser = {
      id: navParams.get("contactid"),
      name: navParams.get("touser_name"),
      avatar: navParams.get("touser_Avatar")
    };
    // Get mock user information
    // this.chatService.getUserInfo()
    // .then((res) => {
    //   this.user = res
    // });

    this.user = {
      id: navParams.get("appuserid"),
      name: navParams.get("appusername"),
      avatar: navParams.get("userAvatar")
    };

    if (this.user.id > this.toUser.id) {
      this.messageId = this.user.id + "*" + this.toUser.id;
    } else {
      this.messageId = this.toUser.id + "*" + this.user.id;
    }
  }

  ionViewWillLeave() {
    // unsubscribe
    clearInterval(this.receivedInterval);
  }

  ionViewDidEnter() {
    //get message list
    this.getMsg();
  }

  onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
    this.scrollToBottom();
  }

  switchEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (!this.showEmojiPicker) {
      this.focus();
    } else {
      this.setTextareaScroll();
    }
    this.content.resize();
    this.scrollToBottom();
  }

  /**
   * @name getMsg
   * @returns {Promise<ChatMessage[]>}
   */
  getMsg() {
    // Get mock message list
    return this.chatService
      .getMsgList(this.messageId, this.user.id)
      .subscribe(res => {
        console.log("response", res);
        this.msgList = res.data;

        this.scrollToBottom();
        this.receivedInterval = setInterval(() => {
          console.log("Timer Works");
          var lastSendtime = 0;
          if (this.msgList.length != 0) {
            lastSendtime = this.msgList[this.msgList.length - 1].SendTime;
          }

          this.chatService
            .receivedMsg(this.messageId, lastSendtime, this.user.id)
            .subscribe(res => {
              if (res.return_code == 0) {
                var newMsgList = res.data;
                newMsgList.forEach(newMsg => {
                  this.pushNewMsg(newMsg);
                });
              }
            });
        }, Math.random() * 1800);
      });
    // .getMsgList()
    // .subscribe(res => {
    //   console.log("aaaaa", res);
    //   // let dataArray = res.array;
    //   // this.msgList = dataArray;
    //   this.scrollToBottom();
    // });
  }

  /**
   * @name sendMsg
   */
  sendMsg() {
    if (!this.editorMsg.trim()) return;
    // Mock message
    const id = Date.now().toString();
    console.log("toUserName: " + this.toUser.id);
    let newMsg: ChatMessage = {
      id: id,
      messageId: this.messageId,
      UserId: this.user.id,
      UserName: this.user.name,
      UserAvatar: this.user.avatar,
      toUserId: this.toUser.id,
      toUserName: this.toUser.name,
      toUserAvatar: this.toUser.avatar,
      SendTime: Date.now(),
      message: this.editorMsg,
      status: "pending"
    };

    this.pushNewMsg(newMsg);
    this.editorMsg = "";

    if (!this.showEmojiPicker) {
      this.focus();
    }

    this.chatService.sendMsg(newMsg).subscribe(res => {
      console.log("ooooo", res);
      let index = this.getMsgIndexById(id);
      // console.log(index);
      if (index !== -1) {
        if (res.return_code != 1) {
          this.msgList[index].status = "success";
        }
      }
    });
  }

  /**
   * @name pushNewMsg
   * @param msg
   */
  pushNewMsg(msg: ChatMessage) {
    const userId = this.user.id,
      toUserId = this.toUser.id;
    // Verify user relationships
    if (msg.UserId === userId && msg.toUserId === toUserId) {
      this.msgList.push(msg);
    } else if (msg.toUserId === userId && msg.UserId === toUserId) {
      this.msgList.push(msg);
    }
    this.scrollToBottom();
  }

  getMsgIndexById(id: string) {
    return this.msgList.findIndex(e => e.id === id);
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content && this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400);
  }

  private focus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  private setTextareaScroll() {
    const textarea = this.messageInput.nativeElement;
    textarea.scrollTop = textarea.scrollHeight;
  }

  openSocial() {
    console.log("aaa");
    this.navCtrl.push(QrScanPage, {
      appuserid: this.user.id,
      contactid: this.toUser.id,
      mode: "list"
    });
  }
}
