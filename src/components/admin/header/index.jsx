"use client";
import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";

export default function AdminHeader() {
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
  return (
    <header
      className={`${
        scrolled ? "card-shadow" : ""
      } sticky top-0 flex items-center bg-gray-0/80 p-4 backdrop-blur-xl dark:bg-gray-50/50 md:px-5 lg:px-6 z-[990] 2xl:py-5 3xl:px-8 4xl:px-10`}
    >
      <div className="flex w-full max-w-2xl items-center">
        <button
          aria-label="Search"
          className="group inline-flex items-center focus:outline-none active:translate-y-px xl:h-10 xl:w-full xl:max-w-sm xl:rounded-lg xl:border xl:border-muted xl:py-2 xl:pe-2 xl:ps-3.5 xl:shadow-sm xl:backdrop-blur-md xl:transition-colors xl:duration-200 xl:hover:border-gray-900  focus-visible:border-none"
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

      <div className="ms-auto grid shrink-0 grid-cols-4 items-center gap-2 text-gray-700 xs:gap-3 xl:gap-4">
        Hello
      </div>
    </header>
  );
}
