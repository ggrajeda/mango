# Project Overview

Mango is a Next.js application that allows users to track their macronutrient
intake over time.

## Main Idea

Mango is a proof-of-concept for how AI models can transform natural language
into computation.

In this simple case, we are using a low-latency AI model to transform a
high-level, natural-language description of a meal into a predictable JSON
format (a list of "bites") that is amenable to computation.

Below is an example:

### Input

`"Grilled salmon filet, roasted sweet potato, and steamed spinach"`

### Output

```json
[
  {
    "description": "Grilled salmon filet (wild, 3 oz cooked)",
    "servings": 1,
    "nutrients_per_serving": [
      {"nutrient": "Calories", "amount": 177},
      {"nutrient": "Total Fat (g)", "amount": 10.5},
      {"nutrient": "Saturated Fat (g)", "amount": 2.0},
      {"nutrient": "Cholesterol (mg)", "amount": 55},
      {"nutrient": "Protein (g)", "amount": 17},
      {"nutrient": "Vitamin D (μg)", "amount": 14.2},
      {"nutrient": "Vitamin B12 (μg)", "amount": 2.6},
      {"nutrient": "Selenium (μg)", "amount": 26},
      {"nutrient": "Potassium (mg)", "amount": 384}
    ]
  },
  {
    "description": "Roasted sweet potato (1 cup, cubed)",
    "servings": 1,
    "nutrients_per_serving": [
      {"nutrient": "Calories", "amount": 180},
      {"nutrient": "Total Carbohydrate (g)", "amount": 41},
      {"nutrient": "Dietary Fiber (g)", "amount": 6.6},
      {"nutrient": "Total Fat (g)", "amount": 0.2},
      {"nutrient": "Vitamin A (μg)", "amount": 19218},
      {"nutrient": "Vitamin C (mg)", "amount": 39.2},
      {"nutrient": "Magnesium (mg)", "amount": 31},
      {"nutrient": "Potassium (mg)", "amount": 448}
    ]
  },
  {
    "description": "Steamed spinach (1/2 cup cooked)",
    "servings": 1,
    "nutrients_per_serving": [
      {"nutrient": "Calories", "amount": 21},
      {"nutrient": "Total Carbohydrate (g)", "amount": 3.2},
      {"nutrient": "Dietary Fiber (g)", "amount": 2.2},
      {"nutrient": "Protein (g)", "amount": 2.7},
      {"nutrient": "Vitamin K (μg)", "amount": 444},
      {"nutrient": "Folate (μg)", "amount": 131},
      {"nutrient": "Iron (mg)", "amount": 1.9},
      {"nutrient": "Calcium (mg)", "amount": 123},
      {"nutrient": "Magnesium (mg)", "amount": 78}
    ]
  }
]
```

Clearly, the benefit of AI is that users do not have to specify the details of
their meal in a particular way. They do not have to add ingredients one-by-one,
nor do they have to ensure that their meal is included in a pre-existing
database.

## Technology Stack

This application uses the Next.js framework.

The frontend is styled with Tailwind and shadcn. The storage layer is managed
by Supabase, as is authentication. Database schemas may be found in the
`supabase/schema/` directory.

Mango uses the Gemini 2.0 Flash model via OpenRouter for its AI features.

## Frontend Notes

The frontend uses Next.js server actions to handle data mutations smoothly.

Loading pages must be implemented for important pages that require significant
client-side rendering.

## Database Notes

The application database uses a directory structure in the main "bites" table.
This is not truly *necessary*, but it is being used for experimentation. The
idea is that each user has their own directory `USER_ID`, and all meals are
stored under `USER_ID.meals`. Meals are then decomposed into "bites", and all
bites can be found under `USER_ID.meals.MEAL_ID`.

Most of the data for a meal or a bite is stored in a binarized JSON column named
`data`. The only information about a meal/bite entry which is not stored in the
`data` column is:
- the entry ID
- the user ID
- the creation timestamp
- the directory path

## TODO

There are still a number of features that need to be implemented in this
application. Some are listed below.

### High Priority: Frontend Customization

The application is still using the default shadcn theme. This application should
have a more colorful and playful UI.

We use this color palette as a base:
- Mango Orange (Primary color): #FB8500 (deep orange)
- Mango Yellow (Secondary color): #FFBE0B (bright yellow-orange)
- Light Background: #FFFFFF
- Dark Text: #333333

### High Priority: Stats Visualization

Users should be able to see their meal statistics over time (e.g., their
protein intake over the last week). Data aggregation should likely be done in
the backend.

Users should also be given grades based on their health goals. This should
likely be generated on the aggregated data.

### Low Priority: Retrieval Augmented Generation (RAG)

Users are allowed an enormous amount of flexibility in how they choose to
specify their meal, although this flexibilty comes at the expense of
*reliability*. For vague prompts, the AI will generate a highly variable guess
for a meal's nutritional value. The AI output will even differ for identical
prompts if the model's temperature is non-zero.

While this is not necessarily the main focus of the project, the AI responses
can be stabilized by feeding relevant information into the model's context
window. For example, we could store the embeddings of common food names (mapped
to their nutritional information) in a vector database and use this to feed
relevant context into the model. For example, a nearest-neighbors query for
"Teryaki chicken and steamed broccoli" might bring up the nutritional
information for "chicken" and "broccoli", which could subsequently be used by
the AI when estimating the meal's nutritional value.
