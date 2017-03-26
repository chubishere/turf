import { Component, NgZone } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { LocalNotifications, ILocalNotification } from '@ionic-native/local-notifications';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  image: string = '';
  files: string[] = [];
  counter = 0;
  notificationCountdown: number = 3;
  notificationClicked: boolean = false;

  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private file: File,
    private lono: LocalNotifications,
    private zone: NgZone
  ) {}

  onCamera() {
    const options:CameraOptions = {
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      targetWidth: 800,
      targetHeight: 800,
    }
    this.camera.getPicture(options).then((imageData) => {
      this.file.resolveLocalFilesystemUrl(imageData).then((tmpFile) => {
       this.file.resolveDirectoryUrl(this.file.dataDirectory).then((dataDir) => {
         tmpFile.copyTo(dataDir, ++this.counter + tmpFile.name, 
           (entry) => {
             this.zone.run(() => {this.image = entry.nativeURL});
           },
           () => {console.log('stat')}
         );
       })
      });
    });
  }

  onFileList() {
    this.file.listDir(this.file.dataDirectory, '').then((entries) => {
      this.files.length = 0;
      entries.forEach((entry) => {
        this.files.push(entry.name);
      });
    });
  }

  onFileClear() {
    this.file.listDir(this.file.dataDirectory, '').then((entries) => {
      entries.forEach((entry) => {
        entry.remove(() => { console.log('Removed' + entry.name) });
      });
      this.onFileList();
    });
  }

  onLocalNotify() {
    this.notificationClicked = false;
    let originalNotificationCountdown = this.notificationCountdown;
    let interval = setInterval(() => {
        this.zone.run(() => {
          if( --this.notificationCountdown < 0 ) {
            clearInterval( interval );
            this.notificationCountdown = originalNotificationCountdown;
          }
        })
      },
      1000
    );
    const options: ILocalNotification = {
      id: 42,
      title: 'Title',
      text: 'Text',
      at: new Date(new Date().getTime() + 3 * 1000)
    }
    this.lono.schedule(options);
    this.lono.on('click', () => {
      console.log('clicko');
      this.zone.run(() => this.notificationClicked = true);
    })
  }

}
