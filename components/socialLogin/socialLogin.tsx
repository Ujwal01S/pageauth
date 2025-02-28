import { FaGithub } from "react-icons/fa";
import React from "react";
import { signIn } from "next-auth/react";

export default function SocialLogin() {
  const social = (provider: string) => {
    signIn(provider, {
      callbackUrl: "/",
    });
  };
  return (
    <div className="flex">
      <button type="button" onClick={() => social("github")}>
        <span>
          <FaGithub />
        </span>
      </button>
    </div>
  );
}
