import { Order } from './Order';
import { Base } from './shared';

export interface CustomerConstructor {
  first: string;
  last?: string;
  phone?: string;
  email: string;
  city: string;
  state: string;
  zip: string;
  street: string;
  street2?: string;
  orders?: Order[];
}

export interface Customer extends Base, CustomerConstructor {}

export class Customer extends Base {
  orders: Order[];
  constructor({
    city,
    email,
    first,
    last,
    phone,
    state,
    street,
    street2,
    zip,
    orders,
  }: CustomerConstructor) {
    super();
    this.first = first;
    this.last = last;
    this.phone = phone;
    this.email = email;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.street = street;
    this.street2 = street2;
    this.orders = orders ?? [];
  }
}
