import { decl } from "postcss";
declare module "next-auth" {
  interface Session {
    user: Profile;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: Profile;
  }
}
