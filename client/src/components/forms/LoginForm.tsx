"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";

import StyledInput from "@/components/atoms/StyledInput";

import { signIn } from "next-auth/react";

type Props = {
  callbackUrl?: string;
};

export default function LoginForm(props: Props) {
  const [loginError, setLoginError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const errorHandler = (error: string): void => {
    setLoginError(error);

    setTimeout(() => {
      setLoginError(null);
    }, 10000);
  };

  const validateInputs = (
    email: FormDataEntryValue,
    password: FormDataEntryValue
  ): boolean => {
    if (email === "" || password === "") {
      setLoading(false);
      errorHandler("Please fill all the fields");
      return false;
    }
    setLoginError(null);
    return true;
  };

  const handleSignIn = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") || "";
    const password = formData.get("password") || "";

    try {
      if (!validateInputs(email, password)) return;

      const res = await signIn("credentials", {
        email: email.toString(),
        password: password.toString(),
        redirect: false,
        callbackUrl: props.callbackUrl ? props.callbackUrl : "/home",
      });
      if (res?.error) {
        errorHandler(res.error);
      } else {
        router.push(props.callbackUrl ? props.callbackUrl : "/home");
      }
    } catch (err) {
      errorHandler("Please try again after some time");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Email address
        </label>
        <StyledInput
          className="block w-full rounded-md py-1.5 px-1.5 text-gray-900 border-2 shadow-sm ring-0 ring-gray-300 placeholder:text-gray-400 focus:ring-0 focus:ring-gray-600 sm:text-sm sm:leading-6"
          name="email"
          type="email"
          placeholder="Email"
        />
      </div>

      <div>
        {/* <div className=''> */}
        <label
          htmlFor="password"
          className="text-sm font-medium leading-6 text-gray-900 flex items-center justify-between"
        >
          Password
        </label>
        {/* </div> */}
        <div className="mt-2">
          <StyledInput
            className="block w-full rounded-md py-1.5 px-1.5 text-gray-900 border-2 shadow-sm ring-0 ring-gray-300 placeholder:text-gray-400 focus:ring-0 focus:ring-gray-600 sm:text-sm sm:leading-6"
            name="password"
            type="password"
            placeholder="Password"
          />
        </div>
      </div>
      {loginError && (
        <span className="transition-all duration-200 bg-red-500 w-full text-sm rounded-sm text-white font-medium flex items-center px-1.5 py-1">
          <FaExclamationCircle className="mr-2 animate-pulse" /> {loginError}
        </span>
      )}
      <div className="flex flex-col gap-4">
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-gray-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 transisiion-all duration-200"
        >
          Sign in
        </button>
        <div className="flex flex-row justify-between">
          <span className="text-sm">
            <a
              href="#"
              className="font-semibold text-blue-600 hover:text-blue-500 underline underline-offset-2"
            >
              Forgot password?
            </a>
          </span>
          <span className="text-sm">
            <a
              href="#"
              className="font-semibold text-blue-600 hover:text-blue-500 underline underline-offset-2"
            >
              New User?
            </a>
          </span>
        </div>
      </div>
    </form>
  );
}
