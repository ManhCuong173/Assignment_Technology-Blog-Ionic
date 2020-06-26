import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService
{

  listNoti: any = [];
  constructor(private __loginService: LoginService)
  {
  }

  getAllNotifications()
  {
    let user = this.__loginService.getUser();
    let userId = user.__id;
    //refresh to empty array before get new data
    this.listNoti = [];

    return new Promise((resolve, reject) =>
    {
      if (!userId) {
        reject(new Error('Người dùng không tòn tại'))
      } else {
        firebase.firestore().collection('Notification').where('to', '==', userId).get().then(snapshot =>
        {
          snapshot.docs.sort().reverse();
          snapshot.docs.forEach(notfi =>
          {
            let result = Object.assign(notfi.data(), { id: notfi.id })
            this.listNoti.push(result);
            resolve(this.listNoti)
          })
        });
      }
    })
  }
}
