"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import StyledLink from "./atoms/StyledLink";
import { FaRegUser } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { MdLogout } from "react-icons/md";

function Sidebar() {
  const [loading, setLoading] = useState<boolean>(false);

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/`);
    },
  });
  const user = session?.user;
  return (
    <nav className="fixed top-0 z-50 flex items-center justify-between h-16 w-full px-3 py-1.5 bg-blue-500 border-b border-blue-400 max-w-screen lg:px-5 lg:pl-3">
      {loading ? null : (
        <div className="fade-in-1 flex flex-row  justify-between w-full">
          <StyledLink
            href={"/home"}
            className="relative flex items-center text-md justify-between font-semibold text-gray-100 transition-all duration-200 sm:ml-2 hover:text-white"
          >
            Personalized Learning
          </StyledLink>
          <div className="flex flex-row gap-2 items-center">
            <StyledLink
              href={"#"}
              className="relative flex items-center gap-2 text-sm justify-between font-semibold text-blue-500 transition-all duration-200 sm:ml-2 hover:text-blue-700 py-2 px-7 bg-white rounded-full"
            >
              <span className="font-semibold">
                <FaRegUser />
              </span>
              {user?.username || user?.email || "User"}
            </StyledLink>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="relative flex items-center gap-2 text-sm justify-between font-semibold text-blue-500 transition-all duration-200 sm:ml-2 hover:text-white hover:bg-red-600 py-2 px-7 bg-white rounded-full"
            >
              Logout
              <span className="font-semibold">
                <MdLogout />
              </span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Sidebar;
