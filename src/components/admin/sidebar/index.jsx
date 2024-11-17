import React from "react";
import styles from "./Sidebar.module.scss";
import Link from "next/link";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import Image from "next/image";

export default function AdminSidebar() {
  return (
    <aside className="bottom-0 start-0 z-50 h-full w-[270px] border-e-2 border-gray-100 bg-white 2xl:w-72 fixed hidden xl:block dark:bg-gray-50">
      <div className="sticky top-0 z-40 bg-gray-0/10 px-6 pb-5 pt-5 dark:bg-gray-100/5 2xl:px-8 2xl:pt-6">
        <a
          aria-label="Site Logo"
          className="text-gray-800 hover:text-gray-900 h-[28px]"
          href="/"
        >
          <Image
            width={155}
            height={28}
            src="/images/logo.png"
            alt="Site Logo"
            className="object-contain h-full object-left"
          />
        </a>
      </div>

      <div className="h-[calc(100%-72px)]">
        <div className={styles["sidebar__wrapper"]}>
          <div className="mt-4 pb-3 3xl:mt-6">
            <h6 className={styles["menu__title"]}>Menu</h6>
            <div className="mb-5">
              <Link href="/" className={styles["menu__item"]}>
                <div className="flex items-center truncate">
                  <span className={styles["menu__icon"]}>
                    <LuLayoutDashboard />
                  </span>
                  <span className={styles["menu__link"]}>Dashboard</span>
                </div>
              </Link>
            </div>

            <h6 className={styles["menu__title"]}>Others</h6>
            <div className="mb-5">
              <Link
                href="/"
                className={`${styles["menu__item"]} ${styles["active"]}`}
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
