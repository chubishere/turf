import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { TimelinePage } from '../pages/timeline/timeline';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { MessageReplyPage } from '../pages/message-reply/message-reply';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { LocalNotifications } from '@ionic-native/local-notifications';

@NgModule({
  declarations: [
    MyApp,
    TimelinePage,
    ContactPage,
    HomePage,
    TabsPage,
    MessageReplyPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TimelinePage,
    ContactPage,
    HomePage,
    TabsPage,
    MessageReplyPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    File,
    LocalNotifications,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
