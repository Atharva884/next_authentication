"use client";

import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const Provider = (props: Props) => {
  return <SessionProvider>{props.children}</SessionProvider>;
};

export default Provider;
