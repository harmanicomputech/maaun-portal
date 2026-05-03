/**
 * Single source of truth for role → dashboard routing.
 * Import getDashboardRoute everywhere a redirect to a role's home is needed.
 */

export const ROLE_DASHBOARD_MAP: Record<string, string> = {
  student:     "/student/dashboard",
  lecturer:    "/lecturer/dashboard",
  counsellor:  "/counsellor/dashboard",
  bursar:      "/bursar/dashboard",
  registrar:   "/registrar/dashboard",
  hod:         "/hod/dashboard",
  dean:        "/dean/dashboard",
  admin:       "/admin/dashboard",
  super_admin: "/admin/dashboard",
};

/**
 * Returns the correct dashboard route for the given role.
 * Falls back to "/login" for unknown roles.
 */
export function getDashboardRoute(role: string): string {
  const normalized = (role ?? "").toLowerCase().trim();
  return ROLE_DASHBOARD_MAP[normalized] ?? "/login";
}

/**
 * Route prefix → allowed roles mapping used by AppLayout guards.
 * Shared routes (e.g. /announcements) are intentionally absent — no restriction.
 */
export const ROUTE_GUARDS: { prefix: string; roles: string[] }[] = [
  { prefix: "/student/",    roles: ["student"] },
  { prefix: "/lecturer/",   roles: ["lecturer"] },
  { prefix: "/counsellor/", roles: ["counsellor"] },
  { prefix: "/bursar/",     roles: ["bursar"] },
  { prefix: "/registrar/",  roles: ["registrar"] },
  { prefix: "/hod/",        roles: ["hod"] },
  { prefix: "/dean/",       roles: ["dean"] },
  { prefix: "/admin/",      roles: ["admin", "super_admin"] },
];

/**
 * Returns the set of roles allowed on a given path, or null if unrestricted.
 */
export function getAllowedRoles(path: string): string[] | null {
  for (const { prefix, roles } of ROUTE_GUARDS) {
    if (path.startsWith(prefix)) return roles;
  }
  return null;
}
