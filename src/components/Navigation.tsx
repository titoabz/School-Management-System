"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function Navigation() {
  const { user, userRole, loading, isAdmin } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // Debug log
  console.log("Navigation - userRole:", userRole);
  console.log("Navigation - isAdmin:", isAdmin);

  if (loading) {
    return (
      <nav className="bg-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="w-32 h-8 bg-blue-700 animate-pulse rounded" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-blue-800 text-white shadow-lg sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-blue-200 transition">
          🏫 School Management
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {isAdmin && (
                <Link href="/admin/dashboard" className="hover:text-blue-200">
                  Admin
                </Link>
              )}
              
              <span className="bg-blue-600 px-2 py-1 rounded text-xs">
                {userRole || "user"}
              </span>
              
              <button
                onClick={handleSignOut}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="bg-white text-blue-800 px-3 py-1 rounded">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
