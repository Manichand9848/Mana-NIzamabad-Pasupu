import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    ),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { order_id, name, email, phone, address, products, total } = req.body;

    if (!order_id) {
      return res.status(400).json({ error: "Missing order_id" });
    }

    // NEVER trust the browser about payment success. Ask Cashfree directly.
    const verifyRes = await fetch(
      `https://api.cashfree.com/pg/orders/${order_id}`,
      {
        method: "GET",
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2022-09-01",
        },
      }
    );

    const orderStatus = await verifyRes.json();

    if (orderStatus.order_status !== "PAID") {
      return res.status(402).json({
        error: "Payment not completed",
        status: orderStatus.order_status || "UNKNOWN",
      });
    }

    // Use the Cashfree order_id as the Firestore document id. That makes
    // this write idempotent: a page refresh, a double-click, a retry after
    // a dropped connection, or a burst of traffic all resolve to the same
    // document instead of creating duplicate customer records.
    const orderRef = db.collection("orders").doc(order_id);
    const existing = await orderRef.get();

    if (!existing.exists) {
      await orderRef.set({
        orderId: order_id,
        customerName: name || "",
        email: email || "",
        phone: phone || "",
        address: address || "",
        products: products || [],
        amount: orderStatus.order_amount ?? total ?? 0,
        paymentStatus: "paid",
        cashfreeStatus: orderStatus.order_status,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    const saved = (await orderRef.get()).data();

    return res.status(200).json({
      success: true,
      orderId: order_id,
      order: saved,
    });
  } catch (error) {
    console.error("save-order error:", error);
    return res.status(500).json({ error: "Failed to save order" });
  }
}
