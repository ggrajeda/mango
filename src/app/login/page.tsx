import { LoginForm } from "@/components/authentication/loginForm"
import BackgroundSvg from "@/components/backgrounds/backgroundSvg";

export default function Page() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6">
            <BackgroundSvg src="/waves-background.svg" />
            <div className="w-full max-w-sm">
                <LoginForm />
            </div>
        </div>
    )
}
