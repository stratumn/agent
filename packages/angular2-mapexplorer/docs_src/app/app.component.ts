import { Component } from '@angular/core';
import { MdIcon, MdIconRegistry } from '@angular2-material/icon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  viewProviders: [MdIconRegistry]
})
export class AppComponent {

  private segmentShowed = {};

  public showSegmentCallback: Function;

  public hideSegmentCallback: Function;

  json = null;

  constructor() { 
    this.showSegmentCallback = this.onSegmentShow.bind(this);
    this.hideSegmentCallback = this.onSegmentHide.bind(this);
  }

  format() {
    this.json = JSON.stringify(this.json, undefined, 2);
  }

  onSegmentShow(name) {
    this.segmentShowed[name] = true;
  };

  onSegmentHide(name) {
    this.segmentShowed[name] = false;
  };
}
