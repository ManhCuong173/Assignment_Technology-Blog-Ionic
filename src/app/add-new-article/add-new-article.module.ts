import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddNewArticlePageRoutingModule } from './add-new-article-routing.module';

import { AddNewArticlePage } from './add-new-article.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddNewArticlePageRoutingModule
  ],
  declarations: [AddNewArticlePage]
})
export class AddNewArticlePageModule {}
