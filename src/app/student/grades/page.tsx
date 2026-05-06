"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function StudentGrades() {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();
  const [hasGrades, setHasGrades] = useState(false);

  useEffect(() => {
    if (!loading && userRole !== "student") {
      router.push("/auth/login");
    }
  }, [userRole, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (userRole !== "student") return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-800 text-white p-4">
        <div className="container mx-auto">
          <Link href="/student/dashboard" className="text-white hover:text-blue-200">
            ← Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold inline ml-4">My Grades</h1>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-5xl mb-4">📊</div>
          <p className="text-gray-500">No grades available yet.</p>
          <p className="text-sm text-gray-400 mt-2">Grades will appear here once they are recorded by your teachers.</p>
          <Link href="/student/dashboard" className="inline-block mt-4 text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
