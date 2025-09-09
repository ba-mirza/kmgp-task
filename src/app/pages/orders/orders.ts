import {Component, inject, OnInit, signal, DestroyRef} from '@angular/core';
import { TagModule } from 'primeng/tag';
import {TableLazyLoadEvent, TableModule} from 'primeng/table';
import {Order, OrderStatus} from '../../core/types';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputComponent} from '../../components/ui/input.component';
import { ListboxModule } from 'primeng/listbox';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {OrdersStateService} from './service/order.state-service';
import {AutoCompleteCompleteEvent, AutoCompleteModule} from 'primeng/autocomplete';
import {Router} from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [
    TagModule,
    TableModule,
    InputComponent,
    ReactiveFormsModule,
    ListboxModule,
    FormsModule,
    AutoCompleteModule
  ],
  providers: [
    OrdersStateService,
  ],
  templateUrl: './orders.html',
})
export class Orders implements OnInit {
  protected ordersState = inject(OrdersStateService);
  protected destroyRef = inject(DestroyRef);
  protected router = inject(Router);

  protected statusSuggestions = signal<{label: string, value: string}[]>([]);

  protected allStatuses = [
    {label: 'Все статусы', value: ''},
    {label: 'Новый', value: 'new'},
    {label: 'В обработке', value: 'processing'},
    {label: 'Завершен', value: 'completed'},
    {label: 'Отменен', value: 'cancelled'}
  ];

  protected statusControl = new FormControl<OrderStatus | ''>('');
  protected customerName = new FormControl('');

  protected orders = this.ordersState.orders;
  protected totalRecords = this.ordersState.totalRecords;

  protected formattedDate = (date: string) => new Date(date).toDateString();

  search(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    const filtered = this.allStatuses.filter(status =>
      status.label.toLowerCase().includes(query)
    );
    this.statusSuggestions.set(filtered);
  }

  onSort(event: {field: string, order: number}) {
    const field = event.field as 'createdAt' | 'total';
    const order = event.order === 1 ? 'asc' : 'desc';
    this.ordersState.updateSort(field, order);
  }

  onPageChange(event: TableLazyLoadEvent) {
    const page = (event.first || 0) + 1;
    const limit = event.rows;
    this.ordersState.updatePagination(page, limit || 10);
  }

  openEditPage(order: Order) {
    const productIds = order.items.map(item => item.productId).join(',');
    this.router.navigate([`/orders/${order.id}`], {
      queryParams: { products: productIds }
    });
  }

  ngOnInit(): void {
    this.customerName.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(customerName => {
      this.ordersState.updateCustomerName(customerName || '')
    });

    this.statusControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(status => {
      this.ordersState.updateStatus((status as OrderStatus) || '');
    })
  }
}
