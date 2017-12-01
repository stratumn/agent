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

import { Component, OnInit, OnChanges, Input } from "@angular/core";

@Component({
  selector: "st-promise-loader",
  templateUrl: "./st-promise-loader.component.html",
  styleUrls: ["./st-promise-loader.component.css"],
})
export class StPromiseLoaderComponent implements OnInit, OnChanges {
  @Input() title: string;

  @Input() loading: boolean;

  @Input() errors: Array<String>;

  errorMessages = [];

  loadingErrors = false;

  success = false;

  error = false;

  errorsShowed = false;

  toggleErrors = () => {
    this.errorsShowed = !this.errorsShowed;
  };

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    this.errorMessages = [];
    this.success = false;
    this.error = false;
    if (this.errors) {
      this.loadingErrors = true;
      Promise.all(this.errors)
        .then(errs => {
          this.errorMessages = errs.filter(Boolean);
          this.loadingErrors = false;
          this.success = this.errorMessages.length === 0;
          this.error = !this.success;
        })
        .catch(err => {
          console.log(err);
          this.loadingErrors = false;
        });
    }
  }
}
