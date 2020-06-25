import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { UserService } from '../user.service';
import * as firebase from 'firebase';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UtilsService } from '../utils.service';
import { AdminServiceService } from '../admin-service.service';
import { Socket } from 'ngx-socket-io';
declare let alertify: any;
@Component({
  selector: 'app-add-new-article',
  templateUrl: './add-new-article.page.html',
  styleUrls: ['./add-new-article.page.scss'],
})
export class AddNewArticlePage implements OnInit
{

  user: any;

  public options: Object = {
    placeholderText: 'Edit Your Content Here!',
    charCounterCount: true,
    imageUpload: true,
    imageUploadMethod: 'POST',
    // Set max image size to 5MB.
    imageMaxSize: 5 * 1024 * 1024,
    events: {
      "image.beforeUpload": async function (files)
      {
        let editor = this;
        let file: File = files[0];
        let filename = `${new Date().getTime()}__${file.name}`
        async function resultImage()
        {
          // store to storage
          return new Promise((resolve, reject) =>
          {
            firebase.storage().ref('admin/media/images/' + filename).put(file).then(snapshot =>
            {
              let url = snapshot.metadata.fullPath;
              let name = snapshot.metadata.name;
              // display UI
              firebase.storage().ref(url).getDownloadURL().then(url =>
              {
                // store database
                firebase.firestore().collection('Article').orderBy('createdDate', 'desc').limit(1).get().then((snapshot) =>
                {
                  let docs = snapshot.docs[0].data()
                  let { images } = docs;
                  let { id } = snapshot.docs[0]
                  images.push(filename);
                  firebase.firestore().collection('Article').doc(id).update({ images }).then(() =>
                  {
                    resolve({ url: url, name: name });
                  })
                })
              })
            })
          })

        }
        let objectInstance: any = await resultImage();
        let url = objectInstance.url;
        let name = objectInstance.name;
        editor.image.insert(url, null, [name], editor.image.get());
        editor.popups.hideAll();
        return false;
        // Stop default upload chain.
      },
      "image.beforeRemove": function (files)
      {
        let editor = this;
        let filename;
        if (files[0].attributes['data-0']) {
          filename = files[0].attributes['data-0'].value;
          // remove image from storage
          firebase.storage().ref('admin/media/images/' + filename).delete().then(() =>
          {
            // store database
            firebase.firestore().collection('Article').get().then(snapshot =>
            {
              let docs = snapshot.docs;
              for (let i = 0; i < docs.length; i++) {
                if (i == docs.length - 1) {
                  let { images } = docs[i].data();
                  let { id } = docs[i];
                  images.pop();
                  firebase.firestore().collection('Article').doc(id).update({ images }).then(() =>
                  {
                    // Stop default upload chain.
                    return false;
                  })
                }
              }
            })
          })
        }
      },
      "video.beforeUpload": function (files)
      {
        let editor = this;
        let file: File = files[0];
        // store to storage
        firebase.storage().ref('admin/media/videos/' + file.name).put(file).then(snapshot =>
        {
          let url = snapshot.metadata.fullPath;
          let name = snapshot.metadata.name;
          firebase.storage().ref(url).getDownloadURL().then(url =>
          {
            // console.log(editor.video)
            // let video = document.createElement('video');
            // video.src = url;
            // editor.video.insertEmbed(video, null, [name], editor.video.get());
            // editor.popups.hideAll();
            // // Stop default upload chain.
            // return false;
          })
        })
      },
      // "video.beforeRemove": function (files)
      // {
      //   let editor = this;
      //   let filename = files[0].attributes['data-0'].value;
      //   // remove image from storage
      //   firebase.storage().ref('admin/media/videos/' + filename).delete().then(() =>
      //   {
      //     return false;
      //   })
      // },
    },
  };
  // editor content
  editorContent: any = '';
  // category list
  category: any;
  // list tag
  tags: Array<String> = [];

  // current article id
  currentArticleId: any = '';

  // series array 
  seriesArray: any;

  // result of searching series
  searchResult: any = [];
  constructor(private __authorService: AuthService, private __utilsService: UtilsService, private __router: Router, private __adminService: AdminServiceService, private __socket: Socket)
  {
    this.getCategory();
    this.getNewArticleId();
    this.getAllArticles();
  }

  async getCategory()
  {
    let category = await this.__utilsService.returnCategory();
    this.category = category;
  }
  ngOnInit()
  {
  }
  //get new article id
  async getNewArticleId()
  {
    let articleId = await this.__adminService.getArticleId();
    this.currentArticleId = articleId;
  }

  preview()
  {
    this.__authorService.previewContent = this.editorContent;
    this.__router.navigate(["/preview"])
  };

  generateNewArticle(f: NgForm)
  {
    if (f.value.cateID == '') {
      alertify.error('Bạn phải chọn kiểu bài viết');
      return;
    }

    Object.assign(f.value, { content: this.editorContent });
    f.value.tags = this.tags;
    firebase.firestore().collection('Article').doc(this.currentArticleId).update(
      f.value
    ).then(res =>
    {
      // this.__socket.emit('send-notification', { label: 'Một bài viết mới', title: f.value.title, adminID: 'vqRtwWgj9a00UvQfsbnF', postID: this.currentArticleId })
      alertify.success('Khởi tạo bài viết thành công');
      firebase.firestore().collection('Admin').get().then(snapshot =>
      {
        let followerResult: any;
        followerResult = snapshot.docs[0].data().followers;
        // notification for followers
        followerResult.forEach(element =>
        {
          firebase.firestore().collection('Notification').add({
            content: f.value.title,
            type: 'NP',
            to: element,
            isReaded: false,
            postID: this.currentArticleId,
            color: '#84a9ac',
            createdAt: new Date().getTime(),
          })
        });

        // notification for admin
        firebase.firestore().collection('Notification').add({
          content: f.value.title,
          type: 'NP',
          to: snapshot.docs[0].data().userID,
          isReaded: false,
          postID: this.currentArticleId,
          color: '#84a9ac',
          createdAt: new Date().getTime(),
        })
      })
    })
  }

  addTags(event)
  {
    let isExisted = false;
    if (event.keyCode == 13) {
      event.preventDefault();
      this.tags.forEach((tag, index, array) =>
      {
        if (tag.includes(event.target.value)) {
          alertify.error('This tag is existed');
          event.target.value = '';
          isExisted = true;
          return;
        }
      })
      if (isExisted == false) {
        this.tags.push(event.target.value);
        event.target.value = '';
      }
    }

  }

  //searching article stories
  searchSeriesArticle(event)
  {
    this.searchResult = [];
    let inputValue = event.target.value;
    this.seriesArray.forEach(element =>
    {
      if (element.title.toLowerCase().includes(inputValue) && inputValue !== '') {
        this.searchResult.push(element)
      }
    });
  }

  // add series part 
  addSeriesPart(postParentIDArgument, relativeTitle)
  {
    alertify.confirm(`Bạn đã chọn bài viết này là một phần trong chuỗi series của bài viết ${relativeTitle}`, 'Đồng ý?', function ()
    {
      firebase.firestore().collection('Article').orderBy('createdDate', 'desc').get().then(snapshot =>
      {
        let { postParentID } = snapshot.docs[0].data();
        let { id } = snapshot.docs[0];
        postParentID = postParentIDArgument;
        firebase.firestore().collection('Article').doc(id).update({ postParentID }).then(() => alertify.success('Cập nhật thành công'))
      })
    }, function ()
    {
      alertify.warning('Bạn đã huỷ bỏ thao tác này')
    })
  };

  async getAllArticles()
  {
    this.seriesArray = await this.__adminService.getAllArticle();
  }
}

