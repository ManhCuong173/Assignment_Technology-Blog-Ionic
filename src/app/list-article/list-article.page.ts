import { NotificationService } from '../notification.service';
import * as firebase from 'firebase'
import { Socket } from 'ngx-socket-io';
import { UtilsService } from '../utils.service';
import { PostsService } from '../posts.service';
import { AdminServiceService } from '../admin-service.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular'
declare let alertify: any;
@Component({
  selector: 'app-list-article',
  templateUrl: './list-article.page.html',
  styleUrls: ['./list-article.page.scss'],
})
export class ListArticlePage implements OnInit
{

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  articlesByCateID: any;
  cateID: String;
  exampleArrToDisplay = [];
  addMoreArticles: Number = 5;
  isActiveInfiniteScroll: boolean = true;

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

  constructor(private __notifService: NotificationService, private __utilsSerice: UtilsService, private __postService: PostsService, private __router: Router, private __socket: Socket, private adminService: AdminServiceService, private __adminService: AdminServiceService, private __activedRoute: ActivatedRoute)
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

    this.cateID = this.__activedRoute.snapshot.paramMap.get('cate_id');
    this.getArticleByCateID(this.cateID);
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
      this.__router.navigate(['/article', postID])
    })
  }
  navigateSpecificArticle(postID)
  {
    console.log(postID)
    this.__router.navigate(['/article', postID])
  }
  openMenu()
  {
    this.isMenuShown = !this.isMenuShown;
  }

  navigate()
  {
    this.__router.navigate(['/homepage'])
  }

  loadData(event)
  {
    setTimeout(() =>
    {
      this.loadMoreData();
      event.target.complete();

      if (this.isActiveInfiniteScroll == false) {
        event.target.disabled = true;
      }
    }, 500);
  }

  loadMoreData()
  {
    // còn phần tử thì load
    if (this.articlesByCateID.length <= 10) {
      for (let i = 0; i < this.articlesByCateID.length; i++) {
        this.exampleArrToDisplay.push(this.articlesByCateID[i])
      };
      this.articlesByCateID.splice(0, this.articlesByCateID.length);
      this.isActiveInfiniteScroll = false;
    }

    // không thì dừng lại tại vị trí này
    else {
      if (this.articlesByCateID.length > 10) {
        for (let i = 0; i < 10; i++) {
          this.exampleArrToDisplay.push(this.articlesByCateID[i])
        };
        this.articlesByCateID.splice(0, 10);
      } else {
        for (let i = 0; i < this.articlesByCateID.length; i++) {
          this.exampleArrToDisplay.push(this.articlesByCateID[i])
        };
        this.articlesByCateID.splice(0, this.articlesByCateID.length);
      }
    }
  }

  async getArticleByCateID(cateID)
  {
    try {
      let allArticle: any;
      allArticle = await this.__adminService.getAllArticle();
      this.articlesByCateID = allArticle.filter(article => article.cateID == cateID);
      for (let article of this.articlesByCateID) {
        if (article.images.length) {
          firebase.storage().ref('admin/media/images').child(article.images[0]).getDownloadURL().then(url =>
          {
            article = Object.assign(article, { imageURLShow: url })
          })
        }
      }
      this.loadMoreData();
    } catch (error) {
      throw new Error(error);
    }
  }
}
