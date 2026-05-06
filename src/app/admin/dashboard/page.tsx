"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const { user, userRole, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/auth/login");
    }
  }, [isAdmin, loading, router]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-800 text-white p-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p>
          Welcome, {user?.email} (Role: {userRole})
        </p>
      </div>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link href="/admin/students" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">👨‍🎓</span>
              <h2 className="text-xl font-bold">Manage Students</h2>
            </div>
            <p className="text-gray-600">Add, edit, or delete student records</p>
          </Link>
          <Link href="/admin/instructors" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">👩‍🏫</span>
              <h2 className="text-xl font-bold">Manage Teachers</h2>
            </div>
            <p className="text-gray-600">Add, edit, or delete teacher records</p>
          </Link>
          <Link href="/admin/courses" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📚</span>
              <h2 className="text-xl font-bold">Manage Courses</h2>
            </div>
            <p className="text-gray-600">Add, edit, or delete course records</p>
          </Link>
          <Link href="/admin/parents" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">👨‍👩‍👧</span>
              <h2 className="text-xl font-bold">Manage Parents</h2>
            </div>
            <p className="text-gray-600">Add, edit, or delete parent/guardian records</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
