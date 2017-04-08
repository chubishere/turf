import { Component, NgZone } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser/index';

import { NavController, NavParams } from 'ionic-angular';
import { Camera, File } from 'ionic-native';

import { Activities, Activity, ActivityFieldType } from '../../services/activities/activity';
import { Message } from '../../services/messages/message';

@Component({
  templateUrl: 'message-reply.html'
})
export class MessageReplyPage {
  message: Message;
  activity: Activity;
  replyText: string;
  fieldType = ActivityFieldType;
  data = {};

  // the Rock sandwich selfie
  imageSrc:string|SafeUrl = 'https://peopledotcom.files.wordpress.com/2016/12/dwanyne-johnson.jpg?w=669';
  imageBase64: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private zone:NgZone,
    private sanitiser:DomSanitizer
  ) {
    // If we navigated to this page, we will have an item available as a nav param
    this.message = navParams.get('message');
    if (typeof this.message.activityId === 'number') {
     this.activity = Activities.get( this.message.activityId );
    }
  }

  ionViewWillEnter() {
  }

  onImageChosen(event) {
  }

  onImageFile(imageData){
  }

  onSend() {
    let data = {
      user: 'me',
      activityData: {
        text: this.replyText,
        image: this.imageBase64
      }
    };
    this.message.reply(new Message(data));
    this.navCtrl.pop();
  }
}
