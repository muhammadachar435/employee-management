"use client";
import { useAuth } from "@/context/AuthContext";
import { getEmployees, deleteEmployee } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
// ✅ Fix: Use next/navigation for App Router
import { useRouter } from "next/navigation";

export default function EmployeesPage() {
  const { user } = useAuth();
  // ✅ Fix: const router = useRouter(); (not const { router } = useRouter();)
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Check if user is authenticated
    if (!user) {
      router.push("/");
      return;
    }
    fetchEmployees();
  }, [user]); // ✅ Add user as dependency

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.data);
    } catch (error) {
      console.log(error.message);
      // ✅ If unauthorized, redirect to login
      if (error.response?.status === 401) {
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    try {
      await deleteEmployee(id);
      fetchEmployees();
    } catch (error) {
      console.log(error.message);
      if (error.response?.status === 401) {
        router.push("/");
      }
    }
  };

  if (!user) return null;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employees</h1>
        <Link href="/employees/create">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Add Employee
          </button>
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td className="px-6 py-4">{emp.name}</td>
                  <td className="px-6 py-4">{emp.email}</td>
                  <td className="px-6 py-4">{emp.department}</td>
                  <td className="px-6 py-4">${emp.salary}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        emp.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <Link href={`/employees/edit/${emp.id}`}>
                      <button className="text-blue-600 hover:text-blue-800">Edit</button>
                    </Link>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
