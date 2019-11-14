import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toArray'
})
export class ToArrayPipe implements PipeTransform {
  transform(value, args: string[]): any {
    if (value != null) {
      return Object.values(value);
    }
  }
}
