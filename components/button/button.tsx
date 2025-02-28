import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
}

export default function Button({ children, href }: ButtonProps) {
  if (href) {
    return (
      <Link
        href={href}
        className="flex w-fit bg-green-500 px-2 py-2 rounded-md"
      >
        <span className="text-end">{children}</span>
        <ArrowRightIcon />
      </Link>
    );
  }
  return (
    <button className="flex w-fit bg-green-500 px-2 py-2 rounded-md">
      <span className="text-end">{children}</span>
      <ArrowRightIcon />
    </button>
  );
}
