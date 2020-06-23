import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import * as firebase from 'firebase';
import { LoginService } from '../login.service';
import { AngularFireStorage } from '@angular/fire/storage';
declare let alertify: any;

@Component({
  selector: 'app-user-normal',
  templateUrl: './user-normal.page.html',
  styleUrls: ['./user-normal.page.scss'],
})
export class UserNormalPage implements OnInit
{

  user: any;
  param: String;
  avatarDownloadURL: any;
  imageData: File;

  constructor(private __userService: UserService, private __activedRoute: ActivatedRoute, private __loginService: LoginService, private __storage: AngularFireStorage)
  {
    this.param = __activedRoute.snapshot.paramMap.get('user_id');
    this.getSpecificUser(this.param);
  }

  ngOnInit()
  {
  }

  async getSpecificUser(userID)
  {
    this.user = await this.__userService.getSpecificUser(userID);
    console.log(this.user);

    this.avatarDownloadURL = await this.__userService.getDowloadURL(`user_${this.user.__id}/avatars`, this.user.avatar)
    console.log(this.avatarDownloadURL)
  }

  handleChangeFile(files: FileList)
  {
    this.imageData = files.item(0);

    // validate file image
    if (this.imageData.type.split('/')[0] !== 'image') {
      alertify.error('Không phải kiểu ảnh. Vui lòng chọn lại')
      return;
    };

    // file name
    const filename = this.imageData.name;

    // file path
    const filePath = `user_${this.user.__id}/avatars/${this.user.__id}_${new Date().getTime()}_${filename}`;

    // file reference 
    const fileRef = this.__storage.ref(filePath);

    //upload to storage
    fileRef.put(this.imageData).then(
      (snap) =>
      {
        // update db
        firebase.firestore().collection('User').doc(this.user.__id).get().then(user =>
        {
          // delete old file
          this.__storage.ref(`user_${this.user.__id}/avatars/${user.data().avatar}`).delete();

          // name of image
          let avatarNameArr = filePath.split('/');
          let avatarName = avatarNameArr[avatarNameArr.length - 1];
          firebase.firestore().collection('User').doc(user.id).update({
            avatar: avatarName,
          })
        })
        // display UI
        this.avatarDownloadURL = fileRef.getDownloadURL().forEach(url =>
        {
          this.avatarDownloadURL = url;
        })
      }
    ).catch(
      err =>
      {
        alertify.error('Sửa file không thành công')
      }
    );


  }

  // change password 
  changePassword()
  {
    firebase.auth().sendPasswordResetEmail(firebase.auth().currentUser.email).then(() =>
    {
      alertify.success('Gửi yêu cầu thành công');
      setTimeout(() =>
      {
        window.open('https://mail.google.com/');
      }, 2000)
    })
  }

  // change personal information
  async submitForm(f: NgForm)
  {
    const { username, email, briefIntro } = f.value;
    if (email !== this.user.email) {
      firebase.auth().currentUser.updateEmail(email).then(async () =>
      {
        let newUserInfoRes = await this.__loginService.changeUserInfo(this.user.__id, { email: email });
        alertify.success('Thay đổi email thành công');
      }).catch(err => { alertify.error(err.message) })
    } else {
      let newUserInfoRes = await this.__loginService.changeUserInfo(this.user.__id, { username: username, briefIntro: briefIntro });
      console.log(newUserInfoRes)
      alertify.success('Thay đổi thông tin thành công');
    }
  }

}
