import { faker } from '@faker-js/faker';
import { Customer } from './models/Customer';
import { Order } from './models/Order';
import { OrderItem } from './models/OrderItem';
import { Part } from './models/Part';
import { Product } from './models/Product';

interface Database {
  customers: Customer[];
  orders: Order[];
  orderItems: OrderItem[];
  parts: Part[];
  products: Product[];
}

const database: Database = {
  customers: [],
  orders: [],
  orderItems: [],
  parts: [],
  products: [],
};

const entities = <T>(mapper: () => T, count: number): T[] =>
  Array(count)
    .fill(undefined)
    .map(() => mapper());

database.customers = entities(() => {
  const first = faker.name.firstName();
  const last = faker.name.lastName();
  return new Customer({
    first,
    last,
    city: faker.address.city(),
    state: faker.address.state(),
    email: faker.internet.email(first, last),
    street: faker.address.streetAddress(),
    street2: faker.address.secondaryAddress(),
    zip: faker.address.zipCode(),
    phone: faker.phone.number('(###) ###-###'),
  });
}, 20);

database.parts = entities(
  () =>
    new Part({
      cost: +faker.commerce.price(),
      description: faker.commerce.productDescription(),
      number: `${faker.datatype.number()}-${faker.commerce.productMaterial()}`,
    }),
  20
);

database.products = entities(
  () =>
    new Product({
      part: faker.helpers.arrayElement(database.parts),
      price: +faker.commerce.price(),
      description: faker.commerce.productDescription(),
      number: `${faker.datatype.number()}-${faker.commerce.productName()}`,
    }),
  20
);

database.orders = entities(
  () =>
    new Order({
      customer: faker.helpers.arrayElement(database.customers),
      dateToFulfill: faker.datatype.datetime(),
      number: `${faker.random.alphaNumeric()}-${faker.datatype.number()}`,
    }),
  10
);

database.orderItems = entities(
  () =>
    new OrderItem({
      order: faker.helpers.arrayElement(database.orders),
      price: +faker.commerce.price(),
      product: faker.helpers.arrayElement(database.products),
      qtyToFulfill: faker.datatype.number(),
    }),
  50
);

// inverse relations
database.orders = database.orders.map((order) => {
  const { id } = order;
  order.orderItems = database.orderItems.filter(
    ({ order: { id: orderId } }) => id === orderId
  );
  return order;
});

database.customers = database.customers.map((customer) => {
  const { id } = customer;
  customer.orders = database.orders.filter(
    ({ customer: { id: customerId } }) => id === customerId
  );
  return customer;
});

database.parts = database.parts.map((part) => {
  const { id } = part;
  part.products = database.products.filter(
    ({ part: { id: partId } }) => id === partId
  );
  return part;
});

database.products = database.products.map((product) => {
  const { id } = product;
  product.orderItems = database.orderItems.filter(
    ({ product: { id: productId } }) => id === productId
  );
  return product;
});

export { database };
