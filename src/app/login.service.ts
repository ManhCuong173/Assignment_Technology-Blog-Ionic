import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { environment } from './../environments/environment';
import { NotificationService } from './notification.service';
declare let alertify: any;

@Injectable({
  providedIn: 'root'
})
export class LoginService
{
  isLoggined: boolean = false;
  defaultUser: any = { email: '', password: '' }
  user: any;
  author: any;
  userCollection: any;
  constructor()
  {
  }
  loadUser(): Promise<any>
  {
    let promiseInstance = new Promise((resolve, reject) =>
    {
      // firebase.initializeApp(environment.firebaseConfig);
      // firebase.auth().onAuthStateChanged(userFirebase =>
      // {
      //   // user is current login
      //   if (userFirebase) {
      //     if (!userFirebase.emailVerified) {
      //       alertify.warning('Bạn cần xác thực thông tin email của tài khoản này!');
      //       firebase.auth().currentUser.sendEmailVerification();
      //     }
      //     this.setLogginState()
      //     firebase.firestore().collection('User').where('email', '==', userFirebase.email).get().then(
      //       snapshot =>
      //       {
      //         if (snapshot !== null) {
      //           snapshot.forEach(user =>
      //           {
      //             this.user = user.data();
      //             this.user = Object.assign(this.user, { __id: user.id })
      //             resolve();
      //           });
      //         } else {
      //           userFirebase.delete();
      //           resolve();
      //         }
      //       }
      //     )
      //   }
      //   else {
      //     this.setLoggoutState();
      //     this.user = this.defaultUser;
      //     resolve();
      //   }
      // })
      resolve();
    })
    return promiseInstance;
  }
  setUser(userInfo, userId)
  {
    this.user = Object.assign(userInfo, { __id: userId })
  }
  getUser()
  {
    return this.user;
  }

  setLogginState()
  {
    this.isLoggined = true;
  }

  setLoggoutState()
  {
    this.isLoggined = false;
  }

  isLogginYet(): boolean
  {
    return this.isLoggined;
  }

  changeUserInfo(userId, payload)
  {
    return new Promise((resolve, reject) =>
    {
      firebase.firestore().collection('User').doc(userId).update(payload).then(res => resolve(res)).catch(error => reject(error));
    })
  }
}
