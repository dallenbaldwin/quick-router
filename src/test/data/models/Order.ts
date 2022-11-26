import { Customer } from './Customer';
import { OrderItem } from './OrderItem';
import { Base, TotalPrice } from './shared';

export interface OrderConstructor {
  number: string;
  dateToFulfill: Date;
  customer: Customer;
  orderItems?: OrderItem[];
}

export interface Order extends Base, OrderConstructor, TotalPrice {}

export class Order extends Base {
  orderItems: OrderItem[];
  constructor({
    customer,
    dateToFulfill,
    number,
    orderItems,
  }: OrderConstructor) {
    super();
    this.customer = customer;
    this.dateToFulfill = dateToFulfill;
    this.number = number;
    this.orderItems = orderItems ?? [];
  }
  get totalPrice(): number {
    return this.orderItems.reduce(
      (prev, { totalPrice }) => prev + totalPrice,
      0,
    );
  }
}
