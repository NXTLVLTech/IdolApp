import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddNewchatModalPage } from './add-newchat-modal';

@NgModule({
  declarations: [
    AddNewchatModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddNewchatModalPage),
  ],
  exports: [
    AddNewchatModalPage
  ]
})
export class AddNewchatModalPageModule {}
