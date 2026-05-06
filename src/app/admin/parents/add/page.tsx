"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";

export default function AddParent() {
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
    occupation: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create user using ADMIN CLIENT - this does NOT affect current session
      const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true,
        user_metadata: {
          username: formData.username,
          role: "parent",
        },
      });

      if (createError) throw createError;
      if (!userData.user) throw new Error("Failed to create user");

      const userId = userData.user.id;

      const { error: userError } = await supabaseAdmin.from("users").insert({
        id: userId,
        username: formData.username,
        email: formData.email,
        role: "parent",
        is_active: true,
      });
      if (userError) throw userError;

      const { error: parentError } = await supabaseAdmin.from("parents").insert({
        parent_id: userId,
        name: formData.name,
        surname: formData.surname,
        phone: formData.phone || null,
        occupation: formData.occupation || null,
        address: formData.address || null,
      });
      if (parentError) throw parentError;

      alert(`Parent created successfully!\n\nEmail: ${formData.email}\nPassword: ${formData.password}`);
      
      // After successful creation, redirect to manage parents page
      router.push("/admin/parents");
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Add Parent/Guardian</h1>
          <Link href="/admin/parents" className="text-white hover:text-blue-200">← Back</Link>
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><label className="block font-semibold mb-1">Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded" required /></div>
            <div><label className="block font-semibold mb-1">Surname *</label><input type="text" value={formData.surname} onChange={(e) => setFormData({...formData, surname: e.target.value})} className="w-full p-2 border rounded" required /></div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><label className="block font-semibold mb-1">Email *</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-2 border rounded" required /></div>
            <div><label className="block font-semibold mb-1">Username *</label><input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full p-2 border rounded" required /></div>
          </div>

          <div className="mb-4"><label className="block font-semibold mb-1">Password *</label><input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full p-2 border rounded" required minLength={6} /></div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><label className="block font-semibold mb-1">Phone</label><input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-2 border rounded" /></div>
            <div><label className="block font-semibold mb-1">Occupation</label><input type="text" value={formData.occupation} onChange={(e) => setFormData({...formData, occupation: e.target.value})} className="w-full p-2 border rounded" /></div>
          </div>

          <div className="mb-4"><label className="block font-semibold mb-1">Address</label><textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-2 border rounded" rows={2} /></div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700">{loading ? "Creating..." : "Create Parent"}</button>
        </form>
      </div>
    </div>
  );
}

