import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
const dotenvParsed = dotenv.config().parsed;
const JWT_SECRET_MIDDLEWARE = dotenvParsed.JWT_SECRET;

export async function createSession(userId) {
  const token = jwt.sign(userId , JWT_SECRET_MIDDLEWARE);
  await prisma.session.create({
    data: {
      userId,
      token,
    },
  });
  
  return token;
}