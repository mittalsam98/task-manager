import { RecipeResponse, Recipe, ProcessedRecipe } from '../types/recipe';

const API_BASE = 'https://www.themealdb.com/api/json/v1/1';

export const recipeApi = {
  searchByName: async (query: string): Promise<ProcessedRecipe[]> => {
    const response = await fetch(`${API_BASE}/search.php?s=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to fetch');
    const data: RecipeResponse = await response.json();
    return formatRecipes(data.meals || []);
  },

  getRecipesByLetter: async (letter: string): Promise<ProcessedRecipe[]> => {
    const response = await fetch(`${API_BASE}/search.php?f=${letter}`);
    if (!response.ok) throw new Error('Failed to fetch');
    const data: RecipeResponse = await response.json();
    return formatRecipes(data.meals || []);
  },

  getAllRecipes: async (): Promise<ProcessedRecipe[]> => {
    const letters = ['a', 'b', 'c', 'd', 'e'];
    const promises = letters.map(letter => recipeApi.getRecipesByLetter(letter));
    const results = await Promise.all(promises);
    return results.flat().slice(0, 50);
  },
};


function getMapIngredients(recipe: Recipe): string[] {
  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}` as keyof Recipe] as string;
    const measure = recipe[`strMeasure${i}` as keyof Recipe] as string;
    if (ingredient && ingredient.trim()) {
      const fullIngredient = measure && measure.trim() 
        ? `${measure.trim()} ${ingredient.trim()}`
        : ingredient.trim();
      ingredients.push(fullIngredient);
    }
  }
  return ingredients;
} 


function formatRecipes(recipes: Recipe[]): ProcessedRecipe[] {
    return recipes.map(recipe => ({
      id: recipe.idMeal,
      name: recipe.strMeal,
      category: recipe.strCategory,
      area: recipe.strArea,
      instructions: recipe.strInstructions,
      image: recipe.strMealThumb,
      ingredients: getMapIngredients(recipe),
    }));
  }