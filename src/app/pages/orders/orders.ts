import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {OrdersApiService} from '../../core/api/orders-api.service';
import { TagModule } from 'primeng/tag';
import {TableModule} from 'primeng/table';
import {Order, OrderStatus} from '../../core/types';
import {debounceTime, distinctUntilChanged, map, Observable, of, shareReplay, startWith, switchMap, tap} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputComponent} from '../../components/ui/input.component';
import { ListboxModule } from 'primeng/listbox';

@Component({
  selector: 'app-orders',
  imports: [
    TagModule,
    TableModule,
    AsyncPipe,
    InputComponent,
    ReactiveFormsModule,
    ListboxModule,
    FormsModule,
  ],
  templateUrl: './orders.html',
})
export class Orders implements OnInit {
  protected orderService = inject(OrdersApiService);

  protected orderList = signal<Observable<Order[]>>(of([]));
  protected show = signal<boolean>(false);
  protected statuses = signal<{status: OrderStatus}[]>([]);
  protected selectedStatus: OrderStatus = 'new';

  protected formattedDate = (date: string) => new Date(date).toDateString();

  protected customerName = new FormControl('')

  protected paginatorState = computed(() => (this.filteredOrders.length > 10));
  protected scrollableState = computed(() => (this.filteredOrders.length > 20))

  protected filteredOrders = computed((): Observable<Order[]> => {
    const control = this.customerName as FormControl;

    const nameChanges$ = control.valueChanges
      ? (control.valueChanges as Observable<string>).pipe(
        startWith(control.value ?? ''),
        debounceTime(200),
        distinctUntilChanged()
      )
      : of(control.value ?? '');

    return nameChanges$.pipe(
      switchMap((search) =>
        this.orderList().pipe(
          map(orders => {
            const q = (search ?? '').toString().toLowerCase().trim();
            if (!q) return orders;
            return orders.filter(o => (o.customerName ?? '').toLowerCase().includes(q));
          }),
          shareReplay(1),
        )
      )
    );
  });

  protected autoComplete(flag: boolean) {
    this.show.set(flag);
  }

  ngOnInit(): void {
    const orders = this.orderService.getOrders();
    this.statuses.set([
      {status: 'new'},
      {status: 'cancelled'},
      {status: 'completed'},
      {status: 'processing'},
    ]);
    this.orderList.set(orders);
  }
}
