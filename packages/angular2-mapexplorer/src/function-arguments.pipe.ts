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
