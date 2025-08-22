import { Component } from '@angular/core';
import { _map } from 'lodash/map';

@Component({
  selector: 'app-root',

})
export class AppComponent {
  numbers = [1, 2, 3, 4, 5, 6];
  evenNumbers = this.numbers.filter(n => n % 2 === 0);
  squares = _map(this.numbers, n => n * n)
  sum = this.numbers.some(n => n === 2)
}