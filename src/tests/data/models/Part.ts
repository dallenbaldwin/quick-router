import { Product } from './Product';
import { Base } from './shared';

export interface PartConstructor {
  number: string;
  description: string;
  cost: number;
  products?: Product[];
}

export interface Part extends PartConstructor, Base {}

export class Part extends Base {
  products: Product[];
  constructor({ cost, description, number, products }: PartConstructor) {
    super();
    this.cost = cost;
    this.number = number;
    this.description = description;
    this.products = products ?? [];
  }
}
