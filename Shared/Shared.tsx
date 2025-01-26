import { db } from "@/config/FirebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { UserResource } from "@clerk/types";

const GetFavList = async (
  user: UserResource | null | undefined
): Promise<{ email: string; favorites: string[] } | undefined> => {
  if (!user) {
    console.error("User is null or undefined.");
    return undefined;
  }

  const emailAddress = user.primaryEmailAddress?.emailAddress;
  if (!emailAddress) {
    console.error("User does not have a primary email address.");
    return undefined;
  }

  try {
    const docSnap = await getDoc(doc(db, "UserFavPet", emailAddress));
    if (docSnap.exists()) {
      return docSnap.data() as { email: string; favorites: string[] };
    } else {
      await setDoc(doc(db, "UserFavPet", emailAddress), {
        email: emailAddress,
        favorites: [],
      });
      return { email: emailAddress, favorites: [] };
    }
  } catch (error) {
    console.error("Error fetching favorite list:", error);
    return undefined;
  }
};

const UpdateFav = async (
  user: UserResource | null | undefined,
  favorites: string[]
): Promise<void> => {
  if (!user) {
    console.error("User is null or undefined.");
    return;
  }

  const emailAddress = user.primaryEmailAddress?.emailAddress;
  if (!emailAddress) {
    console.error("User does not have a primary email address.");
    return;
  }

  const docRef = doc(db, "UserFavPet", emailAddress);
  try {
    await updateDoc(docRef, {
      favorites: favorites,
    });
  } catch (error) {
    console.error("Error updating favorites:", error);
  }
};

export default {
  GetFavList,
  UpdateFav,
};
