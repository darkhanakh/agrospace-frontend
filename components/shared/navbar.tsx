// Файл: components/Navbar.tsx

"use client";

import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold cursor-pointer">
          AgroSpace
        </Link>
        <div className="space-x-4">
          <Link className="text-gray-700 hover:text-gray-900" href="/planner">
            Планировщик
          </Link>
          <Link
            className="text-gray-700 hover:text-gray-900"
            href="/water-data"
          >
            Данные о воде
          </Link>
          <Link
            className="text-gray-700 hover:text-gray-900"
            href="/precipitation-map"
          >
            Карта осадков
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
