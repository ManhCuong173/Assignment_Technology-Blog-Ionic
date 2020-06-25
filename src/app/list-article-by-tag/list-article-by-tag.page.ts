import { Component, OnInit, ViewChild } from '@angular/core';
import * as firebase from 'firebase'
import { Socket } from 'ngx-socket-io';
import { UtilsService } from '../utils.service';
import { PostsService } from '../posts.service';
import { AdminServiceService } from '../admin-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';
import { NotificationService } from '../notification.service';
declare let alertify: any;
@Component({
  selector: 'app-list-article-by-tag',
  templateUrl: './list-article-by-tag.page.html',
  styleUrls: ['./list-article-by-tag.page.scss'],
})
export class ListArticleByTagPage implements OnInit
{

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  articlesByTagInput: any = [];
  cateID: String;
  exampleArrToDisplay = [];
  addMoreArticles: Number = 5;
  isActiveInfiniteScroll: boolean = true;

  allArticles: any;
  listCategory: any;
  listArticleShowMenu: any;
  isShown: boolean = false;
  isMenuShown: boolean = false;
  // the number of nofication which isn't read
  notReadNumber: any = 0;

  constructor(private __utilsSerice: UtilsService, private __router: Router, private __socket: Socket, private adminService: AdminServiceService, private __activedRoute: ActivatedRoute)
  {
    this.cateID = this.__activedRoute.snapshot.paramMap.get('tag');
    this.getAllCategory();
    this.getAllArticles();
    this.__socket.fromEvent('response-read-notification').subscribe(dataResponse => 
    {
      this.notReadNumber = dataResponse
    })
    this.__socket.fromEvent('res-read-notification-change-color').subscribe(data =>
    {
    });

  }

  ngOnInit()
  {
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

  // get all category
  async getAllCategory()
  {
    this.listCategory = await this.__utilsSerice.returnCategory();
  }

  // get alll article
  async getAllArticles()
  {
    this.allArticles = await this.adminService.getAllArticle();
    this.getArticleByTag(this.cateID);
  }

  moreArticle(cateID)
  {
    this.__router.navigate(['/cate-detail', cateID])
  }

  displayNotification()
  {
    this.isShown = !this.isShown;
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
    // litmit = 10
    // số bài dưới limit value thì chỉ lấy số bài còn lại
    if (this.articlesByTagInput.length <= 10) {
      for (let i = 0; i < this.articlesByTagInput.length; i++) {
        this.exampleArrToDisplay.push(this.articlesByTagInput[i])
      };
      this.articlesByTagInput.splice(0, this.articlesByTagInput.length);
      this.isActiveInfiniteScroll = false;
    }

    // > limit value tuần tự lấy 10 bài
    else {
      if (this.articlesByTagInput.length > 10) {
        for (let i = 0; i < 10; i++) {
          this.exampleArrToDisplay.push(this.articlesByTagInput[i])
        };
        this.articlesByTagInput.splice(0, 10);
      } else {
        for (let i = 0; i < this.articlesByTagInput.length; i++) {
          this.exampleArrToDisplay.push(this.articlesByTagInput[i])
        };
        this.articlesByTagInput.splice(0, this.articlesByTagInput.length);
      }
    }
  }

  async getArticleByTag(inputTag)
  {
    try {
      let allArticle: any;
      allArticle = this.allArticles;
      allArticle.forEach(article =>
      {
        let { tags } = article;
        for (const tag of tags) {
          if (tag.includes(inputTag)) {
            this.articlesByTagInput.push(article);
          }
        }
      });
      for (let article of this.articlesByTagInput) {
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
