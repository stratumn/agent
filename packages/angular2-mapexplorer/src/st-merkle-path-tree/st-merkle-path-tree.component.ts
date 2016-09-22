import { Component, OnInit, OnChanges, ViewChild, Input, ElementRef } from '@angular/core';
import { MerklePathTree } from 'mapexplorer-core'; 

@Component({
  selector: 'st-merkle-path-tree',
  template: '<div class="merkle-path"></div>',
  styleUrls: ['./st-merkle-path-tree.component.css']
})
export class StMerklePathTreeComponent implements OnInit, OnChanges {

  @Input() merklePath;

  merklePathTree: MerklePathTree = null;

  constructor(public element: ElementRef) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.merklePathTree = this.merklePathTree || new MerklePathTree(this.element.nativeElement);
    this.merklePathTree.display(this.merklePath);
  }
}
