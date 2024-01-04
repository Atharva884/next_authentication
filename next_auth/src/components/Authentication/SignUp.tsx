"use client";

import { SignUpSchema } from "@/schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { ip } from "@/constant";
import { ToastContainer, toast } from "react-toastify";
import { XCircle } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import GoogleSignInButton from "../GoogleSignInButton";

const SignUp = () => {
  const router = useRouter();
  const items = [
    { label: "User", value: "user" },
    { label: "Admin", value: "admin" },
  ];

  const [selectedRole, setSelectedRole] = useState<string>("user");
  const [error, setError] = useState({
    isTrue: false,
    message: "",
  });

  const roleChangeHandler = (selectedRole: string) => {
    setSelectedRole(selectedRole);
  };

  const clearError = () => {
    setError({
      isTrue: false,
      message: "",
    });
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isLoading, errors },
  } = useForm<SignUp>({
    resolver: zodResolver(SignUpSchema),
  });

  const submitHandler: SubmitHandler<SignUp> = async (data: SignUp) => {
    // signIn("email", { email: data.email });
    console.log(selectedRole);

    let response = await fetch(`${ip}/account/signUp`, {
      method: "POST",
      body: JSON.stringify({
        accountFirstName: data.firstName,
        accountLastName: data.lastName,
        accountEmail: data.email,
        accountPassword: data.password,
        role: selectedRole,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let result = await response.json();

      setError({
        isTrue: true,
        message: result.message,
      });
      setTimeout(clearError, 5000);
      return;
    }

    let result = await response.json();
    console.log(result);

    if (result.data == "ok") {
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Display the toast
      toast("Your account has been successfully created", {
        theme: "colored",
        type: "success",
        pauseOnHover: false,
        autoClose: 2000,
      });

      // Delay the navigation for a short period to allow the toast to display
      setTimeout(() => {
        router.push("/signin", { scroll: false });
      }, 3000);
    } else {
      setError({
        isTrue: true,
        message: result.message,
      });
      setTimeout(clearError, 5000);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-4 sm:px-6 mt-10">
      <div className="sm:rounded-5xl -mx-4 flex-auto bg-white px-4 shadow-2xl shadow-gray-900/10 sm:mx-0 sm:flex-none sm:p-10">
        <h1 className="text-3xl font-semibold mb-6">Next Authentication</h1>
        {error.isTrue && (
          <div className="bg-red-400 border-red-300 text-white p-2 mb-2 rounded-md flex items-center justify-between">
            <p>{error.message}</p>
            <XCircle onClick={clearError} className="cursor-pointer" />
          </div>
        )}
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                {...register("firstName")}
              />
              {errors.firstName && (
                <span className="text-sm text-red-500">
                  {errors.firstName.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                {...register("lastName")}
              />
              {errors.lastName && (
                <span className="text-sm text-red-500">
                  {errors.lastName.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="hello@me.com"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-sm text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                {...register("password")}
              />
              {errors.password && (
                <span className="text-sm text-red-500">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Select Role</Label>
            <Select
              required
              onValueChange={roleChangeHandler}
              defaultValue="user"
            >
              <SelectTrigger className="w-full" id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {items.map((item, index) => {
                  return (
                    <SelectItem
                      value={item.value}
                      key={index}
                      onChange={() => setSelectedRole(item.value)}
                    >
                      {item.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300"
          >
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>
        </form>
        <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
          or
        </div>
        <GoogleSignInButton />
      </div>

      <ToastContainer />
    </div>
  );
};

export default SignUp;
