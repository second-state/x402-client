# x402-client

Leverage the signing and payment mechanisms provided by `x402-fetch` to quickly build a client that can send paid requests to any x402-compatible endpoint.

## Installation

```bash
npm install x402-client
```

When developing directly in this repository, simply run `npm install` to pull in local dependencies.

## Usage

1. Prepare a private key with sufficient balance and export it via the `PRIVATE_KEY` environment variable.
2. Import `createX402Client` to build the client.
3. Call `client.fetchWithPayment()` to send HTTP requests; the returned response behaves like `fetch` while automatically attaching payment details in the headers.

```js
import { createX402Client } from "x402-client";

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const TARGET_URL = "https://example.com/paid-resource";

const client = await createX402Client({
  chain: "base",
  privateKey: PRIVATE_KEY,
});

const response = await client.fetchWithPayment(TARGET_URL, { method: "GET" });
console.log("Response headers:", Object.fromEntries(response.headers));
console.log("Response body:", await response.text());

const paymentHeader = response.headers.get("x-payment-response");
if (paymentHeader) {
  console.log("Decoded payment response:", client.decodePaymentResponse(paymentHeader));
}
```

## API

| Member | Description |
| --- | --- |
| `createX402Client(options)` | Constructs a client exposing `fetchWithPayment` and `decodePaymentResponse`. `options` accepts `chain` (defaults to `base`), `privateKey`, and an optional `fetchImpl`. |
| `client.fetchWithPayment(input, init)` | Mirrors the native `fetch` interface while automatically appending the required x402 payment headers. |
| `client.decodePaymentResponse(header)` / `decodePaymentResponse(header)` | Parses the `x-payment-response` header into a structured object. |
