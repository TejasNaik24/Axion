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
        <main
            className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#08090f]"
            style={{
                background:
                    "radial-gradient(circle at 100% 0%, rgba(124, 76, 255, 0.15), transparent 50%), radial-gradient(circle at 0% 100%, rgba(0, 240, 216, 0.1), transparent 40%), #05060a",
            }}
        >
            {/* Background Ambience */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent2/20 blur-[120px] rounded-full mix-blend-screen opacity-30" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent1/10 blur-[120px] rounded-full mix-blend-screen opacity-20" />
            </div>

            <WelcomeIntro nextRoute="/" />
        </main>
    );
}
