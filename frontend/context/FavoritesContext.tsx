'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => Promise<boolean>;
  removeFromFavorites: (productId: number) => Promise<boolean>;
  isFavorite: (productId: number) => boolean;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) {
        setFavorites([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';
        const response = await fetch(`${baseApiUrl}/favorites/`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setFavorites(data);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [isAuthenticated, user]);

  const addToFavorites = async (product: Product): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';
      const response = await fetch(`${baseApiUrl}/favorites/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: product.id }),
        credentials: 'include',
      });

      if (response.ok) {
        setFavorites((prev) => [...prev, product]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  };

  const removeFromFavorites = async (productId: number): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';
      const response = await fetch(`${baseApiUrl}/favorites/${productId}/`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setFavorites((prev) => prev.filter((product) => product.id !== productId));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  };

  const isFavorite = (productId: number): boolean => {
    return favorites.some((product) => product.id === productId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        isLoading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
