export interface Ingredient {
  name: string;
  qty: string;
  category: string;
}

export interface Meal {
  id: string;
  user_id: string | null;
  created_at: string;
  title: string;
  description: string | null;
  mood_tags: string[];
  ingredients: Ingredient[];
  instructions: string | null;
  image_url: string | null;
  prep_minutes: number | null;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  why_it_fits: string | null;
  why_it_fits_source: string | null;
  why_it_fits_confidence: number | null;
  why_it_fits_review_status: string | null;
  tier: "free" | "pro";
}

export interface MoodCheckin {
  id: string;
  user_id: string | null;
  created_at: string;
  mood_label: string;
  mood_score: number | null;
  free_text: string | null;
  suggested_meal_id: string | null;
  ai_mood_interpretation: string | null;
  ai_mood_interpretation_source: string | null;
  ai_mood_interpretation_confidence: number | null;
  ai_mood_interpretation_review_status: string | null;
}

export interface ShoppingList {
  id: string;
  user_id: string | null;
  created_at: string;
  checkin_id: string | null;
  week_label: string | null;
  status: string;
}

export interface ShoppingListItem {
  id: string;
  user_id: string | null;
  created_at: string;
  shopping_list_id: string;
  ingredient_name: string;
  quantity: string | null;
  category: string | null;
  checked: boolean;
}
