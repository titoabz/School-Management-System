"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Course {
  course_id: number;
  course_code: string;
  title: string;
  credits: number;
  description: string;
  department_id: number;
  department_name?: string;
}

export default function AdminCourses() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/auth/login");
    }
  }, [isAdmin, loading, router]);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase
        .from("courses")
        .select(`
          course_id,
          course_code,
          title,
          credits,
          description,
          department_id,
          departments!left (name)
        `)
        .order("course_code");

      if (data) {
        const formatted = data.map((course: any) => ({
          ...course,
          department_name: course.departments?.name,
        }));
        setCourses(formatted);
      }
      setIsLoading(false);
    };
    fetchCourses();
  }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete course "${title}"? This will also delete enrollments.`)) return;

    const { error } = await supabase.from("courses").delete().eq("course_id", id);
    if (error) {
      alert("Error deleting course: " + error.message);
    } else {
      setCourses(courses.filter((c) => c.course_id !== id));
      alert("Course deleted successfully!");
    }
  };

  if (loading || isLoading) return <div className="text-center py-10">Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Manage Courses</h1>
        <Link href="/admin/dashboard" className="text-white hover:text-blue-200">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="container mx-auto p-6">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">All Courses</h2>
          <Link href="/admin/courses/add" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Add New Course
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No courses found. Click "Add New Course" to get started.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Course Code</th>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Credits</th>
                  <th className="p-3 text-left">Department</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.course_id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{course.course_code}</td>
                    <td className="p-3">{course.title}</td>
                    <td className="p-3">{course.credits}</td>
                    <td className="p-3">{course.department_name || "—"}</td>
                    <td className="p-3">
                      <Link
                        href={`/admin/courses/edit/${course.course_id}`}
                        className="text-blue-600 mr-3 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(course.course_id, course.title)}
                        className="text-red-600 hover:underline"
                      >
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
