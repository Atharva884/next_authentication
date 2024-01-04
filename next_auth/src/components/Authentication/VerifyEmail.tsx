"use client";

import { ip } from "@/constant";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

type Props = {};

const VerifyEmail = (props: Props) => {
  const { data: session } = useSession();
  const params = useSearchParams();
  const router = useRouter();

  const [token, setToken] = useState("");

  const verifyEmail = async () => {
    try {
      let response = await fetch(`${ip}/verifyTokenByEmail`, {
        method: "POST",
        body: JSON.stringify({
          token: token,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      let result = await response.json();

      console.log("Datttttaaaaaaaaaaaa");
      console.log(result);

      if (result != null) {
        router.push("/");
      }
    } catch (error) {
      console.error("Error verifying email:", error);
    }
  };

  useEffect(() => {
    const token = params.get("token");

    console.log(token);
    setToken(token || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyEmail();
    }
  }, [token]);

  return (
    <div>
      <h1>Hello, Bhai</h1>
      {token.length != 0 && <h1>Token: {token}</h1>}
    </div>
  );
};

export default VerifyEmail;
