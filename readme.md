# Event Publishing Example

## API Endpoints

This project provides Azure Functions for managing products.

### Available Endpoints

- `GET /api/products` - List all products
- `POST /api/products` - Upsert (create or update) a product
- `PUT /api/products` - Upsert (create or update) a product

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create your local settings file:

Copy the template to create your local development settings:

```bash
cp local.settings.template.json local.settings.json
```

> **Note:** Never commit your `local.settings.json` to source control. The template is safe to share.

3. Build the project:

```bash
npm run build
```

## Azure Setup

### Sign into Azure CLI

Prepare for using the az CLI commands.

1. Ensure you are signed in:

```bash
az login
az account show
```

You should see your account properties displayed if you are successfully signed in.

2. Ensure you know which locations (e.g. uksouth) you are permitted to use:

```bash
az policy assignment list \
  --query "[?name.contains(@, 'sys.regionrestriction')].parameters.listOfAllowedLocations.value | []" \
  -o tsv
```

### Create a Resource Group and Event Grid Topic

1. Create a resource group (if you do not already have one for this deployment):

```bash
az group create \
  --name shopping-dev-cs47-rg \
  --location germanywestcentral
```

Remember to follow our naming convention, e.g. shopping-lab-ab47-rg

2. Create the Event Grid topic:

```bash
az eventgrid topic create \
  --name shopping-dev-cs47-products-topic \
  --resource-group shopping-dev-cs47-rg \
  --location germanywestcentral \
  --input-schema CloudEventSchemaV1_0 \
  --sku basic
```

For topic name, include an extra part for event source, e.g. shopping-lab-ab47-products-topic

### Get the configuration needed to run this app locally

1. Get the topic endpoint (you'll need the endpoint to publish):

```bash
az eventgrid topic show \
  --name shopping-dev-cs47-products-topic \
  --resource-group shopping-dev-cs47-rg \
  --query "endpoint" \
  -o tsv
```

> Update `src/config/appServices.ts` to point the app at your topic endpoint.

2. Get the topic access key (you'll need the key to publish):

```bash
az eventgrid topic key list \
  --name shopping-dev-cs47-products-topic \
  --resource-group shopping-dev-cs47-rg \
  --query "key1" \
  -o tsv
```

> Either enter the key into your `local.settings.json` or write it to the shell:

```bash
export EVENTGRID_KEY=<your-eventgrid-key-here>
```

## Local testing with curl

### Start the Function App

```bash
npm start
```

The function app will start on `http://localhost:7071`.

### List Products

Split the VS Code terminal so you can see the output from the localling running app whilst having a new shell prompt to make a test HTTP call:

```bash
curl http://localhost:7071/api/products
```

The fake repo initialises empty, so expect an empty array of products.

### Upsert a Product

Using the sample data file (and a new bash terminal):

```bash
curl -X POST http://localhost:7071/api/products \
  -H "Content-Type: application/json" \
  -d @samples/product-post.json
```

If you have a subscriber attached to the Event Grid Topic, it should recieve the product.updated event now.

List products again should show the new item.
