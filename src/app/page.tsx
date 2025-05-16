import Link from "next/link";
import BackgroundSvg from "@/components/backgrounds/backgroundSvg";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-32 text-center">
      <BackgroundSvg src="/waves-background.svg" />
      <main className="flex flex-col items-center max-w-4xl gap-12">
        {/* Hero section */}
        <div className="space-y-4">
          <h1 className="text-primary text-6xl md:text-7xl font-serif">
            Mango
          </h1>
          <p className="text-secondary text-xl md:text-2xl">
            Transform your health with an AI companion
          </p>
        </div>

        {/* CTA */}
        <div className="">
          <Link href="/login" passHref>
            <Button className="font-bold text-xl p-8">
              Get Started
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
