import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserAuthorPage } from './user-author.page';

const routes: Routes = [
  {
    path: '',
    component: UserAuthorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserAuthorPageRoutingModule {}
