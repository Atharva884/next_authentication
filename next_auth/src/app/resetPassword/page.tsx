"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ip } from "@/constant";
import { XCircle } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {};
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{5,}$/;

const ResetPasswordPage = (props: Props) => {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [visible, setVisible] = useState("password");
  const [message, setMessage] = useState("");

  const handleChange = (event: any) => {
    console.log("Chal raha");

    if (visible == "password") setVisible("text");
    else setVisible("password");
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  const handleReEnterPasswordChange = (e: any) => {
    setReEnterPassword(e.target.value);
  };

  const clearError = () => {
    setMessage("");
  };

  const passwordsMatch = reEnterPassword && password === reEnterPassword;

  const submitHandler = async (e: any) => {
    try {
      e.preventDefault();
      const token = params.get("token");

      if (token?.length == 0) {
        setMessage("Invalid token");
        setTimeout(clearError, 3000);
        return;
      }

      console.log(password, reEnterPassword);

      // Verify the token and get the user Id
      let response = await fetch(`${ip}/verifyToken`, {
        method: "POST",
        body: JSON.stringify({
          token: token,
          password: password,
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

      console.log("Verified token");

      console.log(result);

      if (result.data == "ok") {
        toast("Your Password has been reset successfully", {
          theme: "light",
          type: "success",
          pauseOnHover: false,
          autoClose: 3000,
        });

        router.push("/signin");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6">
      <div className="sm:rounded-5xl -mx-4 flex-auto mt-6 bg-white px-4 shadow-2xl shadow-gray-900/10 sm:mx-0 sm:flex-none sm:p-24">
        <form onSubmit={submitHandler}>
          <h1 className="text-center mb-4 text-3xl font-sans font-semibold text-gray-500">
            Reset Password
          </h1>
          {message.length != 0 && (
            <div className="bg-red-500 border-red-400 text-white p-2 mb-2 rounded-md flex items-center justify-between">
              <p>{message}</p>
              <XCircle onClick={clearError} className="cursor-pointer" />
            </div>
          )}
          <div className="space-y-2 mt-4">
            <Label htmlFor="password">Set your Password</Label>
            <Input
              id="password"
              placeholder="*********"
              required
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
            {password && !passwordRegex.test(password) && (
              <div className="text-red-500 mt-1">Provide a strong password</div>
            )}
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              placeholder="*********"
              type={visible}
              value={reEnterPassword}
              onChange={handleReEnterPasswordChange}
              required
            />
            {reEnterPassword && !passwordsMatch && (
              <div className="text-red-500 mt-1">Passwords do not match</div>
            )}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Checkbox id="pass" onClick={handleChange} />
            <label htmlFor="pass">Show password</label>
          </div>
          <Button
            type="submit"
            variant="default"
            color="gray"
            className="mt-3 w-full"
          >
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
