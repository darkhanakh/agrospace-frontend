// File: app/auth/signup/page.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StepBack } from "lucide-react";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [region, setRegion] = useState("");
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = divRef.current;
    if (div) {
      div.style.backgroundImage = "url(/img/bg3.webp)"; // Update image path as needed
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg px-6 py-8 bg-white shadow-lg rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center hover:text-gray-700">
            <StepBack size={28} />
            <p className="ml-2 text-gray-600">На Главную</p>
          </Link>
          <Link
            href="/auth/login"
            className="text-green-600 hover:text-green-800"
          >
            Страница входа
          </Link>
        </div>

        {/* Hero Image */}
        <div
          ref={divRef}
          className="w-full h-40 bg-center bg-no-repeat bg-cover rounded-lg mb-6"
        ></div>

        {/* Form Heading */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Добро Пожаловать!
        </h1>
        <p className="text-gray-600 mb-6">
          Заполните данные, чтобы создать аккаунт.
        </p>

        {/* Form */}
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Имя *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Олжас Саматов"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Почта *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="olzhas@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Придумайте пароль *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="olZhas123"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Повторите пароль *
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="olZhas123"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Регион *
            </label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="Аксу"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-600">Уже есть аккаунт?</div>
            <Link
              href="/auth/signin"
              className="text-green-600 hover:underline"
            >
              Войдите!
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Создать
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
