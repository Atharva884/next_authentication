"use client";

import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import Image from "next/image";

type accountProps = {
  session: Session;
};

const UserAccountNav: React.FC<accountProps> = (props) => {
  // const [session, setSession] = useState<Session | null>(null);

  // useEffect(() => {
  //   setSession(props.session);
  // }, [props.session]);

  return (
    props.session != null && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="overflow-visible">
          <div className="rounded-full overflow-hidden w-10 h-10 cursor-pointer ">
            <Image
              className="rounded-full object-cover"
              width={40}
              height={40}
              src={props.session.user?.image || "/avatar.png"}
              alt={props.session.user?.firstName || "user avatar"}
            />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-white w-60" align="end">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-0.5 leading-none">
              <p className="font-medium text-sm text-black">
                {props.session.user?.firstName} {props.session.user?.lastName}
              </p>
              <p className="text-gray-400">{props.session.user?.email}</p>
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="cursor-pointer">
            <Link href="/profile">My Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => signOut()}
            className="cursor-pointer"
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
};

export default UserAccountNav;
