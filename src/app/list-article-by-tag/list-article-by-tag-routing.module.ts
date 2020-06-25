import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListArticleByTagPage } from './list-article-by-tag.page';

const routes: Routes = [
  {
    path: '',
    component: ListArticleByTagPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListArticleByTagPageRoutingModule {}
