import {Component, input} from '@angular/core';
import {ButtonComponent} from '../ui/button.component';
import {Product} from '../../core/types';

@Component({
  selector: 'app-order-form',
  imports: [
    ButtonComponent,
  ],
  templateUrl: './order-form.html',
})
export class OrderForm {
  products = input<Product | Product[]>();

  protected readonly Array = Array;
}
