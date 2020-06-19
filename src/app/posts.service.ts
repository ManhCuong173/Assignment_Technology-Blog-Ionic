import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { UtilsService } from './utils.service';
@Injectable({
  providedIn: 'root'
})
export class PostsService
{
  constructor(private __utilsService: UtilsService) { }
  article: any;
  getSpecificArticle(id)
  {
    return new Promise((resolve, reject) =>
    {
      firebase.firestore().collection('Article').doc(id).get().then(snapshot =>
      {
        this.article = snapshot.data();
        resolve(this.article)
      })
    });
  }

  getArticleByCateID(cateID)
  {
    firebase.firestore
  }

  async getArticleByRequires(cateIDArgs, articleType = 'NEW', limit = 5)
  {
    let returnArticle: any;
    switch (articleType) {
      case 'NEW':
        returnArticle = await this.__utilsService.queryByField('Article', 'cateID', cateIDArgs, '==', limit, articleType);
        return returnArticle;
    }
  }
}
