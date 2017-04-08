import { Component, NgZone } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser/index';

import { NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File, Entry, DirectoryEntry } from '@ionic-native/file';

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

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private zone: NgZone,
    private sanitiser: DomSanitizer,
    private camera: Camera,
    private file: File
  ) {
    // If we navigated to this page, we will have an item available as a nav param
    this.message = navParams.get('message');
    if (typeof this.message.activityId === 'number') {
     this.activity = Activities.get( this.message.activityId );
    }
  }

  ionViewWillEnter() {
  }

  onImageChose(event) {
    const options: CameraOptions = {
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.PICTURE,
      encodingType: this.camera.EncodingType.PNG,
      quality: 100,
      correctOrientation: true
    }

    this.camera.getPicture(options)
      .then(this.onImageFile.bind(this), this.onError.bind(this));
  }

  onImageFile(imageData: string) {
    let tmpImageFileEntry: Entry,
        getDataDir: any,
        copyImage: any,
        updateUi: any,
        handleError = this.onError.bind(this);

    getDataDir = (entry: Entry) => {
      tmpImageFileEntry = entry;
      return this.file.resolveDirectoryUrl(this.file.dataDirectory);
    }

    copyImage = (dataDir: DirectoryEntry) => {
      tmpImageFileEntry.copyTo(dataDir, tmpImageFileEntry.name,
        (storedImage: Entry) => { updateUi(storedImage) },
        handleError
      );
    };

    updateUi = (storedImage: Entry) => {
        this.zone.run(() => {
          this.imageSrc = storedImage.nativeURL;
        });
    }

    this.file.resolveLocalFilesystemUrl(imageData)
      .then(getDataDir)
      .then(copyImage)
      .catch(handleError);
  }

  onError(error){
    console.log(error);
  }

  onSend() {
    let data = {
      user: 'me',
      activityData: {
        text: this.replyText,
        image: this.imageSrc
      }
    };
    this.message.reply(new Message(data));
    this.navCtrl.pop();
  }
}
