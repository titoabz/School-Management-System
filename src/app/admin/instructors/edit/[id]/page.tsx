import Link from "next/link";

export default function EditInstructorPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-2">Edit Teacher</h1>
        <p className="text-gray-600 mb-6">Form setup pending based on your instructors table schema.</p>
        <Link href="/admin/instructors" className="text-blue-600 hover:text-blue-800">
          ← Back to Teachers
        </Link>
      </div>
    </div>
  );
}
