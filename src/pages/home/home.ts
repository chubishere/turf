import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  imageData: String;

  constructor(
    public navCtrl: NavController,
    private camera: Camera
  ) {}

  onCamera() {
    const options:CameraOptions = {
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      targetWidth: 800,
      targetHeight: 800,
    }
    this.camera.getPicture(options).then((imageData) => {
      console.log(imageData);
      this.imageData = imageData;
      //this.imageData = 'data:image/jpeg;base64,' + imageData;
    });
  }

}
