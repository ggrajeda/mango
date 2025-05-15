"use client"

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { EditDeleteMenu } from "@/components/shared/EditDeleteMenu"
import { editMeal, deleteMeal } from "../../app/meals/actions"
import { BiteNode, Meal, MealNode, toBite, toMeal, getDailyValuePercentage } from "@/types/meals"

import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"


interface MealContainerProps {
    mealNode: MealNode;
    biteNodes: BiteNode[];
}

const chartConfig = {
    amount: {
        label: "Daily Value %",
        color: "#000000",
    },
} satisfies ChartConfig

export default function MealContainer({ mealNode, biteNodes }: MealContainerProps) {
    const meal = toMeal(mealNode);
    const bites = biteNodes.map(b => toBite(b));

    function removeParentheses(nutrient: string): string {
        const parenthesesIndex = nutrient.indexOf(" (");
        if (parenthesesIndex == -1) { return nutrient; }
        return nutrient.slice(0, parenthesesIndex);
    }

    const data = getDailyValuePercentage(meal);
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex justify-center text-left">
                    <div className="relative">
                        <Card className="hover:shadow-md transition-shadow w-md">
                            <CardHeader>
                                <CardTitle>{meal.title}</CardTitle>
                                <CardDescription>{meal.description}</CardDescription>
                            </CardHeader>
                        </Card>
                        <div className="absolute top-4 right-4 flex space-x-2">
                            <EditDeleteMenu<Meal>
                                item={meal}
                                itemType="Meal"
                                onEdit={editMeal}
                                onDelete={deleteMeal}
                            />
                        </div>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{meal.title}</DialogTitle>
                    <DialogDescription className="mt-4 ml-4">
                        {bites.map((bite, index) => (
                            <span key={index}>
                                {`${bite.description} (${bite.servings}×)`}
                                <br />
                            </span>
                        ))}
                    </DialogDescription>
                </DialogHeader>
                <div className="ml-4">
                    <span className="font-semibold text-sm">Nutrition Estimate</span>
                    <ChartContainer config={chartConfig} className="w-full min-h-80 max-w-112 mt-4 mb-8">
                        <BarChart
                            accessibilityLayer
                            layout="vertical"
                            data={data}
                            margin={{ right: 80 }}
                        >
                            <CartesianGrid horizontal={false} />
                            <XAxis
                                type="number"
                                dataKey="amount"
                                domain={[0, 100]}
                                hide
                            />
                            <YAxis
                                dataKey="nutrient"
                                type="category"
                                tickLine={false}
                                tickMargin={10}
                                tickFormatter={removeParentheses}
                                axisLine={false}
                                width={140}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent className="w-36" hideLabel />}
                            />
                            <Bar dataKey="amount" fill="var(--color-amount)" radius={5} />
                        </BarChart>
                    </ChartContainer>
                </div>
            </DialogContent>
        </Dialog>
    );
}
