"use server"

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { MealNode, getMealPath, getParent, isMeal, getBitePath } from "@/types/meals";
import { decomposeMeal } from "./dietitian";

async function validateUser(supabase: SupabaseClient) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
        throw new Error("Invalid user");
    }
    return user;
}

export async function readMeals(): Promise<Record<number, MealNode>> {
    const supabase = await createClient();
    const {user} = await validateUser(supabase);

    const { data: foodData, error } = await supabase
        .from("bites")
        .select("*")
        .match({ user_id: user.id })
        .order("created_at", { ascending: false });

    if (error) { throw error; }

    // Map ID to meal information
    const meals: Record<number, MealNode> = []
    for (const food of foodData!) {
        if (isMeal(food)) {
            meals[food.id] = {food: food, children: []};
        }
    }

    for (const food of foodData!) {
        if (!isMeal(food)) {
            const parentId = getParent(food);
            if (parentId in meals) {
                meals[parentId].children?.push({food: food});
            } else {
                console.error(`Meal ID ${parentId} not found for bite ${food.id}`);
            }
        }
    }

    return meals;
}

export async function addMeal(prevState: any, formData: FormData): Promise<any> {
    try {
        const supabase = await createClient();
        const { user } = await validateUser(supabase);

        const name = formData.get("name") as string;
        const description = formData.get("description") as string;

        // Decompose meal into "bites" with nutritional information
        const bites = await decomposeMeal(name, description);

        // Insert meal into database (parent for smaller "bites")
        const { data: mealData, error: mealError } = await supabase.from("bites").insert({
            path: getMealPath(user.id),
            user_id: user.id,
            data: {
                title: name,
                description: description
            },
        }).select();

        if (mealError) {
            console.error(mealError);
            throw Error("Failed to create meal.");
        }

        // Create "bites" under meal
        for (const bite of bites) {
            const { error: biteError } = await supabase.from("bites").insert({
                path: getBitePath(mealData[0], user.id),
                user_id: user.id,
                data: bite,
            }).select();

            if (biteError) {
                console.error(biteError);
                throw Error("Failed to create bite");
            }
        }

        revalidatePath("/");
        return { message: "Successfully added meal" };
    } catch (e) {
        return { error: `${e}` };
    }
}

export async function editMeal(prevState: any, formData: FormData): Promise<any> {
    try {
        const supabase = await createClient();
        const { user } = await validateUser(supabase);

        const id = formData.get("id") as string;
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;

        const { error } = await supabase
            .from("bites")
            .update({
                data: {
                    title: name,
                    description: description
                }
            })
            .match({ user_id: user.id, id: parseInt(id) })
            .select();

        if (error) {
            console.error(error);
            throw Error("Failed to update meal");
        }

        revalidatePath("/");
        return { message: "Successfully updated meal" };
    } catch(e) {
        return { error: `${e}` };
    }
}


export async function deleteMeal(prevState: any, formData: FormData): Promise<any> {
    try {
        const supabase = await createClient();
        const { user } = await validateUser(supabase);

        const id = formData.get("id") as string;

        const { error: biteError } = await supabase
            .rpc("delete_by_ltree_prefix", {prefix: `${getMealPath(user.id)}.${id}`});

        if (biteError) {
            console.error(biteError);
            throw Error("Failed to delete bites");
        }

        const { error: mealError } = await supabase.
            from("bites")
            .delete()
            .eq("id", parseInt(id))
            .select()
        
        if (mealError) {
            console.error(mealError);
            throw Error("Failed to delete meal");
        }

        revalidatePath("/");
        return { message: "Successfully deleted meal" };
    } catch(e) {
        return { error: `${e}` };
    }
}
