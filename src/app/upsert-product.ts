import { Product, createProduct, CreateProductParams } from '../domain/product';
import { ProductRepo } from '../domain/product-repo';
import { ProductEventPublisher } from './product-event-publisher';

export type UpsertProductDeps = {
  productRepo: ProductRepo;
  productEventPublisher: ProductEventPublisher;
  now: () => Date;
};

export type UpsertProductCommand = {
  id: string;
  name: string;
  pricePence: number;
  description: string;
};

export type UpsertProductResult = {
  success: boolean;
  data?: Product;
  error?: string;
};

/**
 * Create a use-case for upserting a product.
 * This will create a new product or update an existing one.
 * Usage:
 *   const result = await upsertProduct({ productRepo, now: () => new Date() }, productData);
 */
export async function upsertProduct(
  deps: UpsertProductDeps,
  command: UpsertProductCommand
): Promise<UpsertProductResult> {
  const { productRepo, productEventPublisher, now } = deps;

  try {
    // Validate and create the product entity
    const product = createProduct({
      ...command,
      updatedAt: now(),
    });

    // Save (upsert) the product
    const savedProduct = await productRepo.save(product);

    // NOTE: this is the danger zone where a crash will lead to the system being
    //  in an inconsistent state; the Outbox Pattern could help here.

    // Publish the product updated event
    await productEventPublisher.publishProductUpdated({
      productId: savedProduct.id,
      name: savedProduct.name,
      pricePence: savedProduct.pricePence,
      description: savedProduct.description,
      updatedAt: savedProduct.updatedAt,
    });

    return { success: true, data: savedProduct };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
