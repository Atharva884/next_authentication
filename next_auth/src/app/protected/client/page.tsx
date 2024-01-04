"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { NextPage } from "next";
import React from "react";
import { useSession } from "next-auth/react";

const ClientPage: NextPage = () => {
  const { data: session } = useSession({
    required: true,
  });

  return (
    <MaxWidthWrapper>
      <div className="py-20 mx-auto flex flex-col text-4xl">
        <h1 className="text-xl font-bold">Client Page</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <p className="text-gray-500 text-lg">You are logged in as:</p>
          <div className="text-gray-500 text-lg font-bold flex flex-row sm:flex-col gap-2">
            <span>
              {session?.user?.firstName} {session?.user?.lastName}
            </span>
            <span>{session?.user?.email}</span>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default ClientPage;
