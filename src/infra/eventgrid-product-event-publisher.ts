import {
  ProductEventPublisher,
  ProductUpdatedEvent,
} from '../app/product-event-publisher';
import { EventGridPublisherClient, AzureKeyCredential } from '@azure/eventgrid';
import { randomUUID } from 'crypto';

export type EventGridOptions = {
  endpoint: string;
  key: string;
};

/**
 * Azure Event Grid implementation of ProductEventPublisher.
 * Publishes product events to an Event Grid topic.
 */
export class EventGridProductEventPublisher implements ProductEventPublisher {
  private client: EventGridPublisherClient<'CloudEvent'>;

  constructor(options: EventGridOptions) {
    if (!options.endpoint || options.endpoint.trim() === '') {
      throw new Error(
        'EventGridProductEventPublisher requires a non-empty endpoint'
      );
    }
    if (!options.key || options.key.trim() === '') {
      throw new Error(
        'EventGridProductEventPublisher requires a non-empty key'
      );
    }

    this.client = new EventGridPublisherClient(
      options.endpoint,
      'CloudEvent',
      new AzureKeyCredential(options.key)
    );
  }

  async publishProductUpdated(event: ProductUpdatedEvent): Promise<void> {
    const cloudEvent = {
      id: randomUUID(),
      type: 'shopping.product.updated',
      source: '/catalogue/products',
      subject: `products/${event.productId}`,
      time: new Date(),
      specversion: '1.0',
      datacontenttype: 'application/json',
      data: {
        id: event.productId,
        name: event.name,
        pricePence: event.pricePence,
        description: event.description,
        updatedAt: event.updatedAt.toISOString(),
      },
    };

    await this.client.send([cloudEvent]);
  }
}
