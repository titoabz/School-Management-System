"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function EditParent() {
  const router = useRouter();
  const params = useParams();
  const parentId = params.id;
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    occupation: "",
    address: "",
  });

  useEffect(() => {
    const fetchParent = async () => {
      const { data } = await supabase
        .from("parents")
        .select("*")
        .eq("parent_id", parentId)
        .single();

      if (data) {
        setFormData({
          name: data.name,
          surname: data.surname,
          phone: data.phone || "",
          occupation: data.occupation || "",
          address: data.address || "",
        });
      }
      setPageLoading(false);
    };

    fetchParent();
  }, [parentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: updateError } = await supabase
        .from("parents")
        .update({
          name: formData.name,
          surname: formData.surname,
          phone: formData.phone || null,
          occupation: formData.occupation || null,
          address: formData.address || null,
        })
        .eq("parent_id", parentId);

      if (updateError) throw updateError;

      alert("Parent updated successfully!");
      router.push("/admin/parents");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Edit Parent</h1>
          <Link href="/admin/parents" className="text-white hover:text-blue-200">
            ← Back to Parents
          </Link>
        </div>
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
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Surname *</label>
              <input
                type="text"
                value={formData.surname}
                onChange={(e) => setFormData({...formData, surname: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Occupation</label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full p-2 border rounded"
              rows={2}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Parent"}
          </button>
        </form>
      </div>
    </div>
  );
}
