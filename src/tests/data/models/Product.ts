import { OrderItem } from './OrderItem';
import { Part } from './Part';
import { Base, Price } from './shared';

export interface ProductConstructor extends Price {
  number: string;
  description: string;
  part: Part;
  orderItems?: OrderItem[];
}

export interface Product extends ProductConstructor, Base {}

export class Product extends Base {
  orderItems: OrderItem[];
  constructor({
    description,
    number,
    part,
    price,
    orderItems,
  }: ProductConstructor) {
    super();
    this.description = description;
    this.number = number;
    this.price = price;
    this.part = part;
    this.orderItems = orderItems ?? [];
  }
}
