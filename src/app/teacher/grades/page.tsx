"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function TeacherGrades() {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();
  const [grades, setGrades] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && userRole !== "teacher") {
      router.push("/auth/login");
    }
  }, [userRole, loading, router]);

  useEffect(() => {
    const fetchGrades = async () => {
      if (!user) return;

      try {
        const { data: courses, error: courseError } = await supabase
          .from("course_assignments")
          .select("assignment_id")
          .eq("instructor_id", user.id);

        if (courseError) throw courseError;

        if (!courses || courses.length === 0) {
          setGrades([]);
          setIsLoading(false);
          return;
        }

        const courseIds = courses.map((c) => c.assignment_id);

        const { data: enrollments, error: enrollError } = await supabase
          .from("enrollments")
          .select(`
            enrollment_id,
            student_id,
            students (name, surname)
          `)
          .in("course_assignment_id", courseIds);

        if (enrollError) throw enrollError;

        const enrollmentIds = enrollments?.map((e) => e.enrollment_id) || [];

        if (enrollmentIds.length > 0) {
          const { data: gradesData, error: gradeError } = await supabase
            .from("grades")
            .select("*")
            .in("enrollment_id", enrollmentIds);

          if (gradeError) throw gradeError;
          setGrades(gradesData || []);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchGrades();
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
          <h1 className="text-xl font-bold inline ml-4">Manage Grades</h1>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {grades.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-5xl mb-4">📊</div>
            <p className="text-gray-500">No grades recorded yet.</p>
            <p className="text-sm text-gray-400 mt-2">Grades will appear here once students are enrolled.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Student</th>
                  <th className="p-3 text-left">Score</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade) => (
                  <tr key={grade.grade_id} className="border-t">
                    <td className="p-3">Student Name</td>
                    <td className="p-3">{grade.score || grade.grade}%</td>
                    <td className="p-3 capitalize">{grade.exam_type || "Exam"}</td>
                    <td className="p-3 text-gray-500">
                      {grade.date_recorded ? new Date(grade.date_recorded).toLocaleDateString() : "—"}
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
