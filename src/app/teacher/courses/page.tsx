"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function TeacherCourses() {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && userRole !== "teacher") {
      router.push("/auth/login");
    }
  }, [userRole, loading, router]);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("course_assignments")
          .select(`
            assignment_id,
            courses (
              course_code,
              title,
              credits
            )
          `)
          .eq("instructor_id", user.id);

        if (error) {
          console.error("Error fetching courses:", error);
        } else {
          setCourses(data || []);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchCourses();
    }
  }, [user]);

  if (loading || isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (userRole !== "teacher") return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-800 text-white p-4">
        <div className="container mx-auto">
          <Link href="/teacher/dashboard" className="text-white hover:text-blue-200">← Back to Dashboard</Link>
          <h1 className="text-xl font-bold inline ml-4">My Courses</h1>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-gray-500">No courses assigned yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course: any) => (
              <div key={course.assignment_id} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-bold text-blue-800">{course.courses?.course_code}</h3>
                <p className="text-gray-700">{course.courses?.title}</p>
                <p className="text-sm text-gray-500">Credits: {course.courses?.credits}</p>
                <Link
                  href={`/teacher/grades?course=${course.assignment_id}`}
                  className="inline-block mt-3 text-blue-600 hover:underline text-sm"
                >
                  Manage Grades →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
