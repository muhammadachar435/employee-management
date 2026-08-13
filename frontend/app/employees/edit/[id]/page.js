"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getEmployee, updateEmployee } from "@/lib/api";

export default function EditEmployee() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    salary: "",
    status: "active",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // ✅ Check if user is authenticated
    if (!user) {
      router.push("/");
      return;
    }

    const fetchEmployee = async () => {
      try {
        const res = await getEmployee(params.id);
        setFormData(res.data);
      } catch (error) {
        setError("Employee not found");
        // ✅ If unauthorized, redirect to login
        if (error.response?.status === 401) {
          router.push("/");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [params.id, user]); // ✅ Add user as dependency

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await updateEmployee(params.id, formData);
      router.push("/employees");
    } catch (error) {
      setError(error.response?.data?.error || "Failed to update employee");
      if (error.response?.status === 401) {
        router.push("/");
      }
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;
  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Employee</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

        <div>
          <label className="block text-sm font-medium">Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="text"
            value={formData.phone || ""}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 block w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Department *</label>
          <input
            type="text"
            required
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="mt-1 block w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Salary *</label>
          <input
            type="number"
            required
            step="0.01"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            className="mt-1 block w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="mt-1 block w-full border rounded-md px-3 py-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update Employee"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/employees")}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
