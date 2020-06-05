import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserNormalPageRoutingModule } from './user-normal-routing.module';

import { UserNormalPage } from './user-normal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserNormalPageRoutingModule
  ],
  declarations: [UserNormalPage]
})
export class UserNormalPageModule {}
