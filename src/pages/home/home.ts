import { Component, NgZone } from '@angular/core';

import { NavController } from 'ionic-angular';
//import { Camera, CameraOptions } from '@ionic-native/camera';
//import { File } from '@ionic-native/file';
//import { LocalNotifications, ILocalNotification } from '@ionic-native/local-notifications';
import { Message, Messages, MessageResponseRequired } from '../../services/messages/message';
import { MessageReplyPage } from '../message-reply/message-reply';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private data:{};
  required = MessageResponseRequired;

  constructor(private navCtrl:NavController) {
  }

  ionViewWillEnter() {
  }

  ionViewDidLoad(){
  }

  messages() {
    return Messages.get().filterBy('archived', false);
  }

  numMessages() {
    let count = Messages.get().filterBy('archived', false).length();
    return count;
  }

  onMessageReply(message:Message) {
    this.navCtrl.push(MessageReplyPage, {
      message: message
    });
  }

  onMessageDismiss(message:Message) {
      message.dismiss();
  }
}
