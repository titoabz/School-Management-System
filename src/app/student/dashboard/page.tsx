"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface StudentInfo {
  name: string;
  surname: string;
  student_number: string;
  enrollment_year: number;
  status: string;
}

export default function StudentDashboard() {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [courseCount, setCourseCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && userRole !== "student") {
      router.push("/auth/login");
    }
  }, [userRole, loading, router]);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user) return;

      setIsLoading(true);

      try {
        // Fetch student info
        const { data: student } = await supabase
          .from("students")
          .select("name, surname, student_number, enrollment_year, status")
          .eq("student_id", user.id)
          .single();

        if (student) {
          setStudentInfo(student);
        }

        // Count enrolled courses
        const { count, error } = await supabase
          .from("enrollments")
          .select("*", { count: "exact", head: true })
          .eq("student_id", user.id);

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
      fetchStudentData();
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

  if (userRole !== "student") return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-700 text-white p-6">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <p className="text-blue-200 mt-1">
          Welcome back, {studentInfo?.name || "Student"} {studentInfo?.surname || ""}!
        </p>
      </div>

      <div className="container mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{courseCount}</div>
            <div className="text-gray-500 text-sm">Enrolled Courses</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{studentInfo?.status || "Active"}</div>
            <div className="text-gray-500 text-sm">Status</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{studentInfo?.enrollment_year || "—"}</div>
            <div className="text-gray-500 text-sm">Enrollment Year</div>
          </div>
        </div>

        {/* Student Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">📋 My Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Student ID</p>
              <p className="font-semibold">{studentInfo?.student_number || "Not assigned"}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-semibold">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Full Name</p>
              <p className="font-semibold">
                {studentInfo?.name} {studentInfo?.surname}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Status</p>
              <p className="font-semibold capitalize">{studentInfo?.status || "Active"}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold mb-4 text-gray-800">⚡ Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/student/grades"
            className="bg-white p-5 rounded-lg shadow text-center hover:shadow-md transition group"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition">📊</div>
            <h3 className="font-semibold text-gray-800">View Grades</h3>
            <p className="text-sm text-gray-500 mt-1">Check your academic performance</p>
          </Link>
          <Link
            href="/student/schedule"
            className="bg-white p-5 rounded-lg shadow text-center hover:shadow-md transition group"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition">📅</div>
            <h3 className="font-semibold text-gray-800">My Schedule</h3>
            <p className="text-sm text-gray-500 mt-1">View your class timetable</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
