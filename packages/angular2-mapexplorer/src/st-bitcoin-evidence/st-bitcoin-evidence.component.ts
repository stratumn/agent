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

import { Component, Input, ElementRef } from "@angular/core";

@Component({
  selector: "st-bitcoin-evidence",
  templateUrl: "./st-bitcoin-evidence.component.html",
  styleUrls: ["./st-bitcoin-evidence.component.css"]
})
export class StBitcoinEvidenceComponent {
  @Input() evidence;

  constructor(public element: ElementRef) {}

  transactionUrl() {
    let txid = this.evidence.proof.txid;
    if (this.evidence.provider.match(/test/)) {
      return `https://live.blockcypher.com/btc-testnet/tx/${txid}`;
    } else {
      return `https://blockchain.info/tx/${txid}`;
    }
  }

  date() {
    return new Date(this.evidence.proof.timestamp * 1000).toUTCString();
  }
}
