'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { recipeApi } from '@/lib/api/recipes';
import { ProcessedRecipe } from '@/lib/types/recipe';
import Link from 'next/link';

export default function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const { data: recipesData, isLoading: isLoadingDef } = useQuery({
    queryKey: ['recipes', 'all'],
    queryFn: () => recipeApi.getAllRecipes(),
    staleTime: 5 * 60 * 1000, 
  });

  const { data: searchResults, isLoading: isLoadingSearch } = useQuery({
    queryKey: ['recipes', 'search', searchQuery],
    queryFn: () => recipeApi.searchByName(searchQuery),
    enabled: isSearching && searchQuery.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  const displayedRecipes = isSearching ? searchResults : recipesData;
  const isLoading = isSearching ? isLoadingSearch : isLoadingDef;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Recipe Collection</h1>
        <Link href="/">
          <Button variant="outline">Back to Tasks</Button>
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Recipes</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes by name..."
              className="flex-1 p-2 border border-gray-300 rounded-md"
            />
            <Button type="submit" disabled={!searchQuery.trim()}>
              Search
            </Button>
            {isSearching && (
              <Button type="button" variant="outline" onClick={handleClearSearch}>
                Clear
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-lg">Loading recipes...</div>
        </div>
      ) : (
        <RecipeTable recipes={displayedRecipes || []} />
      )}
    </div>
  );
}

interface RecipeTableProps {
  recipes: ProcessedRecipe[];
}

function RecipeTable({ recipes }: RecipeTableProps) {
  if (recipes.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-lg text-gray-500">No recipes found</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recipes ({recipes.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-semibold">Image</th>
                <th className="text-left p-4 font-semibold">Name</th>
                <th className="text-left p-4 font-semibold">Category</th>
                <th className="text-left p-4 font-semibold">Ingredients</th>
                <th className="text-left p-4 font-semibold">Instructions</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe) => (
                <tr key={recipe.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </td>
                  <td className="p-4 font-medium">{recipe.name}</td>
                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {recipe.category}
                    </span>
                  </td>
                  <td className="p-4 max-w-xs">
                    <div className="max-h-24 overflow-y-auto">
                      <ul className="text-sm space-y-1">
                        {recipe.ingredients.map((ingredient, index) => (
                          <li key={index} className="text-gray-600">
                            - {ingredient}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </td>
                  <td className="p-4 max-w-md">
                    <div className="max-h-24 overflow-y-auto">
                      <p className="text-sm text-gray-600">
                        {recipe.instructions}
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
} 