"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Student {
  student_id: string;
  name: string;
  surname: string;
  email: string;
  student_number: string;
  status: string;
}

export default function AdminStudents() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [parents, setParents] = useState<any[]>([]);
  const [selectedParent, setSelectedParent] = useState("");
  const [relationship, setRelationship] = useState("father");
  const [linkLoading, setLinkLoading] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/auth/login");
    }
  }, [isAdmin, loading, router]);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data: studentsData } = await supabase.from("students").select("*");

      if (studentsData) {
        const studentIds = studentsData.map((s) => s.student_id);
        const { data: users } = await supabase.from("users").select("id, email").in("id", studentIds);
        const emailMap = new Map(users?.map((u) => [u.id, u.email]));
        const formatted = studentsData.map((s) => ({
          ...s,
          email: emailMap.get(s.student_id) || "No email",
        }));
        setStudents(formatted);
      }
      setIsLoading(false);
    };

    fetchStudents();
  }, []);

  const openLinkModal = async (student: Student) => {
    setSelectedStudent(student);
    const { data } = await supabase.from("parents").select("parent_id, name, surname");
    setParents(data || []);
    setSelectedParent("");
    setRelationship("father");
    setShowLinkModal(true);
  };

  const handleLinkParent = async () => {
    if (!selectedParent) {
      alert("Please select a parent");
      return;
    }

    setLinkLoading(true);

    const { error } = await supabase.from("student_parents").insert({
      student_id: selectedStudent?.student_id,
      parent_id: selectedParent,
      relationship: relationship,
    });

    if (error) {
      alert("Error linking parent: " + error.message);
    } else {
      alert("Parent linked successfully!");
      setShowLinkModal(false);
      setSelectedStudent(null);
      setSelectedParent("");
      setRelationship("father");
    }

    setLinkLoading(false);
  };

  if (loading || isLoading) return <div className="text-center py-10">Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-800 text-white p-4 flex justify-between">
        <h1 className="text-xl font-bold">Manage Students</h1>
        <Link href="/admin/dashboard" className="text-white hover:text-blue-200">← Back</Link>
      </div>

      <div className="container mx-auto p-6">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">All Students</h2>
          <Link href="/admin/students/add" className="bg-blue-600 text-white px-4 py-2 rounded">+ Add Student</Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Student ID</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.student_id} className="border-t">
                  <td className="p-3">{s.name} {s.surname}</td>
                  <td className="p-3">{s.email}</td>
                  <td className="p-3">{s.student_number}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">{s.status}</span>
                  </td>
                  <td className="p-3">
                    <Link href={`/admin/students/edit/${s.student_id}`} className="text-blue-600 mr-3">Edit</Link>
                    <button onClick={() => openLinkModal(s)} className="text-green-600 mr-3 hover:underline">
                      Link Parent
                    </button>
                    <button className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showLinkModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-xl font-bold mb-4">Link Parent to {selectedStudent.name} {selectedStudent.surname}</h2>

            <div className="mb-4">
              <label className="block font-semibold mb-1">Select Parent</label>
              <select
                value={selectedParent}
                onChange={(e) => setSelectedParent(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">-- Select a parent --</option>
                {parents.map((p) => (
                  <option key={p.parent_id} value={p.parent_id}>
                    {p.name} {p.surname}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-1">Relationship</label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="father">Father</option>
                <option value="mother">Mother</option>
                <option value="guardian">Guardian</option>
              </select>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleLinkParent}
                disabled={linkLoading}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                {linkLoading ? "Linking..." : "Link Parent"}
              </button>
              <button
                onClick={() => setShowLinkModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
