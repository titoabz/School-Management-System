"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AddStudent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    name: "",
    surname: "",
    birthdate: "",
    gender: "Male",
    phone: "",
    address: "",
    enrollment_year: new Date().getFullYear(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/auth/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: 'student',
          user_metadata: { username: formData.username },
        }),
      });

      const result = await response.json();
      if (!result.user) throw new Error(result.error || 'Failed to create user');

      const userId = result.user.id;

      // Add to students table
      const studentNumber = `STU-${Date.now()}`;
      const { error: studentError } = await supabase.from('students').insert({
        student_id: userId,
        name: formData.name,
        surname: formData.surname,
        birthdate: formData.birthdate || null,
        gender: formData.gender,
        phone: formData.phone || null,
        address: formData.address || null,
        enrollment_year: formData.enrollment_year,
        student_number: studentNumber,
        status: "active",
      });

      if (studentError) throw studentError;

      alert(`Student created successfully!\n\nStudent ID: ${studentNumber}\nEmail: ${formData.email}\nPassword: ${formData.password}`);

      router.push("/admin/students");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-800 text-white p-4 flex justify-between">
        <h1 className="text-xl font-bold">Add Student</h1>
        <Link href="/admin/students" className="text-white hover:text-blue-200">← Back</Link>
      </div>

      <div className="container mx-auto p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold mb-1">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Surname *</label>
              <input
                type="text"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold mb-1">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Username *</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Password *</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-2 border rounded"
              required
              minLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold mb-1">Birthdate</label>
              <input
                type="date"
                value={formData.birthdate}
                onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Enrollment Year</label>
              <input
                type="number"
                value={formData.enrollment_year}
                onChange={(e) => setFormData({ ...formData, enrollment_year: parseInt(e.target.value) })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2 border rounded"
              rows={2}
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700">{loading ? "Creating..." : "Create Student"}</button>
        </form>
      </div>
    </div>
  );
}
