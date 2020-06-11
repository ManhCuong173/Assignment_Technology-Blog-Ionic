import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserAuthorPageRoutingModule } from './user-author-routing.module';

import { UserAuthorPage } from './user-author.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserAuthorPageRoutingModule
  ],
  declarations: [UserAuthorPage]
})
export class UserAuthorPageModule {}
