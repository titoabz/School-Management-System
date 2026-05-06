"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: any;
  userRole: string | null;
  loading: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  isParent: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  loading: true,
  isAdmin: false,
  isTeacher: false,
  isStudent: false,
  isParent: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        // Get current user from Supabase Auth
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.log("No user logged in");
          setUser(null);
          setUserRole(null);
          setLoading(false);
          return;
        }

        console.log("User found:", user.email);
        setUser(user);

        // Fetch role from users table
        const { data, error } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching role:", error);
          setUserRole("student");
        } else if (!data) {
          console.warn("User not found in users table, creating entry...");

          // Auto-create user entry if missing
          const { error: insertError } = await supabase.from("users").insert({
            id: user.id,
            username: user.email?.split("@")[0],
            email: user.email,
            role: "student",
            is_active: true,
          });

          if (insertError) {
            console.error("Error creating user entry:", insertError);
          }
          setUserRole("student");
        } else {
          console.log("Role fetched:", data.role);
          setUserRole(data.role);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.email);
      setUser(session?.user || null);

      if (session?.user) {
        const { data } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle();

        setUserRole(data?.role || "student");
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        loading,
        isAdmin: userRole === "admin",
        isTeacher: userRole === "teacher",
        isStudent: userRole === "student",
        isParent: userRole === "parent",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
