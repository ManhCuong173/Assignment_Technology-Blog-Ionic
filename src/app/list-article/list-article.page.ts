import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase'
import { Socket } from 'ngx-socket-io';
import { UtilsService } from '../utils.service';
import { PostsService } from '../posts.service';
import { AdminServiceService } from '../admin-service.service';
declare let alertify: any;
@Component({
  selector: 'app-list-article',
  templateUrl: './list-article.page.html',
  styleUrls: ['./list-article.page.scss'],
})
export class ListArticlePage implements OnInit
{

  allArticles: any;
  // all newly article limit by 5
  newPostsOnTech: Array<any> = [];
  newPostsOnBook: Array<any> = [];
  newPostsOnStory: Array<any> = [];
  listNotification: any;
  listCategory: any;
  listArticleShowMenu: any;
  isShown: boolean = false;
  isMenuShown: boolean = false;
  // the number of nofication which isn't read
  notReadNumber: any = 0;

  constructor(private __notifService: NotificationService, private __utilsSerice: UtilsService, private __postService: PostsService, private __router: Router, private __socket: Socket, private adminService: AdminServiceService)
  {
    this.getAllNotification();
    this.getAllCategory();
    this.getAllArticles();
    this.__socket.fromEvent('response-read-notification').subscribe(dataResponse => 
    {
      this.notReadNumber = dataResponse
    })
    this.__socket.fromEvent('res-read-notification-change-color').subscribe(data =>
    {
      this.listNotification.forEach(noti =>
      {
        if (noti.id == data) noti.color = '#393e46';
      });
    });
  }

  ngOnInit()
  {
  }

  // filter all article into each sub array 
  filterArticleToEachArrayAndLimit()
  {
    this.allArticles.forEach(article =>
    {
      if (article.cateID == this.listCategory[0].id || article.cateID == this.listCategory[1].id || article.cateID == this.listCategory[2].id) {
        this.newPostsOnTech.push(article);
      }
      else if (article.cateID == this.listCategory[3].id) this.newPostsOnBook.push(article)
      else this.newPostsOnStory.push(article)
    });

    this.newPostsOnTech = this.getNewLimitArticle(this.newPostsOnTech, 5)
    this.newPostsOnBook = this.getNewLimitArticle(this.newPostsOnBook, 5)
    this.newPostsOnStory = this.getNewLimitArticle(this.newPostsOnStory, 5)
  }

  getNewLimitArticle(articleArray, limit)
  {
    articleArray.splice(limit, articleArray[articleArray.length - 1]);
    articleArray.sort((nextArticle, prevArticle) =>
    {
      if (nextArticle.createdDate > prevArticle.createdDate) return -1;
    });
    return articleArray;
  }

  // get all notification
  async getAllNotification()
  {
    this.listNotification = await this.__notifService.getAllNotifications();
    this.listNotification.forEach(noti =>
    {
      if (noti.isReaded == false) this.notReadNumber += 1;
    });
  }

  // get all category
  async getAllCategory()
  {
    this.listCategory = await this.__utilsSerice.returnCategory();
  }

  // get alll article
  async getAllArticles()
  {
    this.allArticles = await this.adminService.getAllArticle();
    this.filterArticleToEachArrayAndLimit();
  }

  getArticleByCate(cateID, limit)
  {
    // let responseArr: Promise<any>;
    // responseArr = this.__postService.getArticleByRequires(cateID, 'NEW', 5);
    // responseArr.then(snapshot =>
    // {
    //   this.listArticleShowMenu = snapshot;
    // })
    this.listArticleShowMenu = [];
    this.allArticles.forEach((article, index) =>
    {
      if (article.cateID == cateID && index < limit) this.listArticleShowMenu.push(article);
    });

  }

  moreArticle(cateID)
  {
    this.__router.navigate(['/cate-detail', cateID])
  }

  displayNotification()
  {
    this.isShown = !this.isShown;
  }

  navigateSpecificArticleNotif(postID, notiID)
  {
    this.__socket.emit('read-notification', this.notReadNumber);
    this.__socket.emit('read-notification-change-color', notiID)
    firebase.firestore().collection('Notification').doc(notiID).update({ isReaded: true, color: '#393e46' }).then(() =>
    {
      this.__router.navigate(['/article-detail', postID])
    })
  }
  navigateSpecificArticle(postID)
  {
    console.log(postID)
    this.__router.navigate(['/article-detail', postID])
  }
  openMenu()
  {
    this.isMenuShown = !this.isMenuShown;
  }

  navigate()
  {
    this.__router.navigate(['/homepage'])
  }

}
