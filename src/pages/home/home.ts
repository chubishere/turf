import { Component, NgZone } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  image: string = '';
  files: string[] = [];
  counter = 0;

  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private file:File,
    private zone:NgZone
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

}
