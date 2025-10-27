import {
  ProductEventPublisher,
  ProductUpdatedEvent,
} from '../app/product-event-publisher';

/**
 * Dummy implementation of ProductEventPublisher for tests and local dev.
 * Simply logs events to the console instead of publishing to a real message queue.
 */
export class DummyProductEventPublisher implements ProductEventPublisher {
  private events: ProductUpdatedEvent[] = [];

  async publishProductUpdated(event: ProductUpdatedEvent): Promise<void> {
    console.log('📢 Product Updated Event:', {
      productId: event.productId,
      name: event.name,
      pricePence: event.pricePence,
      description: event.description,
      updatedAt: event.updatedAt.toISOString(),
    });
    // Store the event for testing purposes
    this.events.push({ ...event });
  }

  /**
   * Helper method to retrieve published events (useful for testing).
   */
  getPublishedEvents(): ProductUpdatedEvent[] {
    return [...this.events];
  }

  /**
   * Helper method to clear published events (useful for testing).
   */
  clearEvents(): void {
    this.events = [];
  }
}
