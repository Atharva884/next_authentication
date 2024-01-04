import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { NextPage } from "next";
import { getServerSession } from "next-auth";
import React from "react";

const ServerPage: NextPage = async () => {
  const session = await getServerSession(authOptions);

  return (
    <MaxWidthWrapper>
      <div className="py-20 mx-auto flex flex-col text-4xl">
        <h1 className="text-xl font-bold">Server Page</h1>
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

export default ServerPage;
