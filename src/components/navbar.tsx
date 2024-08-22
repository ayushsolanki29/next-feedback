"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  return (
    <nav className="bg-gray-800 p-4 md:p-6 shadow-md">
  <div className="container mx-auto flex justify-between items-center">
    <Link className="text-2xl font-bold text-white" href="/">
      Secret Sender
    </Link>
    <div className="flex items-center space-x-4">
      {session ? (
        <Button
          variant="destructive"
          className="text-white bg-red-600 hover:bg-red-700"
          onClick={() => signOut()}
        >
          Logout
        </Button>
      ) : (
        <Link
          className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          href="/signin"
        >
          Login
        </Link>
      )}
    </div>
  </div>
</nav>

  );
};

export default Navbar;
