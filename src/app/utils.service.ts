import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UtilsService
{
  constructor() { }
  pathType = {
    USERS: 'user_',
    BOOKS: 'books'
  }
  returnSpecificPath(arr: Array<any>)
  {
    if (arr[0] == this.pathType.USERS) return `users_${arr[1]}/${arr[2]}`
    else return `books/`
  }

  randomColor()
  {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  returnCategory()
  {
    return new Promise((resolve, reject) =>
    {
      let categoryList = [];
      firebase.firestore().collection('Category').get().then(snapshot =>
      {
        snapshot.forEach(cate =>
        {
          let result = Object.assign(cate.data(), { id: cate.id })
          categoryList.push(result);
        });
        resolve(categoryList);
      }).catch(err => new Error(err))
    })
  }

  queryByField(collectionArg, field, inputValue, operator, limitArg = 5, option = 'NEW')
  {
    let results = [];
    return new Promise((resolve, reject) =>
    {
      switch (option) {
        default:
          firebase.firestore().collection(collectionArg).where(field, operator, inputValue).orderBy('createdDate', 'desc').limit(5).get().then(snapshot =>
          {
            snapshot.docs.forEach(item =>
            {
              results.push(Object.assign(item.data(), { id: item.id }))
            })
            resolve(results)
          })
      }
    })
  }
}
