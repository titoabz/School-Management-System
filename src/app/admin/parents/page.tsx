"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Parent {
  parent_id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  occupation: string;
}

export default function AdminParents() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [parents, setParents] = useState<Parent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/auth/login");
    }
  }, [isAdmin, loading, router]);

  useEffect(() => {
    const fetchParents = async () => {
      // Get parents from parents table
      const { data: parentsData, error: parentsError } = await supabase
        .from("parents")
        .select("*");

      if (parentsError) {
        console.error("Error fetching parents:", parentsError);
        setParents([]);
        setIsLoading(false);
        return;
      }

      if (!parentsData || parentsData.length === 0) {
        setParents([]);
        setIsLoading(false);
        return;
      }

      // Get user emails
      const parentIds = parentsData.map(p => p.parent_id);
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id, email")
        .in("id", parentIds);

      if (usersError) {
        console.error("Error fetching users:", usersError);
        setParents(parentsData.map(p => ({ ...p, email: "No email" })));
        setIsLoading(false);
        return;
      }

      const emailMap = new Map();
      usersData?.forEach(user => {
        emailMap.set(user.id, user.email);
      });

      const formattedParents = parentsData.map(parent => ({
        ...parent,
        email: emailMap.get(parent.parent_id) || "No email",
      }));

      setParents(formattedParents);
      setIsLoading(false);
    };

    fetchParents();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete parent "${name}"? This will also delete their user account.`)) return;
    
    try {
      // Delete from parents table
      const { error: parentError } = await supabase
        .from("parents")
        .delete()
        .eq("parent_id", id);
      
      if (parentError) throw parentError;

      // Delete from users table
      const { error: userError } = await supabase
        .from("users")
        .delete()
        .eq("id", id);
      
      if (userError) throw userError;

      alert("Parent deleted successfully!");
      setParents(parents.filter(p => p.parent_id !== id));
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  if (loading || isLoading) return <div className="text-center py-10">Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Manage Parents</h1>
          <Link href="/admin/dashboard" className="text-white hover:text-blue-200">
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">All Parents/Guardians</h2>
          <Link href="/admin/parents/add" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Add Parent
          </Link>
        </div>

        {parents.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No parents found. Click "Add Parent" to get started.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Occupation</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {parents.map((parent) => (
                  <tr key={parent.parent_id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{parent.name} {parent.surname}</td>
                    <td className="p-3">{parent.email}</td>
                    <td className="p-3">{parent.phone || "—"}</td>
                    <td className="p-3">{parent.occupation || "—"}</td>
                    <td className="p-3">
                      <Link href={`/admin/parents/edit/${parent.parent_id}`} className="text-blue-600 mr-3 hover:underline">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(parent.parent_id, parent.name)} className="text-red-600 hover:underline">
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
    </div>
  );
}
