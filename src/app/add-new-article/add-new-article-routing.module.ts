import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddNewArticlePage } from './add-new-article.page';

const routes: Routes = [
  {
    path: '',
    component: AddNewArticlePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddNewArticlePageRoutingModule {}
