import type { APIRoute } from "astro";
import Stripe from "stripe";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const secretKey = import.meta.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return new Response(
      JSON.stringify({ error: "Stripe is not configured. Set STRIPE_SECRET_KEY in .env" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const stripe = new Stripe(secretKey);

  try {
    const body = await request.json();
    const { priceId, quantity = 1 } = body;

    if (!priceId || typeof priceId !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid priceId" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const origin = new URL(request.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: Math.max(1, Math.min(99, Math.floor(quantity))),
        },
      ],
      success_url: `${origin}/shop/success/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop/cancel/`,
      shipping_address_collection: {
        allowed_countries: ["GR", "US", "GB", "DE", "FR", "IT", "ES", "NL", "BE", "AT", "CH", "SE", "DK", "NO", "FI", "PT", "IE", "CY"],
      },
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    console.error("Stripe checkout error:", err);
    const message = err instanceof Error ? err.message : "Failed to create checkout session";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
