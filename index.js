import { decodeXPaymentResponse, wrapFetchWithPayment, createSigner } from "x402-fetch";

const DEFAULT_CHAIN = "base";

/**
 * Creates a client capable of issuing paid HTTP requests via x402.
 */
export async function createX402Client({ chain = DEFAULT_CHAIN, privateKey, fetchImpl = globalThis.fetch } = {}) {
  if (!privateKey) {
    throw new Error("privateKey is required to create an x402 client");
  }

  if (typeof fetchImpl !== "function") {
    throw new Error("A valid fetch implementation must be provided");
  }

  const signer = await createSigner(chain, privateKey);
  const fetchWithPayment = wrapFetchWithPayment(fetchImpl, signer);

  return {
    fetchWithPayment,
    decodePaymentResponse: header => (header ? decodeXPaymentResponse(header) : null),
  };
}

/**
 * Convenience helper for decoding an x-payment-response header.
 */
export function decodePaymentResponse(headerValue) {
  return headerValue ? decodeXPaymentResponse(headerValue) : null;
}
