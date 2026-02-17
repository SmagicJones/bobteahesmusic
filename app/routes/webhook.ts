import type { ActionFunctionArgs } from "react-router";
import Stripe from "stripe";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "~/firebase/firebaseAdmin"; // ← swap this

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function action({ request }: ActionFunctionArgs) {
  const payload = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return new Response(JSON.stringify({ error: "No signature" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err);
    return new Response(
      JSON.stringify({ error: "Webhook verification failed" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const projectId = session.metadata?.projectId;

    if (userId && projectId) {
      try {
        const projectRef = adminDb
          .collection("users")
          .doc(userId)
          .collection("projects")
          .doc(projectId);

        await projectRef.update({
          paid: true,
          paymentId: session.id,
          paymentDate: FieldValue.serverTimestamp(), // ← admin version
          paymentAmount: session.amount_total,
          paymentCurrency: session.currency,
        });

        console.log(`✅ Project ${projectId} unlocked for user ${userId}`);
      } catch (error) {
        console.error("❌ Error updating Firestore:", error);
        return new Response(
          JSON.stringify({ error: "Database update failed" }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        );
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// import type { ActionFunctionArgs } from "react-router";
// import Stripe from "stripe";
// import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
// import { db } from "~/firebase/firebaseConfig";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2026-01-28.clover",
// });

// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// export async function action({ request }: ActionFunctionArgs) {
//   const payload = await request.text();
//   const sig = request.headers.get("stripe-signature");

//   if (!sig) {
//     return new Response(JSON.stringify({ error: "No signature" }), {
//       status: 400,
//       headers: { "Content-Type": "application/json" },
//     });
//   }

//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
//   } catch (err) {
//     console.error("❌ Webhook signature verification failed:", err);
//     return new Response(
//       JSON.stringify({ error: "Webhook verification failed" }),
//       {
//         status: 400,
//         headers: { "Content-Type": "application/json" },
//       },
//     );
//   }

//   // Handle successful payment
//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object as Stripe.Checkout.Session;
//     const userId = session.metadata?.userId;
//     const projectId = session.metadata?.projectId;

//     console.log("💳 Payment received:", {
//       sessionId: session.id,
//       userId,
//       projectId,
//       amount: session.amount_total,
//     });

//     if (userId && projectId) {
//       try {
//         // Update Firestore to mark project as paid
//         const projectRef = doc(db, "users", userId, "projects", projectId);
//         await updateDoc(projectRef, {
//           paid: true,
//           paymentId: session.id,
//           paymentDate: serverTimestamp(),
//           paymentAmount: session.amount_total,
//           paymentCurrency: session.currency,
//         });

//         console.log(`✅ Project ${projectId} unlocked for user ${userId}`);
//       } catch (error) {
//         console.error("❌ Error updating Firestore:", error);
//         return new Response(
//           JSON.stringify({ error: "Database update failed" }),
//           {
//             status: 500,
//             headers: { "Content-Type": "application/json" },
//           },
//         );
//       }
//     } else {
//       console.warn("⚠️ Missing userId or projectId in session metadata");
//     }
//   }

//   return new Response(JSON.stringify({ received: true }), {
//     status: 200,
//     headers: { "Content-Type": "application/json" },
//   });
// }
