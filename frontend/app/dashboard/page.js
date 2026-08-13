"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getDashboardStats } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Add this

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter(); //  Add this
  const [stats, setStats] = useState({ total: 0, activeEmployees: 0, inactiveEmployees: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      router.push("/");
      return;
    }

    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch((error) => {
        console.error(error);
        // If unauthorized, redirect to login
        if (error.response?.status === 401) {
          router.push("/");
        }
      })
      .finally(() => setLoading(false));
  }, [user]); // Add user as dependency

  if (!user) return null;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome, {user.email}!</p>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-500">Total Employees</h3>
            <p className="text-4xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-green-500">Active</h3>
            <p className="text-4xl font-bold text-green-600">
              {stats.activeEmployees === 0 ? 0 : stats.activeEmployees}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-red-500">Inactive</h3>
            <p className="text-4xl font-bold text-red-600">
              {stats.inactiveEmployees === 0 ? 0 : stats.inactiveEmployees}
            </p>
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link href="/employees">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            View All Employees
          </button>
        </Link>
      </div>
    </div>
  );
}
