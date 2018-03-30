/*
  Copyright 2017 Stratumn SAS. All rights reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import {
  Component,
  Input,
  OnInit,
  AfterContentInit,
  ViewChild
} from '@angular/core';
import { ChainTreeBuilderService } from '../chain-tree-builder.service';
import { ChainTreeBuilder } from '@indigocore/mapexplorer-core';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'st-map-explorer',
  templateUrl: './st-map-explorer.component.html',
  styleUrls: ['./st-map-explorer.component.css']
})
export class StMapExplorerComponent
  implements OnInit, AfterContentInit, OnChanges {
  @ViewChild('map') map;

  private error: string;

  private loading: boolean;

  private builder: ChainTreeBuilder;

  private defaultOptions: any;

  private segment;

  displayed: string;

  tags: Array<String> = [];

  onHide: () => void;

  @Input() chainscript: string;

  @Input() agentURL: string;

  @Input() refresh: any;

  @Input() name: string;

  @Input() process: string;

  @Input() mapId: string;

  @Input() onSegmentShow;

  @Input() onSegmentHide;

  constructor(public chainTreeBuilderService: ChainTreeBuilderService) {
    let self = this;

    this.defaultOptions = {
      onclick(d, onHide) {
        self.show(d.data, onHide);
      },
      onTag(tag) {
        if (tag) {
          self.tags = Array.from(new Set(self.tags.concat(tag)));
        }
      }
    };
  }

  ngOnInit() {
    this.builder = this.chainTreeBuilderService.getBuilder(
      this.map.nativeElement
    );
    this.displayed = 'state';
  }

  ngOnChanges() {
    this.build();
  }

  ngAfterContentInit() {
    this.build();
  }

  build() {
    if (this.builder) {
      this.error = null;
      this.loading = true;
      this.chainTreeBuilderService
        .build(this.builder, this, this.defaultOptions)
        .then(() => (this.loading = false))
        .catch(error => {
          this.loading = false;
          this.error = error.message;
        });
    }
  }

  show(segment, onHide) {
    this.segment = segment;
    this.onHide = onHide;
    this.onSegmentShow(this.name);
  }

  close() {
    this.segment = null;
    this.onSegmentHide(this.name);
    this.onHide();
  }

  display(tab) {
    this.displayed = tab;
  }

  state() {
    return JSON.stringify(this.segment.link.state, undefined, 2);
  }

  segmentJSON() {
    return JSON.stringify(this.segment, undefined, 2);
  }
}
