import { Address } from "viem";
import { paymentMiddleware, Network, Resource } from "x402-next";

const facilitatorUrl = process.env.NEXT_PUBLIC_FACILITATOR_URL as Resource;
const payTo = process.env.RESOURCE_WALLET_ADDRESS as Address;
const network = process.env.NETWORK as Network;

export const middleware = paymentMiddleware(
  payTo,
  {
    "/api/joke": {
      price: "$0.01",
      network,
      config: {
        description: "Get a random Chuck Norris joke",
      },
    },
  },
  {
    url: facilitatorUrl,
  },
  {
    appName: "x402 Demo",
    appLogo: "/logo.png",
  }
);

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/api/joke/:path*"],
};
