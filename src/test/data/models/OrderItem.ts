import { Order } from './Order';
import { Product } from './Product';
import { Base, TotalPrice, Price } from './shared';

export interface OrderItemConstructor extends Price {
  product: Product;
  order: Order;
  qtyToFulfill: number;
}

export interface OrderItem extends Base, OrderItemConstructor, TotalPrice {}

export class OrderItem extends Base {
  constructor({ order, price, product, qtyToFulfill }: OrderItemConstructor) {
    super();
    this.order = order;
    this.product = product;
    this.price = price;
    this.qtyToFulfill = qtyToFulfill;
    this.totalPrice = price * qtyToFulfill;
  }
}
