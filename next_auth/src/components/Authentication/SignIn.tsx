"use client";

import { Button } from "@/components/ui/button";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "@/schema/schema";
import Link from "next/link";
import { ip } from "@/constant";
import { useState } from "react";
import { XCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const SignIn = () => {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const clearError = () => {
    setMessage("");
  };

  const submitHandler: SubmitHandler<FormValues> = async (data: FormValues) => {
    try {
      let response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: true,
        callbackUrl: callbackUrl,
      });

      if (!response?.ok) {
        setMessage("Invalid Credentials");
        setTimeout(clearError, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6">
      <div className="sm:rounded-5xl -mx-4 flex-auto mt-6 bg-white px-4 shadow-2xl shadow-gray-900/10 sm:mx-0 sm:flex-none sm:p-24">
        {message.length != 0 && (
          <div className="bg-red-500 border-red-400 text-white p-2 mb-2 rounded-md flex items-center justify-between">
            <p>{message}</p>
            <XCircle onClick={clearError} className="cursor-pointer" />
          </div>
        )}
        <form onSubmit={handleSubmit(submitHandler)}>
          <h1 className="mx-auto mb-4 text-2xl font-sans font-medium text-gray-500">
            Sign in with your credentials
          </h1>
          <div className="space-y-2">
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
          </div>
          <div className="space-y-2 mt-3">
            <Label htmlFor="password">Your password</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              required
              {...register("password")}
            />
            {errors.password && (
              <span className="text-sm text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>
          <Button
            type="submit"
            variant="default"
            color="gray"
            className="mt-3 w-full"
            disabled={isSubmitting}
          >
            Log In
          </Button>
        </form>
        <div className="mx-auto my-5 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
          or
        </div>
        <GoogleSignInButton />
        <div className="flex items-center justify-between mt-3">
          <Link href="/forgot-password" className="text-red-400">
            Forgot Password?
          </Link>
          <p className="mt-3 text-gray-600">
            Not have an account?{" "}
            <Link href="/signup" className="text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

// import { getCsrfToken } from "next-auth/react";

// export default async function SignIn({}) {
//   const csrfToken = await getCsrfToken();
//   console.log(csrfToken);

//   return (
//     <div className="h-screen bg-gray-100 flex flex-col">
//       <div className="mt-8 mx-4 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="text-center mt-24">
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Sign in
//           </h2>
//         </div>
//         <div className="mt-8 bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
//           <form method="post" action="/api/auth/signin/email">
//             <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
//             <label className="block font-semibold text-sm text-gray-900">
//               Email address
//               <input
//                 className="mt-2 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 type="text"
//                 id="email"
//                 name="email"
//                 placeholder="you@company.com"
//               />
//             </label>
//             <button
//               className="mt-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               type="submit"
//             >
//               Sign in with Email
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
