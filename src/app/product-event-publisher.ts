/**
 * Event payload for when a product is updated.
 */
export type ProductUpdatedEvent = {
  productId: string;
  name: string;
  pricePence: number;
  description: string;
  updatedAt: Date;
};

/**
 * Application layer interface for publishing product-related events.
 * Implementations should handle the mechanics of event publishing
 * (e.g., to a message queue, event bus, or external service).
 */
export interface ProductEventPublisher {
  /**
   * Publish an event when a product is updated.
   */
  publishProductUpdated(event: ProductUpdatedEvent): Promise<void>;
}
