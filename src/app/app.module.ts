import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import 'chartjs-plugin-zoom';
// Import a Froala Editor language file.
import 'froala-editor/js/languages/de.js';
// Froala
// Import all Froala Editor plugins.
import 'froala-editor/js/plugins.pkgd.min.js';
// Import a single Froala Editor plugin.
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/third_party/embedly.min';
// Import a third-party plugin.
import 'froala-editor/js/third_party/font_awesome.min';
import 'froala-editor/js/third_party/image_tui.min';
import 'froala-editor/js/third_party/spell_checker.min';

import { ChartsModule } from 'ng2-charts';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from './../environments/environment';
import { AddArticleGuard } from './add-article.guard';
import { AdminServiceService } from './admin-service.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { LoginService } from './login.service';
import { NotificationService } from './notification.service';
import { UtilsService } from './utils.service';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

export function initConfiguration(loginService: LoginService)
{
  return (): Promise<any> => loginService.loadUser();
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, AngularFireModule.initializeApp(environment.firebaseConfig), SocketIoModule.forRoot(config)],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: APP_INITIALIZER, useFactory: initConfiguration, multi: true, deps: [LoginService] },
    ChartsModule,
    DataService,
    UtilsService,
    AuthService,
    AuthGuard,
    AddArticleGuard,
    AdminServiceService,
    NotificationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
