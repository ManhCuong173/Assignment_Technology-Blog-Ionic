import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AddArticleGuard } from './add-article.guard';
import { ManageArticleGuard } from './manage-article.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'signin',
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./signin/signin.module').then(m => m.SigninPageModule)
  },
  {
    path: 'signin',
    loadChildren: () => import('./signin/signin.module').then(m => m.SigninPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'user-normal/:user_id',
    loadChildren: () => import('./user-normal/user-normal.module').then(m => m.UserNormalPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminPageModule),
    canActivate: [ManageArticleGuard],
  },
  {
    path: 'user-author',
    loadChildren: () => import('./user-author/user-author.module').then(m => m.UserAuthorPageModule)
  },
  {
    path: 'list-article/:cate_id',
    loadChildren: () => import('./list-article/list-article.module').then(m => m.ListArticlePageModule)
  },
  {
    path: 'add-new-article',
    loadChildren: () => import('./add-new-article/add-new-article.module').then(m => m.AddNewArticlePageModule),
    canActivate: [AddArticleGuard],
  },
  {
    path: 'article/:item_id',
    loadChildren: () => import('./article/article.module').then(m => m.ArticlePageModule)
  },
  {
    path: 'home-page',
    loadChildren: () => import('./home-page/home-page.module').then(m => m.HomePagePageModule),
  },
  {
    path: 'notfound',
    loadChildren: () => import('./notfound/notfound.module').then(m => m.NotfoundPageModule)
  },  {
    path: 'preview',
    loadChildren: () => import('./preview/preview.module').then( m => m.PreviewPageModule)
  },




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
