import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserNormalPage } from './user-normal.page';

const routes: Routes = [
  {
    path: '',
    component: UserNormalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserNormalPageRoutingModule {}
