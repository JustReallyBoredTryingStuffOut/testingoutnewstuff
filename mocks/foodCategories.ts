import { FoodCategory } from "@/types";

// Food categories with default macro information
export const foodCategories: FoodCategory[] = [
  // Breakfast Categories
  {
    id: "breakfast-fruits",
    name: "Fruits",
    mealType: "breakfast",
    items: [
      {
        id: "apple",
        name: "Apple",
        calories: 95,
        protein: 0.5,
        carbs: 25,
        fat: 0.3,
        servingSize: "1 medium (182g)",
        imageUrl: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "banana",
        name: "Banana",
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fat: 0.4,
        servingSize: "1 medium (118g)",
        imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "berries-mix",
        name: "Mixed Berries",
        calories: 70,
        protein: 1,
        carbs: 17,
        fat: 0.5,
        servingSize: "1 cup (150g)",
        imageUrl: "https://images.unsplash.com/photo-1563746924237-f4471932a1a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "orange",
        name: "Orange",
        calories: 62,
        protein: 1.2,
        carbs: 15.4,
        fat: 0.2,
        servingSize: "1 medium (131g)",
        imageUrl: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "strawberries",
        name: "Strawberries",
        calories: 49,
        protein: 1,
        carbs: 11.7,
        fat: 0.5,
        servingSize: "1 cup (152g)",
        imageUrl: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "blueberries",
        name: "Blueberries",
        calories: 84,
        protein: 1.1,
        carbs: 21.4,
        fat: 0.5,
        servingSize: "1 cup (148g)",
        imageUrl: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "pineapple",
        name: "Pineapple",
        calories: 82,
        protein: 0.9,
        carbs: 21.6,
        fat: 0.2,
        servingSize: "1 cup chunks (165g)",
        imageUrl: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "mango",
        name: "Mango",
        calories: 99,
        protein: 1.4,
        carbs: 24.7,
        fat: 0.6,
        servingSize: "1 cup sliced (165g)",
        imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "grapes",
        name: "Grapes",
        calories: 104,
        protein: 1.1,
        carbs: 27.3,
        fat: 0.2,
        servingSize: "1 cup (151g)",
        imageUrl: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "kiwi",
        name: "Kiwi",
        calories: 42,
        protein: 0.8,
        carbs: 10,
        fat: 0.4,
        servingSize: "1 medium (69g)",
        imageUrl: "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "peach",
        name: "Peach",
        calories: 58,
        protein: 1.4,
        carbs: 14,
        fat: 0.4,
        servingSize: "1 medium (150g)",
        imageUrl: "https://images.unsplash.com/photo-1595743825637-cdafc8ad4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "watermelon",
        name: "Watermelon",
        calories: 46,
        protein: 0.9,
        carbs: 11.5,
        fat: 0.2,
        servingSize: "1 cup diced (152g)",
        imageUrl: "https://images.unsplash.com/photo-1563114773-84221bd62daa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "pear",
        name: "Pear",
        calories: 101,
        protein: 0.6,
        carbs: 27,
        fat: 0.2,
        servingSize: "1 medium (178g)",
        imageUrl: "https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "cherries",
        name: "Cherries",
        calories: 87,
        protein: 1.5,
        carbs: 22,
        fat: 0.3,
        servingSize: "1 cup (154g)",
        imageUrl: "https://images.unsplash.com/photo-1528821128474-25c5c5a1df5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "apricot",
        name: "Apricot",
        calories: 17,
        protein: 0.5,
        carbs: 3.9,
        fat: 0.1,
        servingSize: "1 fruit (35g)",
        imageUrl: "https://images.unsplash.com/photo-1560806175-c6f8d00c3a96?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "breakfast-eggs",
    name: "Eggs",
    mealType: "breakfast",
    items: [
      {
        id: "scrambled-eggs",
        name: "Scrambled Eggs",
        calories: 140,
        protein: 12,
        carbs: 1,
        fat: 10,
        servingSize: "2 eggs",
        imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "boiled-egg",
        name: "Boiled Egg",
        calories: 78,
        protein: 6.3,
        carbs: 0.6,
        fat: 5.3,
        servingSize: "1 large egg",
        imageUrl: "https://images.unsplash.com/photo-1607690424560-35d7c9b7118e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "egg-whites",
        name: "Egg Whites",
        calories: 52,
        protein: 11,
        carbs: 0.7,
        fat: 0.2,
        servingSize: "4 egg whites",
        imageUrl: "https://images.unsplash.com/photo-1608197492882-77eff6f3c6e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "omelette",
        name: "Vegetable Omelette",
        calories: 220,
        protein: 15,
        carbs: 5,
        fat: 16,
        servingSize: "3 eggs with vegetables",
        imageUrl: "https://images.unsplash.com/photo-1510693206972-df098062cb71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "egg-sandwich",
        name: "Egg Sandwich",
        calories: 350,
        protein: 16,
        carbs: 30,
        fat: 18,
        servingSize: "1 sandwich",
        imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "eggs-benedict",
        name: "Eggs Benedict",
        calories: 730,
        protein: 25,
        carbs: 47,
        fat: 50,
        servingSize: "1 serving (2 eggs)",
        imageUrl: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "frittata",
        name: "Vegetable Frittata",
        calories: 280,
        protein: 18,
        carbs: 8,
        fat: 20,
        servingSize: "1 slice (1/6 of 10-inch frittata)",
        imageUrl: "https://images.unsplash.com/photo-1623855244183-52fd8d3ce2f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "poached-eggs",
        name: "Poached Eggs",
        calories: 143,
        protein: 12.5,
        carbs: 0.7,
        fat: 9.5,
        servingSize: "2 eggs",
        imageUrl: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "egg-muffin",
        name: "Egg Muffin",
        calories: 120,
        protein: 9,
        carbs: 2,
        fat: 9,
        servingSize: "1 muffin",
        imageUrl: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "egg-burrito",
        name: "Egg Breakfast Burrito",
        calories: 420,
        protein: 20,
        carbs: 45,
        fat: 18,
        servingSize: "1 burrito",
        imageUrl: "https://images.unsplash.com/photo-1626711934535-9749ea933593?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "egg-hash",
        name: "Egg & Potato Hash",
        calories: 380,
        protein: 15,
        carbs: 40,
        fat: 18,
        servingSize: "1 serving (300g)",
        imageUrl: "https://images.unsplash.com/photo-1600336153113-d66c79de3e91?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "egg-avocado-toast",
        name: "Egg & Avocado Toast",
        calories: 320,
        protein: 14,
        carbs: 25,
        fat: 19,
        servingSize: "1 slice toast with 1 egg and 1/2 avocado",
        imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "egg-quesadilla",
        name: "Egg Quesadilla",
        calories: 380,
        protein: 18,
        carbs: 30,
        fat: 22,
        servingSize: "1 quesadilla",
        imageUrl: "https://images.unsplash.com/photo-1600336153113-d66c79de3e91?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "egg-breakfast-bowl",
        name: "Egg Breakfast Bowl",
        calories: 420,
        protein: 25,
        carbs: 35,
        fat: 20,
        servingSize: "1 bowl (350g)",
        imageUrl: "https://images.unsplash.com/photo-1529564879024-c54e7c2dd0e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "egg-breakfast-sandwich",
        name: "Egg Breakfast Sandwich",
        calories: 380,
        protein: 18,
        carbs: 35,
        fat: 18,
        servingSize: "1 sandwich",
        imageUrl: "https://images.unsplash.com/photo-1550507992-eb63ffee0847?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "egg-breakfast-pizza",
        name: "Breakfast Pizza with Egg",
        calories: 450,
        protein: 22,
        carbs: 40,
        fat: 24,
        servingSize: "1 small pizza (8-inch)",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "egg-breakfast-taco",
        name: "Egg Breakfast Taco",
        calories: 210,
        protein: 12,
        carbs: 18,
        fat: 11,
        servingSize: "1 taco",
        imageUrl: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "egg-breakfast-casserole",
        name: "Egg Breakfast Casserole",
        calories: 320,
        protein: 22,
        carbs: 15,
        fat: 20,
        servingSize: "1 serving (200g)",
        imageUrl: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "egg-breakfast-wrap",
        name: "Egg Breakfast Wrap",
        calories: 350,
        protein: 18,
        carbs: 30,
        fat: 18,
        servingSize: "1 wrap",
        imageUrl: "https://images.unsplash.com/photo-1626711934535-9749ea933593?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "egg-shakshuka",
        name: "Shakshuka",
        calories: 280,
        protein: 16,
        carbs: 18,
        fat: 16,
        servingSize: "1 serving (2 eggs)",
        imageUrl: "https://images.unsplash.com/photo-1590412200988-a436970781fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "breakfast-dairy",
    name: "Dairy & Yogurt",
    mealType: "breakfast",
    items: [
      {
        id: "greek-yogurt",
        name: "Greek Yogurt",
        calories: 100,
        protein: 17,
        carbs: 6,
        fat: 0.5,
        servingSize: "6 oz (170g)",
        imageUrl: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "cottage-cheese",
        name: "Cottage Cheese",
        calories: 120,
        protein: 14,
        carbs: 3,
        fat: 5,
        servingSize: "1/2 cup (113g)",
        imageUrl: "https://images.unsplash.com/photo-1559561853-08451507cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "milk",
        name: "Milk (2%)",
        calories: 122,
        protein: 8,
        carbs: 12,
        fat: 5,
        servingSize: "1 cup (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "yogurt-parfait",
        name: "Yogurt Parfait",
        calories: 210,
        protein: 10,
        carbs: 38,
        fat: 3,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "skyr-yogurt",
        name: "Skyr Yogurt",
        calories: 110,
        protein: 19,
        carbs: 7,
        fat: 0.4,
        servingSize: "6 oz (170g)",
        imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "almond-milk",
        name: "Almond Milk",
        calories: 39,
        protein: 1.5,
        carbs: 3.5,
        fat: 2.5,
        servingSize: "1 cup (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1600718374662-0483d2b9da44?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "oat-milk",
        name: "Oat Milk",
        calories: 120,
        protein: 3,
        carbs: 16,
        fat: 5,
        servingSize: "1 cup (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1576186726115-4d51596775d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "yogurt-plain",
        name: "Plain Yogurt",
        calories: 150,
        protein: 9,
        carbs: 17,
        fat: 8,
        servingSize: "1 cup (245g)",
        imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "yogurt-fruit",
        name: "Fruit Yogurt",
        calories: 180,
        protein: 7,
        carbs: 30,
        fat: 3.5,
        servingSize: "1 cup (245g)",
        imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "ricotta-cheese",
        name: "Ricotta Cheese",
        calories: 216,
        protein: 14,
        carbs: 4,
        fat: 16,
        servingSize: "1/2 cup (124g)",
        imageUrl: "https://images.unsplash.com/photo-1589881133595-a3c085cb731d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "cream-cheese",
        name: "Cream Cheese",
        calories: 100,
        protein: 2,
        carbs: 1,
        fat: 10,
        servingSize: "2 tbsp (30g)",
        imageUrl: "https://images.unsplash.com/photo-1589881133595-a3c085cb731d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "soy-milk",
        name: "Soy Milk",
        calories: 110,
        protein: 8,
        carbs: 9,
        fat: 4.5,
        servingSize: "1 cup (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "coconut-milk",
        name: "Coconut Milk",
        calories: 45,
        protein: 0,
        carbs: 2,
        fat: 4.5,
        servingSize: "1 cup (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "kefir",
        name: "Kefir",
        calories: 110,
        protein: 11,
        carbs: 12,
        fat: 2,
        servingSize: "1 cup (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "quark",
        name: "Quark",
        calories: 90,
        protein: 14,
        carbs: 4,
        fat: 0.5,
        servingSize: "1/2 cup (100g)",
        imageUrl: "https://images.unsplash.com/photo-1559561853-08451507cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "yogurt-coconut",
        name: "Coconut Yogurt",
        calories: 180,
        protein: 2,
        carbs: 13,
        fat: 14,
        servingSize: "6 oz (170g)",
        imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "yogurt-almond",
        name: "Almond Yogurt",
        calories: 150,
        protein: 5,
        carbs: 16,
        fat: 8,
        servingSize: "6 oz (170g)",
        imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "yogurt-cashew",
        name: "Cashew Yogurt",
        calories: 160,
        protein: 4,
        carbs: 14,
        fat: 10,
        servingSize: "6 oz (170g)",
        imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "yogurt-soy",
        name: "Soy Yogurt",
        calories: 140,
        protein: 6,
        carbs: 16,
        fat: 4,
        servingSize: "6 oz (170g)",
        imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "yogurt-oat",
        name: "Oat Yogurt",
        calories: 130,
        protein: 3,
        carbs: 19,
        fat: 5,
        servingSize: "6 oz (170g)",
        imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "breakfast-cereals",
    name: "Cereals & Oats",
    mealType: "breakfast",
    items: [
      {
        id: "oatmeal",
        name: "Oatmeal",
        calories: 150,
        protein: 5,
        carbs: 27,
        fat: 2.5,
        servingSize: "1 cup cooked (234g)",
        imageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "granola",
        name: "Granola",
        calories: 220,
        protein: 6,
        carbs: 30,
        fat: 10,
        servingSize: "1/2 cup (56g)",
        imageUrl: "https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "whole-grain-cereal",
        name: "Whole Grain Cereal",
        calories: 180,
        protein: 4,
        carbs: 40,
        fat: 1,
        servingSize: "1 cup (40g)",
        imageUrl: "https://images.unsplash.com/photo-1521483451569-e33803c0330c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "overnight-oats",
        name: "Overnight Oats",
        calories: 300,
        protein: 10,
        carbs: 50,
        fat: 7,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "muesli",
        name: "Muesli",
        calories: 289,
        protein: 8,
        carbs: 54,
        fat: 6,
        servingSize: "2/3 cup (65g)",
        imageUrl: "https://images.unsplash.com/photo-1456884590737-c4d142788909?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "bran-flakes",
        name: "Bran Flakes",
        calories: 130,
        protein: 4,
        carbs: 32,
        fat: 1,
        servingSize: "1 cup (40g)",
        imageUrl: "https://images.unsplash.com/photo-1557800636-894a64c1696f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "chia-pudding",
        name: "Chia Pudding",
        calories: 190,
        protein: 6,
        carbs: 18,
        fat: 12,
        servingSize: "1/2 cup (120g)",
        imageUrl: "https://images.unsplash.com/photo-1541621596592-7a1f4516cf19?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "corn-flakes",
        name: "Corn Flakes",
        calories: 100,
        protein: 2,
        carbs: 24,
        fat: 0,
        servingSize: "1 cup (28g)",
        imageUrl: "https://images.unsplash.com/photo-1557800636-894a64c1696f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "rice-krispies",
        name: "Rice Krispies",
        calories: 130,
        protein: 2,
        carbs: 29,
        fat: 0,
        servingSize: "1 1/4 cup (33g)",
        imageUrl: "https://images.unsplash.com/photo-1557800636-894a64c1696f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "shredded-wheat",
        name: "Shredded Wheat",
        calories: 170,
        protein: 5,
        carbs: 40,
        fat: 1,
        servingSize: "2 biscuits (46g)",
        imageUrl: "https://images.unsplash.com/photo-1557800636-894a64c1696f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "steel-cut-oats",
        name: "Steel Cut Oats",
        calories: 170,
        protein: 7,
        carbs: 29,
        fat: 3,
        servingSize: "1/4 cup dry (40g)",
        imageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "quinoa-porridge",
        name: "Quinoa Porridge",
        calories: 210,
        protein: 8,
        carbs: 39,
        fat: 3.5,
        servingSize: "1 cup cooked (185g)",
        imageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "buckwheat-porridge",
        name: "Buckwheat Porridge",
        calories: 155,
        protein: 5.7,
        carbs: 33,
        fat: 1,
        servingSize: "1 cup cooked (168g)",
        imageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "rice-porridge",
        name: "Rice Porridge",
        calories: 130,
        protein: 2.5,
        carbs: 28,
        fat: 0.5,
        servingSize: "1 cup cooked (200g)",
        imageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "barley-porridge",
        name: "Barley Porridge",
        calories: 170,
        protein: 3.5,
        carbs: 35,
        fat: 1,
        servingSize: "1 cup cooked (157g)",
        imageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "amaranth-porridge",
        name: "Amaranth Porridge",
        calories: 180,
        protein: 7,
        carbs: 31,
        fat: 3,
        servingSize: "1 cup cooked (246g)",
        imageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "teff-porridge",
        name: "Teff Porridge",
        calories: 255,
        protein: 9.5,
        carbs: 50,
        fat: 2,
        servingSize: "1 cup cooked (252g)",
        imageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "millet-porridge",
        name: "Millet Porridge",
        calories: 207,
        protein: 6,
        carbs: 41,
        fat: 2,
        servingSize: "1 cup cooked (240g)",
        imageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "farina-porridge",
        name: "Farina Porridge",
        calories: 120,
        protein: 3,
        carbs: 25,
        fat: 0.5,
        servingSize: "1 cup cooked (240g)",
        imageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "cream-of-wheat",
        name: "Cream of Wheat",
        calories: 126,
        protein: 3.5,
        carbs: 26,
        fat: 0.5,
        servingSize: "1 cup cooked (251g)",
        imageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "breakfast-breads",
    name: "Breads & Toast",
    mealType: "breakfast",
    items: [
      {
        id: "whole-wheat-toast",
        name: "Whole Wheat Toast",
        calories: 70,
        protein: 3,
        carbs: 13,
        fat: 1,
        servingSize: "1 slice",
        imageUrl: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "avocado-toast",
        name: "Avocado Toast",
        calories: 190,
        protein: 5,
        carbs: 15,
        fat: 12,
        servingSize: "1 slice with 1/4 avocado",
        imageUrl: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "bagel",
        name: "Bagel with Cream Cheese",
        calories: 320,
        protein: 11,
        carbs: 50,
        fat: 9,
        servingSize: "1 bagel with 2 tbsp cream cheese",
        imageUrl: "https://images.unsplash.com/photo-1592845345986-1e4b1e999b56?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "english-muffin",
        name: "English Muffin",
        calories: 130,
        protein: 5,
        carbs: 25,
        fat: 1,
        servingSize: "1 muffin",
        imageUrl: "https://images.unsplash.com/photo-1587131782738-de30ea91a542?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "croissant",
        name: "Croissant",
        calories: 270,
        protein: 5,
        carbs: 31,
        fat: 14,
        servingSize: "1 medium (57g)",
        imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "peanut-butter-toast",
        name: "Peanut Butter Toast",
        calories: 190,
        protein: 8,
        carbs: 17,
        fat: 11,
        servingSize: "1 slice with 1 tbsp peanut butter",
        imageUrl: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "banana-bread",
        name: "Banana Bread",
        calories: 196,
        protein: 3,
        carbs: 33,
        fat: 6,
        servingSize: "1 slice (60g)",
        imageUrl: "https://images.unsplash.com/photo-1605286978633-2dec93ff88a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "sourdough-toast",
        name: "Sourdough Toast",
        calories: 80,
        protein: 3,
        carbs: 15,
        fat: 0.5,
        servingSize: "1 slice",
        imageUrl: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "rye-toast",
        name: "Rye Toast",
        calories: 65,
        protein: 2.5,
        carbs: 12,
        fat: 0.8,
        servingSize: "1 slice",
        imageUrl: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "multigrain-toast",
        name: "Multigrain Toast",
        calories: 75,
        protein: 3.5,
        carbs: 13,
        fat: 1.2,
        servingSize: "1 slice",
        imageUrl: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "cinnamon-raisin-toast",
        name: "Cinnamon Raisin Toast",
        calories: 85,
        protein: 2.5,
        carbs: 16,
        fat: 1,
        servingSize: "1 slice",
        imageUrl: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "plain-bagel",
        name: "Plain Bagel",
        calories: 245,
        protein: 9,
        carbs: 48,
        fat: 1.5,
        servingSize: "1 bagel (105g)",
        imageUrl: "https://images.unsplash.com/photo-1592845345986-1e4b1e999b56?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "everything-bagel",
        name: "Everything Bagel",
        calories: 250,
        protein: 9,
        carbs: 48,
        fat: 2,
        servingSize: "1 bagel (105g)",
        imageUrl: "https://images.unsplash.com/photo-1592845345986-1e4b1e999b56?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "cinnamon-raisin-bagel",
        name: "Cinnamon Raisin Bagel",
        calories: 270,
        protein: 9,
        carbs: 53,
        fat: 2,
        servingSize: "1 bagel (105g)",
        imageUrl: "https://images.unsplash.com/photo-1592845345986-1e4b1e999b56?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "whole-wheat-bagel",
        name: "Whole Wheat Bagel",
        calories: 245,
        protein: 10,
        carbs: 47,
        fat: 1.5,
        servingSize: "1 bagel (105g)",
        imageUrl: "https://images.unsplash.com/photo-1592845345986-1e4b1e999b56?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "blueberry-muffin",
        name: "Blueberry Muffin",
        calories: 340,
        protein: 5,
        carbs: 55,
        fat: 12,
        servingSize: "1 muffin (113g)",
        imageUrl: "https://images.unsplash.com/photo-1587131782738-de30ea91a542?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "bran-muffin",
        name: "Bran Muffin",
        calories: 320,
        protein: 6,
        carbs: 52,
        fat: 10,
        servingSize: "1 muffin (113g)",
        imageUrl: "https://images.unsplash.com/photo-1587131782738-de30ea91a542?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "corn-muffin",
        name: "Corn Muffin",
        calories: 350,
        protein: 6,
        carbs: 53,
        fat: 13,
        servingSize: "1 muffin (113g)",
        imageUrl: "https://images.unsplash.com/photo-1587131782738-de30ea91a542?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "chocolate-chip-muffin",
        name: "Chocolate Chip Muffin",
        calories: 380,
        protein: 5,
        carbs: 58,
        fat: 15,
        servingSize: "1 muffin (113g)",
        imageUrl: "https://images.unsplash.com/photo-1587131782738-de30ea91a542?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "pain-au-chocolat",
        name: "Pain au Chocolat",
        calories: 300,
        protein: 6,
        carbs: 34,
        fat: 16,
        servingSize: "1 pastry (70g)",
        imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "breakfast-smoothies",
    name: "Smoothies & Drinks",
    mealType: "breakfast",
    items: [
      {
        id: "berry-smoothie",
        name: "Berry Smoothie",
        calories: 210,
        protein: 5,
        carbs: 42,
        fat: 3,
        servingSize: "1 cup (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1553530666-ba11a90bb0ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "green-smoothie",
        name: "Green Smoothie",
        calories: 180,
        protein: 4,
        carbs: 36,
        fat: 2,
        servingSize: "1 cup (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1556881286-fc6915169721?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "protein-smoothie",
        name: "Protein Smoothie",
        calories: 280,
        protein: 25,
        carbs: 30,
        fat: 5,
        servingSize: "1 cup (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "coffee",
        name: "Coffee (Black)",
        calories: 5,
        protein: 0.3,
        carbs: 0,
        fat: 0,
        servingSize: "1 cup (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "latte",
        name: "Latte",
        calories: 120,
        protein: 8,
        carbs: 10,
        fat: 5,
        servingSize: "12 oz (355ml)",
        imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "orange-juice",
        name: "Orange Juice",
        calories: 110,
        protein: 2,
        carbs: 26,
        fat: 0,
        servingSize: "1 cup (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "banana-smoothie",
        name: "Banana Smoothie",
        calories: 230,
        protein: 8,
        carbs: 45,
        fat: 3,
        servingSize: "1 cup (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1553530666-ba11a90bb0ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "mango-smoothie",
        name: "Mango Smoothie",
        calories: 220,
        protein: 4,
        carbs: 50,
        fat: 1,
        servingSize: "1 cup (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1553530666-ba11a90bb0ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "cappuccino",
        name: "Cappuccino",
        calories: 80,
        protein: 5,
        carbs: 8,
        fat: 3,
        servingSize: "8 oz (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "americano",
        name: "Americano",
        calories: 15,
        protein: 0.5,
        carbs: 2,
        fat: 0,
        servingSize: "12 oz (355ml)",
        imageUrl: "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },

  // Lunch Categories
  {
    id: "lunch-sandwiches",
    name: "Sandwiches & Wraps",
    mealType: "lunch",
    items: [
      {
        id: "turkey-sandwich",
        name: "Turkey Sandwich",
        calories: 320,
        protein: 20,
        carbs: 40,
        fat: 9,
        servingSize: "1 sandwich",
        imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "chicken-wrap",
        name: "Chicken Wrap",
        calories: 350,
        protein: 25,
        carbs: 35,
        fat: 12,
        servingSize: "1 wrap",
        imageUrl: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "veggie-sandwich",
        name: "Veggie Sandwich",
        calories: 280,
        protein: 10,
        carbs: 45,
        fat: 8,
        servingSize: "1 sandwich",
        imageUrl: "https://images.unsplash.com/photo-1554433607-66b5efe9d304?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "tuna-sandwich",
        name: "Tuna Sandwich",
        calories: 290,
        protein: 22,
        carbs: 30,
        fat: 10,
        servingSize: "1 sandwich",
        imageUrl: "https://images.unsplash.com/photo-1550507992-eb63ffee0847?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "blt-sandwich",
        name: "BLT Sandwich",
        calories: 350,
        protein: 15,
        carbs: 35,
        fat: 18,
        servingSize: "1 sandwich",
        imageUrl: "https://images.unsplash.com/photo-1619096252214-ef06c45683e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "falafel-wrap",
        name: "Falafel Wrap",
        calories: 380,
        protein: 12,
        carbs: 55,
        fat: 14,
        servingSize: "1 wrap",
        imageUrl: "https://images.unsplash.com/photo-1561651823-34feb02250e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "club-sandwich",
        name: "Club Sandwich",
        calories: 430,
        protein: 28,
        carbs: 38,
        fat: 20,
        servingSize: "1 sandwich",
        imageUrl: "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "ham-cheese-sandwich",
        name: "Ham & Cheese Sandwich",
        calories: 350,
        protein: 20,
        carbs: 35,
        fat: 15,
        servingSize: "1 sandwich",
        imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "egg-salad-sandwich",
        name: "Egg Salad Sandwich",
        calories: 380,
        protein: 14,
        carbs: 35,
        fat: 20,
        servingSize: "1 sandwich",
        imageUrl: "https://images.unsplash.com/photo-1550507992-eb63ffee0847?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "chicken-salad-sandwich",
        name: "Chicken Salad Sandwich",
        calories: 400,
        protein: 22,
        carbs: 35,
        fat: 18,
        servingSize: "1 sandwich",
        imageUrl: "https://images.unsplash.com/photo-1550507992-eb63ffee0847?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "roast-beef-sandwich",
        name: "Roast Beef Sandwich",
        calories: 370,
        protein: 24,
        carbs: 35,
        fat: 14,
        servingSize: "1 sandwich",
        imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "grilled-cheese",
        name: "Grilled Cheese Sandwich",
        calories: 350,
        protein: 12,
        carbs: 30,
        fat: 20,
        servingSize: "1 sandwich",
        imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "pb-j-sandwich",
        name: "PB&J Sandwich",
        calories: 340,
        protein: 12,
        carbs: 50,
        fat: 12,
        servingSize: "1 sandwich",
        imageUrl: "https://images.unsplash.com/photo-1550507992-eb63ffee0847?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "hummus-wrap",
        name: "Hummus & Veggie Wrap",
        calories: 320,
        protein: 10,
        carbs: 50,
        fat: 10,
        servingSize: "1 wrap",
        imageUrl: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "buffalo-chicken-wrap",
        name: "Buffalo Chicken Wrap",
        calories: 380,
        protein: 25,
        carbs: 35,
        fat: 16,
        servingSize: "1 wrap",
        imageUrl: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "caesar-wrap",
        name: "Chicken Caesar Wrap",
        calories: 360,
        protein: 22,
        carbs: 35,
        fat: 15,
        servingSize: "1 wrap",
        imageUrl: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "mediterranean-wrap",
        name: "Mediterranean Wrap",
        calories: 340,
        protein: 12,
        carbs: 45,
        fat: 12,
        servingSize: "1 wrap",
        imageUrl: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "steak-sandwich",
        name: "Steak Sandwich",
        calories: 450,
        protein: 30,
        carbs: 35,
        fat: 22,
        servingSize: "1 sandwich",
        imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "caprese-sandwich",
        name: "Caprese Sandwich",
        calories: 320,
        protein: 14,
        carbs: 35,
        fat: 15,
        servingSize: "1 sandwich",
        imageUrl: "https://images.unsplash.com/photo-1550507992-eb63ffee0847?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "cuban-sandwich",
        name: "Cuban Sandwich",
        calories: 430,
        protein: 25,
        carbs: 40,
        fat: 20,
        servingSize: "1 sandwich",
        imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "lunch-salads",
    name: "Salads",
    mealType: "lunch",
    items: [
      {
        id: "chicken-salad",
        name: "Grilled Chicken Salad",
        calories: 320,
        protein: 30,
        carbs: 10,
        fat: 18,
        servingSize: "1 bowl (300g)",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "caesar-salad",
        name: "Caesar Salad",
        calories: 290,
        protein: 15,
        carbs: 12,
        fat: 20,
        servingSize: "1 bowl (250g)",
        imageUrl: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "greek-salad",
        name: "Greek Salad",
        calories: 230,
        protein: 8,
        carbs: 15,
        fat: 16,
        servingSize: "1 bowl (250g)",
        imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "cobb-salad",
        name: "Cobb Salad",
        calories: 400,
        protein: 25,
        carbs: 12,
        fat: 28,
        servingSize: "1 bowl (300g)",
        imageUrl: "https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "quinoa-salad",
        name: "Quinoa Salad",
        calories: 280,
        protein: 10,
        carbs: 40,
        fat: 10,
        servingSize: "1 bowl (250g)",
        imageUrl: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "tuna-salad",
        name: "Tuna Salad",
        calories: 310,
        protein: 28,
        carbs: 8,
        fat: 19,
        servingSize: "1 bowl (250g)",
        imageUrl: "https://images.unsplash.com/photo-1604909052743-94e838986d24?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "caprese-salad",
        name: "Caprese Salad",
        calories: 260,
        protein: 12,
        carbs: 8,
        fat: 20,
        servingSize: "1 bowl (200g)",
        imageUrl: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "waldorf-salad",
        name: "Waldorf Salad",
        calories: 310,
        protein: 6,
        carbs: 25,
        fat: 22,
        servingSize: "1 bowl (250g)",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "nicoise-salad",
        name: "Niçoise Salad",
        calories: 330,
        protein: 22,
        carbs: 20,
        fat: 18,
        servingSize: "1 bowl (300g)",
        imageUrl: "https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "asian-chicken-salad",
        name: "Asian Chicken Salad",
        calories: 340,
        protein: 25,
        carbs: 25,
        fat: 15,
        servingSize: "1 bowl (300g)",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "southwest-salad",
        name: "Southwest Salad",
        calories: 380,
        protein: 22,
        carbs: 30,
        fat: 18,
        servingSize: "1 bowl (300g)",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "mediterranean-salad",
        name: "Mediterranean Salad",
        calories: 290,
        protein: 10,
        carbs: 25,
        fat: 18,
        servingSize: "1 bowl (250g)",
        imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "spinach-salad",
        name: "Spinach Salad",
        calories: 220,
        protein: 8,
        carbs: 15,
        fat: 15,
        servingSize: "1 bowl (200g)",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "kale-salad",
        name: "Kale Salad",
        calories: 240,
        protein: 9,
        carbs: 20,
        fat: 14,
        servingSize: "1 bowl (200g)",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "arugula-salad",
        name: "Arugula Salad",
        calories: 210,
        protein: 6,
        carbs: 12,
        fat: 16,
        servingSize: "1 bowl (200g)",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "pasta-salad",
        name: "Pasta Salad",
        calories: 350,
        protein: 10,
        carbs: 45,
        fat: 14,
        servingSize: "1 bowl (250g)",
        imageUrl: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "potato-salad",
        name: "Potato Salad",
        calories: 320,
        protein: 6,
        carbs: 40,
        fat: 16,
        servingSize: "1 bowl (250g)",
        imageUrl: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "coleslaw",
        name: "Coleslaw",
        calories: 170,
        protein: 2,
        carbs: 15,
        fat: 12,
        servingSize: "1 cup (120g)",
        imageUrl: "https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "bean-salad",
        name: "Bean Salad",
        calories: 260,
        protein: 12,
        carbs: 40,
        fat: 6,
        servingSize: "1 bowl (250g)",
        imageUrl: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "shrimp-salad",
        name: "Shrimp Salad",
        calories: 280,
        protein: 24,
        carbs: 15,
        fat: 14,
        servingSize: "1 bowl (250g)",
        imageUrl: "https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "lunch-soups",
    name: "Soups",
    mealType: "lunch",
    items: [
      {
        id: "chicken-noodle-soup",
        name: "Chicken Noodle Soup",
        calories: 180,
        protein: 12,
        carbs: 20,
        fat: 6,
        servingSize: "1 bowl (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "tomato-soup",
        name: "Tomato Soup",
        calories: 160,
        protein: 4,
        carbs: 25,
        fat: 6,
        servingSize: "1 bowl (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "lentil-soup",
        name: "Lentil Soup",
        calories: 210,
        protein: 14,
        carbs: 30,
        fat: 5,
        servingSize: "1 bowl (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1616501268209-edfff098fdd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "minestrone-soup",
        name: "Minestrone Soup",
        calories: 190,
        protein: 8,
        carbs: 28,
        fat: 6,
        servingSize: "1 bowl (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1605909388460-74ec8b204127?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "butternut-squash-soup",
        name: "Butternut Squash Soup",
        calories: 170,
        protein: 3,
        carbs: 30,
        fat: 5,
        servingSize: "1 bowl (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "miso-soup",
        name: "Miso Soup",
        calories: 80,
        protein: 6,
        carbs: 8,
        fat: 3,
        servingSize: "1 bowl (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1578020190125-f4f7c18bc9cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "french-onion-soup",
        name: "French Onion Soup",
        calories: 220,
        protein: 9,
        carbs: 22,
        fat: 11,
        servingSize: "1 bowl (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1583112291495-1595e4f0f879?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "vegetable-soup",
        name: "Vegetable Soup",
        calories: 140,
        protein: 5,
        carbs: 25,
        fat: 3,
        servingSize: "1 bowl (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1605909388460-74ec8b204127?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "beef-stew",
        name: "Beef Stew",
        calories: 280,
        protein: 22,
        carbs: 20,
        fat: 12,
        servingSize: "1 bowl (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "split-pea-soup",
        name: "Split Pea Soup",
        calories: 190,
        protein: 12,
        carbs: 30,
        fat: 3,
        servingSize: "1 bowl (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1616501268209-edfff098fdd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "clam-chowder",
        name: "Clam Chowder",
        calories: 230,
        protein: 14,
        carbs: 18,
        fat: 12,
        servingSize: "1 bowl (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1583112291495-1595e4f0f879?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "mushroom-soup",
        name: "Mushroom Soup",
        calories: 180,
        protein: 6,
        carbs: 15,
        fat: 10,
        servingSize: "1 bowl (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "gazpacho",
        name: "Gazpacho",
        calories: 120,
        protein: 3,
        carbs: 20,
        fat: 4,
        servingSize: "1 bowl (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "potato-leek-soup",
        name: "Potato Leek Soup",
        calories: 200,
        protein: 5,
        carbs: 30,
        fat: 8,
        servingSize: "1 bowl (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "broccoli-cheddar-soup",
        name: "Broccoli Cheddar Soup",
        calories: 240,
        protein: 10,
        carbs: 15,
        fat: 16,
        servingSize: "1 bowl (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "tortilla-soup",
        name: "Tortilla Soup",
        calories: 210,
        protein: 12,
        carbs: 25,
        fat: 8,
        servingSize: "1 bowl (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "thai-coconut-soup",
        name: "Thai Coconut Soup",
        calories: 250,
        protein: 15,
        carbs: 12,
        fat: 18,
        servingSize: "1 bowl (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1578020190125-f4f7c18bc9cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "black-bean-soup",
        name: "Black Bean Soup",
        calories: 220,
        protein: 14,
        carbs: 35,
        fat: 4,
        servingSize: "1 bowl (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1616501268209-edfff098fdd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "chicken-tortilla-soup",
        name: "Chicken Tortilla Soup",
        calories: 230,
        protein: 18,
        carbs: 20,
        fat: 10,
        servingSize: "1 bowl (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "corn-chowder",
        name: "Corn Chowder",
        calories: 210,
        protein: 8,
        carbs: 30,
        fat: 8,
        servingSize: "1 bowl (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1583112291495-1595e4f0f879?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "lunch-bowls",
    name: "Grain Bowls",
    mealType: "lunch",
    items: [
      {
        id: "quinoa-bowl",
        name: "Quinoa Bowl",
        calories: 380,
        protein: 15,
        carbs: 50,
        fat: 14,
        servingSize: "1 bowl (350g)",
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "rice-bowl",
        name: "Brown Rice Bowl",
        calories: 420,
        protein: 18,
        carbs: 65,
        fat: 10,
        servingSize: "1 bowl (400g)",
        imageUrl: "https://images.unsplash.com/photo-1543340713-1bf56d3d1b68?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "buddha-bowl",
        name: "Buddha Bowl",
        calories: 450,
        protein: 20,
        carbs: 55,
        fat: 16,
        servingSize: "1 bowl (400g)",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "poke-bowl",
        name: "Poke Bowl",
        calories: 400,
        protein: 30,
        carbs: 40,
        fat: 12,
        servingSize: "1 bowl (350g)",
        imageUrl: "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "burrito-bowl",
        name: "Burrito Bowl",
        calories: 550,
        protein: 25,
        carbs: 70,
        fat: 18,
        servingSize: "1 bowl (450g)",
        imageUrl: "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "farro-bowl",
        name: "Farro Bowl",
        calories: 390,
        protein: 14,
        carbs: 60,
        fat: 10,
        servingSize: "1 bowl (350g)",
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "mediterranean-bowl",
        name: "Mediterranean Bowl",
        calories: 420,
        protein: 18,
        carbs: 50,
        fat: 16,
        servingSize: "1 bowl (400g)",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "teriyaki-bowl",
        name: "Teriyaki Bowl",
        calories: 480,
        protein: 25,
        carbs: 65,
        fat: 12,
        servingSize: "1 bowl (400g)",
        imageUrl: "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "bibimbap",
        name: "Bibimbap",
        calories: 460,
        protein: 22,
        carbs: 60,
        fat: 14,
        servingSize: "1 bowl (400g)",
        imageUrl: "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "taco-bowl",
        name: "Taco Bowl",
        calories: 520,
        protein: 25,
        carbs: 60,
        fat: 20,
        servingSize: "1 bowl (450g)",
        imageUrl: "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "power-bowl",
        name: "Power Bowl",
        calories: 450,
        protein: 30,
        carbs: 45,
        fat: 15,
        servingSize: "1 bowl (400g)",
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "veggie-bowl",
        name: "Veggie Bowl",
        calories: 380,
        protein: 12,
        carbs: 55,
        fat: 12,
        servingSize: "1 bowl (350g)",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "tofu-bowl",
        name: "Tofu Bowl",
        calories: 400,
        protein: 20,
        carbs: 50,
        fat: 14,
        servingSize: "1 bowl (350g)",
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "chicken-bowl",
        name: "Chicken Bowl",
        calories: 450,
        protein: 35,
        carbs: 45,
        fat: 12,
        servingSize: "1 bowl (400g)",
        imageUrl: "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "salmon-bowl",
        name: "Salmon Bowl",
        calories: 480,
        protein: 30,
        carbs: 45,
        fat: 18,
        servingSize: "1 bowl (400g)",
        imageUrl: "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "steak-bowl",
        name: "Steak Bowl",
        calories: 520,
        protein: 35,
        carbs: 45,
        fat: 20,
        servingSize: "1 bowl (400g)",
        imageUrl: "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "shrimp-bowl",
        name: "Shrimp Bowl",
        calories: 420,
        protein: 28,
        carbs: 50,
        fat: 10,
        servingSize: "1 bowl (400g)",
        imageUrl: "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "sweet-potato-bowl",
        name: "Sweet Potato Bowl",
        calories: 410,
        protein: 12,
        carbs: 65,
        fat: 12,
        servingSize: "1 bowl (400g)",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "grain-salad-bowl",
        name: "Grain Salad Bowl",
        calories: 380,
        protein: 14,
        carbs: 55,
        fat: 12,
        servingSize: "1 bowl (350g)",
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "curry-bowl",
        name: "Curry Bowl",
        calories: 450,
        protein: 18,
        carbs: 60,
        fat: 15,
        servingSize: "1 bowl (400g)",
        imageUrl: "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "lunch-pasta",
    name: "Pasta & Noodles",
    mealType: "lunch",
    items: [
      {
        id: "pasta-primavera",
        name: "Pasta Primavera",
        calories: 380,
        protein: 12,
        carbs: 60,
        fat: 10,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "spaghetti-marinara",
        name: "Spaghetti Marinara",
        calories: 350,
        protein: 10,
        carbs: 65,
        fat: 6,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "mac-and-cheese",
        name: "Mac and Cheese",
        calories: 420,
        protein: 16,
        carbs: 50,
        fat: 18,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "pad-thai",
        name: "Pad Thai",
        calories: 450,
        protein: 18,
        carbs: 55,
        fat: 16,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "pesto-pasta",
        name: "Pesto Pasta",
        calories: 410,
        protein: 12,
        carbs: 55,
        fat: 16,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "ramen",
        name: "Ramen",
        calories: 380,
        protein: 15,
        carbs: 60,
        fat: 8,
        servingSize: "1 bowl (350g)",
        imageUrl: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "fettuccine-alfredo",
        name: "Fettuccine Alfredo",
        calories: 450,
        protein: 15,
        carbs: 50,
        fat: 22,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "spaghetti-bolognese",
        name: "Spaghetti Bolognese",
        calories: 420,
        protein: 22,
        carbs: 55,
        fat: 12,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "lasagna",
        name: "Lasagna",
        calories: 450,
        protein: 25,
        carbs: 45,
        fat: 20,
        servingSize: "1 piece (250g)",
        imageUrl: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "lo-mein",
        name: "Lo Mein",
        calories: 400,
        protein: 15,
        carbs: 60,
        fat: 10,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "udon",
        name: "Udon Noodles",
        calories: 380,
        protein: 12,
        carbs: 70,
        fat: 3,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "soba-noodles",
        name: "Soba Noodles",
        calories: 350,
        protein: 14,
        carbs: 65,
        fat: 2,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "penne-arrabbiata",
        name: "Penne Arrabbiata",
        calories: 380,
        protein: 12,
        carbs: 65,
        fat: 8,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "carbonara",
        name: "Carbonara",
        calories: 470,
        protein: 20,
        carbs: 50,
        fat: 22,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "gnocchi",
        name: "Gnocchi",
        calories: 360,
        protein: 8,
        carbs: 70,
        fat: 5,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "ravioli",
        name: "Ravioli",
        calories: 380,
        protein: 15,
        carbs: 55,
        fat: 10,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "tortellini",
        name: "Tortellini",
        calories: 390,
        protein: 16,
        carbs: 50,
        fat: 12,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "orzo",
        name: "Orzo Pasta",
        calories: 350,
        protein: 12,
        carbs: 65,
        fat: 4,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "macaroni",
        name: "Macaroni",
        calories: 340,
        protein: 10,
        carbs: 68,
        fat: 2,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "ziti",
        name: "Baked Ziti",
        calories: 420,
        protein: 18,
        carbs: 55,
        fat: 15,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },

  // Dinner Categories
  {
    id: "dinner-proteins",
    name: "Proteins",
    mealType: "dinner",
    items: [
      {
        id: "grilled-chicken",
        name: "Grilled Chicken Breast",
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        servingSize: "1 breast (100g)",
        imageUrl: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "salmon",
        name: "Baked Salmon",
        calories: 206,
        protein: 22,
        carbs: 0,
        fat: 13,
        servingSize: "1 fillet (100g)",
        imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "steak",
        name: "Sirloin Steak",
        calories: 250,
        protein: 26,
        carbs: 0,
        fat: 16,
        servingSize: "1 steak (100g)",
        imageUrl: "https://images.unsplash.com/photo-1529694157872-4e0c0f3b238b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "tofu",
        name: "Tofu",
        calories: 144,
        protein: 16,
        carbs: 3,
        fat: 8,
        servingSize: "1 block (100g)",
        imageUrl: "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "pork-chop",
        name: "Pork Chop",
        calories: 230,
        protein: 25,
        carbs: 0,
        fat: 14,
        servingSize: "1 chop (100g)",
        imageUrl: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "shrimp",
        name: "Grilled Shrimp",
        calories: 120,
        protein: 24,
        carbs: 1,
        fat: 2,
        servingSize: "100g",
        imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "lamb-chops",
        name: "Lamb Chops",
        calories: 290,
        protein: 24,
        carbs: 0,
        fat: 21,
        servingSize: "2 chops (100g)",
        imageUrl: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "turkey-breast",
        name: "Roasted Turkey Breast",
        calories: 170,
        protein: 30,
        carbs: 0,
        fat: 5,
        servingSize: "100g",
        imageUrl: "https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "beef-tenderloin",
        name: "Beef Tenderloin",
        calories: 270,
        protein: 28,
        carbs: 0,
        fat: 18,
        servingSize: "100g",
        imageUrl: "https://images.unsplash.com/photo-1529694157872-4e0c0f3b238b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "tilapia",
        name: "Baked Tilapia",
        calories: 130,
        protein: 26,
        carbs: 0,
        fat: 3,
        servingSize: "1 fillet (100g)",
        imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "cod",
        name: "Baked Cod",
        calories: 105,
        protein: 23,
        carbs: 0,
        fat: 1,
        servingSize: "1 fillet (100g)",
        imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "halibut",
        name: "Grilled Halibut",
        calories: 140,
        protein: 27,
        carbs: 0,
        fat: 3,
        servingSize: "1 fillet (100g)",
        imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "chicken-thighs",
        name: "Chicken Thighs",
        calories: 210,
        protein: 26,
        carbs: 0,
        fat: 12,
        servingSize: "100g",
        imageUrl: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "tempeh",
        name: "Tempeh",
        calories: 195,
        protein: 20,
        carbs: 9,
        fat: 11,
        servingSize: "100g",
        imageUrl: "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "seitan",
        name: "Seitan",
        calories: 370,
        protein: 75,
        carbs: 14,
        fat: 2,
        servingSize: "100g",
        imageUrl: "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "duck-breast",
        name: "Duck Breast",
        calories: 250,
        protein: 19,
        carbs: 0,
        fat: 19,
        servingSize: "100g",
        imageUrl: "https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "venison",
        name: "Venison",
        calories: 175,
        protein: 34,
        carbs: 0,
        fat: 3.5,
        servingSize: "100g",
        imageUrl: "https://images.unsplash.com/photo-1529694157872-4e0c0f3b238b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "bison",
        name: "Bison",
        calories: 180,
        protein: 30,
        carbs: 0,
        fat: 6,
        servingSize: "100g",
        imageUrl: "https://images.unsplash.com/photo-1529694157872-4e0c0f3b238b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "scallops",
        name: "Seared Scallops",
        calories: 140,
        protein: 27,
        carbs: 3,
        fat: 2,
        servingSize: "100g",
        imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "lobster",
        name: "Lobster",
        calories: 130,
        protein: 28,
        carbs: 1,
        fat: 1.5,
        servingSize: "100g",
        imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "dinner-sides",
    name: "Side Dishes",
    mealType: "dinner",
    items: [
      {
        id: "roasted-vegetables",
        name: "Roasted Vegetables",
        calories: 120,
        protein: 3,
        carbs: 20,
        fat: 4,
        servingSize: "1 cup (150g)",
        imageUrl: "https://images.unsplash.com/photo-1546548970-71785318a17b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "mashed-potatoes",
        name: "Mashed Potatoes",
        calories: 210,
        protein: 4,
        carbs: 35,
        fat: 7,
        servingSize: "1 cup (210g)",
        imageUrl: "https://images.unsplash.com/photo-1518798108586-1d8f8bd5e223?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "brown-rice",
        name: "Brown Rice",
        calories: 216,
        protein: 5,
        carbs: 45,
        fat: 1.8,
        servingSize: "1 cup cooked (195g)",
        imageUrl: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "quinoa",
        name: "Quinoa",
        calories: 222,
        protein: 8,
        carbs: 39,
        fat: 3.6,
        servingSize: "1 cup cooked (185g)",
        imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "sweet-potato",
        name: "Baked Sweet Potato",
        calories: 180,
        protein: 4,
        carbs: 41,
        fat: 0.1,
        servingSize: "1 medium (150g)",
        imageUrl: "https://images.unsplash.com/photo-1596434300655-e48d3ff3dd5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "steamed-broccoli",
        name: "Steamed Broccoli",
        calories: 55,
        protein: 4,
        carbs: 11,
        fat: 0.5,
        servingSize: "1 cup (156g)",
        imageUrl: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "garlic-bread",
        name: "Garlic Bread",
        calories: 180,
        protein: 4,
        carbs: 25,
        fat: 8,
        servingSize: "2 slices (50g)",
        imageUrl: "https://images.unsplash.com/photo-1573140401552-3fab0b24427f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "couscous",
        name: "Couscous",
        calories: 176,
        protein: 6,
        carbs: 36,
        fat: 0.3,
        servingSize: "1 cup cooked (157g)",
        imageUrl: "https://images.unsplash.com/photo-1515942400420-2b98fed1f515?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "wild-rice",
        name: "Wild Rice",
        calories: 166,
        protein: 6.5,
        carbs: 35,
        fat: 0.6,
        servingSize: "1 cup cooked (164g)",
        imageUrl: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "roasted-potatoes",
        name: "Roasted Potatoes",
        calories: 190,
        protein: 4,
        carbs: 35,
        fat: 5,
        servingSize: "1 cup (150g)",
        imageUrl: "https://images.unsplash.com/photo-1518798108586-1d8f8bd5e223?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "grilled-asparagus",
        name: "Grilled Asparagus",
        calories: 40,
        protein: 4,
        carbs: 7,
        fat: 0.4,
        servingSize: "1 cup (134g)",
        imageUrl: "https://images.unsplash.com/photo-1546548970-71785318a17b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "sauteed-spinach",
        name: "Sautéed Spinach",
        calories: 65,
        protein: 3,
        carbs: 5,
        fat: 4,
        servingSize: "1 cup (180g)",
        imageUrl: "https://images.unsplash.com/photo-1546548970-71785318a17b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "roasted-brussels-sprouts",
        name: "Roasted Brussels Sprouts",
        calories: 80,
        protein: 4,
        carbs: 10,
        fat: 4,
        servingSize: "1 cup (156g)",
        imageUrl: "https://images.unsplash.com/photo-1546548970-71785318a17b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "cauliflower-rice",
        name: "Cauliflower Rice",
        calories: 40,
        protein: 3,
        carbs: 8,
        fat: 0.5,
        servingSize: "1 cup (107g)",
        imageUrl: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "grilled-corn",
        name: "Grilled Corn on the Cob",
        calories: 155,
        protein: 5,
        carbs: 32,
        fat: 2,
        servingSize: "1 ear (90g)",
        imageUrl: "https://images.unsplash.com/photo-1546548970-71785318a17b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "dinner-roll",
        name: "Dinner Roll",
        calories: 120,
        protein: 3,
        carbs: 20,
        fat: 3,
        servingSize: "1 roll (35g)",
        imageUrl: "https://images.unsplash.com/photo-1573140401552-3fab0b24427f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "cornbread",
        name: "Cornbread",
        calories: 190,
        protein: 4,
        carbs: 30,
        fat: 6,
        servingSize: "1 piece (60g)",
        imageUrl: "https://images.unsplash.com/photo-1573140401552-3fab0b24427f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "polenta",
        name: "Polenta",
        calories: 150,
        protein: 3,
        carbs: 30,
        fat: 2,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1515942400420-2b98fed1f515?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "risotto",
        name: "Risotto",
        calories: 240,
        protein: 5,
        carbs: 45,
        fat: 5,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1515942400420-2b98fed1f515?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "grilled-vegetables",
        name: "Grilled Vegetables",
        calories: 110,
        protein: 3,
        carbs: 18,
        fat: 4,
        servingSize: "1 cup (150g)",
        imageUrl: "https://images.unsplash.com/photo-1546548970-71785318a17b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "dinner-pasta",
    name: "Pasta & Noodles",
    mealType: "dinner",
    items: [
      {
        id: "spaghetti-bolognese",
        name: "Spaghetti Bolognese",
        calories: 380,
        protein: 20,
        carbs: 50,
        fat: 12,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "pasta-primavera",
        name: "Pasta Primavera",
        calories: 320,
        protein: 12,
        carbs: 55,
        fat: 8,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "stir-fry-noodles",
        name: "Stir-Fry Noodles",
        calories: 350,
        protein: 15,
        carbs: 48,
        fat: 12,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "fettuccine-alfredo",
        name: "Fettuccine Alfredo",
        calories: 450,
        protein: 15,
        carbs: 50,
        fat: 22,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "lasagna",
        name: "Lasagna",
        calories: 420,
        protein: 22,
        carbs: 45,
        fat: 18,
        servingSize: "1 piece (250g)",
        imageUrl: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "penne-arrabbiata",
        name: "Penne Arrabbiata",
        calories: 350,
        protein: 12,
        carbs: 60,
        fat: 8,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "soba-noodles",
        name: "Soba Noodles",
        calories: 310,
        protein: 14,
        carbs: 56,
        fat: 5,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1518133683791-0b9de5a055f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "carbonara",
        name: "Carbonara",
        calories: 470,
        protein: 20,
        carbs: 50,
        fat: 22,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "mac-and-cheese-dinner",
        name: "Mac and Cheese",
        calories: 440,
        protein: 18,
        carbs: 48,
        fat: 22,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "pad-thai-dinner",
        name: "Pad Thai",
        calories: 420,
        protein: 18,
        carbs: 55,
        fat: 15,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "pesto-pasta-dinner",
        name: "Pesto Pasta",
        calories: 430,
        protein: 14,
        carbs: 55,
        fat: 18,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "ravioli-dinner",
        name: "Ravioli",
        calories: 400,
        protein: 18,
        carbs: 50,
        fat: 15,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "gnocchi-dinner",
        name: "Gnocchi",
        calories: 380,
        protein: 10,
        carbs: 70,
        fat: 8,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "tortellini-dinner",
        name: "Tortellini",
        calories: 410,
        protein: 18,
        carbs: 50,
        fat: 15,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "lo-mein-dinner",
        name: "Lo Mein",
        calories: 390,
        protein: 15,
        carbs: 60,
        fat: 10,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "udon-dinner",
        name: "Udon Noodles",
        calories: 370,
        protein: 12,
        carbs: 70,
        fat: 3,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "ramen-dinner",
        name: "Ramen",
        calories: 400,
        protein: 15,
        carbs: 60,
        fat: 12,
        servingSize: "1 bowl (350g)",
        imageUrl: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "ziti-dinner",
        name: "Baked Ziti",
        calories: 430,
        protein: 20,
        carbs: 55,
        fat: 15,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "linguine-clam-sauce",
        name: "Linguine with Clam Sauce",
        calories: 410,
        protein: 22,
        carbs: 55,
        fat: 12,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "manicotti",
        name: "Manicotti",
        calories: 420,
        protein: 20,
        carbs: 50,
        fat: 16,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "dinner-one-pot",
    name: "One-Pot Meals",
    mealType: "dinner",
    items: [
      {
        id: "chili",
        name: "Chili Con Carne",
        calories: 320,
        protein: 25,
        carbs: 30,
        fat: 12,
        servingSize: "1 bowl (300g)",
        imageUrl: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "curry",
        name: "Vegetable Curry",
        calories: 280,
        protein: 10,
        carbs: 35,
        fat: 14,
        servingSize: "1 bowl (300g)",
        imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "stew",
        name: "Beef Stew",
        calories: 350,
        protein: 28,
        carbs: 25,
        fat: 15,
        servingSize: "1 bowl (300g)",
        imageUrl: "https://images.unsplash.com/photo-1608500218890-c4f9a2f2f222?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "paella",
        name: "Paella",
        calories: 400,
        protein: 22,
        carbs: 50,
        fat: 12,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "risotto",
        name: "Mushroom Risotto",
        calories: 380,
        protein: 10,
        carbs: 60,
        fat: 10,
        servingSize: "1 bowl (300g)",
        imageUrl: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "jambalaya",
        name: "Jambalaya",
        calories: 410,
        protein: 24,
        carbs: 45,
        fat: 14,
        servingSize: "1 bowl (300g)",
        imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "shepherds-pie",
        name: "Shepherd's Pie",
        calories: 380,
        protein: 22,
        carbs: 40,
        fat: 15,
        servingSize: "1 piece (300g)",
        imageUrl: "https://images.unsplash.com/photo-1605908580297-f3e32c587062?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "chicken-curry",
        name: "Chicken Curry",
        calories: 350,
        protein: 25,
        carbs: 30,
        fat: 15,
        servingSize: "1 bowl (300g)",
        imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "beef-curry",
        name: "Beef Curry",
        calories: 380,
        protein: 28,
        carbs: 30,
        fat: 18,
        servingSize: "1 bowl (300g)",
        imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "vegetable-stew",
        name: "Vegetable Stew",
        calories: 250,
        protein: 8,
        carbs: 40,
        fat: 8,
        servingSize: "1 bowl (300g)",
        imageUrl: "https://images.unsplash.com/photo-1608500218890-c4f9a2f2f222?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "chicken-stew",
        name: "Chicken Stew",
        calories: 320,
        protein: 25,
        carbs: 30,
        fat: 12,
        servingSize: "1 bowl (300g)",
        imageUrl: "https://images.unsplash.com/photo-1608500218890-c4f9a2f2f222?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "seafood-paella",
        name: "Seafood Paella",
        calories: 420,
        protein: 25,
        carbs: 50,
        fat: 14,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "vegetable-paella",
        name: "Vegetable Paella",
        calories: 350,
        protein: 8,
        carbs: 60,
        fat: 10,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "chicken-risotto",
        name: "Chicken Risotto",
        calories: 420,
        protein: 25,
        carbs: 55,
        fat: 12,
        servingSize: "1 bowl (300g)",
        imageUrl: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "seafood-risotto",
        name: "Seafood Risotto",
        calories: 430,
        protein: 22,
        carbs: 55,
        fat: 14,
        servingSize: "1 bowl (300g)",
        imageUrl: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "chicken-jambalaya",
        name: "Chicken Jambalaya",
        calories: 420,
        protein: 28,
        carbs: 45,
        fat: 14,
        servingSize: "1 bowl (300g)",
        imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "seafood-jambalaya",
        name: "Seafood Jambalaya",
        calories: 430,
        protein: 25,
        carbs: 45,
        fat: 16,
        servingSize: "1 bowl (300g)",
        imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "cottage-pie",
        name: "Cottage Pie",
        calories: 380,
        protein: 22,
        carbs: 40,
        fat: 15,
        servingSize: "1 piece (300g)",
        imageUrl: "https://images.unsplash.com/photo-1605908580297-f3e32c587062?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "vegetable-shepherds-pie",
        name: "Vegetable Shepherd's Pie",
        calories: 320,
        protein: 10,
        carbs: 45,
        fat: 12,
        servingSize: "1 piece (300g)",
        imageUrl: "https://images.unsplash.com/photo-1605908580297-f3e32c587062?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "chicken-pot-pie",
        name: "Chicken Pot Pie",
        calories: 410,
        protein: 20,
        carbs: 40,
        fat: 20,
        servingSize: "1 piece (300g)",
        imageUrl: "https://images.unsplash.com/photo-1605908580297-f3e32c587062?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },

  // Snack Categories
  {
    id: "snack-nuts",
    name: "Nuts & Seeds",
    mealType: "snack",
    items: [
      {
        id: "almonds",
        name: "Almonds",
        calories: 160,
        protein: 6,
        carbs: 6,
        fat: 14,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1536816579748-4ecb3f03d72a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "walnuts",
        name: "Walnuts",
        calories: 185,
        protein: 4.3,
        carbs: 3.9,
        fat: 18.5,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1563412885-139e4045ec52?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "trail-mix",
        name: "Trail Mix",
        calories: 200,
        protein: 5,
        carbs: 20,
        fat: 12,
        servingSize: "1/4 cup (40g)",
        imageUrl: "https://images.unsplash.com/photo-1604210565264-8917562a63d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "cashews",
        name: "Cashews",
        calories: 160,
        protein: 5,
        carbs: 9,
        fat: 13,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1583635718087-18e5b4377bd4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "pistachios",
        name: "Pistachios",
        calories: 160,
        protein: 6,
        carbs: 8,
        fat: 13,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1525053875062-42313c4e0bb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "pumpkin-seeds",
        name: "Pumpkin Seeds",
        calories: 151,
        protein: 7,
        carbs: 5,
        fat: 13,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1508747555118-096e3c5a8f0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "chia-seeds",
        name: "Chia Seeds",
        calories: 138,
        protein: 4.7,
        carbs: 12,
        fat: 8.7,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1541889413-3a84dc9c5b99?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "pecans",
        name: "Pecans",
        calories: 196,
        protein: 2.6,
        carbs: 4,
        fat: 20.4,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1563412885-139e4045ec52?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "hazelnuts",
        name: "Hazelnuts",
        calories: 178,
        protein: 4.2,
        carbs: 4.7,
        fat: 17.2,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1536816579748-4ecb3f03d72a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "brazil-nuts",
        name: "Brazil Nuts",
        calories: 186,
        protein: 4.1,
        carbs: 3.3,
        fat: 19,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1536816579748-4ecb3f03d72a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "macadamia-nuts",
        name: "Macadamia Nuts",
        calories: 204,
        protein: 2.2,
        carbs: 3.9,
        fat: 21.5,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1536816579748-4ecb3f03d72a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "pine-nuts",
        name: "Pine Nuts",
        calories: 191,
        protein: 3.9,
        carbs: 3.7,
        fat: 19.1,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1536816579748-4ecb3f03d72a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "sunflower-seeds",
        name: "Sunflower Seeds",
        calories: 165,
        protein: 5.5,
        carbs: 6.5,
        fat: 14,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1508747555118-096e3c5a8f0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "flax-seeds",
        name: "Flax Seeds",
        calories: 150,
        protein: 5.1,
        carbs: 8.2,
        fat: 12,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1541889413-3a84dc9c5b99?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "hemp-seeds",
        name: "Hemp Seeds",
        calories: 166,
        protein: 9.5,
        carbs: 2.6,
        fat: 14.6,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1541889413-3a84dc9c5b99?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "sesame-seeds",
        name: "Sesame Seeds",
        calories: 160,
        protein: 5,
        carbs: 7,
        fat: 14,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1541889413-3a84dc9c5b99?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "peanuts",
        name: "Peanuts",
        calories: 166,
        protein: 7,
        carbs: 6,
        fat: 14,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1583635718087-18e5b4377bd4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "mixed-nuts",
        name: "Mixed Nuts",
        calories: 170,
        protein: 5,
        carbs: 7,
        fat: 15,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1536816579748-4ecb3f03d72a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "chocolate-trail-mix",
        name: "Chocolate Trail Mix",
        calories: 220,
        protein: 5,
        carbs: 25,
        fat: 13,
        servingSize: "1/4 cup (40g)",
        imageUrl: "https://images.unsplash.com/photo-1604210565264-8917562a63d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "tropical-trail-mix",
        name: "Tropical Trail Mix",
        calories: 190,
        protein: 4,
        carbs: 25,
        fat: 10,
        servingSize: "1/4 cup (40g)",
        imageUrl: "https://images.unsplash.com/photo-1604210565264-8917562a63d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "snack-fruits",
    name: "Fruits",
    mealType: "snack",
    items: [
      {
        id: "apple-snack",
        name: "Apple",
        calories: 95,
        protein: 0.5,
        carbs: 25,
        fat: 0.3,
        servingSize: "1 medium (182g)",
        imageUrl: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "banana-snack",
        name: "Banana",
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fat: 0.4,
        servingSize: "1 medium (118g)",
        imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "grapes",
        name: "Grapes",
        calories: 104,
        protein: 1.1,
        carbs: 27.3,
        fat: 0.2,
        servingSize: "1 cup (151g)",
        imageUrl: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "dried-apricots",
        name: "Dried Apricots",
        calories: 80,
        protein: 1,
        carbs: 20,
        fat: 0.1,
        servingSize: "1/4 cup (40g)",
        imageUrl: "https://images.unsplash.com/photo-1583635718087-18e5b4377bd4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "fruit-cup",
        name: "Mixed Fruit Cup",
        calories: 70,
        protein: 1,
        carbs: 18,
        fat: 0,
        servingSize: "1 cup (150g)",
        imageUrl: "https://images.unsplash.com/photo-1490474504059-bf2db5ab2348?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "peach",
        name: "Peach",
        calories: 58,
        protein: 1.4,
        carbs: 14,
        fat: 0.4,
        servingSize: "1 medium (150g)",
        imageUrl: "https://images.unsplash.com/photo-1595743825637-cdafc8ad4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "kiwi",
        name: "Kiwi",
        calories: 42,
        protein: 0.8,
        carbs: 10,
        fat: 0.4,
        servingSize: "1 medium (69g)",
        imageUrl: "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "orange-snack",
        name: "Orange",
        calories: 62,
        protein: 1.2,
        carbs: 15.4,
        fat: 0.2,
        servingSize: "1 medium (131g)",
        imageUrl: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "strawberries-snack",
        name: "Strawberries",
        calories: 49,
        protein: 1,
        carbs: 11.7,
        fat: 0.5,
        servingSize: "1 cup (152g)",
        imageUrl: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "blueberries-snack",
        name: "Blueberries",
        calories: 84,
        protein: 1.1,
        carbs: 21.4,
        fat: 0.5,
        servingSize: "1 cup (148g)",
        imageUrl: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "pineapple-snack",
        name: "Pineapple",
        calories: 82,
        protein: 0.9,
        carbs: 21.6,
        fat: 0.2,
        servingSize: "1 cup chunks (165g)",
        imageUrl: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "mango-snack",
        name: "Mango",
        calories: 99,
        protein: 1.4,
        carbs: 24.7,
        fat: 0.6,
        servingSize: "1 cup sliced (165g)",
        imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "watermelon-snack",
        name: "Watermelon",
        calories: 46,
        protein: 0.9,
        carbs: 11.5,
        fat: 0.2,
        servingSize: "1 cup diced (152g)",
        imageUrl: "https://images.unsplash.com/photo-1563114773-84221bd62daa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "pear-snack",
        name: "Pear",
        calories: 101,
        protein: 0.6,
        carbs: 27,
        fat: 0.2,
        servingSize: "1 medium (178g)",
        imageUrl: "https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "cherries-snack",
        name: "Cherries",
        calories: 87,
        protein: 1.5,
        carbs: 22,
        fat: 0.3,
        servingSize: "1 cup (154g)",
        imageUrl: "https://images.unsplash.com/photo-1528821128474-25c5c5a1df5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "snack-bars",
    name: "Protein & Energy Bars",
    mealType: "snack",
    items: [
      {
        id: "protein-bar",
        name: "Protein Bar",
        calories: 200,
        protein: 20,
        carbs: 20,
        fat: 5,
        servingSize: "1 bar (60g)",
        imageUrl: "https://images.unsplash.com/photo-1622484212850-eb596d769edc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "granola-bar",
        name: "Granola Bar",
        calories: 120,
        protein: 3,
        carbs: 20,
        fat: 4,
        servingSize: "1 bar (30g)",
        imageUrl: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "energy-bar",
        name: "Energy Bar",
        calories: 180,
        protein: 8,
        carbs: 25,
        fat: 6,
        servingSize: "1 bar (50g)",
        imageUrl: "https://images.unsplash.com/photo-1571748982800-fa51082c2224?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "protein-cookie",
        name: "Protein Cookie",
        calories: 240,
        protein: 15,
        carbs: 30,
        fat: 8,
        servingSize: "1 cookie (60g)",
        imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "nut-bar",
        name: "Nut Bar",
        calories: 190,
        protein: 6,
        carbs: 15,
        fat: 12,
        servingSize: "1 bar (40g)",
        imageUrl: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "protein-ball",
        name: "Protein Balls",
        calories: 150,
        protein: 10,
        carbs: 12,
        fat: 8,
        servingSize: "2 balls (40g)",
        imageUrl: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "chocolate-protein-bar",
        name: "Chocolate Protein Bar",
        calories: 210,
        protein: 20,
        carbs: 22,
        fat: 6,
        servingSize: "1 bar (60g)",
        imageUrl: "https://images.unsplash.com/photo-1622484212850-eb596d769edc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "peanut-butter-protein-bar",
        name: "Peanut Butter Protein Bar",
        calories: 220,
        protein: 20,
        carbs: 20,
        fat: 8,
        servingSize: "1 bar (60g)",
        imageUrl: "https://images.unsplash.com/photo-1622484212850-eb596d769edc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "coconut-protein-bar",
        name: "Coconut Protein Bar",
        calories: 200,
        protein: 18,
        carbs: 18,
        fat: 9,
        servingSize: "1 bar (60g)",
        imageUrl: "https://images.unsplash.com/photo-1622484212850-eb596d769edc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "fruit-granola-bar",
        name: "Fruit Granola Bar",
        calories: 130,
        protein: 3,
        carbs: 24,
        fat: 4,
        servingSize: "1 bar (30g)",
        imageUrl: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "nut-granola-bar",
        name: "Nut Granola Bar",
        calories: 140,
        protein: 4,
        carbs: 18,
        fat: 7,
        servingSize: "1 bar (30g)",
        imageUrl: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "chocolate-granola-bar",
        name: "Chocolate Granola Bar",
        calories: 150,
        protein: 3,
        carbs: 22,
        fat: 6,
        servingSize: "1 bar (30g)",
        imageUrl: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "date-energy-bar",
        name: "Date Energy Bar",
        calories: 170,
        protein: 5,
        carbs: 30,
        fat: 5,
        servingSize: "1 bar (50g)",
        imageUrl: "https://images.unsplash.com/photo-1571748982800-fa51082c2224?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "fruit-energy-bar",
        name: "Fruit Energy Bar",
        calories: 160,
        protein: 4,
        carbs: 32,
        fat: 4,
        servingSize: "1 bar (50g)",
        imageUrl: "https://images.unsplash.com/photo-1571748982800-fa51082c2224?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "nut-energy-bar",
        name: "Nut Energy Bar",
        calories: 190,
        protein: 6,
        carbs: 22,
        fat: 10,
        servingSize: "1 bar (50g)",
        imageUrl: "https://images.unsplash.com/photo-1571748982800-fa51082c2224?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "chocolate-protein-cookie",
        name: "Chocolate Protein Cookie",
        calories: 250,
        protein: 15,
        carbs: 32,
        fat: 9,
        servingSize: "1 cookie (60g)",
        imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "peanut-butter-protein-cookie",
        name: "Peanut Butter Protein Cookie",
        calories: 260,
        protein: 15,
        carbs: 28,
        fat: 12,
        servingSize: "1 cookie (60g)",
        imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "oatmeal-protein-cookie",
        name: "Oatmeal Protein Cookie",
        calories: 230,
        protein: 15,
        carbs: 30,
        fat: 7,
        servingSize: "1 cookie (60g)",
        imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "chocolate-protein-balls",
        name: "Chocolate Protein Balls",
        calories: 160,
        protein: 10,
        carbs: 14,
        fat: 8,
        servingSize: "2 balls (40g)",
        imageUrl: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "peanut-butter-protein-balls",
        name: "Peanut Butter Protein Balls",
        calories: 170,
        protein: 10,
        carbs: 12,
        fat: 10,
        servingSize: "2 balls (40g)",
        imageUrl: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "snack-yogurt",
    name: "Yogurt & Dairy",
    mealType: "snack",
    items: [
      {
        id: "greek-yogurt-snack",
        name: "Greek Yogurt",
        calories: 100,
        protein: 17,
        carbs: 6,
        fat: 0.5,
        servingSize: "6 oz (170g)",
        imageUrl: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "string-cheese",
        name: "String Cheese",
        calories: 80,
        protein: 7,
        carbs: 1,
        fat: 6,
        servingSize: "1 stick (28g)",
        imageUrl: "https://images.unsplash.com/photo-1589881133595-a3c085cb731d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "cottage-cheese-snack",
        name: "Cottage Cheese",
        calories: 120,
        protein: 14,
        carbs: 3,
        fat: 5,
        servingSize: "1/2 cup (113g)",
        imageUrl: "https://images.unsplash.com/photo-1559561853-08451507cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "yogurt-drink",
        name: "Yogurt Drink",
        calories: 110,
        protein: 8,
        carbs: 15,
        fat: 2.5,
        servingSize: "1 bottle (200ml)",
        imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "cheese-cubes",
        name: "Cheese Cubes",
        calories: 110,
        protein: 7,
        carbs: 1,
        fat: 9,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1589881133595-a3c085cb731d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "pudding-cup",
        name: "Pudding Cup",
        calories: 160,
        protein: 2,
        carbs: 30,
        fat: 3,
        servingSize: "1 cup (120g)",
        imageUrl: "https://images.unsplash.com/photo-1514995428455-447d4443fa7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "vanilla-greek-yogurt",
        name: "Vanilla Greek Yogurt",
        calories: 120,
        protein: 15,
        carbs: 12,
        fat: 0.5,
        servingSize: "6 oz (170g)",
        imageUrl: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "strawberry-greek-yogurt",
        name: "Strawberry Greek Yogurt",
        calories: 130,
        protein: 14,
        carbs: 15,
        fat: 0.5,
        servingSize: "6 oz (170g)",
        imageUrl: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "blueberry-greek-yogurt",
        name: "Blueberry Greek Yogurt",
        calories: 130,
        protein: 14,
        carbs: 15,
        fat: 0.5,
        servingSize: "6 oz (170g)",
        imageUrl: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "honey-greek-yogurt",
        name: "Honey Greek Yogurt",
        calories: 140,
        protein: 14,
        carbs: 18,
        fat: 0.5,
        servingSize: "6 oz (170g)",
        imageUrl: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "cheddar-cheese",
        name: "Cheddar Cheese",
        calories: 110,
        protein: 7,
        carbs: 0.5,
        fat: 9,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1589881133595-a3c085cb731d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "mozzarella-cheese",
        name: "Mozzarella Cheese",
        calories: 90,
        protein: 6.5,
        carbs: 0.5,
        fat: 7,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1589881133595-a3c085cb731d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "swiss-cheese",
        name: "Swiss Cheese",
        calories: 110,
        protein: 8,
        carbs: 0.5,
        fat: 8,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1589881133595-a3c085cb731d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "fruit-yogurt-parfait",
        name: "Fruit Yogurt Parfait",
        calories: 220,
        protein: 10,
        carbs: 35,
        fat: 5,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "granola-yogurt-parfait",
        name: "Granola Yogurt Parfait",
        calories: 250,
        protein: 12,
        carbs: 35,
        fat: 8,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "chocolate-pudding",
        name: "Chocolate Pudding",
        calories: 170,
        protein: 2,
        carbs: 32,
        fat: 4,
        servingSize: "1 cup (120g)",
        imageUrl: "https://images.unsplash.com/photo-1514995428455-447d4443fa7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "vanilla-pudding",
        name: "Vanilla Pudding",
        calories: 160,
        protein: 2,
        carbs: 30,
        fat: 3,
        servingSize: "1 cup (120g)",
        imageUrl: "https://images.unsplash.com/photo-1514995428455-447d4443fa7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "rice-pudding",
        name: "Rice Pudding",
        calories: 180,
        protein: 3,
        carbs: 35,
        fat: 3,
        servingSize: "1 cup (120g)",
        imageUrl: "https://images.unsplash.com/photo-1514995428455-447d4443fa7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "tapioca-pudding",
        name: "Tapioca Pudding",
        calories: 170,
        protein: 2,
        carbs: 32,
        fat: 4,
        servingSize: "1 cup (120g)",
        imageUrl: "https://images.unsplash.com/photo-1514995428455-447d4443fa7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "chocolate-milk",
        name: "Chocolate Milk",
        calories: 150,
        protein: 8,
        carbs: 25,
        fat: 2.5,
        servingSize: "1 cup (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "snack-vegetables",
    name: "Vegetables & Dips",
    mealType: "snack",
    items: [
      {
        id: "hummus-carrots",
        name: "Hummus with Carrots",
        calories: 150,
        protein: 5,
        carbs: 15,
        fat: 8,
        servingSize: "1/4 cup hummus with 1 cup carrots",
        imageUrl: "https://images.unsplash.com/photo-1564894809611-1742fc40ed80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "guacamole",
        name: "Guacamole with Veggie Sticks",
        calories: 180,
        protein: 3,
        carbs: 12,
        fat: 15,
        servingSize: "1/4 cup guacamole with vegetables",
        imageUrl: "https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "edamame",
        name: "Edamame",
        calories: 120,
        protein: 11,
        carbs: 10,
        fat: 5,
        servingSize: "1 cup (155g)",
        imageUrl: "https://images.unsplash.com/photo-1564894809611-1742fc40ed80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "celery-peanut-butter",
        name: "Celery with Peanut Butter",
        calories: 190,
        protein: 7,
        carbs: 8,
        fat: 16,
        servingSize: "3 stalks with 2 tbsp peanut butter",
        imageUrl: "https://images.unsplash.com/photo-1571050034347-2a6a4944a8bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "cucumber-tzatziki",
        name: "Cucumber with Tzatziki",
        calories: 120,
        protein: 4,
        carbs: 8,
        fat: 8,
        servingSize: "1 cup cucumber with 1/4 cup tzatziki",
        imageUrl: "https://images.unsplash.com/photo-1584742061792-483643527f1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "bell-peppers-dip",
        name: "Bell Peppers with Ranch",
        calories: 130,
        protein: 2,
        carbs: 10,
        fat: 10,
        servingSize: "1 cup peppers with 2 tbsp ranch",
        imageUrl: "https://images.unsplash.com/photo-1513442542250-854d436a73f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "kale-chips",
        name: "Kale Chips",
        calories: 110,
        protein: 3,
        carbs: 12,
        fat: 7,
        servingSize: "1 cup (30g)",
        imageUrl: "https://images.unsplash.com/photo-1527324688151-0e627063f2b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "hummus-cucumber",
        name: "Hummus with Cucumber",
        calories: 140,
        protein: 5,
        carbs: 12,
        fat: 8,
        servingSize: "1/4 cup hummus with 1 cup cucumber",
        imageUrl: "https://images.unsplash.com/photo-1564894809611-1742fc40ed80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "hummus-bell-peppers",
        name: "Hummus with Bell Peppers",
        calories: 150,
        protein: 5,
        carbs: 15,
        fat: 8,
        servingSize: "1/4 cup hummus with 1 cup bell peppers",
        imageUrl: "https://images.unsplash.com/photo-1564894809611-1742fc40ed80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "hummus-broccoli",
        name: "Hummus with Broccoli",
        calories: 160,
        protein: 7,
        carbs: 15,
        fat: 8,
        servingSize: "1/4 cup hummus with 1 cup broccoli",
        imageUrl: "https://images.unsplash.com/photo-1564894809611-1742fc40ed80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "guacamole-carrots",
        name: "Guacamole with Carrots",
        calories: 170,
        protein: 3,
        carbs: 15,
        fat: 14,
        servingSize: "1/4 cup guacamole with 1 cup carrots",
        imageUrl: "https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "guacamole-bell-peppers",
        name: "Guacamole with Bell Peppers",
        calories: 170,
        protein: 3,
        carbs: 12,
        fat: 14,
        servingSize: "1/4 cup guacamole with 1 cup bell peppers",
        imageUrl: "https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "guacamole-cucumber",
        name: "Guacamole with Cucumber",
        calories: 160,
        protein: 3,
        carbs: 10,
        fat: 14,
        servingSize: "1/4 cup guacamole with 1 cup cucumber",
        imageUrl: "https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "celery-almond-butter",
        name: "Celery with Almond Butter",
        calories: 180,
        protein: 6,
        carbs: 8,
        fat: 15,
        servingSize: "3 stalks with 2 tbsp almond butter",
        imageUrl: "https://images.unsplash.com/photo-1571050034347-2a6a4944a8bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "apple-almond-butter",
        name: "Apple with Almond Butter",
        calories: 220,
        protein: 6,
        carbs: 30,
        fat: 12,
        servingSize: "1 apple with 2 tbsp almond butter",
        imageUrl: "https://images.unsplash.com/photo-1571050034347-2a6a4944a8bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "cucumber-hummus-dip",
        name: "Cucumber with Hummus",
        calories: 140,
        protein: 5,
        carbs: 12,
        fat: 8,
        servingSize: "1 cup cucumber with 1/4 cup hummus",
        imageUrl: "https://images.unsplash.com/photo-1584742061792-483643527f1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "carrots-ranch",
        name: "Carrots with Ranch",
        calories: 140,
        protein: 2,
        carbs: 15,
        fat: 10,
        servingSize: "1 cup carrots with 2 tbsp ranch",
        imageUrl: "https://images.unsplash.com/photo-1513442542250-854d436a73f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "broccoli-ranch",
        name: "Broccoli with Ranch",
        calories: 130,
        protein: 4,
        carbs: 10,
        fat: 10,
        servingSize: "1 cup broccoli with 2 tbsp ranch",
        imageUrl: "https://images.unsplash.com/photo-1513442542250-854d436a73f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "cauliflower-ranch",
        name: "Cauliflower with Ranch",
        calories: 130,
        protein: 3,
        carbs: 10,
        fat: 10,
        servingSize: "1 cup cauliflower with 2 tbsp ranch",
        imageUrl: "https://images.unsplash.com/photo-1513442542250-854d436a73f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "zucchini-chips",
        name: "Zucchini Chips",
        calories: 100,
        protein: 2,
        carbs: 10,
        fat: 6,
        servingSize: "1 cup (30g)",
        imageUrl: "https://images.unsplash.com/photo-1527324688151-0e627063f2b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "snack-chips",
    name: "Chips & Crackers",
    mealType: "snack",
    items: [
      {
        id: "popcorn",
        name: "Air-popped Popcorn",
        calories: 120,
        protein: 4,
        carbs: 24,
        fat: 2,
        servingSize: "3 cups (24g)",
        imageUrl: "https://images.unsplash.com/photo-1578849278619-e73a158e76c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "rice-cakes",
        name: "Rice Cakes",
        calories: 70,
        protein: 1,
        carbs: 15,
        fat: 0.5,
        servingSize: "2 cakes (18g)",
        imageUrl: "https://images.unsplash.com/photo-1559561853-08451507cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "tortilla-chips-salsa",
        name: "Tortilla Chips with Salsa",
        calories: 180,
        protein: 3,
        carbs: 25,
        fat: 8,
        servingSize: "1 oz chips with 1/4 cup salsa",
        imageUrl: "https://images.unsplash.com/photo-1513262599279-d287e25f4d84?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "whole-grain-crackers",
        name: "Whole Grain Crackers",
        calories: 130,
        protein: 3,
        carbs: 22,
        fat: 4,
        servingSize: "7 crackers (30g)",
        imageUrl: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "veggie-chips",
        name: "Veggie Chips",
        calories: 140,
        protein: 2,
        carbs: 16,
        fat: 8,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "pretzels",
        name: "Pretzels",
        calories: 110,
        protein: 3,
        carbs: 23,
        fat: 1,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1595856619767-ab739fa7daae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "butter-popcorn",
        name: "Butter Popcorn",
        calories: 160,
        protein: 3,
        carbs: 20,
        fat: 8,
        servingSize: "3 cups (24g)",
        imageUrl: "https://images.unsplash.com/photo-1578849278619-e73a158e76c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "caramel-popcorn",
        name: "Caramel Popcorn",
        calories: 180,
        protein: 2,
        carbs: 35,
        fat: 5,
        servingSize: "3 cups (24g)",
        imageUrl: "https://images.unsplash.com/photo-1578849278619-e73a158e76c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "cheese-popcorn",
        name: "Cheese Popcorn",
        calories: 170,
        protein: 4,
        carbs: 20,
        fat: 9,
        servingSize: "3 cups (24g)",
        imageUrl: "https://images.unsplash.com/photo-1578849278619-e73a158e76c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "plain-rice-cakes",
        name: "Plain Rice Cakes",
        calories: 70,
        protein: 1,
        carbs: 15,
        fat: 0.5,
        servingSize: "2 cakes (18g)",
        imageUrl: "https://images.unsplash.com/photo-1559561853-08451507cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "chocolate-rice-cakes",
        name: "Chocolate Rice Cakes",
        calories: 90,
        protein: 1,
        carbs: 18,
        fat: 2,
        servingSize: "2 cakes (18g)",
        imageUrl: "https://images.unsplash.com/photo-1559561853-08451507cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "caramel-rice-cakes",
        name: "Caramel Rice Cakes",
        calories: 90,
        protein: 1,
        carbs: 19,
        fat: 1,
        servingSize: "2 cakes (18g)",
        imageUrl: "https://images.unsplash.com/photo-1559561853-08451507cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "tortilla-chips",
        name: "Tortilla Chips",
        calories: 140,
        protein: 2,
        carbs: 19,
        fat: 7,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1513262599279-d287e25f4d84?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "salsa",
        name: "Salsa",
        calories: 40,
        protein: 1,
        carbs: 8,
        fat: 0,
        servingSize: "1/4 cup (60g)",
        imageUrl: "https://images.unsplash.com/photo-1513262599279-d287e25f4d84?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "tortilla-chips-guacamole",
        name: "Tortilla Chips with Guacamole",
        calories: 220,
        protein: 3,
        carbs: 20,
        fat: 15,
        servingSize: "1 oz chips with 1/4 cup guacamole",
        imageUrl: "https://images.unsplash.com/photo-1513262599279-d287e25f4d84?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "wheat-crackers",
        name: "Wheat Crackers",
        calories: 120,
        protein: 3,
        carbs: 20,
        fat: 4,
        servingSize: "7 crackers (30g)",
        imageUrl: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "cheese-crackers",
        name: "Cheese Crackers",
        calories: 150,
        protein: 3,
        carbs: 18,
        fat: 8,
        servingSize: "7 crackers (30g)",
        imageUrl: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "rice-crackers",
        name: "Rice Crackers",
        calories: 110,
        protein: 2,
        carbs: 22,
        fat: 2,
        servingSize: "7 crackers (30g)",
        imageUrl: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "sweet-potato-chips",
        name: "Sweet Potato Chips",
        calories: 150,
        protein: 2,
        carbs: 18,
        fat: 9,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "beet-chips",
        name: "Beet Chips",
        calories: 130,
        protein: 2,
        carbs: 16,
        fat: 7,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  }
];

// Helper function to get food categories by meal type
export function getFoodCategoriesByMealType(mealType: string): FoodCategory[] {
  return foodCategories.filter(category => category.mealType === mealType);
}

// Helper function to get a specific food item
export function getFoodItemById(itemId: string): any {
  for (const category of foodCategories) {
    const item = category.items.find(item => item.id === itemId);
    if (item) {
      return item;
    }
  }
  return null;
}