import { Router } from "express";
const router = Router();
import { PrismaClient } from "@prisma/client";
import Razorpay from "razorpay";
import authMiddleware from "./middleware/authMiddleware.js";

const prisma = new PrismaClient();

router.post("/orders", async (req, res) => {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: req.body.amount,
    currency: req.body.currency,
    payment_capture: 1,
  };

  try {
    const response = await razorpay.orders.create(options);
    res.json({
      order_id: response.id,
      currency: response.currency,
      amount: response.amount,
      success: true,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/payment/:paymentId", async (req, res) => {
  const { paymentId } = req.params;

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const payment = await razorpay.payments.fetch(paymentId);

    if (!payment) {
      return res.status(500).json({ error: "error at razorpay loading" });
    }

    res.json({
      status: payment.status,
      method: payment.method,
      amount: payment.amount,
      currency: payment.currency,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/activate-subscription", authMiddleware, async (req, res) => {
  const { paymentId, amount } = req.body;
  const userId = req.user.userId;

  try {
    const result = await prisma.$transaction(async (prisma) => {

      const paymentRecord = await prisma.payments.create({
        data: {
          userId,
          paymentId,
          amount,
        },
      });

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          isSubscribed: true,
        },
      });


      const subscriptionRecord = await prisma.subscription.upsert({
        where: { userId },
        update: {
          expiryDate: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
          daysWithService: { increment: 31 },
        },
        create: {
          userId,
          expiryDate: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
          daysWithService: 31,
        },
      });

      return { paymentRecord, subscriptionRecord, user };
    });

    res.status(201).json({
      message: 'Subscription activated successfully',
      "success": true,
      ...result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to activate subscription', "success": false });
  }
});

//setup a cron job for this
router.post('/update-subscriptions', async (req, res) => {
  const secret = req.headers['x-cron-secret'];
  if (secret !== process.env.CRON_SECRET) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    await prisma.$transaction(async (prisma) => {
      const activeSubscriptions = await prisma.subscription.findMany({
        where: { user: { isSubscribed: true } },
        include: { user: true },
      });

      await Promise.all(
        activeSubscriptions.map(async (sub) => {
          if (sub.daysWithService > 0) {
            await prisma.subscription.update({
              where: { id: sub.id },
              data: { daysWithService: sub.daysWithService - 1 },
            });
          }

          if (sub.daysWithService <= 1) {
            await prisma.user.update({
              where: { id: sub.userId },
              data: { isSubscribed: false },
            });
            await prisma.subscription.update({
              where: { id: sub.id },
              data: { daysWithService: 0 },
            });
          }
        })
      );
    });

    res.status(200).json({ message: 'Subscriptions updated successfully' });
  } catch (error) {
    console.error('Error updating subscriptions:', error);
    res.status(500).json({ message: 'Failed to update subscriptions' });
  }
});


export default router;
