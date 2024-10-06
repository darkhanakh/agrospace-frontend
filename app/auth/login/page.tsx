"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { StepBack } from "lucide-react";
import { login } from "@/app/auth/login/actions";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = divRef.current;
    if (div) {
      div.style.backgroundImage = "url(/img/bg2.png)"; // Update image path as needed
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-6 py-8 bg-white shadow-lg rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center hover:text-gray-700">
            <StepBack size={28} />
            <p className="ml-2 text-gray-600">На Главную</p>
          </Link>
          <Link
            href="/auth/register"
            className="text-green-600 hover:text-green-800"
          >
            Создать аккаунт
          </Link>
        </div>

        {/* Hero Image */}
        <div
          ref={divRef}
          className="w-full h-40 bg-center bg-no-repeat bg-cover rounded-lg mb-6"
        ></div>

        {/* Form Heading */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Добро пожаловать!
        </h1>
        <p className="text-gray-600 mb-6">
          Введите свою почту и пароль для входа.
        </p>

        {/* Form */}
        <form>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Почта *
            </label>
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Пароль *
            </label>
            <input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-600">Нет аккаунта?</span>
              <Link
                href="/auth/register"
                className="ml-1 text-green-600 hover:underline"
              >
                Создайте его!
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            formAction={login}
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
