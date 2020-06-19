import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class UserService
{

  isShowAddAuthorRole: boolean = false;
  allUser: any = [];
  constructor(private __loginService: LoginService)
  {
  }

  getAllUser()
  {
    return new Promise((resolve, reject) =>
    {
      firebase.firestore().collection('User').get().then(snapshot =>
      {
        let result: any;
        snapshot.forEach(article =>
        {
          result = Object.assign(article.data(), { id: article.id });
          this.allUser.push(result);
        });
        resolve(this.allUser);
      }).catch(err => { throw new Error(err) })
    })
  }
}


