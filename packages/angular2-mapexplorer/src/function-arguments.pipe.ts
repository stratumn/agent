/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'functionArguments'
})
export class FunctionArgumentsPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.map(arg => {
      if (arg instanceof Object) {
        return JSON.stringify(arg, undefined, 2);
      }
      return arg;
    }).join(', ');
  }

}
