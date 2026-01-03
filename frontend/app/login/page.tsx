/**
 * Login Page Route
 *
 * Purpose: App Router page for /login
 * Renders the AuthLayout with LoginModal inside
 *
 * Route: /login
 * Type: App Router page component
 */

import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginModal from "@/components/auth/LoginModal";

export const metadata: Metadata = {
  title: "Sign In | Axion",
  description:
    "Sign in to your Axion account to access career intelligence and guidance.",
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginModal />
    </AuthLayout>
  );
}
