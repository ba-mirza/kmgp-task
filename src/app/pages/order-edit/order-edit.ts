import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {ProductsApiService} from '../../core/api/products.api-service';
import {Product} from '../../core/types';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {OrderForm} from '../../components/order-form/order-form';

@Component({
  selector: 'app-order-edit',
  imports: [
    OrderForm
  ],
  templateUrl: './order-edit.html',
})
export class OrderEdit implements OnInit {
  protected readonly route = inject(ActivatedRoute);
  protected productService = inject(ProductsApiService);
  protected destroy = inject(DestroyRef);

  protected products = signal<Product[]>([]);

  ngOnInit(): void {
    const productsParam = this.route.snapshot.queryParams['products'];
    if (productsParam) {
      const productIds = productsParam.split(',').map((id: string) => parseInt(id, 10));
      this.productService.getProductsByIds(productIds)
        .pipe(takeUntilDestroyed(this.destroy))
        .subscribe(products => {
          this.products.set(products);
        });
    }
  }
}
