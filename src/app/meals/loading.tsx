import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, UtensilsCrossed } from "lucide-react";

export default function LoadingPage() {
    return (
        <div className="w-full max-w-md space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <UtensilsCrossed className="h-8 w-8 mr-4" />
                    <h1 className="text-4xl font-bold">Meals</h1>
                </div>
                <div className="max-w-2xl space-y-6">
                    <Button>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="mt-8 space-y-4">
                <Skeleton className="w-full h-24" />
                <Skeleton className="w-full h-24" />
                <Skeleton className="w-full h-24" />
            </div>
        </div>
    )
}
