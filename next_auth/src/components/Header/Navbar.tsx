import Link from "next/link";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { Icons } from "../Icons";
import { buttonVariants } from "../ui/button";
import MobileNav from "./MobileNav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import UserAccountNav from "../UserAccountNav";
import { useEffect } from "react";

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  console.log(session);

  return (
    <div className="bg-white sticky z-50 top-0 inset-x-0 h-16">
      <header className="relative bg-white">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <MobileNav />

              <div className="ml-4 flex lg:ml-0">
                <Link href="/">
                  <Icons.logo className="h-10 w-10" />
                </Link>
              </div>

              {/* <div className="hidden z-50 lg:ml-8 lg:block lg:self-stretch">
                <NavItems />
              </div> */}

              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  <Link
                    href="/"
                    className={buttonVariants({
                      variant: "ghost",
                    })}
                  >
                    Home
                  </Link>

                  <Link
                    href="/protected/client"
                    className={buttonVariants({
                      variant: "ghost",
                    })}
                  >
                    Protected (Client)
                  </Link>

                  <Link
                    href="/protected/server"
                    className={buttonVariants({
                      variant: "ghost",
                    })}
                  >
                    Protected (Server)
                  </Link>

                  <Link
                    href="/admin"
                    className={buttonVariants({
                      variant: "ghost",
                    })}
                  >
                    Admin
                  </Link>

                  {session ? (
                    <UserAccountNav session={session} />
                  ) : (
                    <Link
                      href="/signin?callbackUrl=http://localhost:3000/"
                      className={buttonVariants()}
                    >
                      Sign in
                    </Link>
                  )}

                  {/* <span className="h-6 w-px bg-gray-200" aria-hidden="true" /> */}

                  {/* <Link
                    href="/sign-up"
                    className={buttonVariants({
                      variant: "ghost",
                    })}
                  >
                    Create account
                  </Link> */}

                  {/* <span className="h-6 w-px bg-gray-200" aria-hidden="true" />

                  <div className="flex lg:ml-6">
                    <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                  </div> */}

                  {/* <div className='ml-4 flow-root lg:ml-6'>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default Navbar;
