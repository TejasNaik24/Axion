/**
 * Sign Up Layout
 *
 * Purpose: Custom layout for the signup route that excludes TopNav
 * This overrides the root layout for this specific route segment
 */

import type { Metadata } from "next";

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
