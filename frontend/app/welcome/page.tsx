/**
 * Welcome Page
 *
 * Purpose: Dedicated route for the post-signup onboarding animation.
 * Features:
 * - Server Component
 * - Reuses the auth page background (glass/gradient)
 * - Renders the client-side WelcomeIntro orchestrator
 */

"use client";

import { useSearchParams } from "next/navigation";
import WelcomeIntro from "../../components/onboarding/WelcomeIntro";

export default function WelcomePage() {
    const searchParams = useSearchParams();
    const isLogin = searchParams.get("mode") === "login";

    const words = isLogin ? ["Welcome", "back"] : ["Welcome", "to", "Axion"];

    return (
        <main className="min-h-screen relative overflow-hidden">
            <WelcomeIntro nextRoute="/chat" words={words} />
        </main>
    );
}
