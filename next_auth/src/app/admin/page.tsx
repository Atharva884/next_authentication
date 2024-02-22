import { NextPage } from "next";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";

type Props = {};

const AdminPage: NextPage = async (props: Props) => {
  const session = await getServerSession(authOptions);

  if (session?.user.role != "admin") {
    return (
      <div>
        <h1>You are not authorized to access this page</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Admin Page</h1>
      <h2>
        {session.user.firstName} {session.user.lastName}
      </h2>
      <p>Your role: {session.user.role}</p>
    </div>
  );
};

export default AdminPage;
