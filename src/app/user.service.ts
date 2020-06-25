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
  user: any;
  adminID: string = 'P3HI83sJLpvbAYgA7TGc';

  constructor(private __loginService: LoginService)
  {
  }

  getAllUser()
  {
    return new Promise((resolve, reject) =>
    {
      let arrayReturn: any = [];
      firebase.firestore().collection('User').get().then(snapshot =>
      {
        let result: any;
        snapshot.forEach(user =>
        {
          if (user.data().avatar !== '') {
            result = Object.assign(user.data(), { id: user.id }, { storageURL: `user_${user.id}/avatars/${user.data().avatar}` });
            arrayReturn.push(result);
          } else {
            result = Object.assign(user.data(), { id: user.id }, { storageURL: 'default_avatar/default_user.jpeg' });
            arrayReturn.push(result);
          }
        });
        resolve(arrayReturn);
      }).catch(err => { throw new Error(err) })
    })
  }

  getSpecificUser(userID)
  {
    return new Promise((resolve, reject) =>
    {
      firebase.firestore().collection('User').doc(userID).get().then(snapshot =>
      {
        this.user = Object.assign(snapshot.data(), { __id: snapshot.id });
        resolve(this.user);
      }).catch(err => { reject(err) })
    })
  }

  getDowloadURL(pathURL, childURL)
  {
    return new Promise((resolve, reject) =>
    {
      firebase.storage().ref(pathURL).child(childURL).getDownloadURL().then(url =>
      {
        resolve(url)
      })
    })
  }

  detectUserSubscribe(userID)
  {
    return new Promise((resolve, reject) =>
    {
      firebase.firestore().collection('Admin').doc(this.adminID).get().then(snapshot =>
      {
        let { followers } = snapshot.data();
        if (followers.indexOf(userID) > -1) resolve(true);
        else resolve(false);
      })
    })
  };

  subscribe(userID)
  {
    return new Promise((resolve, reject) =>
    {
      firebase.firestore().collection('Admin').doc(this.adminID).get().then(snapshot =>
      {
        let { followers } = snapshot.data();
        followers.push(userID);
        firebase.firestore().collection('Admin').doc(this.adminID).update({ followers: followers }).then(() =>
        {
          resolve()
        })
      })
    })
  }
}