import React from "react";

export function useFavoriteMedications() {
  const [favorites, setFavorites] = React.useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('favoriteMedications');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const toggleFavorite = React.useCallback((medicationId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(medicationId)
        ? prev.filter((id) => id !== medicationId)
        : [...prev, medicationId];
      
      localStorage.setItem('favoriteMedications', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  return { favorites, toggleFavorite };
} 