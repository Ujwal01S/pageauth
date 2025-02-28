import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import UserContent from "./userContent";

export default function LinkList() {
  const { data: session } = useSession();

  return (
    <div className="text-2xl flex items-center w-full justify-between px-14 py-4 font-semibold  bg-black text-white">
      <span>
        <Link href="/">Featured Food</Link>
      </span>
      <ul className="flex gap-4 text-lg">
        <li>
          <Link href="/events">All Food</Link>
        </li>

        <li>
          <Link href="/share-food">Share Food</Link>
        </li>

        <li className="cursor-pointer text-none">
          {session?.user ? (
            <UserContent
              email={session.user.email}
              id={session.user.id}
              image={session.user.image}
              name={session.user.name}
              role={session.user.role}
            />
          ) : (
            <Link href="signIn">Login</Link>
          )}
        </li>
      </ul>
    </div>
  );
}
