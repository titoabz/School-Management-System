"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AddInstructor() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    name: "",
    surname: "",
    phone: "",
    specialization: "",
    qualification: "",
    hire_date: "",
    status: "active",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("📝 Starting teacher creation...");

      // STEP 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { 
            username: formData.username,
            role: "teacher",
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user account");

      const userId = authData.user.id;
      console.log("✅ Auth user created:", userId);

      // STEP 2: Add to public.users table
      const { error: userError } = await supabase.from("users").insert({
        id: userId,
        username: formData.username,
        email: formData.email,
        role: "teacher",
        is_active: true,
      });

      if (userError) throw userError;
      console.log("✅ Added to users table");

      // STEP 3: Add to instructors table
      const { error: instructorError } = await supabase.from("instructors").insert({
        instructor_id: userId,
        name: formData.name,
        surname: formData.surname,
        phone: formData.phone || null,
        email: formData.email,
        hire_date: formData.hire_date || null,
        specialization: formData.specialization || null,
        qualification: formData.qualification || null,
        status: formData.status,
      });

      if (instructorError) {
        console.error("❌ Instructor insert error:", instructorError);
        throw instructorError;
      }
      console.log("✅ Added to instructors table");

      alert(`Teacher created successfully!\n\nEmail: ${formData.email}\nPassword: ${formData.password}`);
      router.push("/admin/instructors");
      
    } catch (err: any) {
      console.error("❌ Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Add New Teacher</h1>
          <Link href="/admin/instructors" className="text-white hover:text-blue-200">
            ← Back to Teachers
          </Link>
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

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
              <label className="block font-semibold mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Hire Date</label>
              <input
                type="date"
                value={formData.hire_date}
                onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold mb-1">Specialization</label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="e.g., Mathematics, Computer Science"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Qualification</label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="e.g., Master's Degree, PhD"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="active">✅ Active</option>
              <option value="on_leave">📝 On Leave</option>
              <option value="resigned">❌ Resigned</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Creating Teacher..." : "👨‍🏫 Create Teacher"}
          </button>
        </form>
      </div>
    </div>
  );
}
