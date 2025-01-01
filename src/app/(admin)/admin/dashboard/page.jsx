"use client";
import React from "react";
import { useSession } from "next-auth/react";

export default function AdminDashboard() {
  const { data: session } = useSession();
  console.log(session);

  return (
    <>
      <div>
        <h1 className="the-heading">Dashboard</h1>
      </div>
    </>
  );
}
