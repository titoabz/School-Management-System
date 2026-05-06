"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditStudentPage() {
  const params = useParams();
  const studentId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [linkedParents, setLinkedParents] = useState<any[]>([]);

  useEffect(() => {
    const fetchLinkedParents = async () => {
      if (!studentId) return;

      const { data } = await supabase
        .from("student_parents")
        .select(`parent_id, relationship, parents!inner (name, surname, phone, email)`)
        .eq("student_id", studentId);

      if (data) {
        setLinkedParents(data);
      }
    };

    fetchLinkedParents();
  }, [studentId]);

  const handleUnlinkParent = async (parentId: string) => {
    if (!studentId) return;

    const { error } = await supabase
      .from("student_parents")
      .delete()
      .eq("student_id", studentId)
      .eq("parent_id", parentId);

    if (error) {
      alert("Error unlinking parent: " + error.message);
      return;
    }

    setLinkedParents((current) => current.filter((link) => link.parent_id !== parentId));
    alert("Parent unlinked successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-2">Edit Student</h1>
        <p className="text-gray-600 mb-6">Form setup pending based on your students table schema.</p>
        <Link href="/admin/students" className="text-blue-600 hover:text-blue-800">
          ← Back to Students
        </Link>

        <div className="mt-6">
          <h3 className="font-bold text-lg mb-2">Linked Parents/Guardians</h3>
          {linkedParents.length === 0 ? (
            <p className="text-gray-500">No parents linked yet.</p>
          ) : (
            <div className="space-y-2">
              {linkedParents.map((link, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded flex justify-between">
                  <div>
                    <p className="font-semibold">{link.parents.name} {link.parents.surname}</p>
                    <p className="text-sm text-gray-500">Relationship: {link.relationship}</p>
                    <p className="text-sm text-gray-500">Email: {link.parents.email}</p>
                  </div>
                  <button
                    onClick={() => handleUnlinkParent(link.parent_id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Unlink
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
