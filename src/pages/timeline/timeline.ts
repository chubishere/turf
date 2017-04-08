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
    // If we navigated to this page, we will have an item available as a nav param
    //this.selectedItem = navParams.get('item');

    this.messages = Messages.get()
      .filterBy('archived', true)
      .sortBy('dateCreated', 'des');
  }

}
