import { Router } from 'express';
const router = Router();
import Razorpay from 'razorpay';

router.post('/orders' , async (req , res) => {
  const razorpay = new Razorpay ({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_KEY_SECRET
  })

  const options = {
    amount : req.body.amount,
    currency : req.body.currency,
    payment_capture : 1
  }

  try{
    const response = await razorpay.orders.create(options);
    res.json({
      order_id : response.id,
      currency : response.currency,
      amount : response.amount,
      success : true
    })
  }
  catch(e){
    console.log(e)
    res.status(500).json({"error" : "Internal server error"});
  }
})


router.get('/payment/:paymentId' , async(req, res) => {
  const {paymentId} = req.params;

  const razorpay = new Razorpay ({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_KEY_SECRET
  })

  try{
    const payment = await razorpay.payments.fetch(paymentId);

    if(!payment){
      return res.status(500).json({"error" : "error at razorpay loading"});
    }

    res.json({
      status : payment.status,
      method : payment.method,
      amount : payment.amount,
      currency : payment.currency
    })
  }
  catch(e){
    console.log(e)
    res.status(500).json({"error" : "Internal server error"});
  }
})

export default router;