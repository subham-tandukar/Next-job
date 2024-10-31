import React from "react";
import AdminSidebar from "../sidebar";

export default function AdminLayout({ children }) {
  return (
    <main className="flex min-h-screen flex-grow">
      <AdminSidebar />

      <div className="flex w-full flex-col xl:ms-[270px] xl:w-[calc(100%-270px)]">
        {children}
      </div>
    </main>
  );
}
