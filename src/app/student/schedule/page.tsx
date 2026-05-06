"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function StudentSchedule() {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    if (!loading && userRole !== "student") {
      router.push("/auth/login");
    }
  }, [userRole, loading, router]);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;

      try {
        // Get enrolled courses
        const { data: enrollments, error } = await supabase
          .from("enrollments")
          .select(`
            course_assignments (
              assignment_id,
              courses (
                course_code,
                title,
                credits
              )
            )
          `)
          .eq("student_id", user.id);

        if (error) {
          console.error("Error fetching courses:", error);
        } else if (enrollments) {
          const courseList = enrollments
            .map((e: any) => e.course_assignments?.courses)
            .filter(Boolean);
          setCourses(courseList);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoadingCourses(false);
      }
    };

    if (user) {
      fetchCourses();
    } else {
      setLoadingCourses(false);
    }
  }, [user]);

  if (loading || loadingCourses) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-2">Loading schedule...</p>
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
          <h1 className="text-xl font-bold inline ml-4">My Schedule</h1>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-5xl mb-4">📅</div>
            <p className="text-gray-500">No courses enrolled yet.</p>
            <p className="text-sm text-gray-400 mt-2">Your class schedule will appear here once you are enrolled in courses.</p>
            <Link href="/student/dashboard" className="inline-block mt-4 text-blue-600 hover:underline">
              ← Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {courses.map((course: any, index: number) => (
              <div key={index} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-blue-800">{course.course_code}</p>
                    <p className="text-gray-700">{course.title}</p>
                    <p className="text-sm text-gray-500">Credits: {course.credits}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600">Enrolled</p>
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
