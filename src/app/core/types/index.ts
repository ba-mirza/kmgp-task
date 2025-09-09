export interface Product {
  id: number;
  sku: string;
  title: string;
  price: number;
  stock: number;
  updatedAt: string;
}

export interface OrderItem {
  productId: number;
  qty: number;
  price: number;
}

export interface Order {
  id: number;
  number: string;
  customerName: string;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
}

export type OrderStatus = 'new' | 'processing' | 'completed' | 'cancelled';

export interface OrdersQueryParams {
  _page?: number;
  _limit?: number;
  _sort?: 'createdAt' | 'total' | 'customerName';
  _order?: 'asc' | 'desc';
  status?: OrderStatus;
  q?: string;
}

export interface ProductsQueryParams {
  q?: string;
}

export interface CreateOrderDto {
  number: string;
  customerName: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
}

export interface UpdateOrderDto extends Partial<CreateOrderDto> {}
