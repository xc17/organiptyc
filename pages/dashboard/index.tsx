import EmailUnverified from "@/components/EmailUnverified";
import { auth, db, storage } from "@/firebase";
import { redirect, redirectNoUser, useEmailVerified } from "@/functions";
import { deleteUser, onAuthStateChanged } from "firebase/auth";
import { collection, deleteDoc, doc, getDoc } from "firebase/firestore";
import { ref, listAll, deleteObject } from "firebase/storage";
import Router from "next/router";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>();
    const [userFile, setUserFile] = useState<any>();
    const isEmailVerified = useEmailVerified();

    useEffect(() => {
        // check if user is already logged in
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const profileCollectionRef = collection(db, "profile");
                const profileDocRef = doc(profileCollectionRef, user.uid);
                const profileSnap = await getDoc(profileDocRef);

                // set local data
                if (profileSnap.exists()) setUserData(profileSnap.data());

                const storageRef = ref(storage, `profile/${user.uid}/artasc`);
                const storageRes = await listAll(storageRef);
                const storageFiles = storageRes.items.map((item) => item.name);

                setUserFile(storageFiles);

                setLoading(false);
            } else {
                redirect("/signin");
            }
        });

        return unsubscribe;
    }, []);

    if (!loading && !isEmailVerified) {
        return <EmailUnverified />;
    }

    return (
        <>
            {loading ? (
                "LOADING..."
            ) : (
                <div>
                    <div>{userData?.organizationName}</div>
                    {userFile.map((item: string, i: number) => (
                        <div key={i}>{item}</div>
                    ))}
                </div>
            )}
        </>
    );
}
