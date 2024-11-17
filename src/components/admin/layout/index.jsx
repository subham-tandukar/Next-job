import React from "react";
import AdminSidebar from "../sidebar";
import AdminHeader from "../header";

export default function AdminLayout({ children }) {
  return (
    <main className="flex min-h-screen flex-grow">
      <AdminSidebar />

      <div className="flex w-full flex-col xl:ms-[270px] xl:w-[calc(100%-270px)] 2xl:ms-72 2xl:w-[calc(100%-288px)]">
        <AdminHeader />
        {children}
      </div>
    </main>
  );
}
