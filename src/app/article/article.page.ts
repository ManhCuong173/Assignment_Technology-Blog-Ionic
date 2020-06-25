import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { PostsService } from '../posts.service';
import * as firebase from 'firebase';
import { NgForm } from '@angular/forms';
import { LoginService } from '../login.service';
import { Socket } from 'ngx-socket-io';
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
  parentArticles: any;
  constructor(private activeRoute: ActivatedRoute, private __portService: PostsService, private __router: Router, private __loginService: LoginService, private __socket: Socket)
  {
    this.param = this.activeRoute.snapshot.paramMap.get('item_id');
    this.getSpecificArticle(this.param);
    this.getAllComment();
    this.detectUserDoVote();
  }

  ngOnInit()
  {
    this.__socket.connect();
    this.__socket.fromEvent('res-new-comment').subscribe(data =>
    {
      this.listComments.push(data);
    })
  }

  async getSpecificArticle(id)
  {
    this.article = await this.__portService.getSpecificArticle(id);
    this.article.createdDate = new Date(this.article.createdDate).toLocaleDateString();
    if (!this.article) {
      alertify.warning('Không tồn tại bài viết')
      this.__router.navigate(['/list-article'])
    }

    // get relative article
    this.getRelatedArticles();

    // get parent article
    this.getParentArticle()
  }

  async detectUserDoVote()
  {
    let user = this.__loginService.user;
    let isVoted = await this.__portService.detectUserDoVote(user.__id, this.param);
    isVoted ? this.isVotedActive = true : this.isVotedActive = false;
  }

  voteArticle()
  {
    let userID = this.__loginService.getUser()['__id'];
    let userName = this.__loginService.getUser()['username'];
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
      }).then(async () =>
      {
        await this.__portService.voteArticle(this.param, userID);
        this.isVotedActive = true;
      })
    })
  }

  addComment(comment: NgForm)
  {
    let userID = this.__loginService.getUser()['__id'];
    let userName = this.__loginService.getUser()['username'];
    if (userName == '') userName = 'anonymous'
    this.__portService.addComments(comment.value.commentValue, userID, userName, this.param);
    this.__socket.emit('new-comment', { content: comment.value.commentValue, userID: userID, articleID: this.param, userName: userName })
  };

  async getAllComment()
  {
    this.listComments = await this.__portService.getAllComment(this.param);
  };

  async getRelatedArticles()
  {
    this.listRelatedArticles = await this.__portService.getRelatedArticles(this.article, this.param);
  }

  async getParentArticle()
  {
    this.parentArticles = await this.__portService.getParentArticles(this.article.postParentID);
  }
}
