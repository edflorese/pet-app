// components/MarkFav.tsx
import { View, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Shared from "@/Shared/Shared";
import { useUser } from "@clerk/clerk-expo";
import { PetItem } from "@/models/Pets";

interface MarkFavProps {
  pet: PetItem;
  color?: string;
  onFavoriteChange?: (petId: string, isFavorite: boolean) => void;
}

export default function MarkFav({ 
  pet, 
  color = "black",
  onFavoriteChange 
}: MarkFavProps) {
  const { user } = useUser();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    user && initializeFavState();
  }, [user]);

  const initializeFavState = async () => {
    const result = await Shared.GetFavList(user);
    setIsFavorite(result?.favorites?.includes(pet.id) ?? false);
  };

  const toggleFavorite = async () => {
    if (!user || isUpdating) return;

    setIsUpdating(true);
    const newFavoriteState = !isFavorite;
    
    setIsFavorite(newFavoriteState);
    onFavoriteChange?.(pet.id, newFavoriteState);

    try {
      const result = await Shared.GetFavList(user);
      const currentFavs = result?.favorites || [];
      
      const newFavs = newFavoriteState
        ? [...currentFavs, pet.id]
        : currentFavs.filter(id => id !== pet.id);

      await Shared.UpdateFav(user, newFavs);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setIsFavorite(!newFavoriteState);
      onFavoriteChange?.(pet.id, !newFavoriteState);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View>
      <Pressable 
        onPress={toggleFavorite}
        disabled={isUpdating}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={30}
          color={isFavorite ? "red" : color}
        />
      </Pressable>
    </View>
  );
}