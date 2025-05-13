import express from "express";
import authRoutes from "./api/v1/authroutes.js";
import snippetRoutes from "./api/v1/snippetroutes.js";
import paymentRoutes from "./api/v1/paymentroutes.js";
import passport from "./api/v1/config/passportConfig.js";
import './subscriptionCron.js';
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";


const app = express();

const corsOptions = {
  origin: ["https://github.com/", "http://localhost:54321", "https://backend.syntax-snipp.xyz", "https://www.syntax-snipp.xyz", "http://localhost:3001", "http://localhost:3000", "https://checkout.razorpay.com"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors(corsOptions));
app.use(passport.initialize());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/snippet", snippetRoutes);
app.use("/api/v1/payments", paymentRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
