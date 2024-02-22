"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ip } from "@/constant";
import { forgot_password } from "@/schema/schema";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { XCircle } from "lucide-react";

type Props = {};

const ForgotPassword: NextPage = (props: Props) => {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const clearError = () => {
    setMessage("");
  };

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<forgotPass>({
    resolver: zodResolver(forgot_password),
  });

  const submitHandler: SubmitHandler<forgotPass> = async (data: forgotPass) => {
    try {
      let response = await fetch(`${ip}/sendVerificationLink`, {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        let result = await response.json();
        setMessage(result.data);
        setTimeout(clearError, 3000);
        return;
      }

      let result = await response.json();
      console.log("Resultttt");

      console.log(result.data);

      if (result.data == "ok") {
        router.push(`/setPassword?email=${data.email}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6">
      <div className="sm:rounded-5xl -mx-4 flex-auto mt-6 bg-white px-4 shadow-2xl shadow-gray-900/10 sm:mx-0 sm:flex-none sm:p-24">
        <form onSubmit={handleSubmit(submitHandler)}>
          <h1 className="text-center mb-4 text-3xl font-sans font-semibold text-gray-500">
            Reset your password
          </h1>
          <span className="text-center flex items-center justify-center gap-1 text-xl mb-2">
            or
            <Link href="/signin" className="text-blue-400">
              Log In
            </Link>
          </span>
          <div className="space-y-2 mt-4">
            <Label htmlFor="email">Your email</Label>
            <Input
              id="email"
              type="text"
              placeholder="hello@me.com"
              autoComplete="email"
              required
              {...register("email")}
            />
            {errors.email && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
            {message.length != 0 && (
              <span className="text-sm text-red-500">{message}</span>
            )}
          </div>
          <Button
            type="submit"
            variant="default"
            color="gray"
            className="mt-3 w-full"
            disabled={isSubmitting}
          >
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
