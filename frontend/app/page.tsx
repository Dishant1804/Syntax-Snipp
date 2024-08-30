"use client"

import * as React from "react";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return <div>Loading or not signed in...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Clerk User Details</h1>
      <ul className="space-y-2">
        <li><strong>ID:</strong> {user.id}</li>
        <li><strong>First Name:</strong> {user.firstName}</li>
        <li><strong>Last Name:</strong> {user.lastName}</li>
        <li><strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}</li>
        <li><strong>Username:</strong> {user.username}</li>
      </ul>
    </div>
  );
}