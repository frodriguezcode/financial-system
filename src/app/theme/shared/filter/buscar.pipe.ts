import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buscar'
})
export class BuscarPipe implements PipeTransform {

  transform(values: any[], searchText: string): any[] {
    if (!values || !values.length) { return []; }
    if (!searchText) { return values; }

    return values.filter(function (v: any[]) {
      let match = false;
      Object.keys(v).forEach((k: any) => {
        if (typeof v[k] === 'string') {
          match = match || v[k].toString().toLowerCase().indexOf(searchText.toLowerCase()) >= 0;
        } else {
          match = match || (v[k] || '').toString().toLowerCase() === searchText.toLowerCase(); // == intentinally
        }
      });
      return match;
    });
  }
}
