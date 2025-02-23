import { db } from "@/config/FirebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { UserResource } from "@clerk/types";

const cache = new Map<string, { favorites: string[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000;

const GetFavList = async (
  user: UserResource | null | undefined
): Promise<{ email: string; favorites: string[] } | undefined> => {
  if (!user?.primaryEmailAddress?.emailAddress) return undefined;

  const emailAddress = user.primaryEmailAddress.emailAddress;

  const cached = cache.get(emailAddress);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return { email: emailAddress, favorites: cached.favorites };
  }

  try {
    const docSnap = await getDoc(doc(db, "UserFavPet", emailAddress));
    let data;

    if (docSnap.exists()) {
      data = docSnap.data() as { email: string; favorites: string[] };
    } else {
      data = { email: emailAddress, favorites: [] };
      await setDoc(doc(db, "UserFavPet", emailAddress), data);
    }

    cache.set(emailAddress, {
      favorites: data.favorites,
      timestamp: Date.now(),
    });

    return data;
  } catch (error) {
    console.error("Error fetching favorite list:", error);
    return undefined;
  }
};

const UpdateFav = async (
  user: UserResource | null | undefined,
  favorites: string[]
): Promise<void> => {
  if (!user?.primaryEmailAddress?.emailAddress) return;

  const emailAddress = user.primaryEmailAddress.emailAddress;

  try {
    await updateDoc(doc(db, "UserFavPet", emailAddress), {
      favorites: favorites,
    });

    cache.set(emailAddress, {
      favorites,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Error updating favorites:", error);
  }
};

export default {
  GetFavList,
  UpdateFav,
};
