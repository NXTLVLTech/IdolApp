import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { AddHometownPage } from "./add-hometown";

@NgModule({
  declarations: [AddHometownPage],
  imports: [IonicPageModule.forChild(AddHometownPage)],
  exports: [AddHometownPage]
})
export class AddHometownPageModule {}
