import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";

export async function createSession(userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  await prisma.session.create({
    data: {
      userId,
      token,
    },
  });
  
  return token;
}