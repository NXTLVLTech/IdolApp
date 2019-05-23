import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { confirmModal } from './confirmmodal';


@NgModule({
  declarations: [
    confirmModal,
  ],
  imports: [
    IonicPageModule.forChild(confirmModal),
  ],
  exports: [
    confirmModal
  ]
})
export class ModalPageModule {}