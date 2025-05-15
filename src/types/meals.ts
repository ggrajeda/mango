import { Json, Tables } from "./database.types";

interface NutrientAmount {
    nutrient: string,
    amount: number
}

type MealFields = {
    id: number;
    title: string;
    description: string;
    nutrients: NutrientAmount[];  // Computed from bites. Not stored in table.
}

export type Meal = MealFields & Json;

interface BiteFields {
    id: number;
    description: string;
    servings: number;
    nutrients_per_serving: NutrientAmount[];
}

export type Bite = BiteFields & Json;

// Node to implement the "bites" directory structure.
// "Meals" are at the top level, comprising multiple "bites" at the lower level.
export interface MealNode {
    food: Tables<"bites">;
    children: BiteNode[];
}

export interface BiteNode {
    food: Tables<"bites">;
}

export function getMealPath(user_id: string): string {
    return `${user_id.replace(/[^0-9A-Z]+/gi,"")}.meals`;
}

export function getBitePath(parent: Tables<"bites">, user_id: string): string {
    return `${getMealPath(user_id)}.${parent.id}`;
}

export function isMeal(row: Tables<"bites">): boolean {
    return row.path == getMealPath(row.user_id!);
}

const DAILY_VALUES: Record<string, number> = {
    "Calories": 2000,
    "Total Fat (g)": 78,
    "Saturated Fat (g)": 20,
    "Cholesterol (mg)": 300,
    "Sodium (mg)": 2300,
    "Potassium (mg)": 4700,
    "Total Carbohydrate (g)": 275,
    "Added Sugars (g)": 50,
    "Dietary Fiber (g)": 28,
    "Protein (g)": 50
};

function calculateTotalNutrients(bites: BiteNode[]): NutrientAmount[] {
    // Initialize totals for all nutrient fields
    const totals: Record<string, number> = {};
    Object.keys(DAILY_VALUES).forEach((nutrient) => {
        totals[nutrient] = 0;
    });

    // Sum up the nutrients from all items
    bites.forEach(bite => {
        const { nutrients_per_serving, servings } = bite.food.data as Bite;
        if (!nutrients_per_serving) { return; }
        nutrients_per_serving.forEach(({ nutrient, amount }) => {
            if (totals[nutrient] !== undefined) {
                totals[nutrient] += servings * amount;
            } else {
                console.error(`Unexpected nutrient: ${nutrient}`);
            }
        });
    });

    return Object.keys(DAILY_VALUES).map((nutrient) => {
        return { nutrient: nutrient, amount: totals[nutrient] };
    });
}

export function getDailyValuePercentage(meal: Meal): NutrientAmount[] {
    return meal.nutrients.map(({nutrient, amount}) => {
        return { nutrient: nutrient, amount: Math.floor(100 * amount / DAILY_VALUES[nutrient]) };
    });
}

export function toMeal(mealNode: MealNode) : Meal {
    const meal = mealNode.food.data as Meal;
    meal.id = mealNode.food.id;
    meal.nutrients = calculateTotalNutrients(mealNode.children);
    return meal;
}

export function toBite(biteNode: BiteNode): Bite {
    const bite = biteNode.food.data as Bite;
    bite.id = biteNode.food.id;
    return bite;
}

export function getParent(row: Tables<"bites">): number {
    const path = row.path as string;
    return parseInt(path.slice(path.lastIndexOf(".") + 1));
}
