import { MealRecommendation } from "@/types";

export const mealRecommendations: MealRecommendation[] = [
  {
    id: "1",
    name: "Greek Yogurt Protein Bowl",
    calories: 450,
    protein: 35,
    carbs: 40,
    fat: 15,
    ingredients: [
      "1 cup Greek yogurt",
      "1 scoop protein powder",
      "1/2 cup berries",
      "1 tbsp honey",
      "1 tbsp chia seeds",
      "1/4 cup granola"
    ],
    instructions: [
      "Mix Greek yogurt with protein powder",
      "Top with berries, honey, chia seeds, and granola"
    ],
    prepTime: 5,
    cookTime: 0,
    dietaryRestrictions: ["gluten-free"],
    imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "2",
    name: "Chicken Quinoa Bowl",
    calories: 550,
    protein: 40,
    carbs: 45,
    fat: 20,
    ingredients: [
      "4 oz grilled chicken breast",
      "1/2 cup cooked quinoa",
      "1 cup mixed vegetables",
      "1 tbsp olive oil",
      "1 tbsp lemon juice",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Cook quinoa according to package instructions",
      "Grill chicken breast with salt and pepper",
      "Sauté vegetables in olive oil",
      "Combine all ingredients in a bowl",
      "Drizzle with lemon juice"
    ],
    prepTime: 10,
    cookTime: 20,
    dietaryRestrictions: ["gluten-free", "lactose-free"],
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "3",
    name: "Vegan Lentil Curry",
    calories: 400,
    protein: 20,
    carbs: 60,
    fat: 10,
    ingredients: [
      "1 cup cooked lentils",
      "1/2 cup coconut milk",
      "1 cup mixed vegetables",
      "1 tbsp curry powder",
      "1 tsp turmeric",
      "1 tsp cumin",
      "Salt to taste"
    ],
    instructions: [
      "Cook lentils until tender",
      "Sauté vegetables with spices",
      "Add coconut milk and simmer",
      "Combine with lentils and cook for 5 minutes"
    ],
    prepTime: 10,
    cookTime: 25,
    dietaryRestrictions: ["vegan", "gluten-free", "lactose-free"],
    imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "4",
    name: "Salmon with Roasted Vegetables",
    calories: 500,
    protein: 35,
    carbs: 25,
    fat: 30,
    ingredients: [
      "5 oz salmon fillet",
      "2 cups mixed vegetables",
      "1 tbsp olive oil",
      "1 tsp dried herbs",
      "Salt and pepper to taste",
      "Lemon wedges"
    ],
    instructions: [
      "Preheat oven to 400°F (200°C)",
      "Season salmon with salt, pepper, and herbs",
      "Toss vegetables in olive oil and seasonings",
      "Roast vegetables for 15 minutes",
      "Add salmon and roast for another 12-15 minutes"
    ],
    prepTime: 10,
    cookTime: 30,
    dietaryRestrictions: ["gluten-free", "lactose-free"],
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "5",
    name: "Tofu Stir-Fry",
    calories: 350,
    protein: 20,
    carbs: 30,
    fat: 15,
    ingredients: [
      "8 oz firm tofu",
      "2 cups mixed vegetables",
      "1 tbsp sesame oil",
      "2 tbsp soy sauce (or tamari for gluten-free)",
      "1 tsp ginger, minced",
      "1 clove garlic, minced"
    ],
    instructions: [
      "Press tofu to remove excess water",
      "Cut tofu into cubes",
      "Heat sesame oil in a wok or large pan",
      "Stir-fry tofu until golden",
      "Add vegetables, ginger, and garlic",
      "Add soy sauce and stir-fry until vegetables are tender"
    ],
    prepTime: 15,
    cookTime: 15,
    dietaryRestrictions: ["vegan", "lactose-free"],
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "6",
    name: "Protein Smoothie Bowl",
    calories: 400,
    protein: 30,
    carbs: 50,
    fat: 10,
    ingredients: [
      "1 scoop protein powder",
      "1 frozen banana",
      "1/2 cup frozen berries",
      "1 cup almond milk",
      "1 tbsp almond butter",
      "Toppings: granola, fresh fruit, nuts"
    ],
    instructions: [
      "Blend protein powder, banana, berries, almond milk, and almond butter",
      "Pour into a bowl",
      "Add toppings of your choice"
    ],
    prepTime: 5,
    cookTime: 0,
    dietaryRestrictions: ["vegan", "lactose-free"],
    imageUrl: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "7",
    name: "Gluten-Free Pasta with Turkey Meatballs",
    calories: 550,
    protein: 35,
    carbs: 60,
    fat: 20,
    ingredients: [
      "2 oz gluten-free pasta",
      "4 oz ground turkey",
      "1/4 cup gluten-free breadcrumbs",
      "1 egg",
      "1/2 cup marinara sauce",
      "1 tbsp grated Parmesan (optional)",
      "Fresh basil"
    ],
    instructions: [
      "Mix ground turkey, breadcrumbs, and egg",
      "Form into meatballs",
      "Bake meatballs at 375°F (190°C) for 20 minutes",
      "Cook pasta according to package instructions",
      "Heat marinara sauce",
      "Combine pasta, meatballs, and sauce",
      "Top with Parmesan and basil if desired"
    ],
    prepTime: 15,
    cookTime: 25,
    dietaryRestrictions: ["gluten-free"],
    imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "8",
    name: "Vegan Buddha Bowl",
    calories: 450,
    protein: 15,
    carbs: 70,
    fat: 15,
    ingredients: [
      "1/2 cup cooked brown rice",
      "1/2 cup roasted sweet potato",
      "1/2 cup chickpeas",
      "1 cup mixed greens",
      "1/4 avocado",
      "2 tbsp tahini dressing"
    ],
    instructions: [
      "Cook brown rice",
      "Roast sweet potato cubes",
      "Rinse and drain chickpeas",
      "Arrange all ingredients in a bowl",
      "Drizzle with tahini dressing"
    ],
    prepTime: 10,
    cookTime: 30,
    dietaryRestrictions: ["vegan", "gluten-free", "lactose-free"],
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  }
];