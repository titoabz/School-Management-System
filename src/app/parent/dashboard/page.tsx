"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Child {
  student_id: string;
  name: string;
  surname: string;
  student_number: string;
}

export default function ParentDashboard() {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && userRole !== "parent") {
      router.push("/auth/login");
    }
  }, [userRole, loading, router]);

  useEffect(() => {
    const fetchChildren = async () => {
      if (!user) return;
      
      setError("");
      
      try {
        // Step 1: Get the parent record to get the parent_id
        const { data: parentData, error: parentError } = await supabase
          .from("parents")
          .select("parent_id")
          .eq("parent_id", user.id)
          .single();

        if (parentError) {
          console.error("Parent error:", parentError);
          setError("Parent account not found");
          setIsLoading(false);
          return;
        }

        // Step 2: Get student_ids from student_parents
        const { data: studentLinks, error: linkError } = await supabase
          .from("student_parents")
          .select("student_id")
          .eq("parent_id", parentData.parent_id);

        if (linkError) {
          console.error("Link error:", linkError);
          setError("Could not find linked children");
          setIsLoading(false);
          return;
        }

        if (!studentLinks || studentLinks.length === 0) {
          setChildren([]);
          setIsLoading(false);
          return;
        }

        // Step 3: Get student details one by one (simpler, avoids complex queries)
        const studentPromises = studentLinks.map(async (link) => {
          const { data, error } = await supabase
            .from("students")
            .select("student_id, name, surname, student_number")
            .eq("student_id", link.student_id)
            .single();
          
          if (!error && data) {
            return data;
          }
          return null;
        });

        const studentsData = await Promise.all(studentPromises);
        const validStudents = studentsData.filter(s => s !== null) as Child[];
        
        setChildren(validStudents);
      } catch (err: any) {
        console.error("Unexpected error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchChildren();
    }
  }, [user]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (userRole !== "parent") {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-blue-800 to-blue-700 text-white p-6">
        <h1 className="text-2xl font-bold">Parent Portal</h1>
        <p className="text-blue-200 mt-1">Welcome, {user?.email}</p>
      </div>

      <div className="container mx-auto p-6">
        {children.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center max-w-md mx-auto">
            <div className="text-5xl mb-4">👨‍👩‍👧</div>
            <p className="text-gray-500">No children linked to your account yet.</p>
            <p className="text-sm text-gray-400 mt-2">Please contact the school administration to link your child.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {children.map((child) => (
              <div key={child.student_id} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-blue-800 mb-2">
                  {child.name} {child.surname}
                </h2>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Student ID:</span> {child.student_number}</p>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-2">Coming Soon:</p>
                  <div className="flex gap-2">
                    <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded text-xs">📊 Grades</span>
                    <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded text-xs">📅 Attendance</span>
                    <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded text-xs">💰 Fees</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
