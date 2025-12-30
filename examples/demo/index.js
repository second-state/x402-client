import { createX402Client } from "x402-client";

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const TARGET_URL = "https://example.com/paid-resource";

if (!PRIVATE_KEY) throw new Error("Missing PRIVATE_KEY");

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
