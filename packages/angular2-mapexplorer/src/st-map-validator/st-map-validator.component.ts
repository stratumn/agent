/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { MapValidatorService } from '../map-validator.service';

@Component({
  selector: 'st-map-validator',
  templateUrl: './st-map-validator.component.html',
  styleUrls: ['./st-map-validator.component.css']
})
export class StMapValidatorComponent implements OnInit, OnChanges {

  @Input() chainscript: string;

  errors: any = {};

  error: string = null;

  loading: boolean = false;

  constructor(public mapValidatorService: MapValidatorService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.error = null;
    if (this.chainscript) {
      this.loading = true;
      this.mapValidatorService.validate(this.chainscript)
        .then(errors => {
          this.errors = errors;
          this.loading = false;
        }).catch(error => {
          this.error = error.message;
          this.loading = false;
        });
    }
  }
}
