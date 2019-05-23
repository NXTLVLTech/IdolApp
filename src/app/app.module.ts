import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { HttpModule } from "@angular/http";
import {
  Contacts,
  Contact,
  ContactField,
  ContactName
} from "@ionic-native/contacts";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { Keyboard } from "@ionic-native/keyboard";
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { SQLite } from "@ionic-native/sqlite";
import { InAppBrowser } from "@ionic-native/in-app-browser";
// import { CallNumber } from '@ionic-native/call-number';
import { SMS } from "@ionic-native/sms";
import { EmailComposer } from "@ionic-native/email-composer";
import { SocialSharing } from "@ionic-native/social-sharing";
import { AppAvailability } from "@ionic-native/app-availability";
import { Device } from "@ionic-native/device";
import { Facebook } from "@ionic-native/facebook";
import { AppRate } from "@ionic-native/app-rate";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";
import { Firebase } from "@ionic-native/firebase";

import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFireAuthModule } from "angularfire2/auth";

import { MyApp } from "./app.component";
import { EmojiPickerComponent } from "../components/emoji-picker/emoji-picker";
import { RelativeTime } from "../pipes/relative-time";
import { HometownPipe } from "../pipes/hometown";

import { RatingProvider } from "../providers/rating/rating";
import { IdolApiProvider } from "../providers/apiProvider";
import { ChatService } from "../providers/chat-service";
import { EmojiProvider } from "../providers/emoji";
import { FcmProvider } from "../providers/fcm";
import { AlertProvider } from "../providers/alert";
import { DataProvider } from "../providers/data";

import { HomePage } from "../pages/home/home";
import { LoginPage } from "../pages/login/login";
import { SettingsPage } from "../pages/settings/settings.ts";
import { ProfilePage } from "../pages/profile/profile";
import { QrScanPage } from "../pages/qr-scan/qr-scan";
import { ContactListPage } from "../pages/contact-list/contact-list";
import { FullscreenPage } from "../pages/fullscreen/fullscreen";
import { AppIntroPage } from "../pages/appIntro/appIntro";
import { editingProfilePage } from "../pages/editingProfile/editingProfile";
import { NotificationPage } from "../pages/notification/notification";
import { AddFriendPage } from "../pages/add-friend/add-friend";
import { ForgotPasswordPage } from "../pages/forgot-password/forgot-password";
import { eLoginPage } from "../pages/elogin/elogin";
import { eSignupPage } from "../pages/esignup/esignup";
import { ChatListPage } from "../pages/chat-list/chat-list";
import { ChatPage } from "../pages/chat/chat";
import { VerifyPage } from "../pages/verify/verify";
import { confirmModal } from "../pages/confirmmodal/confirmmodal";
import { CountrycodeModalPage } from "../pages/countrycode-modal/countrycode-modal";
import { AddHometownPage } from "../pages/add-hometown/add-hometown";
import { AddBioModalPage } from "../pages/add-bio-modal/add-bio-modal";
import { AddSocialModalPage } from "../pages/add-social-modal/add-social-modal";
import { LoadingProvider } from "../providers/loading";

var firebaseConfig = {
  apiKey: "AIzaSyBPC6V17dS321F-yZopAk-Z8YJ4qE6SVcw",
  authDomain: "idol-d924a.firebaseapp.com",
  databaseURL: "https://idol-d924a.firebaseio.com",
  projectId: "idol-d924a",
  storageBucket: "idol-d924a.appspot.com",
  messagingSenderId: "677669447098"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    eLoginPage,
    eSignupPage,
    ProfilePage,
    SettingsPage,
    QrScanPage,
    ContactListPage,
    FullscreenPage,
    AppIntroPage,
    ChatListPage,
    editingProfilePage,
    ChatPage,
    VerifyPage,
    RelativeTime,
    HometownPipe,
    EmojiPickerComponent,
    CountrycodeModalPage,
    confirmModal,
    AddFriendPage,
    NotificationPage,
    ForgotPasswordPage,
    AddHometownPage,
    AddBioModalPage,
    AddSocialModalPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: "true"
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    CommonModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    eLoginPage,
    eSignupPage,
    ProfilePage,
    SettingsPage,
    QrScanPage,
    ContactListPage,
    FullscreenPage,
    AppIntroPage,
    ChatListPage,
    editingProfilePage,
    ChatPage,
    VerifyPage,
    EmojiPickerComponent,
    CountrycodeModalPage,
    confirmModal,
    AddFriendPage,
    NotificationPage,
    ForgotPasswordPage,
    AddHometownPage,
    AddBioModalPage,
    AddSocialModalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    ScreenOrientation,
    Facebook,
    SQLite,
    InAppBrowser,
    // CallNumber,
    SMS,
    EmailComposer,
    SocialSharing,
    AppAvailability,
    Device,
    AppRate,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    RatingProvider,
    IdolApiProvider,
    Contacts,
    File,
    FileTransfer,
    FileTransferObject,
    ChatService,
    EmojiProvider,
    Firebase,
    FcmProvider,
    AlertProvider,
    DataProvider,
    LoadingProvider
  ]
})
export class AppModule {}
