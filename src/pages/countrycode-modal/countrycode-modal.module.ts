import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CountrycodeModalPage } from './countrycode-modal';


@NgModule({
  declarations: [
    CountrycodeModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CountrycodeModalPage),
  ],
  exports: [
    CountrycodeModalPage
  ]
})
export class CountrycodeModalPageModule {}
