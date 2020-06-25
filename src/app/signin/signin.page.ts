import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from './../login.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
declare let alertify: any;

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit
{
  authInstance: any;
  isLoggedIn: any = false;
  user: any;

  constructor(private __loginService: LoginService, private __router: Router)
  {
  }
  ngOnInit()
  {
  }
  //reset password by sending email reset password
  resetPassword()
  {
    alertify.prompt('Chúng tôi sẽ gửi bạn mật khẩu reset qua email', 'Write your email here', function (evt, value)
    {
      firebase.auth().sendPasswordResetEmail(value).then(() =>
      {
        alertify.success('Chúng tôi đã gửi password reset thông qua email' + value);
      })
    })
  }

  async signIn({ email, password })
  {
    if (!email || !password) {
      alertify.error('Bạn phải nhập đầy đủ thông tin');
      return;
    }
    let userCollection = firebase.firestore().collection('User');
    userCollection.where('email', '==', email).get().then(snapshot =>
    {
      if (snapshot.empty) {
        firebase.auth().signInWithEmailAndPassword(email, password).then(() =>
        {
          this.__router.navigate(['notfound']);
        }).catch(err => { alertify.error(err.message) });
      } else {
        snapshot.forEach(user =>
        {
          let { isVerified } = user.data();
          let { id } = user;
          if (!isVerified) userCollection.doc(id).update({ isVerified: true })
          firebase.auth().signInWithEmailAndPassword(email, password).then(() =>
          {
            let { email } = user.data();
            this.__loginService.setLogginState();
            this.__loginService.setUser(user.data(), user.id);
            if (email == 'daomanhcuong173@gmail.com') this.__router.navigate(['admin']);
            else this.__router.navigate(['home-page']);
          }).catch(err => { alertify.error(err.message) });
          return;
        })
      }
    })

  }

  submitSignInForm(f: NgForm)
  {
    this.signIn({ email: f.value.email, password: f.value.password })
  }

}
