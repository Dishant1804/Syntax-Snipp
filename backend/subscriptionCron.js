
import cron from 'node-cron';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

cron.schedule('0 0 * * *', async () => {
  try {
    await axios.post(`${process.env.BACKEND_URL}/api/v1/payments/update-subscriptions`, {}, {
      headers: {
        'x-cron-secret': process.env.CRON_SECRET,
      },
    });
    console.log('Subscription update triggered');
  } catch (error) {
    console.error('Cron job failed:', error.message);
  }
});
