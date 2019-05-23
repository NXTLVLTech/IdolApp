import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddBioModalPage } from './add-bio-modal';

@NgModule({
  declarations: [
    AddBioModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddBioModalPage),
  ],
})
export class AddBioModalPageModule {}
