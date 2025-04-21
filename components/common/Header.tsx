import React from "react";
import { FileText } from "lucide-react";
import NavLink from "./NavLink";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const Header = () => {
  return (
    <nav className="container flex items-center justify-between py-4 lg:px-6 px-2 mx-auto">
      <div className="flex lg:flex-1">
        <NavLink
          href={"/"}
          className="flex items-center gap-1 lg:gap-2 shrink-0"
        >
          <FileText className="w-5 h-5 lg:w-8 lg:h-8 text-gray-900 hover:rotate-12 transform transition duration-200 ease-in-out" />
          <span className="font-extrabold lg:text-xl text-gray-900">
            SmartSummary
          </span>
        </NavLink>
      </div>
      <div className="flex lg:justify-end lg:flex-1">
        <div className="flex gap-3 items-center">
          <SignedIn>
            <NavLink href={"/dashboard"}>Your Summaries</NavLink>
            <NavLink href={"/upload"}>Upload a PDF</NavLink>
            <UserButton />
          </SignedIn>
        </div>
        <SignedOut>
          <div>
            <NavLink href={"/sign-in"}>Sign In</NavLink>
          </div>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Header;
