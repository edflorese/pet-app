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
}

export interface PetListItemProps {
  pet: PetItem;
}

export interface PetSubInfoCardProps {
  icon: ImageSourcePropType;
  title: string;
  value: string;
}
