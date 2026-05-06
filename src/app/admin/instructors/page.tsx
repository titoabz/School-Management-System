"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Instructor {
  instructor_id: string;
  name: string;
  surname: string;
  email: string;
  specialization: string;
  status: string;
}

export default function AdminInstructors() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/auth/login");
    }
  }, [isAdmin, loading, router]);

  const fetchInstructors = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Get all instructors first
      const { data: instructorsData, error: instructorsError } = await supabase
        .from("instructors")
        .select("*");

      if (instructorsError) throw instructorsError;

      if (!instructorsData || instructorsData.length === 0) {
        setInstructors([]);
        setIsLoading(false);
        return;
      }

      // Get user emails separately
      const instructorIds = instructorsData.map((i) => i.instructor_id);
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id, email")
        .in("id", instructorIds);

      if (usersError) throw usersError;

      // Create email map
      const emailMap = new Map();
      usersData?.forEach((user) => {
        emailMap.set(user.id, user.email);
      });

      // Combine data
      const formattedInstructors = instructorsData.map((instructor) => ({
        ...instructor,
        email: emailMap.get(instructor.instructor_id) || "No email",
      }));

      setInstructors(formattedInstructors);
    } catch (err: any) {
      console.error("Error fetching instructors:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete teacher "${name}"? This will also delete their user account.`)) return;

    try {
      const { error: instructorError } = await supabase
        .from("instructors")
        .delete()
        .eq("instructor_id", id);

      if (instructorError) throw instructorError;

      const { error: userError } = await supabase
        .from("users")
        .delete()
        .eq("id", id);

      if (userError) throw userError;

      alert("Teacher deleted successfully!");
      fetchInstructors();
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
          <h1 className="text-xl font-bold">Manage Teachers</h1>
          <Link href="/admin/dashboard" className="text-white hover:text-blue-200">
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">All Teachers</h2>
          <Link href="/admin/instructors/add" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Add Teacher
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
        )}

        {instructors.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No teachers found. Click "Add Teacher" to get started.</p>
            <Link 
              href="/admin/instructors/add" 
              className="inline-block mt-4 text-blue-600 hover:underline"
            >
              + Add Your First Teacher
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Specialization</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {instructors.map((instructor) => (
                  <tr key={instructor.instructor_id} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      {instructor.name} {instructor.surname}
                    </td>
                    <td className="p-3">{instructor.email}</td>
                    <td className="p-3">{instructor.specialization || "—"}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          instructor.status === "active"
                            ? "bg-green-100 text-green-800"
                            : instructor.status === "on_leave"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {instructor.status || "active"}
                      </span>
                    </td>
                    <td className="p-3">
                      <Link href={`/admin/instructors/edit/${instructor.instructor_id}`} className="text-blue-600 mr-3 hover:underline">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(instructor.instructor_id, instructor.name)} className="text-red-600 hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
