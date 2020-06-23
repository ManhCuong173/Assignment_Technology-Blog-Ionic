import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
declare let alertify: any;
@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.page.html',
  styleUrls: ['./notfound.page.scss'],
})
export class NotfoundPage implements OnInit
{

  constructor(private __router: Router) { }

  ngOnInit()
  {
    firebase.auth().currentUser.delete().then(() =>
    {
      setTimeout(() =>
      {
        alertify.success('Bạn sẽ được tự động quay trở về trang đăng nhập')
        this.__router.navigate(['signin'])
      }, 5000);
    })
  }

}
