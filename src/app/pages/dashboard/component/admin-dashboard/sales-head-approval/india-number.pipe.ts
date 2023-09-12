import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indianNumber',
})
export class IndianNumberPipe implements PipeTransform {
  transform(value: number): string {
    if (isNaN(value)) return '';

    const lakh = 100000;
    const crore = 10000000;

    if (value >= crore) {
      return `${(value / crore).toLocaleString('en-IN')} Cr`;
    } else if (value >= lakh) {
      return `${(value / lakh).toLocaleString('en-IN')} Lakh`;
    } else {
      return value.toLocaleString('en-IN');
    }
  }
}
