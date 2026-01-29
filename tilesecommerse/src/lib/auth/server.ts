// Mock auth server for frontend-only app

export async function getUser() {
  // Return mock user for demo purposes
  return {
    id: "mock-user-id",
    name: "Demo User",
    email: "demo@example.com",
    image: null,
    role: "admin", // Set to admin for demo purposes
  };
}

export async function getSession() {
  return {
    user: await getUser(),
    session: {
      id: "mock-session",
      expiresAt: new Date(Date.now() + 86400000),
    },
  };
}

export async function requireAuth() {
  return getUser();
}

export async function isAdmin() {
  // Return true for demo purposes
  return true;
}
