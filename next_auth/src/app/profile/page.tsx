"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { ip } from "@/constant";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage: NextPage = () => {
  const [name, setName] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [error, setError] = useState<boolean>(false);
  const { data: session, update } = useSession();

  useEffect(() => {
    // Set the initial value of 'name' when the session is available
    if (session?.user?.firstName && session.user.email) {
      setName(session.user.firstName + " " + session.user.lastName);
      setEmail(session.user.email);
    }
  }, [session]);

  console.log("Profile session");
  console.log(session);

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(email);

    const response = await fetch(`${ip}/account/updateProfile`, {
      method: "POST",
      body: JSON.stringify({
        name: name,
        email: email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      setError(true);
      return;
    }

    const resData = await response.json();

    if (resData.data == "ok") {
      console.log("andar aa na mc");

      toast("Your profile has been updated successfully", {
        theme: "dark",
        type: "success",
        autoClose: 2000,
      });

      // Update the session
      await update({ name });
      console.log("Kyu nahi hua update");
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="mt-6 mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6">
        <div className="sm:rounded-5xl -mx-4 flex-auto mt-6 bg-white px-4 shadow-2xl shadow-gray-900/10 sm:mx-0 sm:flex-none sm:p-24">
          {error && <span className="text-red-500">Something went wrong!</span>}
          <form onSubmit={(e) => submitForm(e)}>
            <div className="space-y-2">
              <Label htmlFor="name">Update Profile Name</Label>
              <Input
                id="name"
                type="text"
                value={name || ""}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                id="email"
                type="hidden"
                value={session?.user?.email || ""}
                readOnly
              />
            </div>
            <Button
              type="submit"
              variant="default"
              color="gray"
              className="mt-3 w-full"
            >
              Update Name
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
