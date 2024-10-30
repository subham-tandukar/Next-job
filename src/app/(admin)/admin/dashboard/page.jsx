"use client";
import { signOut } from "next-auth/react";
import React from "react";
import { useSession } from "next-auth/react";

export default function AdminDashboard() {
  const { data: session } = useSession();
  console.log(session);
  
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div>
      Admin Dashboard
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
}
