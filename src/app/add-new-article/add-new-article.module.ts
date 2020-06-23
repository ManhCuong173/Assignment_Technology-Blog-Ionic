import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddNewArticlePageRoutingModule } from './add-new-article-routing.module';

import { AddNewArticlePage } from './add-new-article.page';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddNewArticlePageRoutingModule,
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
  ],
  declarations: [AddNewArticlePage]
})
export class AddNewArticlePageModule { }
