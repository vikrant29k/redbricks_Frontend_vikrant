import { Directive } from '@angular/core';

@Directive({
  selector: '[multipleOfFive]'
})

export class MultipleOfFiveDirective {
  constructor() {}

  validate(inputValue:number) {
    return inputValue % 5 === 0;
  }
}
