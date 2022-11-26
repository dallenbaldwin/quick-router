import { faker } from '@faker-js/faker';

export interface Base {
  id: string;
  dateCreated: Date;
}

export class Base {
  constructor() {
    this.id = faker.datatype.uuid();
    this.dateCreated = new Date();
  }
}

export interface TotalPrice {
  totalPrice: number;
}

export interface Price {
  price: number;
}
