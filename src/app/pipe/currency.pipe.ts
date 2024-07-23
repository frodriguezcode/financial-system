import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencySymbol',
  standalone: true,
})
export class CurrencySymbolPipe implements PipeTransform {
    transform(value: any): any {
        if (value === null || value === undefined) return value;
        if (typeof value === 'string' && value.startsWith('$')) {
          return value;
        }
        return `$ ${value}`;
      }
  }