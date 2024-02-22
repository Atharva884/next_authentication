import { ip } from "@/constant";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { redirect } from "next/navigation";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      profile(profile: any) {
        return {
          id: profile.sub,
          email: profile.email,
          image: profile.picture,
          name: profile.name,
          role: profile.role ?? "user",
        };
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Your password",
        },
      },
      async authorize(credentials) {
        if (credentials == null) {
          return null;
        }

        console.log(credentials);
        let response = await fetch(`${ip}/account/signIn`, {
          method: "POST",
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          return null;
        }

        let profile = await response.json();

        console.log("profile");

        console.log(profile);

        if (profile.data == "Invalid Credentials") {
          return null;
        }

        let { accountPassword, ...user } = profile.data;

        console.log("User");

        console.log(user);

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ profile, user, account }): Promise<string | boolean> {
      try {
        if (account?.provider == "google") {
          console.log("Google callback called");
          console.log(profile);

          const response = await fetch(`${ip}/account/googleSignIn`, {
            method: "POST",
            body: JSON.stringify({
              profile: profile,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            console.error(
              "Error fetching data:",
              response.status,
              response.statusText
            );
            return false;
          }

          const result = await response.json();
          console.log("Result:", result);

          if (
            result.data.isTrue === "ok" &&
            result.data.updatedUserData != null
          ) {
            console.log("Inside if");

            user.name =
              result.data.updatedUserData.accountFirstName +
              " " +
              result.data.updatedUserData.accountLastName;
          }

          // console.log("Profilee");
          // console.log(profile, credentials, account);
        }
        return true;
      } catch (error) {
        console.error("An unexpected error occurred:", error);
        return false;
      }
    },
    async jwt({ token, trigger, session, user, account, profile }) {
      console.log("Useeeeeerrrrrr");
      console.log(user);

      if (user) {
        const {
          accountFirstName,
          accountLastName,
          accountEmail,
          accountImage,
          role,
        } = user as any;

        // Map user properties to Profile properties
        const mappedUser: Profile = {
          firstName: accountFirstName || user.name?.split(" ")[0],
          lastName: accountLastName || user.name?.split(" ")[1],
          email: accountEmail || user.email,
          image: accountImage || user.image,
          role: role,
        };

        token.user = mappedUser;
      }

      if (trigger === "update" && session?.name) {
        console.log("Triggeddd update");
        console.log(session.name);

        token.user.firstName = session.name.split(" ")[0];
        token.user.lastName = session.name.split(" ")[1];
      }

      return token;
    },
    async session({ token, session }) {
      session.user = token.user;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
