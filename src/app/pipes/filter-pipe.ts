import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
  name: 'filter',
})
@Injectable()
export class FilterPipe implements PipeTransform {
  transform(items: any[], field: string, value: string): any[] {
    console.log(items);
    if (!items) {
      return [];
    }
    if (!field || !value) {
      return items;
    }
    console.log('test');
    return items.filter(singleItem =>
      singleItem[field].toLowerCase().includes(value.toLowerCase())
    );
  }
}
