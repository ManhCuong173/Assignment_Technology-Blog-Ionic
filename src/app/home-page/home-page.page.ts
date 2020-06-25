
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LoginService } from './../login.service';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { UtilsService } from '../utils.service';
import { Socket } from 'ngx-socket-io';
import { NotificationService } from '../notification.service';
import { PostsService } from '../posts.service';
import { AdminServiceService } from '../admin-service.service';
declare let alertify: any;
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.page.html',
  styleUrls: ['./home-page.page.scss'],
})
export class HomePagePage implements OnInit
{


  constructor(private __loginService: LoginService, private __storage: AngularFireStorage, private __userService: UserService, private __utilsService: UtilsService, private __notifService: NotificationService, private __utilsSerice: UtilsService, private __postService: PostsService, private __router: Router, private __socket: Socket, private adminService: AdminServiceService) { }
  //user information 
  user: any;
  userAvatarURL: any;
  imageData: File = null;
  latesImageChange: String = '';

  // anonymous 
  isAnonymous: boolean = false;

  // most voted article
  mostVotedArticle

  // list article
  allArticles: any;

  // sub category on tech
  subTechCate: Array<String> = ['7ovjPZkmy2C1fjPiiOx8', '8DONo4cPmZzQ71qi4mQR', 'TcPQe21RxDcHPOcWDE4L'];

  // all newly article limit by 5
  newPostsOnTech: Array<any> = [];
  newPostsOnBook: Array<any> = [];
  newPostsOnStory: Array<any> = [];
  listNotification: any;
  listCategory: any;
  listArticleShowMenu: any;
  isShown: boolean = false;
  isMenuShown: boolean = false;
  // the number of nofication which isn't read
  notReadNumber: any = 0;
  isAdmin: boolean = false;

  // detect user subscribe admin
  isSubscribe: Boolean = false;

  ngOnInit()
  {
    this.user = this.__loginService.user;
    if (this.user.email == '') this.isAnonymous = true;
    else this.isAnonymous = false;
    if (this.user.role == 'CA' || this.user.role == 'AD') this.isAdmin = true;
    this.latesImageChange = this.user.avatar;
    if (this.user.avatar == '') {
      this.__storage.storage.ref(`default_avatar/default_user.jpeg`).getDownloadURL().then(url =>
      {
        this.userAvatarURL = url;

      });
    } else {
      this.__storage.storage.ref(`user_${this.user.__id}/avatars/${this.user.avatar}`).getDownloadURL().then(url =>
      {
        this.userAvatarURL = url;

      });
    }
    this.__socket.connect();
    this.__socket.fromEvent('res-send-notification').subscribe(data =>
    {
      let adminID = data['adminID'];
      let label = data['label'];
      let title = data['title'];
      if (this.user.__id !== adminID) {
        alertify.message(`${label} " ${title} "`)
      } else if (this.user.__id == adminID) {
        alertify.message(`Bạn vừa tạo bài viết mới: ${title}`)
      }
    })

    // detect subscribe
    this.detectSubscribe();
    this.getAllNotification();
    this.getAllCategory();
    this.getAllArticles();
    this.__socket.fromEvent('response-read-notification').subscribe(dataResponse => 
    {
      this.notReadNumber = dataResponse
    })
    this.__socket.fromEvent('res-read-notification-change-color').subscribe(data =>
    {
      this.listNotification.forEach(noti =>
      {
        if (noti.id == data) noti.color = '#393e46';
      });
    });
  }

  // random article
  randomArticle()
  {
    let articleArrLength = this.allArticles.length;
    let randomNumber = Math.floor(Math.random() * articleArrLength);
    let randomArticle = this.allArticles[randomNumber].id;
    this.__router.navigate(['article', randomArticle])
  }

  // detect subscribe 
  async detectSubscribe()
  {
    let result = await this.__userService.detectUserSubscribe(this.user.__id);
    if (result == true) {
      this.isSubscribe = true;
      return;
    }
    this.isSubscribe = false;
  }

  // user subscribe
  async subscribe()
  {
    this.isSubscribe = true;
    await this.__userService.subscribe(this.user.__id);
    alertify.success('Đăng ký blog thành công. Những bài viết mới nhất sẽ được cập nhật liên tục cho bạn. Hãy đón xem nhé!')
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
        this.userAvatarURL = fileRef.getDownloadURL().forEach(url =>
        {
          this.userAvatarURL = url;
        })
      }
    ).catch(
      err =>
      {
        alertify.error('Sửa file không thành công')
      }
    );


  }

  logOut()
  {
    firebase.auth().signOut().then(() =>
    {
      this.user = this.__loginService.defaultUser
      this.__loginService.setLoggoutState();
      this.__router.navigate(['signin'])
    });
  }

  // filter all article into each sub array 
  filterArticleToEachArrayAndLimit()
  {
    this.allArticles.forEach(article =>
    {
      if (article.cateID == this.listCategory[0].id || article.cateID == this.listCategory[1].id || article.cateID == this.listCategory[2].id) {
        this.newPostsOnTech.push(article);
      }
      else if (article.cateID == this.listCategory[3].id) this.newPostsOnStory.push(article)
      else this.newPostsOnBook.push(article)
    });
    this.newPostsOnTech = this.getNewLimitArticle(this.newPostsOnTech, 3)
    this.newPostsOnBook = this.getNewLimitArticle(this.newPostsOnBook, 3)
    this.newPostsOnStory = this.getNewLimitArticle(this.newPostsOnStory, 3)
  }

  getNewLimitArticle(articleArray, limit)
  {
    if (articleArray.length > 3) {
      articleArray.splice(limit, articleArray.length - 1);
    }
    articleArray.sort((prevArticle, nextArticle) =>
    {
      if (prevArticle.createdDate > nextArticle.createdDate) return -1;
    });
    for (let article of articleArray) {
      if (article.images.length) {
        firebase.storage().ref('admin/media/images').child(article.images[0]).getDownloadURL().then(url =>
        {
          article = Object.assign(article, { imageURLShow: url })
        })
      }
    }
    return articleArray;
  }

  // get all notification
  async getAllNotification()
  {
    this.listNotification = await this.__notifService.getAllNotifications();
    this.listNotification.forEach(noti =>
    {
      if (noti.isReaded == false) this.notReadNumber += 1;
    });
  }

  // get all category
  async getAllCategory()
  {
    this.listCategory = await this.__utilsSerice.returnCategory();
  }

  // get alll article
  async getAllArticles()
  {
    this.allArticles = await this.adminService.getAllArticle();
    this.filterArticleToEachArrayAndLimit();
    this.mostVotedArticle = await this.__postService.getMostVotedArticle();
    Object.assign(this.mostVotedArticle, { imageURL: await this.__userService.getDowloadURL('admin/media/images', this.mostVotedArticle.images[0]) })
  }


  getArticleByCate(cateID, limit)
  {
    // let responseArr: Promise<any>;
    // responseArr = this.__postService.getArticleByRequires(cateID, 'NEW', 5);
    // responseArr.then(snapshot =>
    // {
    //   this.listArticleShowMenu = snapshot;
    // })
    this.listArticleShowMenu = [];
    this.allArticles.forEach((article, index) =>
    {
      if (article.cateID == cateID && index < limit) this.listArticleShowMenu.push(article);
    });
  }

  moreArticle(cateID)
  {
    this.__router.navigate(['/list-article', cateID])
  }

  displayNotification()
  {
    this.isShown = !this.isShown;
  }

  navigateSpecificArticleNotif(postID, notiID)
  {
    this.__socket.emit('read-notification', this.notReadNumber);
    this.__socket.emit('read-notification-change-color', notiID)
    firebase.firestore().collection('Notification').doc(notiID).update({ isReaded: true, color: '#393e46' }).then(() =>
    {
      this.__router.navigate(['/article', postID])
    })
  }
  navigateSpecificArticle(postID)
  {
    if (postID == 'randomOnTech') {
      let randomNumber = Math.floor(Math.random() * 3);
      let postIDRandom = this.subTechCate[randomNumber];
      this.__router.navigate(['/list-article', postIDRandom]);
      return;
    }
    this.__router.navigate(['/list-article', postID])
  }
  openMenu()
  {
    this.isMenuShown = !this.isMenuShown;
  }

  navigate()
  {
    this.__router.navigate(['/homepage'])
  }
}
