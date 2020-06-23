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

  addComments(comment, userID, userName, param)
  {
    firebase.firestore().collection('Comment').add({
      content: comment,
      userID: userID,
      userName: userName,
      articleID: param
    }).then(() =>
    {
      firebase.firestore().collection('Article').doc(param).get().then(snapshot =>
      {
        let { numberComment } = snapshot.data();
        numberComment += 1;
        firebase.firestore().collection('Article').doc(param).update({ numberComment: numberComment })
      })
    });
  };

  getAllComment(articleID)
  {
    return new Promise((resolve, reject) =>
    {
      firebase.firestore().collection('Comment').where('articleID', '==', articleID).get().then(snapshot =>
      {
        let results = [];
        snapshot.forEach(comment =>
        {
          results.push(comment.data());
        });
        resolve(results)
      }).catch(err => { throw new Error(err) })
    })
  };

  shuffleArrayItem(array)
  {
    let j, x, i;
    for (i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))
      x = array[i];
      array[i] = array[j];
      array[j] = x;
    }

    return array;
  }

  getRelatedArticles(article, articleID)
  {
    // Vì article ko có id nên cần thêm 1 tham số ID đẻ ngăn việc kết quả trả về trùng khớp bài đang xem
    return new Promise((resolve, reject) =>
    {
      let { cateID } = article;
      let results = [];
      firebase.firestore().collection('Article').where('cateID', '==', cateID).orderBy('createdDate', "desc").limit(10).get().then(snapshot =>
      {
        snapshot.forEach(articleRes =>
        {
          if (articleRes.id !== articleID)
            results.push(Object.assign(articleRes.data(), { id: articleRes.id }));
        });

        results = this.shuffleArrayItem(results);
        console.log(results)
        if (results.length > 4) results.splice(3, 4);
        resolve(results)
      }).catch(err => { throw new Error(err) })
    })
  }
}
