import { createX402Client } from "x402-client";

const PRIVATE_KEY = process.env.PRIVATE_KEY;
// const BASE_URL = "https://pay.x402labs.dev";
const BASE_URL = "http://localhost:5000";

if (!PRIVATE_KEY) throw new Error("Missing PRIVATE_KEY");

// Step 1: POST form to get redirect URL
const formData = new URLSearchParams();
formData.append("email", "test@example.com");

const orderResponse = await fetch(`${BASE_URL}/demo/order`, {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: formData,
  redirect: "manual", // Don't follow redirect automatically
});

// Get the redirect URL from Location header
let redirectUrl = orderResponse.headers.get("location");
if (!redirectUrl) {
  throw new Error("No redirect URL received from server");
}
// Handle relative path
if (redirectUrl.startsWith("/")) {
  redirectUrl = BASE_URL + redirectUrl;
}
console.log("Redirect URL:", redirectUrl);

// Step 2: Create x402 client and query the redirect URL
const client = await createX402Client({
  chain: "base",
  privateKey: PRIVATE_KEY,
});

const response = await client.fetchWithPayment(redirectUrl, { method: "GET" });
console.log("Response headers:", Object.fromEntries(response.headers));
console.log("Response body:", await response.text());

const paymentHeader = response.headers.get("x-payment-response");
if (paymentHeader) {
  console.log("Decoded payment response:", client.decodePaymentResponse(paymentHeader));
}
