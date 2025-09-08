import {BaseApiService} from './base.api-service';
import {Injectable} from '@angular/core';
import {Product, ProductsQueryParams} from '../types';
import {debounceTime, distinctUntilChanged, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsApiService extends BaseApiService {
  getProducts(params: ProductsQueryParams = {}): Observable<Product[]> {
    return this.get<Product[]>('/api/products', params);
  }

  getProduct(id: number): Observable<Product> {
    return this.get<Product>(`/api/products/${id}`);
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.getProducts({ q: query }).pipe(distinctUntilChanged(), debounceTime(1500));
  }
}
