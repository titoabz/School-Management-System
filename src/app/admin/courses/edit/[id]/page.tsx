"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Department {
  department_id: number;
  code: string;
  name: string;
}

export default function EditCourse() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState({
    course_code: "",
    title: "",
    credits: 3,
    description: "",
    department_id: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      // Fetch departments
      const { data: depts } = await supabase.from("departments").select("department_id, code, name");
      setDepartments(depts || []);

      // Fetch course
      const { data: course } = await supabase
        .from("courses")
        .select("*")
        .eq("course_id", courseId)
        .single();

      if (course) {
        setFormData({
          course_code: course.course_code,
          title: course.title,
          credits: course.credits,
          description: course.description || "",
          department_id: course.department_id || "",
        });
      }
      setLoading(false);
    };
    fetchData();
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const { error } = await supabase
      .from("courses")
      .update({
        course_code: formData.course_code.toUpperCase(),
        title: formData.title,
        credits: formData.credits,
        description: formData.description,
        department_id: formData.department_id || null,
      })
      .eq("course_id", courseId);

    if (error) {
      setError(error.message);
    } else {
      alert("Course updated successfully!");
      router.push("/admin/courses");
    }
    setSaving(false);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-800 text-white p-4">
        <div className="container mx-auto">
          <Link href="/admin/courses" className="text-white hover:text-blue-200">
            ← Back to Courses
          </Link>
          <h1 className="text-xl font-bold inline ml-4">Edit Course</h1>
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

          <div className="mb-4">
            <label className="block font-semibold mb-1">Course Code *</label>
            <input
              type="text"
              value={formData.course_code}
              onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Course Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold mb-1">Credits</label>
              <input
                type="number"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                className="w-full p-2 border rounded"
                min={1}
                max={6}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Department</label>
              <select
                value={formData.department_id}
                onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.department_id} value={dept.department_id}>
                    {dept.code} - {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href="/admin/courses"
              className="flex-1 bg-gray-300 text-gray-700 p-2 rounded text-center hover:bg-gray-400"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
