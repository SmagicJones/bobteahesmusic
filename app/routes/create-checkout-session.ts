import { redirect } from "react-router";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

// Helper to build URLs
function joinUrl(base: string, path: string) {
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

// --------------------
// Action
// --------------------
export async function action({ request }: any) {
  const formData = await request.formData();
  const amount = Number(formData.get("amount") ?? 500); // default £5
  const userId = formData.get("userId");
  const projectId = formData.get("projectId");
  const projectTitle = formData.get("projectTitle") || "Project Files";

  const successUrl = joinUrl(
    process.env.PUBLIC_SITE_URL!,
    `/dashboard?payment=success&project_id=${projectId}`,
  );
  const cancelUrl = joinUrl(
    process.env.PUBLIC_SITE_URL!,
    `/dashboard?payment=cancelled`,
  );

  // Create a Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "gbp",
          product_data: {
            name: `Access to: ${projectTitle}`,
            description: "Download all design files for this project",
          },
          unit_amount: amount, // in pence for GBP (500 = £5.00)
        },
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId: userId as string,
      projectId: projectId as string,
    },
    customer_email: (formData.get("userEmail") as string) || undefined,
  });

  return redirect(session.url!);
}
