"use client";
import React from "react";
import styles from "./Sidebar.module.scss";
import Link from "next/link";
import { AiOutlineDashboard } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="bottom-0 start-0 z-50 h-full w-[270px] border-e-2 border-gray-100 bg-white 2xl:w-72 fixed hidden xl:block dark:bg-gray-50">
      <div className="sticky top-0 z-40 bg-gray-0/10 px-6 pb-5 pt-5 dark:bg-gray-100/5 2xl:px-8 2xl:pt-6">
        <Link href="/">
          <Image
            width={155}
            height={28}
            src="/images/logo.png"
            alt="Site Logo"
            className="object-contain h-full object-left"
          />
        </Link>
      </div>

      <div className="h-[calc(100%-72px)]">
        <div className={styles["sidebar__wrapper"]}>
          <div className="mt-4 pb-3 3xl:mt-6">
            <h6 className={styles["menu__title"]}>Menu</h6>
            <div className="mb-5">
              <Link
                href="/admin/dashboard"
                className={`${styles["menu__item"]} ${
                  pathname.includes("dashboard") ? styles["active"] : ""
                }`}
              >
                <div className="flex items-center truncate">
                  <span className={styles["menu__icon"]}>
                    <AiOutlineDashboard />
                  </span>
                  <span className={styles["menu__link"]}>Dashboard</span>
                </div>
              </Link>

              <Link
                href="/admin/category"
                className={`${styles["menu__item"]} ${
                  pathname.includes("category") ? styles["active"] : ""
                }`}
              >
                <div className="flex items-center truncate">
                  <span className={styles["menu__icon"]}>
                    <BiCategory />
                  </span>
                  <span className={styles["menu__link"]}>Category</span>
                </div>
              </Link>
            </div>

            <h6 className={styles["menu__title"]}>Others</h6>
            <div className="mb-5">
              <Link
                href="/"
                className={`${styles["menu__item"]} ${
                  pathname.includes("settings") ? styles["active"] : ""
                }`}
              >
                <div className="flex items-center truncate">
                  <span className={styles["menu__icon"]}>
                    <IoSettingsOutline />
                  </span>
                  <span className={styles["menu__link"]}>Settings</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
