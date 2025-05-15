import { readMeals, addMeal } from "./actions";
import { AddButton } from "@/components/shared/AddButton"
import MealContainer from "../../components/meals/MealContainer";
import { UtensilsCrossed } from "lucide-react";

export default async function MealsPage() {
    const mealNodes = await readMeals();
    return (
        <div className="w-full max-w-md space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <UtensilsCrossed className="h-8 w-8 mr-4" />
                    <h1 className="text-4xl font-bold">Meals</h1>
                </div>
                <AddButton
                    itemType="Meal"
                    description="Describe your meal to Mango AI"
                    namePlaceholder='e.g., "Lunch at The Salty Pig"'
                    descriptionPlaceholder='e.g., "BLT and a side of fries with ketchup"'
                    onAdd={addMeal} />
            </div>
            {Object.keys(mealNodes).length === 0 ? (
                <>
                    <hr></hr>
                    <p className="mt-8 ml-1.5 flex justify-center text-muted-foreground">No meals yet. Add one above!</p>
                </>
            ) : (
                <div className="mt-8 mb-48 space-y-4">
                    {Object.entries(mealNodes).map(([key, mealNode]) => (
                        <MealContainer
                            key={key}
                            mealNode={mealNode}
                            biteNodes={mealNode.children}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
