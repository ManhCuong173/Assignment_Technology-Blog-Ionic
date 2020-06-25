import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListArticleByTagPageRoutingModule } from './list-article-by-tag-routing.module';

import { ListArticleByTagPage } from './list-article-by-tag.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListArticleByTagPageRoutingModule
  ],
  declarations: [ListArticleByTagPage]
})
export class ListArticleByTagPageModule {}
