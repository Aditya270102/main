import { Component } from '@angular/core';
import _filter from 'lodash/filter';
import _map from 'lodash/map';

@Component({
  selector: 'app-root',
  template: `
    <h3>Original Numbers: {{ numbers }}</h3>
    <h3>Even Numbers (using _filter): {{ evenNumbers }}</h3>
    <h3>Squares (using _map): {{ squares }}</h3>
  `
})
export class AppComponent {
  numbers = [1, 2, 3, 4, 5, 6];
  evenNumbers = _filter(this.numbers, n => n % 2 === 0);
  squares = _map(this.numbers, n => n * n)
}