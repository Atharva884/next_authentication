import React from "react";
import { Button, buttonVariants } from "../components/ui/button";
import Link from "next/link";
import { NextPage } from "next";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getSession } from "next-auth/react";

const HomePage: NextPage = async () => {
  const session = await getServerSession(authOptions);
  console.log("session");
  console.log(session);

  return (
    <MaxWidthWrapper>
      <div className="py-20 mx-auto text-center flex flex-col max-w-3xl">
        <h1 className="font-bold text-4xl">
          Hello, <span className="text-green-400">Developer</span>
        </h1>
        <p className="text-lg py-4 text-gray-900">
          As a passionate Full Stack Developer, I have a strong foundation in
          both front-end and back-end technologies. With expertise in Node.js,
          Flutter, and JavaScript development, I specialize in creating
          efficient and seamless applications.
        </p>
        {!session && (
          <div className="mt-6 mx-auto flex flex-col sm:flex-row gap-3">
            <Link href="/signup" className={buttonVariants()}>
              Create Account
            </Link>
            <Link
              href="/signin"
              className={buttonVariants({
                variant: "ghost",
              })}
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </MaxWidthWrapper>
  );
};

export default HomePage;
