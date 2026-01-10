/**
 * Welcome Page
 *
 * Purpose: Dedicated route for the post-signup onboarding animation.
 * Features:
 * - Server Component
 * - Reuses the auth page background (glass/gradient)
 * - Renders the client-side WelcomeIntro orchestrator
 */

import WelcomeIntro from "../../components/onboarding/WelcomeIntro";

export default function WelcomePage() {
    return (
        <main className="min-h-screen relative overflow-hidden">
            <WelcomeIntro nextRoute="/" />
        </main>
    );
}
