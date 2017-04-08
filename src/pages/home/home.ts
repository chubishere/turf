import { Component, NgZone } from '@angular/core';

import { NavController } from 'ionic-angular';
//import { LocalNotifications, ILocalNotification } from '@ionic-native/local-notifications';
import { Message, Messages, MessageResponseRequired } from '../../services/messages/message';
import { MessageReplyPage } from '../message-reply/message-reply';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  required = MessageResponseRequired;
  messages: Messages;
  numMessages: Number;

  constructor(private navCtrl:NavController) {
  }

  ionViewWillEnter() {
    this.update();
  }

  update() {
    this.messages = Messages.get().filterBy('isArchived', false);
    this.numMessages = Messages.get().filterBy('isArchived', false).length();
  }

  onMessageReply(message:Message) {
    this.navCtrl.push(MessageReplyPage, {
      message: message
    });
    this.update();
  }

  onMessageDismiss(message:Message) {
      message.dismiss();
      this.update();
  }
}
