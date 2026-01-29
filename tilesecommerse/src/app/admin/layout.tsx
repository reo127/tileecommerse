import { Sidebar } from "@/components/admin/Sidebar";
import { getSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";

// Force dynamic rendering for all admin pages (they require authentication)
export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("\n\n=== ADMIN LAYOUT ACCESSED ===");
  console.log("Timestamp:", new Date().toISOString());

  // Mock session for frontend-only demo
  const session = await getSession();

  console.log("Session exists:", !!session);
  console.log("User exists:", !!session?.user);

  if (session?.user) {
    console.log("User ID:", session.user.id);
    console.log("User email:", session.user.email);
  }

  // For frontend-only demo, comment out redirect
  // In real app, redirect to login if no session
  // if (!session?.user) {
  //   console.log("NO USER - redirecting");
  //   redirect("/login?redirect=/admin");
  // }

  // Get user role - Better Auth returns it in the user object
  const userRole = (session.user as any).role;
  console.log("User role from session:", userRole);
  console.log("User role type:", typeof userRole);
  console.log("User role strict equality check (admin):", userRole === "admin");
  console.log("User role strict equality check (superadmin):", userRole === "superadmin");

  // Check if user has admin or superadmin role
  if (!userRole || (userRole !== "admin" && userRole !== "superadmin")) {
    console.error("\n!!! UNAUTHORIZED ACCESS ATTEMPT !!!");
    console.error("User role:", userRole);
    console.error("Full user object:", JSON.stringify(session.user, null, 2));
    console.error("Redirecting to home page\n");
    redirect("/?error=unauthorized");
  }

  console.log("✅ ACCESS GRANTED to admin dashboard\n\n");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
