import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

export function useGetUser() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            return user;
        }
    });
}
