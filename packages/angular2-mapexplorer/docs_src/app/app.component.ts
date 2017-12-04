import { Component } from "@angular/core";
import { MatIcon, MatIconRegistry } from "@angular/material";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  viewProviders: [MatIconRegistry],
})
export class AppComponent {
  private segmentShowed = {};

  public showSegmentCallback: Function;

  public hideSegmentCallback: Function;

  private agentURL: string;

  private agentURLInput: string;

  private mapId: string;

  private mapIdInput: string;

  private process: string;

  private processInput: string;

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
  }

  onSegmentHide(name) {
    this.segmentShowed[name] = false;
  }

  generateMap() {
    this.agentURL = this.agentURLInput;
    this.mapId = this.mapIdInput;
    this.process = this.processInput;
  }

  edit() {
    this.agentURLInput = this.agentURL;
    this.agentURL = null;
    this.mapIdInput = this.mapId;
    this.mapId = null;
    this.processInput = this.process;
    this.process = null;
  }
}
