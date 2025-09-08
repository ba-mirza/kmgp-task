import {Injectable} from '@angular/core';
import { BaseApiService } from './base.api-service';
import {Order, OrdersQueryParams, UpdateOrderDto} from '../types';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersApiService extends BaseApiService {
  getOrders(params: OrdersQueryParams = {}): Observable<Order[]> {
    const overrideParams = this.buildParams(params);
    return this.http.get<Order[]>('/api/orders', { params: overrideParams });
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

  searchOrders(query: string, params: Omit<OrdersQueryParams, 'q'> = {}): Observable<Order[]> {
    return this.getOrders({ ...params, q: query });
  }

  getOrdersPaginated(page: number = 1, limit: number = 10, params: Omit<OrdersQueryParams, '_page' | '_limit'> = {}): Observable<Order[]> {
    return this.getOrders({
      ...params,
      _page: page,
      _limit: limit
    });
  }
}
