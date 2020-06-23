import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { PostsService } from '../posts.service';
import * as firebase from 'firebase';
import { NgForm } from '@angular/forms';
import { LoginService } from '../login.service';
declare let alertify: any;

@Component({
  selector: 'app-article',
  templateUrl: './article.page.html',
  styleUrls: ['./article.page.scss'],
})
export class ArticlePage implements OnInit
{
  param;
  article: any;
  isVotedActive: boolean = false;
  listComments: any;
  listRelatedArticles: any;
  constructor(private activeRoute: ActivatedRoute, private __portService: PostsService, private __router: Router, private __loginService: LoginService)
  {
    this.param = this.activeRoute.snapshot.paramMap.get('item_id');
    this.getSpecificArticle(this.param);
    this.getAllComment();
  }

  ngOnInit()
  {
  }

  async getSpecificArticle(id)
  {
    this.article = await this.__portService.getSpecificArticle(id);
    this.article.createdDate = new Date(this.article.createdDate).toLocaleDateString();
    if (!this.article) {
      alertify.warning('Không tồn tại bài viết')
      this.__router.navigate(['/list-article'])
    }

    this.getRelatedArticles();
  }

  voteArticle()
  {
    if (this.isVotedActive) {
      alertify.warning('Bạn đã vote cho bài viết này');
      return;
    }
    firebase.firestore().collection('Article').doc(this.param).get().then(snapshot =>
    {
      let { voted } = snapshot.data();
      voted = +voted;
      voted += 1;
      firebase.firestore().collection('Article').doc(this.param).update({
        voted: voted
      }).then(() => { this.isVotedActive = true; })
    })
  }

  addComment(comment: NgForm)
  {
    let userID = this.__loginService.getUser()['__id'];
    let userName = this.__loginService.getUser()['username'];
    if (userName == '') userName = 'anonymous'
    this.__portService.addComments(comment.value.commentValue, userID, userName, this.param);
  };

  async getAllComment()
  {
    this.listComments = await this.__portService.getAllComment(this.param);
  };

  async getRelatedArticles()
  {
    this.listRelatedArticles = await this.__portService.getRelatedArticles(this.article, this.param);
  }
}
