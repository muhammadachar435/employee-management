"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-6">
          <Link href="/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
          <Link href="/employees" className="hover:text-gray-300">
            Employees
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">{user.email}</span>
          <button onClick={logout} className="bg-red-600 px-4 py-1 rounded hover:bg-red-700 text-sm">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
