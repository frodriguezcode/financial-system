import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencySymbol',
  standalone: true,
})
export class CurrencySymbolPipe implements PipeTransform {
  transform(value: any): any {
    if (value === null || value === undefined) return value;
    
    // Verifica si el valor es un número
    const numericValue = typeof value === 'number' ? value : parseFloat(value);

    if (isNaN(numericValue)) return value; // Si no es un número, devuelve el valor original

    // Formatea el número con comas de miles y el símbolo de dólar

    if(numericValue<0){

      return `-$ ${(numericValue*-1 ).toLocaleString('en-US')}`;
    }
    return `$ ${numericValue.toLocaleString('en-US')}`;
  }
  }