"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

type Props = {};

const SetPassword = (props: Props) => {
  const params = useSearchParams();

  return (
    <div className="mx-auto max-w-lg p-8 mt-20 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl text-center font-semibold text-gray-800 mb-4">
        Check your email
      </h1>
      <p className="text-gray-600">
        We sent an email to
        <strong className="text-blue-500"> {params.get("email")}</strong> which
        contains a link to reset your password.
      </p>
    </div>
  );
};

export default SetPassword;
