"use client"

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation"


export default function GoogleSignIn() {
    const router = useRouter();

    window.handleSignInWithGoogle = async (response: any) => {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithIdToken({
            provider: "google",
            token: response.credential,
        });
        if (error) {
            console.error("Error signing in with Google:", error);
        } else {
            router.push("/meals");
        }
    };
    return (
        <>
            <script src="https://accounts.google.com/gsi/client" async></script>
            <div id="g_id_onload"
                data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
                data-context="signin"
                data-ux_mode="popup"
                data-callback="handleSignInWithGoogle"
                data-itp_support="true">
            </div>
            <div className="g_id_signin"
                data-type="icon"
                data-shape="square"
                data-theme="outline"
                data-text="continue_with"
                data-size="large">
            </div>
        </>
    );
}
