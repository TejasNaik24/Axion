/**
 * Login Layout
 *
 * Purpose: Custom layout for the login route that excludes TopNav
 * This overrides the root layout for this specific route segment
 */

import type { Metadata } from "next";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
