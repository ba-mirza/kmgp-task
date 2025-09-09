import {Injectable} from '@angular/core';
import { BaseApiService } from './base.api-service';
import {Order, OrdersQueryParams, UpdateOrderDto} from '../types';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersApiService extends BaseApiService {
  getOrders(params: OrdersQueryParams = {}): Observable<{orders: Order[], total: number}> {
    const overrideParams = this.buildParams(params);
    return this.http.get<Order[]>('/api/orders', {
      params: overrideParams,
      observe: 'response'
    }).pipe(
      map(response => ({
        orders: response.body || [],
        total: parseInt(response.headers.get('X-Total-Count') || '0', 10)
      }))
    );
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`/api/orders/${id}`);
  }

  updateOrder(id: number, order: UpdateOrderDto): Observable<Order> {
    return this.put<Order>(`/api/orders/${id}`, order);
  }

  deleteOrder(id: number): Observable<void> {
    return this.delete<void>(`/api/orders/${id}`);
  }

  searchOrders(query: string, params: Omit<OrdersQueryParams, 'q'> = {}): Observable<{orders: Order[], total: number}> {
    return this.getOrders({ ...params, q: query });
  }

  getOrdersPaginated(page: number = 1, limit: number = 10, params: Omit<OrdersQueryParams, '_page' | '_limit'> = {}): Observable<{orders: Order[], total: number}> {
    return this.getOrders({
      ...params,
      _page: page,
      _limit: limit
    });
  }
}
