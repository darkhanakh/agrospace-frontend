// File: components/Footer.tsx

"use client";

import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="mb-4">
          &copy; {new Date().getFullYear()} Agroonai. Все права защищены.
        </p>
        <div className="space-x-6">
          <Link href="/privacy">
            <a className="hover:text-white">Политика конфиденциальности</a>
          </Link>
          <Link href="/terms">
            <a className="hover:text-white">Условия использования</a>
          </Link>
          <Link href="/contact">
            <a className="hover:text-white">Контакты</a>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
