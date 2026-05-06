"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface TeacherInfo {
  name: string;
  surname: string;
  specialization: string;
  status: string;
}

export default function TeacherDashboard() {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo | null>(null);
  const [courseCount, setCourseCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && userRole !== "teacher") {
      router.push("/auth/login");
    }
  }, [userRole, loading, router]);

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!user) return;

      setIsLoading(true);

      try {
        const { data: teacher, error: teacherError } = await supabase
          .from("instructors")
          .select("name, surname, specialization, status")
          .eq("instructor_id", user.id)
          .maybeSingle();

        if (teacherError) {
          console.error("Teacher fetch error:", teacherError);
        } else if (!teacher) {
          console.warn("No teacher record found for user:", user.id);
        } else {
          setTeacherInfo(teacher);
        }

        const { count, error } = await supabase
          .from("course_assignments")
          .select("*", { count: "exact", head: true })
          .eq("instructor_id", user.id);

        if (!error) {
          setCourseCount(count || 0);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchTeacherData();
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

  if (userRole !== "teacher") return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-blue-800 to-blue-700 text-white p-6">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
        <p className="text-blue-200 mt-1">
          Welcome back, {teacherInfo?.name || "Teacher"} {teacherInfo?.surname || ""}!
        </p>
      </div>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{courseCount}</div>
            <div className="text-gray-500 text-sm">My Courses</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{teacherInfo?.status || "Active"}</div>
            <div className="text-gray-500 text-sm">Status</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{teacherInfo?.specialization || "—"}</div>
            <div className="text-gray-500 text-sm">Specialization</div>
          </div>
        </div>

        {teacherInfo && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">📋 My Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="font-semibold">{user?.email}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Full Name</p>
                <p className="font-semibold">{teacherInfo.name} {teacherInfo.surname}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Specialization</p>
                <p className="font-semibold">{teacherInfo.specialization || "Not specified"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Status</p>
                <p className="font-semibold capitalize">{teacherInfo.status || "Active"}</p>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4 text-gray-800">⚡ Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/teacher/courses"
            className="bg-white p-5 rounded-lg shadow text-center hover:shadow-md transition group"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition">📚</div>
            <h3 className="font-semibold text-gray-800">My Courses</h3>
            <p className="text-sm text-gray-500 mt-1">View your assigned courses</p>
          </Link>
          <Link
            href="/teacher/grades"
            className="bg-white p-5 rounded-lg shadow text-center hover:shadow-md transition group"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition">📊</div>
            <h3 className="font-semibold text-gray-800">Manage Grades</h3>
            <p className="text-sm text-gray-500 mt-1">Record and update student grades</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
