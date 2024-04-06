import LoginForm from "@/components/forms/LoginForm";
import Image from "next/image";

export default function Home() {
  return (
    <section>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm text-gray-800 text-center">
          <h2 className="text-2xl font-bold">Personalized Learning</h2>
          <h2 className="mt-10 text-center text-xl font-semibold leading-9 tracking-tight text-gray-700">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
