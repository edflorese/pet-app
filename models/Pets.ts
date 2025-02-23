import { ImageSourcePropType } from "react-native";

export interface User {
  email: string;
  imageUrl: string;
  name: string;
}

export interface PetItem {
  id: string;
  about: string;
  address: string;
  age: string;
  breed: string;
  category: string;
  imageUrl: string;
  name: string;
  sex: string;
  weight: string;
  user: User;
}

export interface PetListItemProps {
  pet: PetItem;
  onFavoriteChange?: (petId: string, isFavorite: boolean) => void;
}

export interface PetSubInfoCardProps {
  icon: ImageSourcePropType;
  title: string;
  value: string;
}

export interface PetFormData {
  name: string;
  breed: string;
  age: string;
  sex: "Male" | "Female";
  weight: string;
  address: string;
  about: string;
  category: string;
}

export interface PetFormProps {
  onSubmit: (data: PetFormData) => void;
}

export interface Category {
  name: string;
  id: string;
}
