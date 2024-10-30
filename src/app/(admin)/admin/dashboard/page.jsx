"use client";
import { signOut } from "next-auth/react";
import React from "react";

export default function AdminDashboard() {
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
