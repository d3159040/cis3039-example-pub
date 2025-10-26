# CIS3039 Example Project

## API Endpoints

This project provides Azure Functions for managing products.

### Available Endpoints

- `GET /api/products` - List all products
- `POST /api/products` - Upsert (create or update) a product
- `PUT /api/products` - Upsert (create or update) a product

## Testing with curl

### Start the Function App

```bash
npm start
```

The function app will start on `http://localhost:7071`.

### List Products

```bash
curl http://localhost:7071/api/products
```

### Upsert a Product

Using the sample data file:

```bash
curl -X POST http://localhost:7071/api/products \
  -H "Content-Type: application/json" \
  -d @samples/product-post.json
```
