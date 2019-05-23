import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddSocialModalPage } from './add-social-modal';

@NgModule({
  declarations: [
    AddSocialModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddSocialModalPage),
  ],
})
export class AddSocialModalPageModule {}
