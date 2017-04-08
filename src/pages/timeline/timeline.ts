import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Messages, Message } from '../../services/messages/message';

@Component({
  selector: 'page-timeline',
  templateUrl: 'timeline.html'
})
export class TimelinePage {
  selectedItem: any;
  messages: Messages;
  dateFormat: string = Message.dateFormat;
  dateTimeFormat: string = Message.dateTimeFormat;

  constructor(public navCtrl: NavController) {
  }

  ionViewDidLoad(){
  }

  ionViewWillEnter() {
    this.messages = Messages.get()
      .filterBy('hasPrompt', false)
      .filterBy('isArchived', true)
      .sortBy('dateCreated', 'des');
    console.log(Messages);
  }

}
