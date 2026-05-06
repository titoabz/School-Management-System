"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LinkParent() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id;
  const [parents, setParents] = useState<any[]>([]);
  const [selectedParent, setSelectedParent] = useState("");
  const [relationship, setRelationship] = useState("father");

  useEffect(() => {
    const fetchParents = async () => {
      const { data } = await supabase.from("parents").select("parent_id, name, surname");
      setParents(data || []);
    };
    fetchParents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("student_parents").insert({
      student_id: studentId,
      parent_id: selectedParent,
      relationship: relationship,
    });
    if (error) alert("Error: " + error.message);
    else {
      alert("Parent linked successfully!");
      router.push(`/admin/students/edit/${studentId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-800 text-white p-4">
        <div className="container mx-auto flex justify-between">
          <h1 className="text-xl font-bold">Link Parent to Student</h1>
          <Link href={`/admin/students/edit/${studentId}`} className="text-white hover:text-blue-200">← Back</Link>
        </div>
      </div>
      <div className="container mx-auto p-6 max-w-md">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <label className="block font-semibold mb-1">Select Parent</label>
            <select value={selectedParent} onChange={(e) => setSelectedParent(e.target.value)} className="w-full p-2 border rounded" required>
              <option value="">Select a parent...</option>
              {parents.map(p => <option key={p.parent_id} value={p.parent_id}>{p.name} {p.surname}</option>)}
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Relationship</label>
            <select value={relationship} onChange={(e) => setRelationship(e.target.value)} className="w-full p-2 border rounded">
              <option value="father">Father</option>
              <option value="mother">Mother</option>
              <option value="guardian">Guardian</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Link Parent</button>
        </form>
      </div>
    </div>
  );
}
