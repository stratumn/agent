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
  OnInit,
  OnChanges,
  ViewChild,
  Input,
  ElementRef
} from '@angular/core';
import { MerklePathTree } from '@indigocore/mapexplorer-core';

@Component({
  selector: 'st-merkle-path-tree',
  template: '<div class="merkle-path"></div>',
  styleUrls: ['./st-merkle-path-tree.component.css']
})
export class StMerklePathTreeComponent implements OnInit, OnChanges {
  @Input() merklePath;

  merklePathTree: MerklePathTree = null;

  constructor(public element: ElementRef) {}

  ngOnInit() {}

  ngOnChanges() {
    this.merklePathTree =
      this.merklePathTree || new MerklePathTree(this.element.nativeElement);
    this.merklePathTree.display(this.merklePath);
  }
}
