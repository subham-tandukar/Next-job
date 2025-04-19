"use client";
import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ConfirmModal from "../modal/confirmModal";
import { FaUserCircle } from "react-icons/fa";

export default function AdminHeader() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        // You can adjust this value as needed
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const email = session?.user?.email;
  const fullname = session?.user?.name;
  const firstname = fullname?.split(" ")[0].charAt(0).toUpperCase();
  const lastname = fullname?.split(" ")[1].charAt(0).toUpperCase();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header
      className={`${
        scrolled ? "card-shadow" : ""
      } sticky top-0 flex items-center bg-gray-0/80 p-4 backdrop-blur-xl dark:bg-gray-50/50 md:px-5 lg:px-6 z-50 2xl:py-5 3xl:px-8 4xl:px-10`}
    >
      <div className="flex w-full max-w-2xl items-center">
        <button
          aria-label="Search"
          className="group inline-flex items-center focus:outline-none active:translate-y-px xl:h-10 xl:w-full xl:max-w-sm xl:rounded-lg xl:border xl:border-input  xl:py-2 xl:pe-2 xl:ps-3.5 xl:shadow-sm xl:backdrop-blur-md xl:transition-colors xl:duration-200 xl:hover:border-primary  focus-visible:border-none"
        >
          <IoSearch className="magnifying-glass me-2 h-[18px] w-[18px]" />
          <span className="placeholder-text hidden text-sm text-gray-600 group-hover:text-gray-900 xl:inline-flex">
            Search your page...
          </span>
          <span className="search-command ms-auto hidden items-center text-sm text-gray-600 lg:flex lg:rounded-md lg:bg-primary lg:px-1.5 lg:py-1 lg:text-xs lg:font-semibold lg:text-primary-foreground xl:justify-normal">
            K
          </span>
        </button>
      </div>

      <div className="ms-auto items-center  text-gray-700">
        <Popover>
          <PopoverTrigger asChild>
            <Avatar className="cursor-pointer active:translate-y-px ">
              {/* <AvatarImage src="" alt="" /> */}
              <AvatarFallback className="bg-gray-500">
                {/* {firstname} */}
                {/* {lastname} */}
                <FaUserCircle className="size-full" />
              </AvatarFallback>
            </Avatar>
          </PopoverTrigger>

          <PopoverContent side="bottom" align="end" className="w-80">
            <div className="flex items-center border-b border-gray-300 pb-4">
              <Avatar>
                {/* <AvatarImage src="" alt="" /> */}
                <AvatarFallback>
                  {firstname}
                  {lastname}
                </AvatarFallback>
              </Avatar>

              <div className="ms-3">
                <h2 className="text-base font-semibold">{fullname}</h2>
                <p className="font-normal text-gray-600">{email}</p>
              </div>
            </div>

            <div className="py-3.5 font-medium text-gray-700">
              <Link
                href="/"
                className="group my-0.5 flex items-center rounded-md px-2.5 py-2 hover:bg-gray-100 focus:outline-none hover:dark:bg-gray-50/50"
              >
                My Profile
              </Link>
              <Link
                href="/"
                className="group my-0.5 flex items-center rounded-md px-2.5 py-2 hover:bg-gray-100 focus:outline-none hover:dark:bg-gray-50/50"
              >
                Account Settings
              </Link>
            </div>

            <div className="border-t border-gray-300 pt-3.5">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost">Logout</Button>
                </DialogTrigger>

                <ConfirmModal
                  actionBtn={handleLogout}
                  title="logout"
                  btnText="Logout"
                />
              </Dialog>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
