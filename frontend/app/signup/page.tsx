/**
 * Sign Up Page Route
 *
 * Purpose: App Router page for /signup
 * Renders the AuthLayout with SignUpModal inside
 *
 * Route: /signup
 * Type: App Router page component
 */

import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import SignUpModal from "@/components/auth/SignUpModal";

export const metadata: Metadata = {
  title: "Sign Up | Axion",
  description:
    "Create your Axion account to access career intelligence and guidance.",
};

export default function SignUpPage() {
  return (
    <AuthLayout>
      <SignUpModal />
    </AuthLayout>
  );
}
