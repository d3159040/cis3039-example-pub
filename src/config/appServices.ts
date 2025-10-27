import { ListProductsDeps } from '../app/list-products';
import { UpsertProductDeps } from '../app/upsert-product';
import { ProductRepo } from '../domain/product-repo';
import { FakeProductRepo } from '../infra/fake-product-repo';
import { ProductEventPublisher } from '../app/product-event-publisher';
import {
  EventGridProductEventPublisher,
  EventGridOptions,
} from '../infra/eventgrid-product-event-publisher';

const EVENTGRID_OPTIONS: EventGridOptions = {
  endpoint: 'https://example.eventgrid.azure.net/api/events',
  key: process.env.EVENTGRID_KEY,
};

let cachedProductRepo: ProductRepo | null = null;
let cachedProductEventPublisher: ProductEventPublisher | null = null;

export const getProductRepo = (): ProductRepo => {
  if (!cachedProductRepo) {
    cachedProductRepo = new FakeProductRepo();
  }
  return cachedProductRepo;
};

export const getProductEventPublisher = (): ProductEventPublisher => {
  if (!cachedProductEventPublisher) {
    cachedProductEventPublisher = new EventGridProductEventPublisher(
      EVENTGRID_OPTIONS
    );
  }
  return cachedProductEventPublisher;
};

export const makeListProductsDeps = (): ListProductsDeps => ({
  productRepo: getProductRepo(),
});

export const makeUpsertProductDeps = (): UpsertProductDeps => ({
  productRepo: getProductRepo(),
  productEventPublisher: getProductEventPublisher(),
  now: () => new Date(),
});
