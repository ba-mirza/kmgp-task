import {Injectable, signal, inject, effect, computed} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {Order, OrdersQueryParams, OrderStatus} from '../../../core/types';
import {OrdersApiService} from '../../../core/api/orders-api.service';
import {shareReplay, switchMap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersStateService {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private queryParams = toSignal(this.route.queryParams, {initialValue: {}});

  readonly customerName = signal('');
  readonly status = signal<OrderStatus | ''>('');
  readonly sort = signal<'createdAt' | 'total' | ''>('');
  readonly order = signal<'asc' | 'desc'>('asc');
  readonly page = signal(1);
  readonly limit = signal(10);

  protected ordersApiService = inject(OrdersApiService);

  private apiParams = computed((): OrdersQueryParams => ({
    _page: this.page(),
    _limit: this.limit(),
    _sort: this.sort() || undefined,
    _order: this.order(),
    status: this.status() || undefined,
    q: this.customerName() || undefined,
  }));

  private ordersData = toSignal(
    toObservable(this.apiParams).pipe(
      switchMap(params => {
        const cleanParams = Object.fromEntries(
          Object.entries(params).filter(([_, value]) => value !== undefined)
        );
        return this.ordersApiService.getOrders(cleanParams);
      }),
      shareReplay({bufferSize: 1, refCount: true})
    ),
    {initialValue: {orders: [] as Order[], total: 0}}
  );

  readonly orders = computed(() => this.ordersData().orders);
  readonly totalRecords = computed(() => this.ordersData().total);

  constructor() {
    effect(() => {
      const params = this.queryParams() as Record<string, string>;

      this.page.set(params['page'] ? parseInt(params['page'], 10) : 1);
      this.limit.set(params['limit'] ? parseInt(params['limit'], 10) : 10);
      this.sort.set((params['_sort'] as 'createdAt' | 'total') || undefined);
      this.order.set((params['_order'] as 'asc' | 'desc') || 'asc');
      this.status.set((params['status'] as OrderStatus) || undefined);
      this.customerName.set(params['q'] || '');
    });

    effect(() => {
      const queryParams: Record<string, string | number> = {};

      if (this.customerName()) queryParams['q'] = this.customerName();
      if (this.status()) queryParams['status'] = this.status();
      if (this.sort()) queryParams['_sort'] = this.sort();
      if (this.order()) queryParams['_order'] = this.order();
      if (this.page() > 1) queryParams['page'] = this.page() || 1;
      if (this.limit() !== 10) queryParams['limit'] = this.limit();

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: 'replace',
        replaceUrl: true
      });
    });
  }

  updateCustomerName(value: string) {
    this.customerName.set(value);
    this.page.set(1);
  }

  updateStatus(value: OrderStatus | '') {
    this.status.set(value);
    this.page.set(1);
  }

  updateSort(field: 'createdAt' | 'total', order: 'asc' | 'desc') {
    this.sort.set(field);
    this.order.set(order);
  }

  updatePagination(page: number, limit: number) {
    this.page.set(page);
    this.limit.set(limit);
  }
}
